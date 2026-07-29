-- SEC-2：移除四表 always-true RLS policy（USING(true) WITH CHECK(true) 對 authenticated）
--
-- 這四條 policy 允許任何 authenticated session 直接對表 insert/update/delete，
-- 繞過 server action。合法後台寫入一律經 service-role admin client（繞過 RLS，
-- 不受這些 policy 影響），公開站僅用 anon key 走 public SELECT policy 讀取（保留）。
-- 移除後，寫入旁路即被堵住；線上 advisor rls_policy_always_true ×4 應同步消失。
--
-- 對應 baseline.sql:166-167, 192-193, 198-199, 204-205；advisor lint 0024。

DROP POLICY IF EXISTS "Allow all access for authenticated users" ON public.about_profiles;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON public.project_images;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON public.project_works;
DROP POLICY IF EXISTS "Allow all access for authenticated users" ON public.social_links;
