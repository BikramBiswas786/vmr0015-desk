import { useEffect, useState } from "react";

const KEY = "vmr0015-field-v1";

export type Visit = {
  id: string;
  house: string;
  takenAt: string;
  boil: "yes" | "no";
  fuel: "wood" | "charcoal" | "gas" | "none";
  water: "untested" | "pass" | "fail";
  publicPipe: "unknown" | "yes" | "no";
  shape: "unset" | "house" | "kiosk";
  treatment: "unknown" | "membrane" | "ceramic" | "chlorine" | "flocculant" | "solar" | "other";
  sealed: "yes" | "no";
  persons: number;
  stove: "unset" | "none" | "some" | "all";
  photo: string;
  status: "in" | "accepted" | "returned";
};

const HOUSE_TREATMENTS = new Set(["membrane", "ceramic", "chlorine", "flocculant", "solar"]);
const KIOSK_TREATMENTS = new Set(["chlorine", "flocculant", "solar"]);

export function rulePass(visit: Visit): boolean {
  const fuelOk = visit.boil === "yes" && (visit.fuel === "wood" || visit.fuel === "charcoal");
  const waterOk = visit.water === "pass" && visit.photo.length > 0 && visit.publicPipe === "no";
  const houseOk = visit.shape === "house" && HOUSE_TREATMENTS.has(visit.treatment);
  const kioskOk = visit.shape === "kiosk" && KIOSK_TREATMENTS.has(visit.treatment) && visit.sealed === "yes";
  const peopleOk = visit.persons >= 1 && (visit.stove === "none" || visit.stove === "some");
  return fuelOk && waterOk && peopleOk && (houseOk || kioskOk);
}

export function ruleGap(visit: Visit): string {
  if (visit.publicPipe === "yes") return "A public safe-water pipe is already there. The methodology does not apply.";
  if (visit.publicPipe !== "no") return "Say whether a public safe-water pipe is already there.";
  if (visit.boil !== "yes" || (visit.fuel !== "wood" && visit.fuel !== "charcoal")) return "The house must boil with wood or charcoal.";
  if (visit.persons < 1) return "Write how many people live here. The survey row requires it.";
  if (visit.stove === "all") return "An improved stove is used for all the boiling. The policy reduces that baseline, so this house cannot take the flat 0.519 tonnes.";
  if (visit.stove === "unset") return "Say whether an improved stove is used for boiling.";
  if (visit.water !== "pass") return "The water test has not passed.";
  if (!visit.photo) return "A photo is missing.";
  if (visit.shape === "kiosk" && !KIOSK_TREATMENTS.has(visit.treatment)) return "A drum run counts only if the point uses chlorine, a flocculant powder, or solar.";
  if (visit.shape === "kiosk" && visit.sealed !== "yes") return "The drum must be sealed, or the water must still carry disinfectant.";
  if (visit.shape === "house" && !HOUSE_TREATMENTS.has(visit.treatment)) return "The house filter is not one the methodology names.";
  if (visit.shape === "unset") return "Say whether this is a house filter or a drum from a treatment point.";
  return "";
}

export function countsTowardSample(visit: Visit): boolean {
  return visit.status === "accepted" && rulePass(visit);
}

export function parseVisit(row: unknown): Visit | null {
  if (!row || typeof row !== "object") return null;
  const item = row as Partial<Visit>;
  if (typeof item.id !== "string" || typeof item.house !== "string" || !item.house.trim()) return null;
  if (item.id.length > 80 || item.house.length > 120) return null;
  const photo = typeof item.photo === "string" ? item.photo : "";
  if (photo.length > 150_000) return null;
  return {
    id: item.id,
    house: item.house.trim(),
    takenAt: typeof item.takenAt === "string" ? item.takenAt.slice(0, 40) : "",
    boil: asChoice(item.boil, ["yes", "no"] as const, "no"),
    fuel: asChoice(item.fuel, ["wood", "charcoal", "gas", "none"] as const, "none"),
    water: asChoice(item.water, ["untested", "pass", "fail"] as const, "untested"),
    publicPipe: asChoice(item.publicPipe, ["unknown", "yes", "no"] as const, "unknown"),
    shape: asChoice(item.shape, ["unset", "house", "kiosk"] as const, "unset"),
    treatment: asChoice(item.treatment, ["unknown", "membrane", "ceramic", "chlorine", "flocculant", "solar", "other"] as const, "unknown"),
    sealed: asChoice(item.sealed, ["yes", "no"] as const, "no"),
    persons: typeof item.persons === "number" && item.persons > 0 ? Math.min(30, Math.round(item.persons)) : 0,
    stove: asChoice(item.stove, ["unset", "none", "some", "all"] as const, "unset"),
    photo,
    status: asChoice(item.status, ["in", "accepted", "returned"] as const, "in"),
  };
}

function asChoice<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return typeof value === "string" && (allowed as readonly string[]).includes(value) ? (value as T) : fallback;
}

function load(): Visit[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown[];
    if (!Array.isArray(parsed)) return [];
    return parsed.slice(0, 500).flatMap((row) => {
      const visit = parseVisit(row);
      return visit ? [visit] : [];
    });
  } catch {
    return [];
  }
}

export function useVisits() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setVisits(load());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(visits));
    } catch {
      // A shared list can be larger than this phone can store. Keep it in memory.
    }
  }, [visits, ready]);

  return { visits, setVisits, ready };
}

export function compressPhoto(file: File): Promise<string> {
  return createImageBitmap(file).then((bitmap) => {
    const max = 480;
    const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    return canvas.toDataURL("image/jpeg", 0.62);
  });
}
