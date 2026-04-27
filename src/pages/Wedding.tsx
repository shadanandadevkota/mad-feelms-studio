import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { PageShell } from "@/components/site/PageShell";
import { useSiteContent } from "@/hooks/useSiteContent";
import { useCollection } from "@/hooks/useCollection";

type Photo = { id: string; image_url: string; col_span: string; aspect: string; caption: string | null; sort_order: number; is_visible: boolean };
type Film = { id: string; title: string; place: string | null; year: string | null; image_url: string | null; sort_order: number; is_visible: boolean };

const Wedding = () => {
  return (
    <PageShell>
      <Hero />
      <PhotosPreview />
      <FilmsPreview />
      <Intro />
    </PageShell>
  );
};

const Hero = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { value } = useSiteContent("page_wedding", {
    title_lead: "Wedding by",
    title_accent: "Maddyyy",
    eyebrow: "A Mad Feelms Studio",
    intro: "Cinematic films that hold a marriage in motion — soft, slow, untouched.",
    side_image_url: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=900&q=80",
    showreel_video_url: "https://videos.pexels.com/video-files/3214448/3214448-uhd_2560_1440_25fps.mp4",
    philosophy: "We don't direct your day. We listen for it — for the breath before the kiss, the hand never let go.",
  });

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
          <div className="aspect-[9/16] relative overflow-hidden bg-surface blur-in">
            <img
              src={value.side_image_url}
              alt={`${value.title_lead} ${value.title_accent}`}
              className="absolute inset-0 h-full w-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
              <p className="eyebrow mb-3">Maddyyy · Director</p>
              <h2 className="font-display text-3xl md:text-4xl text-foreground leading-[0.95]">
                {value.title_lead} <br />
                <span className="italic text-primary">{value.title_accent}</span>
              </h2>
              <p className="text-muted-foreground text-sm mt-4 max-w-xs">{value.intro}</p>

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
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="flex items-center justify-between"
            >
              <span className="eyebrow">Showreel · 2026</span>
              <span className="eyebrow hidden md:inline text-muted-foreground">Scroll for stories</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex-1 min-h-[55vh] lg:min-h-[70vh]"
            >
              <div className="relative h-full w-full overflow-hidden bg-surface blur-in">
                <video
                  ref={videoRef}
                  key={value.showreel_video_url}
                  className="h-full w-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  poster={value.side_image_url}
                >
                  <source src={value.showreel_video_url} type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent" />

                <div className="absolute inset-x-0 bottom-8 md:bottom-12 flex flex-col items-center text-center px-6">
                  <p className="eyebrow text-foreground/80 mb-3">{value.eyebrow}</p>
                  <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-foreground leading-[0.9]">
                    {value.title_lead} <span className="italic text-primary">{value.title_accent}</span>
                  </h1>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

/** Photos preview — small grid, links to /wedding/photos */
const PhotosPreview = () => {
  const { items: photos } = useCollection<Photo>("wedding_photos");
  const preview = photos.slice(0, 4);
  if (!preview.length) return null;
  return (
    <section className="py-20 md:py-28 px-6 md:px-10 bg-surface">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <p className="eyebrow mb-3">Photographs</p>
            <h2 className="font-display text-4xl md:text-6xl text-foreground leading-[0.95]">
              Selected <span className="italic text-primary">frames</span>
            </h2>
          </div>
          <Link
            to="/wedding/photos"
            className="self-start md:self-end inline-flex items-center gap-2 px-5 py-3 border border-foreground/40 hover:bg-foreground hover:text-background transition-all duration-500 eyebrow"
          >
            View All Photos →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 blur-veil">
          {preview.map((p, i) => (
            <motion.figure
              key={p.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="blur-veil-item relative overflow-hidden bg-background aspect-[3/4]"
            >
              <img
                src={p.image_url}
                alt={p.caption ?? `Wedding photo ${i + 1}`}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
};

/** Films preview — small grid, links to /wedding/films */
const FilmsPreview = () => {
  const { items: films } = useCollection<Film>("wedding_films");
  const preview = films.slice(0, 3);
  if (!preview.length) return null;
  return (
    <section className="py-20 md:py-28 px-6 md:px-10 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <p className="eyebrow mb-3">Films</p>
            <h2 className="font-display text-4xl md:text-6xl text-foreground leading-[0.95]">
              Recent <span className="italic text-primary">stories</span>
            </h2>
          </div>
          <Link
            to="/wedding/films"
            className="self-start md:self-end inline-flex items-center gap-2 px-5 py-3 border border-foreground/40 hover:bg-foreground hover:text-background transition-all duration-500 eyebrow"
          >
            View All Films →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 blur-veil">
          {preview.map((f, i) => (
            <motion.article
              key={f.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="blur-veil-item group relative aspect-[3/4] overflow-hidden bg-surface"
            >
              {f.image_url && (
                <img
                  src={f.image_url}
                  alt={`${f.title} wedding film`}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="eyebrow mb-2">{f.place}{f.place && f.year ? " · " : ""}{f.year}</p>
                <h3 className="font-display text-2xl md:text-3xl text-foreground">{f.title}</h3>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

const Intro = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);
  const { value } = useSiteContent("page_wedding", {
    philosophy: "We don't direct your day. We listen for it — for the breath before the kiss, the hand never let go.",
  });

  return (
    <motion.section ref={ref} style={{ y }} className="py-24 md:py-32 px-6 md:px-10 bg-background">
      <div className="max-w-5xl mx-auto text-center">
        <p className="eyebrow mb-6">Philosophy</p>
        <p className="font-display text-3xl md:text-5xl lg:text-6xl text-foreground leading-[1.1] text-balance">
          {value.philosophy}
        </p>
      </div>
    </motion.section>
  );
};

export default Wedding;
