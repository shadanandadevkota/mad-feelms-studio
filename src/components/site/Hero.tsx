import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Hero with scroll-driven title choreography:
 *  Phase 1 (0 → 0.5): "MAD FEELMS" rises from the bottom to the vertical center.
 *  Phase 2 (0.5 → 1): The centered title flips up (rotateX) and fades out,
 *                     handing off to the PageFlip section below.
 *
 * Implemented as a tall (200vh) outer section with a sticky inner viewport,
 * so the title stays pinned while the user scrolls.
 */
export const Hero = () => {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Title starts ~bottom (45% of viewport down from center) and rises to 0 (center).
  const titleY = useTransform(scrollYProgress, [0, 0.5], ["45vh", "0vh"]);
  // Then flips DOWN around its bottom edge — like a flipboard departure card dropping forward.
  const titleRotateX = useTransform(scrollYProgress, [0.5, 0.95], [0, 95]);
  const titleOpacity = useTransform(scrollYProgress, [0.5, 0.95], [1, 0]);
  const titleScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 1.05]);

  // Background video subtly pushes back as we scroll.
  const videoOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.15]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);

  // Eyebrow fades out earlier so the centered title reads cleanly.
  const eyebrowOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <section
      ref={ref}
      id="top"
      className="relative h-[200vh] w-full bg-background isolate z-10"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden vignette perspective-1000">
        {/* Background showreel */}
        <motion.div
          style={{ opacity: videoOpacity, scale: videoScale }}
          className="absolute inset-0"
        >
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1920&q=80"
          >
            <source
              src="https://cdn.coverr.co/videos/coverr-cinematic-wedding-walk-7396/1080p.mp4"
              type="video/mp4"
            />
            <source
              src="https://videos.pexels.com/video-files/3214448/3214448-uhd_2560_1440_25fps.mp4"
              type="video/mp4"
            />
          </video>
        </motion.div>

        {/* Gradient overlay for legibility */}
        <div className="absolute inset-0 bg-gradient-overlay pointer-events-none" />

        {/* Top eyebrow — fades out as the title rises */}
        <motion.div
          style={{ opacity: eyebrowOpacity }}
          className="absolute left-1/2 top-24 -translate-x-1/2 eyebrow text-foreground/80 hidden md:block"
        >
          Showreel · 2026
        </motion.div>

        {/* Centered title block — Y-driven by scroll, then flips up */}
        <div className="absolute inset-0 flex items-center justify-center px-6 pointer-events-none">
          <motion.div
            style={{
              y: titleY,
              rotateX: titleRotateX,
              opacity: titleOpacity,
              scale: titleScale,
              transformOrigin: "50% 100%",
            }}
            className="text-center will-change-transform"
          >
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              className="font-display text-[18vw] md:text-[12vw] leading-[0.9] tracking-tighter text-foreground"
            >
              MAD <span className="italic text-primary">FEELMS</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3, duration: 1 }}
              className="eyebrow mt-4 md:mt-6 text-foreground/80"
            >
              Cinematic Production · Australia
            </motion.p>
          </motion.div>
        </div>

        {/* Scroll indicator — fades with eyebrow */}
        <motion.div
          style={{ opacity: eyebrowOpacity }}
          className="absolute right-6 md:right-10 bottom-12 hidden md:flex flex-col items-center gap-2 text-foreground/70"
        >
          <span className="eyebrow [writing-mode:vertical-rl] rotate-180">Scroll</span>
          <div className="w-px h-12 bg-foreground/40 animate-pulse-soft" />
        </motion.div>
      </div>
    </section>
  );
};
