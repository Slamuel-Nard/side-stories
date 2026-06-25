import { describe, expect, it, vi } from 'vitest'

import { processChapterSubmission } from '@/lib/chapter-submission'

function validForm(overrides: Record<string, string> = {}) {
  const formData = new FormData()
  const values = {
    artifact_id: 'M-0001',
    event: 'Philadelphia',
    traveler_name: 'A Traveler',
    instagram_handle: '@side.stories',
    story: 'This chapter contains enough detail to be accepted.',
    next_destination: '',
    message_to_future_holders: '',
    website: '',
    ...overrides,
  }

  Object.entries(values).forEach(([key, value]) => formData.set(key, value))
  return formData
}

describe('chapter submission processing', () => {
  it('does not touch the database when validation fails', async () => {
    const artifactExists = vi.fn()
    const submit = vi.fn()

    const result = await processChapterSubmission(
      validForm({ story: 'Too short' }),
      'fingerprint',
      { artifactExists, submit },
    )

    expect(result.status).toBe('error')
    expect(artifactExists).not.toHaveBeenCalled()
    expect(submit).not.toHaveBeenCalled()
  })

  it('rejects an unknown artifact', async () => {
    const result = await processChapterSubmission(
      validForm(),
      'fingerprint',
      {
        artifactExists: vi.fn().mockResolvedValue(false),
        submit: vi.fn(),
      },
    )

    expect(result.status).toBe('error')
    if (result.status === 'error') {
      expect(result.state.message).toMatch(/could not be found/i)
    }
  })

  it('returns the throttled state', async () => {
    const result = await processChapterSubmission(
      validForm(),
      'fingerprint',
      {
        artifactExists: vi.fn().mockResolvedValue(true),
        submit: vi.fn().mockResolvedValue('rate_limited'),
      },
    )

    expect(result.status).toBe('error')
    if (result.status === 'error') {
      expect(result.state.message).toMatch(/15 minutes/i)
    }
  })

  it('retains form values after a database failure', async () => {
    const result = await processChapterSubmission(
      validForm({ event: 'The venue' }),
      'fingerprint',
      {
        artifactExists: vi.fn().mockResolvedValue(true),
        submit: vi.fn().mockRejectedValue(new Error('database unavailable')),
      },
    )

    expect(result.status).toBe('error')
    if (result.status === 'error') {
      expect(result.state.values.event).toBe('The venue')
      expect(result.state.message).toMatch(/could not save/i)
    }
  })

  it('submits normalized plain-text values and accepts success', async () => {
    const submit = vi.fn().mockResolvedValue('accepted')

    const result = await processChapterSubmission(
      validForm(),
      'hashed-client-fingerprint',
      {
        artifactExists: vi.fn().mockResolvedValue(true),
        submit,
      },
    )

    expect(result).toEqual({
      status: 'accepted',
      artifactId: 'M-0001',
    })
    expect(submit).toHaveBeenCalledWith(
      expect.objectContaining({
        fingerprint: 'hashed-client-fingerprint',
        instagramHandle: 'side.stories',
      }),
    )
  })
})
