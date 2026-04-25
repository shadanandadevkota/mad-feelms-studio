import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useCollection } from "@/hooks/useCollection";

type Work = {
  id: string;
  title: string;
  category: string;
  href: string;
  image_url: string | null;
  video_url: string | null;
  meta: string | null;
  sort_order: number;
  is_visible: boolean;
};

export const Work = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start start"],
  });
  const sectionY = useTransform(scrollYProgress, [0, 1], ["10%", "0%"]);
  const { items: works } = useCollection<Work>("work_items");

  return (
    <motion.section
      id="work"
      ref={ref}
      style={{ y: sectionY }}
      className="relative z-10 bg-background py-24 md:py-32"
    >
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14 md:mb-20 gap-6">
          <div>
            <p className="eyebrow mb-4">Selected Work</p>
            <h2 className="font-display text-5xl md:text-7xl leading-[0.95] text-foreground text-balance">
              Stories told <br />
              <span className="italic text-primary">in motion.</span>
            </h2>
          </div>
          <p className="text-muted-foreground max-w-xs text-sm">
            A small selection from our recent commissions across weddings,
            commercials, editorial and brand work.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {works.map((w, i) => (
            <WorkCard key={w.id} work={w} index={i} />
          ))}
        </div>
      </div>
    </motion.section>
  );
};

const WorkCard = ({ work, index }: { work: Work; index: number }) => {
  const [hover, setHover] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const onEnter = () => {
    setHover(true);
    videoRef.current?.play().catch(() => {});
  };
  const onLeave = () => {
    setHover(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  // Stagger heights: 1st & 4th taller, 2nd & 3rd a touch shorter for rhythm
  const aspect = index % 3 === 0 ? "aspect-[4/5]" : "aspect-[4/3]";
  const offset = index % 2 === 1 ? "md:mt-16" : "";

  return (
    <motion.article
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={`group relative overflow-hidden bg-surface ${aspect} ${offset}`}
    >
      <Link to={work.href} aria-label={`${work.title} — ${work.category}`} className="absolute inset-0 z-20">
        <span className="sr-only">View {work.title}</span>
      </Link>

      <img
        src={work.image}
        alt={`${work.title} — ${work.category}`}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
        loading="lazy"
      />
      {work.video && (
        <video
          ref={videoRef}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            hover ? "opacity-100" : "opacity-0"
          }`}
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src={work.video} type="video/mp4" />
        </video>
      )}

      {/* Bottom info */}
      <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 bg-gradient-to-t from-background/90 via-background/40 to-transparent pointer-events-none">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-2">{work.category}</p>
            <h3 className="font-display text-3xl md:text-4xl text-foreground leading-tight">
              {work.title}
            </h3>
          </div>
          <span className="eyebrow text-foreground/60 hidden sm:block">{work.meta}</span>
        </div>
      </div>

      {/* Hover overlay */}
      <div
        className={`absolute top-6 right-6 px-3 py-1 border border-foreground/40 backdrop-blur-sm bg-background/30 transition-all duration-500 pointer-events-none ${
          hover ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
        }`}
      >
        <span className="eyebrow text-foreground">View Project →</span>
      </div>
    </motion.article>
  );
};
