import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PageShell } from "@/components/site/PageShell";

const blocks = [
  {
    side: "left",
    img: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1600&q=80",
    eyebrow: "01 — The Concept",
    title: "A study in shadow",
    body: "Maison Noir asked for a single mood: late dusk in a quiet apartment. We shot anamorphic on the Alexa, exclusively at golden hour, with practical light only.",
  },
  {
    side: "right",
    img: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1600&q=80",
    eyebrow: "02 — On Set",
    title: "Six hours, one room",
    body: "A cast of two, a crew of nine. Every frame held until it earned its place. Direction was a whisper, not a call.",
  },
  {
    side: "left",
    img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80",
    eyebrow: "03 — The Edit",
    title: "Cut for breath",
    body: "We trimmed against the score's silences — a 90-second piece built around three pauses. The brand never speaks. The room does.",
  },
];

const AdCommercialDetail = () => {
  return (
    <PageShell>
      <section className="pt-32 md:pt-40 pb-20 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <Link to="/ad-commercials" className="eyebrow text-muted-foreground hover:text-primary transition-colors">← Back to commercials</Link>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
            <div className="md:col-span-8">
              <p className="eyebrow mb-4">Commercial · 2025</p>
              <h1 className="font-display text-6xl md:text-8xl lg:text-9xl text-foreground leading-[0.9]">
                Maison <span className="italic text-primary">Noir</span>
              </h1>
            </div>
            <dl className="md:col-span-4 grid grid-cols-3 gap-4">
              <div>
                <dt className="eyebrow mb-1">Director</dt>
                <dd className="font-display text-foreground">Madhav Reddy</dd>
              </div>
              <div>
                <dt className="eyebrow mb-1">Colorist</dt>
                <dd className="font-display text-foreground">Lila Tan</dd>
              </div>
              <div>
                <dt className="eyebrow mb-1">Editor</dt>
                <dd className="font-display text-foreground">Theo Marsh</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Hero film */}
      <section className="px-6 md:px-10">
        <div className="max-w-7xl mx-auto aspect-[16/9] overflow-hidden bg-surface">
          <video autoPlay muted loop playsInline className="h-full w-full object-cover" poster="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1920&q=80">
            <source src="https://videos.pexels.com/video-files/4434242/4434242-uhd_2560_1440_25fps.mp4" type="video/mp4" />
          </video>
        </div>
      </section>

      {/* Alternating blocks */}
      <section className="py-24 md:py-32 px-6 md:px-10">
        <div className="max-w-7xl mx-auto space-y-24 md:space-y-32">
          {blocks.map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className={`grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-14 items-center ${b.side === "right" ? "md:[&>*:first-child]:order-2" : ""}`}
            >
              <div className="md:col-span-7 aspect-[4/3] overflow-hidden bg-surface">
                <img src={b.img} alt={b.title} className="h-full w-full object-cover" loading="lazy" />
              </div>
              <div className="md:col-span-5">
                <p className="eyebrow mb-4">{b.eyebrow}</p>
                <h2 className="font-display text-4xl md:text-5xl text-foreground leading-[1] mb-4 text-balance">
                  {b.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed">{b.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-24 px-6 md:px-10 bg-surface-elevated">
        <div className="max-w-3xl mx-auto text-center">
          <p className="eyebrow mb-4">Next</p>
          <Link to="/ad-commercials" className="font-display text-4xl md:text-5xl text-foreground italic hover:text-primary transition-colors">
            See more commercials →
          </Link>
        </div>
      </section>
    </PageShell>
  );
};

export default AdCommercialDetail;
