const artifacts = [
  'M-0001',
  'A-0001',
  'S-0001',
  'F-0001',
  'R-0001',
  'H-0001',
  'D-0001',
]

const randomArtifact =
  artifacts[Math.floor(Math.random() * artifacts.length)]
export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">

        <p className="text-yellow-400 mb-4 tracking-widest">
          DISCOVER SIDE STORIES
        </p>

        <h1 className="text-6xl font-bold mb-6">
          Artifacts Travel.
          <br />
          Stories Remain.
        </h1>

        <p className="text-xl text-zinc-300 max-w-2xl mx-auto mb-10">
          Receive an artifact. Complete its quest.
          Add your chapter. Pass it forward.
          Every traveler leaves a mark on the story.
        </p>

        <div className="flex justify-center gap-4">
          <a
            href={`/artifact/${randomArtifact}`}
            className="px-6 py-4 bg-yellow-500 text-black font-bold rounded-xl"
          >
            Discover An Artifact
          </a>

          <a
            href="/artifact/A-0001"
            className="px-6 py-4 border border-yellow-500 rounded-xl"
          >
            Begin Exploring
          </a>
        </div>
<div className="mt-24 grid gap-6 md:grid-cols-4 text-left">
  {[
    ['1', 'Receive', 'A traveler receives an artifact and its quest.'],
    ['2', 'Complete', 'They complete the quest in the real world.'],
    ['3', 'Record', 'They add their chapter to the artifact history.'],
    ['4', 'Pass On', 'The artifact continues to a new traveler.'],
  ].map(([num, title, text]) => (
    <div key={num} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
      <p className="text-yellow-400 text-sm mb-3">STEP {num}</p>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-zinc-400">{text}</p>
    </div>
  ))}
</div>
<div className="mt-24 text-center">
  <p className="text-yellow-400 mb-4 tracking-widest">
    CURRENT ARTIFACTS
  </p>

  <h2 className="text-4xl font-bold mb-10">
    Choose Your Relic
  </h2>

  <div className="grid gap-4 md:grid-cols-3">
    {[
      ['🍄', 'Mushroom Keeper', 'M-0001'],
      ['👽', 'Intergalactic Guide', 'A-0001'],
      ['🏮', 'Yūhosha Collector of Moments', 'R-0001'],
      ['🛸', 'The Visitor', 'F-0001'],
      ['❤️', 'Heart Keeper', 'H-0001'],
      ['🌱', 'Sprout Trader', 'S-0001'],
      ['🦆', 'Duck of Distinction', 'D-0001'],
    ].map(([emoji, name, id]) => (
      <a
        key={id}
        href={`/artifact/${id}`}
        className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-yellow-500 transition text-left"
      >
        <div className="text-4xl mb-4">{emoji}</div>
        <h3 className="text-xl font-bold">{name}</h3>
        <p className="text-yellow-400 mt-2">{id}</p>
      </a>
    ))}
  </div>
</div>
      </div>
    </main>
  )
}