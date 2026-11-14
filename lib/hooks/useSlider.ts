import { useEffect, useRef, useState, type RefObject } from "react";

type SliderApi = { goTo: (i: number) => void; prev: () => void; next: () => void };

/**
 * Scroll-snap slider logic: arrows wrap around at either end, and the
 * active dot follows the scroll position. `trackRef` holds the slides.
 */
export function useSlider(trackRef: RefObject<HTMLElement | null>, count: number) {
  const [active, setActive] = useState(0);
  const api = useRef<SliderApi | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || !count) return;
    const slides = Array.from(track.children) as HTMLElement[];

    const maxScroll = () => track.scrollWidth - track.clientWidth;
    const slideLeft = (i: number) => slides[i].offsetLeft - slides[0].offsetLeft;
    const atStart = () => track.scrollLeft <= 2;
    const atEnd = () => track.scrollLeft >= maxScroll() - 2;
    const goTo = (i: number) => track.scrollTo({ left: Math.min(slideLeft(i), maxScroll()) });

    const currentIndex = () => {
      if (atEnd()) return slides.length - 1;
      let closest = 0;
      slides.forEach((_, i) => {
        if (Math.abs(slideLeft(i) - track.scrollLeft) < Math.abs(slideLeft(closest) - track.scrollLeft)) {
          closest = i;
        }
      });
      return closest;
    };

    api.current = {
      goTo,
      // Wrap around at either end so the arrows always do something
      prev: () => (atStart() ? goTo(slides.length - 1) : goTo(Math.max(currentIndex() - 1, 0))),
      next: () => (atEnd() ? goTo(0) : goTo(currentIndex() + 1)),
    };

    const update = () => setActive(currentIndex());
    track.addEventListener("scroll", update, { passive: true });
    addEventListener("resize", update);
    update();

    return () => {
      track.removeEventListener("scroll", update);
      removeEventListener("resize", update);
      api.current = null;
    };
  }, [trackRef, count]);

  return {
    active,
    goTo: (i: number) => api.current?.goTo(i),
    prev: () => api.current?.prev(),
    next: () => api.current?.next(),
  };
}
