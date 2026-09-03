import { useEffect } from "react";
import Lenis from "lenis";

// Buttery page-physics scroll. Mount once at the app root — GSAP
// ScrollTrigger instances elsewhere just need `lenis.on("scroll", ScrollTrigger.update)`
// wired in (done in ProcessTimeline.tsx) so the two stay in sync.
export function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Exposed for GSAP ScrollTrigger to hook into without importing Lenis twice.
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);
}

export function getLenis(): Lenis | undefined {
  return (window as unknown as { __lenis?: Lenis }).__lenis;
}
