import 'server-only'

import { randomUUID } from 'node:crypto'

import { getSupabaseAdminClient, getSupabaseReadClient } from '@/lib/supabase/server'

const CHAPTER_PHOTO_BUCKET = 'chapter-photos'

const extensionByType: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

export type ChapterLane = 'alpha' | 'standard'

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
