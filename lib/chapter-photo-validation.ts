export const CHAPTER_PHOTO_MAX_BYTES = 5 * 1024 * 1024

export const chapterPhotoTypes = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const

const allowedPhotoTypes = new Set<string>(chapterPhotoTypes)

export type ChapterPhotoValidation =
  | { file: File | null; success: true }
  | { error: string; success: false }

export type ChapterPhotoPathValidation =
  | { path: string | null; signature: string | null; success: true }
  | { error: string; success: false }

export function validateChapterPhoto(formData: FormData): ChapterPhotoValidation {
  const value = formData.get('photo')

  if (!(value instanceof File) || value.size === 0) {
    return { file: null, success: true }
  }

  if (!allowedPhotoTypes.has(value.type)) {
    return {
      success: false,
      error: 'Choose a JPEG, PNG, or WebP photo.',
    }
  }

  if (value.size > CHAPTER_PHOTO_MAX_BYTES) {
    return {
      success: false,
      error: 'The photo must be 5 MB or smaller.',
    }
  }

  return { file: value, success: true }
}

export function validateChapterPhotoPath(
  formData: FormData,
): ChapterPhotoPathValidation {
  const path = String(formData.get('photo_path') ?? '')
  const signature = String(formData.get('photo_signature') ?? '')

  if (!path && !signature) {
    return { path: null, signature: null, success: true }
  }

  if (
    !/^(alpha|standard)\/[A-Za-z0-9_-]+\/[0-9a-f-]{36}\.jpg$/.test(path) ||
    !/^[0-9a-f]{64}$/.test(signature)
  ) {
    return { success: false, error: 'The prepared photo upload expired.' }
  }

  return { path, signature, success: true }
}
