import { Check } from "lucide-react";
import { NEXT_ITEMS, type DeskState } from "@/lib/desk/store";

type Props = {
  state: DeskState;
  patch: (partial: Partial<DeskState>) => void;
};

export function NextPanel({ state, patch }: Props) {
  const doneCount = NEXT_ITEMS.filter((item) => state.done[item.id]).length;

  return (
    <div className="flex flex-col gap-5">
      <p className="font-serif text-xl leading-snug text-ink">
        {doneCount} of {NEXT_ITEMS.length} kept. These are restraints, not a launch plan.
      </p>
      <ul className="flex flex-col">
        {NEXT_ITEMS.map((item) => {
          const on = Boolean(state.done[item.id]);
          return (
            <li key={item.id} className="border-t border-rule">
              <button
                type="button"
                onClick={() => patch({ done: { ...state.done, [item.id]: !on } })}
                className="flex min-h-11 w-full items-start gap-3 py-3 text-left"
              >
                <span
                  className={
                    on
                      ? "mt-0.5 flex size-5 shrink-0 items-center justify-center border border-ink bg-ink text-paper"
                      : "mt-0.5 size-5 shrink-0 border border-ink"
                  }
                  aria-hidden="true"
                >
                  {on ? <Check className="size-3" strokeWidth={2.5} /> : null}
                </span>
                <span>
                  <span className="block text-sm font-medium text-ink">{item.title}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-quiet">{item.body}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <p className="text-sm leading-relaxed text-quiet">
        The checkmarks stay on this phone. They do not update the pull request, and they do not contact anyone.
      </p>
    </div>
  );
}
