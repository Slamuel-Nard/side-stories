import 'server-only'

import { ALPHA_ARTIFACT_IDS, isAlphaArtifactId } from '@/lib/alpha'
import { getSupabaseAdminClient, getSupabaseReadClient } from '@/lib/supabase/server'

const ARTIFACT_FIELDS =
  'id,name,quest,image_url,relic_title,display_order' as const
const STORY_FIELDS =
  'id,artifact_id,event,traveler_name,instagram_handle,story,next_destination,message_to_future_holders,created_at' as const
const STORY_SUMMARY_FIELDS =
  'id,artifact_id,event,traveler_name,created_at' as const

export class DataAccessError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options)
    this.name = 'DataAccessError'
  }
}

function fail(operation: string, error: unknown): never {
  console.error(`Supabase ${operation} failed`, error)
  throw new DataAccessError(`Unable to ${operation}.`, { cause: error })
}

export async function getArtifacts() {
  const { data, error } = await getSupabaseReadClient()
    .from('artifacts')
    .select(ARTIFACT_FIELDS)
    .order('display_order', { ascending: true })

  if (error) fail('load artifacts', error)
  return data
}

export async function getArtifact(id: string) {
  const { data, error } = await getSupabaseReadClient()
    .from('artifacts')
    .select(ARTIFACT_FIELDS)
    .eq('id', id)
    .maybeSingle()

  if (error) fail('load artifact', error)
  return data
}

export async function getAlphaArtifacts() {
  const { data, error } = await getSupabaseReadClient()
    .from('artifacts')
    .select(ARTIFACT_FIELDS)
    .in('id', [...ALPHA_ARTIFACT_IDS])
    .order('display_order', { ascending: true })

  if (error) fail('load alpha artifacts', error)
  return data
}

export async function getAlphaArtifact(id: string) {
  if (!isAlphaArtifactId(id)) return null
  return getArtifact(id)
}

export async function getArtifactStories(artifactId: string) {
  const { data, error } = await getSupabaseReadClient()
    .from('stories')
    .select(STORY_FIELDS)
    .eq('artifact_id', artifactId)
    .order('created_at', { ascending: true })

  if (error) fail('load artifact chapters', error)
  return data
}

export async function getAlphaArtifactStories(artifactId: string) {
  const { data, error } = await getSupabaseReadClient()
    .from('alpha_stories')
    .select(STORY_FIELDS)
    .eq('artifact_id', artifactId)
    .order('created_at', { ascending: true })

  if (error) fail('load alpha chapters', error)
  return data
}

export async function getArtifactChapterCount(artifactId: string) {
  const { count, error } = await getSupabaseReadClient()
    .from('stories')
    .select('id', { count: 'exact', head: true })
    .eq('artifact_id', artifactId)

  if (error) fail('count artifact chapters', error)
  return count ?? 0
}

export async function getAlphaArtifactChapterCount(artifactId: string) {
  const { count, error } = await getSupabaseReadClient()
    .from('alpha_stories')
    .select('id', { count: 'exact', head: true })
    .eq('artifact_id', artifactId)

  if (error) fail('count alpha chapters', error)
  return count ?? 0
}

export async function getHomeData() {
  const [artifactsResult, storiesResult] = await Promise.all([
    getSupabaseReadClient()
      .from('artifacts')
      .select(ARTIFACT_FIELDS)
      .order('display_order', { ascending: true }),
    getSupabaseReadClient()
      .from('stories')
      .select(STORY_SUMMARY_FIELDS)
      .order('created_at', { ascending: false }),
  ])

  if (artifactsResult.error) fail('load artifacts', artifactsResult.error)
  if (storiesResult.error) fail('load chapter summaries', storiesResult.error)

  return {
    artifacts: artifactsResult.data,
    stories: storiesResult.data,
  }
}

export type StorySubmission = {
  artifactId: string
  event: string | null
  fingerprint: string
  instagramHandle: string | null
  messageToFutureHolders: string | null
  nextDestination: string | null
  story: string
  travelerName: string | null
}

export type StorySubmissionResult =
  | 'accepted'
  | 'artifact_not_found'
  | 'rate_limited'

export async function submitStory(
  submission: StorySubmission,
): Promise<StorySubmissionResult> {
  const { data, error } = await getSupabaseAdminClient().rpc('submit_story', {
    p_artifact_id: submission.artifactId,
    p_event: submission.event,
    p_fingerprint: submission.fingerprint,
    p_instagram_handle: submission.instagramHandle,
    p_message_to_future_holders: submission.messageToFutureHolders,
    p_next_destination: submission.nextDestination,
    p_story: submission.story,
    p_traveler_name: submission.travelerName,
  })

  if (error) fail('submit chapter', error)

  if (
    data !== 'accepted' &&
    data !== 'artifact_not_found' &&
    data !== 'rate_limited'
  ) {
    fail('submit chapter', new Error(`Unexpected submission result: ${data}`))
  }

  return data
}

export async function submitAlphaStory(
  submission: StorySubmission,
): Promise<StorySubmissionResult> {
  const supabase = getSupabaseAdminClient()
  const { data, error } = await supabase.rpc('submit_alpha_story', {
    p_artifact_id: submission.artifactId,
    p_event: submission.event,
    p_fingerprint: submission.fingerprint,
    p_instagram_handle: submission.instagramHandle,
    p_message_to_future_holders: submission.messageToFutureHolders,
    p_next_destination: submission.nextDestination,
    p_story: submission.story,
    p_traveler_name: submission.travelerName,
  })

  if (error) {
    console.error(
      'Supabase submit alpha chapter RPC failed; trying direct alpha insert',
      error,
    )

    const { error: insertError } = await supabase.from('alpha_stories').insert({
      artifact_id: submission.artifactId,
      event: submission.event,
      instagram_handle: submission.instagramHandle,
      message_to_future_holders: submission.messageToFutureHolders,
      next_destination: submission.nextDestination,
      story: submission.story,
      traveler_name: submission.travelerName,
    })

    if (insertError) fail('submit alpha chapter', insertError)
    return 'accepted'
  }

  if (
    data !== 'accepted' &&
    data !== 'artifact_not_found' &&
    data !== 'rate_limited'
  ) {
    fail(
      'submit alpha chapter',
      new Error(`Unexpected alpha submission result: ${data}`),
    )
  }

  return data
}
