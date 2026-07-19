import Image from 'next/image'
import Link from 'next/link'
import { connection } from 'next/server'

import {
  getArtifactImageLayout,
  getArtifactImageUrl,
  getQrMaskStyle,
} from '@/lib/artifact-display'
import { getAlphaHomeData } from '@/lib/data'
import { countUniqueLocations } from '@/lib/location'

export default async function AlphaPage() {
  await connection()
  const { artifacts, stories } = await getAlphaHomeData()
  const travelerCount = new Set(
    stories.map((story) => story.traveler_name).filter(Boolean),
  ).size
  const locationCount = countUniqueLocations(
    stories.map((story) => story.event),
  )
  const chapterCounts = new Map<string, number>()

  for (const story of stories) {
    chapterCounts.set(
      story.artifact_id,
      (chapterCounts.get(story.artifact_id) ?? 0) + 1,
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-yellow-950 via-black to-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <section className="mb-14 text-center">
          <p className="mb-6 text-sm uppercase tracking-[0.45em] text-yellow-400">
            Discover Side Stories
          </p>
          <h1 className="mb-6 font-serif text-5xl font-bold text-yellow-400 drop-shadow-[0_0_24px_rgba(250,204,21,0.35)] md:text-7xl">
            Festival Alpha Test
          </h1>
          <p className="mx-auto max-w-3xl text-xl leading-relaxed text-zinc-300">
            Choose a relic to explore its quest, read every chapter, and follow
            the story it has gathered across the festival.
          </p>
        </section>

        <section className="mb-12 rounded-3xl border border-yellow-700/40 bg-black/40 p-6 shadow-[0_0_35px_rgba(250,204,21,0.10)] md:p-8">
          <p className="mb-3 text-sm uppercase tracking-[0.35em] text-yellow-400">
            Alpha Notice
          </p>
          <p className="text-lg leading-relaxed text-zinc-300">
            These PVC-card chapters are part of the festival alpha test. They
            are public, but they live separately from the official artifact
            archive while the game is being tested.
          </p>
        </section>

        <section
          aria-label="Alpha archive totals"
          className="mb-16 grid grid-cols-2 gap-4 md:grid-cols-4"
        >
          {[
            [artifacts.length, 'Alpha Relics'],
            [stories.length, 'Chapters Recorded'],
            [travelerCount, 'Travelers'],
            [locationCount, 'Places Visited'],
          ].map(([value, label]) => (
            <div
              key={label}
              className="rounded-2xl border border-yellow-700/40 bg-black/40 p-5 text-center md:p-6"
            >
              <p className="font-serif text-4xl text-yellow-400">{value}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.16em] text-zinc-400 md:tracking-[0.2em]">
                {label}
              </p>
            </div>
          ))}
        </section>

        <section className="mb-10 text-center">
          <p className="mb-4 text-sm uppercase tracking-[0.45em] text-yellow-400">
            Festival Artifacts
          </p>
          <h2 className="font-serif text-4xl text-yellow-400 md:text-5xl">
            Choose a Story to Explore
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-zinc-400">
            Tap any card to see its full journey. If you are holding it, you can
            add your chapter from inside the story.
          </p>
        </section>

        {artifacts.length === 0 ? (
          <p className="text-center text-zinc-400">
            The alpha cards are not available right now.
          </p>
        ) : (
          <div className="grid gap-5 md:grid-cols-3">
            {artifacts.map((artifact) => {
              const imageLayout = getArtifactImageLayout(artifact.id)

              return (
                <Link
                  key={artifact.id}
                  href={`/alpha/archive/${artifact.id}`}
                  className="group flex h-full flex-col rounded-2xl border border-yellow-700/30 bg-black/50 p-5 text-left transition hover:border-yellow-400 hover:shadow-[0_0_30px_rgba(250,204,21,0.16)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-yellow-400"
                >
                  <div
                    className="relative mb-5 w-full overflow-hidden rounded-xl border border-yellow-700/40 bg-black"
                    style={{
                      aspectRatio: `${imageLayout.width} / ${imageLayout.height}`,
                    }}
                  >
                    {artifact.image_url ? (
                      <>
                        <Image
                          src={getArtifactImageUrl(artifact.image_url)}
                          alt={artifact.name}
                          fill
                          sizes="(min-width: 768px) 30vw, 90vw"
                          className="object-contain"
                        />
                        <div
                          aria-hidden="true"
                          style={getQrMaskStyle(artifact.id)}
                          className="absolute z-10 aspect-square rounded-sm bg-black shadow-[0_0_6px_rgba(0,0,0,0.95)]"
                        />
                      </>
                    ) : (
                      <div className="flex h-full items-center justify-center text-5xl text-yellow-400">
                        ✦
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col">
                    <p className="mb-2 text-xs uppercase tracking-[0.25em] text-yellow-600">
                      {artifact.relic_title}
                    </p>
                    <h3 className="mb-2 font-serif text-3xl text-white transition group-hover:text-yellow-400">
                      {artifact.name}
                    </h3>
                    <p className="mb-4 text-yellow-400">{artifact.id}</p>
                    <p className="mb-6 line-clamp-3 leading-relaxed text-zinc-400">
                      {artifact.quest}
                    </p>
                    <div className="mt-auto flex items-center justify-between border-t border-yellow-700/30 pt-4">
                      <span className="text-sm uppercase tracking-[0.18em] text-zinc-400">
                        {chapterCounts.get(artifact.id) ?? 0}{' '}
                        {(chapterCounts.get(artifact.id) ?? 0) === 1
                          ? 'Chapter'
                          : 'Chapters'}
                      </span>
                      <span className="font-semibold text-yellow-400 transition group-hover:translate-x-1">
                        View Story →
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
