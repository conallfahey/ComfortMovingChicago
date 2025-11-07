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

      // Wait a tick for DOM to reflect replacement
      setTimeout(setActive, 0);
    })
    .catch(err => {
      console.error('Navbar include failed:', err);
    });
});