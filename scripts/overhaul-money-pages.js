const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

function read(filePath) {
  return fs.readFileSync(path.join(root, filePath), 'utf8');
}

function write(filePath, content) {
  fs.writeFileSync(path.join(root, filePath), content);
}

function replaceBlock(filePath, pattern, replacement) {
  const original = read(filePath);
  const next = original.replace(pattern, replacement);
  if (next === original) {
    throw new Error(`Pattern did not match in ${filePath}`);
  }
  write(filePath, next);
}

const officeReplacement = `
    <section class="about-section-modern">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6 mb-4 mb-lg-0">
             <div class="position-relative">
                <div class="rounded-5 overflow-hidden shadow-lg position-relative" style="z-index: 2;">
                   <img src="/Images/Chicago-Moving-Company-Elevator-Dolly.webp" alt="Chicago office movers using an elevator dolly" class="img-fluid w-100" loading="lazy">
                </div>
                <div class="position-absolute bg-secondary-brand rounded-circle" style="width: 150px; height: 150px; bottom: -30px; left: -30px; z-index: 1; opacity: 0.1;"></div>
                <div class="position-absolute bg-brand-blue rounded-circle" style="width: 100px; height: 100px; top: -20px; right: -20px; z-index: 1; opacity: 0.1;"></div>
             </div>
          </div>
          <div class="col-lg-6 ps-lg-5">
            <span class="badge bg-secondary-brand rounded-pill px-3 py-2 mb-3">Why This Move Type Is Different</span>
            <h2 class="display-5 fw-bold mb-4 font-family-sans-serif">Office Moves Are Mostly About <span class="text-secondary-brand">Coordination Risk</span></h2>
            <p class="lead text-muted mb-4">Commercial relocations are usually won or lost on approvals, timing, and staging. The truck is only one part of the job.</p>
            <div class="about-feature-item"><div class="about-feature-icon"><i class="bi bi-building-check fs-4"></i></div><div class="about-feature-text"><h5>Building Rules First</h5><p>COIs, dock times, security check-ins, and freight elevator windows all need to be handled before move day starts.</p></div></div>
            <div class="about-feature-item"><div class="about-feature-icon"><i class="bi bi-pc-display fs-4"></i></div><div class="about-feature-text"><h5>Equipment Needs A Plan</h5><p>Monitors, printers, files, standing desks, and shared workstations need better sequencing than a typical residential job.</p></div></div>
            <div class="about-feature-item"><div class="about-feature-icon"><i class="bi bi-clock-history fs-4"></i></div><div class="about-feature-text"><h5>Downtime Matters</h5><p>The move is only successful if your team can get back to work quickly, not if the truck simply empties out on time.</p></div></div>
            <div class="mt-4"><a href="#quoteForm" class="btn btn-primary-brand rounded-pill px-4 py-2 fw-bold shadow-sm">Plan Your Office Move</a></div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-5 bg-light-pattern">
      <div class="container">
        <div class="text-center mb-5">
          <span class="badge bg-brand-blue rounded-pill px-3 py-2 mb-3 text-white">What Makes This Hard Here</span>
          <h2 class="display-5 fw-bold font-family-sans-serif">The Chicago Office Problems That Usually Slow A Move Down</h2>
          <p class="lead text-muted mx-auto" style="max-width: 760px;">This page is built for businesses dealing with access rules, scheduling pressure, and reopening pressure.</p>
        </div>
        <div class="row g-4">
          <div class="col-md-6 col-lg-3"><div class="service-card-modern h-100"><h5 class="fw-bold mb-3">Downtown Dock Windows</h5><p class="text-muted mb-0">Tight reservations in Loop and West Loop buildings can decide the whole pace of the move.</p></div></div>
          <div class="col-md-6 col-lg-3"><div class="service-card-modern h-100"><h5 class="fw-bold mb-3">Mixed-Use Towers</h5><p class="text-muted mb-0">Offices inside residential or mixed-use buildings often have stricter freight access and security rules.</p></div></div>
          <div class="col-md-6 col-lg-3"><div class="service-card-modern h-100"><h5 class="fw-bold mb-3">IT and Furniture Sequencing</h5><p class="text-muted mb-0">If desks and equipment land in the wrong order, the office reopens slower than it should.</p></div></div>
          <div class="col-md-6 col-lg-3"><div class="service-card-modern h-100"><h5 class="fw-bold mb-3">Staff Return Timing</h5><p class="text-muted mb-0">A good move ends with a usable office, not a pile of labeled problems for Monday morning.</p></div></div>
        </div>
      </div>
    </section>

    <section class="py-5">
      <div class="container">
        <div class="row g-4 align-items-start">
          <div class="col-lg-7">
            <span class="badge bg-secondary-brand rounded-pill px-3 py-2 mb-3">What To Expect</span>
            <h2 class="display-5 fw-bold font-family-sans-serif mb-4">How We Run A Small To Mid-Size Office Move</h2>
            <div class="bg-white p-4 rounded-4 shadow-sm border h-100">
              <div class="mb-4"><h3 class="h5 fw-bold">1. Access and approval check</h3><p class="text-muted mb-0">We verify COIs, dock windows, elevator reservations, and building-specific restrictions before the truck shows up.</p></div>
              <div class="mb-4"><h3 class="h5 fw-bold">2. Label by room or team</h3><p class="text-muted mb-0">We sort by office area, department, or destination so unloading is organized instead of reactive.</p></div>
              <div class="mb-4"><h3 class="h5 fw-bold">3. Priority-first unloading</h3><p class="text-muted mb-0">Reception, leadership offices, shared equipment, and core workstations can be staged first if the business needs them first.</p></div>
              <div><h3 class="h5 fw-bold">4. Reassembly and reset</h3><p class="text-muted mb-0">We reassemble desks, tables, and shelving so the move ends closer to operational, not just transported.</p></div>
            </div>
          </div>
          <div class="col-lg-5">
            <div class="bg-light p-4 rounded-4 border h-100">
              <h3 class="h5 fw-bold mb-3">Best fit for this service</h3>
              <p class="text-muted">Small offices, studios, agency teams, professional suites, internal business moves, and relocations where downtime matters.</p>
              <h3 class="h5 fw-bold mb-3 mt-4">Useful next pages</h3>
              <p class="text-muted mb-0">If your building is tower-heavy, read <a href="/neighborhoods/west-loop-movers.html">West Loop movers</a>. If you need prep help before move day, pair this with <a href="/services/packing-services-chicago.html">packing services</a>.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-5 bg-light-pattern">
      <div class="container text-center">
        <h2 class="fw-bold mb-4">Helpful Planning Resources</h2>
        <div class="row justify-content-center gap-4">
          <div class="col-md-5"><div class="bg-white p-4 rounded-4 shadow-sm h-100"><h5 class="fw-bold">Office Move Planning Checklist</h5><p>Use a business-focused checklist before moving staff, equipment, and shared spaces.</p><a href="/blog/blog-office-move.html" class="btn btn-outline-primary rounded-pill">Read Guide</a></div></div>
          <div class="col-md-5"><div class="bg-white p-4 rounded-4 shadow-sm h-100"><h5 class="fw-bold">Elevators, COIs, and Loading Rules</h5><p>Get ahead of the approval issues that commonly derail Chicago commercial moves.</p><a href="/blog/blog-elevator-loading-zone-permits-chicago.html" class="btn btn-outline-primary rounded-pill">Read Tips</a></div></div>
        </div>
      </div>
    </section>

    <section class="faq-section bg-light py-5">
      <div class="container">
        <div class="text-center mb-5">
           <span class="badge bg-primary-brand rounded-pill px-3 py-2 mb-3">FAQ</span>
           <h2 class="display-5 fw-bold font-family-sans-serif">Office Moving Questions</h2>
        </div>
        <div class="row justify-content-center">
          <div class="col-lg-8">
            <div class="accordion" id="faqAccordion">
              <div class="accordion-item"><h2 class="accordion-header"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">Can you provide a COI for our building?</button></h2><div id="faq1" class="accordion-collapse collapse" data-bs-parent="#faqAccordion"><div class="accordion-body">Yes. Send the building requirements early and we can prepare the COI so management approval does not hold up the move.</div></div></div>
              <div class="accordion-item"><h2 class="accordion-header"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">Do you move monitors, printers, and shared equipment?</button></h2><div id="faq2" class="accordion-collapse collapse" data-bs-parent="#faqAccordion"><div class="accordion-body">Yes. We regularly move computers, monitors, printers, shelving, and workstations. If your IT team needs a specific disconnect order, we can stage around it.</div></div></div>
              <div class="accordion-item"><h2 class="accordion-header"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq3">Can you move us after hours or on a weekend?</button></h2><div id="faq3" class="accordion-collapse collapse" data-bs-parent="#faqAccordion"><div class="accordion-body">Usually, yes. Many office moves are scheduled outside business hours to reduce downtime and fit building rules.</div></div></div>
              <div class="accordion-item"><h2 class="accordion-header"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq4">Do you disassemble desks, cubicles, and conference tables?</button></h2><div id="faq4" class="accordion-collapse collapse" data-bs-parent="#faqAccordion"><div class="accordion-body">Yes. We can break down and reassemble common office furniture so the new space is usable faster.</div></div></div>
              <div class="accordion-item"><h2 class="accordion-header"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq5">Which neighborhood page helps with downtown tower logistics?</button></h2><div id="faq5" class="accordion-collapse collapse" data-bs-parent="#faqAccordion"><div class="accordion-body">If your office is in a tower or mixed-use district, read <a href="/neighborhoods/west-loop-movers.html">West Loop movers</a> for dock and freight-elevator context.</div></div></div>
            </div>
          </div>
        </div>
      </div>
    </section>
`;

