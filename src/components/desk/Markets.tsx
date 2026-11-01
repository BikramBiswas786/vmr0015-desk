import { BEE_LIST, METHODS, VENUES, type Fit } from "@/lib/desk/markets";
import type { Stage } from "@/lib/desk/work";
import { useState } from "react";

const FIT: Record<Fit, string> = {
  possible: "Can describe this water project",
  rules: "Rules only",
  no: "Cannot list this project",
};

export function Markets({ stage }: { stage: Stage }) {
  const [serial, setSerial] = useState("");
  const pasted = serial.trim();

  return (
    <section className="mt-6 space-y-6 text-sm">
      <div>
        <h2 className="font-serif text-3xl leading-tight">Methodology comparison</h2>
        <p className="mt-2 leading-relaxed">
          Fourteen methods. One can describe these houses. Twelve are India’s offset methods, and none of them is safe drinking water. The compliance market is for industrial plants.
        </p>
      </div>
      <ul className="space-y-2">
        {METHODS.map((row) => (
          <li key={row.id} className="border border-rule bg-sheet p-3">
            <p className="font-medium">{row.name}</p>
            <p className="text-quiet">{row.body}</p>
            <p className="mt-2">{FIT[row.fit]}</p>
            <p className="mt-1 leading-relaxed">{row.why}</p>
            <p className="mt-1 text-quiet">{row.unit}</p>
          </li>
        ))}
      </ul>
      <div>
        <h2 className="font-serif text-3xl leading-tight">Where a real unit is traded</h2>
        <p className="mt-2 leading-relaxed">
          A Verra unit moves on the Verra registry. An Indian certificate moves on a power exchange, once a month, after BEE has issued it. This desk is connected to those venues as the doors. It does not place a bid.
        </p>
      </div>
      <ul className="space-y-2">
        {VENUES.map((venue) => (
          <li key={venue.name} className="border border-rule bg-sheet p-3">
            <p className="font-medium">{venue.name}</p>
            <p className="mt-1 leading-relaxed">{venue.trades}</p>
            <p className="text-quiet">{venue.who}</p>
            <a href={venue.href} target="_blank" rel="noreferrer" className="mt-3 flex min-h-12 items-center justify-center border border-rule bg-paper px-3">
              {venue.label}
            </a>
          </li>
        ))}
      </ul>
      <a href={BEE_LIST} target="_blank" rel="noreferrer" className="flex min-h-12 items-center justify-center border border-rule bg-sheet px-3">
        BEE offset methodology list
      </a>
      <div className="border border-rule p-3">
        <h2 className="font-serif text-2xl leading-tight">This case cannot be listed</h2>
        <p className="mt-2 leading-relaxed">
          {stage === "verified"
            ? "The checker has verified the monitoring. Verra has not issued a serial, so there is nothing to transfer."
            : "The case has not reached a verified monitoring report, and no registry has issued a unit."}
        </p>
        <label className="mt-3 block">
          Paste a serial only if Verra already issued one
          <input value={serial} onChange={(event) => setSerial(event.target.value)} className="mt-1 min-h-12 w-full border border-rule bg-sheet px-3" />
        </label>
        <button type="button" disabled className="mt-3 min-h-12 w-full bg-ink font-medium text-paper disabled:opacity-40">
          List for trade
        </button>
        <p className="mt-2 text-quiet">
          {pasted
            ? `“${pasted}” is a claim. This desk did not find it on a registry, and pasting it does not list a tonne.`
            : "Listing stays closed. A marketplace sale needs a unit the registry has already issued."}
        </p>
      </div>
    </section>
  );
}
