# Supabase Database Migrations

本專案使用 Supabase CLI 管理資料庫 schema 變更，所有變更透過 migration 檔案追蹤，不直接在 Dashboard 手動改 DB。

## 環境

| 環境       | Project Ref            | 用途              |
| ---------- | ---------------------- | ----------------- |
| Dev        | `yadzgjnsmenwcsonffox` | 本地開發 + 測試機 |
| Production | `diwxkpiwnirlvngldcoi` | 正式環境          |

目前 `supabase link` 預設綁定到 **Dev**。

## 日常操作

### 建立新 Migration

```bash
# 1. 建立空的 migration 檔案
npm run db:new <migration_name>
# 例如：npm run db:new add_tags_to_illustrations

# 2. 編輯產生的 SQL 檔案
#    supabase/migrations/<timestamp>_<migration_name>.sql

# 3. Dry run 確認
npx supabase db push --linked --dry-run

# 4. Push 到 dev
npm run db:push:dev

# 5. 更新 TypeScript types
npm run db:types
```

### Push 到 Production

```bash
# 臨時切換到 prod
npx supabase link --project-ref diwxkpiwnirlvngldcoi

# Dry run 確認
npx supabase db push --linked --dry-run

# 正式 push
npx supabase db push --linked

# 切回 dev
npx supabase link --project-ref yadzgjnsmenwcsonffox
```

### 查看 Migration 狀態

```bash
# 列出 local 與 remote 的 migration 同步狀態
npx supabase migration list --linked
```

## NPM Scripts

| 指令                    | 說明                             |
| ----------------------- | -------------------------------- |
| `npm run db:new <name>` | 建立新的 migration 檔案          |
| `npm run db:push:dev`   | Push migrations 到 dev           |
| `npm run db:diff`       | 比較 local 與 remote schema 差異 |
| `npm run db:types`      | 從 dev 產生 TypeScript types     |

## 目錄結構

```
supabase/
├── config.toml          # Supabase CLI 設定
├── migrations/          # Migration SQL 檔案（進 Git）
│   ├── 20260221000000_baseline.sql
│   └── 20260221000001_add_is_completed_to_manga_works.sql
└── README.md
```

## 核心原則

- **Schema 變更只透過 migration**，不手動改 DB
- **Migration 是單向的**，只往前不回退（要改就寫新的 migration）
- **先 push dev 測試 → 驗證 → 再 push prod**
- **Migration 檔案要 commit 進 Git**，跟程式碼一起走 PR review
- **Seed data 跟 migration 分開**，測試資料用 `seed.sql` 管理

## 注意事項

- `supabase db dump` 和 `supabase db diff` 需要 **Docker**（用於 `pg_dump`）
- 不需要跑 `supabase start`，開發直連遠端 dev DB
- `.supabase/` 目錄已加入 `.gitignore`，不會被 commit
