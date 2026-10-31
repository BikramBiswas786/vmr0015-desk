import { companyPacket, FILES, GUARDIAN_URL, POLICY, verraPacket } from "@/lib/desk/policy";
import { readDeskLink, type DeskLink } from "@/lib/desk/link";
import { PARTNERS } from "@/lib/desk/partners";
import { useEffect, useState } from "react";

const STEPS = [
  "Accounts for the proponent and the checker.",
  "Project description, then the ex-ante sum.",
  "Validation, then the registry may register that project.",
  "Monitoring report. Overlapping dates are refused. The ex-post sum runs.",
  "Verification, then one request, then one mint of the smaller sum.",
];

export function OneDesk() {
  const [link, setLink] = useState<DeskLink>({ policyOnFile: true, pr: "open", error: "" });
  const [copied, setCopied] = useState("");
  const [setId, setSetId] = useState<"A" | "B">("A");
  const chosen = FILES.find((file) => file.version === "v3.1" && file.id === setId) ?? FILES[0];
  const backup = FILES.find((file) => file.version === "v3.2" && file.id === setId);

  useEffect(() => {
    let live = true;
    readDeskLink()
      .then((next) => {
        if (live) setLink(next);
      })
      .catch(() => {
        if (live) setLink({ policyOnFile: false, pr: "unknown", error: "The file could not be read just now." });
      });
    return () => {
      live = false;
    };
  }, []);

  const liveLine = liveSentence(link);

  async function copy(kind: "verra" | "company") {
    const base = kind === "verra" ? verraPacket() : companyPacket(PARTNERS[0], "");
    const text = link && !link.error ? `${base}\n\nRead again just now: ${liveLine}` : base;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
    } catch {
      setCopied("");
    }
  }

  return (
    <div className="min-h-dvh bg-ink text-ink">
      <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col bg-paper px-5 pt-6 pb-10">
        <p className="text-xs font-medium tracking-widest text-seal uppercase">One page · not a filing</p>
        <h1 className="mt-2 font-serif text-3xl leading-none">VMR0015 Desk</h1>
        <p className="mt-3 text-sm leading-relaxed text-quiet">{liveLine}</p>

        <dl className="mt-5 border border-rule bg-sheet text-sm">
          {[
            ["Policy", `${POLICY.submission} on pull request ${POLICY.pr}`],
            ["Guardian dry-run", `${POLICY.exAnte} t, then ${POLICY.exPost} t`],
            ["Mint in that file", `${POLICY.mint}. Not a Verra serial.`],
          ].map(([label, value]) => (
            <div key={label} className="grid grid-cols-[7.5rem_1fr] gap-2 border-b border-rule px-3 py-3 last:border-b-0">
              <dt className="text-quiet">{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>

        <section className="mt-5">
          <h2 className="font-serif text-2xl">Import into Guardian</h2>
          <p className="mt-2 text-sm leading-relaxed text-quiet">
            These are the four files you added. The hashes match the pull request. Import v3.1. v3.2 is the backup.
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setSetId("A")}
              className={setId === "A" ? "min-h-12 bg-ink px-2 text-sm text-paper" : "min-h-12 border border-rule bg-sheet px-2 text-sm"}
            >
              Before 2027
            </button>
            <button
              type="button"
              onClick={() => setSetId("B")}
              className={setId === "B" ? "min-h-12 bg-ink px-2 text-sm text-paper" : "min-h-12 border border-rule bg-sheet px-2 text-sm"}
            >
              From 2027
            </button>
          </div>
          <p className="mt-3 text-sm leading-relaxed">
            <span className="font-medium">{chosen.guardianName}.</span> {chosen.when}. {chosen.size}. Hash matches.
          </p>
          <div className="mt-3 grid grid-cols-1 gap-2">
            <a href={chosen.href} download={chosen.name} className="flex min-h-12 items-center justify-center bg-ink px-3 text-sm font-medium text-paper">
              Download v3.1 {chosen.id}
            </a>
            <a
              href={GUARDIAN_URL}
              target="_blank"
              rel="noreferrer"
              className="flex min-h-12 items-center justify-center border border-rule bg-sheet px-3 text-sm"
            >
              Open Guardian
            </a>
          </div>
          <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm leading-relaxed">
            <li>Download the file above.</li>
            <li>In Guardian, open Manage Policies and import that file.</li>
            <li>Start a dry run, then run the integrity test. Expect 100 percent. Do not mint from this page.</li>
          </ol>
          {backup ? (
            <p className="mt-3 text-sm">
              <a className="underline" href={backup.href} download={backup.name}>
                Backup v3.2 {backup.id}
              </a>
              <span className="text-quiet"> · {backup.size} · only if a reviewer asks</span>
            </p>
          ) : null}
        </section>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button type="button" onClick={() => copy("verra")} className="min-h-12 bg-ink px-2 text-sm font-medium text-paper">
            {copied === "verra" ? "Copied" : "Copy for Verra"}
          </button>
          <button
            type="button"
            onClick={() => copy("company")}
            className="min-h-12 border border-rule bg-sheet px-2 text-sm"
          >
            {copied === "company" ? "Copied" : "Copy for Drinkwell"}
          </button>
        </div>
        <p className="mt-2 text-sm text-quiet">Put your name on the blank line. Do not add a district or a price.</p>

        <section className="mt-8">
          <h2 className="font-serif text-2xl">All four files</h2>
          <ul className="mt-3 space-y-3 text-sm leading-relaxed">
            {FILES.map((file) => (
              <li key={file.href} className="border-t border-rule pt-3">
                <p className="font-medium">
                  {file.version} · v5.0{file.id}
                  {file.importThis ? " · import this" : " · backup"}
                </p>
                <p>{file.when}</p>
                <p className="mt-1 break-all text-quiet">{file.sha}</p>
                <a className="mt-1 inline-block underline" href={file.href} download={file.name}>
                  Download
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="font-serif text-2xl">What Guardian runs</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed">
            {STEPS.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <p className="mt-3 text-sm leading-relaxed text-quiet">
            Those steps are inside the policy file. This page reads that file. It does not log into Guardian, and it does not mint.
          </p>
        </section>

        <p className="mt-8 border border-rule bg-sheet px-3 py-3 text-sm leading-relaxed">
          <a className="underline" href={POLICY.prUrl}>
            Pull request {POLICY.pr}
          </a>
          . Open is not accepted. The dry-run was {POLICY.guardianTest}. About {POLICY.perHouse} t a household in the sample, not 4.
        </p>
      </div>
    </div>
  );
}

function liveSentence(link: DeskLink | null): string {
  if (!link) return "Reading pull request 6164 and the v3.1 policy file.";
  if (link.error && !link.policyOnFile && link.pr === "unknown") {
    return `Could not read GitHub just now. Last check: pull request ${POLICY.pr} was open on ${POLICY.updated}, and the Guardian dry-run is in that file.`;
  }
  const pr =
    link.pr === "open"
      ? `Pull request ${POLICY.pr} is open and not merged.`
      : link.pr === "merged"
        ? `Pull request ${POLICY.pr} is merged.`
        : link.pr === "closed"
          ? `Pull request ${POLICY.pr} is closed.`
          : `Pull request ${POLICY.pr} did not show a status just now.`;
  const file = link.policyOnFile
    ? "The v3.1 policy file is on that branch, and the Guardian dry-run below is the one stored in it."
    : "The v3.1 heading was not in the file just read.";
  return `${pr} ${file}`;
}
