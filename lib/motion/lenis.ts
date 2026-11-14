import type Lenis from "lenis";

// The page's single Lenis instance, so the nav sheet can pause scrolling.
let instance: Lenis | null = null;

export const setLenis = (lenis: Lenis | null) => {
  instance = lenis;
};

export const getLenis = () => instance;
