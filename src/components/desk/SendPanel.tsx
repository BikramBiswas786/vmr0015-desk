import { companyPacket, verraPacket } from "@/lib/desk/policy";
import { PARTNERS } from "@/lib/desk/partners";
import type { DeskState } from "@/lib/desk/store";
import { useState } from "react";

export function SendPanel({
  state,
  patch,
}: {
  state: DeskState;
  patch: (partial: Partial<DeskState>) => void;
}) {
  const [copied, setCopied] = useState(false);
  const partner = PARTNERS.find((item) => item.id === state.partnerId) ?? null;
  const area = [state.areaPlace, state.areaBlock].filter(Boolean).join(", ");
  const text = state.letterKind === "verra" ? verraPacket() : companyPacket(partner, area);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-xs font-medium tracking-widest text-seal uppercase">Copy, then send it yourself</p>
        <h2 className="mt-2 font-serif text-3xl leading-tight">The packet</h2>
        <p className="mt-2 text-sm leading-relaxed text-quiet">
          Put your name on the blank line. Do not add a price, a tonne per family, or a line that the district is booked.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => {
            setCopied(false);
            patch({ letterKind: "verra" });
          }}
          className={
            state.letterKind === "verra"
              ? "min-h-12 bg-ink text-sm text-paper"
              : "min-h-12 border border-rule bg-sheet text-sm"
          }
        >
          To Verra
        </button>
        <button
          type="button"
          onClick={() => {
            setCopied(false);
            patch({ letterKind: "partner" });
          }}
          className={
            state.letterKind === "partner"
              ? "min-h-12 bg-ink text-sm text-paper"
              : "min-h-12 border border-rule bg-sheet text-sm"
          }
        >
          To a company
        </button>
      </div>
      {state.letterKind === "partner" && (
        <label className="flex flex-col gap-1 text-sm">
          Company
          <select
            value={state.partnerId}
            onChange={(e) => patch({ partnerId: e.target.value })}
            className="min-h-12 border border-rule bg-sheet px-3 text-base"
          >
            {PARTNERS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
      )}
      <pre className="border border-rule bg-sheet px-3 py-3 font-sans text-sm leading-relaxed whitespace-pre-wrap">
        {text}
      </pre>
      <button type="button" onClick={copy} className="min-h-12 bg-ink text-sm font-medium text-paper">
        {copied ? "Copied" : "Copy the packet"}
      </button>
    </div>
  );
}
