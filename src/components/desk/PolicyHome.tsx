import { CHAIN, FILES } from "@/lib/desk/policy";
import { useState } from "react";

const IMPORTS = FILES.filter((file) => file.importThis);
const BACKUPS = FILES.filter((file) => !file.importThis);

export function PolicyHome({ onWork }: { onWork: () => void }) {
  const [copied, setCopied] = useState("");

  async function copy(sha: string) {
    try {
      await navigator.clipboard.writeText(sha);
      setCopied(sha);
    } catch {
      setCopied("");
    }
  }

  return (
    <div className="mt-6 space-y-8">
      <header>
        <p className="text-xs tracking-widest text-quiet uppercase">Guardian policy</p>
        <h1 className="mt-2 font-serif text-4xl leading-none">VMR0015</h1>
        <p className="mt-3 font-serif text-2xl leading-snug">Safe drinking water.</p>
        <p className="mt-4 text-sm leading-relaxed">
          Verra VMR0015 v1.0, the revision of AMS-III.AV, exported as a Hedera Guardian file. Import it in Guardian. This page does not register a project, and it does not sell a credit.
        </p>
      </header>

      <section>
        <h2 className="font-serif text-2xl">Import one of these</h2>
        <p className="mt-2 text-sm text-quiet">v3.1 is the file to import. Choose A or B by the project start date.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {IMPORTS.map((file) => (
            <article key={file.href} className="flex flex-col border border-rule bg-sheet p-4">
              <p className="text-xs tracking-widest text-quiet uppercase">
                {file.version} {file.id}
              </p>
              <h3 className="mt-2 font-serif text-2xl leading-tight">{file.when}</h3>
              <p className="mt-3 text-sm leading-relaxed">{file.guardianName}</p>
              <p className="mt-3 font-mono text-xs text-quiet">
                {file.sha.slice(0, 16)}…{file.sha.slice(-8)}
              </p>
              <button type="button" onClick={() => copy(file.sha)} className="mt-2 min-h-11 text-left text-sm">
                {copied === file.sha ? "Hash copied." : "Copy the full hash"}
              </button>
              <a href={file.href} download className="mt-4 flex min-h-12 items-center justify-center bg-ink px-3 font-medium text-paper">
                Download
              </a>
            </article>
          ))}
        </div>
        <ul className="mt-4 space-y-2 text-sm">
          {BACKUPS.map((file) => (
            <li key={file.href}>
              <a href={file.href} download className="underline">
                {file.version} {file.id}
              </a>
              <span className="text-quiet">. {file.when}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-serif text-2xl">The order inside the file</h2>
        <ol className="mt-4 space-y-3">
          {CHAIN.map((step, index) => (
            <li key={step} className="grid grid-cols-[2rem_1fr] gap-3 text-sm leading-relaxed">
              <span className="font-serif text-xl leading-none">{index + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="border border-rule p-4">
        <h2 className="font-serif text-2xl">Record the houses</h2>
        <p className="mt-2 text-sm leading-relaxed">
          The working desk keeps a house-by-house note for a project description. Guardian still has to run the imported file. A note here is not a VCU.
        </p>
        <button type="button" onClick={onWork} className="mt-4 min-h-12 w-full bg-ink font-medium text-paper">
          Open the working desk
        </button>
      </section>
    </div>
  );
}
