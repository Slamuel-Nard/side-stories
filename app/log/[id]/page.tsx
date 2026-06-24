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
  <div className="max-w-3xl mx-auto rounded-3xl border-2 border-yellow-600 p-8 bg-zinc-950 shadow-2xl">
    <p className="text-yellow-400 uppercase tracking-[0.35em] text-sm mb-4">
      Add Your Chapter
    </p>

    <h1 className="text-6xl font-serif font-bold text-white mb-8">
      {id}
    </h1>

    <form action={submitChapter} className="space-y-6">
  <input
    name="event"
    className="w-full rounded-xl border border-yellow-700/40 bg-black/50 p-4 text-white placeholder:text-zinc-500 focus:outline-none focus:border-yellow-400"
    placeholder="Event, like Elements 2026"
  />

  <input
    name="traveler_name"
    className="w-full rounded-xl border border-yellow-700/40 bg-black/50 p-4 text-white placeholder:text-zinc-500 focus:outline-none focus:border-yellow-400"
    placeholder="Your name, optional"
  />

  <input
    name="instagram"
    className="w-full rounded-xl border border-yellow-700/40 bg-black/50 p-4 text-white placeholder:text-zinc-500 focus:outline-none focus:border-yellow-400"
    placeholder="Instagram handle, optional"
  />

  <textarea
    name="story"
    className="min-h-48 w-full rounded-xl border border-yellow-700/40 bg-black/50 p-4 text-white placeholder:text-zinc-500 focus:outline-none focus:border-yellow-400"
    placeholder="What happened? Add your chapter."
  />

  <input
    name="next_destination"
    className="w-full rounded-xl border border-yellow-700/40 bg-black/50 p-4 text-white placeholder:text-zinc-500 focus:outline-none focus:border-yellow-400"
    placeholder="Next destination, optional"
  />

  <textarea
    name="message_to_future_holders"
    className="min-h-32 w-full rounded-xl border border-yellow-700/40 bg-black/50 p-4 text-white placeholder:text-zinc-500 focus:outline-none focus:border-yellow-400"
    placeholder="Message to future holders, optional"
  />

  <button
    type="submit"
    className="w-full rounded-xl bg-yellow-500 py-4 text-black font-bold text-xl shadow-[0_0_25px_rgba(250,204,21,0.25)] hover:bg-yellow-400 transition"
  >
    Submit Chapter
  </button>
</form>
  </div>
</main>
  )
}