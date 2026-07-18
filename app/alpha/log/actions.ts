'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import {
  processChapterSubmission,
  type ChapterActionState,
} from '@/lib/chapter-submission'
import {
  createSignedChapterPhotoUpload,
  removeChapterPhoto,
  uploadChapterPhoto,
  verifyChapterPhotoPath,
} from '@/lib/chapter-photo-storage'
import { getAlphaArtifact, submitAlphaStory } from '@/lib/data'
import {
  createSubmissionFingerprint,
  getClientIp,
} from '@/lib/submission-security'

export async function createAlphaChapterPhotoUpload(artifactId: string) {
  const secret = process.env.SUBMISSION_HASH_SECRET

  if (!secret || secret.length < 32 || !(await getAlphaArtifact(artifactId))) {
    throw new Error('Alpha chapter photo uploads are temporarily unavailable.')
  }

  return createSignedChapterPhotoUpload('alpha', artifactId, secret)
}

export async function createAlphaChapter(
  _previousState: ChapterActionState,
  formData: FormData,
): Promise<ChapterActionState> {
  const secret = process.env.SUBMISSION_HASH_SECRET

  if (!secret || secret.length < 32) {
    console.error(
      'SUBMISSION_HASH_SECRET must be configured with at least 32 characters.',
    )
    return {
      status: 'error',
      message: 'Alpha chapter submissions are temporarily unavailable.',
      values: {
        event: String(formData.get('event') ?? ''),
        traveler_name: String(formData.get('traveler_name') ?? ''),
        instagram_handle: String(formData.get('instagram_handle') ?? ''),
        story: String(formData.get('story') ?? ''),
        next_destination: String(formData.get('next_destination') ?? ''),
        message_to_future_holders: String(
          formData.get('message_to_future_holders') ?? '',
        ),
      },
    }
  }

  const requestHeaders = await headers()
  const fingerprint = createSubmissionFingerprint(
    getClientIp(requestHeaders),
    secret,
  )
  const result = await processChapterSubmission(formData, fingerprint, {
    artifactExists: async (artifactId) =>
      Boolean(await getAlphaArtifact(artifactId)),
    uploadPhoto: (file, artifactId) =>
      uploadChapterPhoto(file, 'alpha', artifactId),
    removePhoto: removeChapterPhoto,
    submit: submitAlphaStory,
    validatePhotoPath: (path, signature) =>
      verifyChapterPhotoPath(path, signature, 'alpha', secret),
  })

  if (result.status === 'accepted') {
    redirect(`/alpha/archive/${encodeURIComponent(result.artifactId)}`)
  }

  return result.state
}
