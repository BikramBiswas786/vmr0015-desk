import { countsTowardSample, ruleGap, rulePass, useVisits, type Visit } from "@/lib/desk/field";
import { FieldWalk } from "@/components/desk/FieldWalk";
import { FILES, GUARDIAN_URL, POLICY, policyIssue } from "@/lib/desk/policy";
import { chainHash, lockedVisits, STAGE_LINE, useWork, type Stage } from "@/lib/desk/work";
import { criteriaPass } from "@/lib/desk/criteria";
import { Criteria } from "@/components/desk/Criteria";
import { Markets } from "@/components/desk/Markets";
import { Guide } from "@/components/desk/Guide";
import { PolicyHome } from "@/components/desk/PolicyHome";
import { Paper } from "@/components/desk/Paper";
import { SectionBrief } from "@/components/desk/SectionBrief";
import { useState } from "react";

const RATE = Number(POLICY.perHouse);

const NAV = [
  ["guide", "Guide"],
  ["home", "Files"],
  ["field", "Houses"],
  ["checker", "Check"],
  ["developer", "Describe"],
  ["guardian", "Guardian"],
  ["verra", "Verra"],
  ["issue", "Issue"],
  ["markets", "Markets"],
  ["buyer", "Offers"],
  ["paper", "Notes"],
] as const;

type Role = (typeof NAV)[number][0];

const APPS = [
  { href: GUARDIAN_URL, label: "Managed Guardian Service, where a policy is imported" },
  { href: "https://guardianservice.io/", label: "Managed Guardian Service" },
  { href: "https://dev.guardian.hedera.com/api-reference-guardian", label: "Guardian API" },
  { href: "https://github.com/hashgraph/guardian", label: "Methodology library" },
];

const RAIL = [
  ["open", "Collect"],
  ["described", "Describe"],
  ["validated", "Check"],
  ["monitoring", "Monitor"],
  ["verified", "Verify"],
  ["issued", "Issue"],
] as const;

function tonnesOf(count: number): string {
  return (count * RATE).toFixed(3);
}

