import { Link } from "react-router-dom";

import { PageShell } from "@/components/site/PageShell";
import { useCollection } from "@/hooks/useCollection";
import { useSiteContent } from "@/hooks/useSiteContent";

type Film = {
  id: string;
  slug: string | null;
  title: string;
  place: string | null;
  year: string | null;
  image_url: string | null;
  sort_order: number;
  is_visible: boolean;
};

const WeddingFilms = () => {
  const { items: films } = useCollection<Film>("wedding_films");
  const { value } = useSiteContent("page_wedding_films", {
    eyebrow: "Films · Selected",
    title_lead: "Wedding",
    title_accent: "films",
    intro: "A library of recent stories — quiet, slow and exact. Each linked from its own page.",
  });

  return (
    <PageShell>
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

      <section className="px-6 md:px-10 pb-24 md:pb-32">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 blur-veil">
          {films.map((f, i) => {
            const Wrapper: any = f.slug ? Link : "div";
            const wrapperProps: any = f.slug ? { to: `/wedding/films/${f.slug}` } : {};
            return (
              <Wrapper
                key={f.id}
                {...wrapperProps}
                className="blur-veil-item scatter-in group relative aspect-[3/4] overflow-hidden bg-surface block"
                style={{
                  ["--scatter-delay" as any]: `${(i % 6) * 90}ms`,
                  ["--scatter-x" as any]: `${(i % 2 ? -1 : 1) * (6 + (i % 3) * 2)}%`,
                  ["--scatter-y" as any]: `${8 + (i % 4) * 3}%`,
                  ["--scatter-r" as any]: `${(i % 2 ? -1 : 1) * (1 + (i % 3))}deg`,
                }}
              >
                {f.image_url && (
                  <img
                    src={f.image_url}
                    alt={`${f.title} wedding film`}
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="eyebrow mb-2">
                    {f.place}{f.place && f.year ? " · " : ""}{f.year}
                  </p>
                  <h3 className="font-display text-2xl md:text-3xl text-foreground">{f.title}</h3>
                </div>
              </Wrapper>
            );
          })}
          {films.length === 0 && (
            <p className="text-muted-foreground text-sm col-span-full">No films yet.</p>
          )}
        </div>
      </section>
    </PageShell>
  );
};

export default WeddingFilms;
