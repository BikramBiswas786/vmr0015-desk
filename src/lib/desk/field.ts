import { useEffect, useState } from "react";

const KEY = "vmr0015-field-v1";

export type Visit = {
  id: string;
  house: string;
  takenAt: string;
  boil: "yes" | "no";
  fuel: "wood" | "charcoal" | "gas" | "none";
  water: "untested" | "pass" | "fail";
  photo: string;
  status: "in" | "accepted" | "returned";
};

export function countsTowardSample(visit: Visit): boolean {
  return (
    visit.status === "accepted" &&
    visit.water === "pass" &&
    visit.boil === "yes" &&
    (visit.fuel === "wood" || visit.fuel === "charcoal") &&
    visit.photo.length > 0
  );
}

function load(): Visit[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Visit[];
    return Array.isArray(parsed) ? parsed.slice(0, 40) : [];
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
      setVisits((current) => current.slice(0, -1));
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
