import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { PageShell } from "@/components/site/PageShell";
import { useCollection } from "@/hooks/useCollection";
import { useSiteContent } from "@/hooks/useSiteContent";

type Photo = { id: string; image_url: string; col_span: string; aspect: string; caption: string | null; sort_order: number; is_visible: boolean };
type Film = { id: string; title: string; place: string | null; year: string | null; image_url: string | null; sort_order: number; is_visible: boolean };

const WeddingPhotos = () => {
  return (
    <PageShell>
      <Header />
      <PhotosSection />
      <FilmsSection />
      <BookSection />
    </PageShell>
  );
};

const Header = () => {
  const { value } = useSiteContent("page_wedding_photos", {
    title_lead: "Wedding by",
    title_accent: "Maddyyy",
    eyebrow: "Photographs · Selected",
    intro: "A quiet edit — chosen frames from a season of weddings, told as they happened.",
    book_title: "Book your wedding date",
    book_body: "Limited dates each season. Send us your date, location and a few words about the two of you.",
  });
  return (
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
  );
};

const PhotosSection = () => {
  const { items: photos } = useCollection<Photo>("wedding_photos");
  return (
    <section className="px-6 md:px-10 pb-32">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5">
        {photos.map((p, i) => (
          <motion.figure
            key={p.id}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, delay: (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className={`relative overflow-hidden bg-surface ${p.col_span} ${p.aspect}`}
          >
            <img
              src={p.image_url}
              alt={p.caption ?? `Wedding photo ${i + 1}`}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] hover:scale-105"
              loading="lazy"
            />
          </motion.figure>
        ))}
      </div>
    </section>
  );
};

/** Films section — overlaps the previous via sticky-like spacing */
const FilmsSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["8%", "0%"]);
  const radius = useTransform(scrollYProgress, [0, 1], ["48px 48px 0 0", "0px"]);

  return (
    <motion.section
      ref={ref}
      style={{ y, borderRadius: radius }}
      className="relative z-10 bg-surface-elevated py-24 md:py-32 px-6 md:px-10 -mt-16"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14 gap-4">
          <div>
            <p className="eyebrow mb-3">Films</p>
            <h2 className="font-display text-4xl md:text-6xl text-foreground leading-[0.95]">
              Recent <span className="italic text-primary">stories</span>
            </h2>
          </div>
          <p className="text-muted-foreground text-sm max-w-xs">
            Hover any film to see it move. Each is a chapter of the day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {films.map((f, i) => (
            <motion.article
              key={f.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group relative aspect-[3/4] overflow-hidden bg-background"
            >
              <img
                src={f.img}
                alt={`${f.title} wedding film`}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="eyebrow mb-2">{f.place} · {f.year}</p>
                <h3 className="font-display text-2xl md:text-3xl text-foreground">{f.title}</h3>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

/** Book section — overlaps Films */
const BookSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["8%", "0%"]);
  const radius = useTransform(scrollYProgress, [0, 1], ["48px 48px 0 0", "0px"]);

  return (
    <motion.section
      ref={ref}
      style={{ y, borderRadius: radius }}
      className="relative z-20 bg-background py-24 md:py-32 px-6 md:px-10 -mt-16"
    >
      <div className="max-w-5xl mx-auto text-center">
        <p className="eyebrow mb-6">Reserve</p>
        <h2 className="font-display text-5xl md:text-7xl text-foreground leading-[0.95] text-balance">
          Book your <span className="italic text-primary">wedding date</span>
        </h2>
        <p className="text-muted-foreground mt-6 max-w-md mx-auto">
          Limited dates each season. Send us your date, location and a few words about
          the two of you.
        </p>
        <Link
          to="/#contact"
          className="inline-block mt-10 px-10 py-5 border border-foreground/60 hover:bg-foreground hover:text-background transition-all duration-500 eyebrow"
        >
          Enquire Now →
        </Link>
      </div>
    </motion.section>
  );
};

export default WeddingPhotos;
