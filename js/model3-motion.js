// Model 3 page — motion and decoration layer.
// Visual only: it never changes text, links or the behaviour in main.js.
(() => {
  const root = document.documentElement;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const phone = matchMedia("(max-width: 639px)");
  const css = getComputedStyle(root);
  const token = (name) => css.getPropertyValue(name).trim();
  const clamp01 = (v) => Math.min(1, Math.max(0, v));
  const SVG_NS = "http://www.w3.org/2000/svg";

  /* ---------------------------------------------------------------------- */
  /* Ticker: one rAF loop, each subscriber with its own frame rate           */
  /* ---------------------------------------------------------------------- */
  const ticker = (() => {
    const subs = new Set();
    let raf = 0;
    const loop = (t) => {
      raf = requestAnimationFrame(loop);
      for (const s of subs) {
        if (s.interval && s.last && t - s.last < s.interval) continue;
        const dt = s.last ? t - s.last : 16;
        s.last = t;
        s.fn(t, dt);
      }
    };
    return {
      add(fn, fps = 0) {
        const s = { fn, interval: fps ? 1000 / fps : 0, last: 0 };
        subs.add(s);
        if (!raf) raf = requestAnimationFrame(loop);
        return () => {
          subs.delete(s);
          if (!subs.size && raf) {
            cancelAnimationFrame(raf);
            raf = 0;
          }
        };
      },
    };
  })();

  // Lenis is registered first so scroll position is current for everyone else
  let lenis = null;
  if (!reduced && window.Lenis) {
    lenis = new window.Lenis({ lerp: 0.1 });
    ticker.add((t) => lenis.raf(t));
  }

  /* ---------------------------------------------------------------------- */
  /* Damped spring (mass 1, 1 ms substeps, 64 ms cap)                        */
  /* ---------------------------------------------------------------------- */
  const CFG = {
    REVEAL: [90, 26], ROW: [170, 24], ITEM: [170, 24], FIGURE: [200, 24],
    TYPE: [210, 24], COPY: [110, 26], VEIL: [70, 24], CLEAR: [140, 26], TRIGGER: [140, 30],
  };

  function spring([k, c], onUpdate, delay = 0) {
    let x = 0;
    let v = 0;
    let waited = 0;
    const stop = ticker.add((t, frame) => {
      let dt = Math.min(frame, 64);
      if (waited < delay) {
        waited += dt;
        if (waited < delay) return;
        dt = waited - delay;
      }
      for (let i = 0; i < Math.round(dt); i++) {
        v += (-k * (x - 1) - c * v) * 0.001;
        x += v * 0.001;
      }
      if (Math.abs(v) < 0.0005 && Math.abs(x - 1) < 0.0005) {
        onUpdate(1);
        stop();
        return;
      }
      onUpdate(x);
    });
  }

  /* ---------------------------------------------------------------------- */
  /* Decorations (aria-hidden SVG and canvases)                              */
  /* ---------------------------------------------------------------------- */
  const PLATE_PATH = document.querySelector("#plate-clip path").getAttribute("d");
  const CHAMFER = "M220 42L212.932 50H0V0H220V42Z";

  const svg = (markup) => {
    const tpl = document.createElement("template");
    tpl.innerHTML = markup.trim();
    return tpl.content.firstElementChild;
  };

  document.querySelectorAll("[data-bracket]").forEach((el) => {
    ["tr", "tl", "bl", "br"].forEach((pos) => {
      el.append(svg(`<svg class="bracket__corner bracket__corner--${pos}" viewBox="0 0 10.5 10.5" aria-hidden="true" focusable="false"><path d="M0 0.5H10V10.5" stroke="currentColor" fill="none"/></svg>`));
    });
  });

  document.querySelectorAll("[data-chamfer]").forEach((a) => {
    const label = document.createElement("span");
    label.className = "chamfer__label";
    label.append(...a.childNodes);
    a.append(
      svg(`<svg class="chamfer__shape" viewBox="0 0 220 50" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path class="chamfer__body" d="${CHAMFER}"/><path class="chamfer__flood" d="${CHAMFER}"/>
        <path class="chamfer__ring" d="${CHAMFER}"/>
        <path class="chamfer__brackets" d="M205 49.5H213L219.5 42V36M212 0.5H219.5V7M8 0.5H0.5V7M7.5 49.5H0.5V42.5"/></svg>`),
      label,
      svg(`<svg class="chamfer__arrow" viewBox="0 0 13 10.7" aria-hidden="true" focusable="false"><path d="M0 5.35H13M8 10.35L13 5.35L8 0.35"/></svg>`)
    );
  });

  document.querySelectorAll("[data-text-btn]").forEach((a) => {
    const deco = (text, cls = "text-btn__deco") => {
      const s = document.createElement("span");
      s.className = cls;
      s.setAttribute("aria-hidden", "true");
      s.textContent = text;
      return s;
    };
    a.prepend(deco("["));
    a.append(deco("→", "text-btn__deco text-btn__arrow"), deco("]"));
  });

  document.querySelectorAll("[data-plate]").forEach((plate) => {
    plate.prepend(svg(`<svg class="plate__outline" viewBox="0 0 1 1" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="${PLATE_PATH}"/></svg>`));
  });

  const wheels = [];
  document.querySelectorAll("[data-stat-plate]").forEach((plate) => {
    plate.prepend(
      svg(`<svg class="stat-plate__shape" viewBox="0 0 277 78" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path class="body" d="M0.5 0.5H276.5V69L268 77.5H0.5Z"/><line class="divider" x1="83" y1="0.5" x2="83" y2="77.5"/></svg>`),
      svg(`<div class="stat-plate__icon" aria-hidden="true"><svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1"><circle cx="16" cy="16" r="14.5"/><circle cx="16" cy="16" r="10"/><circle cx="16" cy="16" r="3"/><path d="M16 13V6M18.85 15.07L25.5 12.9M17.76 18.43L21.9 24.1M14.24 18.43L10.1 24.1M13.15 15.07L6.5 12.9"/></svg></div>`)
    );
    wheels.push(plate.querySelector(".stat-plate__icon svg"));
  });

  const addCanvas = (host, cls) => {
    const c = document.createElement("canvas");
    c.className = cls;
    c.setAttribute("aria-hidden", "true");
    host.prepend(c);
    return c;
  };

  /* ---------------------------------------------------------------------- */
  /* Contour lines (marching squares)                                        */
  /* ---------------------------------------------------------------------- */
  const LINE_SCALE = 3.8, LINE_COUNT = 2.5, WAVE_AMOUNT = 0.37, WAVE_SPEED = 1.66, LINE_OPACITY = 0.85, CELLS = 96;
  const field = (x, y, t) => {
    let f = Math.sin(x + t * 0.6) * 0.5;
    f += Math.sin(y * 0.85 - t * 0.45) * 0.45;
    f += Math.sin((x + y) * 0.65 + t * 0.35) * 0.35;
    f += Math.sin((x - y) * 0.95 - t * 0.55) * 0.25;
    return f * 0.5 + 0.5;
  };

  function contour(host) {
    const canvas = addCanvas(host, "contour");
    const ctx = canvas.getContext("2d");
    const variant = host.dataset.contour;
    const color = token(variant === "hero" ? "--surface-soft" : variant === "dark" ? "--contour-dark" : "--contour-light");
    let w = 0, h = 0, dpr = 1, stop = null;
    const start = performance.now();

    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    };

    const draw = (now) => {
      if (!w || !h) return;
      const t = ((now - start) / 1000) * WAVE_SPEED;
      const cols = CELLS;
      const rows = Math.max(2, Math.round((CELLS * h) / w));
      const cw = w / cols, ch = h / rows, aspect = w / h;
      const vals = new Float32Array((cols + 1) * (rows + 1));
      for (let j = 0; j <= rows; j++) {
        const ny = ((j / rows) * 2 - 1) * LINE_SCALE;
        for (let i = 0; i <= cols; i++) {
          const nx = ((i / cols) * 2 - 1) * aspect * LINE_SCALE;
          const qx = nx + Math.sin(ny * 0.8 + t * 0.7) * WAVE_AMOUNT;
          const qy = ny + Math.cos(nx * 0.7 - t * 0.6) * WAVE_AMOUNT;
          vals[j * (cols + 1) + i] = field(qx, qy, t) * LINE_COUNT;
        }
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = color;
      ctx.globalAlpha = LINE_OPACITY;
      ctx.lineWidth = 1;
      ctx.beginPath();
      const seg = (x1, y1, x2, y2) => { ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); };
      for (let level = 0.5; level < LINE_COUNT; level += 1) {
        for (let j = 0; j < rows; j++) {
          for (let i = 0; i < cols; i++) {
            const a = vals[j * (cols + 1) + i], b = vals[j * (cols + 1) + i + 1];
            const c = vals[(j + 1) * (cols + 1) + i + 1], d = vals[(j + 1) * (cols + 1) + i];
            const idx = (a > level ? 8 : 0) | (b > level ? 4 : 0) | (c > level ? 2 : 0) | (d > level ? 1 : 0);
            if (idx === 0 || idx === 15) continue;
            const x = i * cw, y = j * ch;
            const lerp = (p, q) => (level - p) / (q - p);
            const T = [x + cw * lerp(a, b), y], R = [x + cw, y + ch * lerp(b, c)];
            const B = [x + cw * lerp(d, c), y + ch], L = [x, y + ch * lerp(a, d)];
            switch (idx) {
              case 1: case 14: seg(...L, ...B); break;
              case 2: case 13: seg(...B, ...R); break;
              case 3: case 12: seg(...L, ...R); break;
              case 4: case 11: seg(...T, ...R); break;
              case 6: case 9: seg(...T, ...B); break;
              case 7: case 8: seg(...L, ...T); break;
              case 5: seg(...L, ...T); seg(...B, ...R); break;   // saddle
              case 10: seg(...T, ...R); seg(...L, ...B); break;  // saddle
            }
          }
        }
      }
      ctx.stroke();
    };

    resize();
    new ResizeObserver(() => { resize(); draw(performance.now()); }).observe(canvas);

    if (reduced) {
      draw(start);
      return;
    }
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !stop) stop = ticker.add(draw, 1000 / 24);
      else if (!e.isIntersecting && stop) { stop(); stop = null; }
    }).observe(canvas);
  }

  document.querySelectorAll("[data-contour]").forEach(contour);

  /* ---------------------------------------------------------------------- */
  /* Chequered dissolve between light and dark sections                      */
  /* ---------------------------------------------------------------------- */
  const CELL = 24, SOLID_UNTIL = 0.16, LIFT = 2, ACCENT_SHARE = 0.06;
  const noise = (x, y) => {
    let h = Math.imul(x, 374761393) + Math.imul(y, 668265263);
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
  };
  const accent = token("--accent");

  const dissolves = [...document.querySelectorAll("[data-dissolve]")].map((host) => {
    const canvas = addCanvas(host, "dissolve");
    const ctx = canvas.getContext("2d");
    // The strip carries the surface of the section above into this one
    const carry = host.classList.contains("surface-dark") ? token("--background") : token("--surface-black");
    let last = -1, w = 0, h = 0, dpr = 1;
    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      last = -1;
    };
    resize();
    new ResizeObserver(resize).observe(canvas);

    return (vh) => {
      const progress = reduced ? 1 : clamp01(1 - host.getBoundingClientRect().top / vh);
      const p = Math.round(progress * 400) / 400;
      if (p === last) return;
      last = p;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const cols = Math.ceil(w / CELL), rows = Math.ceil(h / CELL);
      for (let y = 0; y < rows; y++) {
        const depth = y / (rows - 1) + p * LIFT;
        if (depth > 1) break;
        const solid = depth <= SOLID_UNTIL;
        const fade = clamp01(1 - (depth - SOLID_UNTIL) / (1 - SOLID_UNTIL));
        for (let x = 0; x < cols; x++) {
          if (!solid) {
            if ((x + y) % 2 !== 0) continue;
            if (noise(x, y) > fade) continue;
          }
          ctx.fillStyle = !solid && noise(x + 101, y + 57) < ACCENT_SHARE ? accent : carry;
          ctx.fillRect(x * CELL, y * CELL, CELL, CELL);
        }
      }
    };
  });

  /* ---------------------------------------------------------------------- */
  /* Sticky stack                                                            */
  /* ---------------------------------------------------------------------- */
  const stack = document.querySelector(".stack");
  const layers = stack
    ? [...stack.children].map((item, i, all) => ({
        item,
        inner: item.querySelector(".stack__inner"),
        shade: item.querySelector(".stack__shade"),
        next: all[i + 1] || stack.nextElementSibling,
      }))
    : [];

  const layoutStack = () => {
    // Tall layers stick once their bottom reaches the viewport bottom
    layers.forEach(({ item }) => {
      item.style.top = `${Math.min(0, innerHeight - item.offsetHeight)}px`;
    });
  };

  const updateStack = (vh) => {
    layers.forEach(({ inner, shade, next }) => {
      if (!next) return;
      const p = clamp01(1 - next.getBoundingClientRect().top / vh);
      inner.style.transform = p > 0 && !phone.matches && !reduced ? `scale(${1 - 0.1 * p})` : "";
      shade.style.opacity = String(0.55 * p);
      inner.style.visibility = p >= 1 ? "hidden" : "visible";
    });
  };

  /* ---------------------------------------------------------------------- */
  /* Plate parallax (moves the overscanned image with `top`)                 */
  /* ---------------------------------------------------------------------- */
  const plates = [...document.querySelectorAll("[data-plate]:not(.plate--contain)")];
  const updatePlates = (vh) => {
    if (reduced) return;
    plates.forEach((plate) => {
      const r = plate.getBoundingClientRect();
      if (!r.height || r.bottom < 0 || r.top > vh) return;
      const p = clamp01((vh - r.top) / (vh + r.height));
      plate.style.setProperty("--py", `${(-10 + 10 * p).toFixed(2)}%`);
    });
  };

  /* Scroll-linked updates run once per frame when something changed */
  let lastY = -1, dirty = true;
  addEventListener("resize", () => { dirty = true; layoutStack(); });
  layoutStack();
  ticker.add(() => {
    if (scrollY === lastY && !dirty) return;
    lastY = scrollY;
    dirty = false;
    const vh = innerHeight;
    updateStack(vh);
    dissolves.forEach((draw) => draw(vh));
    updatePlates(vh);
  });

  /* ---------------------------------------------------------------------- */
  /* Strip: crawling dashed connector, active dot with pulse                 */
  /* ---------------------------------------------------------------------- */
  document.querySelectorAll("[data-strip]").forEach((strip) => {
    const line = document.createElement("div");
    line.className = "strip__line";
    line.setAttribute("aria-hidden", "true");
    strip.prepend(line);
    const items = [...strip.querySelectorAll(".feature-item")];
    let active = items[0];
    const setActive = (item) => {
      items.forEach((i) => i.classList.toggle("is-active", i === item));
      active = item;
    };
    setActive(active);
    items.forEach((item) => {
      item.addEventListener("mouseenter", () => setActive(item));
      item.addEventListener("focusin", () => setActive(item));
    });

    if (reduced) {
      active.style.setProperty("--pulse-opacity", "0.6");
      return;
    }
    let stop = null;
    const frame = (t) => {
      line.style.setProperty("--dash", `${(-((t % 5200) / 5200) * 18.45).toFixed(2)}px`);
      const phase = (t % 3200) / 3200;
      active.style.setProperty("--pulse-scale", (1 + phase * 1.2).toFixed(3));
      active.style.setProperty("--pulse-opacity", ((1 - phase) * 0.9).toFixed(3));
    };
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !stop) stop = ticker.add(frame, 60);
      else if (!e.isIntersecting && stop) { stop(); stop = null; }
    }).observe(strip);
  });

  /* Stat plate wheel: one turn every 10 s */
  if (wheels.length && !reduced) {
    ticker.add((t) => {
      const deg = ((t % 10000) / 10000) * 360;
      wheels.forEach((w) => { if (w.isConnected) w.style.transform = `rotate(${deg.toFixed(2)}deg)`; });
    }, 30);
  }

  /* ---------------------------------------------------------------------- */
  /* Text split + reveals                                                    */
  /* ---------------------------------------------------------------------- */
  function splitText(el, mode) {
    const sr = document.createElement("span");
    sr.className = "sr-only";
    el.childNodes.forEach((n) => sr.append(n.cloneNode(true)));
    const vis = document.createElement("span");
    vis.setAttribute("aria-hidden", "true");
    const pieces = [];
    const walk = (node, parent) => {
      node.childNodes.forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          const tokens = mode === "chars" ? Array.from(child.textContent) : child.textContent.split(/(\s+)/);
          tokens.forEach((tok) => {
            if (!tok) return;
            if (/^\s+$/.test(tok)) { parent.append(document.createTextNode(tok)); return; }
            const s = document.createElement("span");
            s.className = "sp";
            s.textContent = tok;
            parent.append(s);
            pieces.push(s);
          });
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          const clone = child.cloneNode(false);
          parent.append(clone);
          walk(child, clone);
        }
      });
    };
    walk(el, vis);
    el.replaceChildren(sr, vis);
    return pieces;
  }

  const REVEAL_KIND = {
    block: { cfg: CFG.REVEAL, y: 0.75 },
    copy: { cfg: CFG.COPY, y: 0.75 },
    item: { cfg: CFG.ITEM, y: 1 },
    figure: { cfg: CFG.FIGURE, y: 1.25 },
  };

  const showBlock = (el, p, y) => {
    el.style.opacity = String(clamp01(p));
    el.style.transform = p >= 1 ? "" : `translateY(${((1 - p) * y).toFixed(4)}rem)`;
  };

  const splits = new Map();
  document.querySelectorAll("[data-split]").forEach((el) => {
    const mode = el.dataset.split;
    const pieces = splitText(el, mode);
    const off = mode === "chars" ? 0.3 : 0.35;
    if (!reduced) {
      pieces.forEach((s) => { s.style.opacity = "0"; s.style.transform = `translateY(${off}em)`; });
      if (el.classList.contains("h2")) el.style.setProperty("--bar", "0");
    }
    el.style.opacity = "1";
    splits.set(el, { pieces, mode, off });
  });

  function play(el, instant, extraDelay) {
    const delay = Number(el.dataset.delay || 0) + extraDelay;
    const split = splits.get(el);
    if (split) {
      const { pieces, mode, off } = split;
      const stagger = mode === "chars" ? 24 : 110;
      const cfg = mode === "chars" ? CFG.FIGURE : CFG.TYPE;
      pieces.forEach((s, i) => {
        const set = (p) => {
          s.style.opacity = String(clamp01(p));
          s.style.transform = p >= 1 ? "" : `translateY(${((1 - p) * off).toFixed(4)}em)`;
        };
        instant ? set(1) : spring(cfg, set, delay + i * stagger);
      });
      if (el.classList.contains("h2")) {
        const bar = (p) => el.style.setProperty("--bar", clamp01(p).toFixed(4));
        instant ? bar(1) : spring(CFG.REVEAL, bar, delay + pieces.length * stagger);
      }
      return;
    }
    const kind = REVEAL_KIND[el.dataset.reveal] || REVEAL_KIND.block;
    instant ? showBlock(el, 1, kind.y) : spring(kind.cfg, (p) => showBlock(el, p, kind.y), delay);
  }

  const targets = [...document.querySelectorAll("[data-reveal], [data-split]")];

  if (reduced || !("IntersectionObserver" in window)) {
    targets.forEach((el) => play(el, true, 0));
  } else {
    targets.forEach((el) => {
      if (el.dataset.reveal) showBlock(el, 0, (REVEAL_KIND[el.dataset.reveal] || REVEAL_KIND.block).y);
    });
    // Mode "forward": plays while scrolling down; arriving from above shows the end state
    const io = new IntersectionObserver((entries) => {
      let batch = 0;
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        const fromBelow = e.boundingClientRect.top >= 0;
        const once = e.target.dataset.mode === "once";
        play(e.target, !fromBelow && !once, batch++ * 70);
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    targets.forEach((el) => io.observe(el));
  }

  /* ---------------------------------------------------------------------- */
  /* Navigation sheet (below 1280px)                                         */
  /* ---------------------------------------------------------------------- */
  const navbar = document.querySelector(".navbar");
  const sheet = navbar && navbar.querySelector(".nav-sheet");
  const toggle = navbar && navbar.querySelector(".navbar__toggle");
  const desktop = matchMedia("(min-width: 1280px)");

  if (navbar && sheet && toggle) {
    const navLabel = navbar.querySelector("nav").getAttribute("aria-label");
    const rows = [...sheet.querySelectorAll("li")];
    new MutationObserver(() => {
      const open = navbar.classList.contains("is-open");
      if (open && !desktop.matches) {
        sheet.setAttribute("role", "dialog");
        sheet.setAttribute("aria-modal", "true");
        sheet.setAttribute("aria-label", navLabel);
        root.style.overflow = "hidden";
        if (lenis) lenis.stop();
        rows.forEach((li, i) => {
          if (reduced) return;
          li.style.opacity = "0";
          li.style.transform = "translateY(1.5rem)";
          spring(CFG.ROW, (p) => {
            li.style.opacity = String(clamp01(p));
            li.style.transform = p >= 1 ? "" : `translateY(${((1 - p) * 1.5).toFixed(4)}rem)`;
          }, 120 + i * 55);
        });
      } else {
        sheet.removeAttribute("role");
        sheet.removeAttribute("aria-modal");
        sheet.removeAttribute("aria-label");
        root.style.overflow = "";
        if (lenis) lenis.start();
        rows.forEach((li) => { li.style.opacity = ""; li.style.transform = ""; });
      }
    }).observe(navbar, { attributes: true, attributeFilter: ["class"] });

    const close = () => { if (navbar.classList.contains("is-open")) toggle.click(); };
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navbar.classList.contains("is-open")) { close(); toggle.focus(); }
    });
    sheet.addEventListener("click", (e) => { if (e.target.closest("a")) close(); });
    desktop.addEventListener("change", (e) => { if (e.matches) close(); });
  }

  /* Root size above 1920px */
  const scaleRoot = () => {
    root.style.fontSize = innerWidth > 1920 ? `${(16 * innerWidth) / 1920}px` : "";
  };
  addEventListener("resize", scaleRoot);
  scaleRoot();

  window.__m3Ready = true;
})();
