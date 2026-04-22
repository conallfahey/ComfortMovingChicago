const BRAND = 'Comfort Moving Chicago';
const BUSINESS_NAME = 'Comfort Moving Chicago LLC';
const BASE_URL = 'https://comfortmovingchicago.com';

const BUSINESS = {
  '@id': `${BASE_URL}/#business`,
  '@type': 'MovingCompany',
  name: BUSINESS_NAME,
  url: `${BASE_URL}/`,
  image: `${BASE_URL}/Images/CMC_logo.webp`,
  logo: `${BASE_URL}/Images/CMC_logo.webp`,
  telephone: '+17732361724',
  email: 'comfortmovingchicago@gmail.com',
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Chicago',
    addressRegion: 'IL',
    postalCode: '60622',
    addressCountry: 'US'
  },
  areaServed: [
    { '@type': 'City', name: 'Chicago', containedInPlace: { '@type': 'State', name: 'Illinois' } },
    { '@type': 'City', name: 'Oak Park', containedInPlace: { '@type': 'State', name: 'Illinois' } },
    { '@type': 'City', name: 'Evanston', containedInPlace: { '@type': 'State', name: 'Illinois' } }
  ],
  sameAs: [
    'https://www.facebook.com/p/Comfort-Moving-Chicago-100085395917097/',
    'https://www.instagram.com/comfortmovingchicago',
    'https://www.yelp.com/biz/comfort-moving-chicago-oak-park-5',
    'https://maps.google.com/?q=Comfort+Moving+Chicago'
  ]
};

const ROOT_PAGES = {
  'index.html': {
    title: `Chicago Movers | Apartments, Homes & Same-Day Moves | ${BRAND}`,
    description:
      'Chicago movers for apartments, condos, homes, offices, packing, and last-minute moves. Owner-operated, licensed, and built for real Chicago move-day logistics.',
    schemaType: 'home'
  },
  'services.html': {
    title: `Chicago Moving Services | Residential, Packing, Office & Same-Day Help | ${BRAND}`,
    description:
      'Compare Chicago moving services for apartments, homes, offices, packing, hoisting, affordable moves, and same-day help. Find the right fit and request a quote.',
    schemaType: 'webPage'
  },
  'faq.html': {
    title: `Chicago Moving FAQ | Pricing, Permits & Apartment Moves | ${BRAND}`,
    description:
      'Chicago moving FAQ covering pricing, parking permits, elevator reservations, packing supplies, and last-minute move questions.',
    schemaType: 'faq'
  },
  'blog/index.html': {
    title: `Chicago Moving Tips Blog | Checklists, Packing & Neighborhood Guides | ${BRAND}`,
    description:
      'Chicago moving tips, packing guides, checklists, and neighborhood advice from a local moving company that works across the city every day.',
    schemaType: 'none'
  },
  'we-love-chicago/index.html': {
    title: `Chicago Neighborhood Blog | Local Trends & Moving Insights | ${BRAND}`,
    description:
      'Read Chicago neighborhood updates, development news, affordability guides, and local insights from Comfort Moving Chicago.',
    schemaType: 'none'
  },
  'local-chicago-movers.html': {
    title: 'Redirecting...',
    description: 'Redirecting to Comfort Moving Chicago homepage.',
    schemaType: 'none'
  }
};

