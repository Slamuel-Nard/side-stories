import { notFound } from 'next/navigation'
import { connection } from 'next/server'

import { ArtifactRecord } from '@/app/ui/artifact-record'
import { getArtifact, getArtifactStories } from '@/lib/data'

export default async function ArchiveArtifactPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await connection()
  const { id } = await params
  const [artifact, stories] = await Promise.all([
    getArtifact(id),
    getArtifactStories(id),
  ])

  if (!artifact) notFound()

  return (
    <ArtifactRecord
      artifact={artifact}
      stories={stories}
      keeperAccess={false}
    />
  )
}
