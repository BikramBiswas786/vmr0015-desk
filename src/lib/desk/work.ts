import { useEffect, useState } from "react";
import { countsTowardSample, type Visit } from "@/lib/desk/field";
import type { CriteriaAnswers } from "@/lib/desk/criteria";

const KEY = "vmr0015-work-v1";

export type Stage = "open" | "described" | "validated" | "monitoring" | "verified" | "issued";

export type Offer = {
  institution: string;
  tonnes: string;
  contact: string;
  at: string;
};

export type Work = {
  name: string;
  starts: string;
  setId: "A" | "B";
  stage: Stage;
  visitIds: string[];
  chain: string;
  plant: string;
  criteria: CriteriaAnswers;
  validationNote: string;
  monitoringNote: string;
  issuedSum: string;
  issuedWhole: number;
  issuedAt: string;
  serial: string;
  offers: Offer[];
};

export const EMPTY_WORK: Work = {
  name: "",
  starts: "",
  setId: "A",
  stage: "open",
  visitIds: [],
  chain: "",
  plant: "",
  criteria: {},
  validationNote: "",
  monitoringNote: "",
  issuedSum: "",
  issuedWhole: 0,
  issuedAt: "",
  serial: "",
  offers: [],
};

const STAGES: Stage[] = ["open", "described", "validated", "monitoring", "verified", "issued"];

export function isStage(value: unknown): value is Stage {
  return typeof value === "string" && STAGES.includes(value as Stage);
}

function criteriaOf(value: unknown): CriteriaAnswers {
  if (!value || typeof value !== "object") return {};
  const out: CriteriaAnswers = {};
  for (const [key, item] of Object.entries(value)) {
    if (typeof item === "string") out[key] = item;
  }
  return out;
}

export function loadWork(): Work {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return EMPTY_WORK;
    const parsed = JSON.parse(raw) as Partial<Work>;
    return {
      ...EMPTY_WORK,
      ...parsed,
      setId: parsed.setId === "B" ? "B" : "A",
      stage: isStage(parsed.stage) ? parsed.stage : "open",
      visitIds: Array.isArray(parsed.visitIds) ? parsed.visitIds.filter((id) => typeof id === "string") : [],
      chain: typeof parsed.chain === "string" ? parsed.chain : "",
      plant: typeof parsed.plant === "string" ? parsed.plant : "",
      criteria: criteriaOf(parsed.criteria),
      monitoringNote: typeof parsed.monitoringNote === "string" ? parsed.monitoringNote : "",
      issuedSum: typeof parsed.issuedSum === "string" ? parsed.issuedSum : "",
      issuedWhole: typeof parsed.issuedWhole === "number" ? parsed.issuedWhole : 0,
      issuedAt: typeof parsed.issuedAt === "string" ? parsed.issuedAt : "",
      serial: typeof parsed.serial === "string" ? parsed.serial : "",
      offers: Array.isArray(parsed.offers) ? parsed.offers.slice(0, 20) : [],
    };
  } catch {
    return EMPTY_WORK;
  }
}

export function useWork() {
  const [work, setWork] = useState<Work>(EMPTY_WORK);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setWork(loadWork());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(KEY, JSON.stringify(work));
  }, [work, ready]);

  return { work, setWork, ready };
}

export function lockedVisits(work: Work, visits: Visit[]): Visit[] {
  const wanted = new Set(work.visitIds);
  return visits.filter((visit) => wanted.has(visit.id) && countsTowardSample(visit));
}

export async function chainHash(visits: Visit[]): Promise<string> {
  const body = visits
    .map((visit) =>
      [visit.id, visit.house, visit.takenAt, visit.persons, visit.stove, visit.boil, visit.fuel, visit.water, visit.publicPipe, visit.shape, visit.treatment, visit.sealed, visit.status, visit.photo].join("|"),
    )
    .join("\n");
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(body));
  return [...new Uint8Array(buf)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export const STAGE_LINE: Record<Stage, string> = {
  open: "Houses are still being collected.",
  described: "The developer has locked a project description.",
  validated: "The checker has validated that description.",
  monitoring: "A monitoring note is in, waiting on the checker.",
  verified: "The VVB has given a positive verification opinion. Verra has not approved it and has not deposited VCUs.",
  issued: "A number was written in this desk. It is not a VCU serial.",
};
