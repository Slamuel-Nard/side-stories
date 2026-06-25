import { supabase } from '@/lib/supabase'

export default async function ArtifactPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const { data: artifact } = await supabase
    .from('artifacts')
    .select('*')
    .eq('id', id)
    .single()
const { data: stories } = await supabase
  .from('stories')
  .select('*')
  .eq('artifact_id', id)
  .order('created_at', { ascending: true })
 const chapterCount = stories?.length || 0

const uniqueLocations = new Set(
  stories
    ?.map((story) => story.event)
    .filter(Boolean)
).size
  if (!artifact) {
  return (
  <main className="min-h-screen text-white p-6 bg-gradient-to-b from-yellow-950 via-black to-black">
    <a
      href="/"
      className="fixed left-6 top-6 z-[9999] rounded-full border border-yellow-500 bg-black px-4 py-2 text-sm font-bold text-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.25)] hover:bg-yellow-500 hover:text-black transition">
      ← Home
    </a>
    <div className="max-w-2xl mx-auto border-2 border-yellow-600 rounded-3xl p-8 bg-zinc-950 shadow-2xl">
        <h1>Artifact not found</h1>
         </div>
      </main>
    )
  }

   return (
  <main className="min-h-screen text-white p-6 bg-gradient-to-b from-yellow-950 via-black to-black">
     
    <div className="max-w-2xl mx-auto mb-6">
      <a
        href="/"
        className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.25em] text-yellow-500 transition hover:text-yellow-300"
      >
        ✦ Archive
      </a>

      <span className="mx-3 text-yellow-700">/</span>

      <span className="text-zinc-400 uppercase tracking-[0.25em]">
        {artifact.name}
      </span>
    </div>

    <div className="max-w-2xl mx-auto border-2 border-yellow-600 rounded-3xl p-8 bg-zinc-950 shadow-2xl">
  <div className="text-center mb-10">
  <div className="flex items-center justify-center gap-4 text-yellow-500 uppercase tracking-[0.35em] text-sm mb-4">
    <span className="h-px w-24 bg-yellow-700/50" />
    Legendary Artifact
    <span className="h-px w-24 bg-yellow-700/50" />
  </div>

  <h1 className="text-6xl md:text-7xl font-serif font-bold text-yellow-400 drop-shadow-[0_0_18px_rgba(250,204,21,0.35)]">
    {artifact.name}
  </h1>

  <div className="flex items-center justify-center gap-4 mt-4 text-yellow-600 uppercase tracking-[0.35em] text-sm">
    <span className="h-px w-20 bg-yellow-800/60" />
    Founding Relic
    <span className="h-px w-20 bg-yellow-800/60" />
  </div>
</div>

{artifact.image_url && (
  <div className="relative mx-auto mb-10 max-w-2xl">
    <div className="absolute inset-0 rounded-[2rem] bg-yellow-500/20 blur-3xl" />
    <img
      src={artifact.image_url}
      alt={artifact.name}
      className="relative w-full rounded-2xl border border-yellow-700/60 shadow-[0_0_45px_rgba(250,204,21,0.28)]"
    />
  </div>
)}

<div className="mb-10 mx-auto max-w-4xl rounded-2xl border border-yellow-700/40 bg-black/40 shadow-[0_0_35px_rgba(250,204,21,0.12)] overflow-hidden">
  <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-yellow-700/30">
    <div className="p-6 text-center">
      <p className="text-xs uppercase tracking-[0.25em] text-yellow-700 mb-2">
        Artifact ID
      </p>
      <p className="text-2xl font-serif text-white">{artifact.id}</p>
    </div>

    <div className="p-6 text-center">
      <p className="text-xs uppercase tracking-[0.25em] text-yellow-700 mb-2">
        Chapters Recorded
      </p>
      <p className="text-2xl font-serif text-white">{stories?.length || 0}</p>
    </div>

    <div className="p-6 text-center">
      <p className="text-xs uppercase tracking-[0.25em] text-yellow-700 mb-2">
        Status
      </p>
      <p className="text-2xl font-serif text-yellow-400">Active</p>
    </div>
  </div>
</div>

<p className="max-w-4xl mx-auto text-zinc-300 mb-8 text-lg">
  <span className="text-yellow-400 mr-3">✦</span>
  If this artifact has reached you, its story is now partially yours.
