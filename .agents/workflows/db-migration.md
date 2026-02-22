---
description: 如何新增資料庫 schema 變更（migration workflow）
---

# Database Migration Workflow

// turbo-all

## 新增 Migration

1. 建立新的 migration 檔案：
```bash
npm run db:new <migration_name>
```
例如：`npm run db:new add_tags_to_illustrations`

2. 編輯產生的 SQL 檔案 `supabase/migrations/<timestamp>_<name>.sql`

3. Dry run 確認變更：
```bash
npx supabase db push --linked --dry-run
```

4. Push 到 dev 資料庫（目前 linked 到 dev）：
```bash
npm run db:push:dev
```

5. 驗證 dev 上的變更（在應用程式中測試）

6. Push 到 production：
```bash
npx supabase db push --db-url "$PROD_DB_URL"
```

7. 更新 TypeScript types：
```bash
npm run db:types
```

## 切換 Link 目標

目前 `supabase link` 綁定到 dev (`yadzgjnsmenwcsonffox`)。

如需臨時切換到 prod：
```bash
npx supabase link --project-ref diwxkpiwnirlvngldcoi
```

切回 dev：
```bash
npx supabase link --project-ref yadzgjnsmenwcsonffox
```

## 重要原則

- **所有 schema 變更只透過 migration 檔案**，不手動在 Dashboard 改
- **Migration 是單向的**，只往前不回退
- **先 push dev 測試通過，再 push prod**
- **Migration 檔案要 commit 進 Git**
