import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PageShell } from "@/components/site/PageShell";
import { useCollection } from "@/hooks/useCollection";
import { useSiteContent } from "@/hooks/useSiteContent";

type Editorial = {
  id: string;
  slug: string;
  title: string;
  publication: string | null;
  year: string | null;
  cover_url: string | null;
  grid_pos: string;
  is_visible: boolean;
  sort_order: number;
};

const FashionEditorial = () => {
  const { items } = useCollection<Editorial>("editorial_projects");
  const { value: copy } = useSiteContent("page_fashion_editorial", {
    eyebrow: "Fashion · Editorial",
    title_lead: "The",
    title_accent: "edit",
    intro: "Five recent editorials shot for publications across AU, EU and Asia.",
  });

  return (
    <PageShell>
      <section className="pt-32 md:pt-40 pb-12 px-6 md:px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="eyebrow mb-4">{copy.eyebrow}</p>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-foreground leading-[0.9] text-balance">
              {copy.title_lead} <span className="italic text-primary">{copy.title_accent}</span>
            </h1>
          </div>
          <p className="text-muted-foreground max-w-sm text-sm">{copy.intro}</p>
        </div>
      </section>

      <section className="px-4 sm:px-6 md:px-10 pb-24 md:pb-32">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-12 auto-rows-[180px] sm:auto-rows-[220px] md:auto-rows-[260px] gap-3 sm:gap-4 md:gap-5">
          {items.map((e) => (
            <Tile key={e.id} e={e} />
          ))}
        </div>
      </section>
    </PageShell>
  );
};

const Tile = ({ e }: { e: Editorial }) => {
  const [hover, setHover] = useState(false);
  return (
    <motion.figure
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`group relative overflow-hidden bg-surface ${e.grid_pos}`}
    >
      <Link to={`/fashion-editorial/${e.slug}`} className="absolute inset-0 z-10 md:hidden" aria-label={e.title} />

      {e.cover_url && (
        <img
          src={e.cover_url}
          alt={`${e.title}${e.publication ? ` — ${e.publication}` : ""}`}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] group-hover:scale-105"
          loading="lazy"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent md:hidden" />
      <motion.div
        animate={{ opacity: hover ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent hidden md:block"
      />

      <figcaption className="absolute inset-x-0 bottom-0 p-3 sm:p-4 md:hidden">
        {(e.publication || e.year) && (
          <p className="eyebrow mb-1 text-[10px]">
            {e.publication}
            {e.publication && e.year ? " · " : ""}
            {e.year}
          </p>
        )}
        <h3 className="font-display text-base sm:text-lg text-foreground leading-tight mb-2">{e.title}</h3>
        <span className="inline-flex items-center px-2.5 py-1 border border-foreground/40 bg-background/40 backdrop-blur-sm eyebrow text-[10px] text-foreground">
          View More →
        </span>
      </figcaption>

      <motion.figcaption
        animate={{ opacity: hover ? 1 : 0, y: hover ? 0 : 20 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-x-0 bottom-0 p-6 md:p-8 hidden md:block"
      >
        {(e.publication || e.year) && (
          <p className="eyebrow mb-2">
            {e.publication}
            {e.publication && e.year ? " · " : ""}
            {e.year}
          </p>
        )}
        <h3 className="font-display text-2xl md:text-4xl text-foreground leading-tight">{e.title}</h3>
        <Link
          to={`/fashion-editorial/${e.slug}`}
          className="inline-flex items-center mt-4 px-4 py-2 border border-foreground/40 bg-background/30 backdrop-blur-sm eyebrow text-foreground hover:bg-foreground hover:text-background transition-all duration-500"
        >
          View More →
        </Link>
      </motion.figcaption>
    </motion.figure>
  );
};

export default FashionEditorial;
