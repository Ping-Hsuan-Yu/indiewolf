# TODO

- [ ] 刪除圖片cloudinary同時刪除

- [ ] 漫畫寬版雙頁
- [ ] 半雙頁瀏覽模式

- [ ] TanStack Query
- [ ] Zustand

# DONE

## 網站功能與結構調整

- [x] Project 分頁圖片可點擊放大（桌機）
  - [x] 點擊圖片開啟大圖（lightbox / modal / gallery）
- [x] 官網的聯繫用email需要改成：alchemy17th@gmail.com

## 後台管理

- [x] 測試與正式資料庫
- [x] 後台編輯前台資料
- [x] Sql function: 根據project slug / illu_year / manga_year 自動更新 nav
- [x] 統一三種管理頁面在同一個邏輯下
- [x] https://nextjs.org/docs/app/guides/incremental-static-regeneration

- [x] 環境區分
  - [x] 建立測試站（可顯示未完整內容）
  - [x] 建立正式站（僅顯示確認完成內容）

- [x] 漫畫內容支援中 / 英切換

- [x] Next Cloudinary
  - [x] not src but public_id
  - [x] 資料表資料型態設定
  - [x] 使用 cldimage 改寫 型別重新設定

- [x] service?? actions??

- [x] 排序時關閉啟用與刪除功能

- [x] manga nav 新增 正在連載(先不顯示) / 連載結束
- [x] 導覽列自動更新
- [x] 左封面 右名稱 敘述 年份

npx supabase gen types typescript --project-id "$PROJECT_REF" --schema public > types/database.types.ts

---

# 重大變化 2026/02/22

## `dev` vs `main` 更新摘要

> 18 commits · 145 files changed · +14,483 / −2,756

### 1. 後台管理系統 (Admin Panel)

- 全新 admin 路由結構：`/admin/(auth)` 登入驗證 + `/admin/(main)` 管理介面
- 新增 **Illustration / Manga / Project / About** 四大管理頁面（CRUD + 排序 + 啟用/停用）
- 引入 **shadcn/ui** 元件庫（Button, Dialog, Sheet, Sidebar, Tabs, ToggleGroup 等）
- Login 頁面與 Logout 功能
- Admin Dashboard `metadata` 與首頁簡化

### 2. 架構重構

- **Service → Actions 模式**：刪除 `lib/services/` 舊服務層，遷移為 `app/_actions/admin/` + `app/_actions/public/` Server Actions
- **Supabase 整合強化**：
  - 新增 `utils/supabase/` — `client.ts` / `server.ts` / `admin.ts` / `middleware.ts`
  - 自動產出 `types/database.types.ts`，完整 type-safe
- **Import statements** 全面重新排序統一

### 3. 漫畫 (Manga) 路由重構

- 路由從 **年份制** (`/manga/[year]`) 改為 **狀態制** (`/manga/[status]`：`ongoing` / `completed`)
- 新增 `MangaStatusNav` 元件，頁面頂部切換連載狀態
- DB 新增 `is_completed` 欄位與狀態翻譯 (`manga__completed` / `manga__ongoing`)
- `next.config.mjs` redirect：`/:locale/manga` → `/:locale/manga/completed`

### 4. 前端圖片與 Gallery 優化

- 整合 **yet-another-react-lightbox**，替換舊 Gallery 元件（`BooksGallery` / `IllustrationGallery` / `MangaGallery` 刪除）
- 新增 `OptimizedImage` / `OptimizedImage4Lightbox` 元件
- 全域圖片保護（`GlobalImageProtection`）+ `usePreventImageActions` hook
- 全域 error 與 404 頁面實作

### 5. 導覽列同步

- 新增 `sync-nav` utility，admin CRUD 操作時自動同步 `nav_items`
- `ui_translations` 同步與新增翻譯項目

### 6. 設定與 DevOps

- **Supabase DB Migration** 工作流建立：`supabase/` 目錄 + baseline migration + config
- `serverActions.bodySizeLimit` 調整為 `1000mb`
- 移除 dark mode 與 `tailwind.config.ts`
- 新增 `.nvmrc`、`components.json`、`proxy.ts`
- 自訂字型 `Gambetta Variable` 引入

---

## 客戶版更新摘要 — 2026/02/22

### 🎨 網站前台

- **漫畫分類方式調整**：漫畫頁面從依「年份」分類改為依「連載狀態」分類，分為「連載中」與「連載結束」兩個分頁，更直覺地瀏覽作品
- **圖片保護機制**：全站圖片加入右鍵保護，防止未經授權的下載與複製
- **錯誤頁面優化**：當頁面不存在或發生錯誤時，會顯示友善的提示頁面而非空白畫面

### 🔧 後台管理

- **全新後台管理介面**：新增獨立的管理後台，可直接在線上編輯網站內容
  - 插畫管理：新增、編輯、排序、啟用/停用作品
  - 漫畫管理：新增、編輯、排序、切換連載狀態
  - 專案管理：新增、編輯、排序作品
  - 關於頁面：編輯個人資料與社群連結
- **導覽列自動更新**：後台新增或刪除作品時，網站導覽列會自動同步更新，不再需要手動處理
- **登入系統**：後台新增登入驗證，確保只有授權人員可編輯內容

### 📦 其他改進

- 網站整體效能與穩定性提升
- 資料庫版本管理機制建立，確保資料安全與可追溯性
