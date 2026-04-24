-- 1. Roles enum + user_roles table
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security-definer helper to avoid recursive RLS
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  );
$$;

-- user_roles policies: users see their own roles; admins see all and manage all
CREATE POLICY "Users view own roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins view all roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins insert roles"
  ON public.user_roles FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update roles"
  ON public.user_roles FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete roles"
  ON public.user_roles FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 2. site_content table — editable key/value JSON content
CREATE TABLE public.site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read site content"
  ON public.site_content FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Admins insert site content"
  ON public.site_content FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update site content"
  ON public.site_content FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete site content"
  ON public.site_content FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER site_content_updated_at
  BEFORE UPDATE ON public.site_content
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 3. Tighten contact_submissions: admins can read & delete
CREATE POLICY "Admins read contact submissions"
  ON public.contact_submissions FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete contact submissions"
  ON public.contact_submissions FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 4. Seed default content
INSERT INTO public.site_content (key, value, description) VALUES
  ('footer', jsonb_build_object(
      'tagline', 'An Australian-based cinematic production house — capturing the unscripted, the considered, and everything between.',
      'email', 'hello@madfeelms.com',
      'cta_label', 'Start a Project →',
      'copyright_note', 'Crafted with care'
    ), 'Footer copy block'),
  ('socials', jsonb_build_object(
      'instagram', 'https://instagram.com/madfeelms',
      'youtube', 'https://youtube.com/@madfeelms',
      'email', 'hello@madfeelms.com'
    ), 'Social + contact links'),
  ('hero', jsonb_build_object(
      'title_lead', 'MAD',
      'title_accent', 'FEELMS',
      'eyebrow', 'Cinematic Production · Australia',
      'top_eyebrow', 'Showreel · 2026'
    ), 'Home hero copy'),
  ('page_wedding', jsonb_build_object('title', 'Wedding Films', 'intro', 'Cinematic wedding stories.'), 'Wedding page copy'),
  ('page_ad_commercials', jsonb_build_object('title', 'Ad Commercials', 'intro', 'Brand stories that move.'), 'Ad Commercials page copy'),
  ('page_fashion_editorial', jsonb_build_object('title', 'Fashion Editorial', 'intro', 'Editorial fashion films.'), 'Fashion Editorial page copy'),
  ('page_media_production', jsonb_build_object('title', 'Media Production', 'intro', 'End-to-end production.'), 'Media Production page copy');
