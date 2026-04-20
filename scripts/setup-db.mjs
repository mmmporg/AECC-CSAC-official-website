/**
 * Applique le schéma SQL via l'API Management de Supabase
 * (endpoint /pg/sql qui accepte du SQL arbitraire avec la service role key)
 * Usage: node scripts/setup-db.mjs
 */

const PROJECT_REF = 'akimsarbgxwicyfotgja'
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFraW1zYXJiZ3h3aWN5Zm90Z2phIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjY5MDI0MSwiZXhwIjoyMDkyMjY2MjQxfQ._SrZ0Ibz8_v4046-Q7gOD-0CagtdVflg-pba8nzcO0Y'
const BASE_URL = `https://${PROJECT_REF}.supabase.co`

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(BASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
})

// ─── SQL statements splittés pour éviter les timeouts ────────────────────────

const STATEMENTS = [
  // Tables
  `CREATE TABLE IF NOT EXISTS announcements (
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
  )`,
  `CREATE TABLE IF NOT EXISTS opportunities (
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
  )`,
  `CREATE TABLE IF NOT EXISTS timeline_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    period TEXT NOT NULL,
    title_fr TEXT NOT NULL,
    title_en TEXT,
    description_fr TEXT NOT NULL,
    description_en TEXT,
    color TEXT DEFAULT 'green',
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS founders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    role_fr TEXT,
    role_en TEXT,
    in_memoriam BOOLEAN DEFAULT false,
    sort_order INT DEFAULT 0
  )`,
  `CREATE TABLE IF NOT EXISTS presidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    year_start INT NOT NULL,
    year_end INT,
    city TEXT,
    sort_order INT DEFAULT 0
  )`,
  // RLS
  `ALTER TABLE announcements ENABLE ROW LEVEL SECURITY`,
  `ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY`,
  `ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY`,
  `ALTER TABLE founders ENABLE ROW LEVEL SECURITY`,
  `ALTER TABLE presidents ENABLE ROW LEVEL SECURITY`,
  // Policies publiques
  `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read announcements') THEN
      CREATE POLICY "Public read announcements" ON announcements FOR SELECT USING (is_active = true);
    END IF;
  END $$`,
  `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read opportunities') THEN
      CREATE POLICY "Public read opportunities" ON opportunities FOR SELECT USING (is_active = true);
    END IF;
  END $$`,
  `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read timeline') THEN
      CREATE POLICY "Public read timeline" ON timeline_events FOR SELECT USING (true);
    END IF;
  END $$`,
  `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read founders') THEN
      CREATE POLICY "Public read founders" ON founders FOR SELECT USING (true);
    END IF;
  END $$`,
  `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read presidents') THEN
      CREATE POLICY "Public read presidents" ON presidents FOR SELECT USING (true);
    END IF;
  END $$`,
  // Policies admin
  `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin full access announcements') THEN
      CREATE POLICY "Admin full access announcements" ON announcements FOR ALL USING (auth.uid() IS NOT NULL);
    END IF;
  END $$`,
  `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin full access opportunities') THEN
      CREATE POLICY "Admin full access opportunities" ON opportunities FOR ALL USING (auth.uid() IS NOT NULL);
    END IF;
  END $$`,
  `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin full access timeline') THEN
      CREATE POLICY "Admin full access timeline" ON timeline_events FOR ALL USING (auth.uid() IS NOT NULL);
    END IF;
  END $$`,
  `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin full access founders') THEN
      CREATE POLICY "Admin full access founders" ON founders FOR ALL USING (auth.uid() IS NOT NULL);
    END IF;
  END $$`,
  `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin full access presidents') THEN
      CREATE POLICY "Admin full access presidents" ON presidents FOR ALL USING (auth.uid() IS NOT NULL);
    END IF;
  END $$`,
]

