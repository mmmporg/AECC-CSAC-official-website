import { spawn, spawnSync } from 'node:child_process'
import net from 'node:net'
import path from 'node:path'
import process from 'node:process'
import { setTimeout as delay } from 'node:timers/promises'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

const host = 'localhost'
const cwd = process.cwd()
const nextBin = path.join(cwd, 'node_modules', 'next', 'dist', 'bin', 'next')
const isWindows = process.platform === 'win32'

dotenv.config({ path: path.join(cwd, '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

function log(message) {
  process.stdout.write(`${message}\n`)
}

function fail(message) {
  throw new Error(message)
}

function getAdminClient() {
  if (!supabaseUrl || !serviceRoleKey) {
    fail('Missing Supabase environment variables required for smoke tests.')
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false
    }
  })
}

async function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer()
    server.listen(0, host, () => {
      const address = server.address()

      if (!address || typeof address === 'string') {
        server.close(() => reject(new Error('Unable to resolve a free port.')))
        return
      }

      const { port } = address
      server.close((error) => {
        if (error) {
          reject(error)
          return
        }

        resolve(port)
      })
    })
    server.on('error', reject)
  })
}

async function waitForServer(url, timeoutMs = 120000) {
  const startedAt = Date.now()

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url, { redirect: 'manual' })
      if (response.status >= 200 && response.status < 500) {
        return
      }
    } catch {
      // Server not ready yet.
    }

    await delay(1000)
  }

  fail(`Timed out waiting for server at ${url}.`)
}

function runBuild() {
  log('Running production build...')
  const result = isWindows
    ? spawnSync('cmd.exe', ['/d', '/s', '/c', 'npm run build'], {
        cwd,
        stdio: 'inherit'
      })
    : spawnSync('npm', ['run', 'build'], {
        cwd,
        stdio: 'inherit'
      })

  if (result.error) {
    fail(result.error.message)
  }

  if (result.status !== 0) {
    fail(`Build failed with exit code ${result.status ?? 'unknown'}.`)
  }
}

function startServer(port) {
  log(`Starting Next production server on ${host}:${port}...`)
  return spawn(process.execPath, [nextBin, 'start', '--hostname', host, '--port', String(port)], {
    cwd,
    stdio: 'inherit'
  })
}

async function request(baseUrl, pathname, options = {}) {
  const response = await fetch(`${baseUrl}${pathname}`, {
    redirect: 'manual',
    ...options
  })
  const body = await response.text()
  return { response, body }
}

function getLocationPath(response) {
  const location = response.headers.get('location')

  if (!location) {
    return null
  }

  try {
    return new URL(location).pathname
  } catch {
    return location
  }
}

function expectStatus(response, expected, label) {
  if (response.status !== expected) {
    fail(`${label}: expected status ${expected}, received ${response.status}.`)
  }
}

function expectLocation(response, expectedPath, label) {
  const locationPath = getLocationPath(response)
  if (locationPath !== expectedPath) {
    fail(`${label}: expected location "${expectedPath}", received "${locationPath}".`)
  }
}

function expectIncludes(body, needle, label) {
  if (!body.includes(needle)) {
    fail(`${label}: expected response to include "${needle}".`)
  }
}

function expectExcludes(body, needle, label) {
  if (body.includes(needle)) {
    fail(`${label}: expected response not to include "${needle}".`)
  }
}

