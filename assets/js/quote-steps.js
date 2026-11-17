document.addEventListener("DOMContentLoaded", () => {
  for (const form of document.querySelectorAll("[data-quote-planner]")) {
    const panels = Array.from(form.querySelectorAll("[data-quote-panel]"));
    const progress = form.querySelector("[data-quote-progress]");
    const bar = form.querySelector("[data-quote-bar]");
    const label = form.querySelector("[data-quote-step-label]");
    const submit = form.querySelector('button[type="submit"]');
    let current = 0;

    form.noValidate = true;
    form.dataset.quoteReady = "";
    progress.hidden = false;
    submit.hidden = false;
    form.querySelectorAll("[data-quote-navigation], [data-quote-back]").forEach((control) => {
      control.hidden = false;
    });

    function showStep(index, focusHeading = true) {
      current = index;
      panels.forEach((panel, step) => { panel.inert = step !== index; });
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

    function fieldMessage(control) {
      if (!control.willValidate) return "";
      const { name, validity } = control;
      const value = control.value.trim();
      if (name === "name" || name === "fullName") return value ? "" : "Enter your name.";
      if (name === "phone") {
        if (!value) return "Enter your phone number.";
        const digits = value.replace(/\D/g, "").length;
        return /^\+?[\d().\s-]+$/.test(value) && digits >= 7 && digits <= 15
          ? ""
          : "Enter a valid phone number.";
      }
      if (name === "email" && validity.valueMissing) return "Enter your email address.";
      if (name === "email" && validity.typeMismatch) return "Enter a valid email address.";
      if (name === "referralSource" && validity.valueMissing) return "Choose how you heard about us.";
      return validity.valid ? "" : control.validationMessage;
    }

    function validateField(control) {
      const message = fieldMessage(control);
      const error = control.closest(".cmc-quote-field")?.querySelector("[data-quote-error]");
      if (error) {
        error.textContent = message;
        error.hidden = !message;
        if (message) control.setAttribute("aria-invalid", "true");
        else control.removeAttribute("aria-invalid");
      }
      return message;
    }

    function firstInvalid(panel) {
      let first;
      for (const control of panel.querySelectorAll("input, select, textarea")) {
        if (validateField(control) && !first) first = control;
      }
      return first;
    }

    function focusInvalid(control) {
      if (control.hasAttribute("aria-invalid")) control.focus();
      else control.reportValidity();
    }

    function advance() {
      const invalid = firstInvalid(panels[current]);
      if (invalid) {
        focusInvalid(invalid);
        return;
      }
      showStep(current + 1);
    }

    form.addEventListener("input", (event) => {
      if (event.target.hasAttribute("aria-invalid")) validateField(event.target);
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
          focusInvalid(invalid);
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
