/** Figures taken from the Kilimanjaro sample project (PD-KSW-2027-001).
 *  Four sections, householdsServed 750 each. householdsServed is evidence
 *  for the verifier. It is not an input to the equation.
 */
export const SAMPLE = {
  name: "Kilimanjaro Safe Water",
  id: "PD-KSW-2027-001",
  sections: 4,
  householdsPerSection: 750,
  households: 3000,
  exAnte: 1666.620262475,
  exPost: 1556.947181413,
  mint: 1556,
} as const;

/** The pasted note's planning figure. Not a result of this policy. */
export const NOTE_TONNES_PER_HOUSEHOLD = 4;

/** The note priced a credit at about ₹1,270 and called it ~$15. Not a quote. */
export const NOTE_PRICE_INR = 1270;
export const NOTE_HOUSEHOLDS = 5000;

export const perHousehold = SAMPLE.exPost / SAMPLE.households;

export function floorTonnes(tonnes: number): number {
  if (!Number.isFinite(tonnes) || tonnes <= 0) return 0;
  return Math.floor(tonnes);
}

export function project(households: number, tonnesPerHousehold: number) {
  const safeHouseholds = Number.isFinite(households) && households > 0 ? households : 0;
  const rate =
    Number.isFinite(tonnesPerHousehold) && tonnesPerHousehold > 0 ? tonnesPerHousehold : 0;
  const tonnes = safeHouseholds * rate;
  return { tonnes, mint: floorTonnes(tonnes) };
}

export const sampleAtNoteScale = project(NOTE_HOUSEHOLDS, perHousehold);
export const noteAtNoteScale = project(NOTE_HOUSEHOLDS, NOTE_TONNES_PER_HOUSEHOLD);

export function inr(n: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function tonnes(n: number, digits = 3): string {
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(n);
}

export function count(n: number): string {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);
}

export const JUDGMENT_TEXT = `Judgment on the note about VMR0015 and a drum-water business

I will not sign that note. It takes a real policy result and multiplies it by a household yield this sample does not produce, then treats a Guardian test mint as a Verra credit I can sell.

What holds
- Pull request 6164 on hashgraph/guardian is open. It is not merged. It was last updated on 23 October 2026. When I checked, it had no review comments. "In code review" is not the same as accepted, and it is not the same as paid.
- The public package is policy v3.1. The sample run is ex-ante 1,666.620262475 t CO2e, ex-post 1,556.947181413 t CO2e, mint 1,556, no flags. The public integrity line is 100 percent, 13 of 13 documents.
- A later dry-run, after the recording was repaired, finished both templates at 15 documents and 1,556 tokens. That run rejects an overlapping 2027 monitoring report and accepts an adjacent 2028 report. Those 15-document tests are not in the GitHub file. I will not tell a reviewer the public package is 15 of 15 unless I choose to update the pull request.
- The v3.2 fNRB range check is a backup. The file under review is v3.1, unless a reviewer asks.
- Nazava (Gold Standard GS4290) is a useful check. The engine reproduced the published arithmetic at about 28,880 t. Under VMR0015 the same data earn 0, because 11.29 percent of filters failed E. coli, over the 10 percent limit. VCS 3599 is not a target. No VMR0015 project is registered yet.

What does not hold
- "About 4 to 5 tonnes per family per year" is not this sample. Four sections of 750 households is 3,000 households. 1,556.947 divided by 3,000 is 0.519 tonnes per household per year. householdsServed is not in the equation. It is evidence for the verifier.
- At that sample rate, 50 households are about 26 tonnes, which the mint rule floors to 25, not 200. Five thousand households are about 2,595 tonnes before the floor, which the mint rule would cut to 2,594, not 20,000. The note's ₹2.54 crore gross, and the ₹1.54 crore net under it, are about eight times the sample. The ₹1,270 price was assumed. Nobody has offered it.
- The 10 percent figure is a failure threshold that can void the period. It is not a 10 percent haircut that still leaves four credits per home.
- A scan of a 20 litre drum is not a credit. The methodology needs a baseline where people boil unsafe water with wood or charcoal, a quantity of water, the cap on litres per person, the fraction who boil, fNRB, stove efficiency, leakage, and the water-quality gate. An urban delivery round does not qualify by itself.
- I am not going to put "unemployed drum-shop worker in Balurghat" into any proposal. That persona was written into the note. It is not a fact I am relying on.
- The 1,556 tokens were minted on a Guardian dry-run. They are not Verra VCUs. I cannot list them on an exchange. I cannot forward-sell 5,000 of them. Verification does not shrink to a few days because the arithmetic is in a policy. A validator still has to do the validator's job.
- I will not write to a carbon developer, or to a foundation, using this note. The pitch overstates the yield, the price, the timeline, and what the pull request is.

What I will do next
- Leave the pull request as it is until a reviewer writes, or until I decide the 15-document recordings belong in it.
- Treat the only honest commercial line, today, as a possible technology fee for putting a real project's monitoring data into the shape this policy already checks. There is no such client yet.
- If there is ever a field pilot, it starts with a baseline survey. Not with fifty jars and a revenue table.
- Use the desk beside this judgment. It scales households at 0.519 tonnes, and it shows the note's 4 tonne figure next to that so the two cannot be confused.
`;
