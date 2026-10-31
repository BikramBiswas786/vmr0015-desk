import type { Partner } from "@/lib/desk/partners";

export function partnershipLetter(partner: Partner | null, area: string): string {
  const who = partner ? partner.name : "the water project";
  const place = area.trim() || "the lane I am looking at";
  return `Subject: A notebook for safe drinking water. Not a credit offer.

I keep a draft of the VMR0015 form for safe drinking water. It runs as a draft on Guardian. The file in review is pull request 6164 on hashgraph/guardian. It is open. It is not merged. It is not a registered Verra project.

I am not writing to reserve ${place}. No office holds a district for a method. I am not asking ${who} to buy a credit, and I cannot sell one.

The form asks whether a house boiled drinking water, with which fuel, how much safe water arrived, and whether a lab found germs. If the germ test fails the line, the sum is zero. The example inside the form is about 0.519 tonnes a household a year, not four. A Guardian test mint is not a Verra serial.

If you already distribute treated water and want to see that form, I can show it. I am not asking for a fee in this letter.

Name:
${place}`;
}

export function verraNote(area: string): string {
  const place = area.trim() || "a lane in West Bengal";
  return `Subject: Not a project registration. Not a request to hold a district.

This note is about a draft digitisation of VMR0015, safe drinking water, in pull request 6164 on hashgraph/guardian. The pull request is open. It is not merged. No project is registered. No issuance is requested.

${place} is not reserved. This is not a claim on that area. A dry-run on Guardian is not a Verra credit.

Please do not open a project file from this note.`;
}
