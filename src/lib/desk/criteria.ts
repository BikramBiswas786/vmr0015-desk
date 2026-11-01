/** The seven answers the policy's applicCheck reads. A value starting with "Not met" or "Not assessed" voids the calculation. */
export const CONDITIONS = [
  {
    id: "c2KioskSolarDisinfection",
    ask: "Does a water kiosk use solar disinfection?",
    options: [
      "Not applicable - no water kiosk uses solar disinfection",
      "Met - recontamination measures are in place",
      "Not met",
    ],
  },
  {
    id: "c3SoilFiltrationWells",
    ask: "Does the project use boreholes or wells?",
    options: [
      "Not applicable - no boreholes or wells",
      "Met - well standards and protection demonstrated",
      "Not met",
    ],
  },
  {
    id: "c4aNoPublicNetwork",
    ask: "Before the project, did a public network already supply safe drinking water inside the boundary?",
    options: [
      "Met - no public network supplied SDW to the project boundary",
      "Met - a network exists but does not supply SDW (footnote 4)",
      "Not met",
    ],
  },
  {
    id: "c4bTechnologyStandard",
    ask: "Does a laboratory test or an official notice show the technology meets the performance standard?",
    options: ["Met", "Not met"],
  },
  {
    id: "c4cReplacementAccess",
    ask: "Is the rated life of the appliance shorter than the crediting period?",
    options: [
      "Not applicable - rated life is not shorter than the crediting period",
      "Met - replacement measures documented",
      "Not met",
    ],
  },
  {
    id: "c4dSafeWaterDelivered",
    ask: "Do the appliances deliver microbiologically safe water?",
    options: ["Met", "Not met"],
  },
  {
    id: "vmrReddAssessment",
    ask: "Has the REDD+ overlap been assessed?",
    options: ["Assessed and reported", "Not assessed"],
  },
] as const;

export type CriteriaAnswers = Record<string, string>;

export function voidsCalculation(value: string): boolean {
  return value.startsWith("Not met") || value.startsWith("Not assessed");
}

export function criteriaGaps(answers: CriteriaAnswers): { missing: string[]; failed: string[] } {
  const missing: string[] = [];
  const failed: string[] = [];
  for (const condition of CONDITIONS) {
    const value = answers[condition.id] ?? "";
    if (!value) missing.push(condition.ask);
    else if (voidsCalculation(value)) failed.push(condition.ask);
  }
  return { missing, failed };
}

export function criteriaPass(answers: CriteriaAnswers): boolean {
  const gaps = criteriaGaps(answers);
  return gaps.missing.length === 0 && gaps.failed.length === 0;
}
