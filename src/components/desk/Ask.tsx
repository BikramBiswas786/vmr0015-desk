import { useState } from "react";

const LINES: Record<string, string[]> = {
  drum: [
    "You are the field worker. You only take the photo and answer the questions.",
    "Write the house, how many people, wood or charcoal, drum or filter, and whether the water passed.",
    "A new photo is always allowed. It does not close because someone else already wrote a description.",
    "You do not validate, you do not issue, and you do not sell.",
  ],
  check: [
    "You are the checker. You are a different person from the one who took the photo.",
    "Accept a house only when the water passed, there is a photo, they boil with wood or charcoal, and there is no public safe-water pipe.",
    "A drum counts only with chlorine, a flocculant powder, or solar, and the drum is sealed or still disinfected.",
    "Houses already inside a description stay as they are. New houses can still be accepted.",
  ],
  developer: [
    "You are the developer. You name the project and the treatment point the drums leave from.",
    "Lock only the houses a checker has accepted.",
    "After that lock, Check validates it, then you write the monitoring note on this page.",
    "One finished description does not stop the next. Open a new description for the houses that are not in it yet.",
  ],
  business: [
    "You are the buyer. You see the tonnes this project has issued and you write your name against them.",
    "One house that passed is 0.519 tonnes. The file counts whole tonnes when the sum reaches 1.",
    "Payment is arranged with the project. This page keeps the record.",
  ],
  guardian: [
    "You are importing the policy file into Hedera Guardian.",
    "Download v3.1 A if the project starts before 1 January 2027. Download v3.1 B if it starts on or after that date.",
    "In Managed Guardian Service, open Manage Policies and import that file. This page cannot import it for you.",
    "Guardian then has two roles: the project proponent and the verifier.",
  ],
};

export function Ask({ who }: { who: keyof typeof LINES }) {
  const lines = LINES[who];
  const [q, setQ] = useState("");
  const [a, setA] = useState(lines[0]);

  function ask() {
    const text = q.toLowerCase();
    const hit = lines.find((line) => text && line.toLowerCase().split(" ").some((word) => word.length > 4 && text.includes(word)));
    setA(hit ?? lines[0]);
  }

  return (
    <section className="mb-6 max-w-xl space-y-3 text-sm">
      <p className="leading-relaxed">{lines[0]}</p>
      <label className="block">
        Ask what to do
        <input value={q} onChange={(event) => setQ(event.target.value)} className="mt-1 min-h-12 w-full border border-rule bg-sheet px-3" />
      </label>
      <button type="button" onClick={ask} className="min-h-11 border border-rule bg-sheet px-3">
        Explain
      </button>
      <p className="border border-rule bg-sheet p-3 leading-relaxed">{a}</p>
    </section>
  );
}
