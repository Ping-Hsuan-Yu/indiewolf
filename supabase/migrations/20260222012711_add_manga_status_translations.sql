-- Add manga status translations (ongoing / completed)
INSERT INTO public.ui_translations (namespace, key, locale, value)
VALUES
  ('navbar', 'manga__completed', 'zh', '連載完成'),
  ('navbar', 'manga__completed', 'en', 'Completed'),
  ('navbar', 'manga__ongoing',   'zh', '連載中'),
  ('navbar', 'manga__ongoing',   'en', 'Ongoing')
ON CONFLICT DO NOTHING;
