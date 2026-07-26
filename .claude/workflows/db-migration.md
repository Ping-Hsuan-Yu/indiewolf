---
description: 如何新增資料庫 schema 變更（migration workflow）
---

# Database Migration Workflow

// turbo-all

> Dev 專案（`yadzgjnsmenwcsonffox`）已永久暫停，唯一活躍 DB 為 prod
> `diwxkpiwnirlvngldcoi`（Lin ChaoYu）。`supabase link` 應綁定到 prod，
> 所有指令直接對 prod。

## 新增 Migration

1. 建立新的 migration 檔案：

```bash
npm run db:new <migration_name>
```

例如：`npm run db:new add_tags_to_illustrations`

2. 編輯產生的 SQL 檔案 `supabase/migrations/<timestamp>_<name>.sql`

3. 確認 link 到 prod（只需一次）：

```bash
npx supabase link --project-ref diwxkpiwnirlvngldcoi
```

4. Dry run 確認變更：

```bash
npx supabase db push --linked --dry-run
```

5. 正式 push：

```bash
npm run db:push
```

6. 更新 TypeScript types：

```bash
npm run db:types
```

## 重要原則

- **所有 schema 變更只透過 migration 檔案**，不手動在 Dashboard 改
- **Migration 是單向的**，只往前不回退
- **變更直接對 prod**（無 dev 環境），push 前先 `--dry-run` 確認
- **Migration 檔案要 commit 進 Git**
