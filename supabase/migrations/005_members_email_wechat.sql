-- ══════════════════════════════════════════════════════════
-- AECC — Migration 005 : Champs email et wechat sur members
-- ══════════════════════════════════════════════════════════

ALTER TABLE members ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS wechat TEXT;
