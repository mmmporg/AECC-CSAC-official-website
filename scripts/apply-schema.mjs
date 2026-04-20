/**
 * Applique le schéma SQL via l'API de management Supabase
 * Usage: node scripts/apply-schema.mjs
 */

// Identifiants Supabase
const PROJECT_REF = 'akimsarbgxwicyfotgja'
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFraW1zYXJiZ3h3aWN5Zm90Z2phIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjY5MDI0MSwiZXhwIjoyMDkyMjY2MjQxfQ._SrZ0Ibz8_v4046-Q7gOD-0CagtdVflg-pba8nzcO0Y'
const SUPABASE_URL = `https://${PROJECT_REF}.supabase.co`

async function execSQL(sql) {
  // Essaie via le endpoint REST de Supabase (Postgres functions)
  const res = await fetch(`${SUPABASE_URL}/rest/v1/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'Prefer': 'return=minimal'
    }
  })

  // Alternative : utiliser l'API REST standard pour créer des tables
  // En Supabase on ne peut pas exécuter du SQL DDL via REST directement
  // Il faut passer par le Management API ou le SQL Editor
}

async function createTablesViaInsert() {
  // On essaie d'insérer dans les tables pour voir si elles existent
  // Si elles n'existent pas, on va créer via l'API PostgREST schema

  const SUPABASE_URL_BASE = `https://${PROJECT_REF}.supabase.co`

  async function checkTable(tableName) {
    const res = await fetch(`${SUPABASE_URL_BASE}/rest/v1/${tableName}?limit=1`, {
      headers: {
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`
      }
    })
    return res.ok
  }

  const tables = ['announcements', 'opportunities', 'timeline_events', 'founders', 'presidents']

  console.log('🔍 Vérification des tables existantes...\n')
  for (const table of tables) {
    const exists = await checkTable(table)
    console.log(`  ${exists ? '✅' : '❌'} ${table}`)
  }

  const timelineOk = await checkTable('timeline_events')
  if (!timelineOk) {
    console.log('\n❌ Les tables n\'existent pas.')
    console.log('\n══════════════════════════════════════════════════════════════')
    console.log('💡 ACTION REQUISE : Créer les tables manuellement')
    console.log('══════════════════════════════════════════════════════════════')
    console.log('\n1. Ouvrez ce lien dans votre navigateur :')
    console.log('   https://supabase.com/dashboard/project/akimsarbgxwicyfotgja/sql/new')
    console.log('\n2. Copiez-collez le contenu de ce fichier SQL :')
    console.log('   C:\\Users\\YOGA\\Downloads\\AECC\\repo\\supabase\\migrations\\001_initial_schema.sql')
    console.log('\n3. Cliquez sur "Run" (le bouton vert)')
    console.log('\n4. Relancez ensuite :')
    console.log('   node scripts/migrate.mjs')
    console.log('\n══════════════════════════════════════════════════════════════\n')
    return false
  }

  return true
}

createTablesViaInsert()