export function WorkDesk() {
  const { visits, setVisits } = useVisits();
  const { work, setWork } = useWork();
  const [role, setRole] = useState<Role>("guide");
  const [name, setName] = useState("");
  const [plant, setPlant] = useState("");
  const [starts, setStarts] = useState("");
  const [setId, setSetId] = useState<"A" | "B">("A");
  const [note, setNote] = useState("");
  const [guardianUrl, setGuardianUrl] = useState("");
  const [token, setToken] = useState("");
  const [guardianNote, setGuardianNote] = useState("");
  const [copied, setCopied] = useState("");
  const [liveHash, setLiveHash] = useState("");

  const counted = visits.filter(countsTowardSample);
  const locked = lockedVisits(work, visits);
  const chainState =
    work.chain === "" ? "none" : liveHash === "" ? "pending" : liveHash === work.chain ? "match" : "break";
  const sampleTonnes = tonnesOf(work.stage === "open" ? counted.length : locked.length);

  function saveHouse(draft: Pick<Visit, "house" | "boil" | "fuel" | "water" | "publicPipe" | "shape" | "treatment" | "sealed" | "persons" | "stove" | "photo">) {
    const label = draft.house.trim();
    if (!label || !draft.photo || work.stage !== "open") return;
    const next: Visit = {
      ...draft,
      id: crypto.randomUUID(),
      house: label,
      takenAt: new Date().toISOString(),
      status: "in",
    };
    setVisits((current) => [next, ...current].slice(0, 40));
  }

  function mark(id: string, status: Visit["status"]) {
    if (work.stage !== "open") return;
    setVisits((current) => current.map((visit) => (visit.id === id ? { ...visit, status } : visit)));
  }

  async function lockDescription() {
    const title = name.trim();
    const point = plant.trim();
    if (!title || !point || counted.length === 0 || work.stage !== "open" || !criteriaPass(work.criteria)) return;
    const chosen = counted;
    const chain = await chainHash(chosen);
    setWork({
      ...work,
      name: title,
      plant: point,
      criteria: work.criteria,
      starts,
      setId,
      stage: "described",
      visitIds: chosen.map((visit) => visit.id),
      chain,
      validationNote: "",
      monitoringNote: "",
      offers: [],
    });
    setLiveHash(chain);
  }

  function takeBack() {
    setWork({ ...work, stage: "open", visitIds: [], chain: "", plant: "", validationNote: "", monitoringNote: "", issuedSum: "", issuedWhole: 0, issuedAt: "", offers: [] });
    setLiveHash("");
  }

  async function refreshHash() {
    const rows = work.visitIds.length ? visits.filter((visit) => work.visitIds.includes(visit.id)) : [];
    if (rows.length === 0) {
      setLiveHash("");
      return;
    }
    setLiveHash(await chainHash(rows));
  }

  function advance(stage: Stage, extra?: Partial<typeof work>) {
    setWork({ ...work, stage, ...extra });
  }

  async function askGuardian() {
    setGuardianNote("Asking Guardian…");
    try {
      const response = await fetch("/api/guardian", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ baseUrl: guardianUrl, token }),
      });
      const data = (await response.json()) as { message?: string; names?: string[] };
      const names = data.names?.length ? ` Policies seen: ${data.names.join(", ")}.` : "";
      setGuardianNote(`${data.message ?? "No answer."}${names}`);
    } catch {
      setGuardianNote("The app could not reach its own Guardian door.");
    } finally {
      setToken("");
    }
  }

  async function copy(kind: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
    } catch {
      setCopied("");
    }
  }

  const result = policyIssue(locked.length);

  const requestText = [
    `${work.name || "Untitled"} — VMR0015 project description. Not a Verra serial. Not a BEE certificate. Not for sale.`,
    work.plant ? `Treatment point: ${work.plant}.` : "No treatment point named.",
    `Applicability: ${criteriaPass(work.criteria) ? "the seven answers pass" : "the seven answers are missing or void the calculation"}.`,
    `Template ${work.setId}. Houses in the lock: ${work.visitIds.length}. Sample ${sampleTonnes} t at ${POLICY.perHouse} t each.`,
    work.chain ? `Chain ${work.chain}` : "No chain yet.",
    chainState === "match" ? "The houses still match that chain." : chainState === "pending" ? "The chain is still being checked." : chainState === "break" ? "The houses do not match the locked chain." : "No chain yet.",
    "",
    ...locked.map((visit, index) => `${index + 1}. ${visit.house}. ${visit.shape === "kiosk" ? "Drum from a treatment point" : "Filter in the house"}, ${visit.treatment}. No public safe-water pipe. Boils with ${visit.fuel}. Water passed. ${visit.takenAt.slice(0, 10)}.`),
  ].join("\n");

  return (
    <div className="flex min-h-dvh bg-paper text-ink">
      <nav aria-label="Sections" className="sticky top-0 flex h-dvh w-28 shrink-0 flex-col gap-1 overflow-y-auto border-r border-rule bg-sheet px-2 py-4 sm:w-44">
        <p className="px-2 pb-3 font-serif text-xl leading-tight">VMR0015</p>
        {NAV.map(([id, label]) => (
          <button
            key={id}
            type="button"
            aria-current={role === id ? "page" : undefined}
            onClick={() => {
              setRole(id);
              if (id === "guardian" || id === "buyer" || id === "verra") void refreshHash();
            }}
            className={`min-h-11 px-2 text-left text-sm ${role === id ? "bg-ink text-paper" : ""}`}
          >
            {label}
          </button>
        ))}
      </nav>
      <main className="min-w-0 flex-1 overflow-x-hidden px-4 py-6 sm:px-8">
        {role !== "guide" ? <SectionBrief role={role} onGo={setRole} /> : null}
        {role === "guide" ? <Guide onGo={(next) => setRole(next)} /> : null}
        {role === "home" ? <PolicyHome onWork={() => setRole("field")} /> : null}
        {role === "field" || role === "checker" || role === "developer" || role === "issue" ? (
          <p className="mb-2 text-sm text-quiet">
            {RAIL.find(([id]) => id === work.stage)?.[1]}. {STAGE_LINE[work.stage]}
          </p>
        ) : null}

        {role === "field" ? (
          <FieldWalk locked={work.stage !== "open"} onSave={saveHouse} saved={visits.length} ready={counted.length} />
        ) : null}

        {role === "developer" ? (
          <section className="mt-4 space-y-3 text-sm">
            <h2 className="font-serif text-3xl leading-tight">Project description</h2>
            <p>Accepted houses become one description only after the seven applicability answers pass. A Not met answer voids the calculation in the policy file. You do not approve your own work.</p>
            {work.stage === "open" ? (
              <>
                <Criteria
                  answers={work.criteria}
                  onAnswer={(id, value) => setWork({ ...work, criteria: { ...work.criteria, [id]: value } })}
                />
                {criteriaPass(work.criteria) ? (
                  <>
                <label className="block">
                  Project name
                  <input value={name} onChange={(event) => setName(event.target.value)} className="mt-1 min-h-12 w-full border border-rule bg-sheet px-3" />
                </label>
                <label className="block">
                  Treatment point
                  <input value={plant} onChange={(event) => setPlant(event.target.value)} placeholder="The small plant the drums leave from" className="mt-1 min-h-12 w-full border border-rule bg-sheet px-3" />
                </label>
                <label className="block">
                  Start date
                  <input type="date" value={starts} onChange={(event) => setStarts(event.target.value)} className="mt-1 min-h-12 w-full border border-rule bg-sheet px-3" />
                </label>
                <label className="block">
                  Policy file
                  <select value={setId} onChange={(event) => setSetId(event.target.value as "A" | "B")} className="mt-1 min-h-12 w-full border border-rule bg-sheet px-2">
                    <option value="A">v3.1 A, before 1 January 2027</option>
                    <option value="B">v3.1 B, on or after 1 January 2027</option>
                  </select>
                </label>
                <button type="button" disabled={!name.trim() || !plant.trim() || counted.length === 0} onClick={lockDescription} className="min-h-12 w-full bg-ink font-medium text-paper disabled:opacity-40">
                  Lock {counted.length} houses
                </button>
                {counted.length === 0 ? <p className="text-quiet">Nothing to lock. A house needs people, boiling with wood or charcoal that is not all done on an improved stove, no public safe-water pipe, a passed test, a photo, and an allowed treatment.</p> : null}
                  </>
                ) : null}
              </>
            ) : (
              <>
                <p className="border border-rule bg-sheet p-3">{work.name}. {work.plant}. Template {work.setId}. {work.visitIds.length} houses. Sample {sampleTonnes} t. Not issued. Not for sale.</p>
                {work.stage === "validated" ? (
                  <>
                    <label className="block">
                      Monitoring note
                      <textarea value={note} onChange={(event) => setNote(event.target.value)} className="mt-1 min-h-24 w-full border border-rule bg-sheet px-3 py-2" />
                    </label>
                    <button type="button" disabled={!note.trim()} onClick={() => advance("monitoring", { monitoringNote: note.trim() })} className="min-h-12 w-full bg-ink font-medium text-paper disabled:opacity-40">
                      Send the monitoring note
                    </button>
                  </>
                ) : null}
                {work.stage === "described" ? (
                  <button type="button" onClick={takeBack} className="min-h-12 w-full border border-rule bg-sheet">
                    Take the description back
                  </button>
                ) : null}
              </>
            )}
          </section>
        ) : null}

        {role === "checker" ? (
          <section className="mt-4 space-y-3 text-sm">
            {work.stage === "open" ? (
              <>
                <p>Accept a house only when every rule passes. A photo by itself is not enough.</p>
                {visits.length === 0 ? <p className="text-quiet">No house yet.</p> : null}
                {visits.map((visit) => {
                  const gap = ruleGap(visit);
                  const canAccept = rulePass(visit);
                  return (
                    <article key={visit.id} className="border border-rule bg-sheet p-3">
                      <img src={visit.photo} alt="" className="mb-2 max-h-36 w-full object-cover" />
                      <p className="font-medium">{visit.house}</p>
                      <p className="text-quiet">Boil {visit.boil}, {visit.fuel}, water {visit.water}. {visit.shape === "kiosk" ? "Drum" : visit.shape === "house" ? "House filter" : "Shape not set"}. {visit.status}.</p>
                      {gap ? <p className="mt-1 text-seal">{gap}</p> : null}
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <button type="button" disabled={!canAccept} onClick={() => mark(visit.id, "accepted")} className="min-h-11 bg-ink text-paper disabled:opacity-40">Accept</button>
                        <button type="button" onClick={() => mark(visit.id, "returned")} className="min-h-11 border border-rule bg-paper">Send back</button>
                      </div>
                    </article>
                  );
                })}
              </>
            ) : null}
            {work.stage === "described" ? (
              <>
                <p>This step belongs to a validation and verification body, not to the project proponent. The opinion must be Validated before a registration request can be prepared. {work.name}. {locked.length} of {work.visitIds.length} locked houses still pass.</p>
                <label className="block">
                  Validation note
                  <textarea value={note} onChange={(event) => setNote(event.target.value)} className="mt-1 min-h-24 w-full border border-rule bg-sheet px-3 py-2" />
                </label>
                <button type="button" disabled={locked.length === 0 || !criteriaPass(work.criteria)} onClick={() => advance("validated", { validationNote: note.trim() || "Validated" })} className="min-h-12 w-full bg-ink font-medium text-paper disabled:opacity-40">
                  Opinion: Validated
                </button>
                <button type="button" onClick={takeBack} className="min-h-12 w-full border border-rule bg-sheet">Opinion: not validated. Send it back</button>
              </>
            ) : null}
            {work.stage === "monitoring" ? (
              <>
                <p>This is the VVB’s verification opinion. A positive opinion is not Verra’s approval, and it does not deposit VCUs.</p>
                <p className="border border-rule bg-sheet p-3">{work.monitoringNote}</p>
                <button type="button" onClick={() => advance("verified")} className="min-h-12 w-full bg-ink font-medium text-paper">Positive verification opinion</button>
                <button type="button" onClick={() => advance("validated")} className="min-h-12 w-full border border-rule bg-sheet">Send the note back</button>
              </>
            ) : null}
            {work.stage === "validated" ? <p className="text-quiet">Waiting on the developer’s monitoring note.</p> : null}
            {work.stage === "verified" || work.stage === "issued" ? <p className="text-quiet">The VVB opinion is in. Open Issue for the request Verra still has to approve.</p> : null}
          </section>
        ) : null}

        {role === "guardian" ? (
          <section className="mt-4 space-y-3 text-sm">
            <p>
              Guardian runs the policy after it is imported there. This file’s mint is the block tagged mint_by_report, and the token packed with the file is a draft named VCU VMR0015. Asking Guardian below only lists policies. It does not mint.
            </p>
            <p className="border border-rule bg-sheet p-3 break-all">
              {work.chain ? work.chain : "No chain yet. The developer locks the houses first."}
              {work.chain && liveHash ? (chainState === "match" ? " Matches the houses." : chainState === "pending" ? " Checking." : " Does not match the houses now.") : ""}
            </p>
            <label className="block">
              Guardian address
              <input value={guardianUrl} onChange={(event) => setGuardianUrl(event.target.value)} placeholder="https://…" className="mt-1 min-h-12 w-full border border-rule bg-sheet px-3" />
            </label>
            <label className="block">
              Bearer token
              <input value={token} onChange={(event) => setToken(event.target.value)} type="password" autoComplete="off" className="mt-1 min-h-12 w-full border border-rule bg-sheet px-3" />
            </label>
            <button type="button" onClick={askGuardian} className="min-h-12 w-full bg-ink font-medium text-paper">Ask Guardian what policies it has</button>
            {guardianNote ? <p className="text-quiet">{guardianNote}</p> : null}
            <ul className="space-y-2">
              {APPS.map((app) => (
                <li key={app.href}>
                  <a href={app.href} target="_blank" rel="noreferrer" className="block border border-rule bg-sheet px-3 py-3">{app.label}</a>
                </li>
              ))}
            </ul>
            <a href={FILES.find((file) => file.version === "v3.1" && file.id === (work.setId || "A"))?.href ?? FILES[0].href} download className="flex min-h-12 items-center justify-center border border-rule bg-sheet">
              Download policy v3.1 {work.setId || "A"}
            </a>
          </section>
        ) : null}

        {role === "verra" ? (
          <section className="mt-4 space-y-3 text-sm">
            <p>Registration and Issuance Process, version 5.0, 16 December 2025. The proponent prepares the request. Verra approves it and deposits the serials. Copy the packet, then submit it yourself on the Project Hub.</p>
            <button type="button" onClick={() => copy("verra", requestText)} className="min-h-12 w-full bg-ink font-medium text-paper">{copied === "verra" ? "Copied" : "Copy the packet"}</button>
            <a href="https://verra.org/verra-project-hub/" target="_blank" rel="noreferrer" className="flex min-h-12 items-center justify-center border border-rule bg-sheet">Verra Project Hub</a>
            <a href={POLICY.methodUrl} target="_blank" rel="noreferrer" className="flex min-h-12 items-center justify-center border border-rule bg-sheet">VMR0015 on Verra</a>
          </section>
        ) : null}

        {role === "issue" ? (
          <section className="mt-4 max-w-xl space-y-3 text-sm">
            <h1 className="font-serif text-3xl leading-none">Issue</h1>
            <p>Verra deposits VCUs after it approves the verification. This desk cannot do that step.</p>
            <ol className="space-y-2">
              <li className="border border-rule bg-sheet p-3">1. Proponent. The project description is {work.stage === "open" ? "still open" : "locked"}.</li>
              <li className="border border-rule bg-sheet p-3">2. VVB. Validation is {work.stage === "open" || work.stage === "described" ? "not given" : "recorded here as Validated"}.</li>
              <li className="border border-rule bg-sheet p-3">3. Proponent. Submit the registration request on the Verra registry and pay the fee. This desk does not submit it.</li>
              <li className="border border-rule bg-sheet p-3">4. Verra. Completeness check and review. Not started.</li>
              <li className="border border-rule bg-sheet p-3">5. Verra. After verification approval, deposit the VCUs and generate the serials. Sample on this phone: {result.sum} t. Not a serial.</li>
            </ol>
            {work.stage === "issued" ? <p className="text-seal">A number written here earlier is not a VCU.</p> : null}
            <button type="button" disabled={work.stage === "open" || work.stage === "described" || !criteriaPass(work.criteria)} onClick={() => copy("request", requestText)} className="min-h-12 w-full bg-ink font-medium text-paper disabled:opacity-40">
              {copied === "request" ? "Copied" : "Copy the registration request"}
            </button>
            <button type="button" disabled className="min-h-12 w-full bg-ink font-medium text-paper disabled:opacity-40">Deposit VCUs</button>
            <p className="text-quiet">Deposit stays closed. Only Verra generates the serials, after it has approved the verification.</p>
          </section>
        ) : null}

        {role === "markets" ? <Markets stage={work.stage} whole={work.issuedWhole} sum={work.issuedSum} /> : null}

        {role === "paper" ? <Paper /> : null}

        {role === "buyer" ? (
          <section className="mt-4 space-y-3 text-sm">
            <p>A buyer can take a VCU only after Verra has deposited it in a registry account. This desk has no serial, so it cannot assign tonnes.</p>
            {work.offers.map((offer) => (
              <p key={`${offer.at}-${offer.institution}`} className="border border-rule bg-sheet p-3">
                {offer.institution} noted {offer.tonnes} t on {offer.at.slice(0, 10)}. Not a VCU. {offer.contact}
              </p>
            ))}
          </section>
        ) : null}
      </main>
    </div>
  );
}
