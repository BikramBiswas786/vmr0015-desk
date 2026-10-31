import { createServerFn } from "@tanstack/react-start";

const README =
  "https://raw.githubusercontent.com/BikramBiswas786/guardian/8c9bcd5e0f3d183eb4a9a2ffb6ba9f67b3373aeb/Methodology%20Library/DLT%20Earth%20Methodology%20Bounty%20Program/Emission%20Reductions%20from%20Safe%20Drinking%20Water%20Supply/README.md";
const PR = "https://github.com/hashgraph/guardian/pull/6164";
const MARK = "VMR0015 v1.0 Safe Drinking Water dMRV: v3.1 package";

export type DeskLink = {
  policyOnFile: boolean;
  pr: "open" | "merged" | "closed" | "unknown";
  error: string;
};

export const readDeskLink = createServerFn({ method: "GET" }).handler(async (): Promise<DeskLink> => {
  try {
    const [readme, pr] = await Promise.all([
      fetch(README, { headers: { "User-Agent": "vmr0015-desk" } }),
      fetch(PR, { headers: { "User-Agent": "Mozilla/5.0", Accept: "text/html" } }),
    ]);
    const readmeText = readme.ok ? await readme.text() : "";
    const prText = pr.ok ? await pr.text() : "";
    let status: DeskLink["pr"] = "unknown";
    if (prText.includes('data-status="pullOpened"')) status = "open";
    else if (prText.includes('data-status="pullMerged"')) status = "merged";
    else if (prText.includes('data-status="pullClosed"')) status = "closed";
    if (!readme.ok && !pr.ok) {
      return { policyOnFile: false, pr: "unknown", error: "The file could not be read just now." };
    }
    return { policyOnFile: readmeText.includes(MARK), pr: status, error: "" };
  } catch {
    return { policyOnFile: false, pr: "unknown", error: "The file could not be read just now." };
  }
});
