import { countsTowardSample, ruleGap, rulePass, useVisits, type Visit } from "@/lib/desk/field";
import { FieldWalk } from "@/components/desk/FieldWalk";
import { FILES, GUARDIAN_URL, POLICY, policyIssue } from "@/lib/desk/policy";
import { chainHash, lockedVisits, useWork, type Stage } from "@/lib/desk/work";
import { criteriaPass, CONDITIONS } from "@/lib/desk/criteria";
import { askGuide } from "@/lib/desk/askGuide";
import { vmrCheck } from "@/lib/desk/review";
import { VENUES } from "@/lib/desk/markets";
import { Criteria } from "@/components/desk/Criteria";
import { useEffect, useState } from "react";

const RATE = Number(POLICY.perHouse);

const JOBS = [
  ["drum", "Field worker"],
  ["check", "Checker"],
  ["developer", "Developer"],
  ["business", "Business"],
  ["guardian", "Guardian"],
  ["verra", "Verra"],
  ["market", "Market"],
] as const;

type Role = "who" | (typeof JOBS)[number][0];

const SIDE: Record<Exclude<Role, "who">, [string, string, string][]> = {
  drum: [
    ["house", "House name", "Write the lane and the door. Then press Continue."],
    ["people", "How many people", "Count everyone who lives in that house."],
    ["pipe", "Public pipe", "If a safe pipe already reaches this house, it cannot count."],
    ["boil", "Do they boil", "They must boil their drinking water."],
    ["fuel", "Wood or charcoal", "Wood and charcoal can count. Gas cannot."],
    ["stove", "The stove", "If a better stove does all the boiling, this house cannot use the flat rate."],
    ["shape", "Drum or filter", "A drum comes from a plant. A filter sits inside the house."],
    ["treat", "What treats it", "A drum uses chlorine, a powder, or the sun."],
    ["seal", "Is the drum closed", "The drum is sealed, or disinfectant is still in the water."],
    ["test", "Water test", "Only a test that passed can count."],
    ["photo", "Take the photo", "Photograph the drum or the filter."],
    ["review", "Save the house", "Save it. A different person, the checker, accepts it later."],
  ],
  check: [
    ["houses", "Look at the photo", "Accept the house only when every answer is allowed. If something is wrong, send it back."],
    ["opinion", "The written project", "When the developer has locked the houses, you say yes, or you send the writing back."],
    ["verify", "The later note", "Read what the developer wrote after another visit. If it is right, say so."],
  ],
  developer: [
    ["questions", "Seven questions", "Answer each one. All seven must be yes before the project can be named."],
    ["name", "Name the project", "Write the project name and the plant the drums leave from. Then lock the houses the checker accepted."],
    ["note", "The later visit", "After the checker says yes, write what you saw when the houses were visited again."],
  ],
  business: [
    ["tonnes", "The tonnes", "One house that passed is 0.519 tonnes. You can issue them only after the checker has agreed the later note."],
    ["buyer", "Who is buying", "Write the buyer's name, how many tonnes, and how to reach them."],
  ],
  guardian: [
    ["file", "Download the file", "A is for a project that starts before 1 January 2027. B is for a project that starts on or after that day."],
    ["import", "Import it in Guardian", "Open Guardian and import the file there. This page cannot import it for you."],
  ],
  verra: [
    ["ask", "Ask", "Ask one question. The guide reads the VMR0015 packet and this project's check, then answers that question."],
    ["check", "Check every question", "Each VMR0015 question is read against this project. A pass here is not a Verra approval."],
    ["registry", "The registry", "The public registry is where a serial would be looked up after Verra issues it. This phone does not hold that login."],
  ],
  market: [
    ["seller", "Who is selling", "Write your name. This is your name on this phone. It does not sign you into an exchange."],
    ["where", "Where to sell", "A Verra unit is held on the Verra registry. An Indian certificate is sold by an industrial plant on a power exchange. Safe drinking water is not on that Indian list."],
  ],
};

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
  const [pane, setPane] = useState("house");
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
  const [seller, setSeller] = useState("");
  const [askQ, setAskQ] = useState("");
  const [askA, setAskA] = useState("");
  const [asking, setAsking] = useState(false);
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

  function choose(next: Role) {
    setRole(next);
    const first = next === "who" ? "" : SIDE[next][0][0];
    if (first) setPane(first);
  }

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
    setPane("house");
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

  const policyFile = FILES.find((file) => file.importThis && file.id === (work.setId || "A")) ?? FILES[0];
  const requestText = [
    `Policy: ${policyFile.guardianName}.`,
    `File: ${policyFile.name}.`,
    `SHA-256: ${policyFile.sha}.`,
    `Methodology: ${POLICY.method}, ${POLICY.methodName}. A revision of ${POLICY.parent}.`,
    `Template: ${policyFile.when}.`,
    `The file's own version field is Dry Run. This packet is not a Verra project description and not a VCU.`,
    `${work.name || "Untitled"}. ${work.plant || "No treatment point named."}.`,
    `Applicability: ${criteriaPass(work.criteria) ? "the seven answers pass" : "the seven answers are missing or void the calculation"}.`,
    `Houses in the lock: ${work.visitIds.length}. Sample ${sampleTonnes} t at ${POLICY.perHouse} t each. That rate is the test file, not this project's calculation.`,
    work.chain ? `Chain ${work.chain}` : "No chain yet.",
    chainState === "match" ? "The houses still match that chain." : chainState === "pending" ? "The chain is still being checked." : chainState === "break" ? "The houses do not match the locked chain." : "No chain yet.",
    "",
    ...locked.map((visit, index) => `${index + 1}. ${visit.house}. ${visit.shape === "kiosk" ? "Drum from a treatment point" : "Filter in the house"}, ${visit.treatment}. No public safe-water pipe. Boils with ${visit.fuel}. Water passed. ${visit.takenAt.slice(0, 10)}.`),
  ].join("\n");

  return (
    <div className="flex min-h-dvh bg-paper text-ink">
      <nav aria-label="This job" className="sticky top-0 flex h-dvh w-36 shrink-0 flex-col gap-1 overflow-y-auto border-r border-rule bg-sheet px-2 py-4 sm:w-56">
        <p className="px-2 pb-3 font-serif text-xl leading-tight">VMR0015</p>
        {role === "who" ? <p className="px-2 text-sm leading-relaxed">Pick one job. The steps for that job appear here.</p> : null}
        {role !== "who"
          ? SIDE[role].map(([id, label]) => (
              <button
                key={id}
                type="button"
                aria-current={pane === id ? "page" : undefined}
                onClick={() => setPane(id)}
                className={`min-h-11 px-2 text-left text-sm ${pane === id ? "bg-ink text-paper" : ""}`}
              >
                {label}
              </button>
            ))
          : null}
        {role !== "who" ? (
          <button type="button" onClick={() => choose("who")} className="mt-auto min-h-11 px-2 text-left text-sm text-quiet">
            Change job
          </button>
        ) : null}
      </nav>
      <main className="min-w-0 flex-1 overflow-x-hidden px-4 py-6 sm:px-8">
        {role === "who" ? (
          <section className="max-w-xl">
            <h1 className="font-serif text-4xl leading-none">Who are you</h1>
            <p className="mt-4 text-sm leading-relaxed">Pick your job. After that, the left side shows only your steps, in plain words. Another person can press Change job and pick theirs.</p>
            <div className="mt-6 grid gap-3">
              {JOBS.map(([id, label]) => (
                <button key={id} type="button" onClick={() => choose(id)} className="min-h-14 border border-rule bg-sheet px-4 text-left font-serif text-2xl">
                  {label}
                </button>
              ))}
            </div>
          </section>
        ) : null}

        {role === "drum" ? (
          <>
            <p className="max-w-xl text-sm leading-relaxed">{SIDE.drum.find(([id]) => id === pane)?.[2]}</p>
            <FieldWalk onSave={saveHouse} saved={visits.length} ready={counted.length} step={pane} onStep={setPane} />
          </>
        ) : null}

        {role === "developer" && pane === "questions" ? (
          <section className="max-w-xl space-y-3 text-sm">
            <p className="leading-relaxed">{SIDE.developer[0][2]}</p>
            <Criteria
              answers={work.criteria}
              onAnswer={(id, value) => setWork({ ...work, criteria: { ...work.criteria, [id]: value } })}
            />
            {criteriaPass(work.criteria) ? <button type="button" onClick={() => setPane("name")} className="min-h-12 w-full bg-ink font-medium text-paper">All seven passed. Name the project.</button> : <p className="text-quiet">Not ready to name the project yet.</p>}
          </section>
        ) : null}
        {role === "developer" && pane === "name" ? (
          <section className="max-w-xl space-y-3 text-sm">
            <p className="leading-relaxed">{SIDE.developer[1][2]}</p>
            {work.name && work.stage !== "open" ? <p>{work.name}. {work.plant}. {work.visitIds.length} houses are already in a description. A new lock uses only houses that are not in one yet.</p> : null}
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
            <button type="button" disabled={!criteriaPass(work.criteria) || !name.trim() || !plant.trim() || free.length === 0} onClick={lockDescription} className="min-h-12 w-full bg-ink font-medium text-paper disabled:opacity-40">
              {work.stage === "open" ? `Lock ${free.length} houses` : `New description, ${free.length} houses`}
            </button>
            {!criteriaPass(work.criteria) ? <p className="text-quiet">Go back to Seven questions. They are not all yes yet.</p> : null}
            {free.length === 0 ? <p className="text-quiet">No new accepted house. The field worker takes a photo. The checker accepts it.</p> : null}
          </section>
        ) : null}
        {role === "developer" && pane === "note" ? (
          <section className="max-w-xl space-y-3 text-sm">
            <p className="leading-relaxed">{SIDE.developer[2][2]}</p>
            <label className="block">
              What you saw
              <textarea value={note} onChange={(event) => setNote(event.target.value)} className="mt-1 min-h-24 w-full border border-rule bg-sheet px-3 py-2" />
            </label>
            <button type="button" disabled={work.stage !== "validated" || !note.trim()} onClick={() => advance("monitoring", { monitoringNote: note.trim() })} className="min-h-12 w-full bg-ink font-medium text-paper disabled:opacity-40">
              Save the note
            </button>
            {work.stage !== "validated" ? <p className="text-quiet">The checker has not said yes to the description yet. You can write the note now. Saving waits for that yes.</p> : null}
          </section>
        ) : null}

        {role === "check" && pane === "houses" ? (
          <section className="max-w-xl space-y-3 text-sm">
            <p className="leading-relaxed">{SIDE.check[0][2]}</p>
            {visits.length === 0 ? <p className="text-quiet">No house yet. The field worker takes the photo.</p> : null}
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
          </section>
        ) : null}
        {role === "check" && pane === "opinion" ? (
          <section className="max-w-xl space-y-3 text-sm">
            <p className="leading-relaxed">{SIDE.check[1][2]}</p>
            <p>{work.name || "No description yet"}. {locked.length} houses. {sampleTonnes} t.</p>
            <label className="block">
              Your note
              <textarea value={note} onChange={(event) => setNote(event.target.value)} className="mt-1 min-h-24 w-full border border-rule bg-sheet px-3 py-2" />
            </label>
            <button type="button" disabled={work.stage !== "described" || locked.length === 0 || !criteriaPass(work.criteria)} onClick={() => advance("validated", { validationNote: note.trim() || "Validated" })} className="min-h-12 w-full bg-ink font-medium text-paper disabled:opacity-40">
              Yes. The description is right.
            </button>
            <button type="button" disabled={work.stage !== "described"} onClick={takeBack} className="min-h-12 w-full border border-rule bg-sheet disabled:opacity-40">Send the description back</button>
            {work.stage !== "described" ? <p className="text-quiet">There is no locked description waiting. The developer locks the houses first.</p> : null}
          </section>
        ) : null}
        {role === "check" && pane === "verify" ? (
          <section className="max-w-xl space-y-3 text-sm">
            <p className="leading-relaxed">{SIDE.check[2][2]}</p>
            <p className="border border-rule bg-sheet p-3">{work.monitoringNote || "The developer has not saved a later note yet."}</p>
            <button type="button" disabled={work.stage !== "monitoring"} onClick={() => advance("verified")} className="min-h-12 w-full bg-ink font-medium text-paper disabled:opacity-40">The note is right</button>
            <button type="button" disabled={work.stage !== "monitoring"} onClick={() => advance("validated")} className="min-h-12 w-full border border-rule bg-sheet disabled:opacity-40">Send the note back</button>
          </section>
        ) : null}

        {role === "guardian" && pane === "file" ? (
          <section className="max-w-xl space-y-3 text-sm">
            <p className="leading-relaxed">{SIDE.guardian[0][2]}</p>
            <a href={FILES.find((file) => file.version === "v3.1" && file.id === "A")?.href ?? FILES[0].href} download className="flex min-h-12 items-center justify-center bg-ink font-medium text-paper">
              Download file A
            </a>
            <a href={FILES.find((file) => file.version === "v3.1" && file.id === "B")?.href ?? FILES[0].href} download className="flex min-h-12 items-center justify-center border border-rule bg-sheet">
              Download file B
            </a>
          </section>
        ) : null}
        {role === "guardian" && pane === "import" ? (
          <section className="max-w-xl space-y-3 text-sm">
            <p className="leading-relaxed">{SIDE.guardian[1][2]}</p>
            <ul className="space-y-2">
              {APPS.map((app) => (
                <li key={app.href}>
                  <a href={app.href} target="_blank" rel="noreferrer" className="block border border-rule bg-sheet px-3 py-3">{app.label}</a>
                </li>
              ))}
            </ul>
            <p className="border border-rule bg-sheet p-3 break-all">{work.chain || "No house list is locked yet. The developer does that first."}</p>
            <label className="block">
              Your Guardian address, if you already run one
              <input value={guardianUrl} onChange={(event) => setGuardianUrl(event.target.value)} placeholder="https://…" className="mt-1 min-h-12 w-full border border-rule bg-sheet px-3" />
            </label>
            <label className="block">
              Your token
              <input value={token} onChange={(event) => setToken(event.target.value)} type="password" autoComplete="off" className="mt-1 min-h-12 w-full border border-rule bg-sheet px-3" />
            </label>
            <button type="button" onClick={askGuardian} className="min-h-12 w-full bg-ink font-medium text-paper">Ask that Guardian which policies it has</button>
            {guardianNote ? <p className="text-quiet">{guardianNote}</p> : null}
          </section>
        ) : null}

        {role === "business" && pane === "tonnes" ? (
          <section className="max-w-xl space-y-3 text-sm">
            <p className="leading-relaxed">{SIDE.business[0][2]}</p>
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
              <p>{work.name || "No project yet"}. {locked.length} houses. {result.sum} t. The checker has not agreed the later note, so these tonnes are not issued.</p>
            )}
          </section>
        ) : null}
        {role === "business" && pane === "buyer" ? (
          <section className="max-w-xl space-y-3 text-sm">
            <p className="leading-relaxed">{SIDE.business[1][2]}</p>
            <p>{work.name || "This project"}. {work.issuedSum || result.sum} t.</p>
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
        {role === "verra" && pane === "ask" ? (
          <section className="max-w-xl space-y-3 text-sm">
            <p className="leading-relaxed">{SIDE.verra[0][2]}</p>
            <label className="block">
              Your question
              <input value={askQ} onChange={(event) => setAskQ(event.target.value)} placeholder="What does the water test require?" className="mt-1 min-h-12 w-full border border-rule bg-sheet px-3" />
            </label>
            <button
              type="button"
              disabled={asking || !askQ.trim()}
              onClick={() => {
                setAsking(true);
                void askGuide({ data: { question: askQ, lines: vmrCheck(work.criteria, locked) } })
                  .then((result) => setAskA(result.text))
                  .catch(() => setAskA("The guide could not answer just now. Try again."))
                  .finally(() => setAsking(false));
              }}
              className="min-h-12 w-full bg-ink font-medium text-paper disabled:opacity-40"
            >
              {asking ? "Reading the packet…" : "Get the answer"}
            </button>
            <p className="border border-rule bg-sheet p-3 leading-relaxed">{askA || "The answer appears here, for the question you asked."}</p>
          </section>
        ) : null}
        {role === "verra" && pane === "check" ? (
          <section className="max-w-xl space-y-3 text-sm">
            <p className="leading-relaxed">{SIDE.verra[1][2]}</p>
            <p>
              {vmrCheck(work.criteria, locked).filter((line) => line.pass).length} passed.{" "}
              {vmrCheck(work.criteria, locked).filter((line) => !line.pass).length} still open. Method {POLICY.method}.
            </p>
            {vmrCheck(work.criteria, locked).map((line) => (
              <article key={line.ask} className="border border-rule bg-sheet p-3">
                <p className="font-medium">{line.pass ? "Pass" : "Open"}. {line.ask}</p>
                <p className="mt-1 leading-relaxed">{line.answer}</p>
              </article>
            ))}
          </section>
        ) : null}
        {role === "verra" && pane === "registry" ? (
          <section className="max-w-xl space-y-3 text-sm">
            <p className="leading-relaxed">{SIDE.verra[2][2]}</p>
            <a href="https://registry.verra.org/" target="_blank" rel="noreferrer" className="flex min-h-12 items-center justify-center bg-ink font-medium text-paper">
              Open the Verra registry
            </a>
            <a href={POLICY.methodUrl} target="_blank" rel="noreferrer" className="flex min-h-12 items-center justify-center border border-rule bg-sheet">
              VMR0015 on Verra
            </a>
            <button type="button" onClick={() => copy("verra", requestText)} className="min-h-12 w-full border border-rule bg-sheet">
              {copied === "verra" ? "Copied" : "Copy the questions and the houses"}
            </button>
          </section>
        ) : null}
        {role === "market" && pane === "seller" ? (
          <section className="max-w-xl space-y-3 text-sm">
            <p className="leading-relaxed">{SIDE.market[0][2]}</p>
            <label className="block">
              Your name
              <input value={seller} onChange={(event) => setSeller(event.target.value)} className="mt-1 min-h-12 w-full border border-rule bg-sheet px-3" />
            </label>
            <p>{seller.trim() ? `${seller.trim()} is the name on this phone.` : "No name yet."}</p>
          </section>
        ) : null}
        {role === "market" && pane === "where" ? (
          <section className="max-w-xl space-y-3 text-sm">
            <p className="leading-relaxed">{SIDE.market[1][2]}</p>
            <p>{work.name || "This project"}. {work.issuedSum || result.sum} t on this phone. {seller.trim() || "No seller name yet"}.</p>
            {VENUES.map((venue) => (
              <article key={venue.name} className="border border-rule bg-sheet p-3">
                <p className="font-medium">{venue.name}</p>
                <p className="mt-1 leading-relaxed">{venue.trades} {venue.who}</p>
                <a href={venue.href} target="_blank" rel="noreferrer" className="mt-3 flex min-h-12 items-center justify-center border border-rule bg-paper">
                  {venue.label}
                </a>
              </article>
            ))}
          </section>
        ) : null}
      </main>
    </div>
  );
}
