import { supabase } from '@/lib/supabase'
import { redirect } from 'next/navigation'

async function addStory(formData: FormData) {
  'use server'

  const artifact_id = formData.get('artifact_id') as string
  const event = formData.get('event') as string
  const traveler_name = formData.get('traveler_name') as string
  const instagram_handle = formData.get('instagram_handle') as string
  const story = formData.get('story') as string
  const next_destination = formData.get('next_destination') as string
  const message_to_future_holders = formData.get('message_to_future_holders') as string

  const { error } = await supabase.from('stories').insert({
  artifact_id,
  event,
  traveler_name,
  instagram_handle,
  story,
  next_destination,
  message_to_future_holders,
})

  if (error) {
    throw new Error(error.message)
  }

  redirect(`/artifact/${artifact_id}`)
}

export default async function LogPage({
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

const { data: existingStories } = await supabase
  .from('stories')
  .select('*')
  .eq('artifact_id', id)

const nextChapterNumber = (existingStories?.length || 0) + 1
async function submitChapter(formData: FormData) {
  'use server'

  const event = formData.get('event') as string
  const traveler_name = formData.get('traveler_name') as string
  const instagram_handle = formData.get('instagram_handle') as string
  const story = formData.get('story') as string
  const next_destination = formData.get('next_destination') as string
  const message_to_future_holders = formData.get('message_to_future_holders') as string

  const { error } = await supabase.from('stories').insert({
  artifact_id: id,
  event,
  traveler_name,
  instagram_handle,
  story,
  next_destination,
  message_to_future_holders,
})

if (error) {
  console.error('SUPABASE INSERT ERROR:', error)
  throw new Error(error.message)
}

redirect(`/artifact/${id}`)

}
  return (
  <main className="min-h-screen text-white p-6 bg-gradient-to-b from-yellow-950 via-black to-black">
    <div className="max-w-3xl mx-auto mb-6 flex items-center text-sm uppercase tracking-[0.25em]">
      <a href="/" className="text-yellow-500 hover:text-yellow-300 transition">
        ✦ Archive
      </a>

      <span className="mx-3 text-yellow-700">/</span>

      <a
        href={`/artifact/${id}`}
        className="text-yellow-500 hover:text-yellow-300 transition"
      >
        Relic
      </a>

      <span className="mx-3 text-yellow-700">/</span>

      <span className="text-zinc-400">Add Chapter</span>
    </div>

    <div className="max-w-3xl mx-auto rounded-3xl border-2 border-yellow-600 p-8 bg-zinc-950 shadow-2xl">
      <div className="text-center mb-10">
        <p className="text-yellow-400 uppercase tracking-[0.35em] text-sm mb-4">
          Recording Chapter {nextChapterNumber}
        </p>

        <h1 className="font-serif text-5xl md:text-6xl font-bold text-white mb-4">
          {artifact?.name || id}
        </h1>

        <p className="text-yellow-500 uppercase tracking-[0.3em] text-sm">
          {id}
        </p>
      </div>

      {artifact?.image_url && (
        <div className="relative mx-auto mb-10 max-w-xl">
          <div className="absolute inset-0 rounded-[2rem] bg-yellow-500/20 blur-3xl" />
          <img
            src={artifact.image_url}
            alt={artifact.name}
            className="relative w-full rounded-2xl border border-yellow-700/60 shadow-[0_0_35px_rgba(250,204,21,0.22)]"
          />
        </div>
      )}

      <section className="mb-10 rounded-2xl border border-yellow-700/40 bg-black/40 p-6">
        <p className="text-yellow-400 uppercase tracking-[0.25em] text-sm mb-3">
          Every keeper leaves their mark.
        </p>

        <p className="text-zinc-300 leading-relaxed text-lg">
          This artifact has crossed your path. Tell the next traveler what happened,
          where it traveled, and what they should know before continuing the journey.
        </p>
      </section>

      <form action={submitChapter} className="space-y-6">
        <input
          name="event"
          className="w-full rounded-xl border border-yellow-700/40 bg-black/50 p-4 text-white placeholder:text-zinc-500 focus:outline-none focus:border-yellow-400"
          placeholder="Where did this chapter take place?"
        />

        <input
          name="traveler_name"
          className="w-full rounded-xl border border-yellow-700/40 bg-black/50 p-4 text-white placeholder:text-zinc-500 focus:outline-none focus:border-yellow-400"
          placeholder="What should future travelers call you?"
        />

        <input
          name="instagram_handle"
          className="w-full rounded-xl border border-yellow-700/40 bg-black/50 p-4 text-white placeholder:text-zinc-500 focus:outline-none focus:border-yellow-400"
          placeholder="Leave a way to be remembered, optional"
        />

        <div>
          <p className="text-yellow-400 uppercase tracking-[0.25em] text-xs mb-3">
            Tell the story
          </p>

          <textarea
            name="story"
            className="min-h-48 w-full rounded-xl border border-yellow-700/40 bg-black/50 p-4 text-white placeholder:text-zinc-500 focus:outline-none focus:border-yellow-400"
            placeholder="What happened? Who did you meet? How did this artifact find you?"
          />
        </div>

        <input
          name="next_destination"
          className="w-full rounded-xl border border-yellow-700/40 bg-black/50 p-4 text-white placeholder:text-zinc-500 focus:outline-none focus:border-yellow-400"
          placeholder="Where do you hope this artifact travels next?"
        />

        <textarea
          name="message_to_future_holders"
          className="min-h-32 w-full rounded-xl border border-yellow-700/40 bg-black/50 p-4 text-white placeholder:text-zinc-500 focus:outline-none focus:border-yellow-400"
          placeholder="Leave a message for whoever finds this next..."
        />

        <div className="rounded-2xl border border-yellow-700/30 bg-black/40 p-5">
          <p className="text-zinc-400 leading-relaxed">
            ✦ This chapter becomes part of the artifact’s record. Future travelers
            may read your words long after tonight.
          </p>
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-yellow-500 py-5 text-black font-bold text-xl tracking-wide shadow-[0_0_25px_rgba(250,204,21,0.25)] hover:bg-yellow-400 transition"
        >
          ✦ Seal This Chapter
        </button>
      </form>
    </div>
  </main>
)
}