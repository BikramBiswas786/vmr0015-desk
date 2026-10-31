import { useEffect, useState } from "react";

const KEY = "vmr0015-desk-v4";

export type Sheet = {
  id: string;
  place: string;
  sectionId: string;
  periodStart: string;
  periodEnd: string;
  householdsEvidence: string;
  boilShare: string;
  fuel: "wood" | "charcoal" | "mixed" | "unknown";
  fNrb: string;
  fNrbSource: "unfccc" | "tool33" | "tool30" | "unknown";
  qualityFailShare: string;
  qpwLitres: string;
  notes: string;
};

export type DeskState = {
  tab: "policy" | "send" | "area" | "people" | "letter" | "link" | "more" | "guide" | "judgment" | "scale" | "sheet" | "next";
  guideStep: number;
  areaPlace: string;
  areaBlock: string;
  waterKind: "jar" | "filter" | "kiosk" | "tap" | "unknown";
  partnerId: string;
  letterKind: "partner" | "verra";
  households: string;
  useSampleRate: boolean;
  ownRate: string;
  priceInr: string;
  sheets: Sheet[];
  done: Record<string, boolean>;
};

export const NEXT_ITEMS = [
  {
    id: "pr",
    title: "Leave pull request 6164 alone",
    body: "It is open and not merged. Do not add the 15-document recordings, or the v3.2 fNRB backup, unless you decide that is the submission.",
  },
  {
    id: "verra",
    title: "Do not call it ready for Verra",
    body: "No VMR0015 project is registered. A dry-run mint is not an issuance.",
  },
  {
    id: "yield",
    title: "Do not quote 4–5 tonnes per household",
    body: "The sample is 0.519 tonnes. The scale tab is the number to show.",
  },
  {
    id: "sale",
    title: "Do not forward-sell credits",
    body: "There is no offtake, no price, and no vintage token a buyer can take.",
  },
  {
    id: "survey",
    title: "A pilot starts with a baseline survey",
    body: "Unsafe source, do they boil, with what fuel, how much water. A drum log is not that survey.",
  },
  {
    id: "fee",
    title: "The commercial line is a technology fee, later",
    body: "Only for a registered project that needs monitoring data in this policy's shape. No client yet.",
  },
] as const;

const EMPTY: DeskState = {
  tab: "policy",
  guideStep: 0,
  areaPlace: "Dakshin Dinajpur",
  areaBlock: "",
  waterKind: "unknown",
  partnerId: "drinkwell",
  letterKind: "partner",
  households: "3000",
  useSampleRate: true,
  ownRate: "",
  priceInr: "",
  sheets: [],
  done: {},
};

export function emptySheet(): Sheet {
  return {
    id: crypto.randomUUID(),
    place: "",
    sectionId: "",
    periodStart: "",
    periodEnd: "",
    householdsEvidence: "",
    boilShare: "",
    fuel: "unknown",
    fNrb: "",
    fNrbSource: "unknown",
    qualityFailShare: "",
    qpwLitres: "",
    notes: "",
  };
}

function load(): DeskState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<DeskState>;
    const tab = parsed.tab === "letter" ? "send" : parsed.tab;
    const known =
      tab === "policy" ||
      tab === "send" ||
      tab === "area" ||
      tab === "people" ||
      tab === "link" ||
      tab === "more" ||
      tab === "guide" ||
      tab === "judgment" ||
      tab === "scale" ||
      tab === "sheet" ||
      tab === "next"
        ? tab
        : "policy";
    const guideStep = typeof parsed.guideStep === "number" && parsed.guideStep >= 0 ? parsed.guideStep : 0;
    const waterKind =
      parsed.waterKind === "jar" ||
      parsed.waterKind === "filter" ||
      parsed.waterKind === "kiosk" ||
      parsed.waterKind === "tap" ||
      parsed.waterKind === "unknown"
        ? parsed.waterKind
        : "unknown";
    return {
      ...EMPTY,
      ...parsed,
      tab: known,
      guideStep,
      areaPlace: typeof parsed.areaPlace === "string" ? parsed.areaPlace : EMPTY.areaPlace,
      areaBlock: typeof parsed.areaBlock === "string" ? parsed.areaBlock : "",
      waterKind,
      partnerId: typeof parsed.partnerId === "string" ? parsed.partnerId : "drinkwell",
      letterKind: parsed.letterKind === "verra" ? "verra" : "partner",
      sheets: Array.isArray(parsed.sheets) ? parsed.sheets : [],
      done: parsed.done && typeof parsed.done === "object" ? parsed.done : {},
    };
  } catch {
    return EMPTY;
  }
}

export function useDesk() {
  const [state, setState] = useState<DeskState>(EMPTY);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(load());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(KEY, JSON.stringify(state));
  }, [state, ready]);

  function patch(partial: Partial<DeskState>) {
    setState((prev) => ({ ...prev, ...partial }));
  }

  return { state, ready, patch, setState };
}

export function datesOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  if (!aStart || !aEnd || !bStart || !bEnd) return false;
  return aStart <= bEnd && bStart <= aEnd;
}
