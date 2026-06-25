import { createHmac } from 'node:crypto'

export function getClientIp(requestHeaders: Headers) {
  const forwardedFor = requestHeaders.get('x-forwarded-for')
  if (forwardedFor) return forwardedFor.split(',')[0]?.trim() || 'unknown'

  return (
    requestHeaders.get('cf-connecting-ip')?.trim() ||
    requestHeaders.get('x-real-ip')?.trim() ||
    'unknown'
  )
}

export function createSubmissionFingerprint(ip: string, secret: string) {
  return createHmac('sha256', secret).update(ip).digest('hex')
}
