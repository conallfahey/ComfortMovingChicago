const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

const blogConfig = {
  'blog/blog-small-vs-big-moving-companies.html': {
    serviceHref: '/services/affordable-chicago-movers.html',
    serviceTitle: 'Affordable Chicago movers',
    serviceText: 'See how a smaller local crew compares on pricing, communication, and flexibility.',
    locationHref: '/neighborhoods/logan-square-movers.html',
    locationTitle: 'Logan Square movers',
    locationText: 'Explore a neighborhood page built for apartment, condo, and boulevard moves on the Northwest Side.'
  },
  'blog/blog-stress-free-moving-day.html': {
    serviceHref: '/services/packing-services-chicago.html',
    serviceTitle: 'Chicago packing services',
    serviceText: 'Cut down moving-day chaos with full packing help, fragile-item prep, and organized labeling.',
    locationHref: '/neighborhoods/lakeview-movers.html',
    locationTitle: 'Lakeview movers',
    locationText: 'See how we plan for walk-ups, elevator buildings, and permit-heavy streets in Lakeview.'
  },
  'blog/blog-chicago-neighborhoods-guide.html': {
    serviceHref: '/services/residential-moving-chicago.html',
    serviceTitle: 'Chicago residential movers',
    serviceText: 'Compare the core service page for apartments, condos, houses, and neighborhood-to-neighborhood moves.',
    locationHref: '/neighborhoods/west-loop-movers.html',
    locationTitle: 'West Loop movers',
    locationText: 'Use one location page as a model for high-rise logistics, loading docks, and neighborhood-specific planning.'
  },
  'blog/blog-packing-fragile-items.html': {
    serviceHref: '/services/packing-services-chicago.html',
    serviceTitle: 'Professional packing services in Chicago',
    serviceText: 'See when it makes sense to hand off fragile packing, supplies, and unpacking support to a crew.',
    locationHref: '/neighborhoods/wicker-park-movers.html',
    locationTitle: 'Wicker Park movers',
    locationText: 'Read a neighborhood page where fragile-item handling matters in walk-ups, lofts, and permit-heavy blocks.'
  },
  'blog/blog-hoisting-benefits.html': {
    serviceHref: '/services/local-hoisting-chicago.html',
    serviceTitle: 'Chicago hoisting services',
    serviceText: 'Learn when hoisting is the cleanest solution for oversized furniture, tight stairwells, and elevator limits.',
    locationHref: '/neighborhoods/west-loop-movers.html',
    locationTitle: 'West Loop movers',
    locationText: 'See a neighborhood page where loft layouts, elevators, and oversized pieces often shape the move plan.'
  },
  'blog/blog-best-time-to-move-chicago.html': {
    serviceHref: '/services/residential-moving-chicago.html',
    serviceTitle: 'Residential moving in Chicago',
    serviceText: 'Compare seasonal planning advice with the main service page for apartment, condo, and house relocations.',
    locationHref: '/neighborhoods/lakeview-movers.html',
    locationTitle: 'Lakeview movers',
    locationText: 'Review a location page where parking, permit timing, and dense residential blocks affect scheduling.'
  },
  'blog/blog-elevator-loading-zone-permits-chicago.html': {
    serviceHref: '/services/office-moving-chicago.html',
    serviceTitle: 'Chicago office moving',
    serviceText: 'Use our commercial moving page if your building requires COIs, dock scheduling, or phased access.',
    locationHref: '/neighborhoods/the-loop-movers.html',
    locationTitle: 'The Loop movers',
    locationText: 'See how downtown condo and office moves are handled when elevators and loading docks drive the schedule.'
  },
  'blog/blog-moving-wicker-lincoln-south-loop.html': {
    serviceHref: '/services/residential-moving-chicago.html',
    serviceTitle: 'Chicago apartment and condo movers',
    serviceText: 'Jump from this local guide to the core residential page for city apartment, condo, and house moves.',
    locationHref: '/neighborhoods/wicker-park-movers.html',
    locationTitle: 'Wicker Park movers',
    locationText: 'Use the neighborhood page for a deeper look at permit-heavy streets, walk-ups, and loft moves.'
  },
  'blog/blog-packing-tips.html': {
    serviceHref: '/services/packing-services-chicago.html',
    serviceTitle: 'Chicago packing services',
    serviceText: 'If you would rather skip the boxes, compare these DIY tips with our full packing and fragile-item support.',
    locationHref: '/neighborhoods/lakeview-movers.html',
    locationTitle: 'Lakeview movers',
    locationText: 'See a location page where apartment layouts, elevators, and tight curb access make good packing even more important.'
  },
  'blog/blog-moving-checklist.html': {
    serviceHref: '/services/residential-moving-chicago.html',
    serviceTitle: 'Residential movers in Chicago',
    serviceText: 'Match your checklist with the core service page for apartment, condo, and house relocations.',
    locationHref: '/neighborhoods/lincoln-park-movers.html',
    locationTitle: 'Lincoln Park movers',
    locationText: 'Review a neighborhood page where permits, alley access, and walk-ups shape the moving timeline.'
  },
  'blog/blog-moving-with-pets.html': {
    serviceHref: '/services/residential-moving-chicago.html',
    serviceTitle: 'Chicago residential movers',
    serviceText: 'See the service page we use for family apartment and house moves where pacing and setup matter.',
    locationHref: '/neighborhoods/rogers-park-movers.html',
    locationTitle: 'Rogers Park movers',
    locationText: 'Use a location page built around lakefront apartments, walk-ups, and flexible neighborhood move timing.'
  },
  'blog/blog-tipping-movers.html': {
    serviceHref: '/services/residential-moving-chicago.html',
    serviceTitle: 'Chicago moving quotes',
    serviceText: 'See the main residential page if you are pricing labor, crew size, and what a full-service move includes.',
    locationHref: '/neighborhoods/lincoln-park-movers.html',
    locationTitle: 'Lincoln Park movers',
    locationText: 'Review a location page with the kind of apartment and house moves that often raise tipping questions.'
  },
  'blog/blog-understanding-moving-quotes.html': {
    serviceHref: '/services/affordable-chicago-movers.html',
    serviceTitle: 'Affordable Chicago movers',
    serviceText: 'Compare quote terminology with a service page focused on budget-conscious apartment and small moves.',
    locationHref: '/neighborhoods/oak-park-movers.html',
    locationTitle: 'Oak Park movers',
    locationText: 'See a suburb page where home size, access, and local logistics can change what a quote needs to cover.'
  },
  'blog/blog-change-of-address.html': {
    serviceHref: '/services/residential-moving-chicago.html',
    serviceTitle: 'Chicago residential moving',
    serviceText: 'Use the main service page once the paperwork is done and you are ready to schedule the actual move.',
    locationHref: '/neighborhoods/logan-square-movers.html',
    locationTitle: 'Logan Square movers',
    locationText: 'See a neighborhood page built for boulevard apartments, condos, and classic two-flat logistics.'
  },
  'blog/blog-decluttering-before-move.html': {
    serviceHref: '/services/affordable-chicago-movers.html',
    serviceTitle: 'Affordable movers for smaller loads',
    serviceText: 'Decluttering often changes crew size and timing, so compare your plan with our small-move pricing page.',
    locationHref: '/neighborhoods/oak-park-movers.html',
    locationTitle: 'Oak Park movers',
    locationText: 'Review a suburb page where house moves, garages, and downsizing often change the scope of work.'
  },
  'blog/blog-first-apartment.html': {
    serviceHref: '/services/residential-moving-chicago.html',
    serviceTitle: 'Apartment movers in Chicago',
    serviceText: 'See the main service page for apartment move planning, carry distance, stairs, and elevator coordination.',
    locationHref: '/neighborhoods/lakeview-movers.html',
    locationTitle: 'Lakeview movers',
    locationText: 'Use a location page built around dense apartment living, walk-ups, and first-time city moves.'
  },
  'blog/blog-office-move.html': {
    serviceHref: '/services/office-moving-chicago.html',
    serviceTitle: 'Chicago office movers',
    serviceText: 'Move from the checklist to our commercial service page for phased moves, dock timing, and downtime planning.',
    locationHref: '/neighborhoods/west-loop-movers.html',
    locationTitle: 'West Loop movers',
    locationText: 'See a location page where loft offices, high-rises, and Fulton Market building rules affect move planning.'
  },
  'blog/blog-sustainable-moving.html': {
    serviceHref: '/services/packing-services-chicago.html',
    serviceTitle: 'Packing services with fewer wasted materials',
    serviceText: 'Compare eco-friendly DIY habits with professional packing help when you still need speed and protection.',
    locationHref: '/neighborhoods/evanston-movers.html',
    locationTitle: 'Evanston movers',
    locationText: 'Use a suburb page where route planning, permit lead times, and home types can influence a lower-waste move.'
  }
};

