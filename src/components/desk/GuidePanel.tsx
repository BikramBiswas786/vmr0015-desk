import { GUIDE, WHEN_LABEL } from "@/lib/desk/guide";
import type { DeskState } from "@/lib/desk/store";

export function GuidePanel({
  state,
  patch,
}: {
  state: DeskState;
  patch: (partial: Partial<DeskState>) => void;
}) {
  const index = Math.min(Math.max(state.guideStep, 0), GUIDE.length - 1);
  const step = GUIDE[index];
  const last = index === GUIDE.length - 1;

  return (
    <article className="flex flex-col gap-5">
      <p className="text-xs font-medium tracking-widest text-quiet uppercase">
        Card {index + 1} of {GUIDE.length}
      </p>
      <div>
        <p className="text-xs font-medium tracking-widest text-seal uppercase">{WHEN_LABEL[step.when]}</p>
        <h2 className="mt-2 font-serif text-3xl leading-tight text-ink">{step.title}</h2>
      </div>
      <div className="space-y-3 text-base leading-relaxed">
        {step.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <p className="border border-rule bg-sheet px-3 py-3 text-sm leading-relaxed">
        <span className="font-medium text-seal">Not this. </span>
        {step.not}
      </p>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          disabled={index === 0}
          onClick={() => patch({ guideStep: index - 1 })}
          className="min-h-12 border border-rule bg-sheet text-sm font-medium text-ink disabled:text-quiet"
        >
          Back
        </button>
        {last ? (
          <button
            type="button"
            onClick={() => patch({ tab: "sheet" })}
            className="min-h-12 bg-ink text-sm font-medium text-paper"
          >
            Open Field
          </button>
        ) : (
          <button
            type="button"
            onClick={() => patch({ guideStep: index + 1 })}
            className="min-h-12 bg-ink text-sm font-medium text-paper"
          >
            Next card
          </button>
        )}
      </div>
    </article>
  );
}
