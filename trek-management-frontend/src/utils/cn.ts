type ClassValue = string | undefined | null | false | ClassValue[]

function flattenClasses(value: ClassValue): string {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (Array.isArray(value)) return value.map(flattenClasses).filter(Boolean).join(' ')
  return ''
}

/**
 * Merges class names, filtering out falsy values.
 * Lightweight alternative to clsx/twMerge — add those if conflicts arise.
 */
export function cn(...classes: ClassValue[]): string {
  return classes.map(flattenClasses).filter(Boolean).join(' ')
}
