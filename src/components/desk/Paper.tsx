const SOURCES = [
  ["Guardian, what a policy is", "https://dev.guardian.hedera.com/"],
  ["VM0033 API walkthrough, a different methodology", "https://dev.guardian.hedera.com/guardian/tutorials/vm0033-api-workthrough"],
  ["Managed Guardian Service", "https://docs.guardianservice.app/overview/key-features-of-managed-guardian-service-mgs"],
  ["VMR0015 on Verra, active 31 October 2025", "https://verra.org/methodologies/vmr0015-revisiontoams-iii-av-low-greenhouse-gas-emitting-safe-drinking-water-production-systems-v1-0/"],
  ["Verra Project Hub", "https://verra.org/verra-project-hub/"],
  ["BEE offset methodologies, list of 22 May 2026", "https://www.beeindia.gov.in/show_content.php?lang=1&level=2&ls_id=737&lid=640"],
  ["ICAP, Indian Carbon Credit Trading Scheme", "https://icapcarbonaction.com/en/ets/indian-carbon-credit-trading-scheme"],
  ["Digitising is not an endorsement", "https://www.dltearth.com/bounty-programme"],
];

export function Paper() {
  return (
    <article className="mt-4 space-y-4 text-sm leading-relaxed">
      <p className="text-xs font-medium tracking-widest text-seal uppercase">Read 1 November 2026</p>
      <h2 className="font-serif text-2xl leading-tight">Ground, first</h2>
      <p>
        The first record is a house that boils drinking water with wood. The person at the door photographs the filter or the drum that replaces that boiling, and writes three facts: they boil, the fuel, and whether the water test passed. A photo with no test is not a line the checker can accept.
      </p>
      <p>
        That line is the start of a Verra VMR0015 project description. It is not, by itself, a credit, and it is not a certificate under India’s Carbon Credit Trading Scheme.
      </p>
      <h2 className="font-serif text-2xl leading-tight">India and Verra are two markets</h2>
      <p>
        The Bureau of Energy Efficiency administers the Carbon Credit Trading Scheme. Its compliance side sets intensity targets for industrial plants, such as cement and aluminium. A household is not an obligated plant. The offset side can issue Carbon Credit Certificates only against a methodology BEE has published. The list on BEE’s site, updated 22 May 2026, is eight methodologies: grid renewable power, two hydrogen methods, industrial energy efficiency, two landfill-gas methods, household manure methane, and mangrove planting. Safe drinking water is not on that list.
      </p>
      <p>
        ICAP records that this scheme is not linked to any other carbon market, and that offsets are not used to meet the compliance targets. The same houses must not be sent to both. One registry, one sale, after that registry has issued the unit.
      </p>
      <h2 className="font-serif text-2xl leading-tight">The path from the house to Verra</h2>
      <p>
        The crew’s notes stay on the phone until a developer locks them. A checker accepts only a passed water test. The lock gets a hash. The Verra door copies a packet. A person then asks Verra for Project Hub access and types that packet into VMR0015, which has been active since 31 October 2025. A validation body checks it. The registry, not this desk, issues a serial. Only then can a buyer take that serial.
      </p>
      <h2 className="font-serif text-2xl leading-tight">What this is for</h2>
      <p>
        A project developer who gives people a low-emission way to get safe drinking water, and who must follow Verra’s VMR0015, needs the same survey, the same sums, and a checker who can send the file back. That is the use. A household does not use it. A buyer does not buy from it.
      </p>
      <h2 className="font-serif text-2xl leading-tight">Why Guardian exists</h2>
      <p>
        Guardian’s own pages describe a policy as the methodology turned into software: forms, roles, and calculations, with the record kept on Hedera. They also say that turning one long methodology into software used to cost on the order of $500,000 to $1 million. The open engine is the alternative to paying that for every methodology.
      </p>
      <p>
        Managed Guardian Service hosts that engine. Its docs describe a policy workflow, an indexer, and a way to pay for Hedera transactions without holding the keys. They do not say that the service issues a Verra credit.
      </p>
      <h2 className="font-serif text-2xl leading-tight">What the file in this app contains</h2>
      <p>
        The v3.1 A policy, read from the file, is named “VMR0015 Safe Drinking Water dMRV (VCS v5.0A)”. Its version field is “Dry Run”. The roles inside it are Project Proponent and VVB. The owner is the Standard Registry.
      </p>
      <p>
        Its own description of the flow is: profiles, a project description with the ex-ante sum, VVB approval and a validation report, registration only after the registry approves a validation report whose opinion is Validated, a monitoring report with the ex-post sum, a verification report, registry approval, a VCU request, then a mint. The mint is the floor of the smaller of the tonnes the checker verified and the tonnes the calculation produced. The mint block’s tag is mint_by_report.
      </p>
      <p>
        The token packed in that file is named “VCU VMR0015”. It is marked draft. Its creator is a testnet DID. It is not a serial on the Verra registry, and this desk does not mint it.
      </p>
      <h2 className="font-serif text-2xl leading-tight">What this desk does</h2>
      <p>
        The crew records the house, the photo, the boil, the fuel, and the water test. The checker accepts a line only if the test passed. The developer locks those lines. A hash of them is kept on the phone. If a photo or a test changes, the hash breaks and an offer cannot be recorded.
      </p>
      <p>
        The Guardian button asks a real Guardian, at an address you paste, which policies it already holds. It uses GET /api/v1/policies. It does not import this file, does not publish it, and does not press mint_by_report.
      </p>
      <h2 className="font-serif text-2xl leading-tight">What must not be copied across</h2>
      <p>
        Guardian publishes an API walkthrough for VM0033, a wetland methodology. That walkthrough ends on a button that belongs to VM0033. Those button names are not the button names in this water policy. Calling them here would write into the wrong forms. This water policy’s screens are: create account, project descriptions, monitoring reports, emission reductions, validation reports, verification reports, VCU requests, and, for the owner, issue VCUs.
      </p>
      <h2 className="font-serif text-2xl leading-tight">Where a credit actually comes from</h2>
      <p>
        VMR0015 has been an active Verra methodology since 31 October 2025. A credit a company can retire is a unit the Verra registry issues after a project is registered and a verification is accepted. Verra’s Project Hub is where a proponent prepares that submission. Access is requested from Verra, not granted by this desk.
      </p>
      <p>
        DLT Earth’s bounty page says digitising a methodology does not mean Gold Standard or Verra has approved that digitisation. Verra’s own digital copies, the ones inside the Project Hub, are the ones Verra tested and switched on. This file is not one of those copies.
      </p>
      <p>
        Verra’s registry FAQ said a transactional API was expected by the end of Q3 2026 and a data API in early 2027. This desk has no Verra key, so it calls neither.
      </p>
      <h2 className="font-serif text-2xl leading-tight">When a sale is real</h2>
      <p>
        After the registry has issued a serial, a buyer takes that serial from the registry. An offer saved in this desk is a name, a contact, and a tonne figure. No money moves. Recording one before a serial exists would be a sale of something that has not been issued.
      </p>
      <h2 className="font-serif text-2xl leading-tight">Sources</h2>
      <ul className="space-y-2">
        {SOURCES.map(([label, href]) => (
          <li key={href}>
            <a href={href} target="_blank" rel="noreferrer" className="block border border-rule bg-sheet px-3 py-3">
              {label}
            </a>
          </li>
        ))}
      </ul>
    </article>
  );
}
