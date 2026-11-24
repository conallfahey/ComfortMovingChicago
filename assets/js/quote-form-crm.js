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
      fallback.action = endpoint + '?transport=form';
      fallback.style.display = 'none';
      Object.keys(payload).forEach(function (key) {
        var input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = typeof payload[key] === 'object' ? JSON.stringify(payload[key]) : String(payload[key]);
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
        if (!field || field.disabled) continue;
        var value = clean(field.value);
        if (value) return value;
      }
      return undefined;
    };

    var collectFormFields = function (form, contactOnly) {
      var fields = {};
      var contactNames = contactOnly ? new Set(Array.from(
        form.querySelectorAll('[data-quote-panel="contact"] [name]'),
        function (field) { return field.name; }
      )) : null;
      new FormData(form).forEach(function (rawValue, name) {
        if (internalFields.has(name) || rawValue instanceof File) return;
        if (contactNames && !contactNames.has(name)) return;
        var value = clean(rawValue);
        if (!value) return;
        fields[name] = fields[name] ? fields[name] + ', ' + value : value;
      });
      var smsOptOut = form.querySelector('[name="smsOptOut"]');
      if (smsOptOut) fields.smsOptOut = smsOptOut.checked ? 'yes' : 'no';
      return fields;
    };

    var serviceTypeFromValue = function (raw) {
      var value = String(raw || '').toLowerCase();
      if (value.indexOf('labor') !== -1 || value.indexOf('assembly') !== -1 || value.indexOf('hoist') !== -1) return 'labor_only';
      if (value.indexOf('pack') !== -1) return 'packing_only';
      return 'moving_with_truck';
    };

    var ensureStatusEl = function (form) {
      var statusEl = form.querySelector('[data-quote-status]');
      if (statusEl) return statusEl;
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

    var showSubmissionError = function (form, scrollToAlert) {
      setStatus(form, 'error', 'We couldn’t confirm your submission. Please call ');
      var phone = document.createElement('a');
      phone.href = 'tel:+17732361724';
      phone.textContent = '(773) 236-1724';
      var alert = ensureStatusEl(form);
      alert.append(phone, ' so we can help.');
      if (scrollToAlert) alert.scrollIntoView({ block: 'nearest' });
    };

    var setSubmitting = function (form, btn, isSubmitting) {
      form.toggleAttribute('data-quote-submitting', isSubmitting);
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
      var submitButton = form.querySelector('[data-quote-contact-submit], button[type="submit"]');
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

      var submitContainer = submitButton.closest('[data-quote-navigation], .col-12') || submitButton.parentElement;
      submitContainer.insertAdjacentElement('afterend', notice);
    };

    var addSmsConsent = function (form) {
      if (form.getAttribute('data-service-type') === 'employment' || form.querySelector('[data-sms-consent]')) return;
      var submitButton = form.querySelector('[data-quote-contact-submit], button[type="submit"]');
      if (!submitButton) return;

      var consent = document.createElement('div');
      consent.className = 'small text-muted mt-3 mb-0';
      consent.setAttribute('data-sms-consent', '');
      var input = document.createElement('input');
      input.type = 'checkbox';
      input.name = 'smsOptOut';
      input.value = 'yes';
      input.id = (form.id || 'quote-form') + '-sms-opt-out';
      input.className = 'form-check-input me-2';
      var label = document.createElement('label');
      label.htmlFor = input.id;
      label.textContent = 'Opt out of sms updates if you book with us';
      consent.append(input, label);

      var submitContainer = submitButton.closest('[data-quote-navigation], .col-12') || submitButton.parentElement;
      submitContainer.insertAdjacentElement('afterend', consent);
    };

    var submitLead = async function (payload, background) {
      var controller = background ? null : new AbortController();
      var timeout = controller ? setTimeout(function () { controller.abort(); }, 12000) : undefined;
      try {
        var res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
          body: JSON.stringify(payload),
          keepalive: Boolean(background),
          signal: controller ? controller.signal : undefined
        });
        var json = await res.json().catch(function () { return {}; });
        if (!res.ok || !json.ok || !json.id) {
          var error = new Error(json.error || 'Lead submit failed');
          error.status = res.ok ? undefined : res.status;
          error.referenceId = json.referenceId;
          throw error;
        }
      } finally {
        clearTimeout(timeout);
      }
    };

    var canRetry = function (error) {
      return !error || !error.status || error.status >= 500;
    };

    Array.prototype.forEach.call(forms, function (form) {
      addPrivacyNotice(form);
      addSmsConsent(form);
      var isPlanner = form.hasAttribute('data-quote-planner');
      var marketplace = form.hasAttribute('data-quote-marketplace');
      var formName = clean(form.getAttribute('data-form-name')) || clean(form.id) || location.pathname;
      var saved = readDraft();
      var plannerSubmissionId;
      var contactPending = false;
      var contactSaved = false;
      if (saved && saved.path === location.pathname && saved.payload &&
          saved.payload.websiteFormName === formName && saved.payload.websiteFormFields) {
        Object.keys(saved.payload.websiteFormFields).forEach(function (name) {
          var field = form.elements.namedItem(name);
          if (!field || !('value' in field)) return;
          if (field.type === 'checkbox') field.checked = saved.payload.websiteFormFields[name] === field.value;
          else field.value = saved.payload.websiteFormFields[name];
        });
        var url = new URL(location.href);
        var contactRedirect = url.searchParams.get('quoteContact') === 'received';
        if (contactRedirect) {
          url.searchParams.delete('quoteContact');
          history.replaceState(history.state, '', url);
        }
        if (isPlanner && saved.payload.submissionStage) plannerSubmissionId = saved.payload.submissionId;
        contactSaved = Boolean(plannerSubmissionId && (saved.contactSaved || contactRedirect));
        if (plannerSubmissionId && saved.payload.submissionStage === 'contact') {
          form.dataset.quoteResume = 'move';
        } else {
          if (plannerSubmissionId) form.dataset.quoteResume = 'details';
          showSubmissionError(form, false);
        }
      }
      var textareas = form.querySelectorAll('textarea');
      Array.prototype.forEach.call(textareas, function (textarea) {
        autogrowTextarea(textarea);
        textarea.addEventListener('input', function () {
          autogrowTextarea(textarea);
        });
      });

      var handleSubmission = async function (event) {
        event.preventDefault();
        if (form.hasAttribute('data-quote-submitting') || getFieldValue(form, ['_honey'])) return;

        var contactOnly = event.type === 'quote:contact-continue';
        if (contactOnly && (contactPending || contactSaved)) return;
        var formFields = collectFormFields(form, contactOnly);
        var selectedService = getFieldValue(form, ['services', 'serviceNeeded']);
        var serviceType = clean(new URLSearchParams(location.search).get('serviceType')) ||
          clean(form.getAttribute('data-service-type')) ||
          (contactOnly && !selectedService ? undefined : serviceTypeFromValue(selectedService));
        var message = getFieldValue(form, ['details']);
        var payload = {
          name: getFieldValue(form, ['name', 'fullName']),
          email: getFieldValue(form, ['email']),
          phone: getFieldValue(form, ['phone']),
          moveDate: contactOnly ? undefined : getFieldValue(form, ['moveDate', 'targetDate']),
          originAddress: contactOnly ? undefined : getFieldValue(form, ['moveFrom', 'address', 'projectAddress']),
          destinationAddress: contactOnly ? undefined : getFieldValue(form, ['moveTo']),
          moveSize: contactOnly ? undefined : getFieldValue(form, ['moveSize']),
          serviceType: serviceType,
          referralSource: contactOnly ? undefined : getFieldValue(form, ['referralSource']),
          message: !contactOnly && marketplace && message ? 'Facebook Marketplace pickup request. Item description: ' + message :
            contactOnly ? undefined : message,
          websiteFormName: formName,
          websiteFormUrl: location.href,
          websiteFormFields: formFields,
          websiteAttribution: form.getAttribute('data-service-type') === 'employment' ? undefined : window.cmcWebsiteAttribution,
          submissionStage: isPlanner ? (contactOnly ? 'contact' : 'complete') : undefined
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
        if (!contactOnly && !payload.referralSource) {
          setStatus(form, 'error', 'Please choose how you heard about us.');
          return;
        }

        var previous = readDraft();
        var sameRequest = previous && previous.path === location.pathname && previous.payload &&
          previous.payload.websiteFormName === formName &&
          previous.payload.name === payload.name && previous.payload.email === payload.email &&
          previous.payload.phone === payload.phone && previous.payload.serviceType === payload.serviceType &&
          JSON.stringify(previous.payload.websiteFormFields) === JSON.stringify(payload.websiteFormFields);
        payload.submissionId = plannerSubmissionId || (sameRequest && previous.payload.submissionId) || newSubmissionId();
        if (isPlanner) plannerSubmissionId = payload.submissionId;
        if (contactOnly) {
          // A late contact save must not replace a draft with all of the move details.
          if (!previous || previous.payload?.submissionId !== payload.submissionId ||
              previous.payload.submissionStage !== 'complete') saveDraft(payload);
          contactPending = true;
          try {
            await submitLead(payload, true);
            contactSaved = true;
          } catch (error) {
            console.warn('Background quote contact save failed', { status: error && error.status });
          } finally {
            contactPending = false;
          }
          return;
        }

        saveDraft(payload);
        var isRedirecting = false;
        var button = event.submitter || form.querySelector('button[type="submit"]');
        var status = ensureStatusEl(form);
        status.classList.add('d-none');
        setSubmitting(form, button, true);
        try {
          try {
            await submitLead(payload);
          } catch (error) {
            if (!isPlanner || !canRetry(error)) throw error;
            await submitLead(payload);
          }
          clearDraft();
          setStatus(form, 'success', "Thanks! We got your request and we'll reach out shortly.");
          if (isPlanner && payload.serviceType !== 'employment') {
            window.dispatchEvent(new CustomEvent('cmc:quote-completed', {
              detail: { submissionId: payload.submissionId }
            }));
          }
          isRedirecting = true;
          window.location.assign(form.getAttribute('data-success-url') || '/thank-you.html');
        } catch (error) {
          if (!isPlanner && canRetry(error)) {
            setStatus(form, 'info', 'Trying another way to send your request...');
            try {
              isRedirecting = true;
              submitAsBrowserForm(payload);
              setTimeout(function () {
                if (document.visibilityState === 'visible') {
                  isRedirecting = false;
                  setSubmitting(form, button, false);
                  showSubmissionError(form, true);
                }
              }, 12000);
              return;
            } catch (fallbackError) {
              isRedirecting = false;
            }
          }
          console.error('Quote form submission failed', {
            status: error && error.status,
            referenceId: error && error.referenceId
          });
          showSubmissionError(form, true);
        } finally {
          if (!isRedirecting) setSubmitting(form, button, false);
        }
      };
      form.addEventListener('submit', handleSubmission);
      if (isPlanner) form.addEventListener('quote:contact-continue', handleSubmission);
    });
  });
})();
