-- webtoon_works: 網路漫畫（無年份、無內頁圖，改為單一外部連結）
create table if not exists public.webtoon_works (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default timezone('utc'::text, now()),
  title_zh text,
  title_en text,
  summary_zh text,
  summary_en text,
  cover_url text not null,
  external_url text not null,
  order_index integer not null default 0,
  is_active boolean default true,
  width integer not null,
  height integer not null
);

alter table public.webtoon_works enable row level security;

create policy "Public read access" on public.webtoon_works
  for select to public using (true);

-- nav 分頁 label
insert into public.ui_translations (namespace, key, locale, value) values
  ('navbar', 'manga__webtoon', 'zh', 'WEBTOON'),
  ('navbar', 'manga__webtoon', 'en', 'WEBTOON')
on conflict do nothing;
