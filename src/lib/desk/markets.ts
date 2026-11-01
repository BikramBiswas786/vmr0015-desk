export type Fit = "rules" | "possible" | "no";

export type MethodRow = {
  id: string;
  name: string;
  body: string;
  unit: string;
  fit: Fit;
  why: string;
};

/** BEE offset list as published on beeindia.gov.in, last updated 7 July 2026. */
export const METHODS: MethodRow[] = [
  {
    id: "vmr",
    name: "VMR0015 v1.0",
    body: "Verra. Active since 31 October 2025.",
    unit: "VCU, issued by the Verra registry",
    fit: "possible",
    why: "This is the method for safe water that replaces boiling with wood or fossil fuel. A house still has to pass the rules. Nothing is issued yet.",
  },
  {
    id: "ams",
    name: "AMS-III.AV v09.0",
    body: "CDM. The rule book under VMR0015.",
    unit: "None on its own under Verra",
    fit: "rules",
    why: "It names the filters, the kiosk, and the public-pipe test. Verra closed it as a standalone method. New projects use VMR0015.",
  },
  {
    id: "ccc",
    name: "CCTS compliance",
    body: "BEE intensity targets for industrial plants.",
    unit: "CCC, from beating a plant target",
    fit: "no",
    why: "Sellers are plants such as cement and aluminium that beat a target. A household and a drum route are not a plant.",
  },
  { id: "en1", name: "BM EN01.001", body: "CCTS offset. Energy.", unit: "CCC, if BEE issues it", fit: "no", why: "Grid-connected renewable electricity. Not drinking water." },
  { id: "en2", name: "BM EN01.002", body: "CCTS offset. Energy.", unit: "CCC, if BEE issues it", fit: "no", why: "Hydrogen from electrolysis. Not drinking water." },
  { id: "en3", name: "BM EN01.003", body: "CCTS offset. Energy.", unit: "CCC, if BEE issues it", fit: "no", why: "Electricity and heat from biomass. Not drinking water." },
  { id: "in1", name: "BM IN02.001", body: "CCTS offset. Industry.", unit: "CCC, if BEE issues it", fit: "no", why: "Energy efficiency and fuel switching in industrial facilities. Not a house." },
  { id: "in2", name: "BM IN02.002", body: "CCTS offset. Industry.", unit: "CCC, if BEE issues it", fit: "no", why: "Hydrogen from biogas methane. Not drinking water." },
  { id: "wa1", name: "BM WA03.001", body: "CCTS offset. Waste.", unit: "CCC, if BEE issues it", fit: "no", why: "Landfill methane recovery. Not drinking water." },
  { id: "wa2", name: "BM WA03.002", body: "CCTS offset. Waste.", unit: "CCC, if BEE issues it", fit: "no", why: "Flaring or use of landfill gas. Not drinking water." },
  { id: "wa3", name: "BM WA03.003", body: "CCTS offset. Waste.", unit: "CCC, if BEE issues it", fit: "no", why: "Compressed biogas. Not drinking water." },
  { id: "ag1", name: "BM AG04.001", body: "CCTS offset. Agriculture.", unit: "CCC, if BEE issues it", fit: "no", why: "Methane from livestock manure at households and small farms. Not drinking water." },
  { id: "ag2", name: "BM AG04.002", body: "CCTS offset. Agriculture.", unit: "CCC, if BEE issues it", fit: "no", why: "Rice cultivation. Not drinking water." },
  { id: "fr1", name: "BM FR05.001", body: "CCTS offset. Forestry.", unit: "CCC, if BEE issues it", fit: "no", why: "Mangrove planting. Not drinking water." },
  { id: "fr2", name: "BM FR05.002", body: "CCTS offset. Forestry.", unit: "CCC, if BEE issues it", fit: "no", why: "Afforestation of land that is not a wetland. Not drinking water." },
];

export const VENUES = [
  {
    name: "Verra registry",
    trades: "Verified Carbon Units, after Verra issues them.",
    who: "The account that holds the serial.",
    href: "https://registry.verra.org/",
    label: "Open the Verra registry",
  },
  {
    name: "Indian Energy Exchange",
    trades: "Carbon Credit Certificates, in the CERC monthly session.",
    who: "An obligated plant that was issued certificates for beating its target.",
    href: "https://www.iexindia.com/",
    label: "Indian Energy Exchange",
  },
  {
    name: "Power Exchange India",
    trades: "Carbon Credit Certificates, in the same monthly session.",
    who: "The same plant accounts. Not a water project.",
    href: "https://www.powerexindia.in/",
    label: "Power Exchange India",
  },
  {
    name: "Hindustan Power Exchange",
    trades: "Carbon Credit Certificates, in the same monthly session.",
    who: "The same plant accounts. Not a water project.",
    href: "https://www.hpxindia.com/",
    label: "Hindustan Power Exchange",
  },
] as const;

export const BEE_LIST = "https://beeindia.gov.in/view_content.php?lid=571&lang=1";
