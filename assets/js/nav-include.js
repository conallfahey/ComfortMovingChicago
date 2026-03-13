// Inject shared navbar across pages and set active state
document.addEventListener('DOMContentLoaded', () => {
  // Inject Google Fonts for Oswald if not already present
  if (!document.querySelector('link[href*="fonts.googleapis.com/css2?family=Oswald"]')) {
    // Add Google Fonts (Oswald and Roboto)
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Oswald:wght@400;500;700&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);
  }

  // Fetch partial via absolute path with fallback to relative, improving robustness across serving contexts
  const fetchNavbar = async () => {
    try {
      const abs = await fetch('/partials/navbar.html', { cache: 'no-cache' });
      if (abs.ok) return abs.text();
      // Fallback to relative if absolute fails
      const rel = await fetch('partials/navbar.html', { cache: 'no-cache' });
      return rel.text();
    } catch (e) {
      // Final fallback to relative
      return fetch('partials/navbar.html', { cache: 'no-cache' }).then(r => r.text());
    }
  };

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

    const footerBoundary = document.getElementById('shared-footer') || document.querySelector('footer');

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

  fetchNavbar()
    .then(html => {
      replaceNavbar(html);
      ensureSkipLink();
      ensureMainLandmark();
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