const SERVICE_PAGES = {
  'services/affordable-chicago-movers.html': {
    title: `Affordable Chicago Movers | Budget-Friendly Local Moving Without Hidden Fees | ${BRAND}`,
    description:
      'Affordable Chicago movers for studios, apartments, and smaller local moves with transparent pricing, efficient crews, and no big-company markup.',
    serviceType: 'Affordable moving services',
    serviceName: 'Affordable Chicago Movers',
    areaServed: ['Chicago, IL']
  },
  'services/residential-moving-chicago.html': {
    title: `Residential Moving Chicago | Apartment, Condo & House Movers That Know City Access | ${BRAND}`,
    description:
      'Residential moving in Chicago for apartments, condos, walk-ups, and houses with careful loading, elevator planning, packing help, and fast local quotes.',
    serviceType: 'Residential moving services',
    serviceName: 'Residential Moving Chicago',
    areaServed: ['Chicago, IL']
  },
  'services/packing-services-chicago.html': {
    title: `Packing Services Chicago | Full Packing, Fragile Prep & Unpacking Help | ${BRAND}`,
    description:
      'Chicago packing services for full-home packing, fragile items, room-by-room packing, unpacking help, and supplies from a local moving crew.',
    serviceType: 'Packing services',
    serviceName: 'Packing Services Chicago',
    areaServed: ['Chicago, IL']
  },
  'services/furniture-assembly-chicago.html': {
    title: `Furniture Assembly Chicago | IKEA, CB2 & West Elm Setup | ${BRAND}`,
    description:
      'Chicago furniture assembly for IKEA, CB2, West Elm, and Wayfair pieces with fast scheduling, careful setup, and flat-rate options.',
    serviceType: 'Furniture assembly services',
    serviceName: 'Furniture Assembly Chicago',
    areaServed: ['Chicago, IL']
  },
  'services/local-hoisting-chicago.html': {
    title: `Hoisting Services Chicago | Window Hoists & Oversized Items | ${BRAND}`,
    description:
      'Chicago hoisting services for sofas, safes, oversized furniture, and window hoists when stairwells or elevators are too tight.',
    serviceType: 'Hoisting services',
    serviceName: 'Hoisting Services Chicago',
    areaServed: ['Chicago, IL']
  },
  'services/piano-movers-chicago.html': {
    title: `Piano Movers Chicago | Upright, Baby Grand & Grand Piano Moves | ${BRAND}`,
    description:
      'Chicago piano movers for upright, baby grand, and grand piano relocation with protective equipment, careful handling, and licensed crews.',
    serviceType: 'Piano moving services',
    serviceName: 'Piano Movers Chicago',
    areaServed: ['Chicago, IL']
  },
  'services/office-moving-chicago.html': {
    title: `Office Moving Chicago | Commercial Moves With COI, Scheduling & Downtime Planning | ${BRAND}`,
    description:
      'Chicago office moving for commercial relocations, internal office shifts, COIs, after-hours scheduling, and business moves built to reduce downtime.',
    serviceType: 'Office moving services',
    serviceName: 'Office Moving Chicago',
    areaServed: ['Chicago, IL']
  },
  'services/emergency-movers-chicago.html': {
    title: `Emergency Movers Chicago | Urgent Relocation & Safety Moves | ${BRAND}`,
    description:
      'Emergency movers in Chicago for urgent relocations, eviction support, fire or flood response, and fast turnaround when timing is critical.',
    serviceType: 'Emergency moving services',
    serviceName: 'Emergency Movers Chicago',
    areaServed: ['Chicago, IL']
  },
  'services/same-day-movers-chicago.html': {
    title: `Same Day Movers Chicago | Last-Minute Moves, Today or Tomorrow | ${BRAND}`,
    description:
      'Same day movers in Chicago for last-minute apartments, condos, and short-notice local moves with fast dispatch, clear communication, and real availability checks.',
    serviceType: 'Same day moving services',
    serviceName: 'Same Day Movers Chicago',
    areaServed: ['Chicago, IL']
  },
  'services/senior-moving-chicago.html': {
    title: `Senior Moving Services Chicago | Downsizing & Assisted Living Moves | ${BRAND}`,
    description:
      'Senior moving services in Chicago with downsizing support, packing help, assisted living transitions, and careful room-by-room setup.',
    serviceType: 'Senior moving services',
    serviceName: 'Senior Moving Services Chicago',
    areaServed: ['Chicago, IL']
  }
};

