import { createServerFn } from "@tanstack/react-start";
import { CONDITIONS } from "@/lib/desk/criteria";
import { DIGITISED, POLICY } from "@/lib/desk/policy";

const PACKET = [
  `Method: ${POLICY.method}, ${POLICY.methodName}. It revises ${POLICY.parent}.`,
  "File under review: v3.1. v3.2 only closes two fNRB input checks and is a backup.",
  "A is for a project that starts before 1 January 2027. B is for a start on or after that day.",
  `Sample in the file, not this town: ex-ante ${POLICY.exAnte} t, ex-post ${POLICY.exPost} t, mint floor ${POLICY.mint}. That is ${POLICY.perHouse} t a household a year, not 4.`,
  "A Guardian dry-run mint is not a Verra serial.",
  ...DIGITISED,
  "A house counts only if: no public safe-water pipe, they boil with wood or charcoal, an improved stove does not do all the boiling, at least one person, the water test passed, and there is a photo.",
  "In the house the method names a membrane filter, a ceramic filter, chlorine, a flocculant with disinfectant, or solar disinfection.",
  "A drum from a treatment point counts only with chlorine, a flocculant with disinfectant, or solar disinfection, and the drum is sealed or disinfectant is still in the water.",
  "If more than 10 percent of samples fail the germ test, that period gets no reductions.",
  "The seven applicability questions:",
  ...CONDITIONS.map((condition) => `${condition.ask} Allowed: ${condition.options.join(" | ")}.`),
  "India's carbon-certificate exchanges are for industrial plants. Safe drinking water is not on the BEE offset list. The same house is not counted on both.",
  "The public lookup after Verra issues a serial is https://registry.verra.org/.",
  "Verra writes the rule for this water method, VMR0015. Later, only Verra can put a serial in the public registry. This phone does not log into Verra. A pass on this phone is not Verra's approval.",
  "Guardian is the program that runs the policy file after someone imports it on Guardian's own site. This phone does not log into Guardian. The Guardian job here only downloads the file.",
  "A name typed on this phone is a label for the person holding the phone. It is not a login to Verra, Guardian, or an exchange, and it does not sell a credit.",
].join("\n");

export function knownAnswer(question: string): string | null {
  const q = question.toLowerCase();
  if (q.includes("verra")) {
    return "Verra writes the rule for this water method, VMR0015. Later, only Verra can put a serial in the public registry. This page does not log into Verra. Next, open Check every question. A pass there is not Verra's approval.";
  }
  if (q.includes("guardian")) {
    return "Guardian is the program that runs the policy file after you import it on Guardian's own site. This phone cannot log in for you. Open the Guardian job and download file A or B.";
  }
  if (q.includes("name") || q.includes("selling") || q.includes("login")) {
    return "A name on this phone is a label. It is not a login to Verra, Guardian, or an exchange, and it does not sell anything. On Market, the next step is Where to sell.";
  }
  return null;
}

export type GuideLine = { ask: string; answer: string; pass: boolean };

export const askGuide = createServerFn({ method: "POST" })
  .validator((input: { question?: string; lines?: GuideLine[] }) => {
    const question = typeof input?.question === "string" ? input.question.trim().slice(0, 500) : "";
    const lines = Array.isArray(input?.lines)
      ? input.lines.slice(0, 24).flatMap((line) => {
          if (!line || typeof line.ask !== "string" || typeof line.answer !== "string") return [];
          return [{ ask: line.ask.slice(0, 240), answer: line.answer.slice(0, 240), pass: line.pass === true }];
        })
      : [];
    return { question, lines };
  })
  .handler(async ({ data }) => {
    if (!data.question) return { ok: false as const, text: "Write a question first." };
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return { ok: false as const, text: "The guide is not available on this server." };
    const project = data.lines.map((line) => `${line.pass ? "Pass" : "Open"}. ${line.ask} ${line.answer}`).join("\n");
    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "grok-4.5",
        max_tokens: 350,
        temperature: 0.2,
        messages: [
          {
            role: "system",
            content:
              "You guide a person who is not a technician. Answer only their question, in plain sentences, under 120 words. Use the packet. The packet says what Verra is and what Guardian is. Never say Verra has approved this project or issued a serial. Do not answer a different question from the one they asked.",
          },
          { role: "user", content: `Packet:\n${PACKET}\n\nThis project:\n${project || "No houses locked."}\n\nQuestion: ${data.question}` },
        ],
      }),
    });
    if (!res.ok) return { ok: false as const, text: "The guide could not answer just now. Try again." };
    const body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const text = body.choices?.[0]?.message?.content?.trim() ?? "";
    return { ok: true as const, text: text || "No answer came back." };
  });