const sameDayReplacement = `
    <section class="py-5">
      <div class="container">
        <div class="text-center mb-5">
          <span class="badge bg-primary-brand rounded-pill px-3 py-2 mb-3 text-white">What Makes This Hard Here</span>
          <h2 class="display-5 fw-bold font-family-sans-serif">A Same-Day Move Is Usually A <span class="text-secondary-brand">Dispatch Problem</span> Before It Is A Moving Problem</h2>
          <p class="lead text-muted mx-auto" style="max-width: 760px;">These jobs are not just fast. They are uncertain. The real question is how much is packed, what the building requires, and how quickly we can turn unclear information into a workable plan.</p>
        </div>
        <div class="row g-4">
          <div class="col-md-6 col-lg-3"><div class="service-card-modern h-100"><h5 class="fw-bold mb-3">Building Rules Still Count</h5><p class="text-muted mb-0">Same-day apartment moves still run into elevator reservations, freight windows, COIs, and no-parking issues.</p></div></div>
          <div class="col-md-6 col-lg-3"><div class="service-card-modern h-100"><h5 class="fw-bold mb-3">The Inventory Is Usually Unclear</h5><p class="text-muted mb-0">Short-notice jobs often start with rough estimates, half-packed rooms, and a move list that changes while we are planning.</p></div></div>
          <div class="col-md-6 col-lg-3"><div class="service-card-modern h-100"><h5 class="fw-bold mb-3">Access Can Be Worse Than Expected</h5><p class="text-muted mb-0">Walk-ups, alley loading, basement units, and tight hallways matter more when there is no extra planning time.</p></div></div>
          <div class="col-md-6 col-lg-3"><div class="service-card-modern h-100"><h5 class="fw-bold mb-3">Speed Without Damage Is The Goal</h5><p class="text-muted mb-0">Fast is only useful if your furniture, walls, and timing survive the day.</p></div></div>
        </div>
      </div>
    </section>

    <section class="py-5 bg-light-pattern">
      <div class="container">
        <div class="row g-4 align-items-start">
          <div class="col-lg-7">
            <span class="badge bg-secondary-brand rounded-pill px-3 py-2 mb-3">How Dispatch Works</span>
            <h2 class="display-5 fw-bold font-family-sans-serif mb-4">What We Need To Know Fast</h2>
            <div class="bg-white p-4 rounded-4 shadow-sm border h-100">
              <div class="mb-4"><h3 class="h5 fw-bold">1. Start and finish addresses</h3><p class="text-muted mb-0">We need to know where the truck can stop, what neighborhood traffic looks like, and whether the delivery building has rules.</p></div>
              <div class="mb-4"><h3 class="h5 fw-bold">2. Building access details</h3><p class="text-muted mb-0">Walk-up, elevator, loading dock, basement unit, service entrance, long carry, or alley access all change timing immediately.</p></div>
              <div class="mb-4"><h3 class="h5 fw-bold">3. What is already packed</h3><p class="text-muted mb-0">If the apartment is half packed, we can tell you whether to focus on essentials first or add limited <a href="/services/packing-services-chicago.html">packing help</a>.</p></div>
              <div><h3 class="h5 fw-bold">4. The items that slow the job down</h3><p class="text-muted mb-0">Large sectionals, dressers, mirrors, desks, and awkward stair carries matter more than the box count on a rushed move.</p></div>
            </div>
          </div>
          <div class="col-lg-5">
            <div class="bg-light p-4 rounded-4 border h-100">
              <h3 class="h5 fw-bold mb-3">Most common reasons people land here</h3>
              <p class="text-muted">Mover cancellation, a lease deadline, a closing change, a relationship split, a basement or walk-up move that has to happen now, or a Chicago building that finally gave you a narrow move window.</p>
              <h3 class="h5 fw-bold mb-3 mt-4">Best fit for this service</h3>
              <p class="text-muted mb-0">Studios, one-bedrooms, small apartments, labor-only help, and urgent local moves where response time matters more than long-range planning.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-5 bg-white">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6 mb-4 mb-lg-0"><div class="rounded-5 overflow-hidden shadow-lg position-relative"></div></div>
          <div class="col-lg-6 ps-lg-5">
            <span class="badge bg-secondary-brand rounded-pill px-3 py-2 mb-3">What People Worry About</span>
            <h2 class="display-5 fw-bold font-family-sans-serif mb-4">Not Packed Yet? <span class="text-brand-blue">Still Worth Calling.</span></h2>
            <p class="lead text-muted mb-4">Many same-day customers are calling from stress, not perfect preparation.</p>
            <p class="mb-4">If boxes are half done, closets are still full, or the plan changed overnight, that does not automatically mean the move is impossible. We would rather know the real situation and tell you what is workable than give you a fake easy answer.</p>
            <div class="d-flex align-items-center gap-3"><div class="d-flex align-items-center text-success fw-bold"><i class="bi bi-check-circle-fill me-2 fs-5"></i> Real availability checks</div><div class="d-flex align-items-center text-success fw-bold"><i class="bi bi-check-circle-fill me-2 fs-5"></i> Clear next steps</div></div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-5 bg-light-pattern">
      <div class="container">
        <div class="row mt-5 justify-content-center g-4">
            <div class="col-12 text-center mb-5">
                <span class="badge bg-brand-blue rounded-pill px-3 py-2 mb-3 text-white">Urgent Moves</span>
                <h3 class="display-5 fw-bold font-family-sans-serif">Helpful Last-Minute Resources</h3>
                <p class="lead text-muted mx-auto" style="max-width: 700px;">Use these if you need to make quick decisions before the crew arrives.</p>
            </div>
            <div class="col-md-6 col-lg-5"><a href="/blog/blog-packing-tips.html" class="text-decoration-none"><div class="service-card-modern h-100"><div class="d-flex align-items-center mb-4"><div class="rounded-circle bg-light p-3 d-flex align-items-center justify-content-center me-3" style="width: 60px; height: 60px;"><i class="bi bi-hourglass-split text-brand-blue fs-3"></i></div><div><h5 class="fw-bold text-dark mb-1">Speed Packing</h5><span class="badge bg-secondary-brand rounded-pill">Short Notice</span></div></div><h4 class="fw-bold text-dark mb-3">Pack What Matters First</h4><p class="text-muted mb-4">Focus on fragile items, open shelving, and essentials if you are still packing when the clock is running.</p><div class="d-flex align-items-center text-brand-blue fw-bold mt-auto">Read Tips <i class="bi bi-arrow-right ms-2"></i></div></div></a></div>
            <div class="col-md-6 col-lg-5"><a href="/blog/blog-elevator-loading-zone-permits-chicago.html" class="text-decoration-none"><div class="service-card-modern h-100"><div class="d-flex align-items-center mb-4"><div class="rounded-circle bg-light p-3 d-flex align-items-center justify-content-center me-3" style="width: 60px; height: 60px;"><i class="bi bi-building-fill-check text-brand-blue fs-3"></i></div><div><h5 class="fw-bold text-dark mb-1">Building Rules</h5><span class="badge bg-secondary-brand rounded-pill">Chicago Access</span></div></div><h4 class="fw-bold text-dark mb-3">Elevators, Docks, and Permits</h4><p class="text-muted mb-4">If your move is urgent, building restrictions can still be the thing that slows it down most.</p><div class="d-flex align-items-center text-brand-blue fw-bold mt-auto">Read Guide <i class="bi bi-arrow-right ms-2"></i></div></div></a></div>
        </div>
      </div>
    </section>
`;