const AREA_PAGES = {
  'neighborhoods/lincoln-park-movers.html': {
    title: `Lincoln Park Movers | Apartments, Walk-Ups & High-Rises | ${BRAND}`,
    description:
      'Lincoln Park movers for apartments, walk-ups, condos, and high-rises with permit planning and careful handling for busy Chicago streets.',
    serviceName: 'Lincoln Park Movers',
    areaServed: ['Lincoln Park, Chicago, IL', '60614', '60657']
  },
  'neighborhoods/wicker-park-movers.html': {
    title: `Wicker Park Movers | Walk-Ups, Permit Streets & Busy Chicago Blocks | ${BRAND}`,
    description:
      'Wicker Park movers for walk-ups, permit-heavy streets, alley loading, and apartment moves around 60622 with local route and timing planning.',
    serviceName: 'Wicker Park Movers',
    areaServed: ['Wicker Park, Chicago, IL', '60622', '60647']
  },
  'neighborhoods/lakeview-movers.html': {
    title: `Lakeview Movers | Apartments, High-Rises & Condo Moves | ${BRAND}`,
    description:
      'Lakeview movers for apartments, high-rises, and condo moves with elevator coordination, loading logistics, and licensed local crews.',
    serviceName: 'Lakeview Movers',
    areaServed: ['Lakeview, Chicago, IL', '60613', '60657']
  },
  'neighborhoods/evanston-movers.html': {
    title: `Evanston Movers | Northwestern, Condos & North Shore Moves | ${BRAND}`,
    description:
      'Evanston movers for condos, single-family homes, and Northwestern student moves with local scheduling and suburb-to-city coordination.',
    serviceName: 'Evanston Movers',
    areaServed: ['Evanston, IL']
  },
  'neighborhoods/rogers-park-movers.html': {
    title: `Rogers Park Movers | Lakefront Apartments & Student Moves | ${BRAND}`,
    description:
      'Rogers Park movers for lakefront apartments, Loyola-area student moves, and walk-ups with flexible scheduling across 60626 and 60645.',
    serviceName: 'Rogers Park Movers',
    areaServed: ['Rogers Park, Chicago, IL', '60626', '60645']
  },
  'neighborhoods/oak-park-movers.html': {
    title: `Oak Park Movers | Historic Homes, Tight Residential Streets & Careful Local Moves | ${BRAND}`,
    description:
      'Oak Park movers for historic homes, condos, apartments, detached garages, and careful suburb moves across 60301, 60302, and 60304.',
    serviceName: 'Oak Park Movers',
    areaServed: ['Oak Park, IL', '60301', '60302', '60304']
  },
  'neighborhoods/the-loop-movers.html': {
    title: `The Loop Movers | High-Rise, Condo & Office Moves | ${BRAND}`,
    description:
      'The Loop movers for downtown high-rises, condo moves, and office relocations with COI support, loading dock coordination, and timing plans.',
    serviceName: 'The Loop Movers',
    areaServed: ['The Loop, Chicago, IL', '60601', '60602', '60603']
  },
  'neighborhoods/west-loop-movers.html': {
    title: `West Loop Movers | High-Rises, Lofts, Loading Docks & Fulton Market Moves | ${BRAND}`,
    description:
      'West Loop movers for lofts, condo towers, Fulton Market offices, and high-rise moves with dock coordination, freight reservations, and busy-street logistics.',
    serviceName: 'West Loop Movers',
    areaServed: ['West Loop, Chicago, IL', '60607', '60661']
  },
  'neighborhoods/logan-square-movers.html': {
    title: `Logan Square Movers | Boulevards, Walk-Ups & Condo Moves | ${BRAND}`,
    description:
      'Logan Square movers for boulevard homes, vintage walk-ups, and condo moves across 60647 and 60618 with neighborhood-specific planning.',
    serviceName: 'Logan Square Movers',
    areaServed: ['Logan Square, Chicago, IL', '60618', '60647']
  }
};

