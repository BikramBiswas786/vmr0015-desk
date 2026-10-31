import { CHAIN, CHECKED, DIGITISED, FILES, POLICY } from "@/lib/desk/policy";
import type { DeskState } from "@/lib/desk/store";

export function PolicyPanel({ patch }: { patch: (partial: Partial<DeskState>) => void }) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-xs font-medium tracking-widest text-seal uppercase">Checked {CHECKED}</p>
        <h2 className="mt-2 font-serif text-3xl leading-tight">The policy, as filed</h2>
        <p className="mt-2 text-sm leading-relaxed text-quiet">
          Pull request {POLICY.pr} is {POLICY.state}. It is not merged. Last update {POLICY.updated}. No review was on it. This phone is not logged into Guardian. The numbers are the dry-run in that file.
        </p>
      </div>

      <dl className="border border-rule bg-sheet text-sm">
        {[
          ["Submission", `${POLICY.submission}. ${POLICY.backup} is a backup.`],
          ["Method", `${POLICY.method}, revision of ${POLICY.parent}`],
          ["Ex-ante", `${POLICY.exAnte} t a year`],
          ["Ex-post", `${POLICY.exPost} t`],
          ["Mint", `${POLICY.mint}, about ${POLICY.perHouse} t a house`],
          ["Guardian test", POLICY.guardianTest],
        ].map(([label, value]) => (
          <div key={label} className="grid grid-cols-[7rem_1fr] gap-2 border-b border-rule px-3 py-2 last:border-b-0">
            <dt className="text-quiet">{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>

      <section>
        <h3 className="font-serif text-xl">Two files</h3>
        <ul className="mt-2 space-y-3 text-sm leading-relaxed">
          {FILES.map((file) => (
            <li key={file.id} className="border-t border-rule pt-2">
              <p className="font-medium">v5.0{file.id}</p>
              <p>{file.when}</p>
              <p className="mt-1 break-all text-quiet">{file.sha}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="font-serif text-xl">What Guardian runs</h3>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm leading-relaxed">
          {CHAIN.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <section>
        <h3 className="font-serif text-xl">What the sum includes</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed">
          {DIGITISED.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </section>

      <p className="border border-rule bg-sheet px-3 py-3 text-sm leading-relaxed">
        <span className="font-medium text-seal">Not this. </span>
        {POLICY.blocks} blocks and {POLICY.mathBlocks} math blocks do not make a registered project. The mint is not a serial Verra has written.
      </p>

      <button
        type="button"
        onClick={() => patch({ tab: "send", letterKind: "verra" })}
        className="min-h-12 bg-ink text-sm font-medium text-paper"
      >
        Open the packet to send
      </button>
      <a href={POLICY.prUrl} className="text-sm underline">
        The pull request
      </a>
    </div>
  );
}
