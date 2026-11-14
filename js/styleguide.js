// Styleguide page: reads live token values from model3.css, the surface
// switch, motion filters and replayable motion demos.
(() => {
  const root = document.documentElement;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const css = () => getComputedStyle(root);
  const clamp01 = (v) => Math.min(1, Math.max(0, v));

  /* Live token values ------------------------------------------------------ */
  const probe = document.createElement("div");
  probe.style.cssText = "position:absolute;visibility:hidden;pointer-events:none";
  document.body.append(probe);

  const fillTokens = () => {
    const s = css();
    document.querySelectorAll("[data-token]").forEach((el) => {
      el.textContent = s.getPropertyValue(el.dataset.token).trim() || "—";
    });
    // rem tokens converted to px at the current viewport
    document.querySelectorAll("[data-px]").forEach((el) => {
      probe.style.width = `var(${el.dataset.px})`;
      el.textContent = `${Math.round(parseFloat(getComputedStyle(probe).width) * 10) / 10}px`;
    });
    const rem = parseFloat(getComputedStyle(root).fontSize);
    document.querySelectorAll("[data-rem]").forEach((el) => {
      el.textContent = `${Math.round(rem * 100) / 100}px`;
    });
    document.querySelectorAll("[data-vw]").forEach((el) => {
      el.textContent = `${innerWidth}px`;
    });
    fillContrast();
  };

  /* Contrast (WCAG 2) ---------------------------------------------------- */
  const toRgb = (value) => {
    const c = document.createElement("canvas").getContext("2d");
    c.fillStyle = "#000";
    c.fillStyle = value;
    const hex = c.fillStyle;
    if (hex.startsWith("#")) return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
    return hex.match(/[\d.]+/g).slice(0, 3).map(Number);
  };

  const luminance = (rgb) => {
    const [r, g, b] = rgb.map((v) => {
      const c = v / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  function fillContrast() {
    const s = css();
    document.querySelectorAll("[data-contrast]").forEach((row) => {
      const [fg, bg] = row.dataset.contrast.split(",");
      const a = luminance(toRgb(s.getPropertyValue(fg).trim()));
      const b = luminance(toRgb(s.getPropertyValue(bg).trim()));
      const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
      const out = row.querySelector("[data-ratio]");
      const verdict = row.querySelector("[data-verdict]");
      out.textContent = `${ratio.toFixed(2)}:1`;
      const level = ratio >= 7 ? "AAA" : ratio >= 4.5 ? "AA" : ratio >= 3 ? "AA том текст" : "Текстэд тохирохгүй";
      verdict.textContent = level;
      verdict.className = ratio >= 3 ? "sg-pass" : "sg-fail";
    });
  }

  fillTokens();
  addEventListener("resize", fillTokens);
  if (document.fonts) document.fonts.ready.then(fillTokens);

  /* Surface switch --------------------------------------------------------- */
  const switchButtons = document.querySelectorAll("[data-surface-set]");
  switchButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const dark = btn.dataset.surfaceSet === "dark";
      switchButtons.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
      document.querySelectorAll("[data-sg-surface]").forEach((el) => {
        el.classList.toggle("surface-dark", dark);
        el.classList.toggle("surface-light", !dark);
      });
    });
  });

  /* Motion catalog filters -------------------------------------------------- */
  const filters = { kind: "all", trigger: "all" };
  document.querySelectorAll("[data-filter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const group = btn.dataset.filter;
      filters[group] = btn.dataset.value;
      document.querySelectorAll(`[data-filter="${group}"]`).forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
      let shown = 0;
      document.querySelectorAll(".sg-motion-row").forEach((row) => {
        const ok = (filters.kind === "all" || row.dataset.kind === filters.kind) &&
          (filters.trigger === "all" || row.dataset.trigger === filters.trigger);
        row.hidden = !ok;
        if (ok) shown++;
      });
      const count = document.querySelector("[data-motion-count]");
      if (count) count.textContent = shown;
    });
  });

  /* Spring: same integrator and constants as model3-motion.js --------------- */
  const CFG = {
    REVEAL: [90, 26], ROW: [170, 24], ITEM: [170, 24], FIGURE: [200, 24],
    TYPE: [210, 24], COPY: [110, 26],
  };

  function spring([k, c], onUpdate, delay = 0) {
    let x = 0, v = 0, waited = 0, last = 0, raf = 0;
    const step = (t) => {
      let dt = Math.min(last ? t - last : 16, 64);
      last = t;
      if (waited < delay) {
        waited += dt;
        if (waited < delay) { raf = requestAnimationFrame(step); return; }
        dt = waited - delay;
      }
      for (let i = 0; i < Math.round(dt); i++) {
        v += (-k * (x - 1) - c * v) * 0.001;
        x += v * 0.001;
      }
      if (Math.abs(v) < 0.0005 && Math.abs(x - 1) < 0.0005) { onUpdate(1); return; }
      onUpdate(x);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }

  const split = (el, mode) => {
    if (el.dataset.sgSplit) return [...el.querySelectorAll(".sp")];
    el.dataset.sgSplit = "1";
    const text = el.textContent.trim();
    el.setAttribute("aria-label", text);
    const tokens = mode === "chars" ? Array.from(text) : text.split(/(\s+)/);
    el.replaceChildren(...tokens.map((tok) => {
      if (/^\s+$/.test(tok)) return document.createTextNode(tok);
      const s = document.createElement("span");
      s.className = "sp";
      s.setAttribute("aria-hidden", "true");
      s.textContent = tok;
      return s;
    }));
    return [...el.querySelectorAll(".sp")];
  };

  const running = new WeakMap();

  function playDemo(card) {
    const target = card.querySelector("[data-demo-target]");
    const type = card.dataset.demo;
    (running.get(card) || []).forEach((stop) => stop());
    const stops = [];
    running.set(card, stops);

    const move = (el, p, unit, dist) => {
      el.style.opacity = String(clamp01(p));
      el.style.transform = p >= 1 ? "" : `translateY(${((1 - p) * dist).toFixed(4)}${unit})`;
    };

    if (type === "words" || type === "chars") {
      const pieces = split(target, type);
      const off = type === "chars" ? 0.3 : 0.35;
      const stagger = type === "chars" ? 24 : 110;
      const cfg = type === "chars" ? CFG.FIGURE : CFG.TYPE;
      const isH2 = target.classList.contains("h2");
      pieces.forEach((s) => move(s, 0, "em", off));
      if (isH2) target.style.setProperty("--bar", "0");
      if (reduced) {
        pieces.forEach((s) => move(s, 1, "em", off));
        if (isH2) target.style.setProperty("--bar", "1");
        return;
      }
      pieces.forEach((s, i) => stops.push(spring(cfg, (p) => move(s, p, "em", off), i * stagger)));
      if (isH2) stops.push(spring(CFG.REVEAL, (p) => target.style.setProperty("--bar", clamp01(p).toFixed(4)), pieces.length * stagger));
      return;
    }

    if (type === "duration") {
      const ms = Number(card.dataset.ms);
      const ease = card.dataset.ease;
      target.style.transition = "none";
      target.style.transform = "scaleX(0)";
      target.getBoundingClientRect();
      if (reduced) { target.style.transform = ""; return; }
      target.style.transition = `transform ${ms}ms ${ease}`;
      target.style.transform = "scaleX(1)";
      return;
    }

    const kinds = { block: [CFG.REVEAL, 0.75], copy: [CFG.COPY, 0.75], item: [CFG.ITEM, 1], figure: [CFG.FIGURE, 1.25] };
    const [cfg, dist] = kinds[type] || kinds.block;
    move(target, 0, "rem", dist);
    if (reduced) { move(target, 1, "rem", dist); return; }
    stops.push(spring(cfg, (p) => move(target, p, "rem", dist)));
  }

  document.querySelectorAll("[data-demo]").forEach((card) => {
    card.addEventListener("click", () => playDemo(card));
  });

  // Play each demo once when it first scrolls into view
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        playDemo(e.target);
      });
    }, { rootMargin: "0px 0px -15% 0px" });
    document.querySelectorAll("[data-demo]").forEach((card) => io.observe(card));
  }
})();
