import { supabase } from '@/lib/supabase'

const artifacts = [
  {
    emoji: '🍄',
    name: 'Mushroom Keeper',
    relic: 'The First Relic',
    id: 'M-0001',
    image: '/artifacts/mushroom-keeper.png',
    quest: 'Bestow this relic upon a worthy traveler before the night ends.',
  },
  {
    emoji: '👽',
    name: 'Intergalactic Guide',
    relic: 'The Second Relic',
    id: 'A-0001',
    image: '/artifacts/intergalactic-guide.png',
    quest: 'Find someone who could use a guide through the night.',
  },
  {
    emoji: '🏮',
    name: 'Yūhosha Collector of Moments',
    relic: 'The Third Relic',
    id: 'R-0001',
    image: '/artifacts/yuhosha.png',
    quest: 'Share a memory with a stranger and continue the story.',
  },
  {
    emoji: '🛸',
    name: 'The Visitor',
    relic: 'The Fourth Relic',
    id: 'F-0001',
    image: '/artifacts/visitor.png',
    quest: 'Seek out a traveler standing alone and meet them.',
  },
  {
    emoji: '❤️',
    name: 'Heart Keeper',
    relic: 'The Fifth Relic',
    id: 'H-0001',
    image: '/artifacts/heart-keeper.png',
    quest: 'Give this relic to someone who made your night better.',
  },
  {
    emoji: '🌱',
    name: 'Sprout Trader',
    relic: 'The Sixth Relic',
    id: 'S-0001',
    image: '/artifacts/sprout-trader.png',
    quest: 'Trade this artifact for another artifact.',
  },
  {
    emoji: '🦆',
    name: 'Duck of Distinction',
    relic: 'The Seventh Relic',
    id: 'D-0001',
    image: '/artifacts/duck.png',
    quest: 'Award this relic to someone who improved the vibes.',
  },
]

const artifactIds = artifacts.map((artifact) => artifact.id)

const randomArtifact =
  artifactIds[Math.floor(Math.random() * artifactIds.length)]

