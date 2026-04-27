import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { PageShell } from "@/components/site/PageShell";
import { useCollection } from "@/hooks/useCollection";
import { useSiteContent } from "@/hooks/useSiteContent";

type Case = {
  id: string;
  client: string;
  title: string;
  discipline: string | null;
  image_url: string | null;
  is_visible: boolean;
  sort_order: number;
};

type Service = {
  id: string;
  name: string;
  is_visible: boolean;
  sort_order: number;
};

const MediaProduction = () => {
  const { items: cases } = useCollection<Case>("media_cases");
  const { items: services } = useCollection<Service>("media_services");
  const { value: copy } = useSiteContent("page_media_production", {
    title_line_1: "We make",
    title_line_2: "films that",
    title_accent: "behave",
    title_tail: "like art.",
    intro:
      "An independent production studio working at the intersection of brand, culture and craft. Based in Australia. Made for the long-form world — campaigns, documentaries and films that earn their length.",
    services_title_lead: "End-to-end,",
    services_title_accent: "in-house",
    cta_eyebrow: "Working together",
    cta_title_lead: "Have a film",
    cta_title_accent: "in mind?",
    cta_button_label: "Start a Project →",
    hero_image_url: "https://images.unsplash.com/photo-1500021804447-2ca2eaaaabeb?w=1920&q=80",
    hero_quote: "“The best films don't shout. They wait — until you can't look away.”",
    hero_quote_author: "— Studio Maxim",
  });

  return (
    <PageShell>
      <Manifesto copy={copy} />
      <CasesSection cases={cases} />
      <ServicesSection services={services} copy={copy} />
      <CTA copy={copy} />
    </PageShell>
  );
};

const Manifesto = ({ copy }: { copy: any }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.3]);
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section ref={ref} className="relative min-h-[110vh] w-full pt-32 md:pt-40 pb-20 px-6 md:px-10 overflow-hidden">
      {/* Background hero photo */}
      {copy.hero_image_url && (
        <motion.div style={{ y: imgY }} className="absolute inset-0 -top-[10%] -bottom-[10%]">
          <img
            src={copy.hero_image_url}
            alt="Media production set"
            className="h-full w-full object-cover blur-in"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        </motion.div>
      )}

      <motion.div style={{ y, opacity }} className="relative max-w-7xl mx-auto">
        <p className="eyebrow mb-8">Media Production · Studio</p>
        <h1 className="font-display text-[14vw] md:text-[10vw] leading-[0.85] tracking-tighter text-foreground text-balance">
          {copy.title_line_1} <br />
          {copy.title_line_2} <br />
          <span className="italic text-primary">{copy.title_accent}</span> {copy.title_tail}
        </h1>

        <div className="mt-16 md:mt-20 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-end">
          <div className="md:col-span-6">
            {copy.hero_quote && (
              <blockquote className="font-display text-2xl md:text-4xl text-foreground leading-[1.15] text-balance italic">
                {copy.hero_quote}
              </blockquote>
            )}
            {copy.hero_quote_author && (
              <p className="eyebrow mt-4 text-muted-foreground">{copy.hero_quote_author}</p>
            )}
          </div>
          <div className="md:col-span-5 md:col-start-8">
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">{copy.intro}</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

const CasesSection = ({ cases }: { cases: Case[] }) => {
  if (!cases.length) return null;
  return (
    <section className="bg-background">
      {cases.map((c, i) => (
        <CaseRow key={c.id} c={c} index={i} />
      ))}
    </section>
  );
};

const CaseRow = ({ c, index }: { c: Case; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const titleX = useTransform(scrollYProgress, [0, 1], ["3%", "-3%"]);

  return (
    <div ref={ref} className="relative h-[110vh] w-full overflow-hidden border-t border-border/40">
      <motion.div style={{ y: imgY }} className="absolute inset-0 -top-[15%] -bottom-[15%]">
        {c.image_url && <img src={c.image_url} alt={c.title} className="h-full w-full object-cover" loading="lazy" />}
        <div className="absolute inset-0 bg-background/40" />
      </motion.div>

      <div className="relative h-full max-w-7xl mx-auto px-6 md:px-10 flex flex-col justify-between py-20">
        <div className="flex items-start justify-between">
          <div>
            <p className="eyebrow text-foreground/80 mb-2">{String(index + 1).padStart(2, "0")} — Case Study</p>
            <p className="font-display text-xl text-foreground/90">{c.client}</p>
          </div>
          {c.discipline && <p className="eyebrow text-foreground/80 hidden md:block">{c.discipline}</p>}
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

const ServicesSection = ({ services, copy }: { services: Service[]; copy: any }) => (
  <section className="bg-surface-elevated py-32 md:py-40 px-6 md:px-10">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10">
      <div className="md:col-span-4">
        <p className="eyebrow mb-6">Capabilities</p>
        <h2 className="font-display text-5xl md:text-6xl text-foreground leading-[0.95]">
          {copy.services_title_lead} <br />
          <span className="italic text-primary">{copy.services_title_accent}</span>.
        </h2>
      </div>
      <ul className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-x-10 divide-y divide-border/40">
        {services.map((s, i) => (
          <motion.li
            key={s.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.05 }}
            className="font-display text-3xl md:text-4xl text-foreground py-6 flex items-baseline justify-between"
          >
            <span>{s.name}</span>
            <span className="eyebrow text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  </section>
);

const CTA = ({ copy }: { copy: any }) => (
  <section className="bg-background py-32 md:py-40 px-6 md:px-10">
    <div className="max-w-5xl mx-auto text-center">
      <p className="eyebrow mb-6">{copy.cta_eyebrow}</p>
      <h2 className="font-display text-5xl md:text-7xl text-foreground leading-[0.95] text-balance">
        {copy.cta_title_lead} <span className="italic text-primary">{copy.cta_title_accent}</span>
      </h2>
      <Link
        to="/#contact"
        className="inline-block mt-10 px-10 py-5 border border-foreground/60 hover:bg-foreground hover:text-background transition-all duration-500 eyebrow"
      >
        {copy.cta_button_label}
      </Link>
    </div>
  </section>
);

export default MediaProduction;
