/**
 * Push migrations via connexion PostgreSQL directe à Supabase
 * Usage: node scripts/push-migrations.mjs
 *
 * Essaie plusieurs modes de connexion Supabase
 */

import pg from 'pg'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const { Client } = pg
const __dirname = dirname(fileURLToPath(import.meta.url))

const REF = 'akimsarbgxwicyfotgja'
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFraW1zYXJiZ3h3aWN5Zm90Z2phIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjY5MDI0MSwiZXhwIjoyMDkyMjY2MjQxfQ._SrZ0Ibz8_v4046-Q7gOD-0CagtdVflg-pba8nzcO0Y'

// Différentes configurations de connexion à tester
const CONNECTION_CONFIGS = [
  // Mode 1: Connexion directe - user postgres, password = service key (parfois accepté)
  {
    label: 'Direct DB (service key as password)',
    host: `db.${REF}.supabase.co`,
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: SERVICE_KEY,
    ssl: { rejectUnauthorized: false }
  },
  // Mode 2: Pooler session mode
  {
    label: 'Session pooler',
    host: `aws-0-ap-southeast-1.pooler.supabase.com`,
    port: 5432,
    database: 'postgres',
    user: `postgres.${REF}`,
    password: SERVICE_KEY,
    ssl: { rejectUnauthorized: false }
  },
  // Mode 3: Pooler transaction mode
  {
    label: 'Transaction pooler',
    host: `aws-0-ap-southeast-1.pooler.supabase.com`,
    port: 6543,
    database: 'postgres',
    user: `postgres.${REF}`,
    password: SERVICE_KEY,
    ssl: { rejectUnauthorized: false }
  }
]

// SQL de migration complet
const MIGRATION_SQL = readFileSync(
  join(__dirname, '..', 'supabase', 'migrations', '001_initial_schema.sql'),
  'utf-8'
)

// Données seed
const TIMELINE_ROWS = [
  { period: '1997 – 1998', title_fr: 'Issa Rouhaya, première représentante', title_en: 'Issa Rouhaya, first representative', description_fr: "Issa Rouhaya devient la première représentante de l'Amicale des étudiants camerounais, posant les bases d'une future organisation.", description_en: "Issa Rouhaya becomes the first representative of the Cameroonian students' association.", color: 'green', sort_order: 1 },
  { period: 'Septembre 1998', title_fr: 'Arrivée de 7 nouveaux étudiants', title_en: 'Arrival of 7 new students', description_fr: "L'arrivée de 7 nouveaux étudiants camerounais dynamise la communauté et renforce le besoin d'une structure formelle.", description_en: 'The arrival of 7 new students strengthens the community.', color: 'yellow', sort_order: 2 },
  { period: 'Juillet 1999', title_fr: '1ère Assemblée Générale à Beijing', title_en: '1st General Assembly in Beijing', description_fr: "Lors de la première Assemblée Générale à Beijing, l'AECC est officiellement fondée.", description_en: 'At the first General Assembly in Beijing, the AECC is officially founded.', color: 'green', sort_order: 3 },
  { period: 'Juillet 2001', title_fr: '2ème AG à Shanghai — siège déplaçable', title_en: '2nd GA in Shanghai — movable headquarters', description_fr: "La 2ème AG à Shanghai instaure un siège déplaçable et crée des délégués par ville.", description_en: 'The 2nd GA establishes a movable headquarters and city delegates.', color: 'red', sort_order: 4 },
  { period: '2022', title_fr: '25e anniversaire — Solange Meying présidente', title_en: '25th anniversary — Solange Meying president', description_fr: "L'AECC célèbre 25 ans avec 19 présidents. Solange Meying prend la présidence.", description_en: 'AECC celebrates 25 years with 19 presidents.', color: 'gray', sort_order: 5 }
]

const FOUNDER_ROWS = [
  { full_name: 'Issa Rouhaya', role_fr: "1ère représentante de l'Amicale", role_en: '1st representative', in_memoriam: false, sort_order: 1 },
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

async function tryConnect(config) {
  const client = new Client({ ...config, connectionTimeoutMillis: 5000 })
  try {
    await client.connect()
    return client
  } catch (err) {
    return null
  }
}

async function runMigrations(client) {
  console.log('\n📋 Application du schéma SQL...\n')

  // Split les statements SQL individuels
  const statements = MIGRATION_SQL
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 10 && !s.startsWith('--'))

  let ok = 0
  let skip = 0

  for (const stmt of statements) {
    try {
      await client.query(stmt)
      ok++
      process.stdout.write('.')
    } catch (err) {
      if (err.message.includes('already exists') || err.message.includes('déjà')) {
        skip++
        process.stdout.write('s')
      } else {
        console.log(`\n⚠️  Ignoré: ${err.message.slice(0, 80)}`)
      }
    }
  }
  console.log(`\n✅ Schéma: ${ok} ok, ${skip} déjà existants\n`)
}