const seniorReplacement = `
    <section class="py-5 bg-light-pattern">
      <div class="container">
        <div class="text-center mb-5">
          <span class="badge bg-brand-blue rounded-pill px-3 py-2 mb-3 text-white">What Makes This Hard Here</span>
          <h2 class="display-5 fw-bold font-family-sans-serif">A Senior Move Is Usually A <span class="text-secondary-brand">Family Transition</span>, Not Just A Truck Job</h2>
          <p class="lead text-muted mx-auto" style="max-width: 760px;">This page needs to solve for pace, decision fatigue, room setup, and move-in rules at the new location, not just transportation.</p>
        </div>
        <div class="row justify-content-center g-4">
          <div class="col-md-6 col-lg-3"><div class="service-card-modern h-100"><h5 class="fw-bold mb-3">Downsizing Decisions</h5><p class="text-muted mb-0">Families are often sorting decades of furniture, keepsakes, paperwork, and room layouts under time pressure.</p></div></div>
          <div class="col-md-6 col-lg-3"><div class="service-card-modern h-100"><h5 class="fw-bold mb-3">Facility Requirements</h5><p class="text-muted mb-0">Senior living communities may require move windows, elevator coordination, insurance documents, and tighter item lists.</p></div></div>
          <div class="col-md-6 col-lg-3"><div class="service-card-modern h-100"><h5 class="fw-bold mb-3">Health and Mobility Concerns</h5><p class="text-muted mb-0">Walkways, adjustable beds, mobility aids, and comfort items all change how the day should be staged.</p></div></div>
          <div class="col-md-6 col-lg-3"><div class="service-card-modern h-100"><h5 class="fw-bold mb-3">The New Space Has To Feel Usable</h5><p class="text-muted mb-0">The move is not really done if the bed, chair, and essentials are not set up where they can be used right away.</p></div></div>
        </div>
      </div>
    </section>

    <section class="py-5">
      <div class="container">
        <div class="row justify-content-center g-4">
          <div class="col-md-6 col-lg-4"><div class="service-card-modern h-100"><div class="d-flex align-items-center mb-4"><div class="rounded-circle bg-light p-3 d-flex align-items-center justify-content-center me-3" style="width: 60px; height: 60px;"><i class="bi bi-house-heart text-brand-blue fs-3"></i></div><div><h5 class="fw-bold text-dark mb-0">Home To Smaller Home</h5></div></div><p class="text-muted mb-0">Best for downsizing from a long-time house, condo, or apartment into a smaller local space with selective packing and furniture planning.</p></div></div>
          <div class="col-md-6 col-lg-4"><div class="service-card-modern h-100"><div class="d-flex align-items-center mb-4"><div class="rounded-circle bg-light p-3 d-flex align-items-center justify-content-center me-3" style="width: 60px; height: 60px;"><i class="bi bi-building text-brand-blue fs-3"></i></div><div><h5 class="fw-bold text-dark mb-0">Assisted Living Transitions</h5></div></div><p class="text-muted mb-0">Best when a facility has move-in policies, time windows, and a smaller room layout that needs more careful pre-planning.</p></div></div>
          <div class="col-md-6 col-lg-4"><div class="service-card-modern h-100"><div class="d-flex align-items-center mb-4"><div class="rounded-circle bg-light p-3 d-flex align-items-center justify-content-center me-3" style="width: 60px; height: 60px;"><i class="bi bi-box2-heart text-brand-blue fs-3"></i></div><div><h5 class="fw-bold text-dark mb-0">Packing, Unpacking, Setup</h5></div></div><p class="text-muted mb-0">Best when the move needs more than lifting, including boxing, labeling, room placement, and getting the new space ready to use.</p></div></div>
        </div>
      </div>
    </section>

    <section class="areas-served-modern">
      <div class="container">
         <div class="row align-items-center">
            <div class="col-lg-5 mb-4 mb-lg-0">
               <span class="badge bg-white text-brand-blue shadow-sm rounded-pill px-3 py-2 mb-3 border">Family Planning</span>
               <h2 class="display-5 fw-bold font-family-sans-serif mb-4">What Families Usually Need Help With</h2>
               <p class="lead text-muted mb-4">Most calls are not just about trucks. They are about how to make the move calmer, shorter, and easier on the person actually transitioning.</p>
               <a href="mailto:comfortmovingchicago@gmail.com?subject=Check%20Availability%20-%20Senior%20Moving" class="btn btn-email-check rounded-pill px-4 py-2 fw-bold"><span class="d-flex align-items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v.217l-8 4.8-8-4.8V4z"/><path d="M0 6.383l7.555 4.528a.5.5 0 0 0 .89 0L16 6.383V12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6.383z"/></svg>Check Availability</span></a>
            </div>
            <div class="col-lg-7">
               <div class="bg-white p-4 rounded-4 shadow-sm border">
                  <div class="mb-4"><h5 class="fw-bold mb-2">Move-day priorities</h5><p class="text-muted mb-0">Bed first, chair first, medications accessible, walker path clear, dresser in place, favorite essentials easy to find.</p></div>
                  <div class="mb-4"><h5 class="fw-bold mb-2">Good companion pages</h5><p class="text-muted mb-0">If the move still involves a full home, start with <a href="/services/residential-moving-chicago.html">residential moving</a>. If the family needs more prep help, add <a href="/services/packing-services-chicago.html">packing services</a>.</p></div>
                  <div><h5 class="fw-bold mb-2">Local context</h5><p class="text-muted mb-0">For house-heavy suburb moves, see <a href="/neighborhoods/oak-park-movers.html">Oak Park movers</a>. For elevator-heavy city buildings, see <a href="/neighborhoods/west-loop-movers.html">West Loop movers</a>.</p></div>
               </div>
            </div>
         </div>
      </div>
    </section>

    <section class="faq-section bg-light py-5">
      <div class="container">
        <div class="text-center mb-5">
           <span class="badge bg-primary-brand rounded-pill px-3 py-2 mb-3">FAQ</span>
           <h2 class="display-5 fw-bold font-family-sans-serif">Senior Moving Questions</h2>
        </div>
        <div class="row justify-content-center">
          <div class="col-lg-8">
            <div class="accordion" id="faqAccordion">
              <div class="accordion-item"><h2 class="accordion-header"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">Can family members stay involved in the plan?</button></h2><div id="faq1" class="accordion-collapse collapse" data-bs-parent="#faqAccordion"><div class="accordion-body">Yes. Senior moves often involve adult children, building staff, or care teams. We can plan around the people helping make decisions.</div></div></div>
              <div class="accordion-item"><h2 class="accordion-header"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">Do you help with downsizing or just the physical move?</button></h2><div id="faq2" class="accordion-collapse collapse" data-bs-parent="#faqAccordion"><div class="accordion-body">We can help with packing priorities, selective loading, and a move plan that matches the new space instead of just taking everything automatically.</div></div></div>
              <div class="accordion-item"><h2 class="accordion-header"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq3">Do you move adjustable beds, walkers, or medical equipment?</button></h2><div id="faq3" class="accordion-collapse collapse" data-bs-parent="#faqAccordion"><div class="accordion-body">Yes. Let us know what mobility or medical items are involved so we can stage them first and make the new room usable quickly.</div></div></div>
              <div class="accordion-item"><h2 class="accordion-header"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq4">Do assisted living buildings have move-in rules?</button></h2><div id="faq4" class="accordion-collapse collapse" data-bs-parent="#faqAccordion"><div class="accordion-body">Often, yes. Many communities have elevator windows, insurance requirements, or approved move hours, so early coordination helps a lot.</div></div></div>
              <div class="accordion-item"><h2 class="accordion-header"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq5">How early should we start planning?</button></h2><div id="faq5" class="accordion-collapse collapse" data-bs-parent="#faqAccordion"><div class="accordion-body">Earlier is better, especially if the family is sorting a long-time home. But if the timeline is shorter, call anyway and we can help prioritize what has to happen first.</div></div></div>
            </div>
          </div>
        </div>
      </div>
    </section>
`;

