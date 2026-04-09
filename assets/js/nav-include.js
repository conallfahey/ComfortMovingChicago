// Inject shared navbar across pages and set active state
document.addEventListener('DOMContentLoaded', () => {
  // Normalize site orange across components
  const ensureBrandOrange = () => {
    try {
      if (document.querySelector('style[data-brand-orange="true"]')) return;
      const style = document.createElement('style');
      style.setAttribute('data-brand-orange', 'true');
      style.textContent = `
        :root {
          --site-orange: #fd7e14;
          --bs-warning: #fd7e14;
          --bs-warning-rgb: 253,126,20;
          --bs-warning-text-emphasis: #fd7e14;
          --bs-warning-bg-subtle: rgba(253,126,20,.1);
          --bs-warning-border-subtle: #fd7e14;
        }
        .text-warning { color: #fd7e14 !important; }
        .bg-warning { background-color: #fd7e14 !important; }
        .text-bg-warning { color: #fff !important; background-color: #fd7e14 !important; }
        .border-warning { border-color: #fd7e14 !important; }
        .link-warning { color: #fd7e14 !important; }
        .badge.bg-warning, .badge.text-bg-warning { background-color: #fd7e14 !important; color: #fff !important; }
        .alert-warning { color: #212529 !important; background-color: rgba(253,126,20,.1) !important; border-color: #fd7e14 !important; }
        .btn-warning {
          --bs-btn-color: #fff;
          --bs-btn-bg: #fd7e14;
          --bs-btn-border-color: #fd7e14;
          --bs-btn-hover-color: #fff;
          --bs-btn-hover-bg: #e96f0f;
          --bs-btn-hover-border-color: #e96f0f;
          --bs-btn-focus-shadow-rgb: 253,126,20;
          --bs-btn-active-color: #fff;
          --bs-btn-active-bg: #e96f0f;
          --bs-btn-active-border-color: #e96f0f;
          --bs-btn-disabled-bg: #fd7e14;
          --bs-btn-disabled-border-color: #fd7e14;
        }
        .btn-outline-warning {
          --bs-btn-color: #fd7e14;
          --bs-btn-border-color: #fd7e14;
          --bs-btn-hover-color: #fff;
          --bs-btn-hover-bg: #fd7e14;
          --bs-btn-hover-border-color: #fd7e14;
          --bs-btn-focus-shadow-rgb: 253,126,20;
          --bs-btn-active-color: #fff;
          --bs-btn-active-bg: #fd7e14;
          --bs-btn-active-border-color: #fd7e14;
        }
      `;
      document.head.appendChild(style);
    } catch {}
  };
  const enforceAllOrange = () => {
    try {
      const toHex = (s) => (s || '').trim().toLowerCase();
      const ORANGE = '#fd7e14';
      const tokens = new Set([
        '#ffa500','#ff8c00','#ff7f50','#ff8800','#ff6f00','#f97316','#fd7e14','#e96f0f','orange',
        'rgb(253, 126, 20)','rgba(253, 126, 20, 1)','rgb(255, 165, 0)','rgba(255, 165, 0, 1)'
      ]);
      document.querySelectorAll('[style]').forEach(el => {
        const s = el.style;
        const c = toHex(s.color);
        const bg = toHex(s.backgroundColor);
        const bc = toHex(s.borderColor);
        if (tokens.has(c)) s.color = ORANGE;
        if (tokens.has(bg)) s.backgroundColor = ORANGE;
        if (tokens.has(bc)) s.borderColor = ORANGE;
        ['borderTopColor','borderRightColor','borderBottomColor','borderLeftColor'].forEach(prop => {
          const v = toHex(s[prop]);
          if (tokens.has(v)) s[prop] = ORANGE;
        });
      });
    } catch {}
  };

  // Inject Google Fonts for Oswald if not already present
  if (!document.querySelector('link[href*="fonts.googleapis.com/css2?family=Oswald"]')) {
    // Add Google Fonts (Oswald and Roboto)
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Oswald:wght@400;500;700&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);
  }

  const fetchPartial = async (absPath, relPath) => {
    try {
      const abs = await fetch(absPath, { cache: 'no-cache' });
      if (abs.ok) return abs.text();
      const rel = await fetch(relPath, { cache: 'no-cache' });
      return rel.text();
    } catch (e) {
      return fetch(relPath, { cache: 'no-cache' }).then(r => r.text());
    }
  };

  const fetchNavbar = () => fetchPartial('/partials/navbar.html', 'partials/navbar.html');
  const fetchFooter = () => fetchPartial('/partials/footer.html', 'partials/footer.html');

  const replaceNavbar = (html) => {
    // Prefer element with id="shared-nav" if present; else first nav.navbar
    const target = document.getElementById('shared-nav') || document.querySelector('nav.navbar');
    if (target) {
      target.outerHTML = html;
    } else {
      // If no existing nav, inject at top of body
      const wrapper = document.createElement('div');
      wrapper.innerHTML = html.trim();
      const navEl = wrapper.firstElementChild;
      if (navEl) {
        document.body.insertBefore(navEl, document.body.firstChild);
      }
    }
  };

  const replaceFooter = (html) => {
    const target = document.getElementById('shared-footer') || document.querySelector('footer.footer-section');
    if (target) {
      target.outerHTML = html;
      return;
    }

    const wrapper = document.createElement('div');
    wrapper.innerHTML = html.trim();
    const footerEl = wrapper.firstElementChild;
    if (footerEl) {
      document.body.appendChild(footerEl);
    }
  };

  const setActive = () => {
    const path = (location.pathname || '').toLowerCase();
    const links = document.querySelectorAll('.navbar .nav-link');
    links.forEach(link => {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    });

    const isHome = path.endsWith('/index.html') || path === '/' || /\/$/i.test(path);
    const isFAQ = path.endsWith('/faq.html');
    const isBlog = path.includes('/blog/') || path.endsWith('/blog');
    const isWeLoveChicago = path.includes('/we-love-chicago/') || path.endsWith('/we-love-chicago');
    const isServices = path.endsWith('/services.html');

    const markActive = (href) => {
      const link = Array.from(links).find(a => a.getAttribute('href') === href);
      if (link) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    };

    if (isHome) markActive('/');
    else if (isFAQ) markActive('/faq.html');
    else if (isBlog) markActive('/blog/');
    else if (isWeLoveChicago) markActive('/we-love-chicago/');
    else if (isServices) {
      // Services page: highlight dropdown toggle
      const toggle = document.getElementById('servicesDropdown');
      if (toggle) toggle.classList.add('active');
    }
  };

  const ensureSkipLink = () => {
    const nav = document.getElementById('shared-nav') || document.querySelector('nav.navbar');
    if (!nav) return;

    const existing = nav.querySelector('a.skip-link[href="#main-content"]');
    if (existing) return;

    const a = document.createElement('a');
    a.href = '#main-content';
    a.className = 'skip-link';
    a.textContent = 'Skip to main content';
    nav.insertBefore(a, nav.firstChild);
  };

  const ensureMainLandmark = () => {
    const nav = document.getElementById('shared-nav') || document.querySelector('nav.navbar');
    if (!nav || !nav.parentElement) return;

    let main = document.querySelector('main#main-content');
    if (!main) {
      main = document.createElement('main');
      main.id = 'main-content';
      main.setAttribute('tabindex', '-1');
      nav.insertAdjacentElement('afterend', main);
    } else if (!main.hasAttribute('tabindex')) {
      main.setAttribute('tabindex', '-1');
    }

    const footerBoundary = document.getElementById('shared-footer') || document.querySelector('footer.footer-section');

    const nodesToMove = [];
    let node = main.nextSibling;
    while (node && node !== footerBoundary) {
      const next = node.nextSibling;
      if (node.nodeType === Node.ELEMENT_NODE) {
        const tag = node.tagName;
        if (tag !== 'MAIN' && tag !== 'NAV' && tag !== 'FOOTER' && tag !== 'SCRIPT' && tag !== 'STYLE' && tag !== 'LINK') {
          nodesToMove.push(node);
        }
      }
      node = next;
    }

    nodesToMove.forEach(el => main.appendChild(el));
  };

  const ensureServiceAndNeighborhoodHeroPhotos = () => {
    try {
      const path = (location.pathname || '').toLowerCase();
      const isServiceOrNeighborhood = path.includes('/services/') || path.includes('/neighborhoods/');
      if (!isServiceOrNeighborhood) return;

      const photoByPath = {
        '/services/residential-moving-chicago.html': '/Images/LocalChicagoMovers-mobile.webp',
        '/services/packing-services-chicago.html': '/Images/PackingServicesChicago-mobile.webp',
        '/services/furniture-assembly-chicago.html': '/Images/Chicago-Furniture-Disassembly.webp',
        '/services/local-hoisting-chicago.html': '/Images/Chicago-Moving-Company-TV-Protection.webp',
        '/services/affordable-chicago-movers.html': '/Images/LocalAffordableChicagoMovers-mobile.webp',
        '/services/same-day-movers-chicago.html': '/Images/IMG_0760-mobile.webp',
        '/services/emergency-movers-chicago.html': '/Images/IMG_0760-mobile.webp',
        '/services/office-moving-chicago.html': '/Images/Chicago-Moving-Company-Elevator-Dolly.webp',
        '/services/piano-movers-chicago.html': '/Images/IMG_0760-mobile.webp',
        '/services/senior-moving-chicago.html': '/Images/Comfort-Moving-Client.webp',
        '/neighborhoods/logan-square-movers.html': '/Images/IMG_0760-mobile.webp',
        '/neighborhoods/wicker-park-movers.html': '/Images/LocalAffordableChicagoMovers-mobile.webp',
        '/neighborhoods/west-loop-movers.html': '/Images/Chicago-Moving-Company-Apartment-West-Loop.webp',
        '/neighborhoods/the-loop-movers.html': '/Images/Chicago-Movers-Loop.webp',
        '/neighborhoods/rogers-park-movers.html': '/Images/Chicago-Movers-Storage-Unit.webp',
        '/neighborhoods/oak-park-movers.html': '/Images/LocalAffordableChicagoMovers-mobile.webp',
        '/neighborhoods/lincoln-park-movers.html': '/Images/Comfort-Moving-Client.webp',
        '/neighborhoods/lakeview-movers.html': '/Images/Chicago-Moving-Company-Wrapping-Protection.webp',
        '/neighborhoods/evanston-movers.html': '/Images/LocalChicagoMovers-mobile.webp'
      };

      const exact = photoByPath[path];
      const matchedKey = exact ? null : Object.keys(photoByPath).find(k => path.endsWith(k));
      const desired = exact || (matchedKey ? photoByPath[matchedKey] : null);
      const fallback = '/Images/LocalChicagoMovers.webp';

      document.querySelectorAll('img.hero-avatar').forEach((img) => {
        if (desired) img.setAttribute('src', desired);
        img.onerror = () => {
          img.onerror = null;
          img.setAttribute('src', fallback);
        };
      });
    } catch {}
  };

  const ensureAboutSectionPhoto = () => {
    try {
      const path = (location.pathname || '').toLowerCase();
      const isServiceOrNeighborhood = path.includes('/services/') || path.includes('/neighborhoods/');
      if (!isServiceOrNeighborhood) return;

      const section = document.querySelector('section.about-section-modern');
      if (!section) return;

      const frame = section.querySelector('.rounded-5.overflow-hidden.shadow-lg');
      if (!frame) return;
      if (frame.querySelector('img, picture')) return;

      const photoByPath = {
        '/services/residential-moving-chicago.html': '/Images/LocalChicagoMovers.webp',
        '/services/packing-services-chicago.html': '/Images/PackingServicesChicago.webp',
        '/services/furniture-assembly-chicago.html': '/Images/Chicago-Furniture-Disassembly.webp',
        '/services/local-hoisting-chicago.html': '/Images/Chicago-Moving-Company-TV-Protection.webp',
        '/services/affordable-chicago-movers.html': '/Images/LocalAffordableChicagoMovers.webp',
        '/services/same-day-movers-chicago.html': '/Images/IMG_0760.webp',
        '/services/emergency-movers-chicago.html': '/Images/IMG_0760.webp',
        '/services/office-moving-chicago.html': '/Images/Chicago-Moving-Company-Elevator-Dolly.webp',
        '/services/piano-movers-chicago.html': '/Images/IMG_0760.webp',
        '/services/senior-moving-chicago.html': '/Images/Comfort-Moving-Client.webp',
        '/neighborhoods/logan-square-movers.html': '/Images/IMG_0760.webp',
        '/neighborhoods/wicker-park-movers.html': '/Images/LocalAffordableChicagoMovers.webp',
        '/neighborhoods/west-loop-movers.html': '/Images/Chicago-Moving-Company-Apartment-West-Loop.webp',
        '/neighborhoods/the-loop-movers.html': '/Images/Chicago-Movers-Loop.webp',
        '/neighborhoods/rogers-park-movers.html': '/Images/Chicago-Movers-Storage-Unit.webp',
        '/neighborhoods/oak-park-movers.html': '/Images/LocalAffordableChicagoMovers.webp',
        '/neighborhoods/lincoln-park-movers.html': '/Images/Comfort-Moving-Client.webp',
        '/neighborhoods/lakeview-movers.html': '/Images/Chicago-Moving-Company-Wrapping-Protection.webp',
        '/neighborhoods/evanston-movers.html': '/Images/LocalChicagoMovers.webp'
      };

      const exact = photoByPath[path];
      const matchedKey = exact ? null : Object.keys(photoByPath).find(k => path.endsWith(k));
      const src = exact || (matchedKey ? photoByPath[matchedKey] : null) || '/Images/LocalChicagoMovers.webp';

      const heading = section.querySelector('h2')?.textContent?.replace(/\s+/g, ' ')?.trim();
      const alt = heading ? `${heading} - Comfort Moving Chicago` : 'Comfort Moving Chicago crew';

      const img = document.createElement('img');
      img.src = src;
      img.alt = alt;
      img.className = 'img-fluid w-100';
      img.loading = 'lazy';
      img.decoding = 'async';
      img.style.objectFit = 'cover';
      img.style.height = '520px';
      img.style.backgroundColor = '#e9ecef';
      img.onerror = () => {
        img.onerror = null;
        img.src = '/Images/LocalChicagoMovers.webp';
      };

      frame.appendChild(img);
    } catch {}
  };

  const injectInternalLinks = () => {
    try {
      if (document.getElementById('internal-links-block')) return;

      const path = (location.pathname || '').toLowerCase();
      const footer = document.getElementById('shared-footer') || document.querySelector('footer.footer-section');
      if (!footer) return;

      const services = [
        { href: '/services/residential-moving-chicago.html', label: 'Residential Moving' },
        { href: '/services/packing-services-chicago.html', label: 'Packing Services' },
        { href: '/services/furniture-assembly-chicago.html', label: 'Furniture Assembly' },
        { href: '/services/local-hoisting-chicago.html', label: 'Hoisting Services' },
        { href: '/services/affordable-chicago-movers.html', label: 'Affordable Movers' },
        { href: '/services/same-day-movers-chicago.html', label: 'Same Day Movers' },
        { href: '/services/emergency-movers-chicago.html', label: 'Emergency Movers' },
        { href: '/services/office-moving-chicago.html', label: 'Office Moving' },
        { href: '/services/piano-movers-chicago.html', label: 'Piano Movers' },
        { href: '/services/senior-moving-chicago.html', label: 'Senior Moving' }
      ];

      const neighborhoods = [
        { href: '/neighborhoods/logan-square-movers.html', label: 'Logan Square Movers' },
        { href: '/neighborhoods/wicker-park-movers.html', label: 'Wicker Park Movers' },
        { href: '/neighborhoods/lakeview-movers.html', label: 'Lakeview Movers' },
        { href: '/neighborhoods/lincoln-park-movers.html', label: 'Lincoln Park Movers' },
        { href: '/neighborhoods/west-loop-movers.html', label: 'West Loop Movers' },
        { href: '/neighborhoods/the-loop-movers.html', label: 'The Loop Movers' },
        { href: '/neighborhoods/rogers-park-movers.html', label: 'Rogers Park Movers' },
        { href: '/neighborhoods/oak-park-movers.html', label: 'Oak Park Movers' },
        { href: '/neighborhoods/evanston-movers.html', label: 'Evanston Movers' }
      ];

      const resources = [
        { href: '/blog/blog-moving-checklist.html', label: 'Moving Checklist' },
        { href: '/blog/blog-understanding-moving-quotes.html', label: 'Understanding Moving Quotes' },
        { href: '/blog/blog-packing-tips.html', label: 'Packing Tips' },
        { href: '/blog/blog-best-time-to-move-chicago.html', label: 'Best Time To Move' },
        { href: '/blog/blog-elevator-loading-zone-permits-chicago.html', label: 'Permits & Loading Zones' },
        { href: '/blog/blog-change-of-address.html', label: 'Change of Address' },
        { href: '/blog/blog-tipping-movers.html', label: 'Tipping Movers' },
        { href: '/blog/blog-chicago-neighborhoods-guide.html', label: 'Chicago Neighborhoods Guide' },
        { href: '/we-love-chicago/', label: 'We Love Chicago' }
      ];

      const isServicesIndex = path.endsWith('/services.html');
      const isServicesPage = path.includes('/services/') && !isServicesIndex;
      const isNeighborhoodPage = path.includes('/neighborhoods/');
      const isBlogIndex = path.endsWith('/blog/') || path.endsWith('/blog/index.html');
      const isBlogPost = path.includes('/blog/') && !isBlogIndex;
      const isWeLoveChicagoIndex = path.endsWith('/we-love-chicago/') || path.endsWith('/we-love-chicago/index.html');
      const isWeLoveChicagoPost = path.includes('/we-love-chicago/') && !isWeLoveChicagoIndex;
      const isFAQ = path.endsWith('/faq.html');
      const isHome = path === '/' || path.endsWith('/index.html');

      const currentPath = path;

      const toList = (items, limit = 6) => {
        const filtered = items.filter(i => (i.href || '').toLowerCase() !== currentPath).slice(0, limit);
        return filtered.map(i => `<li class="mb-2"><a class="text-primary-brand fw-semibold" href="${i.href}">${i.label}</a></li>`).join('');
      };

      let title = '';
      let colA = { heading: '', items: '' };
      let colB = { heading: '', items: '' };
      let colC = { heading: '', items: '' };

      if (isServicesIndex) {
        title = 'Explore Services';
        colA = { heading: 'Popular Services', items: toList(services, 6) };
        colB = { heading: 'Neighborhood Movers', items: toList(neighborhoods, 6) };
        colC = { heading: 'Moving Resources', items: toList(resources, 5) };
      } else if (isServicesPage) {
        title = 'Related Pages';
        colA = { heading: 'Popular Services', items: toList(services, 6) };
        colB = { heading: 'Neighborhood Movers', items: toList(neighborhoods, 6) };
        colC = { heading: 'Moving Resources', items: toList(resources, 5) };
      } else if (isNeighborhoodPage) {
        title = 'Plan Your Move';
        colA = { heading: 'Moving Services', items: toList(services, 6) };
        colB = { heading: 'Nearby Neighborhoods', items: toList(neighborhoods, 6) };
        colC = { heading: 'Moving Resources', items: toList(resources, 5) };
      } else if (isBlogIndex || isWeLoveChicagoIndex) {
        title = 'Browse Popular Pages';
        colA = { heading: 'Moving Services', items: toList(services, 6) };
        colB = { heading: 'Neighborhood Movers', items: toList(neighborhoods, 6) };
        colC = { heading: 'Moving Resources', items: toList(resources, 5) };
      } else if (isBlogPost || isWeLoveChicagoPost) {
        title = 'Next Steps';
        colA = { heading: 'Get Moving Help', items: toList(services, 6) };
        colB = { heading: 'Neighborhood Movers', items: toList(neighborhoods, 6) };
        colC = { heading: 'More Guides', items: toList(resources, 5) };
      } else if (isFAQ || isHome) {
        title = 'Keep Exploring';
        colA = { heading: 'Moving Services', items: toList(services, 6) };
        colB = { heading: 'Neighborhood Movers', items: toList(neighborhoods, 6) };
        colC = { heading: 'Moving Resources', items: toList(resources, 5) };
      } else {
        return;
      }

      const section = document.createElement('section');
      section.id = 'internal-links-block';
      section.className = 'py-5 bg-light-pattern border-top';
      section.innerHTML = `
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-lg-10">
              <div class="bg-white rounded-4 shadow-sm p-4 p-lg-5">
                <h2 class="h3 fw-bold mb-3">${title}</h2>
                <div class="row g-4">
                  <div class="col-md-4">
                    <div class="fw-bold mb-2">${colA.heading}</div>
                    <ul class="list-unstyled text-muted mb-0">${colA.items}</ul>
                  </div>
                  <div class="col-md-4">
                    <div class="fw-bold mb-2">${colB.heading}</div>
                    <ul class="list-unstyled text-muted mb-0">${colB.items}</ul>
                  </div>
                  <div class="col-md-4">
                    <div class="fw-bold mb-2">${colC.heading}</div>
                    <ul class="list-unstyled text-muted mb-0">${colC.items}</ul>
                  </div>
                </div>
                <div class="mt-4 d-flex flex-wrap gap-2">
                  <a href="/#quoteForm" class="btn btn-primary-brand rounded-pill px-4 py-2 fw-bold shadow-sm">Get A Free Quote</a>
                  <a href="/services.html" class="btn btn-secondary-action rounded-pill px-4 py-2 fw-bold shadow-sm">Browse Services</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      `.trim();

      footer.insertAdjacentElement('beforebegin', section);
    } catch {}
  };

  const ensureFormControlLabels = () => {
    const controls = document.querySelectorAll('input, select, textarea');
    let counter = 0;

    const isSkippableInput = (el) => {
      if (!el || el.tagName !== 'INPUT') return false;
      const type = (el.getAttribute('type') || '').toLowerCase();
      return type === 'hidden' || type === 'submit' || type === 'button' || type === 'reset' || type === 'image';
    };

    const ensureId = (el) => {
      if (el.id) return el.id;
      const baseRaw = (el.getAttribute('name') || el.getAttribute('type') || el.tagName || 'field').toLowerCase();
      const base = baseRaw.replace(/[^a-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '') || 'field';
      let id = `field-${base}-${counter++}`;
      while (document.getElementById(id)) id = `field-${base}-${counter++}`;
      el.id = id;
      return id;
    };

    const labelTextFor = (el) => {
      const placeholder = (el.getAttribute('placeholder') || '').trim();
      if (placeholder) return placeholder;
      const name = (el.getAttribute('name') || '').trim();
      if (name) return name.replace(/([A-Z])/g, ' $1').replace(/[-_]+/g, ' ').trim();
      const type = (el.getAttribute('type') || '').trim();
      if (type) return type;
      return 'Field';
    };

    controls.forEach((control) => {
      if (isSkippableInput(control)) return;

      const inlineStyle = (control.getAttribute('style') || '').toLowerCase();
      if (control.hasAttribute('hidden')) return;
      if ((control.getAttribute('aria-hidden') || '').toLowerCase() === 'true') return;
      if (inlineStyle.includes('display:none') || inlineStyle.includes('display: none')) return;

      if (control.closest('label')) return;

      const id = control.id || '';
      if (id && document.querySelector(`label[for="${CSS.escape(id)}"]`)) return;

      const parent = control.parentElement;
      const existingLabel = parent ? parent.querySelector('label') : null;
      if (existingLabel) {
        const controlId = ensureId(control);
        if (!existingLabel.getAttribute('for')) existingLabel.setAttribute('for', controlId);
        return;
      }

      const controlId = ensureId(control);
      const label = document.createElement('label');
      label.className = 'visually-hidden';
      label.setAttribute('for', controlId);
      label.textContent = labelTextFor(control);
      control.insertAdjacentElement('beforebegin', label);
    });
  };

  const ensureIframeTitles = () => {
    const titleForSrc = (src) => {
      const s = (src || '').toLowerCase();
      if (s.includes('instagram.com')) return 'Instagram embed';
      if (s.includes('youtube.com') || s.includes('youtu.be')) return 'YouTube video';
      if (s.includes('google.com/maps') || s.includes('maps.google.com')) return 'Google map';
      return 'Embedded content';
    };

    const ensureTitle = (iframe) => {
      if (!iframe || iframe.tagName !== 'IFRAME') return;
      const current = (iframe.getAttribute('title') || '').trim();
      if (current) return;
      iframe.setAttribute('title', titleForSrc(iframe.getAttribute('src')));
    };

    document.querySelectorAll('iframe').forEach(ensureTitle);

    try {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((m) => {
          m.addedNodes.forEach((node) => {
            if (node.nodeType !== Node.ELEMENT_NODE) return;
            if (node.tagName === 'IFRAME') ensureTitle(node);
            node.querySelectorAll?.('iframe')?.forEach(ensureTitle);
          });
        });
      });
      if (document.body) observer.observe(document.body, { childList: true, subtree: true });
    } catch {}
  };

  Promise.all([fetchNavbar(), fetchFooter()])
    .then(([navHtml, footerHtml]) => {
      replaceNavbar(navHtml);
      replaceFooter(footerHtml);
      ensureBrandOrange();
      enforceAllOrange();
      ensureSkipLink();
      ensureMainLandmark();
      ensureServiceAndNeighborhoodHeroPhotos();
      ensureAboutSectionPhoto();
      injectInternalLinks();
      ensureFormControlLabels();
      ensureIframeTitles();
      // Initialize Bootstrap components after dynamic injection (helps on some mobile contexts)
      try {
        if (window.bootstrap) {
          document.querySelectorAll('[data-bs-toggle="dropdown"]').forEach(el => {
            try { new bootstrap.Dropdown(el); } catch {}
          });
          document.querySelectorAll('[data-bs-toggle="collapse"]').forEach(el => {
            const targetSel = el.getAttribute('data-bs-target');
            const targetEl = targetSel ? document.querySelector(targetSel) : null;
            if (targetEl) { try { new bootstrap.Collapse(targetEl, { toggle: false }); } catch {} }
          });
        }
      } catch {}

      // Robust fallback: only add manual toggler if Bootstrap isn't available
      try {
        const toggler = document.querySelector('.navbar-toggler');
        const targetSel = toggler ? toggler.getAttribute('data-bs-target') : null;
        const targetEl = targetSel ? document.querySelector(targetSel) : null;
        if (toggler && targetEl && !window.bootstrap) {
          toggler.addEventListener('click', (e) => {
            e.preventDefault();
            const isShown = targetEl.classList.contains('show');
            targetEl.classList.toggle('show', !isShown);
            toggler.setAttribute('aria-expanded', String(!isShown));
          }, { once: false });
        }
      } catch {}

      // Dropdown fallback: ensure Services dropdown works even without Bootstrap
      try {
        if (!window.bootstrap) {
          // Toggle dropdown menus manually
          const dropdownToggles = document.querySelectorAll('[data-bs-toggle="dropdown"]');
          dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
              e.preventDefault();
              const parent = toggle.closest('.dropdown');
              const menu = parent ? parent.querySelector('.dropdown-menu') : null;
              if (!menu) return;
              const isShown = menu.classList.contains('show');
              // Close any other open menus first
              document.querySelectorAll('.dropdown-menu.show').forEach(m => m.classList.remove('show'));
              if (!isShown) menu.classList.add('show');
              toggle.setAttribute('aria-expanded', String(!isShown));
            });
          });

          // Close dropdown when clicking outside
          document.addEventListener('click', (e) => {
            const openMenu = document.querySelector('.dropdown-menu.show');
            if (!openMenu) return;
            const clickedInsideDropdown = !!e.target.closest('.dropdown');
            if (!clickedInsideDropdown) {
              document.querySelectorAll('.dropdown-menu.show').forEach(m => m.classList.remove('show'));
              document.querySelectorAll('[data-bs-toggle="dropdown"]').forEach(t => t.setAttribute('aria-expanded', 'false'));
            }
          });

          // Allow ESC to close any open dropdown
          document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
              document.querySelectorAll('.dropdown-menu.show').forEach(m => m.classList.remove('show'));
              document.querySelectorAll('[data-bs-toggle="dropdown"]').forEach(t => t.setAttribute('aria-expanded', 'false'));
            }
          });
        }
      } catch {}

      // Ensure the menu collapses after clicking a nav link (mobile UX)
      try {
        const collapseTarget = document.querySelector('.navbar .navbar-collapse') || document.querySelector('#navbarSupportedContent');
        const toggler = document.querySelector('.navbar-toggler');
        const collapseMenu = () => {
          if (!collapseTarget) return;
          try {
            if (window.bootstrap) {
              const instance = bootstrap.Collapse.getInstance(collapseTarget) || new bootstrap.Collapse(collapseTarget, { toggle: false });
              instance.hide();
            } else {
              collapseTarget.classList.remove('show');
            }
            if (toggler) toggler.setAttribute('aria-expanded', 'false');
          } catch {}
        };

        // Collapse when clicking any real navigation item
        document.querySelectorAll('.navbar .nav-link, .navbar .dropdown-item').forEach(link => {
          const isDropdownToggle = link.matches('[data-bs-toggle="dropdown"]');
          link.addEventListener('click', () => {
            if (!isDropdownToggle) collapseMenu();
          });
        });

        // Removed explicit close button wiring per request
        // Click outside the open menu should close it (mobile UX)
        document.addEventListener('click', (e) => {
          try {
            const isOpen = collapseTarget && collapseTarget.classList.contains('show');
            const clickedInsideMenu = collapseTarget && collapseTarget.contains(e.target);
            const clickedToggler = toggler && toggler.contains(e.target);
            if (isOpen && !clickedInsideMenu && !clickedToggler) {
              collapseMenu();
            }
          } catch {}
        });
        // Allow ESC to close the menu
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') collapseMenu();
        });
      } catch {}

      // Wait a tick for DOM to reflect replacement
      setTimeout(setActive, 0);
    })
    .catch(err => {
      console.error('Navbar include failed:', err);
    });
});
