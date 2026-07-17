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
