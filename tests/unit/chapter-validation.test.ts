import { describe, expect, it } from 'vitest'

import {
  normalizeInstagram,
  validateChapter,
} from '@/lib/chapter-validation'

function chapterForm(overrides: Record<string, string> = {}) {
  const formData = new FormData()
  const values = {
    artifact_id: 'M-0001',
    event: '  Philadelphia  ',
    traveler_name: '  A Traveler  ',
    instagram_handle: '  @side.stories  ',
    story: '  This is a complete chapter with enough detail to keep.  ',
    next_destination: '  New York  ',
    message_to_future_holders: '  Keep it moving.  ',
    website: '',
    ...overrides,
  }

  for (const [key, value] of Object.entries(values)) {
    formData.set(key, value)
  }

  return formData
}

describe('chapter validation', () => {
  it('trims text and normalizes an Instagram username', () => {
    const result = validateChapter(chapterForm())

    expect(result.success).toBe(true)
    if (!result.success) return

    expect(result.data).toMatchObject({
      event: 'Philadelphia',
      traveler_name: 'A Traveler',
      instagram_handle: 'side.stories',
      next_destination: 'New York',
      message_to_future_holders: 'Keep it moving.',
    })
  })

  it('turns empty optional values into null', () => {
    const result = validateChapter(
      chapterForm({
        event: '',
        traveler_name: '',
        instagram_handle: '',
        next_destination: '',
        message_to_future_holders: '',
      }),
    )

    expect(result.success).toBe(true)
    if (!result.success) return

    expect(result.data.event).toBeNull()
    expect(result.data.instagram_handle).toBeNull()
  })

  it.each([
    ['too short', 'x'.repeat(19)],
    ['too long', 'x'.repeat(2_001)],
  ])('rejects a story that is %s', (_label, story) => {
    const result = validateChapter(chapterForm({ story }))

    expect(result.success).toBe(false)
    if (result.success) return
    expect(result.error.flatten().fieldErrors.story).toBeDefined()
  })

  it('rejects invalid and oversized Instagram usernames', () => {
    expect(
      validateChapter(chapterForm({ instagram_handle: 'not valid!' })).success,
    ).toBe(false)
    expect(
      validateChapter(
        chapterForm({ instagram_handle: 'a'.repeat(31) }),
      ).success,
    ).toBe(false)
  })

  it('rejects the honeypot when a bot fills it', () => {
    const result = validateChapter(chapterForm({ website: 'spam.example' }))

    expect(result.success).toBe(false)
  })

  it('normalizes only a leading at-sign', () => {
    expect(normalizeInstagram('@keeper')).toBe('keeper')
    expect(normalizeInstagram('keeper')).toBe('keeper')
    expect(normalizeInstagram('')).toBeNull()
  })
})
