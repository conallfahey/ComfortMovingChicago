const BRAND = 'Comfort Moving Chicago';
const BUSINESS_NAME = 'Comfort Moving Chicago';
const BASE_URL = 'https://comfortmovingchicago.com';

const CHICAGOLAND_AREA_SERVED = [
  { '@type': 'City', name: 'Chicago', containedInPlace: { '@type': 'State', name: 'Illinois' } },
  { '@type': 'AdministrativeArea', name: 'Chicago metropolitan area', alternateName: 'Chicagoland' },
  { '@type': 'AdministrativeArea', name: 'Cook County', containedInPlace: { '@type': 'State', name: 'Illinois' } },
  { '@type': 'AdministrativeArea', name: 'DuPage County', containedInPlace: { '@type': 'State', name: 'Illinois' } },
  { '@type': 'AdministrativeArea', name: 'Kane County', containedInPlace: { '@type': 'State', name: 'Illinois' } },
  { '@type': 'AdministrativeArea', name: 'Kendall County', containedInPlace: { '@type': 'State', name: 'Illinois' } },
  { '@type': 'AdministrativeArea', name: 'Lake County', containedInPlace: { '@type': 'State', name: 'Illinois' } },
  { '@type': 'AdministrativeArea', name: 'McHenry County', containedInPlace: { '@type': 'State', name: 'Illinois' } },
  { '@type': 'AdministrativeArea', name: 'Will County', containedInPlace: { '@type': 'State', name: 'Illinois' } }
];

const BUSINESS = {
  '@id': `${BASE_URL}/#business`,
  '@type': 'MovingCompany',
  name: BUSINESS_NAME,
  url: `${BASE_URL}/`,
  image: [
    `${BASE_URL}/Images/Chicago-Movers-Loading-Large-Box-Truck.webp`,
    `${BASE_URL}/Images/Chicago-Moving-Company-Crew-Loading-Boxes.webp`,
    `${BASE_URL}/Images/Friendly-Chicago-Mover-With-Moving-Box.webp`
  ],
  logo: {
    '@type': 'ImageObject',
    '@id': `${BASE_URL}/#logo`,
    url: `${BASE_URL}/Images/CMC_logo.webp`,
    contentUrl: `${BASE_URL}/Images/CMC_logo.webp`,
    width: 863,
    height: 863
  },
  telephone: '+17732361724',
  email: 'comfortmovingchicago@gmail.com',
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '3605 N Damen Ave',
    addressLocality: 'Chicago',
    addressRegion: 'IL',
    postalCode: '60618',
    addressCountry: 'US'
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 41.947076,
    longitude: -87.678368
  },
  areaServed: CHICAGOLAND_AREA_SERVED,
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Moving Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Local Moving Across Chicagoland',
          serviceType: 'Local moving services',
          provider: { '@id': `${BASE_URL}/#business` },
          areaServed: { '@type': 'AdministrativeArea', name: 'Chicago metropolitan area', alternateName: 'Chicagoland' }
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Long-Distance Moving From or To Chicagoland',
          serviceType: 'Long-distance moving services',
          provider: { '@id': `${BASE_URL}/#business` },
          areaServed: { '@type': 'AdministrativeArea', name: 'Chicago metropolitan area', alternateName: 'Chicagoland' }
        }
      }
    ]
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'https://schema.org/Monday',
        'https://schema.org/Tuesday',
        'https://schema.org/Wednesday',
        'https://schema.org/Thursday',
        'https://schema.org/Friday',
        'https://schema.org/Saturday',
        'https://schema.org/Sunday'
      ],
      opens: '08:00',
      closes: '18:00'
    }
  ],
  sameAs: [
    'https://www.facebook.com/p/Comfort-Moving-Chicago-100085395917097/',
    'https://www.instagram.com/comfortmovingchicago',
    'https://www.yelp.com/biz/comfort-moving-chicago-oak-park-5',
    'https://www.google.com/maps/place/Comfort+Moving+Chicago/@41.947076,-87.678368,12z/data=!4m18!1m9!3m8!1s0x5bf2bd826f19ab:0x43519a12a665ddb4!2sComfort+Moving+Chicago!8m2!3d41.947076!4d-87.678368!9m1!1b1!16s%2Fg%2F11t16g7r3g!3m7!1s0x5bf2bd826f19ab:0x43519a12a665ddb4!8m2!3d41.947076!4d-87.678368!9m1!1b1!16s%2Fg%2F11t16g7r3g?entry=ttu'
  ]
};

