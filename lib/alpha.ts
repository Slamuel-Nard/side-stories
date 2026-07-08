import type { Database } from '@/lib/supabase/database.types'

export const ALPHA_ARTIFACT_IDS = ['M-0001', 'A-0001', 'R-0001'] as const

export type AlphaArtifactId = (typeof ALPHA_ARTIFACT_IDS)[number]

export type AlphaArtifact = Pick<
  Database['public']['Tables']['artifacts']['Row'],
  'display_order' | 'id' | 'image_url' | 'name' | 'quest' | 'relic_title'
>

export function isAlphaArtifactId(id: string): id is AlphaArtifactId {
  return ALPHA_ARTIFACT_IDS.includes(id as AlphaArtifactId)
}
