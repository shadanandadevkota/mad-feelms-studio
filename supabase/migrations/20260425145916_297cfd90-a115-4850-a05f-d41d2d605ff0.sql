
-- Generic timestamp trigger function (re-use existing touch_updated_at)

-- ============== WORK ITEMS (Home selected work) ==============
CREATE TABLE public.work_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  href TEXT NOT NULL,
  image_url TEXT,
  video_url TEXT,
  meta TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.work_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read work_items" ON public.work_items FOR SELECT USING (true);
CREATE POLICY "Admins insert work_items" ON public.work_items FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update work_items" ON public.work_items FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete work_items" ON public.work_items FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE TRIGGER work_items_touch BEFORE UPDATE ON public.work_items FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE INDEX work_items_sort_idx ON public.work_items (sort_order);

-- ============== WEDDING FILMS ==============
CREATE TABLE public.wedding_films (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  place TEXT,
  year TEXT,
  image_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.wedding_films ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read wedding_films" ON public.wedding_films FOR SELECT USING (true);
CREATE POLICY "Admins insert wedding_films" ON public.wedding_films FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update wedding_films" ON public.wedding_films FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete wedding_films" ON public.wedding_films FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE TRIGGER wedding_films_touch BEFORE UPDATE ON public.wedding_films FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE INDEX wedding_films_sort_idx ON public.wedding_films (sort_order);

-- ============== WEDDING PHOTOS ==============
CREATE TABLE public.wedding_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  col_span TEXT NOT NULL DEFAULT 'md:col-span-6',
  aspect TEXT NOT NULL DEFAULT 'aspect-[4/5]',
  caption TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.wedding_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read wedding_photos" ON public.wedding_photos FOR SELECT USING (true);
CREATE POLICY "Admins insert wedding_photos" ON public.wedding_photos FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update wedding_photos" ON public.wedding_photos FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete wedding_photos" ON public.wedding_photos FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE TRIGGER wedding_photos_touch BEFORE UPDATE ON public.wedding_photos FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE INDEX wedding_photos_sort_idx ON public.wedding_photos (sort_order);

-- ============== AD PROJECTS ==============
CREATE TABLE public.ad_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  title_lead TEXT,
  title_accent TEXT,
  year TEXT,
  hero_image_url TEXT,
  hero_video_url TEXT,
  eyebrow TEXT,
  intro TEXT,
  credits JSONB NOT NULL DEFAULT '[]'::jsonb,
  story_blocks JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.ad_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read ad_projects" ON public.ad_projects FOR SELECT USING (true);
CREATE POLICY "Admins insert ad_projects" ON public.ad_projects FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update ad_projects" ON public.ad_projects FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete ad_projects" ON public.ad_projects FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE TRIGGER ad_projects_touch BEFORE UPDATE ON public.ad_projects FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE INDEX ad_projects_sort_idx ON public.ad_projects (sort_order);

-- ============== EDITORIAL PROJECTS ==============
CREATE TABLE public.editorial_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  publication TEXT,
  year TEXT,
  cover_url TEXT,
  intro TEXT,
  grid_pos TEXT NOT NULL DEFAULT 'col-span-1 md:col-span-3 md:row-span-1',
  credits JSONB NOT NULL DEFAULT '[]'::jsonb,
  gallery JSONB NOT NULL DEFAULT '[]'::jsonb,
  sort_order INT NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.editorial_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read editorial_projects" ON public.editorial_projects FOR SELECT USING (true);
CREATE POLICY "Admins insert editorial_projects" ON public.editorial_projects FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update editorial_projects" ON public.editorial_projects FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete editorial_projects" ON public.editorial_projects FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE TRIGGER editorial_projects_touch BEFORE UPDATE ON public.editorial_projects FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE INDEX editorial_projects_sort_idx ON public.editorial_projects (sort_order);

-- ============== MEDIA CASES ==============
CREATE TABLE public.media_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client TEXT NOT NULL,
  title TEXT NOT NULL,
  discipline TEXT,
  image_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.media_cases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read media_cases" ON public.media_cases FOR SELECT USING (true);
CREATE POLICY "Admins insert media_cases" ON public.media_cases FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update media_cases" ON public.media_cases FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete media_cases" ON public.media_cases FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE TRIGGER media_cases_touch BEFORE UPDATE ON public.media_cases FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE INDEX media_cases_sort_idx ON public.media_cases (sort_order);

-- ============== MEDIA SERVICES ==============
CREATE TABLE public.media_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.media_services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read media_services" ON public.media_services FOR SELECT USING (true);
CREATE POLICY "Admins insert media_services" ON public.media_services FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update media_services" ON public.media_services FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete media_services" ON public.media_services FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE TRIGGER media_services_touch BEFORE UPDATE ON public.media_services FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE INDEX media_services_sort_idx ON public.media_services (sort_order);
