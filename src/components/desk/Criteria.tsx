import { CONDITIONS, criteriaGaps, criteriaPass, type CriteriaAnswers } from "@/lib/desk/criteria";
import { useState } from "react";

export function Criteria({
  answers,
  onAnswer,
}: {
  answers: CriteriaAnswers;
  onAnswer: (id: string, value: string) => void;
}) {
  const [index, setIndex] = useState(0);
  const gaps = criteriaGaps(answers);
  const condition = CONDITIONS[Math.min(index, CONDITIONS.length - 1)];

  if (criteriaPass(answers) && index >= CONDITIONS.length - 1 && answers[CONDITIONS[CONDITIONS.length - 1].id]) {
    return <p className="border border-rule bg-sheet p-3">All seven applicability answers pass. The policy would not void this calculation.</p>;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between text-xs tracking-wide text-quiet uppercase">
        <span>
          Applicability {index + 1} of {CONDITIONS.length}
        </span>
        <button type="button" disabled={index === 0} onClick={() => setIndex((current) => Math.max(0, current - 1))} className="min-h-11 px-2 disabled:opacity-30">
          Back
        </button>
      </div>
      <h2 className="font-serif text-3xl leading-tight">{condition.ask}</h2>
      {condition.options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => {
            onAnswer(condition.id, option);
            setIndex((current) => Math.min(CONDITIONS.length - 1, current + 1));
          }}
          className={`min-h-14 w-full border px-4 text-left font-medium ${answers[condition.id] === option ? "border-ink bg-ink text-paper" : "border-rule bg-sheet"}`}
        >
          {option}
        </button>
      ))}
      {gaps.failed.length > 0 ? <p className="text-seal">The policy voids the calculation when an answer is Not met or Not assessed.</p> : null}
    </div>
  );
}
