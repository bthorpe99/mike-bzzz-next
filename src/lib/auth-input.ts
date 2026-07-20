const unsafeAuthChars = /[\u200B-\u200D\u2060\uFEFF]/g
const nonAsciiChars = /[^\x20-\x7E]/g

export function normalizeEmail(value: unknown) {
  return String(value ?? '').replace(unsafeAuthChars, '').replace(nonAsciiChars, '').trim().toLowerCase()
}

export function normalizePassword(value: unknown) {
  return String(value ?? '').replace(unsafeAuthChars, '').replace(nonAsciiChars, '')
}

export function friendlyAuthError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error || '')
  if (/ByteString|65279|greater than 255/i.test(message)) {
    return 'Please retype your email and password manually. A hidden copy/paste character was detected.'
  }
  return message || 'Something went wrong'
}
