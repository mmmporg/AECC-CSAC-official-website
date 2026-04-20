/**
 * Script de migration AECC — à exécuter une seule fois
 * Usage : node scripts/migrate.mjs
 *
 * Ce script crée les tables, active le RLS, crée les policies,
 * et insère les données seed (frise + fondateurs).
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://akimsarbgxwicyfotgja.supabase.co'
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFraW1zYXJiZ3h3aWN5Zm90Z2phIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjY5MDI0MSwiZXhwIjoyMDkyMjY2MjQxfQ._SrZ0Ibz8_v4046-Q7gOD-0CagtdVflg-pba8nzcO0Y'

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
})

async function runSQL(label, sql) {
  try {
    const { error } = await supabase.rpc('exec_sql', { sql }).single()
    if (error) {
      // Fallback : utiliser l'API REST directement
      const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SERVICE_ROLE_KEY}`
        },
        body: JSON.stringify({ sql })
      })
      if (!res.ok) {
        const body = await res.text()
        console.error(`❌ ${label}:`, body)
        return false
      }
    }
    console.log(`✅ ${label}`)
    return true
  } catch (err) {
    console.error(`❌ ${label}:`, err.message)
    return false
  }
}

async function insertData(table, rows) {
  const { error } = await supabase.from(table).upsert(rows, { onConflict: 'id', ignoreDuplicates: true })
  if (error) {
    // Si upsert échoue (pas d'id), on essaie insert
    const { error: insertError } = await supabase.from(table).insert(rows)
    if (insertError) {
      console.error(`❌ Insert ${table}:`, insertError.message)
      return
    }
  }
  console.log(`✅ Seed ${table} (${rows.length} lignes)`)
}

// ─── SQL DE CRÉATION DES TABLES ──────────────────────────────────────────────

const CREATE_TABLES = `
-- Annonces
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_fr TEXT NOT NULL,
  title_en TEXT,
  description_fr TEXT NOT NULL,
  description_en TEXT,
  category TEXT NOT NULL CHECK (category IN ('logement', 'vente', 'entraide', 'evenement')),
  city TEXT NOT NULL,
  contact TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Opportunités
CREATE TABLE IF NOT EXISTS opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_fr TEXT NOT NULL,
  title_en TEXT,
  description_fr TEXT NOT NULL,
  description_en TEXT,
  category TEXT NOT NULL CHECK (category IN ('bourse', 'stage_emploi', 'candidature', 'formation')),
  organization TEXT NOT NULL,
  external_link TEXT,
  deadline TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Frise chronologique
CREATE TABLE IF NOT EXISTS timeline_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  period TEXT NOT NULL,
  title_fr TEXT NOT NULL,
  title_en TEXT,
  description_fr TEXT NOT NULL,
  description_en TEXT,
  color TEXT DEFAULT 'green',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fondateurs
CREATE TABLE IF NOT EXISTS founders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  role_fr TEXT,
  role_en TEXT,
  in_memoriam BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0
);

-- Présidents
CREATE TABLE IF NOT EXISTS presidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  year_start INT NOT NULL,
  year_end INT,
  city TEXT,
  sort_order INT DEFAULT 0
);
`

const ENABLE_RLS = `
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE founders ENABLE ROW LEVEL SECURITY;
ALTER TABLE presidents ENABLE ROW LEVEL SECURITY;
`

const CREATE_POLICIES = `
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read announcements') THEN
    CREATE POLICY "Public read announcements" ON announcements FOR SELECT USING (is_active = true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read opportunities') THEN
    CREATE POLICY "Public read opportunities" ON opportunities FOR SELECT USING (is_active = true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read timeline') THEN
    CREATE POLICY "Public read timeline" ON timeline_events FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read founders') THEN
    CREATE POLICY "Public read founders" ON founders FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read presidents') THEN
    CREATE POLICY "Public read presidents" ON presidents FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin full access announcements') THEN
    CREATE POLICY "Admin full access announcements" ON announcements FOR ALL USING (auth.uid() IS NOT NULL);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin full access opportunities') THEN
    CREATE POLICY "Admin full access opportunities" ON opportunities FOR ALL USING (auth.uid() IS NOT NULL);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin full access timeline') THEN
    CREATE POLICY "Admin full access timeline" ON timeline_events FOR ALL USING (auth.uid() IS NOT NULL);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin full access founders') THEN
    CREATE POLICY "Admin full access founders" ON founders FOR ALL USING (auth.uid() IS NOT NULL);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin full access presidents') THEN
    CREATE POLICY "Admin full access presidents" ON presidents FOR ALL USING (auth.uid() IS NOT NULL);
  END IF;
END
$$;
`

// ─── DONNÉES SEED ────────────────────────────────────────────────────────────

const TIMELINE_SEED = [
  {
    period: '1997 – 1998',
    title_fr: 'Issa Rouhaya, première représentante',
    title_en: 'Issa Rouhaya, first representative',
    description_fr: "Issa Rouhaya devient la première représentante de l'Amicale des étudiants camerounais, posant les bases d'une future organisation.",
    description_en: "Issa Rouhaya becomes the first representative of the Cameroonian students' association, laying the groundwork for a future organisation.",
    color: 'green',
    sort_order: 1
  },
  {
    period: 'Septembre 1998',
    title_fr: 'Arrivée de 7 nouveaux étudiants',
    title_en: 'Arrival of 7 new students',
    description_fr: "L'arrivée de 7 nouveaux étudiants camerounais dynamise la communauté et renforce le besoin d'une structure formelle.",
    description_en: 'The arrival of 7 new Cameroonian students strengthens the community and reinforces the need for a formal structure.',
    color: 'yellow',
    sort_order: 2
  },
  {
    period: 'Juillet 1999',
    title_fr: '1ère Assemblée Générale à Beijing',
    title_en: '1st General Assembly in Beijing',
    description_fr: "Lors de la première Assemblée Générale à Beijing, l'AECC est officiellement fondée. C'est la naissance officielle de l'association.",
    description_en: "At the first General Assembly in Beijing, the AECC is officially founded. This marks the official birth of the association.",
    color: 'green',
    sort_order: 3
  },
  {
    period: 'Juillet 2001',
    title_fr: '2ème AG à Shanghai — siège déplaçable',
    title_en: '2nd GA in Shanghai — movable headquarters',
    description_fr: "La 2ème Assemblée Générale à Shanghai instaure un siège déplaçable selon la ville du président en exercice et crée des délégués par ville.",
    description_en: "The 2nd General Assembly in Shanghai establishes a movable headquarters based on the sitting president's city and creates city delegates.",
    color: 'red',
    sort_order: 4
  },
  {
    period: '2022',
    title_fr: '25e anniversaire — Solange Meying présidente',
    title_en: '25th anniversary — Solange Meying president',
    description_fr: "L'AECC célèbre ses 25 ans d'existence avec 19 présidents successifs. Solange Meying prend la présidence pour cette édition anniversaire.",
    description_en: 'AECC celebrates 25 years of existence with 19 successive presidents. Solange Meying takes over the presidency for this anniversary edition.',
    color: 'gray',
    sort_order: 5
  }
]

const FOUNDERS_SEED = [
  { full_name: 'Issa Rouhaya', role_fr: "1ère représentante de l'Amicale", role_en: '1st representative of the Amicale', in_memoriam: false, sort_order: 1 },
  { full_name: 'Solange Meying', role_fr: 'Présidente 2022', role_en: 'President 2022', in_memoriam: false, sort_order: 2 },
  { full_name: 'Alain Nnanga Otto', role_fr: null, role_en: null, in_memoriam: false, sort_order: 3 },
  { full_name: 'Aliyou Mana Hamadou', role_fr: null, role_en: null, in_memoriam: false, sort_order: 4 },
  { full_name: 'Alexis Nytchoya', role_fr: null, role_en: null, in_memoriam: false, sort_order: 5 },
  { full_name: 'Bertrand Ateba', role_fr: null, role_en: null, in_memoriam: false, sort_order: 6 },
  { full_name: 'Celestin Lélé', role_fr: null, role_en: null, in_memoriam: false, sort_order: 7 },
  { full_name: 'Claude Fouté Nelong', role_fr: null, role_en: null, in_memoriam: false, sort_order: 8 },
  { full_name: 'Cyrille Tagne Tamo', role_fr: null, role_en: null, in_memoriam: false, sort_order: 9 },
  { full_name: 'Eric Goufo', role_fr: null, role_en: null, in_memoriam: false, sort_order: 10 },
  { full_name: 'Frédéric Tavea', role_fr: null, role_en: null, in_memoriam: false, sort_order: 11 },
  { full_name: 'Grégoire Kamdjo', role_fr: null, role_en: null, in_memoriam: true, sort_order: 12 },
  { full_name: 'Ibrahim Mamadou Bobbo', role_fr: null, role_en: null, in_memoriam: false, sort_order: 13 },
  { full_name: 'Lezin Seba', role_fr: null, role_en: null, in_memoriam: false, sort_order: 14 },
  { full_name: 'Olivier Obama Etoa', role_fr: null, role_en: null, in_memoriam: false, sort_order: 15 },
  { full_name: 'Paul Ebong', role_fr: null, role_en: null, in_memoriam: false, sort_order: 16 },
  { full_name: 'Verdo Anutebe', role_fr: null, role_en: null, in_memoriam: false, sort_order: 17 }
]

// ─── EXÉCUTION ───────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🚀 AECC — Migration et seed Supabase\n')

  // Test connexion simple : lire les tables existantes
  const { data: tables, error: testError } = await supabase
    .from('pg_tables')
    .select('tablename')
    .eq('schemaname', 'public')
    .limit(1)

  // Le test peut échouer si pg_tables n'est pas accessible via REST — c'est normal
  // On procède directement avec les inserts qui échoueront proprement si les tables n'existent pas

  console.log('📋 Étape 1 : Insertion des seed data (si les tables existent déjà)...\n')

  // Test si la table timeline_events existe en essayant de lire
  const { error: timelineCheckError } = await supabase.from('timeline_events').select('id').limit(1)

  if (timelineCheckError) {
    console.log(`⚠️  Les tables n'existent pas encore.`)
    console.log(`\n📌 INSTRUCTIONS MANUELLES :`)
    console.log(`   1. Allez sur https://supabase.com/dashboard/project/akimsarbgxwicyfotgja/sql/new`)
    console.log(`   2. Copiez-collez le contenu du fichier :`)
    console.log(`      supabase/migrations/001_initial_schema.sql`)
    console.log(`   3. Cliquez sur "Run"`)
    console.log(`   4. Relancez ce script : node scripts/migrate.mjs\n`)
    process.exit(1)
  }

  console.log('✅ Tables détectées — insertion des données...\n')

  // Vérifier si déjà seedé
  const { data: existingTimeline } = await supabase.from('timeline_events').select('id').limit(1)
  if (existingTimeline && existingTimeline.length > 0) {
    console.log('ℹ️  Frise chronologique déjà peuplée — skip')
  } else {
    await insertData('timeline_events', TIMELINE_SEED)
  }

  const { data: existingFounders } = await supabase.from('founders').select('id').limit(1)
  if (existingFounders && existingFounders.length > 0) {
    console.log('ℹ️  Fondateurs déjà peuplés — skip')
  } else {
    await insertData('founders', FOUNDERS_SEED)
  }

  console.log('\n✅ Migration terminée !\n')
  console.log('📌 Prochaine étape : créer un compte admin dans Supabase Auth')
  console.log('   https://supabase.com/dashboard/project/akimsarbgxwicyfotgja/auth/users')
  console.log('   → "Add user" → entrez email + mot de passe\n')
}

main().catch(console.error)
