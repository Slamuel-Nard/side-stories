import {
  emptyChapterValues,
  validateChapter,
  valuesFromFormData,
  type ChapterFieldName,
  type ChapterFormValues,
} from '@/lib/chapter-validation'
import { validateChapterPhoto } from '@/lib/chapter-photo-validation'
import type {
  StorySubmission,
  StorySubmissionResult,
} from '@/lib/data'

export type ChapterActionState = {
  fieldErrors?: Partial<Record<ChapterFieldName | 'photo', string[]>>
  message?: string
  status: 'idle' | 'error'
  values: ChapterFormValues
}

export const initialChapterState: ChapterActionState = {
  status: 'idle',
  values: emptyChapterValues,
}

export type ChapterSubmissionDependencies = {
  artifactExists: (artifactId: string) => Promise<boolean>
  removePhoto?: (path: string) => Promise<void>
  submit: (submission: StorySubmission) => Promise<StorySubmissionResult>
  uploadPhoto?: (file: File, artifactId: string) => Promise<string>
}

async function cleanUpPhoto(
  path: string | null,
  removePhoto?: (path: string) => Promise<void>,
) {
  if (!path || !removePhoto) return

  try {
    await removePhoto(path)
  } catch (error) {
    console.error('Unable to clean up rejected chapter photo', error)
  }
}

export async function processChapterSubmission(
  formData: FormData,
  fingerprint: string,
  dependencies: ChapterSubmissionDependencies,
): Promise<
  | { artifactId: string; status: 'accepted' }
  | { state: ChapterActionState; status: 'error' }
> {
  const values = valuesFromFormData(formData)
  const validation = validateChapter(formData)
  const photoValidation = validateChapterPhoto(formData)

  if (!validation.success || !photoValidation.success) {
    const fieldErrors: ChapterActionState['fieldErrors'] = validation.success
      ? {}
      : validation.error.flatten().fieldErrors

    if (!photoValidation.success) {
      fieldErrors.photo = [photoValidation.error]
    }

    return {
      status: 'error',
      state: {
        status: 'error',
        message: 'Please correct the highlighted fields.',
        fieldErrors,
        values,
      },
    }
  }

  const chapter = validation.data
  let photoPath: string | null = null
  let photoUploadAttempted = false

  try {
    if (!(await dependencies.artifactExists(chapter.artifact_id))) {
      return {
        status: 'error',
        state: {
          status: 'error',
          message: 'This artifact could not be found.',
          values,
        },
      }
    }

    if (photoValidation.file) {
      if (!dependencies.uploadPhoto) {
        throw new Error('Chapter photo uploads are not configured.')
      }

      photoUploadAttempted = true
      photoPath = await dependencies.uploadPhoto(
        photoValidation.file,
        chapter.artifact_id,
      )
    }

    const result = await dependencies.submit({
      artifactId: chapter.artifact_id,
      event: chapter.event,
      fingerprint,
      instagramHandle: chapter.instagram_handle,
      messageToFutureHolders: chapter.message_to_future_holders,
      nextDestination: chapter.next_destination,
      photoPath,
      story: chapter.story,
      travelerName: chapter.traveler_name,
    })

    if (result === 'rate_limited') {
      await cleanUpPhoto(photoPath, dependencies.removePhoto)
      return {
        status: 'error',
        state: {
          status: 'error',
          message:
            'Too many chapters were submitted recently. Please wait 15 minutes and try again.',
          values,
        },
      }
    }

    if (result === 'artifact_not_found') {
      await cleanUpPhoto(photoPath, dependencies.removePhoto)
      return {
        status: 'error',
        state: {
          status: 'error',
          message: 'This artifact could not be found.',
          values,
        },
      }
    }

    return {
      status: 'accepted',
      artifactId: chapter.artifact_id,
    }
  } catch (error) {
    console.error('Chapter submission failed', error)
    await cleanUpPhoto(photoPath, dependencies.removePhoto)
    return {
      status: 'error',
      state: {
        status: 'error',
        message:
          photoUploadAttempted && !photoPath
            ? 'The photo could not be uploaded. Please choose it again and try a JPEG, PNG, or WebP under 5 MB.'
            : 'The archive could not save your chapter. Your words are still here—please try again.',
        values,
      },
    }
  }
}