async function runSmokeSuite(baseUrl) {
  log('Running smoke checks...')
  const adminClient = getAdminClient()
  const cleanupTasks = []

  try {
    {
      const { response } = await request(baseUrl, '/')
      const locationPath = getLocationPath(response) ?? ''
      if (![307, 308].includes(response.status) || !/^\/(fr|en)$/.test(locationPath)) {
        fail(`Root redirect: expected 307/308 to /fr or /en, received ${response.status} to "${locationPath}".`)
      }
    }

    {
      const { response, body } = await request(baseUrl, '/fr')
      expectStatus(response, 200, 'French home')
      expectIncludes(body, 'AECC', 'French home')
      expectIncludes(body, '/fr/histoire', 'French home')
    }

    {
      const { response, body } = await request(baseUrl, '/en')
      expectStatus(response, 200, 'English home')
      expectIncludes(body, 'AECC', 'English home')
      expectIncludes(body, '/en/histoire', 'English home')
    }

    {
      const { response, body } = await request(baseUrl, '/fr/histoire')
      expectStatus(response, 200, 'History page')
      expectIncludes(body, 'Issa Rouhaya', 'History page')
    }

    {
      const { response, body } = await request(baseUrl, '/fr/a-propos')
      expectStatus(response, 200, 'About page')
      expectIncludes(body, 'contact@aecc.org', 'About page')
    }

    {
      const { response, body } = await request(baseUrl, '/fr/annonces')
      expectStatus(response, 200, 'Announcements page')
      expectIncludes(body, 'name="city"', 'Announcements page')
      expectIncludes(body, 'name="category"', 'Announcements page')
      expectIncludes(body, 'name="date"', 'Announcements page')
    }

    {
      const { response, body } = await request(baseUrl, '/fr/opportunites')
      expectStatus(response, 200, 'Opportunities page')
      expectIncludes(body, 'name="domain"', 'Opportunities page')
      expectIncludes(body, 'name="category"', 'Opportunities page')
      expectIncludes(body, 'name="deadline"', 'Opportunities page')
    }

    {
      const { response } = await request(baseUrl, '/admin/dashboard')
      expectLocation(response, '/admin/login', 'Admin dashboard redirect')
    }

    {
      const { response } = await request(baseUrl, '/admin/comptes')
      expectLocation(response, '/admin/login', 'Admin accounts redirect')
    }

    {
      const { response, body } = await request(baseUrl, '/admin/login')
      expectStatus(response, 200, 'Admin login page')
      expectIncludes(body, 'type="email"', 'Admin login page')
      expectIncludes(body, 'type="password"', 'Admin login page')
    }

    {
      const timestamp = Date.now()
      const titleFr = `Smoke annonce ${timestamp}`
      const city = `SmokeCity${timestamp}`
      const descriptionFr = `<p>Description FR ${timestamp}</p>`
      const { data, error } = await adminClient
        .from('announcements')
        .insert({
          title_fr: titleFr,
          title_en: null,
          description_fr: descriptionFr,
          description_en: null,
          category: 'logement',
          city,
          contact: `smoke-${timestamp}@aecc.test`,
          is_active: true
        })
        .select('id')
        .single()

      if (error || !data) {
        fail(`Unable to create smoke announcement: ${error?.message ?? 'unknown error'}.`)
      }

      cleanupTasks.push(async () => {
        await adminClient.from('announcements').delete().eq('id', data.id)
      })

      {
        const { response, body } = await request(
          baseUrl,
          `/fr/annonces?city=${encodeURIComponent(city)}&category=logement&nonce=${timestamp}`
        )
        expectStatus(response, 200, 'Announcements filtered page')
        expectIncludes(body, titleFr, 'Announcements filtered page')
      }

      {
        const { response, body } = await request(baseUrl, `/en/annonces/${data.id}`)
        expectStatus(response, 200, 'Announcement EN fallback detail')
        expectIncludes(body, titleFr, 'Announcement EN fallback detail')
        expectIncludes(body, `Description FR ${timestamp}`, 'Announcement EN fallback detail')
      }

      const { error: archiveError } = await adminClient
        .from('announcements')
        .update({ is_active: false })
        .eq('id', data.id)

      if (archiveError) {
        fail(`Unable to archive smoke announcement: ${archiveError.message}.`)
      }

      {
        const { response, body } = await request(
          baseUrl,
          `/fr/annonces?city=${encodeURIComponent(city)}&category=logement&nonce=${timestamp + 1}`
        )
        expectStatus(response, 200, 'Archived announcement list')
        expectExcludes(body, titleFr, 'Archived announcement list')
      }
    }

    {
      const timestamp = Date.now() + 1
      const titleFr = `Smoke opportunite ${timestamp}`
      const updatedTitleFr = `${titleFr} modifiee`
      const organization = `Smoke Org ${timestamp}`
      const deadline = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString()
      const { data, error } = await adminClient
        .from('opportunities')
        .insert({
          title_fr: titleFr,
          title_en: null,
          description_fr: `<p>Opportunity FR ${timestamp}</p>`,
          description_en: null,
          category: 'formation',
          organization,
          external_link: null,
          deadline,
          is_active: true
        })
        .select('id')
        .single()

      if (error || !data) {
        fail(`Unable to create smoke opportunity: ${error?.message ?? 'unknown error'}.`)
      }

      cleanupTasks.push(async () => {
        await adminClient.from('opportunities').delete().eq('id', data.id)
      })

      {
        const { response, body } = await request(
          baseUrl,
          `/fr/opportunites?domain=${encodeURIComponent(organization)}&category=formation&nonce=${timestamp}`
        )
        expectStatus(response, 200, 'Opportunities filtered page')
        expectIncludes(body, titleFr, 'Opportunities filtered page')
      }

      {
        const { response, body } = await request(baseUrl, `/en/opportunites/${data.id}`)
        expectStatus(response, 200, 'Opportunity EN fallback detail')
        expectIncludes(body, titleFr, 'Opportunity EN fallback detail')
        expectIncludes(body, `Opportunity FR ${timestamp}`, 'Opportunity EN fallback detail')
      }

      const { error: updateError } = await adminClient
        .from('opportunities')
        .update({ title_fr: updatedTitleFr })
        .eq('id', data.id)

      if (updateError) {
        fail(`Unable to update smoke opportunity: ${updateError.message}.`)
      }

      {
        const { response, body } = await request(baseUrl, `/fr/opportunites/${data.id}`)
        expectStatus(response, 200, 'Updated opportunity detail')
        expectIncludes(body, updatedTitleFr, 'Updated opportunity detail')
      }

      const { error: deleteError } = await adminClient
        .from('opportunities')
        .delete()
        .eq('id', data.id)

      if (deleteError) {
        fail(`Unable to delete smoke opportunity: ${deleteError.message}.`)
      }

      cleanupTasks.pop()

      {
        const { response, body } = await request(
          baseUrl,
          `/fr/opportunites?domain=${encodeURIComponent(organization)}&category=formation&nonce=${timestamp + 1}`
        )
        expectStatus(response, 200, 'Deleted opportunity list')
        expectExcludes(body, updatedTitleFr, 'Deleted opportunity list')
      }
    }

    log('Smoke checks passed.')
  } finally {
    for (const cleanupTask of cleanupTasks.reverse()) {
      try {
        await cleanupTask()
      } catch {
        // Ignore cleanup failures after the primary assertion result.
      }
    }
  }
}

async function main() {
  runBuild()

  const port = await getFreePort()
  const baseUrl = `http://${host}:${port}`
  const server = startServer(port)

  const shutdown = () => {
    if (!server.killed) {
      server.kill('SIGTERM')
    }
  }

  process.on('exit', shutdown)
  process.on('SIGINT', () => {
    shutdown()
    process.exit(130)
  })
  process.on('SIGTERM', () => {
    shutdown()
    process.exit(143)
  })

  try {
    await waitForServer(`${baseUrl}/fr`)
    await runSmokeSuite(baseUrl)
  } finally {
    shutdown()
    await delay(1000)
  }
}

main().catch((error) => {
  console.error('\nSmoke tests failed.')
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
