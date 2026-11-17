(() => {
  for (const form of document.querySelectorAll("[data-quote-planner]")) {
    const panels = Array.from(form.querySelectorAll("[data-quote-panel]"));
    const progress = form.querySelector("[data-quote-progress]");
    const bar = form.querySelector("[data-quote-bar]");
    const label = form.querySelector("[data-quote-step-label]");
    const phone = form.elements.namedItem("phone");
    const email = form.elements.namedItem("email");
    const contact = panels.find((panel) => panel.dataset.quotePanel === "contact");
    const submit = form.querySelector('button[type="submit"]');
    const name = form.elements.namedItem("name") || form.elements.namedItem("fullName");
    let current = 0;

    form.noValidate = true;
    progress.hidden = false;
    submit.hidden = false;
    form.querySelectorAll("[data-quote-navigation], [data-quote-back]").forEach((control) => {
      control.hidden = false;
    });

    function showStep(index, focusHeading = true) {
      current = index;
      panels.forEach((panel, step) => { panel.hidden = step !== index; });
      bar.value = index + 1;
      label.textContent = `Step ${index + 1} of ${panels.length}`;
      if (focusHeading) {
        const heading = panels[index].querySelector("h3");
        heading.focus({ preventScroll: true });
        const bounds = heading.getBoundingClientRect();
        if (bounds.top < 110 || bounds.bottom > window.innerHeight) {
          heading.scrollIntoView({ block: "center" });
        }
      }
    }

    function firstInvalid(panel) {
      if (panel === contact) {
        if (phone && email) phone.setCustomValidity(phone.value.trim() || email.value.trim()
          ? ""
          : "Enter a phone number or an email address.");
        if (name) name.setCustomValidity(name.value.trim() ? "" : "Enter your name.");
      }
      return Array.from(panel.querySelectorAll("input, select, textarea"))
        .find((control) => control.willValidate && !control.checkValidity());
    }

    function advance() {
      const invalid = firstInvalid(panels[current]);
      if (invalid) {
        invalid.reportValidity();
        return;
      }
      showStep(current + 1);
    }

    form.addEventListener("input", (event) => {
      if (event.target === phone || event.target === email) phone?.setCustomValidity("");
      if (event.target === name) name.setCustomValidity("");
    });
    form.addEventListener("click", (event) => {
      if (submit.disabled) return;
      if (event.target.closest("[data-quote-next]")) advance();
      if (event.target.closest("[data-quote-back]")) showStep(current - 1);
    });
    // The page's existing form handler gets only the final, validated submission.
    form.addEventListener("submit", (event) => {
      if (current === panels.length - 1 && !submit.disabled) {
        for (const [index, panel] of panels.entries()) {
          const invalid = firstInvalid(panel);
          if (!invalid) continue;
          event.preventDefault();
          event.stopImmediatePropagation();
          showStep(index);
          invalid.reportValidity();
          return;
        }
        return;
      }
      event.preventDefault();
      event.stopImmediatePropagation();
      if (!submit.disabled) advance();
    }, true);

    showStep(0, false);
  }
})();
