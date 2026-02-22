-- =============================================================================
-- Baseline Migration: Production Schema Snapshot (2026-02-21)
-- Source: diwxkpiwnirlvngldcoi (Lin ChaoYu - Production)
--
-- 此檔案記錄 production 資料庫的完整 schema。
-- 不會被 push 到已存在的資料庫，會用 `supabase migration repair` 
-- 標記為 applied。
-- =============================================================================

-- ---------------------------------------------------------------------------
-- TABLES
-- ---------------------------------------------------------------------------

-- about_profiles
CREATE TABLE IF NOT EXISTS public.about_profiles (
  locale text NOT NULL,
  bio text NOT NULL,
  profile_image_url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT about_profiles_pkey PRIMARY KEY (locale)
);

-- home_kv_frames
CREATE TABLE IF NOT EXISTS public.home_kv_frames (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  url text NOT NULL,
  alt text,
  order_index integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT home_kv_frames_pkey PRIMARY KEY (id)
);

-- illustration_works
CREATE TABLE IF NOT EXISTS public.illustration_works (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  url text NOT NULL,
  alt text,
  year text NOT NULL,
  is_active boolean DEFAULT true,
  order_index integer DEFAULT 0,
  width integer NOT NULL,
  height integer NOT NULL,
  CONSTRAINT illustration_works_pkey PRIMARY KEY (id)
);

-- manga_works (必須在 manga_images 之前建立，因為有 FK 依賴)
CREATE TABLE IF NOT EXISTS public.manga_works (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  year text NOT NULL,
  title_zh text,
  title_en text,
  summary_zh text,
  summary_en text,
  cover_url text NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  is_active boolean DEFAULT true,
  width integer NOT NULL,
  height integer NOT NULL,
  CONSTRAINT manga_works_pkey PRIMARY KEY (id)
);

-- manga_images
CREATE TABLE IF NOT EXISTS public.manga_images (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  manga_id uuid REFERENCES public.manga_works(id),
  url text NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  width integer NOT NULL,
  height integer NOT NULL,
  locale text,
  CONSTRAINT manga_images_pkey PRIMARY KEY (id)
);

-- nav_items
CREATE TABLE IF NOT EXISTS public.nav_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  key text NOT NULL,
  href text,
  parent_id uuid REFERENCES public.nav_items(id),
  order_index integer NOT NULL DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT nav_items_pkey PRIMARY KEY (id),
  CONSTRAINT nav_items_key_key UNIQUE (key)
);

-- project_works (必須在 project_images 之前建立)
CREATE TABLE IF NOT EXISTS public.project_works (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  slug text NOT NULL,
  title_zh text,
  title_en text,
  subtitle_zh text,
  subtitle_en text,
  description_zh text,
  description_en text,
  cover_url text NOT NULL,
  order_index integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT project_works_pkey PRIMARY KEY (id),
  CONSTRAINT project_works_slug_key UNIQUE (slug)
);

-- project_images
CREATE TABLE IF NOT EXISTS public.project_images (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES public.project_works(id),
  url text NOT NULL,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  width integer NOT NULL,
  height integer NOT NULL,
  CONSTRAINT project_images_pkey PRIMARY KEY (id)
);

-- social_links
CREATE TABLE IF NOT EXISTS public.social_links (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  label text NOT NULL,
  url text NOT NULL,
  logo_url text NOT NULL,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT social_links_pkey PRIMARY KEY (id)
);

-- ui_translations
CREATE TABLE IF NOT EXISTS public.ui_translations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  key text NOT NULL,
  locale text NOT NULL,
  value text NOT NULL,
  namespace text,
  "updatedAt" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT translations_pkey PRIMARY KEY (id)
);

-- ---------------------------------------------------------------------------
-- ENABLE ROW LEVEL SECURITY
-- ---------------------------------------------------------------------------

ALTER TABLE public.about_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.home_kv_frames ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.illustration_works ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manga_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manga_works ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nav_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_works ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ui_translations ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- RLS POLICIES
-- ---------------------------------------------------------------------------

-- about_profiles
CREATE POLICY "Allow all access for authenticated users" ON public.about_profiles
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Enable public read access on about_profiles" ON public.about_profiles
  FOR SELECT TO public USING (true);

-- home_kv_frames
CREATE POLICY "Enable read access for all users" ON public.home_kv_frames
  FOR SELECT TO public USING (true);

-- illustration_works
CREATE POLICY "Allow public read access" ON public.illustration_works
  FOR SELECT TO public USING (true);

-- manga_images
CREATE POLICY "Public read access" ON public.manga_images
  FOR SELECT TO public USING (true);

-- manga_works
CREATE POLICY "Public read access" ON public.manga_works
  FOR SELECT TO public USING (true);

-- nav_items
CREATE POLICY "Public read nav_items" ON public.nav_items
  FOR SELECT TO public USING (true);

-- project_images
CREATE POLICY "Enable all for authenticated users" ON public.project_images
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public read access" ON public.project_images
  FOR SELECT TO public USING (true);

-- project_works
CREATE POLICY "Enable all for authenticated users" ON public.project_works
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public read access" ON public.project_works
  FOR SELECT TO public USING (true);

-- social_links
CREATE POLICY "Allow all access for authenticated users" ON public.social_links
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Enable public read access on social_links" ON public.social_links
  FOR SELECT TO public USING (true);

-- ui_translations
CREATE POLICY "Public read access" ON public.ui_translations
  FOR SELECT TO public USING (true);

-- ---------------------------------------------------------------------------
-- FUNCTIONS
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.extract_cloudinary_public_id(cloudinary_url text)
 RETURNS text
 LANGUAGE plpgsql
 IMMUTABLE
