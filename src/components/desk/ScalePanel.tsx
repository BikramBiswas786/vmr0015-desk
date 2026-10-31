import {
  NOTE_HOUSEHOLDS,
  NOTE_PRICE_INR,
  NOTE_TONNES_PER_HOUSEHOLD,
  SAMPLE,
  count,
  floorTonnes,
  inr,
  perHousehold,
  project,
  tonnes,
} from "@/lib/desk/facts";
import type { DeskState } from "@/lib/desk/store";

type Props = {
  state: DeskState;
  patch: (partial: Partial<DeskState>) => void;
};

export function ScalePanel({ state, patch }: Props) {
  const households = Number(state.households);
  const own = Number(state.ownRate);
  const rate = state.useSampleRate ? perHousehold : own;
  const result = project(households, rate);
  const claimed = project(households, NOTE_TONNES_PER_HOUSEHOLD);
  const price = Number(state.priceInr);
  const hasPrice = Number.isFinite(price) && price > 0;
  const bar = claimed.tonnes > 0 ? Math.min(100, (result.tonnes / claimed.tonnes) * 100) : 0;
  const multiple = result.tonnes > 0 ? claimed.tonnes / result.tonnes : 0;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-medium tracking-wide text-quiet uppercase">Sample rate, locked</p>
        <p className="mt-1 font-serif text-3xl text-ink tabular-nums">{tonnes(perHousehold, 3)}</p>
        <p className="text-sm text-quiet">
          tonnes per household per year. {tonnes(SAMPLE.exPost, 3)} ÷ {count(SAMPLE.households)} from{" "}
          {SAMPLE.name}. Not a West Bengal default.
        </p>
      </div>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-ink">Households</span>
        <input
          inputMode="numeric"
          value={state.households}
          onChange={(e) => patch({ households: e.target.value.replace(/[^\d]/g, "") })}
          className="min-h-11 border border-rule bg-sheet px-3 font-serif text-xl text-ink tabular-nums"
        />
      </label>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => patch({ useSampleRate: true })}
          className={
            state.useSampleRate
              ? "min-h-11 flex-1 border border-ink bg-ink px-3 text-sm text-paper"
              : "min-h-11 flex-1 border border-rule bg-sheet px-3 text-sm text-ink"
          }
        >
          Sample rate
        </button>
        <button
          type="button"
          onClick={() => patch({ useSampleRate: false })}
          className={
            !state.useSampleRate
              ? "min-h-11 flex-1 border border-ink bg-ink px-3 text-sm text-paper"
              : "min-h-11 flex-1 border border-rule bg-sheet px-3 text-sm text-ink"
          }
        >
          My own rate
        </button>
      </div>

      {!state.useSampleRate && (
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-ink">Tonnes per household, from a real survey only</span>
          <input
            inputMode="decimal"
            value={state.ownRate}
            onChange={(e) => patch({ ownRate: e.target.value.replace(/[^\d.]/g, "") })}
            placeholder="0.519"
            className="min-h-11 border border-rule bg-sheet px-3 text-ink"
          />
          {own > 1.5 && (
            <p className="text-sm text-seal">
              That is well above this sample. Do not use a cookstove-sized number for drinking water unless a
              baseline survey produced it.
            </p>
          )}
        </label>
      )}

      <dl className="grid grid-cols-2 gap-4 border-y border-rule py-4">
        <div>
          <dt className="text-xs tracking-wide text-quiet uppercase">This rate</dt>
          <dd className="font-serif text-2xl text-ink tabular-nums">{tonnes(result.tonnes, 1)}</dd>
          <dd className="text-sm text-quiet">t CO2e, before a quality gate</dd>
        </div>
        <div>
          <dt className="text-xs tracking-wide text-quiet uppercase">Floor, as the mint rule</dt>
          <dd className="font-serif text-2xl text-ink tabular-nums">{count(result.mint)}</dd>
          <dd className="text-sm text-quiet">not a credit issued</dd>
        </div>
      </dl>

      <div>
        <p className="text-sm text-ink">
          The note used {NOTE_TONNES_PER_HOUSEHOLD} tonnes per household
          {multiple > 0 ? ` — ${tonnes(multiple, 1)}× this rate` : ""}. Same household count:{" "}
          {tonnes(claimed.tonnes, 0)} t, floor {count(claimed.mint)}.
        </p>
        <div className="mt-3 h-2 bg-rule" aria-hidden="true">
          <div className="h-2 bg-ink" style={{ width: `${bar}%` }} />
        </div>
        <p className="mt-2 text-xs text-quiet">The bar is this rate. The full width is the note.</p>
      </div>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-ink">Price per tonne, rupees, if you want a sketch</span>
        <input
          inputMode="numeric"
          value={state.priceInr}
          onChange={(e) => patch({ priceInr: e.target.value.replace(/[^\d]/g, "") })}
          placeholder="Leave blank. There is no offer."
          className="min-h-11 border border-rule bg-sheet px-3 text-ink"
        />
      </label>

      {hasPrice && (
        <p className="text-sm text-ink">
          Gross sketch at this rate: {inr(result.mint * price)}. The note’s {count(NOTE_HOUSEHOLDS)} homes at{" "}
          {NOTE_TONNES_PER_HOUSEHOLD} t and {inr(NOTE_PRICE_INR)} was {inr(NOTE_HOUSEHOLDS * NOTE_TONNES_PER_HOUSEHOLD * NOTE_PRICE_INR)}{" "}
          before its invented costs. At the sample rate those {count(NOTE_HOUSEHOLDS)} homes floor to{" "}
          {count(floorTonnes(NOTE_HOUSEHOLDS * perHousehold))} tonnes. None of this is revenue.
        </p>
      )}
    </div>
  );
}
