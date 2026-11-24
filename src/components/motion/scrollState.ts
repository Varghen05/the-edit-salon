import type Lenis from "lenis";

// Shared, mutable scroll info read every frame by the 3D scene (no React re-renders).
export const scrollState = {
  progress: 0,
  velocity: 0,
  lenis: null as Lenis | null,
};
