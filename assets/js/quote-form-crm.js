(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var forms = document.querySelectorAll('[data-crm-quote-form]');
    if (!forms.length) return;

    var endpoint = 'https://us-central1-comfort-moving-crm.cloudfunctions.net/inboundLead_submit';
    var internalFields = new Set(['access_key', '_subject', '_captcha', '_next', '_honey']);
    var draftKey = 'cmcPendingQuote';
    var newSubmissionId = function () {
      if (window.crypto && window.crypto.getRandomValues) {
        var bytes = new Uint8Array(16);
        window.crypto.getRandomValues(bytes);
        return Array.from(bytes, function (byte) { return byte.toString(16).padStart(2, '0'); }).join('');
      }
      return String(Date.now()) + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
    };
    var readDraft = function () {
      try {
        var draft = JSON.parse(localStorage.getItem(draftKey) || 'null');
        if (draft && Date.now() - draft.savedAt < 7 * 24 * 60 * 60 * 1000) return draft;
        localStorage.removeItem(draftKey);
      } catch (error) { /* Storage may be unavailable in an in-app browser. */ }
      return null;
    };
    var saveDraft = function (payload) {
      try { localStorage.setItem(draftKey, JSON.stringify({ path: location.pathname, savedAt: Date.now(), payload: payload })); }
      catch (error) { /* The visible form remains available for retry. */ }
    };
    var clearDraft = function () {
      try { localStorage.removeItem(draftKey); } catch (error) { /* Ignore storage restrictions. */ }
    };
    var submitAsBrowserForm = function (payload) {
      var fallback = document.createElement('form');
      fallback.method = 'POST';
      fallback.action = endpoint + '?transport=form&serviceType=' + encodeURIComponent(payload.serviceType);
      fallback.style.display = 'none';
      Object.keys(payload).forEach(function (key) {
        var input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = key === 'websiteFormFields' ? JSON.stringify(payload[key]) : String(payload[key]);
        fallback.appendChild(input);
      });
      document.body.appendChild(fallback);
      fallback.submit();
    };

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

    var autogrowTextarea = function (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
      textarea.style.overflowY = textarea.scrollHeight > textarea.clientHeight ? 'auto' : 'hidden';
    };

    var addPrivacyNotice = function (form) {
      if (form.querySelector('[data-privacy-notice]')) return;
      var submitButton = form.querySelector('button[type="submit"]');
      if (!submitButton) return;

      var notice = document.createElement('p');
      notice.className = 'small text-muted text-center mt-3 mb-0';
      notice.setAttribute('data-privacy-notice', '');
      var isEmploymentApplication = form.getAttribute('data-service-type') === 'employment';
      notice.append(isEmploymentApplication
        ? 'We use your information to review your application and communicate with you about it. '
        : 'We use your information to respond to your request and provide our services. ');
      var link = document.createElement('a');
      link.href = '/privacy-policy.html';
      link.textContent = 'Privacy Policy';
      notice.appendChild(link);

      var submitContainer = submitButton.closest('.col-12') || submitButton.parentElement;
      submitContainer.insertAdjacentElement('afterend', notice);
    };

    var addSmsConsent = function (form) {
      if (form.getAttribute('data-service-type') === 'employment' || form.querySelector('[data-sms-consent]')) return;
      var submitButton = form.querySelector('button[type="submit"]');
      if (!submitButton) return;

      var consent = document.createElement('div');
      consent.className = 'small text-muted mt-3 mb-0';
      consent.setAttribute('data-sms-consent', '');
      var input = document.createElement('input');
      input.type = 'checkbox';
      input.name = 'smsConsent';
      input.value = 'yes';
      input.id = 'sms-consent';
      input.className = 'form-check-input me-2';
      var label = document.createElement('label');
      label.htmlFor = input.id;
      label.append('I agree to receive service-related SMS messages from Comfort Moving Chicago. Consent is not required to request or purchase services. Msg & data rates may apply. Reply STOP to opt out. ');
      var termsLink = document.createElement('a');
      termsLink.href = '/terms-conditions.html';
      termsLink.textContent = 'Terms & Conditions';
      label.appendChild(termsLink);
      label.append(' and ');
      var privacyLink = document.createElement('a');
      privacyLink.href = '/privacy-policy.html';
      privacyLink.textContent = 'Privacy Policy';
      label.appendChild(privacyLink);
      consent.append(input, label);

      var submitContainer = submitButton.closest('.col-12') || submitButton.parentElement;
      submitContainer.insertAdjacentElement('afterend', consent);
    };

    var submitLead = async function (payload) {
      var url = endpoint + '?serviceType=' + encodeURIComponent(payload.serviceType);
      var res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
        body: JSON.stringify(payload)
      });
      var json = await res.json().catch(function () { return {}; });
      if (!res.ok || !json.ok || !json.id) {
        var error = new Error(json.error || 'Lead submit failed');
        error.status = res.status;
        error.referenceId = json.referenceId;
        throw error;
      }
      return json;
    };

    Array.prototype.forEach.call(forms, function (form) {
      addPrivacyNotice(form);
      addSmsConsent(form);
      var saved = readDraft();
      if (saved && saved.path === location.pathname && saved.payload && saved.payload.websiteFormFields) {
        Object.keys(saved.payload.websiteFormFields).forEach(function (name) {
          var field = form.elements.namedItem(name);
          if (!field || !('value' in field)) return;
          if (field.type === 'checkbox') field.checked = saved.payload.websiteFormFields[name] === field.value;
          else field.value = saved.payload.websiteFormFields[name];
        });
        setStatus(form, 'error', 'A previous request was not confirmed. Please review it and submit again, or call (773) 236-1724.');
      }
      var textareas = form.querySelectorAll('textarea');
      Array.prototype.forEach.call(textareas, function (textarea) {
        autogrowTextarea(textarea);
        textarea.addEventListener('input', function () {
          autogrowTextarea(textarea);
        });
      });

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

        var previous = readDraft();
        var sameRequest = previous && previous.path === location.pathname && previous.payload &&
          previous.payload.name === payload.name && previous.payload.email === payload.email &&
          previous.payload.phone === payload.phone && previous.payload.serviceType === payload.serviceType &&
          JSON.stringify(previous.payload.websiteFormFields) === JSON.stringify(payload.websiteFormFields);
        payload.submissionId = sameRequest ? previous.payload.submissionId : newSubmissionId();
        saveDraft(payload);

        var isRedirecting = false;
        setSubmitting(form, true);
        setStatus(form, 'info', 'Sending your request now...');
        try {
          await submitLead(payload);
          clearDraft();
          setStatus(form, 'success', "Thanks! We got your request and we'll reach out shortly.");
          isRedirecting = true;
          window.location.assign(form.getAttribute('data-success-url') || '/thank-you.html');
        } catch (error) {
          if (!error || !error.status || error.status >= 500) {
            setStatus(form, 'info', 'Trying another way to send your request...');
            try {
              isRedirecting = true;
              submitAsBrowserForm(payload);
              setTimeout(function () {
                if (document.visibilityState === 'visible') {
                  isRedirecting = false;
                  setSubmitting(form, false);
                  setStatus(form, 'error', 'Your request is not confirmed. Please retry or call (773) 236-1724. Your entries are saved in this browser.');
                }
              }, 12000);
              return;
            } catch (fallbackError) {
              isRedirecting = false;
            }
          }
          console.error('Quote form submission failed', {
            status: error && error.status,
            message: error instanceof Error ? error.message : String(error)
          });
          var reference = error && error.referenceId ? ' (reference ' + error.referenceId + ')' :
            error && error.status ? ' (error ' + error.status + ')' : ' (connection error)';
          setStatus(form, 'error', 'Your request is not confirmed' + reference + '. Please call (773) 236-1724 so we can help you. Your entries are saved in this browser.');
        } finally {
          if (!isRedirecting) setSubmitting(form, false);
        }
      });
    });
  });
})();
