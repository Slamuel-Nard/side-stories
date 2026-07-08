import { notFound } from 'next/navigation'
import { connection } from 'next/server'

import { ArtifactRecord } from '@/app/ui/artifact-record'
import { getAlphaArtifact, getAlphaArtifactStories } from '@/lib/data'

export default async function AlphaArchivePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await connection()
  const { id } = await params
  const [artifact, stories] = await Promise.all([
    getAlphaArtifact(id),
    getAlphaArtifactStories(id),
  ])

  if (!artifact) notFound()

  return (
    <ArtifactRecord
      actionHref={`/alpha/log/${artifact.id}`}
      actionLabel="Seal Another Alpha Chapter"
      artifact={artifact}
      backHref="/alpha"
      backLabel="✦ Alpha Test"
      chronicleTitle="The Alpha Chronicle"
      emptyText="No alpha chapters have been recorded yet."
      journeyLabel="Alpha Journey"
      keeperAccess
      qrMasked
      status="Festival Alpha"
      stories={stories}
      subtitle="Festival Alpha Test"
      summaryTitle="Alpha Summary"
    />
  )
}
