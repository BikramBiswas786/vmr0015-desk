import type { DeskState } from "@/lib/desk/store";

const KINDS: { id: DeskState["waterKind"]; label: string }[] = [
  { id: "jar", label: "Jar or drum" },
  { id: "filter", label: "Filter in the house" },
  { id: "kiosk", label: "Kiosk or ATM" },
  { id: "tap", label: "Public tap" },
  { id: "unknown", label: "Not sure yet" },
];

export function AreaPanel({
  state,
  patch,
}: {
  state: DeskState;
  patch: (partial: Partial<DeskState>) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-xs font-medium tracking-widest text-seal uppercase">On this phone only</p>
        <h2 className="mt-2 font-serif text-3xl leading-tight">A working lane</h2>
        <p className="mt-2 text-sm leading-relaxed text-quiet">
          Verra cannot see this. Guardian cannot see this. Saving a name does not stop anyone else from walking the same lane.
        </p>
      </div>
      <label className="flex flex-col gap-1 text-sm">
        District
        <input
          value={state.areaPlace}
          onChange={(e) => patch({ areaPlace: e.target.value })}
          className="min-h-12 border border-rule bg-sheet px-3 text-base text-ink"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Town or block, if you know it
        <input
          value={state.areaBlock}
          onChange={(e) => patch({ areaBlock: e.target.value })}
          placeholder="Balurghat, or a block"
          className="min-h-12 border border-rule bg-sheet px-3 text-base text-ink"
        />
      </label>
      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm">What water is being carried</legend>
        <div className="grid grid-cols-2 gap-2">
          {KINDS.map((kind) => {
            const on = state.waterKind === kind.id;
            return (
              <button
                key={kind.id}
                type="button"
                onClick={() => patch({ waterKind: kind.id })}
                className={
                  on
                    ? "min-h-12 border border-ink bg-ink px-2 text-sm text-paper"
                    : "min-h-12 border border-rule bg-sheet px-2 text-sm text-ink"
                }
              >
                {kind.label}
              </button>
            );
          })}
        </div>
      </fieldset>
      <p className="border border-rule bg-sheet px-3 py-3 text-sm leading-relaxed">
        <span className="font-medium text-seal">Not this. </span>
        Do not write “booked” or “claimed.” A lane is a place you might count. It is not a holding.
      </p>
    </div>
  );
}