const locationConfig = {
  'neighborhoods/lincoln-park-movers.html': {
    intro: 'Lincoln Park moves often blend older walk-ups, busy weekend curb space, and family-home logistics close to dense commercial corridors.',
    services: [
      ['Residential Moving for Lincoln Park Apartments', '/services/residential-moving-chicago.html', 'Use our core residential moving page for walk-ups, condos, and single-family home relocations in Lincoln Park.'],
      ['Packing Services for Busy Lincoln Park Moves', '/services/packing-services-chicago.html', 'Add full packing or fragile-item help when tight move windows leave less time to box up on your own.'],
      ['Furniture Assembly for Condo and Apartment Setups', '/services/furniture-assembly-chicago.html', 'Keep the setup phase moving when beds, desks, and modular furniture need to be reassembled after delivery.']
    ],
    profiles: [
      ['Walk-Up Apartment Moves', 'Useful for brownstones, classic flats, and narrower stairwells where carry distance matters.'],
      ['Condo and High-Rise Coordination', 'Best for buildings that need elevator timing, loading plans, or tighter arrival windows.'],
      ['House and Family Relocations', 'A good fit when a Lincoln Park move includes more rooms, larger furniture, or storage overflow.']
    ]
  },
  'neighborhoods/lakeview-movers.html': {
    intro: 'Lakeview combines dense apartment living, elevator buildings, and constant curbside competition, so the right service mix matters.',
    services: [
      ['Residential Moving for Lakeview Apartments and Condos', '/services/residential-moving-chicago.html', 'See how we handle apartment, condo, and house moves when parking, stairs, or building timing create bottlenecks.'],
      ['Packing Services for High-Turnover Apartment Moves', '/services/packing-services-chicago.html', 'Use packing help when you need boxes, fragile-item prep, or a faster exit from a crowded building.'],
      ['Hoisting Services for Tight Access Moves', '/services/local-hoisting-chicago.html', 'When stairwells or elevators are too tight, hoisting can keep oversized pieces from becoming a move-day problem.']
    ],
    profiles: [
      ['Walk-Up Apartment Moves', 'Helpful for older buildings where steep stairs, narrow turns, and limited landing space slow the crew down.'],
      ['Elevator and Mid-Rise Moves', 'Useful when elevator reservations, door protection, and tighter loading windows are part of the move.'],
      ['Condo-to-Condo Relocations', 'A strong fit for same-neighborhood moves where timing and access matter more than distance.']
    ]
  },
  'neighborhoods/wicker-park-movers.html': {
    intro: 'Wicker Park moves usually hinge on permit timing, walk-up access, and how quickly we can load on busy neighborhood streets.',
    services: [
      ['Residential Moving for Wicker Park Walk-Ups', '/services/residential-moving-chicago.html', 'Use our residential moving page for apartments, condos, and home moves around permit-heavy Wicker Park blocks.'],
      ['Packing Services for Fast Apartment Turnarounds', '/services/packing-services-chicago.html', 'Get help boxing, labeling, and protecting fragile items when your move window is tight.'],
      ['Hoisting Services for Oversized Furniture', '/services/local-hoisting-chicago.html', 'Use hoisting when narrow stairwells, tight landings, or older layouts make standard access unrealistic.']
    ],
    profiles: [
      ['Vintage Walk-Up Apartments', 'Best for older buildings where stairs, sharp turns, and street-side loading all affect timing.'],
      ['Loft and Condo Moves', 'Useful when your building has modern amenities but limited loading space or stricter scheduling.'],
      ['Permit-Heavy Street Moves', 'A strong fit when parking access needs to be coordinated before the truck ever arrives.']
    ]
  },
  'neighborhoods/logan-square-movers.html': {
    intro: 'Logan Square moves often revolve around boulevard parking, vintage building access, and a mix of apartment, condo, and two-flat layouts.',
    services: [
      ['Residential Moving for Logan Square Apartments and Homes', '/services/residential-moving-chicago.html', 'Compare the main residential service page for apartment, condo, and house moves across Logan Square.'],
      ['Packing Services for Greystone and Condo Moves', '/services/packing-services-chicago.html', 'Use packing support when you need faster prep, better labeling, or extra protection for fragile items.'],
      ['Same Day Movers for Short-Notice Logan Square Moves', '/services/same-day-movers-chicago.html', 'If your move came together fast, see how our short-notice crews handle apartment and neighborhood relocations.']
    ],
    profiles: [
      ['Boulevard Apartment Moves', 'Helpful when truck placement and loading space need to work around wider streets and busier traffic patterns.'],
      ['Greystone and Two-Flat Moves', 'Useful for older buildings with narrower entries, heavier furniture, and more carry distance.'],
      ['Condo and Transit-Oriented Moves', 'A strong fit for moves near stations or denser mixed-use blocks where timing and access matter.']
    ]
  },
  'neighborhoods/oak-park-movers.html': {
    intro: 'Oak Park moves lean more suburban, but historic homes, tighter village streets, and mixed building types still demand planning.',
    services: [
      ['Residential Moving for Oak Park Homes and Apartments', '/services/residential-moving-chicago.html', 'Use our residential moving page for house, condo, and apartment relocations throughout Oak Park.'],
      ['Packing Services for Larger Home Moves', '/services/packing-services-chicago.html', 'Bring in extra packing help when a house move or downsizing project creates more volume than expected.'],
      ['Furniture Assembly for Room-by-Room Setup', '/services/furniture-assembly-chicago.html', 'Finish the move faster when beds, dining sets, and office furniture need to be rebuilt after delivery.']
    ],
    profiles: [
      ['Historic Home Moves', 'Useful when larger pieces, tighter entries, and room protection matter more than pure speed.'],
      ['Condo and Apartment Relocations', 'A good fit for smaller buildings where parking is easier but carry distance still adds time.'],
      ['City-to-Suburb Transitions', 'Helpful when your move involves changing home size, storage needs, or furniture layout entirely.']
    ]
  },
  'neighborhoods/rogers-park-movers.html': {
    intro: 'Rogers Park moves are often apartment-first, cost-sensitive, and shaped by lakefront buildings, older walk-ups, and flexible scheduling needs.',
    services: [
      ['Affordable Movers for Rogers Park Apartments', '/services/affordable-chicago-movers.html', 'See the budget-focused service page for smaller apartment moves, leaner crews, and straightforward pricing.'],
      ['Residential Moving for Larger Rogers Park Moves', '/services/residential-moving-chicago.html', 'Use the main residential page when your move includes more rooms, heavier furniture, or a longer carry.'],
      ['Packing Services for Student and Family Moves', '/services/packing-services-chicago.html', 'Add packing help when a quick lease turnover or busy family schedule leaves less prep time.']
    ],
    profiles: [
      ['Lakefront Apartment Moves', 'Useful for buildings where elevator timing, curb access, or long hallways change the loading plan.'],
      ['Walk-Up and Stair Moves', 'A good fit for older flats where stair carries are part of the expected labor.'],
      ['Budget-Conscious Small Moves', 'Helpful when price sensitivity and efficiency are the main priorities.']
    ]
  },
  'neighborhoods/the-loop-movers.html': {
    intro: 'The Loop is where building rules, COIs, loading docks, and office timing are often more important than the distance of the move itself.',
    services: [
      ['Office Moving for Downtown Buildings', '/services/office-moving-chicago.html', 'Go straight to our commercial moving page for office relocations, phased scheduling, and building coordination.'],
      ['Residential Moving for Loop High-Rises', '/services/residential-moving-chicago.html', 'Use the residential page for condo and apartment moves where elevator reservations drive the entire timeline.'],
      ['Packing Services for Time-Sensitive Tower Moves', '/services/packing-services-chicago.html', 'Bring in packers when your move window is short and the building schedule leaves little room for delays.']
    ],
    profiles: [
      ['High-Rise Condo Moves', 'Best for elevator-based moves with door protection, reservations, and tighter loading windows.'],
      ['Office and Suite Relocations', 'Useful when loading docks, phased installs, and after-hours access affect the move plan.'],
      ['COI and Dock-Managed Buildings', 'A strong fit for properties where paperwork and timing need to be confirmed well before move day.']
    ]
  },
  'neighborhoods/west-loop-movers.html': {
    intro: 'West Loop moves cover loft conversions, luxury towers, and office spaces where loading rules and building coordination can vary block by block.',
    services: [
      ['Residential Moving for West Loop Lofts and Towers', '/services/residential-moving-chicago.html', 'Compare our apartment, condo, loft, and house moving service for dense West Loop relocations.'],
      ['Office Moving for Fulton Market and West Loop Teams', '/services/office-moving-chicago.html', 'Use the commercial page when your move involves office furniture, staging, or minimizing downtime.'],
      ['Packing Services for High-Rise and Loft Moves', '/services/packing-services-chicago.html', 'Bring in packers when you need faster prep for freight elevators, loading docks, or large-unit moves.']
    ],
    profiles: [
      ['Luxury High-Rise Moves', 'Useful when reservations, front-desk coordination, and controlled access drive the schedule.'],
      ['Converted Loft Moves', 'Helpful for heavier pieces, industrial layouts, and wider but less forgiving entry points.'],
      ['Office and Studio Relocations', 'A strong fit for businesses moving inside West Loop or between nearby mixed-use buildings.']
    ]
  },
  'neighborhoods/evanston-movers.html': {
    intro: 'Evanston moves benefit from a more suburb-specific service mix because permit timing, tree-lined routes, and student cycles all affect execution.',
    services: [
      ['Residential Moving for Evanston Homes and Apartments', '/services/residential-moving-chicago.html', 'See the core service page for home, apartment, and condo moves across downtown Evanston and nearby residential blocks.'],
      ['Packing Services for North Shore Moves', '/services/packing-services-chicago.html', 'Add packing help when larger homes, busy move windows, or fragile items increase the scope of work.'],
      ['Furniture Assembly for House Setups and Campus Moves', '/services/furniture-assembly-chicago.html', 'Keep move-in day moving when beds, desks, and modular pieces need to be rebuilt after delivery.']
    ],
    profiles: [
      ['Northwestern-Adjacent Moves', 'Useful when move dates cluster around student turnover and traffic patterns get less predictable.'],
      ['Downtown Mid-Rise Moves', 'Helpful for buildings that need reservations, tighter curb timing, or extra coordination.'],
      ['Historic and Tree-Lined Home Moves', 'A strong fit when truck routing, driveway limits, and larger furniture all shape the plan.']
    ]
  }
};