const ROOT_PAGES = {
  'index.html': {
    title: 'Chicago Movers | Apartments, Homes & Same-Day Moves',
    description:
      'Chicago movers for apartments, homes, offices, same-day, and long-distance moves. Owner-operated, licensed, and serving the Chicagoland region.',
    schemaType: 'home'
  },
  'services.html': {
    title: 'Chicago Moving Services | Residential, Office & Packing',
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
    schemaType: 'webPage'
  },
  'we-love-chicago/index.html': {
    title: `Chicago Neighborhood Blog | Local Trends & Moving Insights | ${BRAND}`,
    description:
      'Read Chicago neighborhood updates, development news, affordability guides, and local insights from Comfort Moving Chicago.',
    schemaType: 'webPage'
  },
  'careers.html': {
    title: `Moving Jobs in Chicago | Join Our Crew | ${BRAND}`,
    description:
      'Explore mover, driver, and crew opportunities with Comfort Moving Chicago. Learn what we value and apply to join our dependable Chicago moving team.',
    schemaType: 'webPage'
  },
  'local-chicago-movers.html': {
    title: 'Redirecting...',
    description: 'Redirecting to Comfort Moving Chicago homepage.',
    schemaType: 'none'
  }
};

const SERVICE_PAGES = {
  'services/affordable-chicago-movers.html': {
    title: 'Affordable Movers Chicago | Clear Local Moving Quotes',
    description:
      'Affordable movers in Chicago for studios, apartments, labor-only moves, and small local moves with clear quotes, efficient crews, and no hidden fees.',
    serviceType: 'Affordable moving services',
    serviceName: 'Affordable Chicago Movers',
    areaServed: ['Chicago, IL']
  },
  'services/residential-moving-chicago.html': {
    title: 'House Movers Chicago & Suburbs | Residential Moving',
    description:
      'House movers for Chicago and nearby suburbs, including large homes, townhomes, condos, family moves, careful furniture protection, packing help, and clear local quotes.',
    serviceType: 'Residential moving services',
    serviceName: 'Residential Moving Chicago',
    areaServed: ['Chicago, IL', 'Oak Park, IL', 'Evanston, IL', 'Skokie, IL', 'Park Ridge, IL']
  },
  'services/packing-services-chicago.html': {
    title: 'Packing Services Chicago | Full & Fragile-Item Packing',
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
  'services/facebook-marketplace-pickup-chicago.html': {
    title: `Facebook Marketplace Pickup Chicago | Furniture & Item Delivery | ${BRAND}`,
    description:
      'Chicago Facebook Marketplace pickup and delivery for couches, dressers, tables, marketplace furniture, and single-item local moves. Send pickup, drop-off, and item details for a fast quote.',
    serviceType: 'Marketplace item pickup and delivery',
    serviceName: 'Facebook Marketplace Pickup Chicago',
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
    title: 'Office Movers Chicago | COI & After-Hours Moves',
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
    title: 'Same-Day Movers Chicago | Last-Minute Moving Help',
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
  },
  'services/ffe-movers-installation-chicago.html': {
    title: 'FF&E Movers Chicago | Furniture & Equipment Installation',
    description:
      'FF&E and FFE movers in Chicago for furniture, fixtures, equipment installation, office furniture setup, retail displays, model units, and commercial spaces.',
    serviceType: 'FF&E moving and installation services',
    serviceName: 'FF&E Moving and Installation Services in Chicago',
    areaServed: ['Chicago, IL']
  }
};

const AREA_PAGES = {
  'neighborhoods/lincoln-park-movers.html': {
    title: 'Lincoln Park Movers | Walk-Ups, Condos & Homes',
    description:
      'Lincoln Park movers for apartments, walk-ups, condos, and high-rises with permit planning and careful handling for busy Chicago streets.',
    serviceName: 'Lincoln Park Movers',
    areaServed: ['Lincoln Park, Chicago, IL', '60614', '60657']
  },
  'neighborhoods/wicker-park-movers.html': {
    title: 'Wicker Park Movers | Walk-Ups & Apartment Moves',
    description:
      'Wicker Park movers for walk-ups, permit-heavy streets, alley loading, and apartment moves around 60622 with local route and timing planning.',
    serviceName: 'Wicker Park Movers',
    areaServed: ['Wicker Park, Chicago, IL', '60622', '60647']
  },
  'neighborhoods/lakeview-movers.html': {
    title: 'Lakeview Movers | Apartments, High-Rises & Walk-Ups',
    description:
      'Lakeview movers for walk-ups, lakefront high-rises, condos, and Wrigleyville apartments with parking, elevator, and event-day planning.',
    serviceName: 'Lakeview Movers',
    areaServed: ['Lakeview, Chicago, IL', '60613', '60657']
  },
  'neighborhoods/evanston-movers.html': {
    title: 'Evanston Movers | Northwestern, Condos & Homes',
    description:
      'Evanston movers for condos, single-family homes, and Northwestern student moves with local scheduling and suburb-to-city coordination.',
    serviceName: 'Evanston Movers',
    areaServed: ['Evanston, IL']
  },
  'neighborhoods/rogers-park-movers.html': {
    title: 'Rogers Park Movers | Lakefront & Student Moves',
    description:
      'Rogers Park movers for lakefront apartments, Loyola-area student moves, and walk-ups with flexible scheduling across 60626 and 60645.',
    serviceName: 'Rogers Park Movers',
    areaServed: ['Rogers Park, Chicago, IL', '60626', '60645']
  },
  'neighborhoods/oak-park-movers.html': {
    title: 'Oak Park Movers | Historic Homes, Condos & Apartments',
    description:
      'Oak Park movers for historic homes, condos, apartments, detached garages, and careful suburb moves across 60301, 60302, and 60304.',
    serviceName: 'Oak Park Movers',
    areaServed: ['Oak Park, IL', '60301', '60302', '60304']
  },
  'neighborhoods/the-loop-movers.html': {
    title: 'The Loop Movers | High-Rise, Condo & Office Moves',
    description:
      'The Loop movers for downtown high-rises, condo moves, and office relocations with COI support, loading dock coordination, and timing plans.',
    serviceName: 'The Loop Movers',
    areaServed: ['The Loop, Chicago, IL', '60601', '60602', '60603']
  },
  'neighborhoods/west-loop-movers.html': {
    title: 'West Loop Movers | Lofts, Towers & Office Moves',
    description:
      'West Loop movers for lofts, condo towers, Fulton Market offices, and high-rise moves with dock coordination, freight reservations, and busy-street logistics.',
    serviceName: 'West Loop Movers',
    areaServed: ['West Loop, Chicago, IL', '60607', '60661']
  },
  'neighborhoods/logan-square-movers.html': {
    title: 'Logan Square Movers | Greystones, Walk-Ups & Condos',
    description:
      'Logan Square movers for boulevard homes, vintage walk-ups, and condo moves across 60647 and 60618 with neighborhood-specific planning.',
    serviceName: 'Logan Square Movers',
    areaServed: ['Logan Square, Chicago, IL', '60618', '60647']
  },
  'neighborhoods/ravenswood-movers.html': {
    title: 'Ravenswood Movers | Apartments, Homes & Studios',
    description:
      'Ravenswood movers for apartments, two-flats, courtyard buildings, homes, and studios with practical parking, stair, and loading plans.',
    serviceName: 'Ravenswood Movers',
    areaServed: ['Ravenswood, Chicago, IL', '60613', '60640']
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
  },
  'we-love-chicago/2026-chicago-fire-stadium-the-78-south-loop.html': {
    title: `Chicago Fire Stadium at The 78 | South Loop Moving Update | ${BRAND}`,
    description:
      "Chicago Fire FC's new stadium at The 78, McDonald's Park, could reshape South Loop traffic, apartments, business moves, and moving logistics near downtown Chicago.",
    schemaType: 'communityPostWithFaq'
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
