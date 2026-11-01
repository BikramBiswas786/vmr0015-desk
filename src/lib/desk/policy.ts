import type { Partner } from "@/lib/desk/partners";

/** Checked against hashgraph/guardian pull 6164 on 31 October 2026.
 *  The dry-run figures are the ones printed in that file, from 21 October 2026.
 *  This phone did not mint again.
 */
export const CHECKED = "31 October 2026";

export const POLICY = {
  method: "VMR0015 v1.0",
  methodName: "Low greenhouse gas emitting safe drinking water production systems",
  parent: "AMS-III.AV v09.0",
  submission: "v3.1",
  backup: "v3.2",
  pr: 6164,
  prUrl: "https://github.com/hashgraph/guardian/pull/6164",
  readmeUrl:
    "https://github.com/BikramBiswas786/guardian/blob/feat/vmr0015-dryrun-validated/Methodology%20Library/DLT%20Earth%20Methodology%20Bounty%20Program/Emission%20Reductions%20from%20Safe%20Drinking%20Water%20Supply/README.md",
  methodUrl:
    "https://verra.org/methodologies/vmr0015-revisiontoams-iii-av-low-greenhouse-gas-emitting-safe-drinking-water-production-systems-v1-0/",
  state: "open",
  merged: false,
  updated: "23 October 2026",
  reviews: 0,
  comments: 0,
  head: "8c9bcd5e0f3d",
  guardianTest: "3.7.1-rc, 21 October 2026",
  blocks: 219,
  mathBlocks: 2,
  exAnte: "1,666.620262475",
  exPost: "1,556.947181413",
  mint: "1,556",
  perHouse: "0.519",
} as const;

export function policyIssue(count: number): { sum: string; whole: number } {
  const sum = count * Number(POLICY.perHouse);
  return { sum: sum.toFixed(3), whole: Math.floor(sum + 1e-9) };
}

export const GUARDIAN_URL = "https://www.climission.com/mgs";

export const FILES = [
  {
    id: "A",
    version: "v3.1",
    importThis: true,
    when: "Starts before 1 January 2027",
    guardianName: "VMR0015 Safe Drinking Water dMRV (VCS v5.0A)",
    name: "VMR0015_Safe_Drinking_Water_dMRV_v3.1_VCS-v5.0A_with_integrity_test.policy",
    href: "/policies/VMR0015_Safe_Drinking_Water_dMRV_v3.1_VCS-v5.0A_with_integrity_test.policy",
    sha: "5d22de23fe65b9028f552b533035c8eb2aa349bf73fd9903543ec27d01eaa2f2",
    size: "2.2 MB",
  },
  {
    id: "B",
    version: "v3.1",
    importThis: true,
    when: "Starts on or after 1 January 2027",
    guardianName: "VMR0015 Safe Drinking Water dMRV (VCS v5.0B)",
    name: "VMR0015_Safe_Drinking_Water_dMRV_v3.1_VCS-v5.0B_with_integrity_test.policy",
    href: "/policies/VMR0015_Safe_Drinking_Water_dMRV_v3.1_VCS-v5.0B_with_integrity_test.policy",
    sha: "18b50f669d62ca7df9bae418641938fa7290c2d64cd6245de7393277adbaaa88",
    size: "2.0 MB",
  },
  {
    id: "A",
    version: "v3.2",
    importThis: false,
    when: "Backup. Same templates as v3.1 A, with two fNRB checks closed.",
    guardianName: "VMR0015 Safe Drinking Water dMRV (VCS v5.0A), timestamped export",
    name: "VMR0015_Safe_Drinking_Water_dMRV_v3.2_VCS-v5.0A_with_integrity_test.policy",
    href: "/policies/VMR0015_Safe_Drinking_Water_dMRV_v3.2_VCS-v5.0A_with_integrity_test.policy",
    sha: "20d5c8b04bfb9e5bc84b3318a831ec78107313c72ed4b7bd8a70d58a7311c5f9",
    size: "2.1 MB",
  },
  {
    id: "B",
    version: "v3.2",
    importThis: false,
    when: "Backup. Same templates as v3.1 B, with two fNRB checks closed.",
    guardianName: "VMR0015 Safe Drinking Water dMRV (VCS v5.0B), timestamped export",
    name: "VMR0015_Safe_Drinking_Water_dMRV_v3.2_VCS-v5.0B_with_integrity_test.policy",
    href: "/policies/VMR0015_Safe_Drinking_Water_dMRV_v3.2_VCS-v5.0B_with_integrity_test.policy",
    sha: "086d5b1bfccc7b6cb776ea0fcad04a500f93ad18215858b990f5aa686b9f1f0c",
    size: "1.9 MB",
  },
] as const;

