import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { PageShell } from "@/components/site/PageShell";
import { useSiteContent } from "@/hooks/useSiteContent";

const Wedding = () => {
  return (
    <PageShell>
      <Hero />
      <Intro />
    </PageShell>
  );
};

const Hero = () => {
  const [hover, setHover] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <section className="relative min-h-screen w-full pt-24 md:pt-28 pb-12 px-6 md:px-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 h-full">
        {/* Left 9:16 details panel */}
        <motion.aside
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-4 xl:col-span-3"
        >
          <div className="aspect-[9/16] relative overflow-hidden bg-surface">
            <img
              src="https://images.unsplash.com/photo-1606800052052-a08af7148866?w=900&q=80"
              alt="Bride portrait — Wedding by Maddyyy"
              className="absolute inset-0 h-full w-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
              <p className="eyebrow mb-3">Maddyyy · Director</p>
              <h2 className="font-display text-3xl md:text-4xl text-foreground leading-[0.95]">
                Wedding by <br />
                <span className="italic text-primary">Maddyyy</span>
              </h2>
              <p className="text-muted-foreground text-sm mt-4 max-w-xs">
                Cinematic films that hold a marriage in motion — soft, slow, untouched.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="eyebrow mb-1">Available</div>
                  <p className="font-display text-foreground">Worldwide</p>
                </div>
                <div>
                  <div className="eyebrow mb-1">Booking</div>
                  <p className="font-display text-foreground">2026 / 2027</p>
                </div>
              </div>
            </div>
          </div>
        </motion.aside>

        {/* Right side — Showreel center-bottom */}
        <div className="lg:col-span-8 xl:col-span-9 relative">
          <div className="flex flex-col h-full justify-between gap-8">
            {/* Top eyebrow strip */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="flex items-center justify-between"
            >
              <span className="eyebrow">Showreel · 2026</span>
              <span className="eyebrow hidden md:inline">Hover title · Click to enter</span>
            </motion.div>

            {/* Showreel block */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex-1 min-h-[55vh] lg:min-h-[70vh]"
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
            >
              <div className="relative h-full w-full overflow-hidden bg-surface">
                <video
                  ref={videoRef}
                  className="h-full w-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  poster="https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80"
                >
                  <source
                    src="https://videos.pexels.com/video-files/3214448/3214448-uhd_2560_1440_25fps.mp4"
                    type="video/mp4"
                  />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent" />

                {/* Center-bottom title — hover reveals, click navigates */}
                <Link
                  to="/wedding/photos"
                  className="absolute inset-x-0 bottom-8 md:bottom-12 flex flex-col items-center text-center px-6 group"
                >
                  <motion.div
                    animate={{ opacity: hover ? 1 : 0.85, y: hover ? 0 : 10 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <p className="eyebrow text-foreground/80 mb-3">A Mad Feelms Studio</p>
                    <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-foreground leading-[0.9]">
                      Wedding by <span className="italic text-primary">Maddyyy</span>
                    </h1>
                    <motion.div
                      animate={{ opacity: hover ? 1 : 0, y: hover ? 0 : 8 }}
                      transition={{ duration: 0.5, delay: hover ? 0.1 : 0 }}
                      className="mt-5 inline-flex items-center gap-2 px-4 py-2 border border-foreground/40 backdrop-blur-sm bg-background/30"
                    >
                      <span className="eyebrow text-foreground">View Photos →</span>
                    </motion.div>
                  </motion.div>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Intro = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);

  return (
    <motion.section ref={ref} style={{ y }} className="py-24 md:py-32 px-6 md:px-10 bg-background">
      <div className="max-w-5xl mx-auto text-center">
        <p className="eyebrow mb-6">Philosophy</p>
        <p className="font-display text-3xl md:text-5xl lg:text-6xl text-foreground leading-[1.1] text-balance">
          We don't direct your day. We <span className="italic text-primary">listen</span> for it —
          for the breath before the kiss, the hand never let go.
        </p>
      </div>
    </motion.section>
  );
};

export default Wedding;
