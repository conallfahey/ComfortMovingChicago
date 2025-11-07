// Inject shared navbar across pages and set active state
document.addEventListener('DOMContentLoaded', () => {
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
    const isBlog = path.endsWith('/blog.html');
    const isServices = path.endsWith('/services.html');

    const markActive = (href) => {
      const link = Array.from(links).find(a => a.getAttribute('href') === href);
      if (link) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    };

    if (isHome) markActive('index.html');
    else if (isFAQ) markActive('faq.html');
    else if (isBlog) markActive('blog.html');
    else if (isServices) {
      // Services page: highlight dropdown toggle
      const toggle = document.getElementById('navbarDropdown');
      if (toggle) toggle.classList.add('active');
    }
  };

  fetchNavbar()
    .then(html => {
      replaceNavbar(html);
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