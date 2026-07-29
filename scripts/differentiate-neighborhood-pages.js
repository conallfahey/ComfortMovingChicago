const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const cityPermitUrl = 'https://codelibrary.amlegal.com/codes/chicago/latest/chicago_il/0-0-0-2651825';

const pages = {
  'lincoln-park-movers.html': {
    name: 'Lincoln Park',
    intro: 'A Lincoln Park move can shift from a straightforward apartment job to a careful access project within a few blocks. The plan should account for older stairs, busy commercial streets, building rules, and the distance between the door and the truck.',
    profile: 'Lincoln Park jobs commonly combine vintage walk-up access, managed condo requirements, and narrow residential loading areas.',
    cards: [
      ['Walk-ups east and west of Halsted', 'Vintage apartments often mean narrow landings, sharp turns, and several flights. We confirm floor count, stair width, and oversized pieces before choosing crew size and protection materials.'],
      ['Condos near Clark and the lakefront', 'Managed buildings may require a certificate of insurance, reserved elevator time, and a fixed move window. Those details belong in the quote request so the schedule matches the building.'],
      ['DePaul and lease-turnover timing', 'Student and apartment moves cluster around lease dates. An earlier start and a confirmed loading position help reduce delays on Fullerton, Lincoln, and nearby side streets.']
    ],
    source: [cityPermitUrl, 'Chicago moving-van permit rules']
  },
  'wicker-park-movers.html': {
    name: 'Wicker Park',
    intro: 'Wicker Park rewards a block-level plan. Milwaukee Avenue activity, one-way residential streets, alleys, and older walk-ups can all change where the truck fits and how far the crew carries furniture.',
    profile: 'Wicker Park moves are shaped by vintage stairs, compact loading areas, and the difference between Milwaukee Avenue activity and quieter residential blocks.',
    cards: [
      ['Milwaukee, Damen, and North Avenue', 'The Six Corners area stays active throughout the day. We plan the loading approach before arrival and avoid assuming that the closest curb space will be usable.'],
      ['Two-flats, three-flats, and walk-ups', 'Older stair geometry matters more than square footage. Sofas, bed frames, and large tables should be measured against halls, landings, and rear-stair access before move day.'],
      ['Alleys and permit-heavy side streets', 'A short legal carry is usually faster than circling for an improvised space. Confirming posted restrictions and arranging moving signs early gives the crew a realistic truck position.']
    ],
    source: [cityPermitUrl, 'Chicago moving-van permit rules']
  },
  'lakeview-movers.html': {
    name: 'Lakeview',
    intro: 'Lakeview is not one moving environment. Wrigleyville event traffic, lakefront high-rises, Northalsted apartments, and quieter west-side walk-ups each call for a different arrival and loading plan.',
    profile: 'Lakeview moves range from stair-heavy walk-ups to elevator buildings, with event traffic and dense curb use affecting the schedule.',
    cards: [
      ['Wrigleyville event pressure', 'Game and concert days can change traffic and curb availability around Clark and Addison. Checking the local event calendar before selecting a move window can prevent avoidable delays.'],
      ['Lakefront and mid-rise buildings', 'Elevator reservations, loading docks, and certificates of insurance are common planning items. We ask for management instructions before finalizing the crew arrival time.'],
      ['Walk-ups west of Broadway', 'Rear stairs and narrow halls can be the fastest route, but only when furniture dimensions work. Sharing stair photos helps us plan disassembly and protection before the truck arrives.']
    ],
    source: ['https://www.transitchicago.com/redline/', 'CTA Red Line service information']
  },
  'logan-square-movers.html': {
    name: 'Logan Square',
    intro: 'Logan Square combines wide boulevards with surprisingly tight residential access. Greystones, two-flats, courtyard buildings, and newer apartments near the Blue Line all create different carrying and parking requirements.',
    profile: 'Logan Square jobs often involve boulevard apartments, greystone stairs, and newer transit-oriented buildings with scheduled access.',
    cards: [
      ['Boulevard and square access', 'The boulevards look spacious, but medians, bus stops, and posted restrictions can separate the truck from the entrance. We confirm the usable side of the building before arrival.'],
      ['Greystones and two-flats', 'Stone entries, narrow interior stairs, and rear porches require deliberate protection and measured turns. Large pieces may need partial disassembly before they enter the stairwell.'],
      ['Milwaukee Avenue and Blue Line buildings', 'Newer apartments may use loading rooms, freight elevators, or timed reservations. Management requirements should be confirmed before choosing a start time.']
    ],
    source: ['https://www.transitchicago.com/blueline/', 'CTA Blue Line service information']
  },
  'rogers-park-movers.html': {
    name: 'Rogers Park',
    intro: 'Rogers Park moves vary between lakefront courtyard buildings, Loyola-area apartments, vintage walk-ups, and blocks near the Evanston line. The best plan starts with the building entrance and the legal truck position.',
    profile: 'Rogers Park moves commonly involve lakefront apartments, student schedules, courtyard carries, and stair-heavy buildings.',
    cards: [
      ['Sheridan Road and lakefront apartments', 'Dense curb use and larger apartment buildings make loading access the first question. Elevator instructions and the exact service entrance should be confirmed with management.'],
      ['Loyola-area lease turnover', 'Student moves can concentrate around the same dates and times. Packing completely before the crew arrives and choosing an early window keeps smaller moves efficient.'],
      ['Courtyard buildings and long carries', 'The front door may sit well back from the street. We account for gates, exterior steps, interior courtyards, and the full door-to-truck distance when planning labor.']
    ],
    source: ['https://www.transitchicago.com/redline/', 'CTA Red Line service information']
  },
  'the-loop-movers.html': {
    name: 'The Loop',
    intro: 'A Loop move is governed by the building and the curb. Freight reservations, certificates of insurance, dock instructions, security check-in, and downtown permit rules need to line up before a crew is dispatched.',
    profile: 'Loop moves are usually controlled by high-rise freight windows, loading docks, security procedures, and downtown traffic restrictions.',
    cards: [
      ['Freight elevator windows', 'Many towers allow moves only during reserved periods. The loading window should include security check-in, elevator padding, and the carry between the dock and the unit.'],
      ['COI and vendor requirements', 'Property managers may require specific insured wording or advance vendor approval. Sending those instructions early prevents a completed crew from waiting in the lobby.'],
      ['Downtown truck positioning', 'Loading zones, bus lanes, rush-period restrictions, and central business district permit rules can limit options. The approved dock or curb location should be part of the written plan.']
    ],
    source: [cityPermitUrl, 'Chicago moving-van permit rules']
  },
  'west-loop-movers.html': {
    name: 'West Loop',
    intro: 'West Loop moving logistics change quickly between converted lofts, Fulton Market offices, restaurant corridors, and newer residential towers. Building coordination and curb access matter as much as travel distance.',
    profile: 'West Loop moves commonly involve managed towers, converted lofts, loading docks, and office or studio schedules around Fulton Market.',
    cards: [
      ['Converted loft buildings', 'A freight elevator may be large while the route from unit to dock is long. We confirm elevator dimensions, hallway protection, dock height, and the reserved access period.'],
      ['Fulton Market offices and studios', 'Commercial moves work best with labeled zones, an equipment inventory, and a sequence for desks, files, and technology. After-hours access may reduce disruption when the building allows it.'],
      ['Randolph, Madison, and Halsted traffic', 'Restaurant activity, deliveries, and commuter traffic can narrow the useful loading window. A confirmed dock or permitted curb position keeps the crew from improvising on arrival.']
    ],
    source: [cityPermitUrl, 'Chicago moving-van permit rules']
  },
  'evanston-movers.html': {
    name: 'Evanston',
    intro: 'Evanston is a suburb-to-city moving market with its own parking process. Northwestern schedules, downtown elevator buildings, tree-lined residential streets, and City of Evanston permits all affect the plan.',
    profile: 'Evanston moves commonly combine Northwestern timing, downtown building rules, residential access, and suburb-to-city travel.',
    cards: [
      ['Moving vehicle permits', 'Evanston lists a Moving Vehicle and Storage Container permit among its parking permits. Confirming the current requirement with the city is an early planning step, especially where curb space is regulated.'],
      ['Northwestern-adjacent moves', 'Residence and lease turnover can create concentrated demand. A precise inventory and an early arrival window help keep student and faculty moves predictable.'],
      ['Downtown condos and residential homes', 'Davis Street-area buildings may require elevators and management approval, while houses can involve porches, basements, detached garages, or longer driveway carries.']
    ],
    source: ['https://www.cityofevanston.org/residents/parking/parking_permits_fees/index.php', 'City of Evanston parking permits']
  },
  'oak-park-movers.html': {
    name: 'Oak Park',
    intro: 'Oak Park has different move-day rules from Chicago and a broad mix of historic homes, apartment buildings, condos, and detached garages. Parking and property access should be planned through the Village, not assumed from Chicago practice.',
    profile: 'Oak Park moves often involve historic-home protection, longer residential carries, regulated parking, and city-to-suburb coordination.',
    cards: [
      ['Village moving-truck rules', 'The Village says trucks must follow posted restrictions and recommends applying at least one week ahead when a Right of Way Obstruction Permit is needed to reserve regulated curb space.'],
      ['Historic homes and finished woodwork', 'Older stairs, trim, porches, and floors benefit from a measured furniture plan and deliberate protection. Basements and detached garages should be included in the inventory.'],
      ['City-to-suburb transitions', 'A Chicago pickup and Oak Park delivery can involve two different access systems. We verify both addresses so permit timing, truck placement, and travel are reflected in one schedule.']
    ],
    source: ['https://www.oak-park.us/Services-Parking/Parking-Mobility-Services/Parking-Guidelines-Restrictions/Parking-a-Movers-Truck', 'Village of Oak Park moving-truck guidance']
  },
  'ravenswood-movers.html': {
    name: 'Ravenswood',
    intro: 'Ravenswood mixes two-flats, courtyard apartments, small homes, and former industrial spaces. Brown Line and Metra activity, commercial corridors, and long rear-access carries can all influence the best loading plan.',
    profile: '',
    cards: [
      ['Ravenswood Avenue spaces', 'Studios and light commercial spaces may have freight-style access, rear loading, or equipment that needs a specific sequence. Photos and an inventory make those moves easier to scope.'],
      ['Two-flats and courtyard apartments', 'Exterior steps, gangways, gates, and rear stairs can extend the carry even when the truck is close. We plan for the complete route rather than only the unit floor.'],
      ['Brown Line and commuter timing', 'Damen, Montrose, and nearby crossings can be busiest around commute periods. An earlier window often gives residential crews more predictable access.']
    ],
    source: ['https://www.transitchicago.com/brownline/', 'CTA Brown Line service information']
  }
};

