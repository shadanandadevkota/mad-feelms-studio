import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export const Hero = () => {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const titleScale = useTransform(scrollYProgress, [0, 0.6], [1, 1.4]);
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);
  const videoOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.2]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <section ref={ref} id="top" className="relative h-screen w-full overflow-hidden vignette">
      <motion.div style={{ opacity: videoOpacity, scale: videoScale }} className="absolute inset-0">
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

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-overlay pointer-events-none" />

      {/* Top eyebrow */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute left-1/2 top-24 -translate-x-1/2 eyebrow text-foreground/80 hidden md:block"
      >
        Showreel · 2026
      </motion.div>

      {/* Bottom centered title */}
      <motion.div
        style={{ scale: titleScale, y: titleY }}
        className="absolute inset-x-0 bottom-12 md:bottom-16 flex flex-col items-center justify-center text-center px-6"
      >
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="font-display text-[18vw] md:text-[12vw] leading-[0.9] tracking-tighter text-foreground"
        >
          MAD <span className="italic font-light text-primary">FEELMS</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 1 }}
          className="eyebrow mt-4 md:mt-6"
        >
          Cinematic Production · Australia
        </motion.p>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute right-6 md:right-10 bottom-12 hidden md:flex flex-col items-center gap-2 text-foreground/70"
      >
        <span className="eyebrow [writing-mode:vertical-rl] rotate-180">Scroll</span>
        <div className="w-px h-12 bg-foreground/40 animate-pulse-soft" />
      </motion.div>
    </section>
  );
};