async function execStatement(sql, label) {
  // Utilise l'API REST Supabase via une RPC custom ou directement PostgreSQL
  // On tente via fetch sur l'endpoint SQL de l'API management

  // Method 1: Management API (requiert un access token personnel, pas la service role key)
  // On utilise plutôt la méthode directe via PostgREST + service role

  // Supabase ne supporte pas le DDL via REST/PostgREST normalement
  // Mais on peut utiliser une fonction RPC si elle existe

  // Alternatively, on essaie via l'API de base de données Supabase
  const res = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
    },
    body: JSON.stringify({ query: sql })
  })

  if (res.ok) {
    console.log(`  ✅ ${label}`)
    return true
  }

  const body = await res.text()
  // Si 401/403, l'API management nécessite un token personnel
  if (res.status === 401 || res.status === 403) {
    return null // signifie "auth required"
  }

  console.log(`  ❌ ${label}: ${body.slice(0, 100)}`)
  return false
}

async function main() {
  console.log('\n🚀 AECC — Setup de la base de données Supabase\n')

  // D'abord vérifier si les tables existent déjà
  console.log('🔍 Vérification de l\'état actuel...')
  const { data, error } = await supabase.from('timeline_events').select('id').limit(1)

  if (!error) {
    console.log('✅ Les tables existent déjà !')
    console.log('\n📋 Insertion des données seed...\n')
    await seedData()
    return
  }

  console.log(`❌ Tables manquantes (${error.message})\n`)
  console.log('🔧 Tentative de création via l\'API Management...\n')

  // Test méthode Management API
  const testResult = await execStatement('SELECT 1', 'Test connexion API')

  if (testResult === null) {
    // Auth requise → instructions manuelles
    printManualInstructions()
    return
  }

  if (testResult === false) {
    printManualInstructions()
    return
  }

  // Créer les tables
  for (const [i, sql] of STATEMENTS.entries()) {
    const label = `Statement ${i + 1}/${STATEMENTS.length}`
    await execStatement(sql, label)
  }

  // Seed
  await seedData()
}

