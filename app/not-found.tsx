import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-yellow-950 via-black to-black p-6 text-white">
      <div className="max-w-xl rounded-3xl border border-yellow-700/50 bg-black/60 p-10 text-center shadow-2xl">
        <p className="mb-4 text-sm uppercase tracking-[0.35em] text-yellow-400">
          Uncharted relic
        </p>
        <h1 className="mb-5 font-serif text-5xl text-white">
          This artifact is not in the archive.
        </h1>
        <p className="mb-8 leading-relaxed text-zinc-400">
          Its identifier may be incorrect, or its journey may not have begun.
        </p>
        <Link
          href="/"
          className="inline-block rounded-xl bg-yellow-500 px-6 py-3 font-bold text-black hover:bg-yellow-400"
        >
          Explore the archive
        </Link>
      </div>
    </main>
  )
}
