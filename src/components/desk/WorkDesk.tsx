import { countsTowardSample, ruleGap, rulePass, useVisits, type Visit } from "@/lib/desk/field";
import { FieldWalk } from "@/components/desk/FieldWalk";
import { FILES, GUARDIAN_URL, POLICY, policyIssue } from "@/lib/desk/policy";
import { chainHash, lockedVisits, useWork, type Stage } from "@/lib/desk/work";
import { criteriaPass, CONDITIONS } from "@/lib/desk/criteria";
import { Criteria } from "@/components/desk/Criteria";
import { Ask } from "@/components/desk/Ask";
import { useEffect, useState } from "react";

const RATE = Number(POLICY.perHouse);

const NAV = [
  ["who", "Who"],
  ["drum", "Drum boy"],
  ["check", "Checker"],
  ["developer", "Developer"],
  ["business", "Business"],
  ["guardian", "Guardian"],
] as const;

type Role = (typeof NAV)[number][0];

const APPS = [
  { href: GUARDIAN_URL, label: "Managed Guardian Service, where a policy is imported" },
  { href: "https://guardianservice.io/", label: "Managed Guardian Service" },
  { href: "https://dev.guardian.hedera.com/api-reference-guardian", label: "Guardian API" },
  { href: "https://github.com/hashgraph/guardian", label: "Methodology library" },
];

function tonnesOf(count: number): string {
  return (count * RATE).toFixed(3);
}

