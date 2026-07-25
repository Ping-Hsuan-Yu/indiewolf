-- SEC-2：移除四表 always-true RLS policy（USING(true) WITH CHECK(true) 對 authenticated）
DROP POLICY IF EXISTS "Allow all access for authenticated users" ON public.about_profiles;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON public.project_images;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON public.project_works;
DROP POLICY IF EXISTS "Allow all access for authenticated users" ON public.social_links;
