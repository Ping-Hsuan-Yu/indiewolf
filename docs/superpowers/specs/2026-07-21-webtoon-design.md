# WEBTOON 功能設計 spec

日期：2026-07-21

## 目標

在漫畫區新增 WEBTOON 內容類型：前台在「連載完成」後面多一個 `[WEBTOON]` 分頁，
後台從 Manga 管理延伸出獨立的 Webtoon 管理頁。

Webtoon 與 manga 是不同的內容類型：**無年份、無多頁內頁圖（無 lightbox）、
改為單一外部連結**。整格卡片點擊會開新分頁到外部連結。

## 決策（已與使用者確認）

| 議題 | 決定 | 理由 |
|---|---|---|
| 資料模型 | 新 table `webtoon_works` | manga_works 有 `year NOT NULL`、綁 manga_images 做 lightbox、無外部連結欄。沿用需加判別欄 + nullable year + 到處分支，兩邊都變複雜。獨立 table 讓各頁面邏輯保持單純。 |
| 後台位置 | 側邊欄新增獨立 `/admin/webtoon` 頁 | 與 Manga 管理平行，複製 grid/新增/排序/啟用/編輯，但欄位改為 webtoon。 |
| 卡片欄位 | 標題與描述維持中英雙語、單一 external_url、只有封面 | 沿用 completed 版型但去掉年份，無內頁 lightbox。 |

## 資料庫

新 migration（`npm run db:new add_webtoon_works`）：

```sql
create table public.webtoon_works (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default timezone('utc', now()),
  title_zh text, title_en text,
  summary_zh text, summary_en text,
  cover_url text not null,
  external_url text not null,
  order_index integer not null default 0,
  is_active boolean default true,
  width integer not null, height integer not null
);
alter table public.webtoon_works enable row level security;
create policy "Public read access" on public.webtoon_works
  for select to public using (true);
```

RLS 只給 public read，與 `manga_works`（`supabase/migrations/20260221000000_baseline.sql:184`）
一致 — 後台寫入走 `getAuthorizedAdminClient` service role 繞過 RLS。

同一支 migration 加 nav i18n（沿用 `add_manga_status_translations.sql` 格式）：

```sql
insert into public.ui_translations (namespace, key, locale, value) values
  ('navbar', 'manga__webtoon', 'zh', 'WEBTOON'),
  ('navbar', 'manga__webtoon', 'en', 'WEBTOON')
on conflict do nothing;
```

Migration 流程照 `.claude/workflows/db-migration.md`：dev push → `npm run db:types`
產生 `Tables<'webtoon_works'>` → 驗證 → prod push。

## 前台

| 檔案 | 動作 |
|---|---|
| `app/[locale]/(public)/manga/MangaStatusNav.tsx:10` | `STATUSES` 加 `'webtoon'` → 自動長出第三顆 tab，label 走 `t('manga__webtoon')`，連 `/[locale]/manga/webtoon` |
| `app/[locale]/(public)/manga/[status]/page.tsx:8,13` | `VALID_STATUSES` 加 `'webtoon'`（含 `generateStaticParams`）；`status === 'webtoon'` 分支走新 action + 渲染 `<WebtoonGallery>`，其餘維持原 manga 流程 |
| **新** `app/[locale]/(public)/manga/[status]/WebtoonGallery.tsx` | 從 `MangaGallery` 複製 grid（`grid-cols-1 md:grid-cols-2`）+ 卡片版型；整格是 `<a href={external_url} target="_blank" rel="noopener noreferrer">`；**無 lightbox、無 year badge、無 client state**（純 server component）；左圖右標題+描述 |
| **新** `app/_actions/public/webtoon.ts` | `getWebtoons()`：`webtoon_works` where `is_active` order by `order_index` |

`webtoon` 掛在既有 `[status]` dynamic segment 下，沿用路由、i18n key 慣例、nav 渲染邏輯，
不新開 route。

## 後台（`/admin/webtoon`）

mirror manga 管理，但砍掉 year / 內頁圖 / 連載狀態 filter。

| 檔案 | 動作 |
|---|---|
| `app/admin/(main)/AppSidebar.tsx:26` | 內容管理加 `{ title: 'Webtoon', url: '/admin/webtoon', icon: Smartphone }` |
| **新** `app/admin/(main)/webtoon/page.tsx` | fetch webtoons → `<ClientPage>` |
| **新** `webtoon/ClientPage.tsx` | 排序模式 switch + `AddWebtoonSheet` + `WebtoonGrid`；**移除連載中/連載結束 filter 按鈕** |
| **新** `webtoon/WebtoonGrid.tsx` + `WebtoonItem.tsx` | 複製 manga 版：cover、標題、啟用 toggle、刪除、dnd-kit 排序、連 `/admin/webtoon/[id]` |
| **新** `webtoon/AddWebtoonSheet.tsx` | 表單：title_zh/en、summary_zh/en、**external_url**、cover file。**無 year 欄** |
| **新** `app/admin/(main)/webtoon/[id]/page.tsx` + `WebtoonDetailForm.tsx` | 編輯頁：改欄位 + 換封面 + external_url。**無 manga_images 內頁管理**（對照 `manga/[id]/MangaDetailForm.tsx`）|
| **新** `app/_actions/admin/webtoon.ts` | `createWebtoon` / `updateWebtoon` / `deleteWebtoon` / `toggleWebtoonActive` / `updateWebtoonOrder` / `getWebtoonsAction`。mirror `manga.ts` 去掉 images；cloudinary folder 用 `indiewolf/webtoon` |

## 執行順序

1. Migration（table + i18n）→ dev push → `db:types` → prod push
2. 前台 action + WebtoonGallery + nav/route 兩處 array
3. 後台 actions + 頁面群 + sidebar

## 假設

- WEBTOON label 中英都顯示 "WEBTOON"
- `external_url` 單一連結，不分語系
- 封面沿用 manga 上傳流程（Cloudinary，存 width/height）

## 非目標

- webtoon 不做內頁圖片 / lightbox 瀏覽
- webtoon 不做連載中/完成狀態
- 不動現有 manga 的資料與流程
