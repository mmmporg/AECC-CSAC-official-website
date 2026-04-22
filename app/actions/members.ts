'use server'

import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { cityOptions } from '@/lib/options'
import { createClient, requireAdminUser } from '@/lib/supabase/server'

interface ActionResult {
  success: boolean
  error?: string
}

const MAX_NAME_LENGTH = 80
const MAX_UNIVERSITY_LENGTH = 160
const MAX_DEGREE_LENGTH = 120
const MAX_BIO_LENGTH = 300
const MAX_WECHAT_LENGTH = 80
const MIN_YEAR = 1990
const MAX_YEAR_OFFSET = 10

type CityOption = (typeof cityOptions)[number]

function readField(formData: FormData, key: string, required = true) {
  const value = formData.get(key)

  if (typeof value !== 'string') {
    if (required) {
      throw new Error(`Missing field: ${key}`)
    }

    return null
  }

  const trimmed = value.trim()

  if (!trimmed && required) {
    throw new Error(`Missing field: ${key}`)
  }

  return trimmed || null
}

function isValidCity(value: string): value is CityOption {
  return cityOptions.includes(value as CityOption)
}

function assertMaxLength(value: string | null, key: string, maxLength: number) {
  if (value && value.length > maxLength) {
    throw new Error(`Invalid field length: ${key}`)
  }
}

function readOptionalYear(formData: FormData, key: string) {
  const rawValue = readField(formData, key, false)

  if (!rawValue) {
    return null
  }

  const parsedYear = Number(rawValue)
  const maxYear = new Date().getFullYear() + MAX_YEAR_OFFSET

  if (!Number.isInteger(parsedYear) || parsedYear < MIN_YEAR || parsedYear > maxYear) {
    throw new Error(`Invalid year: ${key}`)
  }

  return parsedYear
}

function validateLinkedInUrl(value: string | null) {
  if (!value) {
    return
  }

  let parsedUrl: URL

  try {
    parsedUrl = new URL(value)
  } catch {
    throw new Error('Invalid LinkedIn URL')
  }

  if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
    throw new Error('Invalid LinkedIn URL')
  }
}

function validateEmail(value: string | null) {
  if (!value) return
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(value)) {
    throw new Error('Adresse email invalide')
  }
}

export async function submitPublicMember(formData: FormData): Promise<ActionResult> {
  try {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

    if (!serviceRoleKey || !supabaseUrl) {
      throw new Error('Server configuration error')
    }

    const supabase = createSupabaseClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    const city = readField(formData, 'city')

    if (!city || !isValidCity(city)) {
      throw new Error('Invalid city')
    }

    const firstName = readField(formData, 'first_name')
    const lastName = readField(formData, 'last_name')
    const university = readField(formData, 'university')
    const degree = readField(formData, 'degree')
    const linkedinUrl = readField(formData, 'linkedin_url', false)
    const email = readField(formData, 'email', false)
    const wechat = readField(formData, 'wechat', false)
    const bio = readField(formData, 'bio', false)

    assertMaxLength(firstName, 'first_name', MAX_NAME_LENGTH)
    assertMaxLength(lastName, 'last_name', MAX_NAME_LENGTH)
    assertMaxLength(university, 'university', MAX_UNIVERSITY_LENGTH)
    assertMaxLength(degree, 'degree', MAX_DEGREE_LENGTH)
    assertMaxLength(bio, 'bio', MAX_BIO_LENGTH)
    assertMaxLength(wechat, 'wechat', MAX_WECHAT_LENGTH)
    validateLinkedInUrl(linkedinUrl)
    validateEmail(email)

    const payload = {
      approved_by: null,
      bio,
      city,
      degree,
      email,
      entry_year: readOptionalYear(formData, 'entry_year'),
      first_name: firstName,
      graduation_year: readOptionalYear(formData, 'graduation_year'),
      is_active: false,
      last_name: lastName,
      linkedin_url: linkedinUrl,
      university,
      wechat
    }

    const { error } = await supabase.from('members').insert(payload)

    if (error) {
      throw new Error(error.message)
    }

    revalidatePath('/admin/dashboard')
    revalidatePath('/fr/annuaire')
    revalidatePath('/en/annuaire')

    return { success: true }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unexpected error',
      success: false
    }
  }
}

export async function getPublicMembers() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .eq('is_active', true)
    .order('last_name', { ascending: true })

  if (error) {
    console.error('Error fetching members:', error)
    return []
  }

  return data
}

export async function toggleMemberStatus(id: string, active: boolean): Promise<void> {
  const user = await requireAdminUser()
  const supabase = createClient()
  const { error } = await supabase
    .from('members')
    .update({ approved_by: user.id, is_active: active })
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/membres')
  revalidatePath('/fr/annuaire')
  revalidatePath('/en/annuaire')
}
