import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { connection } from 'next/server'

import { ChapterForm } from '@/app/log/[id]/chapter-form'
import { getArtifact, getArtifactChapterCount } from '@/lib/data'

export default async function LogPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await connection()
  const { id } = await params
  const [artifact, chapterCount] = await Promise.all([
    getArtifact(id),
    getArtifactChapterCount(id),
  ])

  if (!artifact) notFound()

  return (
    <main className="min-h-screen bg-gradient-to-b from-yellow-950 via-black to-black p-6 text-white">
      <nav className="mx-auto mb-6 flex max-w-3xl items-center text-sm uppercase tracking-[0.25em]">
        <Link
          href="/"
          className="text-yellow-500 transition hover:text-yellow-300"
        >
          ✦ Archive
        </Link>
        <span className="mx-3 text-yellow-700">/</span>
        <Link
          href={`/artifact/${id}`}
          className="text-yellow-500 transition hover:text-yellow-300"
        >
          Relic
        </Link>
        <span className="mx-3 text-yellow-700">/</span>
        <span className="text-zinc-400">Add Chapter</span>
      </nav>

      <div className="mx-auto max-w-3xl rounded-3xl border-2 border-yellow-600 bg-zinc-950 p-6 shadow-2xl md:p-8">
        <header className="mb-10 text-center">
          <p className="mb-4 text-sm uppercase tracking-[0.35em] text-yellow-400">
            Recording Chapter {chapterCount + 1}
          </p>
          <h1 className="mb-4 font-serif text-5xl font-bold text-white md:text-6xl">
            {artifact.name}
          </h1>
          <p className="text-sm uppercase tracking-[0.3em] text-yellow-500">
            {id}
          </p>
        </header>

        {artifact.image_url ? (
          <div className="relative mx-auto mb-10 aspect-[1050/600] max-w-xl">
            <div className="absolute inset-0 rounded-[2rem] bg-yellow-500/20 blur-3xl" />
            <Image
              src={artifact.image_url}
              alt={artifact.name}
              fill
              priority
              sizes="(min-width: 768px) 576px, 90vw"
              className="rounded-2xl border border-yellow-700/60 object-contain shadow-[0_0_35px_rgba(250,204,21,0.22)]"
            />
          </div>
        ) : null}

        <section className="mb-10 rounded-2xl border border-yellow-700/40 bg-black/40 p-6">
          <p className="mb-3 text-sm uppercase tracking-[0.25em] text-yellow-400">
            Every keeper leaves their mark.
          </p>
          <p className="text-lg leading-relaxed text-zinc-300">
            This artifact has crossed your path. Tell the next traveler what
            happened, where it traveled, and what they should know before
            continuing the journey.
          </p>
        </section>

        <ChapterForm artifactId={artifact.id} />
      </div>
    </main>
  )
}
