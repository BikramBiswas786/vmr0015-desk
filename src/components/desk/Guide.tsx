type Go = "home" | "field" | "checker" | "developer" | "guardian" | "verra" | "registry" | "issue" | "markets";

const STEPS: { title: string; body: string; go: Go; action: string }[] = [
  { title: "Files", body: "Download one policy file. A before 1 January 2027, B on or after that date.", go: "home", action: "Open Files" },
  { title: "Houses", body: "The person at the door answers the visit. One question, then a photo.", go: "field", action: "Open Houses" },
  { title: "Check", body: "A second person accepts the photo, or sends it back. After a lock, this page is the VVB’s opinion.", go: "checker", action: "Open Check" },
  { title: "Describe", body: "Seven applicability answers, then a lock. No calculation on this page.", go: "developer", action: "Open Describe" },
  { title: "Guardian", body: "Import the file in Guardian and paste the rows. This page only asks a Guardian you already run. There is no saved login.", go: "guardian", action: "Open Guardian" },
  { title: "Verra", body: "Copy the request and submit it yourself on the Project Hub.", go: "verra", action: "Open Verra" },
  { title: "Registry", body: "Look up a public project or serial. This demo has neither.", go: "registry", action: "Open Registry" },
  { title: "Issue", body: "Deposit stays closed. Verra deposits the serial on the registry, not here.", go: "issue", action: "Open Issue" },
  { title: "Markets", body: "Which method can describe these houses. Nothing is listed for sale.", go: "markets", action: "Open Markets" },
];

export function Guide({ onGo, onDemo }: { onGo: (next: Go) => void; onDemo: () => void }) {
  return (
    <article className="max-w-xl">
      <p className="text-xs tracking-widest text-quiet uppercase">How to use this</p>
      <h1 className="mt-2 font-serif text-4xl leading-none">Guide</h1>
      <p className="mt-4 text-sm leading-relaxed">
        Each page does one job. Load the demo, then open the pages in order and read only that page.
      </p>
      <button type="button" onClick={onDemo} className="mt-4 min-h-12 bg-ink px-4 font-medium text-paper">
        Load the Balurghat demo
      </button>
      <ol className="mt-8 space-y-6">
        {STEPS.map((step, index) => (
          <li key={step.title} className="border-t border-rule pt-4">
            <p className="font-serif text-xl">
              {index + 1}. {step.title}
            </p>
            <p className="mt-2 text-sm leading-relaxed">{step.body}</p>
            <button type="button" onClick={() => onGo(step.go)} className="mt-3 min-h-11 border border-rule bg-sheet px-3 text-sm">
              {step.action}
            </button>
          </li>
        ))}
      </ol>
    </article>
  );
}