'use client'

import { useRouter } from 'next/navigation'

type DiscoverArtifactButtonProps = {
  artifactIds: string[]
}

export function DiscoverArtifactButton({
  artifactIds,
}: DiscoverArtifactButtonProps) {
  const router = useRouter()

  function discoverArtifact() {
    const artifactId =
      artifactIds[Math.floor(Math.random() * artifactIds.length)]

    if (artifactId) {
      router.push(`/archive/${artifactId}`)
    }
  }

  return (
    <button
      type="button"
      onClick={discoverArtifact}
      className="cursor-pointer rounded-xl bg-yellow-500 px-8 py-4 text-lg font-bold text-black shadow-[0_0_25px_rgba(250,204,21,0.25)] transition hover:bg-yellow-400"
    >
      Discover An Artifact
    </button>
  )
}
