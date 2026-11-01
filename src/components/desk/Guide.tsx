type Go = "home" | "field" | "checker" | "developer" | "guardian" | "verra" | "issue" | "markets";

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
    title: "Issue the tonnes",
    body: "Open Issue after the monitoring note is verified. Each house that passed counts at the policy rate, 0.519 tonnes. The file mints whole tonnes, one report. When the sum reaches 1, issue it, then record the buyer under Offers. Policy file: waiting for library approval.",
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
        This desk runs one Verra method from the house to the issued tonnes: safe drinking water that replaces boiling with wood. Follow the steps on the left, in order.
      </p>

      <h2 className="mt-8 font-serif text-2xl">Policy status</h2>
      <p className="mt-2 text-sm leading-relaxed">
        The policy file is waiting for library approval. This desk already treats it as the rule. A house that passes is counted. A verified monitoring report can be issued as whole tonnes. The same house is not also claimed on India’s plant-certificate market.
      </p>

      <h2 className="mt-8 font-serif text-2xl">Who does what</h2>
      <ul className="mt-3 space-y-2 text-sm leading-relaxed">
        <li>The person at the house takes the photo and answers the questions.</li>
        <li>A different person checks the answers.</li>
        <li>The project developer locks those houses into one description.</li>
        <li>Issue writes the whole tonnes once the sum reaches 1.</li>
        <li>Offers records who is taking those tonnes.</li>
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
