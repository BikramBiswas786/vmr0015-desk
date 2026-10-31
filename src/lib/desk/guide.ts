export type GuideWhen = "now" | "later" | "never";

export type GuideStep = {
  id: string;
  when: GuideWhen;
  title: string;
  not: string;
  body: string[];
};

export const GUIDE: GuideStep[] = [
  {
    id: "start",
    when: "now",
    title: "No money is the right place to start",
    not: "Do not borrow. Do not promise a share of a credit.",
    body: [
      "A credit costs money you do not have. A lab test costs money. A letter to Verra costs money and gets you nothing.",
      "Walking to thirty houses and writing what they drink is free. Do that after these cards, not before. Do it in your own name. Do not use anyone else's paper, or anyone else's list.",
    ],
  },
  {
    id: "policy",
    when: "now",
    title: "The policy is a form, not a mine",
    not: "The policy does not earn. It only refuses a bad number, or adds a good one.",
    body: [
      "VMR0015 is a list of questions and a sum. It asks whether the family boiled drinking water, with which fuel, how much safe water they got, and whether a lab found germs. If the answers fail, the sum is zero.",
      "Your file is a draft in a review queue: pull request 6164. Reviewers have not accepted it. Even an accepted form is not a project in Balurghat. It is the blank form a project might use later.",
    ],
  },
  {
    id: "words",
    when: "now",
    title: "Six words cover the whole trade",
    not: "A token picture, a district name, and your job are not these words.",
    body: [
      "Boil — they heat water before they drink it. Fuel — wood, charcoal, or gas. Tap — a public pipe at the house.",
      "Germ test — a lab looks for E. coli. Checker — a stranger, paid to say the file is true. Serial — a number Verra writes, later, if the owner paid and the checker passed.",
      "A buyer can use only a serial. You do not have one.",
    ],
  },
  {
    id: "app",
    when: "now",
    title: "The app is already made",
    not: "Do not start a second app that mints or takes payment.",
    body: [
      "This desk is the app. Field is one house. Scale is the sample sum: about half a tonne a house in the example project, not four. Note is the ruling on the big money story. Next is what you still must not do.",
      "A shop app would be a lie. There is nothing to sell. Build nothing else until a real project exists. That is not this year.",
    ],
  },
  {
    id: "guardian",
    when: "later",
    title: "Leave Guardian unconnected",
    not: "Do not connect Guardian so this app can mint.",
    body: [
      "Guardian is the website where this form can be run. A test there already summed a made-up project and printed 1,556 play tokens. Those tokens are not money.",
      "Connecting the phone would mean sending real family answers to that website. That needs a published policy, a project owner with an account, and true numbers. You have a draft. You do not have the owner or the numbers.",
      "The day to connect is the day that owner asks for the notebook. They pay a fee for the tool. You still do not press Mint.",
    ],
  },
  {
    id: "district",
    when: "never",
    title: "You cannot book the district",
    not: "Do not say booked, claimed, or mine. Not on a form, not to a buyer, not at the office.",
    body: [
      "There is no counter that reserves Dakshin Dinajpur. Verra will not write your name on Balurghat. Guardian will not. Hedera will not.",
      "If you announce that the district is taken, it is only a sentence. Another person can walk the same lane tomorrow. What you can keep is your own notebook, and only the houses you actually saw.",
    ],
  },
  {
    id: "send",
    when: "now",
    title: "Where a paper goes",
    not: "There is no address that turns a district into a holding.",
    body: [
      "Verra: send nothing. Guardian: send nothing new. The pull request: leave it.",
      "A person who already carries water: ask only to be introduced to houses they already serve. Promise no pay from carbon.",
      "A water company: send nothing until thirty lines are in Field. Then send the count, not a price. A buyer: send nothing, until a serial exists. You will not be the one selling it.",
    ],
  },
  {
    id: "verra",
    when: "later",
    title: "Verra is last",
    not: "Do not mail Verra to reserve Balurghat, and do not ask them when you will be paid.",
    body: [
      "Verra keeps the serials. They open a file when a project owner submits a description and pays. They do not open a file because a district wants to be first.",
      "You write to them only if you become that owner, with money for the fee and for a checker. With no money, you do not write. If a company owns the project later, their staff writes. You might only be the person with the notebook.",
    ],
  },
  {
    id: "tokens",
    when: "never",
    title: "Do not sell the token",
    not: "Do not offer a token, a future token, or a percentage of one.",
    body: [
      "The 1,556 figure is the sample story, not your town. Those tokens cannot be spent in a shop. A company cannot strike them off a list.",
      "A real sale is a transfer of a Verra serial, usually through a broker, after a checker has signed. The project owner sells. You would be paid, if at all, a fee for keeping numbers clean. No one is paying that fee today.",
    ],
  },
  {
    id: "trust",
    when: "now",
    title: "Why they buy, and why they trust",
    not: "They do not buy because a district is large, or because people boil. Many places boil.",
    body: [
      "A company buys when it must show a tonne that was really cut, then strike the serial so no one else can show the same tonne. They pay a broker for a serial already on Verra’s list. They do not pay a person for a plan.",
      "They trust the method, the lab slip, the checker’s name, and the serial. They do not trust an app, a test token, or a chair in an office. Your only hold on trust is that this form goes to zero when the germ test fails.",
    ],
  },
  {
    id: "list",
    when: "now",
    title: "Do only this",
    not: "Not a letter. Not a connection. Not a sale. Not a district claim.",
    body: [
      "Write a line only for a house you see: boil, fuel, and tap. If you have not seen the house, leave the line blank.",
      "Leave the lab until someone else pays, or until you can spare the fee without borrowing. If the drum water is not tested, do not call it safe. If few houses boil, stop. The policy waits in the review queue. You do not push it.",
    ],
  },
];

export const WHEN_LABEL: Record<GuideWhen, string> = {
  now: "Now",
  later: "Not yet",
  never: "Do not",
};
