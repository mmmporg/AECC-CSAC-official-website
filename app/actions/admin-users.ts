'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import {
  requireSuperAdminUser,
  type AdminRole
} from '@/lib/supabase/server'

interface ActionResult {
  success: boolean
  error?: string
}

export interface AdminUserActionState {
  success: boolean
  error?: string
}

const VALID_ROLES = new Set<AdminRole>(['admin', 'super_admin'])
const MIN_PASSWORD_LENGTH = 10
const DISABLE_DURATION = '876000h'

function readString(formData: FormData, key: string) {
  const value = formData.get(key)

  if (typeof value !== 'string') {
    throw new Error(`Missing field: ${key}`)
  }

  const trimmed = value.trim()

  if (!trimmed) {
    throw new Error(`Missing field: ${key}`)
  }

  return trimmed
}

function readRole(formData: FormData) {
  const role = readString(formData, 'role')

  if (!VALID_ROLES.has(role as AdminRole)) {
    throw new Error('Invalid role')
  }

  return role as AdminRole
}

function validateEmail(email: string) {
  const normalized = email.toLowerCase()

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    throw new Error('Invalid email address')
  }

  return normalized
}

function validatePassword(password: string) {
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`)
  }

  return password
}

async function getTargetUser(id: string) {
  const supabase = createAdminClient()
  const { data, error } = await supabase.auth.admin.getUserById(id)

  if (error || !data.user) {
    throw new Error(error?.message ?? 'User not found')
  }

  return { supabase, user: data.user }
}

function revalidateAdminAccountPaths() {
  revalidatePath('/admin/comptes')
}

export async function createAdminAccount(formData: FormData): Promise<ActionResult> {
  try {
    await requireSuperAdminUser()
    const supabase = createAdminClient()
    const email = validateEmail(readString(formData, 'email'))
    const password = validatePassword(readString(formData, 'password'))
    const role = readRole(formData)

    const { error } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
      password,
      user_metadata: { role }
    })

    if (error) {
      throw new Error(error.message)
    }

    revalidateAdminAccountPaths()
    return { success: true }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unexpected error',
      success: false
    }
  }
}

export async function updateAdminRole(formData: FormData): Promise<ActionResult> {
  try {
    const currentUser = await requireSuperAdminUser()
    const id = readString(formData, 'id')
    const role = readRole(formData)
    const { supabase, user } = await getTargetUser(id)

    if (currentUser.id === id && role !== 'super_admin') {
      throw new Error('You cannot remove your own super admin access')
    }

    const { error } = await supabase.auth.admin.updateUserById(id, {
      user_metadata: {
        ...(user.user_metadata ?? {}),
        role
      }
    })

    if (error) {
      throw new Error(error.message)
    }

    revalidateAdminAccountPaths()
    return { success: true }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unexpected error',
      success: false
    }
  }
}

export async function resetAdminPassword(formData: FormData): Promise<ActionResult> {
  try {
    await requireSuperAdminUser()
    const id = readString(formData, 'id')
    const password = validatePassword(readString(formData, 'password'))
    const { supabase } = await getTargetUser(id)

    const { error } = await supabase.auth.admin.updateUserById(id, {
      password
    })

    if (error) {
      throw new Error(error.message)
    }

    revalidateAdminAccountPaths()
    return { success: true }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unexpected error',
      success: false
    }
  }
}

export async function toggleAdminAccountAccess(formData: FormData): Promise<ActionResult> {
  try {
    const currentUser = await requireSuperAdminUser()
    const id = readString(formData, 'id')
    const nextState = readString(formData, 'disabled')
    const { supabase } = await getTargetUser(id)
    if (nextState !== 'true' && nextState !== 'false') {
      throw new Error('Invalid disabled state')
    }

    const shouldDisable = nextState === 'true'

    if (currentUser.id === id && shouldDisable) {
      throw new Error('You cannot disable your own account')
    }

    const { error } = await supabase.auth.admin.updateUserById(id, {
      ban_duration: shouldDisable ? DISABLE_DURATION : 'none'
    })

    if (error) {
      throw new Error(error.message)
    }

    revalidateAdminAccountPaths()
    return { success: true }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unexpected error',
      success: false
    }
  }
}

export async function createAdminAccountFormAction(
  _previousState: AdminUserActionState,
  formData: FormData
): Promise<AdminUserActionState> {
  return createAdminAccount(formData)
}

export async function updateAdminRoleFormAction(
  _previousState: AdminUserActionState,
  formData: FormData
): Promise<AdminUserActionState> {
  return updateAdminRole(formData)
}

export async function resetAdminPasswordFormAction(
  _previousState: AdminUserActionState,
  formData: FormData
): Promise<AdminUserActionState> {
  return resetAdminPassword(formData)
}

export async function toggleAdminAccountAccessFormAction(
  _previousState: AdminUserActionState,
  formData: FormData
): Promise<AdminUserActionState> {
  return toggleAdminAccountAccess(formData)
}
