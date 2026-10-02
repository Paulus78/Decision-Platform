// Hörprobe: Stimmen vergleichen, bevor das ganze Video vertont wird.
const GROUPS = [
  {
    title: "Erzähler",
    samples: [
      { label: "Gemini · Puck (bisher)", file: "/audio/n1.wav" },
      { label: "ElevenLabs · Brian", file: "/audio/test/erzaehler-brian.mp3" },
      { label: "ElevenLabs · Charlie", file: "/audio/test/erzaehler-charlie.mp3" },
      { label: "ElevenLabs · George", file: "/audio/test/erzaehler-george.mp3" },
    ],
  },
  {
    title: "Frau Brandt",
    samples: [
      { label: "Gemini · Kore (bisher)", file: "/audio/b1.wav" },
      { label: "ElevenLabs · Sarah", file: "/audio/test/brandt-sarah.mp3" },
      { label: "ElevenLabs · Alice", file: "/audio/test/brandt-alice.mp3" },
      { label: "ElevenLabs · Lily", file: "/audio/test/brandt-lily.mp3" },
    ],
  },
];

export default function StimmenPage() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-8 p-8">
      <h1 className="text-3xl font-bold">Stimmen-Hörprobe</h1>
      {GROUPS.map((group) => (
        <section key={group.title} className="flex flex-col gap-4">
          <h2 className="text-xl font-bold">{group.title}</h2>
          {group.samples.map((sample) => (
            <div key={sample.file} className="flex flex-col gap-1">
              <p>{sample.label}</p>
              <audio controls src={sample.file} className="w-full" />
            </div>
          ))}
        </section>
      ))}
    </main>
  );
}
