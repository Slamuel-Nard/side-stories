export default function AlphaLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black p-6 text-center text-white">
      <div>
        <div className="mx-auto mb-6 h-16 w-16 animate-pulse rounded-full border border-yellow-500 shadow-[0_0_35px_rgba(250,204,21,0.35)]" />
        <p className="text-sm uppercase tracking-[0.35em] text-yellow-400">
          Loading Alpha Test
        </p>
      </div>
    </main>
  )
}
