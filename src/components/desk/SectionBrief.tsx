import { BRIEFS, CHAIN } from "@/lib/desk/sections";

export function SectionBrief({
  role,
  onGo,
}: {
  role: keyof typeof BRIEFS;
  onGo: (next: keyof typeof BRIEFS) => void;
}) {
  const brief = BRIEFS[role];
  return (
    <section className="mb-6 max-w-xl border border-rule bg-sheet p-3 text-sm">
      <ol className="flex gap-2 overflow-x-auto pb-3">
        {CHAIN.map(([id, label], index) => (
          <li key={id}>
            <button
              type="button"
              onClick={() => onGo(id)}
              className={`min-h-11 whitespace-nowrap px-2 ${role === id ? "bg-ink text-paper" : ""}`}
            >
              {index + 1}. {label}
            </button>
          </li>
        ))}
      </ol>
      <p>
        <span className="text-quiet">Who. </span>
        {brief.who}
      </p>
      <p className="mt-2">
        <span className="text-quiet">Do. </span>
        {brief.do}
      </p>
      <p className="mt-2">
        <span className="text-quiet">Not. </span>
        {brief.not}
      </p>
      <p className="mt-2">
        <span className="text-quiet">Then. </span>
        {brief.next}
      </p>
      <button type="button" onClick={() => onGo(brief.nextRole)} className="mt-3 min-h-11 border border-rule bg-paper px-3">
        Next
      </button>
    </section>
  );
}
