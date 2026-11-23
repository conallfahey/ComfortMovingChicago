(function () {
  const storageKey = "cmcWebsiteAttribution";
  const lookback = 90 * 24 * 60 * 60 * 1000;
  const campaignParams = {
    utm_source: "utmSource", utm_medium: "utmMedium", utm_campaign: "utmCampaign",
    utm_id: "utmId", utm_content: "utmContent", utm_term: "utmTerm",
    gclid: "gclid", gbraid: "gbraid", wbraid: "wbraid", fbclid: "fbclid",
    msclkid: "msclkid", ttclid: "ttclid",
  };
  const siteHost = (hostname) => hostname.toLowerCase().replace(/^www\./, "");
  const url = new URL(location.href);
  const capturedAt = Date.now();
  const touch = { landingPath: url.pathname.slice(0, 1024), capturedAt };
  let internalNavigation = false;

  if (document.referrer) {
    try {
      const referrer = new URL(document.referrer);
      internalNavigation = siteHost(referrer.hostname) === siteHost(url.hostname);
      if (!internalNavigation && /^https?:$/.test(referrer.protocol)) touch.referrerHost = referrer.hostname;
    } catch { /* No usable referrer. */ }
  }

  if (!internalNavigation) {
    for (const [param, field] of Object.entries(campaignParams)) {
      const value = url.searchParams.get(param)?.trim();
      if (value) touch[field] = value.slice(0, 256);
    }
  }

  let previous;
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) || "null");
    const age = capturedAt - stored?.firstTouch?.capturedAt;
    if (age >= 0 && age < lookback && typeof stored.firstTouch.landingPath === "string") previous = stored;
  } catch { /* A browser may disable storage or have an old invalid value. */ }

  const attribution = { firstTouch: previous?.firstTouch || touch };
  const identifiable = Object.keys(touch).some((key) => key !== "landingPath" && key !== "capturedAt");
  if (identifiable) attribution.lastNonDirectTouch = touch;
  else if (previous?.lastNonDirectTouch) attribution.lastNonDirectTouch = previous.lastNonDirectTouch;

  try { localStorage.setItem(storageKey, JSON.stringify(attribution)); }
  catch { /* Capture for this page still works without persistent storage. */ }
  window.cmcWebsiteAttribution = attribution;
})();
