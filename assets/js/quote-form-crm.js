(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var forms = document.querySelectorAll('[data-crm-quote-form]');
    if (!forms.length) return;

    var endpoint = 'https://us-central1-comfort-moving-crm.cloudfunctions.net/inboundLead_submit';
    var internalFields = new Set(['access_key', '_subject', '_captcha', '_next', '_honey']);

    var clean = function (value) {
      var text = String(value == null ? '' : value).trim();
      return text ? text : undefined;
    };

    var getFieldValue = function (form, names) {
      for (var i = 0; i < names.length; i += 1) {
        var field = form.elements.namedItem(names[i]);
        if (!field) continue;
        var value = clean(field.value);
        if (value) return value;
      }
      return undefined;
    };

    var collectFormFields = function (form) {
      var fields = {};
      new FormData(form).forEach(function (rawValue, name) {
        if (internalFields.has(name) || rawValue instanceof File) return;
        var value = clean(rawValue);
        if (!value) return;
        fields[name] = fields[name] ? fields[name] + ', ' + value : value;
      });
      return fields;
    };

    var serviceTypeFromValue = function (raw) {
      var value = String(raw || '').toLowerCase();
      if (value.indexOf('labor') !== -1 || value.indexOf('assembly') !== -1 || value.indexOf('hoist') !== -1) return 'labor_only';
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

    var setStatus = function (form, kind, message) {
      var el = ensureStatusEl(form);
      el.classList.remove('d-none', 'alert-danger', 'alert-success', 'alert-warning', 'alert-info');
      el.classList.add(kind === 'success' ? 'alert-success' : kind === 'info' ? 'alert-info' : 'alert-danger');
      el.textContent = message;
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
      if (textEl) textEl.textContent = isSubmitting ? loadingText : defaultText;
      else btn.textContent = isSubmitting ? loadingText : defaultText;
    };

    var submitLead = async function (payload) {
      var res = await fetch(endpoint, {
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
        if (clean(getFieldValue(form, ['_honey']))) return;

        var formFields = collectFormFields(form);
        var selectedService = getFieldValue(form, ['services', 'serviceNeeded']);
        var serviceType = clean(new URLSearchParams(location.search).get('serviceType')) ||
          clean(form.getAttribute('data-service-type')) || serviceTypeFromValue(selectedService);
        var payload = {
          name: getFieldValue(form, ['name', 'fullName']),
          email: getFieldValue(form, ['email']),
          phone: getFieldValue(form, ['phone']),
          moveDate: getFieldValue(form, ['moveDate', 'targetDate']),
          originAddress: getFieldValue(form, ['moveFrom', 'address', 'projectAddress']),
          destinationAddress: getFieldValue(form, ['moveTo']),
          moveSize: getFieldValue(form, ['moveSize']),
          serviceType: serviceType,
          referralSource: getFieldValue(form, ['referralSource']),
          message: getFieldValue(form, ['details']),
          websiteFormName: clean(form.getAttribute('data-form-name')) || clean(form.id) || location.pathname,
          websiteFormUrl: location.href,
          websiteFormFields: formFields
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
          await submitLead(payload);
          setStatus(form, 'success', "Thanks! We got your request and we'll reach out shortly.");
          isRedirecting = true;
          window.location.assign(form.getAttribute('data-success-url') || '/thank-you.html');
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
