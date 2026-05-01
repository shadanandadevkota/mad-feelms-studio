-- Extend wedding_films with detail-page fields
ALTER TABLE public.wedding_films
  ADD COLUMN IF NOT EXISTS slug text,
  ADD COLUMN IF NOT EXISTS video_url text,
  ADD COLUMN IF NOT EXISTS intro text,
  ADD COLUMN IF NOT EXISTS credits jsonb NOT NULL DEFAULT '[]'::jsonb;

-- Backfill slugs for any existing rows so detail routes can resolve
UPDATE public.wedding_films
SET slug = lower(regexp_replace(coalesce(title,'film-' || left(id::text,8)), '[^a-zA-Z0-9]+','-','g'))
WHERE slug IS NULL OR slug = '';

CREATE UNIQUE INDEX IF NOT EXISTS wedding_films_slug_unique ON public.wedding_films (slug);

-- About Stories collection (editorial-style entries on /about)
CREATE TABLE IF NOT EXISTS public.about_stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  eyebrow text,
  body text,
  image_url text,
  link_url text,
  sort_order integer NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.about_stories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read about_stories"
  ON public.about_stories FOR SELECT TO public USING (true);

CREATE POLICY "Admins insert about_stories"
  ON public.about_stories FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins update about_stories"
  ON public.about_stories FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins delete about_stories"
  ON public.about_stories FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER about_stories_touch_updated
BEFORE UPDATE ON public.about_stories
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();