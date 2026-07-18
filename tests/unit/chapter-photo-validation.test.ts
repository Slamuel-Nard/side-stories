import { describe, expect, it } from 'vitest'

import {
  CHAPTER_PHOTO_MAX_BYTES,
  validateChapterPhoto,
  validateChapterPhotoPath,
} from '@/lib/chapter-photo-validation'

function formWithPhoto(photo?: File) {
  const formData = new FormData()

  if (photo) formData.set('photo', photo)
  return formData
}

describe('chapter photo validation', () => {
  it('allows a missing optional photo', () => {
    expect(validateChapterPhoto(formWithPhoto())).toEqual({
      file: null,
      success: true,
    })
  })

  it.each(['image/jpeg', 'image/png', 'image/webp'])(
    'accepts %s photos',
    (type) => {
      const photo = new File(['photo'], 'chapter-photo', { type })

      expect(validateChapterPhoto(formWithPhoto(photo))).toEqual({
        file: photo,
        success: true,
      })
    },
  )

  it('rejects unsupported image formats', () => {
    const photo = new File(['<svg />'], 'chapter.svg', {
      type: 'image/svg+xml',
    })
    const result = validateChapterPhoto(formWithPhoto(photo))

    expect(result.success).toBe(false)
    if (!result.success) expect(result.error).toMatch(/JPEG, PNG, or WebP/i)
  })

  it('rejects photos larger than 5 MB', () => {
    const photo = new File(
      [new Uint8Array(CHAPTER_PHOTO_MAX_BYTES + 1)],
      'large.jpg',
      { type: 'image/jpeg' },
    )
    const result = validateChapterPhoto(formWithPhoto(photo))

    expect(result.success).toBe(false)
    if (!result.success) expect(result.error).toMatch(/5 MB/i)
  })

  it('accepts a prepared photo path and signature', () => {
    const formData = new FormData()
    formData.set(
      'photo_path',
      'alpha/M-0001/12345678-1234-1234-1234-123456789abc.jpg',
    )
    formData.set('photo_signature', 'a'.repeat(64))

    expect(validateChapterPhotoPath(formData)).toEqual({
      path: 'alpha/M-0001/12345678-1234-1234-1234-123456789abc.jpg',
      signature: 'a'.repeat(64),
      success: true,
    })
  })

  it('rejects a malformed prepared photo path', () => {
    const formData = new FormData()
    formData.set('photo_path', '../private/photo.jpg')
    formData.set('photo_signature', 'a'.repeat(64))

    expect(validateChapterPhotoPath(formData).success).toBe(false)
  })
})
