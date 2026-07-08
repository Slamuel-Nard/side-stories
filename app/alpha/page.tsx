import Image from 'next/image'
import Link from 'next/link'
import { connection } from 'next/server'

import {
  getArtifactImageLayout,
  getArtifactImageUrl,
  getQrMaskStyle,
} from '@/lib/artifact-display'
import { getAlphaArtifacts } from '@/lib/data'

export default async function AlphaPage() {
  await connection()
  const artifacts = await getAlphaArtifacts()

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
            Which card are you holding? Choose your relic below, then add your
            chapter to the alpha-test story.
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

        {artifacts.length === 0 ? (
          <p className="text-center text-zinc-400">
            The alpha cards are not available right now.
          </p>
        ) : (
          <div className="grid gap-5 md:grid-cols-3">
            {artifacts.map((artifact) => {
              const imageLayout = getArtifactImageLayout(artifact.id)

              return (
                <article
                  key={artifact.id}
                  className="rounded-2xl border border-yellow-700/30 bg-black/50 p-5 transition hover:border-yellow-400 hover:shadow-[0_0_30px_rgba(250,204,21,0.16)]"
                >
                  <div className="mb-5 aspect-[5/3] overflow-hidden rounded-xl border border-yellow-700/40 bg-black">
                    {artifact.image_url ? (
                      <div className="flex h-full w-full items-center justify-center">
                        <div
                          className="relative"
                          style={{
                            aspectRatio: `${imageLayout.width} / ${imageLayout.height}`,
                            width: '100%',
                          }}
                        >
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
                        </div>
                      </div>
                    ) : (
                      <div className="flex h-full items-center justify-center text-5xl text-yellow-400">
                        ✦
                      </div>
                    )}
                  </div>

                  <p className="mb-2 text-xs uppercase tracking-[0.25em] text-yellow-600">
                    {artifact.relic_title}
                  </p>
                  <h2 className="mb-2 font-serif text-3xl text-white">
                    {artifact.name}
                  </h2>
                  <p className="mb-5 text-yellow-400">{artifact.id}</p>
                  <div className="grid gap-3">
                    <Link
                      href={`/alpha/log/${artifact.id}`}
                      className="rounded-xl bg-yellow-500 px-5 py-4 text-center font-bold tracking-wide text-black transition hover:bg-yellow-400"
                    >
                      I&apos;m Holding This Card
                    </Link>
                    <Link
                      href={`/alpha/archive/${artifact.id}`}
                      className="rounded-xl border border-yellow-700/50 px-5 py-3 text-center text-sm font-semibold uppercase tracking-[0.2em] text-yellow-400 transition hover:border-yellow-400"
                    >
                      Read Alpha Story
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
