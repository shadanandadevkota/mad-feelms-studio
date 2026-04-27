import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { PageShell } from "@/components/site/PageShell";
import { useSiteContent } from "@/hooks/useSiteContent";

const About = () => {
  return (
    <PageShell>
      <Hero />
      <Story />
      <Stats />
      <CTA />
    </PageShell>
  );
};

const Hero = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);
  const { value } = useSiteContent("page_about", {
    eyebrow: "About — Mad Feelms",
    title_lead: "We chase",
    title_accent: "feelings,",
    title_tail: "not just frames.",
    hero_image_url: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1920&q=80",
  });

  return (
    <section ref={ref} className="relative h-screen w-full overflow-hidden vignette">
      <motion.div style={{ y }} className="absolute inset-0">
        <img
          src={value.hero_image_url}
          alt="Mad Feelms studio"
          className="h-full w-full object-cover blur-in"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/20" />
      </motion.div>

      <div className="relative h-full max-w-7xl mx-auto px-6 md:px-10 flex flex-col justify-end pb-16 md:pb-24">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="eyebrow mb-6"
        >
          {value.eyebrow}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-[14vw] md:text-[10vw] leading-[0.85] tracking-tighter text-foreground text-balance max-w-5xl"
        >
          {value.title_lead} <span className="italic text-primary">{value.title_accent}</span> {value.title_tail}
        </motion.h1>
      </div>
    </section>
  );
};

const Story = () => {
  const { value } = useSiteContent("page_about", {
    body_1: "Mad Feelms is an Australian-based cinematic studio crafting weddings, commercials, editorials and media production. We translate the unseen — a glance, a pause, a breath — into images that endure.",
    body_2: "Made by a small team that obsesses over light, music and the in-between. We work slowly so the work feels alive.",
    body_image_url: "https://images.unsplash.com/photo-1518609571773-39b7d303a87b?w=1200&q=80",
  });

  return (
    <section className="py-24 md:py-32 px-6 md:px-10 bg-surface">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="md:col-span-6 aspect-[4/5] overflow-hidden bg-background"
        >
          <img
            src={value.body_image_url}
            alt="Behind the scenes"
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </motion.div>
        <div className="md:col-span-6">
          <p className="eyebrow mb-6">Studio</p>
          <p className="font-display text-3xl md:text-4xl text-foreground leading-[1.05] mb-8 text-balance">
            {value.body_1}
          </p>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-md">
            {value.body_2}
          </p>
        </div>
      </div>
    </section>
  );
};

const Stats = () => {
  const { value } = useSiteContent("page_about", {
    stat_1_value: "120+",
    stat_1_label: "Films",
    stat_2_value: "9",
    stat_2_label: "Countries",
    stat_3_value: "07",
    stat_3_label: "Years",
  });
  const stats = [
    { v: value.stat_1_value, l: value.stat_1_label },
    { v: value.stat_2_value, l: value.stat_2_label },
    { v: value.stat_3_value, l: value.stat_3_label },
  ];
  return (
    <section className="py-20 md:py-24 px-6 md:px-10 bg-background">
      <div className="max-w-5xl mx-auto grid grid-cols-3 gap-6 md:gap-12">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: i * 0.1 }}
            className="text-center"
          >
            <div className="font-display text-5xl md:text-7xl text-primary leading-none">{s.v}</div>
            <div className="eyebrow mt-3">{s.l}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const CTA = () => {
  const { value } = useSiteContent("page_about", {
    cta_eyebrow: "Working together",
    cta_title_lead: "Tell us your",
    cta_title_accent: "story.",
    cta_button_label: "Start a Project →",
  });
  return (
    <section className="py-24 md:py-32 px-6 md:px-10 bg-surface-elevated">
      <div className="max-w-5xl mx-auto text-center">
        <p className="eyebrow mb-6">{value.cta_eyebrow}</p>
        <h2 className="font-display text-5xl md:text-7xl text-foreground leading-[0.95] text-balance">
          {value.cta_title_lead} <span className="italic text-primary">{value.cta_title_accent}</span>
        </h2>
        <Link
          to="/#contact"
          className="inline-block mt-10 px-10 py-5 border border-foreground/60 hover:bg-foreground hover:text-background transition-all duration-500 eyebrow"
        >
          {value.cta_button_label}
        </Link>
      </div>
    </section>
  );
};

export default About;
