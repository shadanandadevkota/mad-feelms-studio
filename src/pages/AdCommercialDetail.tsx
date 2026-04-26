import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { PageShell } from "@/components/site/PageShell";
import { supabase } from "@/integrations/supabase/client";

type StoryBlock = { side?: "left" | "right"; img?: string; eyebrow?: string; title?: string; body?: string };
type Credit = { label: string; value: string };

type AdProject = {
  id: string;
  slug: string;
  title: string;
  title_lead: string | null;
  title_accent: string | null;
  year: string | null;
  eyebrow: string | null;
  intro: string | null;
  hero_image_url: string | null;
  hero_video_url: string | null;
  credits: Credit[];
  story_blocks: StoryBlock[];
};

const AdCommercialDetail = () => {
  const { slug } = useParams();
  const [project, setProject] = useState<AdProject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!slug) return;
      const { data } = await supabase
        .from("ad_projects")
        .select("*")
        .eq("slug", slug)
        .eq("is_visible", true)
        .maybeSingle();
      if (active) {
        setProject(data as unknown as AdProject | null);
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

  if (!project) {
    return (
      <PageShell>
        <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
          <p className="eyebrow text-muted-foreground mb-4">Project not found</p>
          <Link to="/ad-commercials" className="font-display text-3xl text-foreground hover:text-primary">
            ← Back to commercials
          </Link>
        </section>
      </PageShell>
    );
  }

  const blocks = Array.isArray(project.story_blocks) ? project.story_blocks : [];
  const credits = Array.isArray(project.credits) ? project.credits : [];

  return (
    <PageShell>
      <section className="pt-32 md:pt-40 pb-20 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <Link to="/ad-commercials" className="eyebrow text-muted-foreground hover:text-primary transition-colors">
            ← Back to commercials
          </Link>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
            <div className="md:col-span-8">
              <p className="eyebrow mb-4">
                Commercial{project.year ? ` · ${project.year}` : ""}
              </p>
              <h1 className="font-display text-6xl md:text-8xl lg:text-9xl text-foreground leading-[0.9]">
                {project.title_lead ?? project.title}{" "}
                {project.title_accent && <span className="italic text-primary">{project.title_accent}</span>}
              </h1>
            </div>
            {credits.length > 0 && (
              <dl className="md:col-span-4 grid grid-cols-3 gap-4">
                {credits.slice(0, 3).map((c) => (
                  <div key={c.label}>
                    <dt className="eyebrow mb-1">{c.label}</dt>
                    <dd className="font-display text-foreground">{c.value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-10">
        <div className="max-w-7xl mx-auto aspect-[16/9] overflow-hidden bg-surface">
          {project.hero_video_url ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
              poster={project.hero_image_url ?? undefined}
            >
              <source src={project.hero_video_url} type="video/mp4" />
            </video>
          ) : project.hero_image_url ? (
            <img src={project.hero_image_url} alt={project.title} className="h-full w-full object-cover" />
          ) : null}
        </div>
      </section>

      {blocks.length > 0 && (
        <section className="py-24 md:py-32 px-6 md:px-10">
          <div className="max-w-7xl mx-auto space-y-24 md:space-y-32">
            {blocks.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className={`grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-14 items-center ${
                  b.side === "right" ? "md:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div className="md:col-span-7 aspect-[4/3] overflow-hidden bg-surface">
                  {b.img && <img src={b.img} alt={b.title ?? ""} className="h-full w-full object-cover" loading="lazy" />}
                </div>
                <div className="md:col-span-5">
                  {b.eyebrow && <p className="eyebrow mb-4">{b.eyebrow}</p>}
                  {b.title && (
                    <h2 className="font-display text-4xl md:text-5xl text-foreground leading-[1] mb-4 text-balance">
                      {b.title}
                    </h2>
                  )}
                  {b.body && <p className="text-muted-foreground leading-relaxed">{b.body}</p>}
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {project.intro && (
        <section className="px-6 md:px-10 pb-24">
          <div className="max-w-3xl mx-auto">
            <p className="text-muted-foreground text-lg leading-relaxed">{project.intro}</p>
          </div>
        </section>
      )}

      <section className="py-24 px-6 md:px-10 bg-surface-elevated">
        <div className="max-w-3xl mx-auto text-center">
          <p className="eyebrow mb-4">Next</p>
          <Link
            to="/ad-commercials"
            className="font-display text-4xl md:text-5xl text-foreground italic hover:text-primary transition-colors"
          >
            See more commercials →
          </Link>
        </div>
      </section>
    </PageShell>
  );
};

export default AdCommercialDetail;
