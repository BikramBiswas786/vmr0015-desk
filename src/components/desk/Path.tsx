import type { Stage } from "@/lib/desk/work";

const STEPS = ["House", "Accept", "Describe", "Validate", "Monitor", "Verify", "Issue", "Buyer"] as const;

export function place(stage: Stage, accepted: number, waiting: number): number {
  if (stage === "issued") return 7;
  if (stage === "verified") return 6;
  if (stage === "monitoring") return 5;
  if (stage === "validated") return 4;
  if (stage === "described") return 3;
  if (accepted === 0) return 0;
  if (waiting > 0) return 1;
  return 2;
}

export function Path({
  stage,
  accepted,
  waiting,
  sum,
  note,
  onNote,
  onNext,
}: {
  stage: Stage;
  accepted: number;
  waiting: number;
  sum: string;
  note: string;
  onNote: (value: string) => void;
  onNext: () => void;
}) {
  const at = place(stage, accepted, waiting);
  const label = [
    "Record the house",
    "Accept the house",
    "Write the description",
    "Validate",
    "Save the monitoring note",
    "Verify",
    `Issue ${sum} t`,
    "Record the buyer",
  ][at];

  return (
    <section className="mb-6 max-w-xl">
      <h1 className="font-serif text-3xl leading-none">Next</h1>
      <ol className="mt-4 space-y-2">
        {STEPS.map((step, index) => (
          <li key={step} className="grid grid-cols-[1.5rem_1fr] items-baseline gap-3 text-sm">
            <span className={`font-serif text-lg leading-none ${index === at ? "text-ink" : "text-quiet"}`}>{index < at ? "✓" : index + 1}</span>
            <span className={index === at ? "font-medium" : index < at ? "text-quiet" : "text-quiet"}>{step}{index === at ? ". Do this now." : ""}</span>
          </li>
        ))}
      </ol>
      {at === 4 ? (
        <label className="mt-4 block text-sm">
          Monitoring note
          <textarea value={note} onChange={(event) => onNote(event.target.value)} className="mt-1 min-h-24 w-full border border-rule bg-sheet px-3 py-2" />
        </label>
      ) : null}
      <button type="button" disabled={at === 4 && !note.trim()} onClick={onNext} className="mt-4 min-h-12 w-full bg-ink font-medium text-paper disabled:opacity-40">
        {label}
      </button>
    </section>
  );
}
