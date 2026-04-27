import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PageShell } from "@/components/site/PageShell";
import { useCollection } from "@/hooks/useCollection";
import { useSiteContent } from "@/hooks/useSiteContent";

type Film = {
  id: string;
  title: string;
  place: string | null;
  year: string | null;
  image_url: string | null;
  sort_order: number;
  is_visible: boolean;
};

const WeddingFilms = () => {
  const { items: films } = useCollection<Film>("wedding_films");
  const { value } = useSiteContent("page_wedding_films", {
    eyebrow: "Films · Selected",
    title_lead: "Wedding",
    title_accent: "films",
    intro: "A library of recent stories — quiet, slow and exact. Each linked from its own page.",
  });

  return (
    <PageShell>
      <section className="pt-32 md:pt-40 pb-12 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <Link to="/wedding" className="eyebrow text-muted-foreground hover:text-primary transition-colors">← Back</Link>
          <div className="mt-6 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="eyebrow mb-4">{value.eyebrow}</p>
              <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-foreground leading-[0.9] text-balance">
                {value.title_lead} <span className="italic text-primary">{value.title_accent}</span>
              </h1>
            </div>
            <p className="text-muted-foreground max-w-sm text-sm">{value.intro}</p>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-10 pb-24 md:pb-32">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 blur-veil">
          {films.map((f, i) => (
            <motion.article
              key={f.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
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
                <p className="eyebrow mb-2">
                  {f.place}{f.place && f.year ? " · " : ""}{f.year}
                </p>
                <h3 className="font-display text-2xl md:text-3xl text-foreground">{f.title}</h3>
              </div>
            </motion.article>
          ))}
          {films.length === 0 && (
            <p className="text-muted-foreground text-sm col-span-full">No films yet.</p>
          )}
        </div>
      </section>
    </PageShell>
  );
};

export default WeddingFilms;
