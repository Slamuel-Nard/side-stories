import { describe, expect, it } from 'vitest'

import {
  createSubmissionFingerprint,
  getClientIp,
} from '@/lib/submission-security'

describe('submission fingerprinting', () => {
  it('uses the first forwarded address', () => {
    const requestHeaders = new Headers({
      'x-forwarded-for': '203.0.113.7, 10.0.0.1',
    })

    expect(getClientIp(requestHeaders)).toBe('203.0.113.7')
  })

  it('creates a stable fingerprint without retaining the raw IP', () => {
    const fingerprint = createSubmissionFingerprint(
      '203.0.113.7',
      'a-secret-that-is-longer-than-thirty-two-characters',
    )

    expect(fingerprint).toHaveLength(64)
    expect(fingerprint).not.toContain('203.0.113.7')
    expect(fingerprint).toBe(
      createSubmissionFingerprint(
        '203.0.113.7',
        'a-secret-that-is-longer-than-thirty-two-characters',
      ),
    )
  })
})
