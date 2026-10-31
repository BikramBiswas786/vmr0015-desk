import { compressPhoto, countsTowardSample, useVisits, type Visit } from "@/lib/desk/field";
import { FILES, GUARDIAN_URL, POLICY } from "@/lib/desk/policy";
import { chainHash, lockedVisits, STAGE_LINE, useWork, type Stage } from "@/lib/desk/work";
import { Paper } from "@/components/desk/Paper";
import { useState } from "react";

const RATE = Number(POLICY.perHouse);

const ROLES = [
  ["field", "Field crew"],
  ["developer", "Developer"],
  ["checker", "Checker"],
  ["guardian", "Guardian"],
  ["verra", "Verra"],
  ["buyer", "Buyer"],
  ["paper", "Paper"],
] as const;

type Role = (typeof ROLES)[number][0];

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
  const [role, setRole] = useState<Role>("field");
  const [house, setHouse] = useState("");
  const [boil, setBoil] = useState<Visit["boil"]>("yes");
  const [fuel, setFuel] = useState<Visit["fuel"]>("wood");
  const [water, setWater] = useState<Visit["water"]>("untested");
  const [photo, setPhoto] = useState("");
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState("");
  const [starts, setStarts] = useState("");
  const [setId, setSetId] = useState<"A" | "B">("A");
  const [note, setNote] = useState("");
  const [institution, setInstitution] = useState("");
  const [offerTonnes, setOfferTonnes] = useState("");
  const [contact, setContact] = useState("");
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

  async function onPhoto(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    try {
      setPhoto(await compressPhoto(file));
    } finally {
      setBusy(false);
    }
  }

  function saveHouse() {
    const label = house.trim();
    if (!label || !photo || work.stage !== "open") return;
    const next: Visit = {
      id: crypto.randomUUID(),
      house: label,
      takenAt: new Date().toISOString(),
      boil,
      fuel,
      water,
      photo,
      status: "in",
    };
    setVisits((current) => [next, ...current].slice(0, 40));
    setHouse("");
    setPhoto("");
    setWater("untested");
  }

  function mark(id: string, status: Visit["status"]) {
    if (work.stage !== "open") return;
    setVisits((current) => current.map((visit) => (visit.id === id ? { ...visit, status } : visit)));
  }

  async function lockDescription() {
    const title = name.trim();
    if (!title || counted.length === 0 || work.stage !== "open") return;
    const chosen = counted;
    const chain = await chainHash(chosen);
    setWork({
      ...work,
      name: title,
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
    setWork({ ...work, stage: "open", visitIds: [], chain: "", validationNote: "", monitoringNote: "", offers: [] });
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

  function recordOffer() {
    const who = institution.trim();
    const tonnes = Number(offerTonnes);
    const cap = Number(sampleTonnes);
    if (!who || !contact.trim() || !Number.isFinite(tonnes) || tonnes <= 0 || tonnes > cap) return;
    if (work.stage !== "verified" || chainState !== "match") return;
    setWork({
      ...work,
      offers: [
        { institution: who, tonnes: tonnes.toFixed(3), contact: contact.trim(), at: new Date().toISOString() },
        ...work.offers,
      ].slice(0, 20),
    });
    setInstitution("");
    setOfferTonnes("");
    setContact("");
  }

  async function copy(kind: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
    } catch {
      setCopied("");
    }
  }

  const packet = [
    `${work.name || "Untitled"} — VMR0015 field packet. Not a Verra serial. Not for sale.`,
    STAGE_LINE[work.stage],
    `Template ${work.setId}. Houses in the lock: ${work.visitIds.length}. Sample ${sampleTonnes} t at ${POLICY.perHouse} t each.`,
    work.chain ? `Chain ${work.chain}` : "No chain yet.",
    chainState === "match" ? "The houses still match that chain." : chainState === "pending" ? "The chain is still being checked." : chainState === "break" ? "The houses do not match the locked chain." : "No chain yet.",
    "",
    ...locked.map((visit, index) => `${index + 1}. ${visit.house}. Boils with ${visit.fuel}. Water passed. ${visit.takenAt.slice(0, 10)}.`),
  ].join("\n");

  return (
    <div className="min-h-dvh bg-ink text-ink">
      <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col bg-paper px-5 pt-6 pb-10">
        <p className="text-xs font-medium tracking-widest text-seal uppercase">Six roles, one chain</p>
        <h1 className="mt-2 font-serif text-3xl leading-none">VMR0015 Desk</h1>
        <label className="mt-4 block text-sm">
          You are
          <select
            value={role}
            onChange={(event) => {
              const next = event.target.value as Role;
              setRole(next);
              if (next === "guardian" || next === "buyer" || next === "verra") void refreshHash();
            }}
            className="mt-1 min-h-12 w-full border border-rule bg-sheet px-2"
          >
            {ROLES.map(([id, label]) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <p className="mt-3 text-sm text-quiet">{STAGE_LINE[work.stage]}</p>

        {role === "field" ? (
          <section className="mt-4 space-y-3">
            <p className="text-sm leading-relaxed">
              Visit a house that boils drinking water with wood. Photograph the filter or the drum that replaces that boiling. Write whether they boil, the fuel, and whether a water test passed. This note is evidence for a Verra VMR0015 file. It is not an Indian carbon-credit certificate. The same house cannot be sold on both markets.
            </p>
            {work.stage !== "open" ? (
              <p className="border border-rule bg-sheet p-3 text-sm">The description is locked. New houses wait until the developer takes it back.</p>
            ) : (
              <>
                <label className="block text-sm">
                  House
                  <input value={house} onChange={(event) => setHouse(event.target.value)} placeholder="Lane and house" className="mt-1 min-h-12 w-full border border-rule bg-sheet px-3" />
                </label>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <label>
                    Do they boil?
                    <select value={boil} onChange={(event) => setBoil(event.target.value as Visit["boil"])} className="mt-1 min-h-12 w-full border border-rule bg-sheet px-2">
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </label>
                  <label>
                    Fuel
                    <select value={fuel} onChange={(event) => setFuel(event.target.value as Visit["fuel"])} className="mt-1 min-h-12 w-full border border-rule bg-sheet px-2">
                      <option value="wood">Wood</option>
                      <option value="charcoal">Charcoal</option>
                      <option value="gas">Gas</option>
                      <option value="none">None</option>
                    </select>
                  </label>
                </div>
                <label className="block text-sm">
                  Water test
                  <select value={water} onChange={(event) => setWater(event.target.value as Visit["water"])} className="mt-1 min-h-12 w-full border border-rule bg-sheet px-2">
                    <option value="untested">Not tested yet</option>
                    <option value="pass">Passed, safe</option>
                    <option value="fail">Failed</option>
                  </select>
                </label>
                <label className="flex min-h-12 cursor-pointer items-center justify-center border border-rule bg-sheet text-sm font-medium">
                  {busy ? "Reading photo…" : photo ? "Photo ready. Tap to replace." : "Take a photo of the system"}
                  <input type="file" accept="image/*" capture="environment" className="sr-only" onChange={(event) => onPhoto(event.target.files?.[0])} />
                </label>
                {photo ? <img src={photo} alt="System at the house" className="max-h-48 w-full border border-rule object-cover" /> : null}
                <button type="button" disabled={!house.trim() || !photo || busy} onClick={saveHouse} className="min-h-12 w-full bg-ink text-sm font-medium text-paper disabled:opacity-40">
                  Save this house
                </button>
              </>
            )}
            <p className="text-sm text-quiet">{visits.length} houses on this phone. {counted.length} could enter a sample, at {POLICY.perHouse} t each, if a checker accepts them.</p>
          </section>
        ) : null}

        {role === "developer" ? (
          <section className="mt-4 space-y-3 text-sm">
            <p>You bundle the accepted houses into one project description. You do not approve your own work.</p>
            {work.stage === "open" ? (
              <>
                <label className="block">
                  Project name
                  <input value={name} onChange={(event) => setName(event.target.value)} className="mt-1 min-h-12 w-full border border-rule bg-sheet px-3" />
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
                <button type="button" disabled={!name.trim() || counted.length === 0} onClick={lockDescription} className="min-h-12 w-full bg-ink font-medium text-paper disabled:opacity-40">
                  Lock {counted.length} houses
                </button>
                {counted.length === 0 ? <p className="text-quiet">Nothing to lock. A house needs a photo, a passed water test, and boiling with wood or charcoal, and the checker must accept it. Switch to Checker.</p> : null}
              </>
            ) : (
              <>
                <p className="border border-rule bg-sheet p-3">{work.name}. Template {work.setId}. {work.visitIds.length} houses. Sample {sampleTonnes} t.</p>
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
                <p>Accept a house only when the water test passed. A photo by itself is not enough.</p>
                {visits.length === 0 ? <p className="text-quiet">No house yet.</p> : null}
                {visits.map((visit) => {
                  const canAccept = visit.water === "pass" && visit.photo.length > 0;
                  return (
                    <article key={visit.id} className="border border-rule bg-sheet p-3">
                      <img src={visit.photo} alt="" className="mb-2 max-h-36 w-full object-cover" />
                      <p className="font-medium">{visit.house}</p>
                      <p className="text-quiet">Boil {visit.boil}, {visit.fuel}, water {visit.water}. {visit.status}.</p>
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
                <p>{work.name}. {locked.length} of {work.visitIds.length} locked houses still pass.</p>
                <label className="block">
                  Validation note
                  <textarea value={note} onChange={(event) => setNote(event.target.value)} className="mt-1 min-h-24 w-full border border-rule bg-sheet px-3 py-2" />
                </label>
                <button type="button" disabled={locked.length === 0} onClick={() => advance("validated", { validationNote: note.trim() })} className="min-h-12 w-full bg-ink font-medium text-paper disabled:opacity-40">
                  Validate
                </button>
                <button type="button" onClick={takeBack} className="min-h-12 w-full border border-rule bg-sheet">Send the description back</button>
              </>
            ) : null}
            {work.stage === "monitoring" ? (
              <>
                <p className="border border-rule bg-sheet p-3">{work.monitoringNote}</p>
                <button type="button" onClick={() => advance("verified")} className="min-h-12 w-full bg-ink font-medium text-paper">Verify the monitoring</button>
                <button type="button" onClick={() => advance("validated")} className="min-h-12 w-full border border-rule bg-sheet">Send the note back</button>
              </>
            ) : null}
            {work.stage === "validated" ? <p className="text-quiet">Waiting on the developer’s monitoring note.</p> : null}
            {work.stage === "verified" ? <p className="text-quiet">Verification is done. The buyer can record an offer. Verra has not issued a serial.</p> : null}
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
            <p>Verra’s Project Hub is a different system. This desk prepares the packet. It does not submit it, and it cannot receive a serial.</p>
            <button type="button" onClick={() => copy("verra", packet)} className="min-h-12 w-full bg-ink font-medium text-paper">{copied === "verra" ? "Copied" : "Copy the packet"}</button>
            <a href="https://verra.org/verra-project-hub/" target="_blank" rel="noreferrer" className="flex min-h-12 items-center justify-center border border-rule bg-sheet">Verra Project Hub</a>
            <a href={POLICY.methodUrl} target="_blank" rel="noreferrer" className="flex min-h-12 items-center justify-center border border-rule bg-sheet">VMR0015 on Verra</a>
          </section>
        ) : null}

        {role === "paper" ? <Paper /> : null}

        {role === "buyer" ? (
          <section className="mt-4 space-y-3 text-sm">
            {work.stage !== "verified" ? (
              <p>An institution sees an offer only after the checker verifies the monitoring. That has not happened.</p>
            ) : chainState === "pending" ? (
              <p>Checking the houses against the lock.</p>
            ) : chainState !== "match" ? (
              <p>The locked chain no longer matches the houses. No offer can be recorded until the developer locks them again.</p>
            ) : (
              <>
                <p>{work.name}. {locked.length} houses. Sample {sampleTonnes} t. This is not a credit, and paying is not possible here.</p>
                <label className="block">
                  Institution
                  <input value={institution} onChange={(event) => setInstitution(event.target.value)} className="mt-1 min-h-12 w-full border border-rule bg-sheet px-3" />
                </label>
                <label className="block">
                  Tonnes requested, at most {sampleTonnes}
                  <input value={offerTonnes} onChange={(event) => setOfferTonnes(event.target.value)} inputMode="decimal" className="mt-1 min-h-12 w-full border border-rule bg-sheet px-3" />
                </label>
                <label className="block">
                  Contact
                  <input value={contact} onChange={(event) => setContact(event.target.value)} className="mt-1 min-h-12 w-full border border-rule bg-sheet px-3" />
                </label>
                <button type="button" onClick={recordOffer} className="min-h-12 w-full bg-ink font-medium text-paper">Record an offer</button>
                <p className="text-quiet">An offer is a note. No money moves. A purchase needs a Verra serial this app does not have.</p>
              </>
            )}
            {work.offers.map((offer) => (
              <p key={`${offer.at}-${offer.institution}`} className="border border-rule bg-sheet p-3">
                {offer.institution} recorded {offer.tonnes} t on {offer.at.slice(0, 10)}. Not a purchase. {offer.contact}
              </p>
            ))}
          </section>
        ) : null}
      </div>
    </div>
  );
}
