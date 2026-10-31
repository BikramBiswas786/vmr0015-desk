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

export function verraPacket(): string {
  return `Subject: VMR0015 Guardian policy v3.1, for the methodology file. Not a project registration.

This is not a request to open a project, and not a request to hold any district.

The file is a Hedera Guardian policy for Verra VMR0015 v1.0, the revision of CDM AMS-III.AV v09.0. The submission is v3.1. v3.2 only closes two fNRB input checks and is a backup, not the file under review unless a reviewer asks for it.

Pull request: ${POLICY.prUrl}
State when checked on ${CHECKED}: open, not merged, last updated ${POLICY.updated}. No review was on it.

Import the MGS export, Guardian 3.7.0 or later, and run the integrity test. The file in the pull request says 100 percent, 13 of 13 documents, from a dry-run on ${POLICY.guardianTest}.

v5.0A, projects starting before 1 January 2027
${FILES[0].name}
sha256 ${FILES[0].sha}

v5.0B, projects starting on or after 1 January 2027
${FILES[1].name}
sha256 ${FILES[1].sha}

Sample project inside the file, not a real place:
ex-ante ${POLICY.exAnte} t CO2e a year
ex-post ${POLICY.exPost} t CO2e
mint ${POLICY.mint}
That is ${POLICY.perHouse} t a household a year in the sample, not 4.

The mint is on a Guardian dry-run. It is not a Verra serial. No issuance is requested.

Package: ${POLICY.readmeUrl}
Method: ${POLICY.methodUrl}`;
}

export function companyPacket(partner: Partner | null, area: string): string {
  const who = partner ? partner.name : "your team";
  const place = area.trim();
  const placeLine = place
    ? `A lane named ${place} is on a private notebook. It is not reserved, and it is not part of this file.`
    : "No district is attached to this file.";
  return `Subject: Guardian form for VMR0015. A notebook, not a credit for sale.

${who}: the attached work is a draft policy that checks a safe-drinking-water project the way VMR0015 asks. It is pull request 6164 on hashgraph/guardian. Checked ${CHECKED}: open, not merged.

${placeLine}

What Guardian already did, on a made-up sample, not on a real town: ex-ante ${POLICY.exAnte} t, ex-post ${POLICY.exPost} t, mint ${POLICY.mint}. About ${POLICY.perHouse} t a household a year. A test mint is not a Verra credit. I am not asking you to buy one.

If you already distribute treated water, the useful question is whether the houses boil, with which fuel, and whether the water passes a germ test. Over 10 percent failing that test makes the period zero.

The file to read: ${POLICY.prUrl}

Name:`;
}
