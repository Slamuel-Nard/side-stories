import {
  emptyChapterValues,
  validateChapter,
  valuesFromFormData,
  type ChapterFieldName,
  type ChapterFormValues,
} from '@/lib/chapter-validation'
import type {
  StorySubmission,
  StorySubmissionResult,
} from '@/lib/data'

export type ChapterActionState = {
  fieldErrors?: Partial<Record<ChapterFieldName, string[]>>
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
  submit: (submission: StorySubmission) => Promise<StorySubmissionResult>
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

  if (!validation.success) {
    return {
      status: 'error',
      state: {
        status: 'error',
        message: 'Please correct the highlighted fields.',
        fieldErrors: validation.error.flatten().fieldErrors,
        values,
      },
    }
  }

  const chapter = validation.data

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

    const result = await dependencies.submit({
      artifactId: chapter.artifact_id,
      event: chapter.event,
      fingerprint,
      instagramHandle: chapter.instagram_handle,
      messageToFutureHolders: chapter.message_to_future_holders,
      nextDestination: chapter.next_destination,
      story: chapter.story,
      travelerName: chapter.traveler_name,
    })

    if (result === 'rate_limited') {
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
  } catch {
    return {
      status: 'error',
      state: {
        status: 'error',
        message:
          'The archive could not save your chapter. Your words are still here—please try again.',
        values,
      },
    }
  }
}
