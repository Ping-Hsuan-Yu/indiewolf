# Database Types 更新總結

已成功將所有 `app/_actions` 目錄下的 server actions 更新為使用 `types/database.types.ts` 中定義的型別。

## 更新檔案清單

### Public Actions (`app/_actions/public/`)

1. **illustration.ts**
   - 使用 `Tables<'illustration_works'>` 替換手動定義的 `IllustrationWork`
   - 保留 `extractPublicId` 函數用於 Cloudinary URL 處理

2. **about.ts**
   - 使用 `Tables<'about_profiles'>` 作為 `AboutProfile` 型別
   - 保留 `SocialLink` 作為轉換後的 API response 型別
   - 保留 `AboutPageData` 作為 API response 型別

3. **manga.ts**
   - 使用 `Tables<'manga_works'>` 和 `Tables<'manga_images'>`
   - `MangaWork` 擴展了基礎型別以包含 `images` 屬性

4. **project.ts**
   - 使用 `Tables<'project_works'>` 和 `Tables<'project_images'>`
   - `ProjectWork` 擴展了基礎型別以包含 `images` 屬性
   - 修復了 `order_index` 可能為 null 的排序錯誤

5. **nav.ts**
   - 使用 `Omit` 和 `Tables<'nav_items'>` 組合定義 `NavItem`
   - 排除了不需要的欄位（parent_id, is_active, created_at, updated_at）

6. **ui-translation.ts**
   - 使用 `Pick<Tables<'ui_translations'>, ...>` 定義 `UiTranslationRecord`
   - 只選取需要的欄位

### Admin Actions (`app/_actions/admin/`)

1. **illustration.ts**
   - 加入 `TablesInsert<'illustration_works'>` 和 `TablesUpdate<'illustration_works'>`
   - 在 `createIllustration` 和 `updateIllustrationAlt` 中使用型別檢查

2. **manga.ts**
   - 加入 `TablesInsert` 和 `TablesUpdate` 型別
   - 在 `createManga`、`updateMangaDetail`、`uploadMangaImages` 中使用型別檢查

3. **project.ts**
   - 加入 `TablesInsert` 和 `TablesUpdate` 型別
   - 在 `createProject`、`updateProject`、`uploadProjectImages` 中使用型別檢查

4. **about.ts**
   - 使用 `Tables<'social_links'>` 和 `Tables<'about_profiles'>`
   - 在 `updateAboutProfile`、`createSocialLink`、`updateSocialLink` 中使用型別檢查

## 型別安全性改善

### Insert 操作
所有 insert 操作現在都使用 `TablesInsert<'table_name'>` 型別，確保：
- 所有必填欄位都有提供
- 不會插入不存在的欄位
- 自動推斷可選欄位

### Update 操作
所有 update 操作現在都使用 `TablesUpdate<'table_name'>` 型別，確保：
- 只更新存在的欄位
- 所有欄位都是可選的
- 型別推斷正確

### Query 結果
所有從資料庫查詢的結果都使用 `Tables<'table_name'>` 型別，確保：
- 與資料庫 schema 保持同步
- IDE 自動完成和型別檢查
- 減少執行時期錯誤

## 剩餘 Lint 錯誤

目前有兩個 lint 錯誤需要在其他檔案中修復：

1. **illustration.ts (line 32)** - ParserError 與 Cloudinary public ID 轉換相關
2. **page.tsx** - GalleryItem width/height 型別不匹配（null vs number）

這些錯誤與 action 檔案本身無關，需要在使用這些 actions 的組件中修復。
