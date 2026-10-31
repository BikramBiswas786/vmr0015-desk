import { JUDGMENT_TEXT, SAMPLE, count, perHousehold, tonnes } from "@/lib/desk/facts";
import { useState } from "react";

const RULINGS = [
  {
    mark: "Holds",
    title: "The pull request is open. It is not merged.",
    body: "hashgraph/guardian #6164, by BikramBiswas786, into develop. Last updated 23 October 2026. No review comments were on it when this was checked. Open is not accepted, and it is not a bounty payment.",
  },
  {
    mark: "Holds",
    title: "The sample arithmetic is the number to defend.",
    body: `Ex-ante ${tonnes(SAMPLE.exAnte, 9)} t. Ex-post ${tonnes(SAMPLE.exPost, 9)} t. Mint ${count(SAMPLE.mint)}. No flags. ${SAMPLE.sections} sections × ${SAMPLE.householdsPerSection} households.`,
  },
  {
    mark: "Holds",
    title: "Per household, that sample is 0.519 tonnes. Not 4.",
    body: `${tonnes(SAMPLE.exPost, 3)} ÷ ${count(SAMPLE.households)} = ${tonnes(perHousehold, 3)} t CO2e per household per year. householdsServed is evidence for the verifier. It is not in the equation.`,
  },
  {
    mark: "Does not hold",
    title: "The note’s revenue table.",
    body: "Four to five tonnes per family, 200 credits from 50 homes, 20,000 from 5,000 homes, ₹1,270 a credit, and ₹1.54 crore net. The yield is about eight times this sample. The price was assumed. The costs were assumed.",
  },
  {
    mark: "Does not hold",
    title: "A drum scan, or a test mint, is a credit you can sell.",
    body: "The methodology still needs the baseline, the quantity, the cap, fNRB, efficiency, leakage, and the water-quality gate. Over 10 percent failing E. coli can void the period. Nazava reproduced at about 28,880 t and then earned 0 under VMR0015. The 1,556 tokens are a Guardian dry-run, not Verra VCUs.",
  },
  {
    mark: "Not in the file",
    title: "Fifteen documents, and the fNRB backup.",
    body: "A later dry-run finished both templates at 15 documents and 1,556 tokens, including a rejected overlap and an accepted 2028 report. The public line is still 13 of 13. v3.2 is a backup. The file under review is v3.1, unless a reviewer asks.",
  },
] as const;

export function JudgmentPanel() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(JUDGMENT_TEXT);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="font-serif text-2xl leading-snug text-ink">
        I will not sign the note. The policy result is real. The business built on top of it is not.
      </p>
      <ul className="flex flex-col gap-4">
        {RULINGS.map((item) => (
          <li key={item.title} className="border-t border-rule pt-4">
            <p
              className={
                item.mark === "Does not hold"
                  ? "text-xs font-medium tracking-wide text-seal uppercase"
                  : "text-xs font-medium tracking-wide text-quiet uppercase"
              }
            >
              {item.mark}
            </p>
            <h2 className="mt-1 font-serif text-lg leading-snug text-ink">{item.title}</h2>
            <p className="mt-1 text-sm leading-relaxed text-quiet">{item.body}</p>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={copy}
        className="min-h-11 border border-ink bg-ink px-4 text-sm font-medium text-paper"
      >
        {copied ? "Copied" : "Copy the full judgment"}
      </button>
    </div>
  );
}
