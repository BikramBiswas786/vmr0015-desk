export type Partner = {
  id: string;
  name: string;
  org: string;
  place: string;
  what: string;
  email: string;
  phone: string;
  url: string;
};

/** Public contacts only. None of these is a Verra desk, and none has reserved a district. */
export const PARTNERS: Partner[] = [
  {
    id: "drinkwell",
    name: "Drinkwell",
    org: "WIST Water Solutions Pvt Ltd",
    place: "Maheshtala, Kolkata",
    what: "Plants that take arsenic, fluoride and iron out of water, and water ATMs. They are in West Bengal. They sell treated water. They do not issue a credit.",
    email: "contact@drinkwell.com",
    phone: "+91 89100 19518",
    url: "https://www.drinkwell.com/",
  },
  {
    id: "swn",
    name: "Safe Water Network",
    org: "iJal stations",
    place: "India. Ask if any station is near your lane.",
    what: "Kiosks that sell treated drinking water by the container. Write through their site. No inbox is copied here, so nothing is invented.",
    email: "",
    phone: "",
    url: "https://safewaternetwork.org/",
  },
];
