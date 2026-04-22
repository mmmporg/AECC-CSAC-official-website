-- 006_history_images.sql
-- Add optional public images for founders and presidents.

alter table founders
  add column if not exists image_url text;

alter table presidents
  add column if not exists image_url text;