export default async function Home() {
  const { data: stories } = await supabase
    .from('stories')
    .select('*')
    .order('created_at', { ascending: false })

  const chapterCount = stories?.length || 0

  const travelerCount =
    new Set(
      stories
        ?.map((story) => story.traveler_name)
        .filter(Boolean)
    ).size || 0

  const locationCount =
    new Set(
      stories
        ?.map((story) => story.event)
        .filter(Boolean)
    ).size || 0

  const recentStories = stories?.slice(0, 3) || []

  return (
    <main className="min-h-screen bg-gradient-to-b from-yellow-950 via-black to-black text-white">
      <div className="max-w-6xl mx-auto px-6 py-20">

        <section className="text-center mb-24">
          <p className="text-yellow-400 uppercase tracking-[0.45em] text-sm mb-6">
            Discover Side Stories
          </p>

          <h1 className="font-serif text-6xl md:text-8xl font-bold text-yellow-400 drop-shadow-[0_0_24px_rgba(250,204,21,0.35)] mb-8">
            Artifacts Travel.
            <br />
            Stories Remain.
          </h1>

          <p className="text-xl md:text-2xl text-zinc-300 max-w-3xl mx-auto leading-relaxed mb-10">
            Receive an artifact. Complete its quest. Add your chapter.
            Pass it forward. Every traveler leaves a mark on the story.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href={`/artifact/${randomArtifact}`}
              className="rounded-xl bg-yellow-500 px-8 py-4 text-black font-bold text-lg shadow-[0_0_25px_rgba(250,204,21,0.25)] hover:bg-yellow-400 transition"
            >
              Discover An Artifact
            </a>

            <a
              href="#mission"
              className="rounded-xl border border-yellow-500 px-8 py-4 text-white font-semibold text-lg hover:bg-yellow-500/10 transition"
            >
              Begin Exploring
            </a>
          </div>
        </section>

        <section id="mission" className="mb-16 rounded-3xl border border-yellow-700/40 bg-black/40 p-8 md:p-12 shadow-[0_0_35px_rgba(250,204,21,0.10)]">
          <p className="text-yellow-400 uppercase tracking-[0.35em] text-sm mb-4">
            The Mission
          </p>

          <h2 className="font-serif text-4xl md:text-5xl text-white mb-6">
            A living record of small moments, strange meetings, and unexpected kindness.
          </h2>

          <p className="text-zinc-300 text-lg md:text-xl leading-relaxed max-w-4xl">
            Side Stories is a collection of traveling artifacts passed from one person
            to the next. Each relic carries a quest. Each holder adds a chapter. Over
            time, every artifact becomes a record of the people it reached, the places it
            visited, and the stories created along the way.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-4 mb-24">
          <div className="rounded-2xl border border-yellow-700/40 bg-black/40 p-6 text-center">
            <p className="font-serif text-4xl text-yellow-400">{artifacts.length}</p>
            <p className="text-zinc-400 uppercase tracking-[0.2em] text-xs mt-2">
              Legendary Relics
            </p>
          </div>

          <div className="rounded-2xl border border-yellow-700/40 bg-black/40 p-6 text-center">
            <p className="font-serif text-4xl text-yellow-400">{chapterCount}</p>
            <p className="text-zinc-400 uppercase tracking-[0.2em] text-xs mt-2">
              Chapters Recorded
            </p>
          </div>

          <div className="rounded-2xl border border-yellow-700/40 bg-black/40 p-6 text-center">
            <p className="font-serif text-4xl text-yellow-400">{travelerCount}</p>
            <p className="text-zinc-400 uppercase tracking-[0.2em] text-xs mt-2">
              Travelers
            </p>
          </div>

          <div className="rounded-2xl border border-yellow-700/40 bg-black/40 p-6 text-center">
            <p className="font-serif text-4xl text-yellow-400">{locationCount}</p>
            <p className="text-zinc-400 uppercase tracking-[0.2em] text-xs mt-2">
              Places Visited
            </p>
          </div>
        </section>

        <section className="mb-24 rounded-3xl border border-yellow-700/40 bg-black/40 p-8 md:p-12">
          <p className="text-yellow-400 uppercase tracking-[0.35em] text-sm mb-4">
            A Message From The Merchant
          </p>

          <p className="font-serif text-3xl md:text-4xl text-white leading-relaxed mb-6">
            The world has enough spectators. These relics were created for travelers.
          </p>

          <p className="text-zinc-300 text-lg leading-relaxed max-w-3xl">
            Take one. Complete its quest. Leave the world slightly better than you found it.
            Then pass it on.
          </p>

          <p className="text-yellow-400 mt-8 font-serif text-2xl">
            — The Merchant of Mischief
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-4 mb-24">
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
              <p className="text-yellow-400 uppercase tracking-[0.25em] text-sm mb-4">
                Step {num}
              </p>
              <h2 className="font-serif text-2xl text-white mb-3">{title}</h2>
              <p className="text-zinc-400 leading-relaxed">{text}</p>
            </div>
          ))}
        </section>

        <section id="relics" className="text-center mb-24">
          <p className="text-yellow-400 uppercase tracking-[0.45em] text-sm mb-4">
            Current Artifacts
          </p>

          <h2 className="font-serif text-5xl text-yellow-400 mb-12">
            Choose Your Relic
          </h2>

          <div className="grid gap-5 md:grid-cols-3">
            {artifacts.map((artifact) => (
              <a
                key={artifact.id}
                href={`/artifact/${artifact.id}`}
                className="group text-left rounded-2xl border border-yellow-700/30 bg-black/50 p-5 hover:border-yellow-400 hover:shadow-[0_0_30px_rgba(250,204,21,0.16)] transition"
              >
                <div className="mb-5 flex h-48 items-center justify-center rounded-xl border border-yellow-700/40 bg-black p-4">
                  <img
                    src={artifact.image}
                  alt={artifact.name}
                   className="max-h-full max-w-full object-contain"
                     />
                  </div>

                <p className="text-xs uppercase tracking-[0.25em] text-yellow-600 mb-2">
                  {artifact.relic}
                </p>

                <h3 className="font-serif text-2xl text-white mb-2 group-hover:text-yellow-400 transition">
                  {artifact.name}
                </h3>

                <p className="text-yellow-400 mb-4">{artifact.id}</p>

                <p className="text-zinc-400 leading-relaxed">
                  {artifact.quest}
                </p>
              </a>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-yellow-700/40 bg-black/40 p-8 md:p-12">
          <p className="text-yellow-400 uppercase tracking-[0.35em] text-sm mb-4">
            Recent Traveler Activity
          </p>

          <h2 className="font-serif text-4xl text-white mb-8">
            Latest Chapters
          </h2>

          {recentStories.length === 0 ? (
            <p className="text-zinc-400">No chapters have been recorded yet.</p>
          ) : (
            <div className="space-y-4">
              {recentStories.map((story) => (
                <a
                  key={story.id}
                  href={`/artifact/${story.artifact_id}`}
                  className="block rounded-2xl border border-yellow-700/30 bg-black/50 p-6 hover:border-yellow-400 transition"
                >
                  <p className="text-yellow-400 mb-2">
                    {story.artifact_id}
                  </p>

                  <h3 className="font-serif text-2xl text-white mb-2">
                    {story.traveler_name || 'Anonymous Traveler'}
                  </h3>

                  <p className="text-zinc-400">
                    {story.event || 'Unknown Location'} •{' '}
                    {new Date(story.created_at).toLocaleDateString()}
                  </p>
                </a>
              ))}
            </div>
          )}
        </section>
<footer className="mt-32 pb-16 text-center">

  <div className="flex justify-center mb-8">
    <div className="h-px w-24 bg-yellow-700/40"></div>
    <div className="mx-6 text-yellow-500 text-xl">✦</div>
    <div className="h-px w-24 bg-yellow-700/40"></div>
  </div>

  <p className="text-yellow-500 uppercase tracking-[0.45em] text-sm mb-8">
    Final Entry
  </p>

  <h2 className="font-serif text-4xl md:text-5xl text-white leading-relaxed max-w-4xl mx-auto mb-10">
    The story does not end here.
    <br />
    It simply waits for its next traveler.
  </h2>

  <p className="max-w-3xl mx-auto text-zinc-400 text-lg leading-loose mb-12">
    Somewhere, one of these relics is changing hands.
    A stranger is completing a quest.
    A new chapter is being written.
    <br /><br />
    Perhaps the next story belongs to you.
  </p>

  <div className="w-40 h-px bg-yellow-700/30 mx-auto mb-8"></div>

  <p className="font-serif text-2xl text-yellow-400 italic">
    — The Merchant of Mischief
  </p>

</footer>
</div>
    </main>
  )
}