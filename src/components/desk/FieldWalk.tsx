import { compressPhoto, ruleGap, type Visit } from "@/lib/desk/field";
import { useEffect, useState } from "react";

type Draft = Pick<Visit, "house" | "boil" | "fuel" | "water" | "publicPipe" | "shape" | "treatment" | "sealed" | "photo">;

const EMPTY: Draft = {
  house: "",
  boil: "yes",
  fuel: "wood",
  water: "untested",
  publicPipe: "unknown",
  shape: "unset",
  treatment: "unknown",
  sealed: "no",
  photo: "",
};

function stepsFor(draft: Draft): string[] {
  return [
    "house",
    "pipe",
    "boil",
    ...(draft.boil === "yes" ? ["fuel"] : []),
    "shape",
    "treat",
    ...(draft.shape === "kiosk" ? ["seal"] : []),
    "test",
    "photo",
    "review",
  ];
}

export function FieldWalk({
  locked,
  onSave,
  saved,
  ready,
}: {
  locked: boolean;
  onSave: (draft: Draft) => void;
  saved: number;
  ready: number;
}) {
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [step, setStep] = useState("house");
  const [shot, setShot] = useState("");
  const [busy, setBusy] = useState(false);
  const [shown, setShown] = useState(false);
  useEffect(() => setShown(true), []);
  const steps = stepsFor(draft);
  const index = Math.max(0, steps.indexOf(step));
  const gap = ruleGap({ ...draft, photo: shot, id: "draft", takenAt: "", status: "in" });

  function go(next: string, patch?: Partial<Draft>) {
    const merged = { ...draft, ...patch };
    setDraft(merged);
    const list = stepsFor(merged);
    setStep(list.includes(next) ? next : list[list.length - 1]);
  }

  function back() {
    setStep(steps[Math.max(0, index - 1)]);
  }

  if (!shown) {
    return <p className="mt-6 text-sm text-quiet">Opening the visit.</p>;
  }

  if (locked) {
    return <p className="border border-rule bg-sheet p-4 text-sm">This description is locked. New houses wait until it is taken back.</p>;
  }

  return (
    <section className="mt-6">
      <div className="flex items-baseline justify-between text-xs tracking-wide text-quiet uppercase">
        <span>
          {index + 1} of {steps.length}
        </span>
        <button type="button" onClick={back} disabled={index === 0} className="min-h-11 px-2 disabled:opacity-30">
          Back
        </button>
      </div>
      <div key={step} className="step-in mt-2 space-y-3">
        {step === "house" ? (
          <>
            <h2 className="font-serif text-3xl leading-tight">Which house?</h2>
            <input
              value={draft.house}
              onChange={(event) => setDraft({ ...draft, house: event.target.value })}
              placeholder="Lane and house"
              className="min-h-12 w-full border border-rule bg-sheet px-3"
            />
            <button type="button" disabled={!draft.house.trim()} onClick={() => go("pipe")} className="min-h-12 w-full bg-ink font-medium text-paper disabled:opacity-40">
              Continue
            </button>
          </>
        ) : null}
        {step === "pipe" ? (
          <>
            <h2 className="font-serif text-3xl leading-tight">Is there already a public safe-water pipe?</h2>
            <button type="button" onClick={() => go("boil", { publicPipe: "no" })} className="min-h-14 w-full border border-rule bg-sheet px-4 text-left font-medium">
              No
            </button>
            <button type="button" onClick={() => go("boil", { publicPipe: "yes" })} className="min-h-14 w-full border border-rule bg-sheet px-4 text-left font-medium">
              Yes. This house cannot count.
            </button>
          </>
        ) : null}
        {step === "boil" ? (
          <>
            <h2 className="font-serif text-3xl leading-tight">Do they boil drinking water?</h2>
            <button type="button" onClick={() => go("fuel", { boil: "yes" })} className="min-h-14 w-full border border-rule bg-sheet px-4 text-left font-medium">
              Yes
            </button>
            <button type="button" onClick={() => go("shape", { boil: "no", fuel: "none" })} className="min-h-14 w-full border border-rule bg-sheet px-4 text-left font-medium">
              No. This house cannot count.
            </button>
          </>
        ) : null}
        {step === "fuel" ? (
          <>
            <h2 className="font-serif text-3xl leading-tight">What do they burn?</h2>
            {(
              [
                ["wood", "Wood"],
                ["charcoal", "Charcoal"],
                ["gas", "Gas. This house cannot count."],
              ] as const
            ).map(([value, label]) => (
              <button key={value} type="button" onClick={() => go("shape", { fuel: value })} className="min-h-14 w-full border border-rule bg-sheet px-4 text-left font-medium">
                {label}
              </button>
            ))}
          </>
        ) : null}
        {step === "shape" ? (
          <>
            <h2 className="font-serif text-3xl leading-tight">How does the safe water arrive?</h2>
            <button type="button" onClick={() => go("treat", { shape: "kiosk" })} className="min-h-14 w-full border border-rule bg-sheet px-4 text-left font-medium">
              Drum from a treatment point
            </button>
            <button type="button" onClick={() => go("treat", { shape: "house", sealed: "no" })} className="min-h-14 w-full border border-rule bg-sheet px-4 text-left font-medium">
              Filter in the house
            </button>
          </>
        ) : null}
        {step === "treat" ? (
          <>
            <h2 className="font-serif text-3xl leading-tight">What treats the water?</h2>
            {(draft.shape === "house"
              ? [
                  ["membrane", "Membrane filter"],
                  ["ceramic", "Ceramic filter"],
                  ["chlorine", "Chlorine"],
                  ["flocculant", "Flocculant and disinfectant"],
                  ["solar", "Solar disinfection"],
                  ["other", "Something else. Cannot count."],
                ]
              : [
                  ["chlorine", "Chlorine"],
                  ["flocculant", "Flocculant and disinfectant"],
                  ["solar", "Solar disinfection"],
                  ["other", "Something else. Cannot count."],
                ]
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => go(draft.shape === "kiosk" ? "seal" : "test", { treatment: value as Draft["treatment"] })}
                className="min-h-14 w-full border border-rule bg-sheet px-4 text-left font-medium"
              >
                {label}
              </button>
            ))}
          </>
        ) : null}
        {step === "seal" ? (
          <>
            <h2 className="font-serif text-3xl leading-tight">Is the drum sealed, or is disinfectant still in the water?</h2>
            <button type="button" onClick={() => go("test", { sealed: "yes" })} className="min-h-14 w-full border border-rule bg-sheet px-4 text-left font-medium">
              Yes
            </button>
            <button type="button" onClick={() => go("test", { sealed: "no" })} className="min-h-14 w-full border border-rule bg-sheet px-4 text-left font-medium">
              No. This drum cannot count.
            </button>
          </>
        ) : null}
        {step === "test" ? (
          <>
            <h2 className="font-serif text-3xl leading-tight">Did the water test pass?</h2>
            <button type="button" onClick={() => go("photo", { water: "pass" })} className="min-h-14 w-full border border-rule bg-sheet px-4 text-left font-medium">
              Passed, safe
            </button>
            <button type="button" onClick={() => go("photo", { water: "fail" })} className="min-h-14 w-full border border-rule bg-sheet px-4 text-left font-medium">
              Failed
            </button>
            <button type="button" onClick={() => go("photo", { water: "untested" })} className="min-h-14 w-full border border-rule bg-sheet px-4 text-left font-medium">
              Not tested
            </button>
          </>
        ) : null}
        {step === "photo" ? (
          <>
            <h2 className="font-serif text-3xl leading-tight">Photograph the drum or the filter.</h2>
            <label className="flex min-h-14 cursor-pointer items-center justify-center border border-rule bg-sheet font-medium">
              {busy ? "Reading photo…" : shot ? "Photo ready. Tap to replace." : "Take the photo"}
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  setBusy(true);
                  void compressPhoto(file)
                    .then((value) => setShot(value))
                    .finally(() => setBusy(false));
                }}
              />
            </label>
            {shot ? <img src={shot} alt="System at the house" className="max-h-56 w-full border border-rule object-cover" /> : null}
            <button type="button" disabled={!shot || busy} onClick={() => go("review")} className="min-h-12 w-full bg-ink font-medium text-paper disabled:opacity-40">
              Review
            </button>
          </>
        ) : null}
        {step === "review" ? (
          <>
            <h2 className="font-serif text-3xl leading-tight">{draft.house}</h2>
            <p className="text-sm leading-relaxed">{gap ? gap : "This house can be accepted into a project description. A checker still has to accept it."}</p>
            {shot ? <img src={shot} alt="" className="max-h-40 w-full border border-rule object-cover" /> : null}
            <button
              type="button"
              onClick={() => {
                onSave({ ...draft, photo: shot });
                setDraft(EMPTY);
                setShot("");
                setStep("house");
              }}
              className="min-h-12 w-full bg-ink font-medium text-paper"
            >
              Save this house
            </button>
          </>
        ) : null}
      </div>
      <p className="mt-6 text-sm text-quiet">
        {saved} houses on this phone. {ready} can enter a description.
      </p>
    </section>
  );
}