</p>
<section className="max-w-4xl mx-auto mb-8 rounded-2xl border border-yellow-700/40 bg-black/40 p-8 shadow-[0_0_35px_rgba(250,204,21,0.10)]">
  <p className="text-yellow-400 uppercase tracking-[0.3em] text-sm mb-4">
    Artifact Journey
  </p>

  <h2 className="font-serif text-3xl text-white mb-6">
    Path of the Relic
  </h2>

  {stories?.length === 0 ? (
    <p className="text-zinc-400">This relic has not begun its journey yet.</p>
  ) : (
    <div className="space-y-5">
      {stories?.map((story, index) => (
        <div key={story.id} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="h-8 w-8 rounded-full border border-yellow-500 bg-black text-yellow-400 flex items-center justify-center text-sm">
              ✦
            </div>

            {index !== stories.length - 1 && (
              <div className="w-px flex-1 bg-yellow-700/40 mt-2" />
            )}
          </div>

          <div className="pb-6">
            <p className="text-yellow-400 uppercase tracking-[0.25em] text-xs mb-1">
              Chapter {index + 1}
            </p>

            <p className="font-serif text-2xl text-white">
              {story.event || 'Unknown Location'}
            </p>

            <p className="text-zinc-500 text-sm mt-1">
              {new Date(story.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  )}
</section>

<section className="max-w-4xl mx-auto mb-8 rounded-2xl border border-yellow-700/40 bg-black/40 overflow-hidden shadow-[0_0_35px_rgba(250,204,21,0.10)]">
  <div className="grid grid-cols-1 md:grid-cols-[220px_1fr]">
    <div className="hidden md:flex items-center justify-center border-r border-yellow-700/30 p-8">
      <div className="w-28 h-28 rounded-full border border-yellow-500/60 flex items-center justify-center text-5xl text-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.25)]">
        ✦
      </div>
    </div>

    <div className="p-8">
      <h2 className="font-serif text-3xl text-yellow-400 uppercase tracking-[0.25em] mb-4">
        Quest
      </h2>

      <div className="h-px w-32 bg-yellow-700/60 mb-6" />

      <p className="text-zinc-300 text-xl leading-relaxed">
        {artifact.quest}
      </p>
    </div>
  </div>
</section>

<section className="max-w-4xl mx-auto rounded-2xl border border-yellow-700/40 bg-black/40 p-8 shadow-[0_0_35px_rgba(250,204,21,0.10)]">
  <p className="text-yellow-400 uppercase tracking-[0.35em] text-sm mb-4">
    Journey Summary
  </p>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
    <div className="rounded-2xl border border-yellow-700/30 bg-black/40 p-5 text-center">
      <p className="font-serif text-4xl text-yellow-400">
        {stories?.length || 0}
      </p>
      <p className="text-zinc-500 uppercase tracking-[0.2em] text-xs mt-2">
        Chapters
      </p>
    </div>

    <div className="rounded-2xl border border-yellow-700/30 bg-black/40 p-5 text-center">
      <p className="font-serif text-4xl text-yellow-400">
        {
          new Set(
            stories
              ?.map((story) => story.traveler_name)
              .filter(Boolean)
          ).size || 0
        }
      </p>
      <p className="text-zinc-500 uppercase tracking-[0.2em] text-xs mt-2">
        Travelers
      </p>
    </div>

    <div className="rounded-2xl border border-yellow-700/30 bg-black/40 p-5 text-center">
      <p className="font-serif text-4xl text-yellow-400">
        {
          new Set(
            stories
              ?.map((story) => story.event)
              .filter(Boolean)
          ).size || 0
        }
      </p>
      <p className="text-zinc-500 uppercase tracking-[0.2em] text-xs mt-2">
        Places
      </p>
    </div>
  </div>

  <div className="mb-10 rounded-2xl border border-yellow-700/30 bg-zinc-950/80 p-6">
    <p className="text-yellow-400 uppercase tracking-[0.3em] text-sm mb-4">
      Current Path
    </p>

    {stories?.length === 0 ? (
      <p className="text-zinc-400">
        This relic has not begun its journey yet.
      </p>
    ) : (
      <p className="text-zinc-300 text-lg leading-relaxed">
        Origin
        {stories?.map((story) => (
          <span key={story.id}>
            {' '}
            <span className="text-yellow-500">→</span>{' '}
            {story.event || 'Unknown'}
          </span>
        ))}
      </p>
    )}
  </div>

  <h2 className="font-serif text-4xl text-yellow-400 uppercase tracking-[0.25em] mb-3">
    The Chronicle
  </h2>

  <div className="h-px w-72 bg-yellow-700/60 mb-8" />

  {stories?.length === 0 ? (
    <p className="text-zinc-400">No chapters have been recorded yet.</p>
  ) : (
    <div className="space-y-8">
      {stories?.map((story, index) => (
        <article
          key={story.id}
          className="relative overflow-hidden rounded-2xl border border-yellow-700/40 bg-zinc-950/80 p-8 shadow-inner"
        >
          <div className="absolute right-8 top-8 text-yellow-900/20 text-8xl">
            ✦
          </div>

          <p className="text-yellow-400 uppercase tracking-[0.3em] text-sm mb-4">
            Chapter {index + 1}
          </p>

          <h3 className="font-serif text-3xl md:text-4xl text-white mb-3">
            {story.traveler_name || 'Anonymous Traveler'}
          </h3>

          <p className="text-zinc-500 mb-6">
            {story.event || 'Unknown Location'} <span className="mx-2">•</span>
            {new Date(story.created_at).toLocaleDateString()}
          </p>

          <p className="text-zinc-300 text-lg leading-relaxed">
            {story.story}
          </p>

          {story.next_destination && (
            <div className="mt-6 border-t border-yellow-700/20 pt-4">
              <p className="text-xs uppercase tracking-[0.25em] text-yellow-500 mb-2">
                Hoped Next Destination
              </p>
              <p className="text-zinc-300">{story.next_destination}</p>
            </div>
          )}

          {story.message_to_future_holders && (
            <div className="mt-6 border-t border-yellow-700/20 pt-4">
              <p className="text-xs uppercase tracking-[0.25em] text-yellow-500 mb-2">
                Message to Future Holders
              </p>
              <p className="italic text-zinc-300">
                “{story.message_to_future_holders}”
              </p>
            </div>
          )}
        </article>
      ))}
    </div>
  )}

  <a
    href={`/log/${artifact.id}`}
    className="group mt-8 flex items-center justify-between rounded-xl border border-yellow-600/70 bg-yellow-500 px-6 py-4 text-black font-bold text-xl tracking-wide shadow-[0_0_25px_rgba(250,204,21,0.25)] hover:bg-yellow-400 transition"
  >
    <span>Seal Your Chapter</span>
    <span className="text-2xl group-hover:translate-x-1 transition">✦</span>
  </a>
</section>
</div>
    </main>
  )
}