function read(filePath) {
  return fs.readFileSync(path.join(root, filePath), 'utf8');
}

function write(filePath, content) {
  fs.writeFileSync(path.join(root, filePath), content);
}

function buildBlogBlock(config) {
  return `
                <!-- Internal Linking Section -->
                <div class="card border-0 shadow-sm bg-light mb-5">
                    <div class="card-body p-4 p-lg-5">
                        <span class="badge bg-brand-blue rounded-pill px-3 py-2 mb-3 text-white">Plan Your Move</span>
                        <h2 class="h3 fw-bold text-dark mb-3">Helpful Pages for This Move</h2>
                        <p class="text-muted mb-4">Use these next steps if you want service details, neighborhood logistics, or a fast quote.</p>
                        <div class="row g-3">
                            <div class="col-md-6">
                                <a href="${config.serviceHref}" class="text-decoration-none">
                                    <div class="h-100 border rounded-4 p-4 bg-white">
                                        <div class="small text-uppercase text-brand-blue fw-bold mb-2">Service Page</div>
                                        <h3 class="h5 fw-bold text-dark mb-2">${config.serviceTitle}</h3>
                                        <p class="text-muted mb-0">${config.serviceText}</p>
                                    </div>
                                </a>
                            </div>
                            <div class="col-md-6">
                                <a href="${config.locationHref}" class="text-decoration-none">
                                    <div class="h-100 border rounded-4 p-4 bg-white">
                                        <div class="small text-uppercase text-brand-blue fw-bold mb-2">Location Page</div>
                                        <h3 class="h5 fw-bold text-dark mb-2">${config.locationTitle}</h3>
                                        <p class="text-muted mb-0">${config.locationText}</p>
                                    </div>
                                </a>
                            </div>
                        </div>
                        <div class="mt-4 p-3 rounded-4 bg-white border">
                            <p class="mb-0 text-muted">Ready to talk timing and pricing? <a href="/#quoteForm" class="fw-bold text-brand-blue text-decoration-underline">Request a free moving quote</a> and we’ll help you match the right service to your neighborhood and move type.</p>
                        </div>
                    </div>
                </div>
`;
}