const ARTICLE_PAGES = {
  'blog/blog-small-vs-big-moving-companies.html': {
    title: `Small vs. Big Moving Companies | Chicago Mover Comparison | ${BRAND}`,
    description:
      'Compare small versus big moving companies in Chicago and learn how pricing, communication, and accountability can affect your move.',
    schemaType: 'blogPost'
  },
  'blog/blog-stress-free-moving-day.html': {
    title: `Stress-Free Moving Day Tips | Chicago Moving Guide | ${BRAND}`,
    description:
      'Use these Chicago moving day tips to stay organized, protect your belongings, and keep the day running smoothly from start to finish.',
    schemaType: 'blogPost'
  },
  'blog/blog-chicago-neighborhoods-guide.html': {
    title: `Chicago Neighborhood Moving Guide | Permits, Elevators & Timing | ${BRAND}`,
    description:
      'A Chicago neighborhood moving guide covering permits, elevator reservations, loading zones, and timing tips across popular city areas.',
    schemaType: 'blogPost'
  },
  'blog/blog-packing-fragile-items.html': {
    title: `How to Pack Fragile Items for a Move | Chicago Guide | ${BRAND}`,
    description:
      'Learn how to pack fragile items for a move with the right materials, wrapping methods, and labeling tips to prevent damage.',
    schemaType: 'blogPost'
  },
  'blog/blog-hoisting-benefits.html': {
    title: `When Hoisting Makes Sense for a Move | Chicago Guide | ${BRAND}`,
    description:
      'Learn when hoisting makes sense for a Chicago move, what it solves, and how oversized items are lifted safely when access is tight.',
    schemaType: 'blogPost'
  },
  'blog/blog-best-time-to-move-chicago.html': {
    title: `Best Time to Move in Chicago | Parking, Permits & Weather Tips | ${BRAND}`,
    description:
      'Find the best time to move in Chicago with practical advice on parking permits, elevator bookings, weather, and neighborhood timing.',
    schemaType: 'blogPost'
  },
  'blog/blog-elevator-loading-zone-permits-chicago.html': {
    title: `Chicago Elevator Reservations & Loading Zone Permit Guide | ${BRAND}`,
    description:
      'A step-by-step Chicago guide to elevator reservations, loading zones, COI requirements, and building coordination for high-rise moves.',
    schemaType: 'blogPost'
  },
  'blog/blog-moving-wicker-lincoln-south-loop.html': {
    title: `Moving to Wicker Park, Lincoln Park or South Loop | Local Guide | ${BRAND}`,
    description:
      'Get local moving tips for Wicker Park, Lincoln Park, and South Loop, including parking, stairs, elevators, and best timing.',
    schemaType: 'blogPost'
  },
  'blog/blog-packing-tips.html': {
    title: `Packing Tips for Moving | Chicago Packing Guide | ${BRAND}`,
    description:
      'Use these packing tips for moving to organize boxes, protect breakables, label efficiently, and make moving day easier.',
    schemaType: 'blogPost'
  },
  'blog/blog-moving-checklist.html': {
    title: `Moving Checklist | 8 Weeks to Moving Day Guide | ${BRAND}`,
    description:
      'Follow this moving checklist from 8 weeks out through moving day so you can stay organized and avoid last-minute surprises.',
    schemaType: 'blogPost'
  },
  'blog/blog-moving-with-pets.html': {
    title: `Moving with Pets in Chicago | Dogs, Cats & Stress Reduction Tips | ${BRAND}`,
    description:
      'Moving with pets in Chicago takes planning. Use these tips to keep dogs and cats calm, safe, and comfortable before and after the move.',
    schemaType: 'blogPost'
  },
  'blog/blog-tipping-movers.html': {
    title: `How Much to Tip Movers in Chicago | Tipping Guide | ${BRAND}`,
    description:
      'Wondering how much to tip movers in Chicago? This guide covers typical ranges, when to tip more, and how to budget for move day.',
    schemaType: 'blogPost'
  },
  'blog/blog-understanding-moving-quotes.html': {
    title: `Understanding Moving Quotes | Binding vs Non-Binding Guide | ${BRAND}`,
    description:
      'Understand moving quotes, including binding versus non-binding estimates, what affects pricing, and how to avoid hidden fees.',
    schemaType: 'blogPost'
  },
  'blog/blog-change-of-address.html': {
    title: `Change of Address Checklist for a Move | Chicago Guide | ${BRAND}`,
    description:
      'Use this change of address checklist to update mail, utilities, banking, insurance, and key accounts during your Chicago move.',
    schemaType: 'blogPost'
  },
  'blog/blog-decluttering-before-move.html': {
    title: `Decluttering Before a Move | Chicago Downsizing Tips | ${BRAND}`,
    description:
      'Declutter before a move with practical tips that help you cut costs, reduce boxes, and make packing more manageable.',
    schemaType: 'blogPost'
  },
  'blog/blog-first-apartment.html': {
    title: `First Apartment Checklist | Essentials for Moving In | ${BRAND}`,
    description:
      'Use this first apartment checklist to cover move-in essentials, setup priorities, and what to buy before the boxes arrive.',
    schemaType: 'blogPost'
  },
  'blog/blog-office-move.html': {
    title: `Chicago Office Move Planning Checklist | Reduce Downtime | ${BRAND}`,
    description:
      'Use this Chicago office move planning checklist to coordinate vendors, staff, IT, and timelines before business relocation day.',
    schemaType: 'blogPost'
  },
  'blog/blog-sustainable-moving.html': {
    title: `Eco-Friendly Moving Tips | Reduce Waste During a Move | ${BRAND}`,
    description:
      'Try eco-friendly moving tips that reduce waste, reuse materials, and make packing and transportation more sustainable.',
    schemaType: 'blogPost'
  },
  'we-love-chicago/2026-chicago-neighborhood-growth-report.html': {
    title: `2026 Chicago Neighborhood Growth Report | Local Trends & Demand | ${BRAND}`,
    description:
      'Explore the 2026 Chicago neighborhood growth report and see which areas are adding residents, investment, and moving demand.',
    schemaType: 'communityPost'
  },
  'we-love-chicago/2026-logan-square-development-update.html': {
    title: `Logan Square Development Update 2026 | Local Growth Watch | ${BRAND}`,
    description:
      'Read the 2026 Logan Square development update covering major projects, neighborhood momentum, and what those changes could mean locally.',
    schemaType: 'communityPost'
  },
  'we-love-chicago/2026-affordable-chicago-neighborhoods.html': {
    title: `Affordable Chicago Neighborhoods in 2026 | Local Guide | ${BRAND}`,
    description:
      'Explore affordable Chicago neighborhoods in 2026 with local context on rent, livability, and what movers should know before relocating.',
    schemaType: 'communityPostWithFaq'
  },
  'we-love-chicago/2026-1901-project-west-loop-near-west-side.html': {
    title: `1901 Project Chicago | West Loop & Near West Side Update | ${BRAND}`,
    description:
      'A local look at Chicago’s 1901 Project and what its West Loop and Near West Side changes could mean for traffic, housing, and moving demand.',
    schemaType: 'communityPost'
  }
};

const PAGE_DEFINITIONS = {
  ...ROOT_PAGES,
  ...Object.fromEntries(
    Object.entries(SERVICE_PAGES).map(([path, page]) => [path, { ...page, schemaType: 'service' }])
  ),
  ...Object.fromEntries(
    Object.entries(AREA_PAGES).map(([path, page]) => [path, { ...page, schemaType: 'areaService' }])
  ),
  ...ARTICLE_PAGES
};

module.exports = {
  BASE_URL,
  BRAND,
  BUSINESS,
  PAGE_DEFINITIONS
};
