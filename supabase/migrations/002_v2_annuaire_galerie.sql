-- ══════════════════════════════════════════════════════════
-- AECC — V2 Migration : Annuaire et Galerie
-- ══════════════════════════════════════════════════════════

-- Création de la table des membres
CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  city TEXT NOT NULL,
  university TEXT NOT NULL,
  degree TEXT NOT NULL,
  entry_year INT,
  graduation_year INT,
  linkedin_url TEXT,
  bio TEXT,
  is_active BOOLEAN DEFAULT false, -- L'admin doit l'activer
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  approved_by UUID REFERENCES auth.users(id)
);

-- Création de la table pour la galerie photos
CREATE TABLE IF NOT EXISTS gallery_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_fr TEXT,
  title_en TEXT,
  image_url TEXT NOT NULL,
  year INT NOT NULL,
  event_name TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- ──────────────────────────────────────────────────────────
-- Row Level Security
-- ──────────────────────────────────────────────────────────
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_photos ENABLE ROW LEVEL SECURITY;

-- Lecture publique (Annuaire actif)
CREATE POLICY "Public read members" ON members FOR SELECT USING (is_active = true);
CREATE POLICY "Public read gallery_photos" ON gallery_photos FOR SELECT USING (true);

-- Accès complet pour les admins
CREATE POLICY "Admin full access members" ON members FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin full access gallery_photos" ON gallery_photos FOR ALL USING (auth.uid() IS NOT NULL);

-- Configuration Storage pour la Galerie
-- Si le bucket "gallery" n'existe pas, vous devrez le créer via le Dashboard Supabase (ou SQL si les extensions sont activées)
INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', true) ON CONFLICT DO NOTHING;

CREATE POLICY "Admin full access gallery bucket" ON storage.objects FOR ALL USING (auth.uid() IS NOT NULL AND bucket_id = 'gallery');
CREATE POLICY "Public read gallery bucket" ON storage.objects FOR SELECT USING (bucket_id = 'gallery');
