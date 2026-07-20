const FALLBACK_SITE_URL = 'https://www.mikebzzrentals.com'

export function getSiteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || FALLBACK_SITE_URL
  const cleaned = raw.trim().replace(/[^\x21-\x7E]/g, '')

  try {
    return new URL(cleaned).origin
  } catch {
    return FALLBACK_SITE_URL
  }
}
