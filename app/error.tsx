'use client'

import Link from 'next/link'
import { useEffect } from 'react'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-yellow-950 via-black to-black p-6 text-white">
      <div className="max-w-xl rounded-3xl border border-yellow-700/50 bg-black/60 p-10 text-center shadow-2xl">
        <p className="mb-4 text-sm uppercase tracking-[0.35em] text-yellow-400">
          The archive flickered
        </p>
        <h1 className="mb-5 font-serif text-4xl text-white">
          This chapter of the archive could not be opened.
        </h1>
        <p className="mb-8 leading-relaxed text-zinc-400">
          The records may be temporarily unavailable. This is different from an
          empty archive, and no story has been erased.
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="rounded-xl bg-yellow-500 px-6 py-3 font-bold text-black hover:bg-yellow-400"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-xl border border-yellow-600 px-6 py-3 font-semibold text-yellow-300 hover:bg-yellow-500/10"
          >
            Return home
          </Link>
        </div>
      </div>
    </main>
  )
}
