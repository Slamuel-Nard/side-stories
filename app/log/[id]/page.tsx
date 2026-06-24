import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'

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

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <div className="max-w-xl mx-auto">
        <p className="text-yellow-400 mb-2">Add Your Chapter</p>
        <h1 className="text-4xl font-bold mb-6">{id}</h1>

        <form action={addStory} className="space-y-5">
          <input type="hidden" name="artifact_id" value={id} />

          <input
            name="event"
            placeholder="Event, like Elements 2026"
            className="w-full p-3 rounded-lg bg-zinc-900 border border-zinc-700"
          />

          <input
            name="traveler_name"
            placeholder="Your name, optional"
            className="w-full p-3 rounded-lg bg-zinc-900 border border-zinc-700"
          />

          <input
            name="instagram_handle"
            placeholder="Instagram handle, optional"
            className="w-full p-3 rounded-lg bg-zinc-900 border border-zinc-700"
          />

          <textarea
            name="story"
            required
            placeholder="What happened? Add your chapter."
            className="w-full p-3 rounded-lg bg-zinc-900 border border-zinc-700 min-h-40"
          />
<input
  name="next_destination"
  placeholder="Next destination, optional"
  className="w-full p-3 rounded-lg bg-zinc-900 border border-zinc-700"
/>

<textarea
  name="message_to_future_holders"
  placeholder="Message to future holders, optional"
  className="w-full p-3 rounded-lg bg-zinc-900 border border-zinc-700 min-h-28"
/>
          <button
            type="submit"
            className="w-full p-4 rounded-lg bg-yellow-500 text-black font-bold"
          >
            Submit Chapter
          </button>
        </form>
      </div>
    </main>
  )
}