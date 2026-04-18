import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { PageShell } from "@/components/site/PageShell";

const data: Record<string, { title: string; publication: string; year: string; cover: string; gallery: string[]; credits: { label: string; value: string }[]; intro: string }> = {
  "sun-and-linen": {
    title: "Sun & Linen",
    publication: "Vogue AU",
    year: "2025",
    cover: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&q=80",
    intro: "Shot over two days on the south coast — 35mm film, ambient light, no retouching.",
    gallery: [
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1400&q=80",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1400&q=80",
      "https://images.unsplash.com/photo-1485231183945-fffde7cc051e?w=1400&q=80",
      "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=1400&q=80",
    ],
    credits: [
      { label: "Photographer", value: "Madhav Reddy" },
      { label: "Stylist", value: "Eva Park" },
      { label: "Model", value: "Inez @ IMG" },
      { label: "Hair & Makeup", value: "Sophie Wren" },
    ],
  },
};

const fallback = data["sun-and-linen"];

const FashionEditorialDetail = () => {
  const { slug } = useParams();
  const e = (slug && data[slug]) || fallback;

  return (
    <PageShell>
      <section className="pt-28 md:pt-32 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <Link to="/fashion-editorial" className="eyebrow text-muted-foreground hover:text-primary transition-colors">← All editorials</Link>
        </div>
      </section>

      {/* Cover */}
      <section className="mt-8 px-6 md:px-10">
        <div className="max-w-7xl mx-auto aspect-[16/10] md:aspect-[21/9] overflow-hidden bg-surface">
          <motion.img
            src={e.cover}
            alt={e.title}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="h-full w-full object-cover"
          />
        </div>
      </section>

      {/* Title + intro */}
      <section className="py-20 md:py-28 px-6 md:px-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
          <div className="md:col-span-7">
            <p className="eyebrow mb-4">{e.publication} · {e.year}</p>
            <h1 className="font-display text-6xl md:text-8xl text-foreground leading-[0.9] text-balance">
              {e.title}
            </h1>
            <p className="mt-8 text-muted-foreground text-lg leading-relaxed max-w-xl">{e.intro}</p>
          </div>
          <div className="md:col-span-5">
            <p className="eyebrow mb-6">Credits</p>
            <dl className="space-y-4">
              {e.credits.map((c) => (
                <div key={c.label} className="flex justify-between gap-4 border-b border-border/40 pb-3">
                  <dt className="eyebrow">{c.label}</dt>
                  <dd className="font-display text-foreground">{c.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="px-6 md:px-10 pb-32">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {e.gallery.map((src, i) => (
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, delay: (i % 2) * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className={`relative overflow-hidden bg-surface ${i % 3 === 0 ? "aspect-[4/5] md:col-span-2" : "aspect-[3/4]"}`}
            >
              <img src={src} alt={`${e.title} ${i + 1}`} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
            </motion.figure>
          ))}
        </div>
      </section>
    </PageShell>
  );
};

export default FashionEditorialDetail;