replaceBlock(
  'services/office-moving-chicago.html',
  /[\s\S]*?<!-- Final CTA -->/m,
  (match) => match.replace(/<!-- About Section Modern -->[\s\S]*?<!-- Final CTA -->/m, `${officeReplacement}\n\n    <!-- Final CTA -->`)
);

replaceBlock(
  'services/same-day-movers-chicago.html',
  /<!-- Common Reasons Section -->[\s\S]*?<!-- Final CTA -->/m,
  `${sameDayReplacement}\n\n    <!-- FAQ Section -->${read('services/same-day-movers-chicago.html').match(/<!-- FAQ Section -->[\s\S]*?<!-- Final CTA -->/m)[0].replace('<!-- FAQ Section -->', '')}`
);

replaceBlock(
  'services/senior-moving-chicago.html',
  /<!-- Our Senior Moving Solutions -->[\s\S]*?<!-- Final CTA -->/m,
  `${seniorReplacement}\n\n    <!-- Final CTA -->`
);

const residential = read('services/residential-moving-chicago.html');
const residentialInsert = `

    <section class="py-5">
      <div class="container">
        <div class="row g-4 align-items-start">
          <div class="col-lg-7">
            <span class="badge bg-brand-blue rounded-pill px-3 py-2 mb-3 text-white">Common Mistakes</span>
            <h2 class="display-5 fw-bold font-family-sans-serif mb-4">Why This Residential Page Exists Separately</h2>
            <div class="bg-white p-4 rounded-4 shadow-sm border h-100">
              <div class="mb-4"><h3 class="h5 fw-bold">Do not confuse urgency with residential intent</h3><p class="text-muted mb-0">If timing is the main issue, use <a href="/services/same-day-movers-chicago.html">same-day movers</a>. This page is for broader planning around homes, apartments, condos, and access-heavy local moves.</p></div>
              <div class="mb-4"><h3 class="h5 fw-bold">Do not confuse budget shopping with service fit</h3><p class="text-muted mb-0">If the move is small and price-first, compare <a href="/services/affordable-chicago-movers.html">affordable movers</a>. This page is built for customers who need the right crew and plan, not just the lowest number.</p></div>
              <div><h3 class="h5 fw-bold">Do not ignore location-specific logistics</h3><p class="text-muted mb-0">If your building or neighborhood adds complexity, keep reading into <a href="/neighborhoods/wicker-park-movers.html">Wicker Park</a>, <a href="/neighborhoods/oak-park-movers.html">Oak Park</a>, and <a href="/neighborhoods/west-loop-movers.html">West Loop</a>.</p></div>
            </div>
          </div>
          <div class="col-lg-5">
            <div class="bg-light p-4 rounded-4 border h-100">
              <h3 class="h5 fw-bold mb-3">Best match for this page</h3>
              <p class="text-muted">House moves, condo moves, walk-ups, two-flats, townhomes, and apartments where access, building rules, packing help, and careful handling all matter.</p>
              <h3 class="h5 fw-bold mb-3 mt-4">Useful next step</h3>
              <p class="text-muted mb-0">If you need more prep help before move day, combine this service with <a href="/services/packing-services-chicago.html">packing services</a> so the quote reflects the real amount of work.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
`;

write(
  'services/residential-moving-chicago.html',
  residential.replace(/\s*<!-- Final CTA -->/, `${residentialInsert}\n\n    <!-- Final CTA -->`)
);

console.log('Overhauled office, same-day, senior, and residential pages.');
