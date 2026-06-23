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
  if (!artifact) {
    return (
      <main className="min-h-screen bg-black text-white p-6">
        <h1>Artifact not found</h1>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <div className="max-w-xl mx-auto">
        <p className="text-yellow-400 mb-2 tracking-widest">
  LEGENDARY ARTIFACT
</p>

<h1 className="text-5xl font-bold mb-3">
  {artifact.name}
</h1>

<div className="flex flex-wrap gap-3 mb-6 text-sm">
  <span className="bg-zinc-900 border border-zinc-800 rounded-full px-4 py-2">
    Artifact ID: {artifact.id}
  </span>

  <span className="bg-zinc-900 border border-zinc-800 rounded-full px-4 py-2">
    Chapters Recorded: {stories?.length || 0}
  </span>

  <span className="bg-yellow-500 text-black font-bold rounded-full px-4 py-2">
    Active
  </span>
</div>

<p className="text-zinc-300 mb-8">
  If this artifact has reached you, its story is now partially yours.
</p>

        <div className="bg-zinc-900 p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-3">
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
          className="bg-zinc-800 p-4 rounded-lg"
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