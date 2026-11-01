type Go = "home" | "field" | "checker" | "developer" | "guardian" | "verra" | "markets";

const STEPS: { title: string; body: string; go?: Go; action?: string }[] = [
  {
    title: "Download the right file",
    body: "Open Files. If the project starts before 1 January 2027, download v3.1 A. If it starts on or after that date, download v3.1 B. v3.2 is a backup. Do not import both A and B for the same project.",
    go: "home",
    action: "Open Files",
  },
  {
    title: "Import it in Guardian",
    body: "This app cannot import the file for you. Open Managed Guardian Service, choose Manage Policies, and import the file you downloaded. Guardian then shows two roles: Project Proponent and VVB. The registry owns the policy. Ask Guardian to list policies only after you have an address and a token.",
    go: "guardian",
    action: "Open Guardian",
  },
  {
    title: "Record each house",
    body: "Open Houses. Answer one question at a time. The house must boil drinking water with wood or charcoal. There must be no public safe-water pipe already there. The water test must pass, and there must be a photo. A drum counts only if the treatment point uses chlorine, a flocculant powder, or solar, and the drum is sealed or the disinfectant is still in the water. A house that fails is kept, but it cannot enter a description.",
    go: "field",
    action: "Open Houses",
  },
  {
    title: "Someone else checks the house",
    body: "Open Check. Accept a house only when every rule passes. Do not accept your own photo just because it exists. Send it back if the test failed, the fuel is gas, or a public pipe is already there.",
    go: "checker",
    action: "Open Check",
  },
  {
    title: "Lock one project description",
    body: "Open Describe. Name the project and the treatment point the drums leave from. Lock only the accepted houses. That lock is a description for VMR0015. It is not a Verra serial, and it is not an Indian certificate.",
    go: "developer",
    action: "Open Describe",
  },
  {
    title: "Send the packet, do not sell",
    body: "Open Verra to copy the packet. Verra’s Project Hub is a different website. This app does not submit it. A buyer can write an offer only after a checker verifies monitoring, and that offer is a note. No money moves. A sale needs a serial Verra has already issued.",
    go: "verra",
    action: "Open Verra",
  },
];

export function Guide({ onGo }: { onGo: (next: Go) => void }) {
  return (
    <article className="max-w-xl">
      <p className="text-xs tracking-widest text-quiet uppercase">How to use this</p>
      <h1 className="mt-2 font-serif text-4xl leading-none">Guide</h1>
      <p className="mt-4 text-sm leading-relaxed">
        This is a desk for one Verra method: safe drinking water that replaces boiling with wood. Anyone can read it. It does not make you the owner of a district, and it does not pay you.
      </p>

      <h2 className="mt-8 font-serif text-2xl">What you are looking at</h2>
      <p className="mt-2 text-sm leading-relaxed">
        The left side is the whole app. Pick a heading. The page on the right changes. You do not have to understand carbon markets to start. Follow the six steps below, in order.
      </p>

      <h2 className="mt-8 font-serif text-2xl">What this app will not do</h2>
      <ul className="mt-3 space-y-2 text-sm leading-relaxed">
        <li>It will not register a project with Verra.</li>
        <li>It will not mint a credit. Guardian does that only after the imported file reaches issuance, and only on a Guardian server.</li>
        <li>It will not sell a tonne. India’s carbon-certificate market is for industrial plants, and safe drinking water is not on that list.</li>
        <li>The same house cannot be counted on Verra and on the Indian market.</li>
      </ul>

      <h2 className="mt-8 font-serif text-2xl">Who does what</h2>
      <ul className="mt-3 space-y-2 text-sm leading-relaxed">
        <li>The person at the house takes the photo and answers the questions.</li>
        <li>A different person checks the answers.</li>
        <li>The project developer locks those houses into one description.</li>
        <li>A verifier, inside Guardian, writes the validation and verification reports.</li>
        <li>Verra, outside this app, decides whether to issue a serial.</li>
      </ul>

      <ol className="mt-8 space-y-6">
        {STEPS.map((step, index) => (
          <li key={step.title} className="border-t border-rule pt-4">
            <p className="font-serif text-xl">
              {index + 1}. {step.title}
            </p>
            <p className="mt-2 text-sm leading-relaxed">{step.body}</p>
            {step.go && step.action ? (
              <button type="button" onClick={() => onGo(step.go as Go)} className="mt-3 min-h-11 border border-rule bg-sheet px-3 text-sm">
                {step.action}
              </button>
            ) : null}
          </li>
        ))}
      </ol>

      <h2 className="mt-8 font-serif text-2xl">If you are stuck</h2>
      <p className="mt-2 text-sm leading-relaxed">
        A house that says it cannot count is working correctly. Change the answer only if the fact was wrong. Markets explains why listing stays closed. Notes is the longer paper, if a reviewer asks for it.
      </p>
      <button type="button" onClick={() => onGo("markets")} className="mt-3 min-h-11 border border-rule bg-sheet px-3 text-sm">
        Open Markets
      </button>
    </article>
  );
}
