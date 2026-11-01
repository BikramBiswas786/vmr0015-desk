import { CONDITIONS, criteriaGaps, type CriteriaAnswers } from "@/lib/desk/criteria";
import { ruleGap, rulePass, type Visit } from "@/lib/desk/field";
import { POLICY, policyIssue } from "@/lib/desk/policy";

export type CheckLine = { ask: string; answer: string; pass: boolean };

export function vmrCheck(answers: CriteriaAnswers, houses: Visit[]): CheckLine[] {
  const gaps = criteriaGaps(answers);
  const lines: CheckLine[] = CONDITIONS.map((condition) => {
    const value = answers[condition.id] ?? "";
    const missing = !value;
    const failed = value.startsWith("Not met") || value.startsWith("Not assessed");
    return {
      ask: condition.ask,
      answer: missing ? "Not answered." : value,
      pass: !missing && !failed,
    };
  });
  if (houses.length === 0) {
    lines.push({ ask: "Is there a house in the description?", answer: "No house is locked yet.", pass: false });
  }
  for (const house of houses) {
    const gap = rulePass(house) ? "" : ruleGap(house);
    lines.push({
      ask: `${house.house}. Does this house pass VMR0015?`,
      answer: gap || `${house.persons} people. ${house.fuel}. ${house.shape === "kiosk" ? "Drum" : "Filter"}, ${house.treatment}. Water passed. Photo is there.`,
      pass: !gap,
    });
  }
  const issued = policyIssue(houses.filter(rulePass).length);
  lines.push({
    ask: "What is the sample at the policy rate?",
    answer: `${issued.sum} t. ${POLICY.perHouse} t for each house that passed. ${POLICY.method}, under ${POLICY.parent}.`,
    pass: houses.some(rulePass),
  });
  lines.push({
    ask: "Can the same house also be sold as an Indian carbon certificate?",
    answer: "No. The BEE offset list has no safe-drinking-water method. One house is counted once.",
    pass: true,
  });
  if (gaps.missing.length || gaps.failed.length) {
    lines.push({
      ask: "Are the seven applicability answers complete?",
      answer: gaps.missing.length ? `Still open: ${gaps.missing[0]}` : `Fails: ${gaps.failed[0]}`,
      pass: false,
    });
  }
  return lines;
}
