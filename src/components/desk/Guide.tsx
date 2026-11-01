type Go = "home" | "field" | "checker" | "developer" | "guardian" | "verra" | "issue" | "markets";

const STEPS: { title: string; who: string; body: string; go?: Go; action?: string }[] = [
  {
    title: "Download one policy file",
    who: "The project developer",
    body: "Open Files. Start date before 1 January 2027: download v3.1 A. On or after that date: download v3.1 B. v3.2 is a backup. Do not import both A and B for the same project.",
    go: "home",
    action: "Open Files",
  },
  {
    title: "Import that file in Guardian",
    who: "The project developer",
    body: "This phone cannot import it. In Managed Guardian Service, open Manage Policies and import the file. Guardian then has two roles, Project Proponent and VVB. The calculation lives in Guardian’s two math blocks, not on this phone.",
    go: "guardian",
    action: "Open Guardian",
  },
  {
    title: "Walk the house",
    who: "The drum boy, or whoever is at the door",
    body: "Open Houses. One question at a time. No equation. How many people. Is there already a public safe-water pipe. Do they boil. Wood or charcoal, or not. Is an improved stove doing the boiling. House filter or drum. What treats the water. Did the water test pass. Take a photo. A failed house is kept and cannot be locked.",
    go: "field",
    action: "Open Houses",
  },
  {
    title: "A second person looks at the photo",
    who: "Not the person who took it",
    body: "Open Check while houses are still being collected. Accept only when every answer passes. Send it back if the pipe is already there, the fuel is gas, the test failed, or the photo is missing. This is not the VVB yet.",
    go: "checker",
    action: "Open Check",
  },
  {
    title: "Answer the seven applicability questions",
    who: "The project developer",
    body: "Open Describe. The questions are the ones in the policy, in ordinary words. One Not met, or a REDD+ answer of Not assessed, voids the calculation inside Guardian. The project name can be locked only after all seven pass. You do not multiply anything.",
    go: "developer",
    action: "Open Describe",
  },
  {
    title: "Type the same facts into Guardian",
    who: "The project developer",
    body: "Guardian’s project description is the long form. Copy the locked houses into the survey rows: people, boiling, stove, no public network, the device. Guardian’s math block computes the tonnes from those rows. This phone’s 0.519 figure is the old test sample. It is not this project’s result.",
    go: "guardian",
    action: "Open Guardian",
  },
  {
    title: "The VVB gives an opinion",
    who: "An approved validation and verification body",
    body: "After the description is locked, Check is the VVB’s screen. Validated, or send it back. Later, a positive verification opinion. The project developer does not validate their own project. The opinion is not Verra’s approval.",
    go: "checker",
    action: "Open Check",
  },
  {
    title: "Ask Verra, and stop",
    who: "The project proponent asks. Verra decides.",
    body: "Open Issue. Copy the registration request and submit it yourself on the Verra registry, with the fee. Verra reviews it. Only after Verra approves a verification does Verra deposit VCUs and create the serials. Deposit on this phone stays closed. Offers cannot assign tonnes.",
    go: "issue",
    action: "Open Issue",
  },
];

export function Guide({ onGo }: { onGo: (next: Go) => void }) {
  return (
    <article className="max-w-xl">
      <p className="text-xs tracking-widest text-quiet uppercase">How to use this</p>
      <h1 className="mt-2 font-serif text-4xl leading-none">Guide</h1>
      <p className="mt-4 text-sm leading-relaxed">
        Guardian already runs the policy. This phone does not replace it. It is the walk for the person who will never open Guardian, and the checklist that stops a bad house before anyone touches the equation.
      </p>

      <h2 className="mt-8 font-serif text-2xl">Who calculates</h2>
      <p className="mt-2 text-sm leading-relaxed">
        Not the drum boy. Not a new developer. Guardian’s math block does it, from the survey rows, after the seven applicability answers pass. Verra does not calculate either. Verra checks the VVB’s report and, if it approves, deposits the serials.
      </p>

      <ol className="mt-8 space-y-6">
        {STEPS.map((step, index) => (
          <li key={step.title} className="border-t border-rule pt-4">
            <p className="font-serif text-xl">
              {index + 1}. {step.title}
            </p>
            <p className="mt-1 text-sm text-quiet">{step.who}</p>
            <p className="mt-2 text-sm leading-relaxed">{step.body}</p>
            {step.go && step.action ? (
              <button type="button" onClick={() => onGo(step.go as Go)} className="mt-3 min-h-11 border border-rule bg-sheet px-3 text-sm">
                {step.action}
              </button>
            ) : null}
          </li>
        ))}
      </ol>
    </article>
  );
}