function buildLocationBlock(config) {
  const serviceCards = config.services.map(([title, href, text]) => `
          <div class="col-md-6 col-lg-4">
            <a href="${href}" class="text-decoration-none h-100">
              <div class="service-card-modern h-100 d-flex flex-column bg-light-pattern">
                <div class="small text-uppercase text-brand-blue fw-bold mb-2">Relevant Service</div>
                <h3 class="h5 fw-bold text-dark mb-3">${title}</h3>
                <p class="text-muted mb-0 small">${text}</p>
              </div>
            </a>
          </div>`).join('\n');

  const profiles = config.profiles.map(([title, text]) => `
            <div class="col-md-4">
              <div class="h-100 bg-white rounded-4 shadow-sm border p-4">
                <h3 class="h5 fw-bold text-dark mb-3">${title}</h3>
                <p class="text-muted mb-0 small">${text}</p>
              </div>
            </div>`).join('\n');

  return `
    <!-- Internal Service Linking Section -->
    <section class="py-5 bg-light-pattern border-top border-bottom">
      <div class="container">
        <div class="text-center mb-5">
          <span class="badge bg-brand-blue rounded-pill px-3 py-2 mb-3 text-white">Local Move Planning</span>
          <h2 class="display-5 fw-bold font-family-sans-serif">Services People Book for This Area</h2>
          <p class="lead text-muted mx-auto" style="max-width: 760px;">${config.intro}</p>
        </div>
        <div class="row g-4 mb-5 justify-content-center">
${serviceCards}
        </div>
        <div class="text-center mb-4">
          <h2 class="fw-bold">Common Move Profiles Here</h2>
          <p class="text-muted">These are the move setups we see most often on this page type.</p>
        </div>
        <div class="row g-4">
${profiles}
        </div>
      </div>
    </section>
`;
}

for (const [filePath, config] of Object.entries(blogConfig)) {
  const html = read(filePath);
  if (html.includes('<!-- Internal Linking Section -->')) continue;
  let updated = html;
  const markers = [
    '                <!-- Call to Action -->',
    '                <!-- Conclusion & CTA -->',
    '                <!-- Related Posts -->'
  ];
  for (const marker of markers) {
    if (updated.includes(marker)) {
      updated = updated.replace(marker, `${buildBlogBlock(config)}\n${marker}`);
      break;
    }
  }
  write(filePath, updated);
  console.log(`Updated blog links: ${filePath}`);
}

for (const [filePath, config] of Object.entries(locationConfig)) {
  const html = read(filePath);
  if (html.includes('<!-- Internal Service Linking Section -->')) continue;
  const updated = html.replace('    <!-- Moving Resources Section -->', `${buildLocationBlock(config)}\n\n    <!-- Moving Resources Section -->`);
  write(filePath, updated);
  console.log(`Updated location links: ${filePath}`);
}
