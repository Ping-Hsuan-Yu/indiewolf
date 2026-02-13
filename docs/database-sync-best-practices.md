# 正式與測試資料庫同步最佳實踐

## 1. Migration-based 版本控制（最基本也最重要）

所有 schema 變更都透過 migration 檔案管理，不直接在 Dashboard 手動改 DB。

```
supabase/migrations/
├── 20260101_create_users.sql
├── 20260102_add_locale_column.sql
└── 20260103_add_rls_policies.sql
```

- 用 `supabase db push` 或 `supabase db reset` 讓環境對齊
- Migration 進 Git，跟程式碼一起走 PR review
- **兩邊 migration 歷史不同步是造成差異的主因**

## 2. Supabase 推薦的工作流程

```
本地開發 (supabase start)
    ↓  寫 migration + 測試
Dev Branch (supabase branches)
    ↓  PR merge 時自動套用
Production
```

- 用 **Supabase CLI** 在本地開發，`supabase db diff` 自動產生 migration
- 用 **Branching** 功能建立 dev branch（跟 Git branch 連動）
- Merge 時自動把 migration 套用到 production

## 3. CI/CD 自動化（中大型團隊）

```
Git Push → CI 跑測試 → Migration 自動套用到對應環境
```

- **GitHub Actions / GitLab CI** 在 merge 到 main 時自動跑 `supabase db push`
- 每個 PR 可以自動建一個 preview 環境（類似 Vercel Preview）
- 避免人為忘記套 migration

## 4. 環境分層策略

```
local → dev → staging → production
```

| 環境 | 用途 | 資料 |
|---|---|---|
| Local | 開發 | seed 假資料 |
| Dev | 功能測試 | seed 或部分匿名化資料 |
| Staging | 上線前驗證 | 盡量接近 production 結構 |
| Production | 正式環境 | 真實資料 |

重點是 **schema 往上推（dev→prod），資料不往下拉（prod→dev）**，避免真實用戶資料外洩。

## 5. 核心原則

- **Schema 變更只透過 migration**，不手動改 DB
- **Migration 是單向的**，只往前不回退（如果要改就寫新的 migration）
- **環境之間靠 migration 檔案對齊**，不靠手動比對
- **Seed data 跟 migration 分開**，測試資料用 `seed.sql` 管理

## 6. 目前專案的行動建議

目前兩個資料庫的 migration 歷史完全不同，最務實的做法：

1. **用 `supabase db dump`** 把正式資料庫目前的完整 schema 匯出
2. **重建測試資料庫的 migration 基線**，讓兩邊從同一個起點出發
3. **之後所有變更都先在本地寫 migration → push 到測試 → 驗證後再 push 到正式**
