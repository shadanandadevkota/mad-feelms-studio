import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PageShell } from "@/components/site/PageShell";

type Editorial = {
  slug: string;
  title: string;
  publication: string;
  year: string;
  img: string;
  pos: string;
  aspect: string;
};

const editorials: Editorial[] = [
  { slug: "sun-and-linen", title: "Sun & Linen", publication: "Vogue AU", year: "2025", img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400&q=80", pos: "col-span-1 row-span-2 md:col-span-3 md:row-span-2", aspect: "" },
  { slug: "salt-pages", title: "Salt Pages", publication: "Russh", year: "2025", img: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1400&q=80", pos: "col-span-1 row-span-1 md:col-span-3 md:row-span-1", aspect: "" },
  { slug: "wild-silk", title: "Wild Silk", publication: "Harper's Bazaar", year: "2024", img: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1400&q=80", pos: "col-span-2 row-span-2 md:col-span-6 md:row-span-2", aspect: "" },
  { slug: "atelier-light", title: "Atelier Light", publication: "Oyster", year: "2024", img: "https://images.unsplash.com/photo-1485231183945-fffde7cc051e?w=1400&q=80", pos: "col-span-1 row-span-1 md:col-span-3 md:row-span-1", aspect: "" },
  { slug: "noir-bloom", title: "Noir Bloom", publication: "Self Service", year: "2024", img: "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=1400&q=80", pos: "col-span-1 row-span-2 md:col-span-3 md:row-span-2", aspect: "" },
];

const FashionEditorial = () => {
  return (
    <PageShell>
      <section className="pt-32 md:pt-40 pb-12 px-6 md:px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="eyebrow mb-4">Fashion · Editorial</p>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-foreground leading-[0.9] text-balance">
              The <span className="italic text-primary">edit</span>
            </h1>
          </div>
          <p className="text-muted-foreground max-w-sm text-sm">
            Five recent editorials shot for publications across AU, EU and Asia.
          </p>
        </div>
      </section>

      <section className="px-4 sm:px-6 md:px-10 pb-24 md:pb-32">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-12 auto-rows-[180px] sm:auto-rows-[220px] md:auto-rows-[260px] gap-3 sm:gap-4 md:gap-5">
          {/* Left two */}
          <Tile e={editorials[0]} />
          <Tile e={editorials[1]} />
          {/* Center */}
          <Tile e={editorials[2]} />
          {/* Right two */}
          <Tile e={editorials[3]} />
          <Tile e={editorials[4]} />
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
      className={`group relative overflow-hidden bg-surface ${e.pos} ${e.aspect} md:aspect-auto`}
    >
      <img
        src={e.img}
        alt={`${e.title} — ${e.publication}`}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] group-hover:scale-105"
        loading="lazy"
      />
      <motion.div
        animate={{ opacity: hover ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent"
      />
      <motion.figcaption
        animate={{ opacity: hover ? 1 : 0, y: hover ? 0 : 20 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-x-0 bottom-0 p-6 md:p-8"
      >
        <p className="eyebrow mb-2">{e.publication} · {e.year}</p>
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
