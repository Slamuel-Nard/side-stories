import 'server-only'

import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto'

import { getSupabaseAdminClient, getSupabaseReadClient } from '@/lib/supabase/server'

const CHAPTER_PHOTO_BUCKET = 'chapter-photos'

const extensionByType: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

export type ChapterLane = 'alpha' | 'standard'

export type SignedChapterPhotoUpload = {
  path: string
  signature: string
  signedUrl: string
}

function chapterPhotoPath(lane: ChapterLane, artifactId: string) {
  const safeArtifactId = artifactId.replace(/[^A-Za-z0-9_-]/g, '-')
  return `${lane}/${safeArtifactId}/${randomUUID()}.jpg`
}

function signChapterPhotoPath(path: string, secret: string) {
  return createHmac('sha256', secret).update(path).digest('hex')
}

export async function createSignedChapterPhotoUpload(
  lane: ChapterLane,
  artifactId: string,
  secret: string,
): Promise<SignedChapterPhotoUpload> {
  const path = chapterPhotoPath(lane, artifactId)
  const { data, error } = await getSupabaseAdminClient()
    .storage
    .from(CHAPTER_PHOTO_BUCKET)
    .createSignedUploadUrl(path)

  if (error) {
    console.error('Supabase signed chapter photo upload failed', error)
    throw new Error('Unable to prepare chapter photo upload.', { cause: error })
  }

  return {
    path,
    signature: signChapterPhotoPath(path, secret),
    signedUrl: data.signedUrl,
  }
}

export function verifyChapterPhotoPath(
  path: string,
  signature: string,
  lane: ChapterLane,
  secret: string,
) {
  const lanePattern = new RegExp(
    `^${lane}/[A-Za-z0-9_-]+/[0-9a-f-]{36}\\.jpg$`,
  )
  if (!lanePattern.test(path) || !/^[0-9a-f]{64}$/.test(signature)) {
    return false
  }

  const expected = Buffer.from(signChapterPhotoPath(path, secret), 'hex')
  const supplied = Buffer.from(signature, 'hex')
  return timingSafeEqual(expected, supplied)
}

export async function uploadChapterPhoto(
  file: File,
  lane: ChapterLane,
  artifactId: string,
) {
  const extension = extensionByType[file.type]

  if (!extension) {
    throw new Error('Unsupported chapter photo type.')
  }

  const safeArtifactId = artifactId.replace(/[^A-Za-z0-9_-]/g, '-')
  const path = `${lane}/${safeArtifactId}/${randomUUID()}.${extension}`
  const bytes = new Uint8Array(await file.arrayBuffer())
  const { error } = await getSupabaseAdminClient()
    .storage
    .from(CHAPTER_PHOTO_BUCKET)
    .upload(path, bytes, {
      cacheControl: '31536000',
      contentType: file.type,
      upsert: false,
    })

  if (error) {
    console.error('Supabase chapter photo upload failed', error)
    throw new Error('Unable to upload chapter photo.', { cause: error })
  }

  return path
}

export async function removeChapterPhoto(path: string) {
  const { error } = await getSupabaseAdminClient()
    .storage
    .from(CHAPTER_PHOTO_BUCKET)
    .remove([path])

  if (error) {
    console.error('Supabase chapter photo cleanup failed', error)
    throw new Error('Unable to remove chapter photo.', { cause: error })
  }
}

export function getChapterPhotoUrl(path: string) {
  return getSupabaseReadClient()
    .storage
    .from(CHAPTER_PHOTO_BUCKET)
    .getPublicUrl(path).data.publicUrl
}
