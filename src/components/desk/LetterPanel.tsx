import { partnershipLetter, verraNote } from "@/lib/desk/letters";
import { PARTNERS } from "@/lib/desk/partners";
import type { DeskState } from "@/lib/desk/store";
import { useState } from "react";

export function LetterPanel({
  state,
  patch,
}: {
  state: DeskState;
  patch: (partial: Partial<DeskState>) => void;
}) {
  const [copied, setCopied] = useState(false);
  const partner = PARTNERS.find((item) => item.id === state.partnerId) ?? PARTNERS[0];
  const area = [state.areaPlace, state.areaBlock].filter(Boolean).join(", ");
  const text = state.letterKind === "verra" ? verraNote(area) : partnershipLetter(partner, area);

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
        <p className="text-xs font-medium tracking-widest text-seal uppercase">Copy, then send yourself</p>
        <h2 className="mt-2 font-serif text-3xl leading-tight">The letter</h2>
        <p className="mt-2 text-sm leading-relaxed text-quiet">
          It does not mention a job. It does not reserve a district. Put your name on the blank line before you send it.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => patch({ letterKind: "partner" })}
          className={
            state.letterKind === "partner"
              ? "min-h-12 bg-ink text-sm text-paper"
              : "min-h-12 border border-rule bg-sheet text-sm"
          }
        >
          To {partner.name}
        </button>
        <button
          type="button"
          onClick={() => patch({ letterKind: "verra" })}
          className={
            state.letterKind === "verra"
              ? "min-h-12 bg-ink text-sm text-paper"
              : "min-h-12 border border-rule bg-sheet text-sm"
          }
        >
          If you write Verra
        </button>
      </div>
      <pre className="border border-rule bg-sheet px-3 py-3 font-sans text-sm leading-relaxed whitespace-pre-wrap">
        {text}
      </pre>
      <button type="button" onClick={copy} className="min-h-12 bg-ink text-sm font-medium text-paper">
        {copied ? "Copied" : "Copy the letter"}
      </button>
    </div>
  );
}
