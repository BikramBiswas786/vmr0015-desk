import { datesOverlap, emptySheet, type DeskState, type Sheet } from "@/lib/desk/store";

type Props = {
  state: DeskState;
  patch: (partial: Partial<DeskState>) => void;
};

function num(value: string): number | null {
  if (value.trim() === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function warnings(sheet: Sheet, others: Sheet[]): string[] {
  const out: string[] = [];
  const quality = num(sheet.qualityFailShare);
  if (quality !== null && quality > 0.1) {
    out.push("Over 10 percent failing the water-quality check can void the period. Nazava at 11.29 percent earned zero under VMR0015.");
  }
  const fnrb = num(sheet.fNrb);
  if (fnrb !== null && (fnrb < 0 || fnrb > 1)) {
    out.push("fNRB outside 0 to 1 voids the calculation. A typed 62 is not 0.62.");
  }
  const boil = num(sheet.boilShare);
  if (boil !== null && (boil < 0 || boil > 1)) {
    out.push("Share who boil must be between 0 and 1.");
  }
  const clash = others.some(
    (other) =>
      other.id !== sheet.id &&
      datesOverlap(sheet.periodStart, sheet.periodEnd, other.periodStart, other.periodEnd),
  );
  if (clash) {
    out.push("These dates overlap another note. The policy rejects an overlapping monitoring period.");
  }
  return out;
}

const fieldClass = "min-h-11 w-full border border-rule bg-sheet px-3 text-ink";

export function SheetPanel({ state, patch }: Props) {
  const draft = state.sheets[0] ?? null;

  function save(next: Sheet) {
    const rest = state.sheets.filter((item) => item.id !== next.id);
    patch({ sheets: [next, ...rest] });
  }

  function update(partial: Partial<Sheet>) {
    if (!draft) return;
    save({ ...draft, ...partial });
  }

  function remove(id: string) {
    patch({ sheets: state.sheets.filter((item) => item.id !== id) });
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm leading-relaxed text-quiet">
        A field note for the inputs the methodology actually uses. Households are written down as evidence.
        They do not enter the arithmetic. Nothing here is submitted, and nothing is minted.
      </p>

      {!draft && (
        <button
          type="button"
          onClick={() => patch({ sheets: [emptySheet()] })}
          className="min-h-11 border border-ink bg-ink px-4 text-sm font-medium text-paper"
        >
          Start a section note
        </button>
      )}

      {draft && (
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            patch({ sheets: [emptySheet(), ...state.sheets] });
          }}
        >
          <label className="flex flex-col gap-1 text-sm">
            Place
            <input
              value={draft.place}
              onChange={(e) => update({ place: e.target.value })}
              className={fieldClass}
              placeholder="Village or block. Leave blank if you do not have one."
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Section id
            <input
              value={draft.sectionId}
              onChange={(e) => update({ sectionId: e.target.value })}
              className={fieldClass}
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1 text-sm">
              Period start
              <input
                type="date"
                value={draft.periodStart}
                onChange={(e) => update({ periodStart: e.target.value })}
                className={fieldClass}
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              Period end
              <input
                type="date"
                value={draft.periodEnd}
                onChange={(e) => update({ periodEnd: e.target.value })}
                className={fieldClass}
              />
            </label>
          </div>
          <label className="flex flex-col gap-1 text-sm">
            Households seen (evidence only)
            <input
              inputMode="numeric"
              value={draft.householdsEvidence}
              onChange={(e) => update({ householdsEvidence: e.target.value.replace(/[^\d]/g, "") })}
              className={fieldClass}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Share who boil with wood or charcoal (0 to 1)
            <input
              inputMode="decimal"
              value={draft.boilShare}
              onChange={(e) => update({ boilShare: e.target.value.replace(/[^\d.]/g, "") })}
              className={fieldClass}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Baseline fuel
            <select
              value={draft.fuel}
              onChange={(e) => update({ fuel: e.target.value as Sheet["fuel"] })}
              className={fieldClass}
            >
              <option value="unknown">Not surveyed</option>
              <option value="wood">Wood</option>
              <option value="charcoal">Charcoal</option>
              <option value="mixed">Wood and charcoal</option>
            </select>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1 text-sm">
              fNRB applied (0 to 1)
              <input
                inputMode="decimal"
                value={draft.fNrb}
                onChange={(e) => update({ fNrb: e.target.value.replace(/[^\d.]/g, "") })}
                className={fieldClass}
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              Cited source
              <select
                value={draft.fNrbSource}
                onChange={(e) => update({ fNrbSource: e.target.value as Sheet["fNrbSource"] })}
                className={fieldClass}
              >
                <option value="unknown">Not cited</option>
                <option value="tool33">TOOL33</option>
                <option value="unfccc">UNFCCC</option>
                <option value="tool30">TOOL30 × 0.74</option>
              </select>
            </label>
          </div>
          <label className="flex flex-col gap-1 text-sm">
            Share of checks failing E. coli (0 to 1)
            <input
              inputMode="decimal"
              value={draft.qualityFailShare}
              onChange={(e) => update({ qualityFailShare: e.target.value.replace(/[^\d.]/g, "") })}
              className={fieldClass}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Water quantity, litres, if measured
            <input
              inputMode="decimal"
              value={draft.qpwLitres}
              onChange={(e) => update({ qpwLitres: e.target.value.replace(/[^\d.]/g, "") })}
              className={fieldClass}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Note
            <textarea
              value={draft.notes}
              onChange={(e) => update({ notes: e.target.value })}
              rows={3}
              className="w-full border border-rule bg-sheet px-3 py-2 text-ink"
            />
          </label>

          {warnings(draft, state.sheets).map((warning) => (
            <p key={warning} className="text-sm text-seal">
              {warning}
            </p>
          ))}

          <button type="submit" className="min-h-11 border border-ink px-4 text-sm font-medium text-ink">
            Keep this and start another
          </button>
        </form>
      )}

      {state.sheets.length > 1 && (
        <ul className="flex flex-col gap-3">
          {state.sheets.slice(1).map((sheet) => (
            <li key={sheet.id} className="border-t border-rule pt-3 text-sm">
              <p className="font-medium text-ink">
                {sheet.sectionId || "Untitled section"}
                {sheet.place ? ` · ${sheet.place}` : ""}
              </p>
              <p className="text-quiet">
                {sheet.periodStart || "—"} to {sheet.periodEnd || "—"}
                {sheet.householdsEvidence ? ` · ${sheet.householdsEvidence} households, evidence only` : ""}
              </p>
              <button
                type="button"
                onClick={() => remove(sheet.id)}
                className="mt-2 min-h-11 text-sm text-seal"
              >
                Remove this note
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
