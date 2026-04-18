import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { PageShell } from "@/components/site/PageShell";

const cases = [
  {
    client: "Tourism South AU",
    title: "Salt of the Coast",
    discipline: "Brand Film · Direction · Edit",
    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80",
  },
  {
    client: "Form Architects",
    title: "Lines That Hold",
    discipline: "Documentary · Cinematography",
    img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80",
  },
  {
    client: "The Glasshouse",
    title: "Inside the Quiet",
    discipline: "Brand Film · Color · Sound",
    img: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1920&q=80",
  },
];

const services = [
  "Brand Films",
  "Documentary",
  "Direction",
  "Cinematography",
  "Editing & Post",
  "Color Grade",
  "Sound Design",
  "Production",
];

const MediaProduction = () => {
  return (
    <PageShell>
      <Manifesto />
      <CasesSection />
      <ServicesSection />
      <CTA />
    </PageShell>
  );
};

const Manifesto = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.3]);

  return (
    <section ref={ref} className="relative min-h-[110vh] w-full pt-32 md:pt-40 pb-20 px-6 md:px-10 overflow-hidden">
      <motion.div style={{ y, opacity }} className="max-w-7xl mx-auto">
        <p className="eyebrow mb-8">Media Production · Studio</p>
        <h1 className="font-display text-[14vw] md:text-[10vw] leading-[0.85] tracking-tighter text-foreground text-balance">
          We make <br />
          films that <br />
          <span className="italic text-primary">behave</span> like art.
        </h1>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5 md:col-start-7">
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
              An independent production studio working at the intersection of brand,
              culture and craft. Based in Australia. Made for the long-form world —
              campaigns, documentaries and films that earn their length.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

const CasesSection = () => {
  return (
    <section className="bg-background">
      {cases.map((c, i) => (
        <CaseRow key={c.title} c={c} index={i} />
      ))}
    </section>
  );
};

const CaseRow = ({ c, index }: { c: typeof cases[number]; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const titleX = useTransform(scrollYProgress, [0, 1], ["3%", "-3%"]);

  return (
    <div ref={ref} className="relative h-[110vh] w-full overflow-hidden border-t border-border/40">
      <motion.div style={{ y: imgY }} className="absolute inset-0 -top-[15%] -bottom-[15%]">
        <img src={c.img} alt={c.title} className="h-full w-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-background/40" />
      </motion.div>

      <div className="relative h-full max-w-7xl mx-auto px-6 md:px-10 flex flex-col justify-between py-20">
        <div className="flex items-start justify-between">
          <div>
            <p className="eyebrow text-foreground/80 mb-2">{String(index + 1).padStart(2, "0")} — Case Study</p>
            <p className="font-display text-xl text-foreground/90">{c.client}</p>
          </div>
          <p className="eyebrow text-foreground/80 hidden md:block">{c.discipline}</p>
        </div>

        <motion.h2
          style={{ x: titleX }}
          className="font-display text-[18vw] md:text-[14vw] leading-[0.85] tracking-tighter text-foreground text-balance"
        >
          {c.title}
        </motion.h2>
      </div>
    </div>
  );
};

const ServicesSection = () => (
  <section className="bg-surface-elevated py-32 md:py-40 px-6 md:px-10">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10">
      <div className="md:col-span-4">
        <p className="eyebrow mb-6">Capabilities</p>
        <h2 className="font-display text-5xl md:text-6xl text-foreground leading-[0.95]">
          End-to-end, <br />
          <span className="italic text-primary">in-house</span>.
        </h2>
      </div>
      <ul className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-x-10 divide-y divide-border/40">
        {services.map((s, i) => (
          <motion.li
            key={s}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.05 }}
            className="font-display text-3xl md:text-4xl text-foreground py-6 flex items-baseline justify-between"
          >
            <span>{s}</span>
            <span className="eyebrow text-muted-foreground">0{i + 1}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  </section>
);

const CTA = () => (
  <section className="bg-background py-32 md:py-40 px-6 md:px-10">
    <div className="max-w-5xl mx-auto text-center">
      <p className="eyebrow mb-6">Working together</p>
      <h2 className="font-display text-5xl md:text-7xl text-foreground leading-[0.95] text-balance">
        Have a film <span className="italic text-primary">in mind?</span>
      </h2>
      <Link
        to="/#contact"
        className="inline-block mt-10 px-10 py-5 border border-foreground/60 hover:bg-foreground hover:text-background transition-all duration-500 eyebrow"
      >
        Start a Project →
      </Link>
    </div>
  </section>
);

export default MediaProduction;
