import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PageShell } from "@/components/site/PageShell";
import { useCollection } from "@/hooks/useCollection";
import { useSiteContent } from "@/hooks/useSiteContent";

type AdProject = {
  id: string;
  slug: string;
  title: string;
  title_lead: string | null;
  title_accent: string | null;
  year: string | null;
  eyebrow: string | null;
  hero_image_url: string | null;
  hero_video_url: string | null;
  credits: Array<{ label: string; value: string }>;
  is_featured: boolean;
  is_visible: boolean;
  sort_order: number;
};

const AdCommercials = () => {
  const { items } = useCollection<AdProject>("ad_projects");
  const featured = items.find((p) => p.is_featured) ?? items[0];
  const others = items.filter((p) => p.id !== featured?.id);

  const { value: copy } = useSiteContent("page_ad_commercials", {
    list_eyebrow: "More Commercials",
    list_title_lead: "Brands we've",
    list_title_accent: "moved",
    list_title_tail: "for",
  });

  const [hover, setHover] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  if (!featured) {
    return (
      <PageShell>
        <section className="min-h-screen flex items-center justify-center">
          <p className="eyebrow text-muted-foreground">No commercials yet.</p>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <section
        className="relative h-screen w-full overflow-hidden vignette"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {featured.hero_video_url ? (
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster={featured.hero_image_url ?? undefined}
          >
            <source src={featured.hero_video_url} type="video/mp4" />
          </video>
        ) : featured.hero_image_url ? (
          <img src={featured.hero_image_url} alt={featured.title} className="absolute inset-0 h-full w-full object-cover" />
        ) : null}

        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-background/40 pointer-events-none" />

        {featured.eyebrow && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="absolute top-24 left-1/2 -translate-x-1/2 eyebrow text-foreground/80 hidden md:block"
          >
            {featured.eyebrow}
          </motion.div>
        )}

        <Link
          to={`/ad-commercials/${featured.slug}`}
          className="absolute inset-x-0 bottom-12 md:bottom-20 flex flex-col items-center text-center px-6 group"
        >
          <motion.div animate={{ y: hover ? -10 : 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
            <h1 className="font-display text-6xl md:text-8xl lg:text-9xl text-foreground leading-[0.9]">
              {featured.title_lead ?? featured.title}{" "}
              {featured.title_accent && <span className="italic text-primary">{featured.title_accent}</span>}
            </h1>
          </motion.div>

          {featured.credits?.length > 0 && (
            <motion.div
              initial={false}
              animate={{ opacity: hover ? 1 : 0, y: hover ? 0 : 20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-3"
            >
              {featured.credits.map((c) => (
                <Credit key={c.label} label={c.label} value={c.value} />
              ))}
            </motion.div>
          )}

          <motion.div
            animate={{ opacity: hover ? 1 : 0, y: hover ? 0 : 12 }}
            transition={{ duration: 0.5, delay: hover ? 0.15 : 0 }}
            className="mt-8 inline-flex items-center gap-2 px-5 py-3 border border-foreground/50 bg-background/30 backdrop-blur-sm"
          >
            <span className="eyebrow text-foreground">View More →</span>
          </motion.div>
        </Link>

        <motion.div
          animate={{ opacity: hover ? 0 : 1 }}
          className="absolute bottom-6 right-6 eyebrow text-muted-foreground hidden md:block"
        >
          Hover for credits
        </motion.div>
      </section>

      {others.length > 0 && (
        <section className="bg-surface-elevated py-24 md:py-32 px-6 md:px-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14 gap-4">
              <div>
                <p className="eyebrow mb-3">{copy.list_eyebrow}</p>
                <h2 className="font-display text-4xl md:text-6xl text-foreground">
                  {copy.list_title_lead} <span className="italic text-primary">{copy.list_title_accent}</span> {copy.list_title_tail}
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {others.map((c, i) => (
                <motion.article
                  key={c.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link to={`/ad-commercials/${c.slug}`} className="group block aspect-[4/5] relative overflow-hidden bg-background">
                    {c.hero_image_url && (
                      <img
                        src={c.hero_image_url}
                        alt={c.title}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] group-hover:scale-105"
                        loading="lazy"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/85 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6">
                      {c.year && <p className="eyebrow mb-2">{c.year}</p>}
                      <h3 className="font-display text-2xl md:text-3xl text-foreground">{c.title}</h3>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}
    </PageShell>
  );
};

const Credit = ({ label, value }: { label: string; value: string }) => (
  <div className="text-center">
    <div className="eyebrow text-muted-foreground mb-1">{label}</div>
    <div className="font-display text-foreground text-base md:text-lg">{value}</div>
  </div>
);

export default AdCommercials;
