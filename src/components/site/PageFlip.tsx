import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Page-flip transition: as user scrolls past the hero,
 * the title moves to center and the page flips on the X axis,
 * revealing the About section on the back face.
 */
export const PageFlip = () => {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Flip the card on Y axis from 0 to -180deg
  const rotateY = useTransform(scrollYProgress, [0.15, 0.6], [0, -180]);
  const cardScale = useTransform(scrollYProgress, [0, 0.3, 0.6, 1], [0.9, 1, 1, 0.95]);
  const titleOpacity = useTransform(scrollYProgress, [0.05, 0.2, 0.4], [0, 1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 0.4], ["30%", "0%"]);

  return (
    <section ref={ref} className="relative h-[200vh] bg-background">
      <div className="sticky top-0 h-screen w-full perspective-1000 flex items-center justify-center overflow-hidden">
        {/* Floating title that announces the flip */}
        <motion.div
          style={{ opacity: titleOpacity, y: titleY }}
          className="absolute z-20 text-center pointer-events-none"
        >
          <p className="eyebrow mb-4">— A studio of —</p>
          <h2 className="font-display text-6xl md:text-8xl text-foreground">
            MAD <span className="italic text-primary">FEELMS</span>
          </h2>
        </motion.div>

        <motion.div
          style={{ rotateY, scale: cardScale }}
          className="relative w-[90vw] h-[80vh] max-w-6xl preserve-3d"
        >
          {/* Front face — empty/dark, the title "lives" here visually */}
          <div className="absolute inset-0 backface-hidden bg-surface border border-border/50 shadow-cinematic flex items-center justify-center">
            <div className="text-center">
              <p className="eyebrow mb-6 text-muted-foreground">Est. Australia</p>
              <div className="font-display text-5xl md:text-7xl text-foreground/30 italic">
                turn the page
              </div>
            </div>
          </div>

          {/* Back face — About section */}
          <div
            className="absolute inset-0 backface-hidden bg-surface-elevated border border-border/50 shadow-cinematic"
            style={{ transform: "rotateY(180deg)" }}
          >
            <AboutContent />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const AboutContent = () => (
  <div id="about" className="grid h-full grid-cols-1 md:grid-cols-2 gap-0">
    <div className="relative overflow-hidden bg-muted">
      <img
        src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1200&q=80"
        alt="Filmmaker behind the camera capturing a cinematic moment"
        className="h-full w-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/30" />
    </div>

    <div className="flex flex-col justify-center p-8 md:p-14 lg:p-20">
      <p className="eyebrow mb-6">About — Mad Feelms</p>
      <h3 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.05] text-foreground mb-6 text-balance">
        We chase <span className="italic text-primary">feelings</span>, not just frames.
      </h3>
      <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-4 max-w-md">
        Mad Feelms is an Australian-based cinematic studio crafting weddings, commercials,
        editorials and media production. We translate the unseen — a glance, a pause, a
        breath — into images that endure.
      </p>
      <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-md">
        Made by a small team that obsesses over light, music and the in-between.
      </p>

      <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
        <div>
          <div className="font-display text-3xl text-primary">120+</div>
          <div className="eyebrow mt-1">Films</div>
        </div>
        <div>
          <div className="font-display text-3xl text-primary">9</div>
          <div className="eyebrow mt-1">Countries</div>
        </div>
        <div>
          <div className="font-display text-3xl text-primary">07</div>
          <div className="eyebrow mt-1">Years</div>
        </div>
      </div>
    </div>
  </div>
);
