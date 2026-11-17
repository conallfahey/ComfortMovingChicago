(() => {
  const toggle = document.querySelector(".cmc-menu-toggle");
  const nav = document.getElementById("cmc-navigation");
  const services = nav?.querySelector(".cmc-services-menu");
  if (!toggle || !nav) return;

  const quickActions = document.querySelector(".cmc-home .mobile-cta-bar");
  const quote = document.querySelector(".cmc-home #quoteForm");
  if (quickActions && quote && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(([entry]) => {
      quickActions.hidden = entry.isIntersecting;
    });
    observer.observe(quote);
  }

  toggle.closest(".cmc-header").classList.add("cmc-menu-ready");
  const setMenu = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("cmc-nav-open", open);
    if (!open) services?.removeAttribute("open");
  };
  toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenu(false);
  });
  document.addEventListener("pointerdown", (event) => {
    if (!event.target.closest(".cmc-header")) setMenu(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (services?.open) {
      services.open = false;
      services.querySelector("summary").focus();
    } else if (toggle.getAttribute("aria-expanded") === "true") {
      setMenu(false);
      toggle.focus();
    }
  });
})();