function renderGuide(page, slug) {
  const cards = page.cards.map(([title, body]) => `
          <div class="col-md-4">
            <div class="h-100 bg-white rounded-4 shadow-sm border p-4">
              <h3 class="h5 fw-bold text-dark mb-3">${title}</h3>
              <p class="text-muted mb-0 small">${body}</p>
            </div>
          </div>`).join('');
  return `
    <!-- Neighborhood-specific move planning -->
    <section class="py-5 bg-light-pattern border-top border-bottom" aria-labelledby="${slug}-field-guide">
      <div class="container">
        <div class="text-center mb-5">
          <span class="badge bg-brand-blue rounded-pill px-3 py-2 mb-3 text-white">Neighborhood Field Guide</span>
          <h2 id="${slug}-field-guide" class="display-5 fw-bold font-family-sans-serif">Moving in ${page.name}: What Changes the Plan</h2>
          <p class="lead text-muted mx-auto" style="max-width: 820px;">${page.intro}</p>
        </div>
        <div class="row g-4">${cards}
        </div>
        <p class="text-center text-muted small mt-4 mb-0">Verify current public rules before move day:
          <a href="${page.source[0]}" target="_blank" rel="noopener">${page.source[1]}</a>.
        </p>
      </div>
    </section>

`;
}

