import Image from 'next/image'
import Link from 'next/link'
import { connection } from 'next/server'

import { getHomeData } from '@/lib/data'

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeZone: 'UTC',
})

export default async function Home() {
  await connection()

  const { artifacts, stories } = await getHomeData()
  const chapterCount = stories.length
  const featuredArtifact =
    artifacts.length > 0 ? artifacts[chapterCount % artifacts.length] : null
  const travelerCount = new Set(
    stories.map((story) => story.traveler_name).filter(Boolean),
  ).size
  const locationCount = new Set(
    stories.map((story) => story.event).filter(Boolean),
  ).size
  const recentStories = stories.slice(0, 3)

  return (
    <main className="min-h-screen bg-gradient-to-b from-yellow-950 via-black to-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <section className="mb-24 text-center">
          <p className="mb-6 text-sm uppercase tracking-[0.45em] text-yellow-400">
            Discover Side Stories
          </p>

          <h1 className="mb-8 font-serif text-6xl font-bold text-yellow-400 drop-shadow-[0_0_24px_rgba(250,204,21,0.35)] md:text-8xl">
            Artifacts Travel.
            <br />
            Stories Remain.
          </h1>

          <p className="mx-auto mb-10 max-w-3xl text-xl leading-relaxed text-zinc-300 md:text-2xl">
            Receive an artifact. Complete its quest. Add your chapter. Pass it
            forward. Every traveler leaves a mark on the story.
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            {featuredArtifact ? (
              <Link
                href={`/artifact/${featuredArtifact.id}`}
                className="rounded-xl bg-yellow-500 px-8 py-4 text-lg font-bold text-black shadow-[0_0_25px_rgba(250,204,21,0.25)] transition hover:bg-yellow-400"
              >
                Discover An Artifact
              </Link>
            ) : null}

            <a
              href="#mission"
              className="rounded-xl border border-yellow-500 px-8 py-4 text-lg font-semibold text-white transition hover:bg-yellow-500/10"
            >
              Begin Exploring
            </a>
          </div>
        </section>

        <section
          id="mission"
          className="mb-16 rounded-3xl border border-yellow-700/40 bg-black/40 p-8 shadow-[0_0_35px_rgba(250,204,21,0.10)] md:p-12"
        >
          <p className="mb-4 text-sm uppercase tracking-[0.35em] text-yellow-400">
            The Mission
          </p>
          <h2 className="mb-6 font-serif text-4xl text-white md:text-5xl">
            A living record of small moments, strange meetings, and unexpected
            kindness.
          </h2>
          <p className="max-w-4xl text-lg leading-relaxed text-zinc-300 md:text-xl">
            Side Stories is a collection of traveling artifacts passed from one
            person to the next. Each relic carries a quest. Each holder adds a
            chapter. Over time, every artifact becomes a record of the people it
            reached, the places it visited, and the stories created along the
            way.
          </p>
        </section>

        <section className="mb-24 grid gap-4 md:grid-cols-4">
          {[
            [artifacts.length, 'Legendary Relics'],
            [chapterCount, 'Chapters Recorded'],
            [travelerCount, 'Travelers'],
            [locationCount, 'Places Visited'],
          ].map(([value, label]) => (
            <div
              key={label}
              className="rounded-2xl border border-yellow-700/40 bg-black/40 p-6 text-center"
            >
              <p className="font-serif text-4xl text-yellow-400">{value}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-zinc-400">
                {label}
              </p>
            </div>
          ))}
        </section>

        <section className="mb-24 rounded-3xl border border-yellow-700/40 bg-black/40 p-8 md:p-12">
          <p className="mb-4 text-sm uppercase tracking-[0.35em] text-yellow-400">
            A Message From The Merchant
          </p>
          <p className="mb-6 font-serif text-3xl leading-relaxed text-white md:text-4xl">
            The world has enough spectators. These relics were created for
            travelers.
          </p>
          <p className="max-w-3xl text-lg leading-relaxed text-zinc-300">
            Take one. Complete its quest. Leave the world slightly better than
            you found it. Then pass it on.
          </p>
          <p className="mt-8 font-serif text-2xl text-yellow-400">
            — The Merchant of Mischief
          </p>
        </section>

        <section className="mb-24 grid gap-6 md:grid-cols-4">
          {[
            ['I', 'Receive', 'A traveler receives an artifact and its quest.'],
            ['II', 'Complete', 'They complete the quest in the real world.'],
            ['III', 'Record', 'They add their chapter to the artifact history.'],
            ['IV', 'Pass On', 'The artifact continues to a new traveler.'],
          ].map(([num, title, text]) => (
            <div
              key={num}
              className="rounded-2xl border border-yellow-700/30 bg-black/40 p-6 shadow-[0_0_25px_rgba(250,204,21,0.08)]"
            >
              <p className="mb-4 text-sm uppercase tracking-[0.25em] text-yellow-400">
                Step {num}
              </p>
              <h2 className="mb-3 font-serif text-2xl text-white">{title}</h2>
              <p className="leading-relaxed text-zinc-400">{text}</p>
            </div>
          ))}
        </section>

        <section id="relics" className="mb-24 text-center">
          <p className="mb-4 text-sm uppercase tracking-[0.45em] text-yellow-400">
            Current Artifacts
          </p>
          <h2 className="mb-12 font-serif text-5xl text-yellow-400">
            Choose Your Relic
          </h2>

          {artifacts.length === 0 ? (
            <p className="text-zinc-400">
              No artifacts are currently listed in the archive.
            </p>
          ) : (
            <div className="grid gap-5 md:grid-cols-3">
              {artifacts.map((artifact) => (
                <Link
                  key={artifact.id}
                  href={`/artifact/${artifact.id}`}
                  className="group rounded-2xl border border-yellow-700/30 bg-black/50 p-5 text-left transition hover:border-yellow-400 hover:shadow-[0_0_30px_rgba(250,204,21,0.16)]"
                >
                  <div className="mb-5 flex h-48 items-center justify-center rounded-xl border border-yellow-700/40 bg-black p-4">
                    {artifact.image_url ? (
                      <Image
                        src={artifact.image_url}
                        alt={artifact.name}
                        width={1050}
                        height={600}
                        sizes="(min-width: 768px) 30vw, 90vw"
                        className="max-h-full w-auto object-contain"
                      />
                    ) : (
                      <span className="text-5xl text-yellow-400">✦</span>
                    )}
                  </div>
                  <p className="mb-2 text-xs uppercase tracking-[0.25em] text-yellow-600">
                    {artifact.relic_title}
                  </p>
                  <h3 className="mb-2 font-serif text-2xl text-white transition group-hover:text-yellow-400">
                    {artifact.name}
                  </h3>
                  <p className="mb-4 text-yellow-400">{artifact.id}</p>
                  <p className="leading-relaxed text-zinc-400">
                    {artifact.quest}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-yellow-700/40 bg-black/40 p-8 md:p-12">
          <p className="mb-4 text-sm uppercase tracking-[0.35em] text-yellow-400">
            Recent Traveler Activity
          </p>
          <h2 className="mb-8 font-serif text-4xl text-white">
            Latest Chapters
          </h2>

          {recentStories.length === 0 ? (
            <p className="text-zinc-400">No chapters have been recorded yet.</p>
          ) : (
            <div className="space-y-4">
              {recentStories.map((story) => (
                <Link
                  key={story.id}
                  href={`/artifact/${story.artifact_id}`}
                  className="block rounded-2xl border border-yellow-700/30 bg-black/50 p-6 transition hover:border-yellow-400"
                >
                  <p className="mb-2 text-yellow-400">{story.artifact_id}</p>
                  <h3 className="mb-2 font-serif text-2xl text-white">
                    {story.traveler_name || 'Anonymous Traveler'}
                  </h3>
                  <p className="text-zinc-400">
                    {story.event || 'Unknown Location'} •{' '}
                    {dateFormatter.format(new Date(story.created_at))}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>

        <footer className="mt-32 pb-16 text-center">
          <div className="mb-8 flex justify-center">
            <div className="h-px w-24 bg-yellow-700/40" />
            <div className="mx-6 text-xl text-yellow-500">✦</div>
            <div className="h-px w-24 bg-yellow-700/40" />
          </div>
          <p className="mb-8 text-sm uppercase tracking-[0.45em] text-yellow-500">
            Final Entry
          </p>
          <h2 className="mx-auto mb-10 max-w-4xl font-serif text-4xl leading-relaxed text-white md:text-5xl">
            The story does not end here.
            <br />
            It simply waits for its next traveler.
          </h2>
          <p className="mx-auto mb-12 max-w-3xl text-lg leading-loose text-zinc-400">
            Somewhere, one of these relics is changing hands. A stranger is
            completing a quest. A new chapter is being written.
            <br />
            <br />
            Perhaps the next story belongs to you.
          </p>
          <div className="mx-auto mb-8 h-px w-40 bg-yellow-700/30" />
          <p className="font-serif text-2xl italic text-yellow-400">
            — The Merchant of Mischief
          </p>
        </footer>
      </div>
    </main>
  )
}
