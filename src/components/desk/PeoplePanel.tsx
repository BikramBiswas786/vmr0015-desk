import { PARTNERS } from "@/lib/desk/partners";
import type { DeskState } from "@/lib/desk/store";

export function PeoplePanel({
  state,
  patch,
}: {
  state: DeskState;
  patch: (partial: Partial<DeskState>) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-xs font-medium tracking-widest text-seal uppercase">Write about water</p>
        <h2 className="mt-2 font-serif text-3xl leading-tight">Two you can contact</h2>
        <p className="mt-2 text-sm leading-relaxed text-quiet">
          Both distribute treated water. Neither will reserve your lane. Do not offer them a credit.
        </p>
      </div>
      {PARTNERS.map((partner) => (
        <article key={partner.id} className="border border-rule bg-sheet px-3 py-3">
          <h3 className="font-serif text-xl">{partner.name}</h3>
          <p className="text-sm text-quiet">
            {partner.org} · {partner.place}
          </p>
          <p className="mt-2 text-sm leading-relaxed">{partner.what}</p>
          {partner.email ? <p className="mt-2 text-sm">{partner.email}</p> : null}
          {partner.phone ? <p className="text-sm">{partner.phone}</p> : null}
          <p className="mt-1 text-sm">
            <a href={partner.url} className="underline">
              Their site
            </a>
          </p>
          <button
            type="button"
            onClick={() => patch({ partnerId: partner.id, letterKind: "partner", tab: "send" })}
            className="mt-3 min-h-12 w-full bg-ink text-sm font-medium text-paper"
          >
            Open the letter
          </button>
        </article>
      ))}
    </div>
  );
}
