import type { DeskState } from "@/lib/desk/store";

const ITEMS: { id: DeskState["tab"]; title: string; body: string }[] = [
  { id: "link", title: "Link", body: "Why this phone does not connect to Guardian." },
  { id: "guide", title: "Guide", body: "Eleven cards. No job. No office." },
  { id: "sheet", title: "Field", body: "One house you have actually seen." },
  { id: "scale", title: "Scale", body: "About half a tonne a house in the sample. Not four." },
  { id: "judgment", title: "Note", body: "The ruling on the big money story." },
  { id: "next", title: "Next", body: "What you still must not do." },
];

export function MorePanel({ patch }: { patch: (partial: Partial<DeskState>) => void }) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="font-serif text-3xl leading-tight">The rest of the desk</h2>
      {ITEMS.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => patch({ tab: item.id })}
          className="min-h-16 border border-rule bg-sheet px-3 py-3 text-left"
        >
          <span className="block font-medium">{item.title}</span>
          <span className="mt-1 block text-sm text-quiet">{item.body}</span>
        </button>
      ))}
    </div>
  );
}
