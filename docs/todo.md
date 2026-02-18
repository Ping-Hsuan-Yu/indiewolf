# IndieWolf 官網調整事項 Checklist 20260110

## 網站功能與結構調整

- [x] Project 分頁圖片可點擊放大（桌機）
  - [x] 點擊圖片開啟大圖（lightbox / modal / gallery）
- [x] 官網的聯繫用email需要改成：alchemy17th@gmail.com 

---

## 漫畫雙語內容調整

- [ ] 漫畫內容支援中 / 英切換
- [ ] 半雙頁瀏覽模式

---

## 後台管理

- [x] 測試與正式資料庫
- [x] 後台編輯前台資料
- [x] Sql function: 根據project slug / illu_year / manga_year 自動更新 nav
- [x] 統一三種管理頁面在同一個邏輯下
- [x] https://nextjs.org/docs/app/guides/incremental-static-regeneration

- [x] 環境區分
  - [x] 建立測試站（可顯示未完整內容）
  - [x] 建立正式站（僅顯示確認完成內容）

---

## 六、效能優化

- [x] Next Cloudinary
  - [x] not src but public_id
  - [x] 資料表資料型態設定
  - [x] 使用 cldimage 改寫 型別重新設定
- [ ] TanStack Query
- [ ] Zustand
- [x] service?? actions??

- [ ] 排序時關閉啟用與刪除功能