AS $function$
DECLARE
  clean_path text;
BEGIN
  IF cloudinary_url IS NULL THEN RETURN NULL; END IF;
  clean_path := regexp_replace(cloudinary_url, '^.*?/upload/', '');
  clean_path := regexp_replace(clean_path, '^v\d+/', '');
  RETURN regexp_replace(clean_path, '\.[^.]+$', '');
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_distinct_years()
 RETURNS TABLE(year text)
 LANGUAGE sql
 SET search_path TO ''
AS $function$
SELECT DISTINCT year
FROM public.illustration_works
WHERE is_active = true
ORDER BY year DESC;
$function$;

CREATE OR REPLACE FUNCTION public.sync_all_nav_items()
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
  PERFORM sync_illustration_nav();
  PERFORM sync_project_nav();
END;
$function$;

CREATE OR REPLACE FUNCTION public.sync_illustration_nav()
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
  parent_nav_id uuid;
  year_record record;
  nav_key text;
  nav_href text;
  current_order int := 0;
  old_keys text[];
BEGIN
  SELECT id INTO parent_nav_id 
  FROM public.nav_items 
  WHERE key = 'illustration' AND parent_id IS NULL;

  SELECT ARRAY_AGG(key) INTO old_keys
  FROM public.nav_items
  WHERE parent_id = parent_nav_id;

  IF old_keys IS NOT NULL THEN
    DELETE FROM public.ui_translations
    WHERE namespace = 'navbar' AND key = ANY(old_keys);
  END IF;

  DELETE FROM public.nav_items 
  WHERE parent_id = parent_nav_id;

  FOR year_record IN 
    SELECT DISTINCT year 
    FROM public.illustration_works 
    WHERE is_active = true 
    ORDER BY year DESC
  LOOP
    nav_key := 'illustration__' || REPLACE(year_record.year, '-', '_');
    nav_href := '/illustration/' || year_record.year;
    
    INSERT INTO public.nav_items (key, href, parent_id, order_index, is_active)
    VALUES (nav_key, nav_href, parent_nav_id, current_order, true);

    INSERT INTO public.ui_translations (namespace, key, locale, value)
    VALUES ('navbar', nav_key, 'zh', year_record.year),
           ('navbar', nav_key, 'en', year_record.year);
    
    current_order := current_order + 1;
  END LOOP;
END;
$function$;

CREATE OR REPLACE FUNCTION public.sync_project_nav()
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
  parent_nav_id uuid;
  project_record record;
  nav_key text;
  nav_href text;
  current_order int := 0;
  old_keys text[];
BEGIN
  SELECT id INTO parent_nav_id 
  FROM public.nav_items 
  WHERE key = 'project' AND parent_id IS NULL;

  SELECT ARRAY_AGG(key) INTO old_keys
  FROM public.nav_items
  WHERE parent_id = parent_nav_id;

  IF old_keys IS NOT NULL THEN
    DELETE FROM public.ui_translations
    WHERE namespace = 'navbar' AND key = ANY(old_keys);
  END IF;

  DELETE FROM public.nav_items 
  WHERE parent_id = parent_nav_id;

  FOR project_record IN 
    SELECT slug, title_zh, title_en
    FROM public.project_works 
    WHERE is_active = true 
    ORDER BY order_index
  LOOP
    nav_key := 'project__' || REPLACE(project_record.slug, '-', '_');
    nav_href := '/project/' || project_record.slug;
    
    INSERT INTO public.nav_items (key, href, parent_id, order_index, is_active)
    VALUES (nav_key, nav_href, parent_nav_id, current_order, true);

    INSERT INTO public.ui_translations (namespace, key, locale, value)
    VALUES ('navbar', nav_key, 'zh', COALESCE(project_record.title_zh, project_record.slug)),
           ('navbar', nav_key, 'en', COALESCE(project_record.title_en, project_record.slug));
    
    current_order := current_order + 1;
  END LOOP;
END;
$function$;

CREATE OR REPLACE FUNCTION public.trigger_sync_illustration_nav()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'DELETE' THEN
    PERFORM sync_illustration_nav();
    RETURN NULL;
  END IF;
  
  IF TG_OP = 'UPDATE' THEN
    IF OLD.year IS DISTINCT FROM NEW.year 
       OR OLD.is_active IS DISTINCT FROM NEW.is_active THEN
      PERFORM sync_illustration_nav();
    END IF;
    RETURN NULL;
  END IF;
  
  RETURN NULL;
END;
$function$;

CREATE OR REPLACE FUNCTION public.trigger_sync_project_nav()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'DELETE' THEN
    PERFORM sync_project_nav();
    RETURN NULL;
  END IF;
  
  IF TG_OP = 'UPDATE' THEN
    IF OLD.slug IS DISTINCT FROM NEW.slug 
       OR OLD.is_active IS DISTINCT FROM NEW.is_active
       OR OLD.order_index IS DISTINCT FROM NEW.order_index THEN
      PERFORM sync_project_nav();
    END IF;
    RETURN NULL;
  END IF;
  
  RETURN NULL;
END;
$function$;

-- ---------------------------------------------------------------------------
-- TRIGGERS
-- ---------------------------------------------------------------------------

CREATE TRIGGER sync_nav_on_illustration_change
  AFTER INSERT OR UPDATE OR DELETE ON public.illustration_works
  FOR EACH ROW
  EXECUTE FUNCTION trigger_sync_illustration_nav();

CREATE TRIGGER sync_nav_on_project_change
  AFTER INSERT OR UPDATE OR DELETE ON public.project_works
  FOR EACH ROW
  EXECUTE FUNCTION trigger_sync_project_nav();
