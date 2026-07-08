import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { connection } from 'next/server'

import { createAlphaChapter } from '@/app/alpha/log/actions'
import { ChapterForm } from '@/app/log/[id]/chapter-form'
import { getArtifactImageUrl } from '@/lib/artifact-display'
import { getAlphaArtifact, getAlphaArtifactChapterCount } from '@/lib/data'

export default async function AlphaLogPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await connection()
  const { id } = await params
  const [artifact, chapterCount] = await Promise.all([
    getAlphaArtifact(id),
    getAlphaArtifactChapterCount(id),
  ])

  if (!artifact) notFound()

  return (
    <main className="min-h-screen bg-gradient-to-b from-yellow-950 via-black to-black p-6 text-white">
      <nav className="mx-auto mb-6 flex max-w-3xl items-center text-sm uppercase tracking-[0.25em]">
        <Link
          href="/alpha"
          className="text-yellow-500 transition hover:text-yellow-300"
        >
          ✦ Alpha Test
        </Link>
        <span className="mx-3 text-yellow-700">/</span>
        <Link
          href={`/alpha/archive/${id}`}
          className="text-yellow-500 transition hover:text-yellow-300"
        >
          Alpha Story
        </Link>
        <span className="mx-3 text-yellow-700">/</span>
        <span className="text-zinc-400">Add Chapter</span>
      </nav>

      <div className="mx-auto max-w-3xl rounded-3xl border-2 border-yellow-600 bg-zinc-950 p-6 shadow-2xl md:p-8">
        <header className="mb-10 text-center">
          <p className="mb-4 text-sm uppercase tracking-[0.35em] text-yellow-400">
            Recording Alpha Chapter {chapterCount + 1}
          </p>
          <h1 className="mb-4 font-serif text-5xl font-bold text-white md:text-6xl">
            {artifact.name}
          </h1>
          <p className="text-sm uppercase tracking-[0.3em] text-yellow-500">
            Festival Alpha · {id}
          </p>
        </header>

        {artifact.image_url ? (
          <div className="relative mx-auto mb-10 aspect-[1050/600] max-w-xl">
            <div className="absolute inset-0 rounded-[2rem] bg-yellow-500/20 blur-3xl" />
            <Image
              src={getArtifactImageUrl(artifact.image_url)}
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
            Alpha test chapter
          </p>
          <p className="text-lg leading-relaxed text-zinc-300">
            This is the festival test lane. Your chapter becomes public
            immediately, but it stays separate from the official artifact
            archive while Side Stories is being tested.
          </p>
        </section>

        <ChapterForm
          action={createAlphaChapter}
          artifactId={artifact.id}
          buttonLabel="✦ Seal Alpha Chapter"
          pendingLabel="Sealing Alpha Chapter…"
          notice={
            <>
              ✦ This alpha chapter becomes public immediately on the festival
              test archive. If you add an Instagram username, it will be public
              too.
            </>
          }
        />
      </div>
    </main>
  )
}
