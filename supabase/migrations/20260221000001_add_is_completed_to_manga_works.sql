-- Add is_completed column to manga_works
-- Dev 已有此欄位（IF NOT EXISTS 會跳過），Prod 會被補上
ALTER TABLE public.manga_works
ADD COLUMN IF NOT EXISTS is_completed boolean NOT NULL DEFAULT false;
