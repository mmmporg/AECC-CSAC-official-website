import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isNew(dateStr: string): boolean {
  const diff = Date.now() - new Date(dateStr).getTime()
  return diff < 7 * 24 * 60 * 60 * 1000
}

export function isUrgent(dateStr: string | null): boolean {
  if (!dateStr) {
    return false
  }

  const diff = new Date(dateStr).getTime() - Date.now()
  return diff > 0 && diff < 14 * 24 * 60 * 60 * 1000
}

export function formatRelativeDate(dateStr: string, locale: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (locale === 'fr') {
    if (days === 0) return "Aujourd'hui"
    if (days === 1) return 'Il y a 1 jour'
    if (days < 7) return `Il y a ${days} jours`
    if (days < 14) return 'Il y a 1 semaine'
    if (days < 30) return `Il y a ${Math.floor(days / 7)} semaines`
    return `Il y a ${Math.floor(days / 30)} mois`
  }

  if (days === 0) return 'Today'
  if (days === 1) return '1 day ago'
  if (days < 7) return `${days} days ago`
  if (days < 14) return '1 week ago'
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`
  return `${Math.floor(days / 30)} months ago`
}

export function formatDate(dateStr: string | null, locale: string) {
  if (!dateStr) {
    return locale === 'fr' ? 'Non définie' : 'Not set'
  }

  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(new Date(dateStr))
}

export function getSearchParam(
  value: string | string[] | undefined
): string | undefined {
  if (Array.isArray(value)) {
    return value[0]
  }

  return value
}

export function getPageParam(value: string | string[] | undefined): number {
  const pageValue = Number(getSearchParam(value) ?? '1')
  return Number.isFinite(pageValue) && pageValue > 0 ? pageValue : 1
}

export function getDateRangeForDay(value: string) {
  const normalized = value.trim()

  if (!/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
    return null
  }

  return {
    start: `${normalized}T00:00:00.000Z`,
    end: `${normalized}T23:59:59.999Z`
  }
}
