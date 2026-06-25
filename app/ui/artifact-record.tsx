import Image from 'next/image'
import Link from 'next/link'

import type { Database } from '@/lib/supabase/database.types'

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeZone: 'UTC',
})

type Artifact = Pick<
  Database['public']['Tables']['artifacts']['Row'],
  'display_order' | 'id' | 'image_url' | 'name' | 'quest' | 'relic_title'
>
type Story = Database['public']['Tables']['stories']['Row']

export function ArtifactRecord({
  artifact,
  stories,
  keeperAccess,
}: {
  artifact: Artifact
  stories: Story[]
  keeperAccess: boolean
}) {
  const travelerCount = new Set(
    stories.map((story) => story.traveler_name).filter(Boolean),
  ).size
  const locationCount = new Set(
    stories.map((story) => story.event).filter(Boolean),
  ).size

  return (
    <main className="min-h-screen bg-gradient-to-b from-yellow-950 via-black to-black p-6 text-white">
      <nav className="mx-auto mb-6 max-w-4xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.25em] text-yellow-500 transition hover:text-yellow-300"
        >
          ✦ Archive
        </Link>
        <span className="mx-3 text-yellow-700">/</span>
        <span className="text-sm uppercase tracking-[0.25em] text-zinc-400">
          {artifact.name}
        </span>
      </nav>

      <div className="mx-auto max-w-4xl rounded-3xl border-2 border-yellow-600 bg-zinc-950 p-6 shadow-2xl md:p-8">
        <header className="mb-10 text-center">
          <div className="mb-4 flex items-center justify-center gap-4 text-sm uppercase tracking-[0.35em] text-yellow-500">
            <span className="h-px w-24 bg-yellow-700/50" />
            Legendary Artifact
            <span className="h-px w-24 bg-yellow-700/50" />
          </div>
          <h1 className="font-serif text-5xl font-bold text-yellow-400 drop-shadow-[0_0_18px_rgba(250,204,21,0.35)] md:text-7xl">
            {artifact.name}
          </h1>
          <div className="mt-4 flex items-center justify-center gap-4 text-sm uppercase tracking-[0.35em] text-yellow-600">
            <span className="h-px w-20 bg-yellow-800/60" />
            {artifact.relic_title}
            <span className="h-px w-20 bg-yellow-800/60" />
          </div>
        </header>

        {artifact.image_url ? (
          <div className="relative mx-auto mb-10 aspect-[1050/600] max-w-2xl">
            <div className="absolute inset-0 rounded-[2rem] bg-yellow-500/20 blur-3xl" />
            <Image
              src={artifact.image_url}
              alt={artifact.name}
              fill
              priority
              sizes="(min-width: 768px) 768px, 90vw"
              className="rounded-2xl border border-yellow-700/60 object-contain shadow-[0_0_45px_rgba(250,204,21,0.28)]"
            />
          </div>
        ) : null}

        <section className="mx-auto mb-10 overflow-hidden rounded-2xl border border-yellow-700/40 bg-black/40 shadow-[0_0_35px_rgba(250,204,21,0.12)]">
          <div className="grid grid-cols-1 divide-y divide-yellow-700/30 md:grid-cols-3 md:divide-x md:divide-y-0">
            {[
              ['Artifact ID', artifact.id],
              ['Chapters Recorded', stories.length],
              ['Status', 'Active'],
            ].map(([label, value]) => (
              <div key={label} className="p-6 text-center">
                <p className="mb-2 text-xs uppercase tracking-[0.25em] text-yellow-700">
                  {label}
                </p>
                <p className="font-serif text-2xl text-white">{value}</p>
              </div>
            ))}
          </div>
        </section>

        {keeperAccess ? (
          <p className="mx-auto mb-8 text-lg text-zinc-300">
            <span className="mr-3 text-yellow-400">✦</span>
            If this artifact has reached you, its story is now partially yours.
          </p>
        ) : (
          <div className="mx-auto mb-8 rounded-2xl border border-yellow-700/40 bg-black/40 p-6">
            <p className="mb-2 text-sm uppercase tracking-[0.3em] text-yellow-400">
              Keeper Access
            </p>
            <p className="text-lg leading-relaxed text-zinc-300">
              Only the current keeper of this artifact may continue its story.
              Scan the QR code printed on the physical card to add the next
              chapter.
            </p>
          </div>
        )}

        <section className="mb-8 rounded-2xl border border-yellow-700/40 bg-black/40 p-8 shadow-[0_0_35px_rgba(250,204,21,0.10)]">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-yellow-400">
            Artifact Journey
          </p>
          <h2 className="mb-6 font-serif text-3xl text-white">
            Path of the Relic
          </h2>

          {stories.length === 0 ? (
            <p className="text-zinc-400">
              This relic has not begun its journey yet.
            </p>
          ) : (
            <div className="space-y-5">
              {stories.map((story, index) => (
                <div key={story.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-yellow-500 bg-black text-sm text-yellow-400">
                      ✦
                    </div>
                    {index !== stories.length - 1 ? (
                      <div className="mt-2 w-px flex-1 bg-yellow-700/40" />
                    ) : null}
                  </div>
                  <div className="pb-6">
                    <p className="mb-1 text-xs uppercase tracking-[0.25em] text-yellow-400">
                      Chapter {index + 1}
                    </p>
                    <p className="font-serif text-2xl text-white">
                      {story.event || 'Unknown Location'}
                    </p>
                    <p className="mt-1 text-sm text-zinc-500">
                      {dateFormatter.format(new Date(story.created_at))}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mb-8 overflow-hidden rounded-2xl border border-yellow-700/40 bg-black/40 shadow-[0_0_35px_rgba(250,204,21,0.10)]">
          <div className="grid grid-cols-1 md:grid-cols-[220px_1fr]">
            <div className="hidden items-center justify-center border-r border-yellow-700/30 p-8 md:flex">
              <div className="flex h-28 w-28 items-center justify-center rounded-full border border-yellow-500/60 text-5xl text-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.25)]">
                ✦
              </div>
            </div>
            <div className="p-8">
              <h2 className="mb-4 font-serif text-3xl uppercase tracking-[0.25em] text-yellow-400">
                Quest
              </h2>
              <div className="mb-6 h-px w-32 bg-yellow-700/60" />
              <p className="text-xl leading-relaxed text-zinc-300">
                {artifact.quest}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-yellow-700/40 bg-black/40 p-6 shadow-[0_0_35px_rgba(250,204,21,0.10)] md:p-8">
          <p className="mb-4 text-sm uppercase tracking-[0.35em] text-yellow-400">
            Journey Summary
          </p>
          <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              [stories.length, 'Chapters'],
              [travelerCount, 'Travelers'],
              [locationCount, 'Places'],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-2xl border border-yellow-700/30 bg-black/40 p-5 text-center"
              >
                <p className="font-serif text-4xl text-yellow-400">{value}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-zinc-500">
                  {label}
                </p>
              </div>
            ))}
          </div>

          <div className="mb-10 rounded-2xl border border-yellow-700/30 bg-zinc-950/80 p-6">
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-yellow-400">
              Current Path
            </p>
            {stories.length === 0 ? (
              <p className="text-zinc-400">
                This relic has not begun its journey yet.
              </p>
            ) : (
              <p className="text-lg leading-relaxed text-zinc-300">
                Origin
                {stories.map((story) => (
                  <span key={story.id}>
                    {' '}
                    <span className="text-yellow-500">→</span>{' '}
                    {story.event || 'Unknown'}
                  </span>
                ))}
              </p>
            )}
          </div>

          <h2 className="mb-3 font-serif text-4xl uppercase tracking-[0.2em] text-yellow-400">
            The Chronicle
          </h2>
          <div className="mb-8 h-px w-64 max-w-full bg-yellow-700/60" />

          {stories.length === 0 ? (
            <p className="text-zinc-400">
              No chapters have been recorded yet.
            </p>
          ) : (
            <div className="space-y-8">
              {stories.map((story, index) => (
                <article
                  key={story.id}
                  className="relative overflow-hidden rounded-2xl border border-yellow-700/40 bg-zinc-950/80 p-6 shadow-inner md:p-8"
                >
                  <div className="absolute right-8 top-8 text-8xl text-yellow-900/20">
                    ✦
                  </div>
                  <p className="mb-4 text-sm uppercase tracking-[0.3em] text-yellow-400">
                    Chapter {index + 1}
                  </p>
                  <h3 className="mb-3 font-serif text-3xl text-white md:text-4xl">
                    {story.traveler_name || 'Anonymous Traveler'}
                  </h3>
                  <p className="mb-6 text-zinc-500">
                    {story.event || 'Unknown Location'}{' '}
                    <span className="mx-2">•</span>
                    {dateFormatter.format(new Date(story.created_at))}
                  </p>
                  <p className="whitespace-pre-wrap text-lg leading-relaxed text-zinc-300">
                    {story.story}
                  </p>

                  {story.instagram_handle ? (
                    <div className="mt-6 border-t border-yellow-700/20 pt-4">
                      <p className="mb-2 text-xs uppercase tracking-[0.25em] text-yellow-500">
                        Find This Traveler
                      </p>
                      <a
                        href={`https://www.instagram.com/${story.instagram_handle}/`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-zinc-300 underline decoration-yellow-700 underline-offset-4 hover:text-yellow-400"
                      >
                        @{story.instagram_handle}
                      </a>
                    </div>
                  ) : null}

                  {story.next_destination ? (
                    <div className="mt-6 border-t border-yellow-700/20 pt-4">
                      <p className="mb-2 text-xs uppercase tracking-[0.25em] text-yellow-500">
                        Hoped Next Destination
                      </p>
                      <p className="text-zinc-300">
                        {story.next_destination}
                      </p>
                    </div>
                  ) : null}

                  {story.message_to_future_holders ? (
                    <div className="mt-6 border-t border-yellow-700/20 pt-4">
                      <p className="mb-2 text-xs uppercase tracking-[0.25em] text-yellow-500">
                        Message to Future Holders
                      </p>
                      <p className="whitespace-pre-wrap italic text-zinc-300">
                        “{story.message_to_future_holders}”
                      </p>
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          )}

          {keeperAccess ? (
            <Link
              href={`/log/${artifact.id}`}
              className="group mt-8 flex items-center justify-between rounded-xl border border-yellow-600/70 bg-yellow-500 px-6 py-4 text-xl font-bold tracking-wide text-black shadow-[0_0_25px_rgba(250,204,21,0.25)] transition hover:bg-yellow-400"
            >
              <span>Seal Your Chapter</span>
              <span className="text-2xl transition group-hover:translate-x-1">
                ✦
              </span>
            </Link>
          ) : null}
        </section>
      </div>
    </main>
  )
}