export function WorkDesk() {
  const { visits, setVisits } = useVisits();
  const { work, setWork } = useWork();
  const [role, setRole] = useState<Role>("who");
  const [name, setName] = useState("");
  const [plant, setPlant] = useState("");
  const [starts, setStarts] = useState("");
  const [setId, setSetId] = useState<"A" | "B">("A");
  const [note, setNote] = useState("");
  const [guardianUrl, setGuardianUrl] = useState("");
  const [token, setToken] = useState("");
  const [guardianNote, setGuardianNote] = useState("");
  const [copied, setCopied] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [buyerTonnes, setBuyerTonnes] = useState("");
  const [buyerContact, setBuyerContact] = useState("");
  const [liveHash, setLiveHash] = useState("");

  const counted = visits.filter(countsTowardSample);
  const usedIds = new Set([...work.visitIds, ...work.reports.flatMap((report) => report.visitIds)]);
  const free = counted.filter((visit) => !usedIds.has(visit.id));
  const locked = lockedVisits(work, visits);
  const chainState =
    work.chain === "" ? "none" : liveHash === "" ? "pending" : liveHash === work.chain ? "match" : "break";
  const sampleTonnes = tonnesOf(work.stage === "open" ? counted.length : locked.length);

  useEffect(() => {
    if (!work.chain) return;
    const rows = visits.filter((visit) => work.visitIds.includes(visit.id));
    if (rows.length === 0) return;
    void chainHash(rows).then(setLiveHash);
  }, [work.chain, work.visitIds, visits]);

  function saveHouse(draft: Pick<Visit, "house" | "boil" | "fuel" | "water" | "publicPipe" | "shape" | "treatment" | "sealed" | "persons" | "stove" | "photo">) {
    const label = draft.house.trim();
    if (!label || !draft.photo) return;
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
    if (work.visitIds.includes(id)) return;
    setVisits((current) => current.map((visit) => (visit.id === id ? { ...visit, status } : visit)));
  }

  async function lockDescription() {
    const title = name.trim();
    const point = plant.trim();
    const used = new Set([...work.visitIds, ...work.reports.flatMap((report) => report.visitIds)]);
    const chosen = counted.filter((visit) => !used.has(visit.id));
    if (!title || !point || chosen.length === 0 || !criteriaPass(work.criteria)) return;
    const chain = await chainHash(chosen);
    const reports = work.stage === "open" || !work.name ? work.reports : [...work.reports, { name: work.name, plant: work.plant, visitIds: work.visitIds, sum: work.issuedSum, at: work.issuedAt || new Date().toISOString() }].slice(0, 20);
    setWork({
      ...work,
      reports,
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
      issuedSum: "",
      issuedWhole: 0,
      issuedAt: "",
      offers: [],
    });
    setLiveHash(chain);
  }

  function takeBack() {
    setWork({ ...work, stage: "open", visitIds: [], chain: "", plant: "", validationNote: "", monitoringNote: "", issuedSum: "", issuedWhole: 0, issuedAt: "", serial: "", offers: [] });
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

  async function loadDemo() {
    const visit: Visit = {
      id: "demo-balurghat",
      house: "Balurghat, ward 3",
      takenAt: new Date().toISOString(),
      boil: "yes",
      fuel: "wood",
      water: "pass",
      publicPipe: "no",
      shape: "kiosk",
      treatment: "chlorine",
      sealed: "yes",
      persons: 4,
      stove: "none",
      photo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
      status: "accepted",
    };
    const criteria = Object.fromEntries(CONDITIONS.map((condition) => [condition.id, condition.options[0]]));
    const chain = await chainHash([visit]);
    setVisits([visit]);
    setWork({
      ...work,
      name: "Balurghat drum demo",
      plant: "Balurghat treatment point",
      starts: "2026-11-02",
      setId: "A",
      stage: "described",
      visitIds: [visit.id],
      chain,
      criteria,
      validationNote: "",
      monitoringNote: "",
      serial: "",
      issuedSum: "",
      issuedWhole: 0,
      issuedAt: "",
      offers: [],
    });
    setLiveHash(chain);
    setRole("drum");
  }

  async function issueCredit() {
    if (locked.length === 0) return;
    const now = await chainHash(locked);
    if (work.chain && now !== work.chain) return;
    const issued = policyIssue(locked.length);
    setLiveHash(now);
    setWork({
      ...work,
      stage: "issued",
      issuedSum: issued.sum,
      issuedWhole: Number(issued.sum),
      issuedAt: new Date().toISOString(),
    });
  }

  function recordBuyer() {
    const who = buyerName.trim();
    const tonnes = Number(buyerTonnes);
    if (!who || !buyerContact.trim() || !Number.isFinite(tonnes) || tonnes <= 0) return;
    setWork({
      ...work,
      offers: [{ institution: who, tonnes: tonnes.toFixed(3), contact: buyerContact.trim(), at: new Date().toISOString() }, ...work.offers].slice(0, 20),
    });
    setBuyerName("");
    setBuyerTonnes("");
    setBuyerContact("");
  }

  const requestText = [
    `${work.name || "Untitled"}. ${work.plant || "No treatment point"}.`,
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
              if (id === "guardian") void refreshHash();
            }}
            className={`min-h-11 px-2 text-left text-sm ${role === id ? "bg-ink text-paper" : ""}`}
          >
            {label}
          </button>
        ))}
      </nav>
      <main className="min-w-0 flex-1 overflow-x-hidden px-4 py-6 sm:px-8">
        {role === "who" ? (
          <section className="max-w-xl">
            <h1 className="font-serif text-4xl leading-none">Who is signing in</h1>
            <p className="mt-4 text-sm leading-relaxed">Pick a job. The next person picks their own. A finished description does not close the photo, the check, or the next project.</p>
            <div className="mt-6 grid gap-3">
              {NAV.filter(([id]) => id !== "who").map(([id, label]) => (
                <button key={id} type="button" onClick={() => setRole(id)} className="min-h-14 border border-rule bg-sheet px-4 text-left font-serif text-2xl">
                  {label}
                </button>
              ))}
            </div>
          </section>
        ) : null}

        {role === "drum" ? (
          <>
            <Ask who="drum" />
            {visits.map((visit) => (
              <p key={visit.id} className="mb-2 border border-rule bg-sheet p-3 text-sm">
                {visit.house}. {visit.persons} people. {visit.fuel}. {visit.shape === "kiosk" ? "Drum" : "House filter"}, {visit.treatment}. {visit.status}.
              </p>
            ))}
            <p className="mb-3 text-sm">A new photo stays out of {work.name || "the open description"}. It waits for the next one.</p>
            <FieldWalk onSave={saveHouse} saved={visits.length} ready={counted.length} />
          </>
        ) : null}

        {role === "developer" && work.stage !== "validated" ? (
          <section className="mt-4 space-y-3 text-sm">
            <Ask who="developer" />
            {work.name && work.stage !== "open" ? <p>{work.name}. {work.plant}. {work.visitIds.length} houses already in this description.</p> : null}
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
                <button type="button" disabled={!name.trim() || !plant.trim() || free.length === 0} onClick={lockDescription} className="min-h-12 w-full bg-ink font-medium text-paper disabled:opacity-40">
                  {work.stage === "open" ? `Lock ${free.length} houses` : `New description, ${free.length} houses`}
                </button>
                {free.length === 0 ? <p className="text-quiet">No new accepted house. The drum boy takes a photo, then the checker accepts it.</p> : null}
                  </>
                ) : null}
          </section>
        ) : null}
        {role === "developer" && work.stage === "validated" ? (
          <section className="mt-4 space-y-3 text-sm">
            <h2 className="font-serif text-3xl leading-tight">Monitoring</h2>
            <label className="block">
              Monitoring note
              <textarea value={note} onChange={(event) => setNote(event.target.value)} className="mt-1 min-h-24 w-full border border-rule bg-sheet px-3 py-2" />
            </label>
            <button type="button" disabled={!note.trim()} onClick={() => advance("monitoring", { monitoringNote: note.trim() })} className="min-h-12 w-full bg-ink font-medium text-paper disabled:opacity-40">
              Save the note
            </button>
          </section>
        ) : null}

        {role === "check" ? (
          <section className="mt-4 space-y-3 text-sm">
            <Ask who="check" />
            {visits.length === 0 ? <p className="text-quiet">No house yet. The drum boy takes the photo.</p> : null}
            {visits.map((visit) => {
              const gap = ruleGap(visit);
              const held = work.visitIds.includes(visit.id);
              const canAccept = rulePass(visit) && !held;
              return (
                <article key={visit.id} className="border border-rule bg-sheet p-3">
                  <img src={visit.photo} alt="" className="mb-2 max-h-36 w-full object-cover" />
                  <p className="font-medium">{visit.house}</p>
                  <p className="text-quiet">{visit.persons} people. {visit.fuel}. {visit.shape === "kiosk" ? "Drum" : "House filter"}, {visit.treatment}. {visit.status}.{held ? " Already in the description." : ""}</p>
                  {gap && !held ? <p className="mt-1 text-seal">{gap}</p> : null}
                  {held ? null : (
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <button type="button" disabled={!canAccept} onClick={() => mark(visit.id, "accepted")} className="min-h-11 bg-ink text-paper disabled:opacity-40">Accept</button>
                      <button type="button" onClick={() => mark(visit.id, "returned")} className="min-h-11 border border-rule bg-paper">Send back</button>
                    </div>
                  )}
                </article>
              );
            })}
            {work.stage === "described" ? (
              <>
                <p>{work.name}. {locked.length} houses. {sampleTonnes} t.</p>
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
                <p>{work.monitoringNote}</p>
                <p className="border border-rule bg-sheet p-3">{work.monitoringNote}</p>
                <button type="button" onClick={() => advance("verified")} className="min-h-12 w-full bg-ink font-medium text-paper">Positive verification opinion</button>
                <button type="button" onClick={() => advance("validated")} className="min-h-12 w-full border border-rule bg-sheet">Send the note back</button>
              </>
            ) : null}
            {work.stage === "validated" ? <p className="text-quiet">Waiting on the developer’s monitoring note.</p> : null}
            {work.stage === "verified" || work.stage === "issued" ? <p className="text-quiet">Verified. Open Issue.</p> : null}
          </section>
        ) : null}

        {role === "guardian" ? (
          <section className="mt-4 space-y-3 text-sm">
            <Ask who="guardian" />
            <p>This page only lists policies on a Guardian you already run. There is no saved login here. Paste your own address and token, or open MGS and import the file there. Asking does not calculate and does not mint.</p>
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

        {role === "business" ? (
          <section className="mt-4 max-w-xl space-y-3 text-sm">
            <Ask who="business" />
            <h1 className="font-serif text-3xl leading-none">Business</h1>
            {work.stage === "issued" ? (
              <p className="border border-rule bg-sheet p-3">{work.name}. Issued {work.issuedSum} t on {work.issuedAt.slice(0, 10)}. {locked.length} houses, {POLICY.perHouse} t each.</p>
            ) : work.stage === "verified" ? (
              <>
                <p>{work.name}. {locked.length} houses. {result.sum} t.</p>
                <button type="button" onClick={() => void issueCredit()} className="min-h-12 w-full bg-ink font-medium text-paper">
                  Issue {result.sum} t
                </button>
              </>
            ) : (
              <p>The checker has not verified the monitoring note yet.</p>
            )}
          </section>
        ) : null}

        {role === "business" ? (
          <section className="mt-4 space-y-3 text-sm">
            <p>{work.name || "This project"}. {work.issuedSum || result.sum} t. Write who is taking them.</p>
            <label className="block">
              Buyer
              <input value={buyerName} onChange={(event) => setBuyerName(event.target.value)} className="mt-1 min-h-12 w-full border border-rule bg-sheet px-3" />
            </label>
            <label className="block">
              Tonnes
              <input value={buyerTonnes} onChange={(event) => setBuyerTonnes(event.target.value)} inputMode="decimal" placeholder={work.issuedSum || result.sum} className="mt-1 min-h-12 w-full border border-rule bg-sheet px-3" />
            </label>
            <label className="block">
              Contact
              <input value={buyerContact} onChange={(event) => setBuyerContact(event.target.value)} className="mt-1 min-h-12 w-full border border-rule bg-sheet px-3" />
            </label>
            <button type="button" onClick={recordBuyer} className="min-h-12 w-full bg-ink font-medium text-paper">
              Record the buyer
            </button>
            {work.offers.map((offer) => (
              <p key={`${offer.at}-${offer.institution}`} className="border border-rule bg-sheet p-3">
                {offer.institution}. {offer.tonnes} t. {offer.at.slice(0, 10)}. {offer.contact}
              </p>
            ))}
          </section>
        ) : null}
      </main>
    </div>
  );
}
