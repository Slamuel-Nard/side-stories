export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-yellow-950 via-black to-black p-6 text-white">
      <div className="text-center" role="status" aria-live="polite">
        <div className="mx-auto mb-6 h-12 w-12 animate-pulse rounded-full border border-yellow-500 text-3xl text-yellow-400">
          ✦
        </div>
        <p className="text-sm uppercase tracking-[0.35em] text-yellow-400">
          Opening the archive
        </p>
      </div>
    </main>
  )
}
