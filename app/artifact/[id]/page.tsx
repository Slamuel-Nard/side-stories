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
        <h1>Artifact not found</h1>
      </main>
    )
  }

  return (
    <main className="min-h-screen text-white p-6 bg-gradient-to-b from-yellow-950 via-black to-black">
      <div className="max-w-2xl mx-auto border-2 border-yellow-600 rounded-3xl p-8 bg-zinc-950 shadow-2xl">
        <p className="text-yellow-400 mb-2 tracking-widest">
  LEGENDARY ARTIFACT
</p>

<h1 className="text-5xl font-bold text-yellow-400 tracking-wide">
  {artifact.name}
</h1>

<p className="text-yellow-600 uppercase tracking-wide mt-2 text-sm">
  Founding Relic
</p>

<div className="flex flex-wrap gap-3 mb-6 text-sm">
  <div className="bg-zinc-950 border border-yellow-700/40 p-6 rounded-2xl shadow-[0_0_30px_rgba(234,179,8,0.08)]">
    Artifact ID: {artifact.id}
  </div>

  <div className="bg-zinc-950 border border-yellow-700/40 p-6 rounded-2xl shadow-[0_0_30px_rgba(234,179,8,0.08)]">
    Chapters Recorded: {stories?.length || 0}
 </div>

 <div className="bg-yellow-500 text-black font-bold rounded-full w-24 h-24 flex items-center justify-center">
  Active
</div>
</div>

<p className="text-zinc-300 mb-8">
  If this artifact has reached you, its story is now partially yours.
</p>

        <div className="bg-zinc-900 p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-3">
          <div className="flex gap-3 flex-wrap mt-4">
  <div className="bg-zinc-900 border border-zinc-800 rounded-full px-4 py-2">
    Chapters: {chapterCount}
  </div>

  <div className="bg-zinc-900 border border-zinc-800 rounded-full px-4 py-2">
    Holders: {chapterCount}
  </div>

  <div className="bg-zinc-900 border border-zinc-800 rounded-full px-4 py-2">
    Locations: {uniqueLocations}
  </div>
</div>
            Quest
          </h2>

          <p>{artifact.quest}</p>
          <div className="mt-8">
  <h2 className="text-xl font-semibold mb-4">
    Traveler History
  </h2>

  {stories?.length === 0 ? (
    <p className="text-zinc-400">
      No chapters have been recorded yet.
    </p>
  ) : (
    <div className="space-y-4">
      {stories?.map((story, index) => (
        <div
          key={story.id}
          className="bg-zinc-950 border border-zinc-800 p-5 rounded-2xl"
        >
          <p className="text-yellow-400 mb-2">
            Chapter {index + 1}
          </p>

          <p className="font-semibold">
  {story.traveler_name || 'Anonymous Traveler'}
</p>

<p className="text-sm text-zinc-400">
  {story.event}
</p>

<p className="text-xs text-zinc-500 mb-2">
  {new Date(story.created_at).toLocaleDateString()}
</p>

          <p>{story.story}</p>
        </div>
      ))}
    </div>
  )}
</div>
          <a
  href={`/log/${artifact.id}`}
  className="inline-block mt-6 px-6 py-3 bg-yellow-500 text-black font-bold rounded-lg"
>
  Add Your Chapter
</a>
        </div>
      </div>
    </main>
  )
}