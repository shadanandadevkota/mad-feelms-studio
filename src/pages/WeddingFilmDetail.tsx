import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { PageShell } from "@/components/site/PageShell";
import { supabase } from "@/integrations/supabase/client";
import { useCollection } from "@/hooks/useCollection";
import { Play } from "lucide-react";

type Credit = { label: string; value: string };

type Film = {
  id: string;
  slug: string | null;
  title: string;
  place: string | null;
  year: string | null;
  image_url: string | null;
  video_url: string | null;
  intro: string | null;
  credits: Credit[];
};

type FilmPreview = {
  id: string;
  slug: string | null;
  title: string;
  place: string | null;
  year: string | null;
  image_url: string | null;
  is_visible: boolean;
  sort_order: number;
};

const isYouTube = (u: string) => /youtube\.com|youtu\.be/.test(u);
const isVimeo = (u: string) => /vimeo\.com/.test(u);

const toEmbed = (url: string): string | null => {
  try {
    const u = new URL(url);
    if (isYouTube(url)) {
      const id = u.hostname.includes("youtu.be")
        ? u.pathname.slice(1)
        : u.searchParams.get("v");
      if (!id) return null;
      return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
    }
    if (isVimeo(url)) {
      const id = u.pathname.split("/").filter(Boolean).pop();
      return id ? `https://player.vimeo.com/video/${id}?autoplay=1` : null;
    }
    return null;
  } catch {
    return null;
  }
};

const WeddingFilmDetail = () => {
  const { slug } = useParams();
  const [film, setFilm] = useState<Film | null>(null);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!slug) return;
      const { data } = await supabase
        .from("wedding_films")
        .select("*")
        .eq("slug", slug)
        .eq("is_visible", true)
        .maybeSingle();
      if (active) {
        setFilm(data as unknown as Film | null);
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

  if (!film) {
    return (
      <PageShell>
        <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
          <p className="eyebrow text-muted-foreground mb-4">Film not found</p>
          <Link to="/wedding/films" className="font-display text-3xl text-foreground hover:text-primary">
            ← All films
          </Link>
        </section>
      </PageShell>
    );
  }

  const credits = Array.isArray(film.credits) ? film.credits : [];
  const embed = film.video_url ? toEmbed(film.video_url) : null;
  const directMp4 = film.video_url && /\.(mp4|webm|mov)(\?|$)/i.test(film.video_url);

  return (
    <PageShell>
      <section className="pt-28 md:pt-32 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <Link to="/wedding/films" className="eyebrow text-muted-foreground hover:text-primary transition-colors">
            ← All films
          </Link>
        </div>
      </section>

      {/* Player / hero */}
      <section className="mt-8 px-6 md:px-10">
        <div className="max-w-7xl mx-auto aspect-[16/9] relative overflow-hidden bg-surface">
          {playing && embed ? (
            <iframe
              src={embed}
              title={film.title}
              className="absolute inset-0 h-full w-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          ) : playing && directMp4 ? (
            <video src={film.video_url!} className="h-full w-full object-cover" autoPlay controls />
          ) : (
            <>
              {film.image_url && (
                <motion.img
                  src={film.image_url}
                  alt={film.title}
                  initial={{ scale: 1.1, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full w-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
              {film.video_url && (
                <button
                  onClick={() => {
                    if (embed || directMp4) setPlaying(true);
                    else window.open(film.video_url!, "_blank", "noopener");
                  }}
                  className="absolute inset-0 flex items-center justify-center group"
                  aria-label="Play film"
                >
                  <span className="h-20 w-20 md:h-24 md:w-24 rounded-full bg-primary/90 flex items-center justify-center transition-transform duration-500 group-hover:scale-110 shadow-[0_0_60px_-10px_hsl(var(--primary)/0.7)]">
                    <Play className="h-8 w-8 md:h-10 md:w-10 text-primary-foreground translate-x-0.5" fill="currentColor" />
                  </span>
                </button>
              )}
            </>
          )}
        </div>
      </section>

      {/* Title + credits */}
      <section className="py-20 md:py-28 px-6 md:px-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
          <div className="md:col-span-7">
            {(film.place || film.year) && (
              <p className="eyebrow mb-4">
                {film.place}
                {film.place && film.year ? " · " : ""}
                {film.year}
              </p>
            )}
            <h1 className="font-display text-6xl md:text-8xl text-foreground leading-[0.9] text-balance">
              {film.title}
            </h1>
            {film.intro && (
              <p className="mt-8 text-muted-foreground text-lg leading-relaxed max-w-xl">{film.intro}</p>
            )}
            {film.video_url && !embed && !directMp4 && (
              <a
                href={film.video_url}
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-8 px-6 py-3 border border-foreground/40 hover:bg-foreground hover:text-background transition-all duration-500 eyebrow"
              >
                Watch the film →
              </a>
            )}
          </div>
          {credits.length > 0 && (
            <div className="md:col-span-5">
              <p className="eyebrow mb-6">Credits</p>
              <dl className="space-y-4">
                {credits.map((c, i) => (
                  <div key={`${c.label}-${i}`} className="flex justify-between gap-4 border-b border-border/40 pb-3">
                    <dt className="eyebrow">{c.label}</dt>
                    <dd className="font-display text-foreground text-right">{c.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </section>

      <OtherFilms currentSlug={film.slug ?? ""} />
    </PageShell>
  );
};

const OtherFilms = ({ currentSlug }: { currentSlug: string }) => {
  const { items } = useCollection<FilmPreview>("wedding_films");
  const others = items.filter((f) => f.slug && f.slug !== currentSlug).slice(0, 6);
  if (!others.length) return null;
  return (
    <section className="bg-surface-elevated py-20 md:py-28 px-6 md:px-10 border-t border-border/40">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 md:mb-14 gap-4">
          <div>
            <p className="eyebrow mb-3">More films</p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-6xl text-foreground leading-[0.95]">
              Continue <span className="italic text-primary">watching</span>
            </h2>
          </div>
          <Link
            to="/wedding/films"
            className="self-start md:self-end inline-flex items-center gap-2 px-5 py-3 border border-foreground/40 hover:bg-foreground hover:text-background transition-all duration-500 eyebrow"
          >
            All films →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 blur-veil">
          {others.map((o, i) => (
            <Link
              key={o.id}
              to={`/wedding/films/${o.slug}`}
              className="blur-veil-item scatter-in group block aspect-[4/5] relative overflow-hidden bg-background"
              style={{ ["--scatter-delay" as any]: `${i * 80}ms`, ["--scatter-x" as any]: `${(i % 2 ? -1 : 1) * 6}%`, ["--scatter-y" as any]: `${10 + (i % 3) * 4}%`, ["--scatter-r" as any]: `${(i % 2 ? -1 : 1) * 1.5}deg` }}
            >
              {o.image_url && (
                <img src={o.image_url} alt={o.title} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                {(o.place || o.year) && (
                  <p className="eyebrow mb-2">
                    {o.place}
                    {o.place && o.year ? " · " : ""}
                    {o.year}
                  </p>
                )}
                <h3 className="font-display text-xl sm:text-2xl md:text-3xl text-foreground leading-tight">{o.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WeddingFilmDetail;
