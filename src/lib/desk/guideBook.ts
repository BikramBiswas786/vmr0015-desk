import type { CheckLine } from "@/lib/desk/review";

const TOPICS: { keys: string[]; title: string; body: string }[] = [
  {
    keys: ["pipe", "public", "network", "tap"],
    title: "Public pipe",
    body: "VMR0015 does not apply where a public network already supplies safe drinking water inside the boundary. If the house already has that pipe, it cannot count.",
  },
  {
    keys: ["filter", "membrane", "ceramic", "name", "technology"],
    title: "What the method calls the filter",
    body: "In the house, the method allows a membrane filter, a ceramic filter, chlorine, a flocculant with disinfectant, or solar disinfection. A drum from a treatment point allows only chlorine, a flocculant with disinfectant, or solar disinfection. The drum must be sealed, or the water must still carry disinfectant.",
  },
  {
    keys: ["boil", "wood", "charcoal", "fuel", "stove"],
    title: "Boiling",
    body: "The baseline is people boiling unsafe water with wood or charcoal. Gas does not count. If an improved stove does all of the boiling, the flat 0.519 tonnes cannot be used, because the policy reduces that baseline.",
  },
  {
    keys: ["water", "test", "ecoli", "germ", "quality"],
    title: "Water test",
    body: "The water has to test safe. In the policy file, if more than 10 percent of samples fail the germ test, that period gets no reductions. A photo of a drum is not a test.",
  },
  {
    keys: ["tool", "tool03", "sampling", "vt0010", "sample"],
    title: "CDM tools in the file",
    body: "The digitised file uses TOOL03, VT0010, and a sampling minimum of 30. It also uses the boil share and the stove efficiency from the survey, when those rows exist.",
  },
  {
    keys: ["cdm", "ams", "equation", "table", "cap", "litre"],
    title: "AMS-III.AV",
    body: "VMR0015 v1.0 revises CDM AMS-III.AV v09.0. The file digitises VMR0015 equation 1, the leakage adjustment, and the fNRB options, plus AMS-III.AV equations 2 to 5, the water cap, and tables 11, 13 and 14.",
  },
  {
    keys: ["fnrb", "leak"],
    title: "fNRB",
    body: "fNRB is the fraction of the wood that is non-renewable. The file under review is v3.1. v3.2 only closes two fNRB input checks and is a backup.",
  },
  {
    keys: ["registry", "serial", "vcu", "issue", "verra"],
    title: "Registry",
    body: "A Verra serial exists only after the registry issues it. A pass on this phone is the questions on this project. It is not a serial. The public lookup is registry.verra.org.",
  },
  {
    keys: ["india", "ccts", "sell", "market", "exchange"],
    title: "Where a tonne can be sold",
    body: "A Verra unit is held on the Verra registry. India's carbon-certificate exchanges are for industrial plants. Safe drinking water is not on the BEE offset list. The same house is not counted twice.",
  },
  {
    keys: ["guardian", "import", "policy", "file"],
    title: "The policy file",
    body: "Download A if the project starts before 1 January 2027, and B if it starts on or after that day. Import that file in Guardian. This page cannot import it.",
  },
  {
    keys: ["who", "field", "photo", "house"],
    title: "Field worker",
    body: "The field worker writes the house, the people, the fuel, the drum or the filter, the water test, and takes the photo. A different person, the checker, accepts it.",
  },
];

export function guideAnswer(question: string, lines: CheckLine[]): { title: string; body: string } {
  const text = question.toLowerCase();
  const hit = TOPICS.find((topic) => topic.keys.some((key) => text.includes(key)));
  const open = lines.filter((line) => !line.pass);
  const project =
    open.length === 0
      ? "On this project, every loaded question passes."
      : `On this project, still open: ${open[0].ask} ${open[0].answer}`;
  if (!hit) {
    return {
      title: "What this guide can answer",
      body: `${project} Ask about the public pipe, the filter name, boiling, the water test, TOOL03, AMS-III.AV, fNRB, the registry, or where a tonne is sold.`,
    };
  }
  return { title: hit.title, body: `${hit.body} ${project}` };
}