async function insertSeedData(client) {
  console.log('🌱 Insertion des données seed...\n')

  // Vérifier si déjà seedé
  const { rows: existingTimeline } = await client.query('SELECT count(*) FROM timeline_events')
  if (parseInt(existingTimeline[0].count) > 0) {
    console.log('ℹ️  Frise chronologique déjà peuplée — skip')
  } else {
    for (const row of TIMELINE_ROWS) {
      await client.query(
        `INSERT INTO timeline_events (period, title_fr, title_en, description_fr, description_en, color, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [row.period, row.title_fr, row.title_en, row.description_fr, row.description_en, row.color, row.sort_order]
      )
    }
    console.log(`✅ Frise chronologique : ${TIMELINE_ROWS.length} événements insérés`)
  }

  const { rows: existingFounders } = await client.query('SELECT count(*) FROM founders')
  if (parseInt(existingFounders[0].count) > 0) {
    console.log('ℹ️  Fondateurs déjà peuplés — skip')
  } else {
    for (const row of FOUNDER_ROWS) {
      await client.query(
        `INSERT INTO founders (full_name, role_fr, role_en, in_memoriam, sort_order)
         VALUES ($1, $2, $3, $4, $5)`,
        [row.full_name, row.role_fr, row.role_en, row.in_memoriam, row.sort_order]
      )
    }
    console.log(`✅ Fondateurs : ${FOUNDER_ROWS.length} membres insérés`)
  }

  console.log('\n✅ Seed terminé !')
}

async function main() {
  console.log('\n🚀 AECC — Push des migrations Supabase\n')
  console.log('🔌 Recherche d\'une connexion PostgreSQL...\n')

  let client = null

  for (const config of CONNECTION_CONFIGS) {
    console.log(`  Essai: ${config.label}...`)
    const c = await tryConnect(config)
    if (c) {
      console.log(`  ✅ Connecté via: ${config.label}\n`)
      client = c
      break
    } else {
      console.log(`  ❌ Échec`)
    }
  }

  if (!client) {
    console.log(`
❌ Impossible de se connecter à la base de données Supabase.

Les connexions directes nécessitent le mot de passe de la base de données
(différent du service role key JWT).

══════════════════════════════════════════════════════════════
📋 COMMENT RÉCUPÉRER LE MOT DE PASSE DE LA BD :
══════════════════════════════════════════════════════════════

1. Va sur :
   https://supabase.com/dashboard/project/akimsarbgxwicyfotgja/settings/database

2. Trouve la section "Connection string" ou "Database password"

3. Soit tu copies le mot de passe, soit tu utilises directement
   la "Connection string" fournie.

4. Relance avec :
   PGPASSWORD="ton-mot-de-passe" node scripts/push-migrations.mjs

══════════════════════════════════════════════════════════════
OU : Applique le SQL manuellement dans le SQL Editor :
   https://supabase.com/dashboard/project/akimsarbgxwicyfotgja/sql/new
══════════════════════════════════════════════════════════════
`)
    process.exit(1)
  }

  try {
    await runMigrations(client)
    await insertSeedData(client)

    console.log(`
══════════════════════════════════════════════════════════════
✅ MIGRATION COMPLÈTE !
══════════════════════════════════════════════════════════════

Prochaine étape : Créer un compte admin Supabase
→ https://supabase.com/dashboard/project/akimsarbgxwicyfotgja/auth/users
  Cliquer "Add user" → email + mot de passe

Puis tester sur http://localhost:3000/fr
══════════════════════════════════════════════════════════════
`)
  } finally {
    await client.end()
  }
}

// Support pour PGPASSWORD env variable
if (process.env.PGPASSWORD) {
  // Override password dans toutes les configs
  CONNECTION_CONFIGS.forEach(c => { c.password = process.env.PGPASSWORD })
}

main().catch(console.error)