for (const [file, page] of Object.entries(pages)) {
  const filePath = path.join(root, 'neighborhoods', file);
  let html = fs.readFileSync(filePath, 'utf8');
  const slug = file.replace(/-movers\.html$/, '');
  if (html.includes(`${slug}-field-guide`)) {
    console.log(`Skipped ${file}; field guide already present`);
    continue;
  }

  const guide = renderGuide(page, slug);
  if (file === 'ravenswood-movers.html') {
    const heading = '<h2 class="display-6 fw-bold mb-4">Ravenswood moving tips before move day</h2>';
    const headingIndex = html.indexOf(heading);
    const markerIndex = html.lastIndexOf('<section class="section-pad bg-light-gray">', headingIndex);
    if (headingIndex < 0 || markerIndex < 0) throw new Error('Could not locate Ravenswood insertion point');
    html = html.slice(0, markerIndex) + guide + html.slice(markerIndex);
  } else {
    const marker = '    <!-- Internal Service Linking Section -->';
    if (!html.includes(marker)) throw new Error(`Could not locate insertion point in ${file}`);
    html = html.replace(marker, guide + marker);
    const generic = '<p class="text-muted">These are the move setups we see most often on this page type.</p>';
    if (!html.includes(generic)) throw new Error(`Could not locate generic profile copy in ${file}`);
    html = html.replace(generic, `<p class="text-muted">${page.profile}</p>`);
  }

  fs.writeFileSync(filePath, html);
  console.log(`Updated ${file}`);
}
