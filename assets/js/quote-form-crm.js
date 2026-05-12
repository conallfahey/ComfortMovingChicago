(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var forms = document.querySelectorAll('[data-crm-quote-form]');
    if (!forms.length) return;

    var clean = function (value) {
      var text = String(value || '').trim();
      return text ? text : undefined;
    };

    var valueById = function (id) {
      var el = document.getElementById(id);
      return clean(el && el.value);
    };

    var serviceTypeFromValue = function (raw) {
      var value = String(raw || '').toLowerCase();
      if (value.indexOf('labor') !== -1) return 'labor_only';
      if (value.indexOf('pack') !== -1) return 'packing_only';
      return 'moving_with_truck';
    };

    var ensureStatusEl = function (form) {
      var id = form.getAttribute('data-status-id') || 'service-quote-status';
      var el = document.getElementById(id);
      if (el) return el;
      el = document.createElement('div');
      el.id = id;
      el.className = 'alert d-none mb-3';
      el.setAttribute('role', 'status');
      form.prepend(el);
      return el;
    };

    var setStatus = function (form, kind, text) {
      var el = ensureStatusEl(form);
      el.classList.remove('d-none', 'alert-danger', 'alert-success', 'alert-warning', 'alert-info');
      el.classList.add(kind === 'success' ? 'alert-success' : kind === 'info' ? 'alert-info' : 'alert-danger');
      el.textContent = text;
    };

    var setSubmitting = function (form, isSubmitting) {
      var btn = form.querySelector('button[type="submit"]');
      if (!btn) return;
      var textEl = btn.querySelector('.quote-submit-text');
      var defaultText = btn.getAttribute('data-default-text') || btn.textContent.trim() || 'Get Your Free Quote';
      var loadingText = btn.getAttribute('data-loading-text') || 'Sending Quote Request...';
      btn.disabled = Boolean(isSubmitting);
      btn.classList.toggle('is-loading', Boolean(isSubmitting));
      btn.setAttribute('aria-busy', isSubmitting ? 'true' : 'false');
      if (textEl) {
        textEl.textContent = isSubmitting ? loadingText : defaultText;
      } else {
        btn.textContent = isSubmitting ? loadingText : defaultText;
      }
    };

    var submitLead = async function (serviceType, payload) {
      var url = 'https://us-central1-comfort-moving-crm.cloudfunctions.net/inboundLead_submit?serviceType=' + encodeURIComponent(serviceType);
      var res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      var json = await res.json().catch(function () { return {}; });
      if (!res.ok || !json.ok) throw new Error(json.error || 'Lead submit failed');
      return json;
    };

    Array.prototype.forEach.call(forms, function (form) {
      form.addEventListener('submit', async function (event) {
        event.preventDefault();

        if (clean(form.querySelector('[name="_honey"]') && form.querySelector('[name="_honey"]').value)) return;

        var selectedService = valueById('hero-services');
        var originAddress = valueById('hero-moveFrom') || valueById('hero-address');
        var destinationAddress = valueById('hero-moveTo');
        var serviceType = clean(new URLSearchParams(location.search).get('serviceType')) || serviceTypeFromValue(selectedService);
        var messageParts = [];
        var details = valueById('hero-details');

        if (selectedService) messageParts.push('Selected service: ' + selectedService);
        if (details) messageParts.push(details);

        var payload = {
          name: valueById('hero-name'),
          email: valueById('hero-email'),
          phone: valueById('hero-phone'),
          moveDate: valueById('hero-moveDate'),
          originAddress: originAddress,
          destinationAddress: destinationAddress,
          moveSize: valueById('hero-moveSize'),
          referralSource: valueById('hero-referralSource'),
          message: clean(messageParts.join('\n\n'))
        };

        Object.keys(payload).forEach(function (key) {
          if (payload[key] === undefined) delete payload[key];
        });

        if (!payload.name) {
          setStatus(form, 'error', 'Please enter your name.');
          return;
        }

        if (!payload.email && !payload.phone) {
          setStatus(form, 'error', 'Please enter either an email or a phone number so we can contact you.');
          return;
        }

        if (!payload.referralSource) {
          setStatus(form, 'error', 'Please choose how you heard about us.');
          return;
        }

        var isRedirecting = false;
        setSubmitting(form, true);
        setStatus(form, 'info', 'Sending your request now...');

        try {
          await submitLead(serviceType, payload);
          setStatus(form, 'success', "Thanks! We got your request and we'll reach out shortly.");
          isRedirecting = true;
          window.location.assign('/thank-you.html');
        } catch (error) {
          console.error(error instanceof Error ? error.message : error);
          setStatus(form, 'error', "Sorry - something went wrong submitting the form. Please call (773) 236-1724 and we'll take care of you.");
        } finally {
          if (!isRedirecting) setSubmitting(form, false);
        }
      });
    });
  });
})();