async function seedData() {
  // Timeline
  const { data: existingTimeline } = await supabase.from('timeline_events').select('id').limit(1)
  if (!existingTimeline || existingTimeline.length === 0) {
    const { error } = await supabase.from('timeline_events').insert([
      { period: '1997 – 1998', title_fr: 'Issa Rouhaya, première représentante', title_en: 'Issa Rouhaya, first representative', description_fr: "Issa Rouhaya devient la première représentante de l'Amicale des étudiants camerounais.", description_en: "Issa Rouhaya becomes the first representative of the Cameroonian students' association.", color: 'green', sort_order: 1 },
      { period: 'Septembre 1998', title_fr: 'Arrivée de 7 nouveaux étudiants', title_en: 'Arrival of 7 new students', description_fr: "L'arrivée de 7 nouveaux étudiants camerounais dynamise la communauté.", description_en: 'The arrival of 7 new Cameroonian students strengthens the community.', color: 'yellow', sort_order: 2 },
      { period: 'Juillet 1999', title_fr: '1ère Assemblée Générale à Beijing', title_en: '1st General Assembly in Beijing', description_fr: "L'AECC est officiellement fondée lors de la première AG à Beijing.", description_en: 'AECC is officially founded at the first General Assembly in Beijing.', color: 'green', sort_order: 3 },
      { period: 'Juillet 2001', title_fr: '2ème AG à Shanghai — siège déplaçable', title_en: '2nd GA in Shanghai — movable headquarters', description_fr: "Siège déplaçable selon la ville du président, création de délégués par ville.", description_en: "Movable headquarters based on the president's city, city delegates created.", color: 'red', sort_order: 4 },
      { period: '2022', title_fr: '25e anniversaire — Solange Meying présidente', title_en: '25th anniversary — Solange Meying president', description_fr: "L'AECC célèbre 25 ans avec 19 présidents. Solange Meying prend la présidence.", description_en: 'AECC celebrates 25 years with 19 presidents. Solange Meying takes the presidency.', color: 'gray', sort_order: 5 }
    ])
    if (error) console.log('❌ Seed timeline:', error.message)
    else console.log('✅ Frise chronologique insérée (5 événements)')
  } else {
    console.log('ℹ️  Frise chronologique déjà peuplée')
  }

  // Fondateurs
  const { data: existingFounders } = await supabase.from('founders').select('id').limit(1)
  if (!existingFounders || existingFounders.length === 0) {
    const { error } = await supabase.from('founders').insert([
      { full_name: 'Issa Rouhaya', role_fr: "1ère représentante de l'Amicale", role_en: '1st representative', in_memoriam: false, sort_order: 1 },
      { full_name: 'Solange Meying', role_fr: 'Présidente 2022', role_en: 'President 2022', in_memoriam: false, sort_order: 2 },
      { full_name: 'Alain Nnanga Otto', in_memoriam: false, sort_order: 3 },
      { full_name: 'Aliyou Mana Hamadou', in_memoriam: false, sort_order: 4 },
      { full_name: 'Alexis Nytchoya', in_memoriam: false, sort_order: 5 },
      { full_name: 'Bertrand Ateba', in_memoriam: false, sort_order: 6 },
      { full_name: 'Celestin Lélé', in_memoriam: false, sort_order: 7 },
      { full_name: 'Claude Fouté Nelong', in_memoriam: false, sort_order: 8 },
      { full_name: 'Cyrille Tagne Tamo', in_memoriam: false, sort_order: 9 },
      { full_name: 'Eric Goufo', in_memoriam: false, sort_order: 10 },
      { full_name: 'Frédéric Tavea', in_memoriam: false, sort_order: 11 },
      { full_name: 'Grégoire Kamdjo', in_memoriam: true, sort_order: 12 },
      { full_name: 'Ibrahim Mamadou Bobbo', in_memoriam: false, sort_order: 13 },
      { full_name: 'Lezin Seba', in_memoriam: false, sort_order: 14 },
      { full_name: 'Olivier Obama Etoa', in_memoriam: false, sort_order: 15 },
      { full_name: 'Paul Ebong', in_memoriam: false, sort_order: 16 },
      { full_name: 'Verdo Anutebe', in_memoriam: false, sort_order: 17 }
    ])
    if (error) console.log('❌ Seed fondateurs:', error.message)
    else console.log('✅ Fondateurs insérés (17 membres)')
  } else {
    console.log('ℹ️  Fondateurs déjà peuplés')
  }

  console.log('\n✅ Seed terminé !\n')
  console.log('📌 Créez maintenant un compte admin :')
  console.log('   https://supabase.com/dashboard/project/akimsarbgxwicyfotgja/auth/users')
  console.log('   → "Add user" ou "Invite user"\n')
}

function printManualInstructions() {
  console.log('\n══════════════════════════════════════════════════════════════')
  console.log('📋 ACTION REQUISE : Appliquer le SQL manuellement')
  console.log('══════════════════════════════════════════════════════════════')
  console.log('\n⚙️  ÉTAPE 1 — Créer les tables')
  console.log('   1. Ouvrez : https://supabase.com/dashboard/project/akimsarbgxwicyfotgja/sql/new')
  console.log('   2. Copiez-collez le fichier SQL complet :')
  console.log('      → C:\\Users\\YOGA\\Downloads\\AECC\\repo\\supabase\\migrations\\001_initial_schema.sql')
  console.log('   3. Cliquez "Run"\n')
  console.log('⚙️  ÉTAPE 2 — Créer un compte admin')
  console.log('   1. Ouvrez : https://supabase.com/dashboard/project/akimsarbgxwicyfotgja/auth/users')
  console.log('   2. Cliquez "Add user" → entrez email + mot de passe')
  console.log('   3. Ce seront les identifiants pour /admin/login\n')
  console.log('⚙️  ÉTAPE 3 — Insérer les données seed')
  console.log('   Après les étapes 1 et 2, relancez :')
  console.log('   node scripts/migrate.mjs\n')
  console.log('══════════════════════════════════════════════════════════════\n')
}

main().catch(console.error)
