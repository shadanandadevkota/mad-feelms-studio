import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";

type Work = {
  title: string;
  category: string;
  href: string;
  image: string;
  video?: string;
  meta: string;
};

const works: Work[] = [
  {
    title: "Aria & Kai",
    category: "Wedding Film",
    href: "/wedding",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80",
    video: "https://videos.pexels.com/video-files/3214448/3214448-uhd_2560_1440_25fps.mp4",
    meta: "Byron Bay · 2025",
  },
  {
    title: "Maison Noir",
    category: "Ad Commercial",
    href: "/ad-commercials/maison-noir",
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1200&q=80",
    video: "https://videos.pexels.com/video-files/4434242/4434242-uhd_2560_1440_25fps.mp4",
    meta: "Melbourne · 2025",
  },
  {
    title: "Sun & Linen",
    category: "Fashion Editorial",
    href: "/fashion-editorial/sun-and-linen",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80",
    video: "https://videos.pexels.com/video-files/5319758/5319758-uhd_2560_1440_25fps.mp4",
    meta: "Sydney · 2025",
  },
  {
    title: "After Hours",
    category: "Media Production",
    href: "/media-production",
    image: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=1200&q=80",
    video: "https://videos.pexels.com/video-files/3045163/3045163-uhd_2560_1440_25fps.mp4",
    meta: "Perth · 2024",
  },
];

export const Work = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start start"],
  });
  const sectionY = useTransform(scrollYProgress, [0, 1], ["10%", "0%"]);

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
            <WorkCard key={w.title} work={w} index={i} />
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
      className={`group relative overflow-hidden bg-surface cursor-pointer ${aspect} ${offset}`}
    >
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
      <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 bg-gradient-to-t from-background/90 via-background/40 to-transparent">
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
        className={`absolute top-6 right-6 px-3 py-1 border border-foreground/40 backdrop-blur-sm bg-background/30 transition-all duration-500 ${
          hover ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
        }`}
      >
        <span className="eyebrow text-foreground">View Project →</span>
      </div>
    </motion.article>
  );
};