export const CHAIN = [
  "Project proponent account, then the registry approves it.",
  "Verifier account, then the registry approves it.",
  "Project description. The ex-ante sum runs here.",
  "Validation report. The verifier’s own id has to match.",
  "Registry registers the project only if the opinion is Validated.",
  "Monitoring report. Overlapping dates are refused. The ex-post sum runs here.",
  "Registry approves the monitoring report.",
  "Verification report. It needs a calculated ex-post result.",
  "The proponent asks for issuance.",
  "The registry mints the floor of the smaller of the two sums. One mint per report.",
] as const;

export const DIGITISED = [
  "VMR0015 equation 1, the leakage adjustment, and the fNRB options.",
  "AMS-III.AV equations 2 to 5, the water cap, and tables 11, 13 and 14.",
  "Over 10 percent failing the germ test gives no reductions for the period.",
  "TOOL03, VT0010, and the sampling minimum of 30.",
  "Boil share and stove efficiency from the survey, when the survey rows are there.",
] as const;

export function guardianMail(): string {
  return `To: post this as a comment on the pull request. There is no separate Guardian inbox in this note.

Subject: Feedback requested on draft VMR0015 policy v3.1, before any rollout. Not a request to merge.

I am Bikram Biswas. I prepared the draft Guardian policy in pull request 6164. I also built a field notebook that collects house answers. I am writing before I ask any water distributor to use either one.

I did not write Verra methodology VMR0015. Verra did. The file is a draft digitisation of that methodology. The pull request is open. It is not merged. The file's own version field is Dry Run. A dry-run mint is not a Verra serial.

Pull request: ${POLICY.prUrl}
Field notebook, for context only: https://vmr0015-policy-privacy-rebels-projects.vercel.app
File A, projects starting before 1 January 2027: ${FILES[0].name}
sha256 ${FILES[0].sha}
File B, projects starting on or after 1 January 2027: ${FILES[1].name}
sha256 ${FILES[1].sha}

Please comment on the file. I am not asking you to merge it, to import the website, or to treat the notebook as a Guardian project.

Bikram Biswas
Balurghat, Dakshin Dinajpur`;
}

export function verraPacket(): string {
  return `To: a Verra methodology contact, if you have one. Do not send this to hubsupport@verra.org. That address is for Project Hub access after an account is approved.

Subject: Draft digitisation of VMR0015. Feedback only. Not a project. Not a registration request.

I am Bikram Biswas. I prepared a draft Hedera Guardian policy for your published methodology VMR0015 v1.0, the revision of CDM AMS-III.AV. I did not write the methodology. I also built a field notebook for houses that boil drinking water.

The policy file is pull request 6164 on hashgraph/guardian. It is open. It is not merged. I am not asking Verra to open a project, to hold any district, or to issue a credit. No registry account has been approved for this work.

Before I show the notebook to water distributors, I am asking whether Verra has a channel for comments on a draft digitisation. If the answer is that you only review projects through the registry, I will not send the website again.

Pull request: ${POLICY.prUrl}
Method: ${POLICY.methodUrl}
Notebook: https://vmr0015-policy-privacy-rebels-projects.vercel.app

India's offset-mechanism list, on the Bureau of Energy Efficiency page last updated 7 July 2026, does not include safe drinking water. I am not claiming this draft is an Indian compliance credit.

Bikram Biswas
Balurghat, Dakshin Dinajpur`;
}

export function companyPacket(partner: Partner | null, area: string): string {
  const who = partner ? partner.name : "the person who distributes the water";
  const place = area.trim();
  return `To: ${who}

Subject: A question before any carbon work. Not a credit offer.

I am Bikram Biswas, in Balurghat. I prepared a draft form for Verra's safe-drinking-water methodology, and a notebook that asks whether a house boils drinking water with wood or charcoal. I have not rolled it out. I am asking you before I do.

${place ? `The name I have written so far is ${place}. That name is not reserved.` : "No area is reserved."}

I am not asking you to buy a credit. There is no serial. India's offset-mechanism list, on the Bureau of Energy Efficiency page last updated 7 July 2026, does not include safe drinking water, so this is not an offer under that scheme.

If you already treat water and send it out in drums, the useful question is whether I may walk a few houses on your route and record the fuel, the people, and a photo. You can refuse. Nothing is owed.

The draft file, open and not merged: ${POLICY.prUrl}

Bikram Biswas
Balurghat, Dakshin Dinajpur`;
}
