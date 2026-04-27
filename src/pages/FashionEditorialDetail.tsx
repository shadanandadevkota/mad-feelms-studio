import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { PageShell } from "@/components/site/PageShell";
import { supabase } from "@/integrations/supabase/client";
import { useCollection } from "@/hooks/useCollection";

type Credit = { label: string; value: string };

type Editorial = {
  id: string;
  slug: string;
  title: string;
  publication: string | null;
  year: string | null;
  cover_url: string | null;
  intro: string | null;
  credits: Credit[];
  gallery: string[];
};

const FashionEditorialDetail = () => {
  const { slug } = useParams();
  const [e, setE] = useState<Editorial | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!slug) return;
      const { data } = await supabase
        .from("editorial_projects")
        .select("*")
        .eq("slug", slug)
        .eq("is_visible", true)
        .maybeSingle();
      if (active) {
        setE(data as unknown as Editorial | null);
        setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <PageShell>
        <section className="min-h-screen" />
      </PageShell>
    );
  }

  if (!e) {
    return (
      <PageShell>
        <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
          <p className="eyebrow text-muted-foreground mb-4">Editorial not found</p>
          <Link to="/fashion-editorial" className="font-display text-3xl text-foreground hover:text-primary">
            ← All editorials
          </Link>
        </section>
      </PageShell>
    );
  }

  const credits = Array.isArray(e.credits) ? e.credits : [];
  const gallery = Array.isArray(e.gallery) ? e.gallery : [];

  return (
    <PageShell>
      <section className="pt-28 md:pt-32 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <Link to="/fashion-editorial" className="eyebrow text-muted-foreground hover:text-primary transition-colors">
            ← All editorials
          </Link>
        </div>
      </section>

      {e.cover_url && (
        <section className="mt-8 px-6 md:px-10">
          <div className="max-w-7xl mx-auto aspect-[16/10] md:aspect-[21/9] overflow-hidden bg-surface">
            <motion.img
              src={e.cover_url}
              alt={e.title}
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              className="h-full w-full object-cover"
            />
          </div>
        </section>
      )}

      <section className="py-20 md:py-28 px-6 md:px-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
          <div className="md:col-span-7">
            {(e.publication || e.year) && (
              <p className="eyebrow mb-4">
                {e.publication}
                {e.publication && e.year ? " · " : ""}
                {e.year}
              </p>
            )}
            <h1 className="font-display text-6xl md:text-8xl text-foreground leading-[0.9] text-balance">{e.title}</h1>
            {e.intro && <p className="mt-8 text-muted-foreground text-lg leading-relaxed max-w-xl">{e.intro}</p>}
          </div>
          {credits.length > 0 && (
            <div className="md:col-span-5">
              <p className="eyebrow mb-6">Credits</p>
              <dl className="space-y-4">
                {credits.map((c) => (
                  <div key={c.label} className="flex justify-between gap-4 border-b border-border/40 pb-3">
                    <dt className="eyebrow">{c.label}</dt>
                    <dd className="font-display text-foreground">{c.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </section>

      {gallery.length > 0 && (
        <section className="px-6 md:px-10 pb-32">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {gallery.map((src, i) => (
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
      )}

      <OtherEditorials currentSlug={e.slug} />
    </PageShell>
  );
};

type EditorialPreview = {
  id: string;
  slug: string;
  title: string;
  publication: string | null;
  year: string | null;
  cover_url: string | null;
  is_visible: boolean;
  sort_order: number;
};

const OtherEditorials = ({ currentSlug }: { currentSlug: string }) => {
  const { items } = useCollection<EditorialPreview>("editorial_projects");
  const others = items.filter((e) => e.slug !== currentSlug).slice(0, 6);
  if (!others.length) return null;
  return (
    <section className="bg-surface-elevated py-20 md:py-28 px-6 md:px-10 border-t border-border/40">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 md:mb-14 gap-4">
          <div>
            <p className="eyebrow mb-3">More editorials</p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-6xl text-foreground leading-[0.95]">
              Continue <span className="italic text-primary">reading</span>
            </h2>
          </div>
          <Link
            to="/fashion-editorial"
            className="self-start md:self-end inline-flex items-center gap-2 px-5 py-3 border border-foreground/40 hover:bg-foreground hover:text-background transition-all duration-500 eyebrow"
          >
            All editorials →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 blur-veil">
          {others.map((o, i) => (
            <motion.article
              key={o.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="blur-veil-item"
            >
              <Link to={`/fashion-editorial/${o.slug}`} className="group block aspect-[4/5] relative overflow-hidden bg-background">
                {o.cover_url && (
                  <img
                    src={o.cover_url}
                    alt={o.title}
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                  {(o.publication || o.year) && (
                    <p className="eyebrow mb-2">
                      {o.publication}
                      {o.publication && o.year ? " · " : ""}
                      {o.year}
                    </p>
                  )}
                  <h3 className="font-display text-xl sm:text-2xl md:text-3xl text-foreground leading-tight">{o.title}</h3>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FashionEditorialDetail;
