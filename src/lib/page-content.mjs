import { readFileSync } from "node:fs";
import { parse, serialize, serializeOuter } from "parse5";

export function* walk(node) {
  yield node;
  for (const child of node.childNodes ?? []) yield* walk(child);
}

export const attribute = (node, name) => node?.attrs?.find((entry) => entry.name === name)?.value;
export const attributes = (node) => Object.fromEntries((node.attrs ?? []).map(({ name, value }) => [name, value]));
export const text = (node) => node?.nodeName === "#text"
  ? node.value
  : (node?.childNodes ?? []).map(text).join("");

function remove(node) {
  const siblings = node.parentNode.childNodes;
  siblings.splice(siblings.indexOf(node), 1);
}

const hasClass = (node, name) => (attribute(node, "class") ?? "").split(/\s+/).includes(name);

function renderServiceSections(content) {
  const usedIds = new Set();
  const sections = [];
  let primaryFaq;

  function uniqueId(id) {
    if (!id) return undefined;
    let unique = id;
    for (let suffix = 2; usedIds.has(unique); suffix++) unique = `${id}-${suffix}`;
    usedIds.add(unique);
    return unique;
  }

  for (const section of content) {
    const nodes = [...walk(section)];
    for (const badge of nodes.filter((node) => hasClass(node, "badge"))) {
      if (badge.parentNode.childNodes.some((sibling) => sibling.tagName === "h2")) remove(badge);
    }

    const accordions = nodes.filter((node) => hasClass(node, "accordion"));
    for (const accordion of accordions) {
      const items = accordion.childNodes.filter((node) => hasClass(node, "accordion-item"));
      const group = uniqueId(attribute(accordion, "id"));
      setElement(accordion, "div", "cmc-service-questions", group);
      for (const item of items) {
        const children = [...walk(item)];
        const question = children.find((node) => hasClass(node, "accordion-button"));
        const panel = children.find((node) => hasClass(node, "accordion-collapse"));
        const answer = children.find((node) => hasClass(node, "accordion-body"));
        if (!question || !panel || !answer) throw new Error("Missing question or answer in service accordion");

        setElement(item, "details", "cmc-service-question", uniqueId(attribute(panel, "id")));
        if (group) item.attrs.push({ name: "name", value: group });
        if (hasClass(panel, "show")) item.attrs.push({ name: "open", value: "" });
        setElement(question, "summary", "cmc-service-question-label");
        setElement(answer, "div", "cmc-service-answer");
        item.childNodes = [question, answer];
        question.parentNode = item;
        answer.parentNode = item;
      }
    }

    if (hasClass(section, "final-cta") || hasClass(section, "bg-brand-blue")) {
      section.attrs = section.attrs.filter(({ name }) => name !== "style" && name !== "class");
      section.attrs.push({ name: "class", value: "cmc-service-end" });
    }

    // Legacy pages sometimes repeat a section that contains only a heading and FAQs.
    const [questions] = accordions;
    const heading = nodes.find((node) => node.tagName === "h2");
    const standaloneFaq = accordions.length === 1 && heading && !attribute(section, "id") &&
      (hasClass(section, "faq-section") || hasClass(section, "quick-faq-section")) &&
      text(section).replace(/\s/g, "") === (text(heading) + text(questions)).replace(/\s/g, "");
    if (standaloneFaq && primaryFaq) {
      setElement(questions, "div", "cmc-service-question-group", attribute(questions, "id"));
      primaryFaq.childNodes.push(questions);
      questions.parentNode = primaryFaq;
      continue;
    }
    if (standaloneFaq) primaryFaq = questions;
    sections.push(section);
  }
  return sections.map(serializeOuter).join("\n");
}

function setElement(node, tag, className, id) {
  node.tagName = node.nodeName = tag;
  node.attrs = [{ name: "class", value: className }];
  if (id) node.attrs.push({ name: "id", value: id });
}

function serviceOverview(section) {
  if (!section) return undefined;
  const container = section.childNodes.find((node) => hasClass(node, "container"));
  const row = container?.childNodes.find((node) => hasClass(node, "row"));
  const columns = row?.childNodes.filter((node) => node.tagName) ?? [];
  if (columns.length !== 2) return undefined;

  const [media, copy] = columns;
  const images = [...walk(media)].filter((node) => node.tagName === "img");
  const heading = copy.childNodes.find((node) => node.tagName === "h2");
  const lead = copy.childNodes.find((node) => node.tagName === "p");
  if (images.length !== 1 || !heading || !lead) return undefined;

  for (const node of walk(copy)) {
    if (node.tagName === "h5" && hasClass(node.parentNode, "about-feature-text")) node.tagName = node.nodeName = "h3";
  }
  const image = attributes(images[0]);
  delete image.class;
  return {
    id: attribute(section, "id"),
    heading: serialize(heading),
    lead: serialize(lead),
    details: copy.childNodes.filter((node) => node !== heading && node !== lead && !hasClass(node, "badge"))
      .map((node) => serializeOuter(node)).join(""),
    image,
  };
}

function serviceData(root, filename) {
  const hero = root.childNodes.find((node) => hasClass(node, "hero-section-new"));
  if (!hero) throw new Error(`Missing service hero on ${filename}`);
  const nodes = [...walk(hero)];
  const title = nodes.find((node) => node.tagName === "h1");
  const copy = nodes.find((node) => hasClass(node, "row")).childNodes.find((node) => node.tagName);
  const subtitle = copy.childNodes.find((node) => node.tagName === "h2");
  const lead = copy.childNodes.find((node) => node.tagName === "p");
  const list = copy.childNodes.find((node) => node.tagName === "ul");
  const actions = copy.childNodes.find((node) => hasClass(node, "hero-buttons-container"));
  const quote = nodes.find((node) => attribute(node, "id") === "quoteForm");
  const quoteTitle = [...walk(quote)].find((node) => ["h2", "h3"].includes(node.tagName));
  const quoteNote = [...walk(quote)].find((node) => hasClass(node, "marketplace-form-note"));
  const reviews = nodes.find((node) => hasClass(node, "hero-reviews-card"));
  const reviewNodes = reviews ? [...walk(reviews)] : [];
  const reviewLink = reviewNodes.find((node) => hasClass(node, "btn-google-reviews"));
  const sections = root.childNodes.filter((node) => node.tagName === "section");
  const overview = serviceOverview(sections[0]);

  return {
    title: serialize(title).trim().replace(/\b(?:Movers|Moving|Hoisting|Packing|Assembly|Pickup)\b/,
      '<span class="cmc-service-accent">$&</span>'),
    subtitle: serialize(subtitle),
    lead: serialize(lead),
    benefits: list?.childNodes.filter((node) => node.tagName === "li").map((item) => serialize(item)),
    stats: [...walk(copy)].filter((node) => hasClass(node, "hero-stat-card"))
      .map((stat) => stat.childNodes.filter((node) => node.tagName).map((node) => text(node).trim())),
    actions: actions.childNodes.filter((node) => node.tagName === "a")
      .map((link) => ({ href: attribute(link, "href"), label: text(link).trim() })),
    quoteTitle: text(quoteTitle).trim(),
    quoteNote: quoteNote && text(quoteNote).trim(),
    reviews: reviewNodes.filter((node) => hasClass(node, "review-item")).map((review) => {
      const parts = [...walk(review)];
      return {
        initials: text(parts.find((node) => hasClass(node, "review-avatar"))).trim(),
        name: text(parts.find((node) => hasClass(node, "text-dark"))).trim(),
        date: text(parts.find((node) => node.tagName === "div" && hasClass(node, "text-muted"))).trim(),
        quote: text(parts.find((node) => node.tagName === "p")).trim(),
      };
    }),
    reviewHref: attribute(reviewLink, "href"),
    overview,
    content: renderServiceSections(overview ? sections.slice(1) : sections),
  };
}

const contactFields = new Set(["name", "fullName", "phone", "email", "services", "serviceNeeded", "businessName"]);
const schedulingFields = new Set(["moveDate", "targetDate", "moveFrom", "moveTo", "address", "projectAddress"]);
const autocomplete = { name: "name", fullName: "name", phone: "tel", email: "email", businessName: "organization" };

function quoteData(form) {
  const nodes = [...walk(form)];
  const formAttrs = { ...attributes(form), "data-crm-quote-form": "" };
  const submit = nodes.find((node) => node.tagName === "button" && attribute(node, "type") === "submit");
  const marketplace = formAttrs.id === "marketplace-pickup-form";
  const project = nodes.some((node) => attribute(node, "name") === "projectAddress");
  const fields = { contact: [], move: [], details: [] };
  const hidden = [];
  let referral;
  let sms;

  for (const input of nodes.filter((node) => ["input", "select", "textarea"].includes(node.tagName))) {
    const name = attribute(input, "name");
    if (!name) continue;
    if (name === "_honey" || attribute(input, "type") === "hidden") {
      hidden.push(serializeOuter(input));
      continue;
    }
    if (name === "smsConsent") {
      sms = serialize(input.parentNode);
      continue;
    }

    const inputAttrs = attributes(input);
    const label = nodes.find((node) => node.tagName === "label" && attribute(node, "for") === inputAttrs.id);
    const field = {
      name,
      tag: input.tagName,
      attrs: { ...inputAttrs, class: "cmc-quote-input", autocomplete: autocomplete[name] ?? inputAttrs.autocomplete },
      required: !["phone", "email"].includes(name) &&
        (["name", "fullName", "services", "serviceNeeded", "referralSource"].includes(name) || inputAttrs.required !== undefined),
      label: label ? text(label).trim() : name,
      content: serialize(input),
    };
    delete field.attrs.required;
    if (name === "referralSource") {
      referral = field;
    } else if (contactFields.has(name)) {
      fields.contact.push(field);
    } else if (schedulingFields.has(name)) {
      fields.move.push(field);
    } else {
      fields.details.push(field);
    }
  }

  if (referral) fields.details.push(referral);
  const contactOrder = ["name", "fullName", "email", "phone", "businessName", "services", "serviceNeeded"];
  fields.contact.sort((left, right) => contactOrder.indexOf(left.name) - contactOrder.indexOf(right.name));
  const steps = [
    { kind: "contact", title: "Contact and service", fields: fields.contact },
    { kind: "move", title: marketplace ? "Pickup and drop-off" : project ? "Project date and location" : "Date and locations", fields: fields.move },
    { kind: "details", title: project ? "Access and inventory" : "Final details", fields: fields.details },
  ];

  return {
    attrs: formAttrs,
    hidden: hidden.join(""),
    sms,
    marketplace,
    fixedService: marketplace ? "Facebook Marketplace Pickup" : undefined,
    submitLabel: attribute(submit, "data-default-text") || text(submit).trim(),
    steps,
  };
}

function editorialData(body, main, quote) {
  const nodes = [...walk(body)];
  const hero = nodes.find(node => hasClass(node, "hero-section-new") || hasClass(node, "berwyn-hero")) ??
    (main ?? body).childNodes.find(node => node.tagName && [...walk(node)].some(child => child.tagName === "h1")) ??
    body.childNodes.find(node => node.tagName && [...walk(node)].some(child => child.tagName === "h1"));
  if (!hero) throw new Error("Missing editorial hero");
  const heroNodes = [...walk(hero)];
  const title = heroNodes.find(node => node.tagName === "h1");
  const subtitle = heroNodes.find(node => node.tagName === "h2");
  const lead = heroNodes.find(node => node.tagName === "p");
  const photo = heroNodes.find(node => node.tagName === "img");
  const byline = heroNodes.filter(node => hasClass(node, "bi-calendar") || hasClass(node, "bi-person"))
    .map(node => text(node.parentNode).trim()).filter(Boolean);
  const actions = heroNodes.find(node => hasClass(node, "hero-buttons-container"));
  const review = heroNodes.find(node => hasClass(node, "hero-reviews-card"));
  const form = heroNodes.find(node => attribute(node, "id") === "quoteForm");
  const quoteHeading = form && [...walk(form)].find(node => ["h2", "h3"].includes(node.tagName));
  const root = main ?? body;
  const contentsNav = root.childNodes.find(node => attribute(node, "aria-label") === "On this page");
  const content = root.childNodes.filter(node => node.tagName && node !== hero && node !== contentsNav && !hasClass(node, "cta-banner") &&
    !["script", "link", "style"].includes(node.tagName));
  const usedIds = new Set(nodes.map(node => attribute(node, "id")).filter(Boolean));
  const links = contentsNav ? [...walk(contentsNav)].filter(node => node.tagName === "a" &&
    attribute(node, "href")?.startsWith("#"))
    .map(node => ({ id: attribute(node, "href").slice(1), label: text(node).trim() })) : [];
  const headings = main && ![...walk(main)].includes(hero)
    ? content.flatMap(node => [...walk(node)].filter(child => child.tagName === "h2").map(heading => [heading, heading]))
    : content.map(section => [section, [...walk(section)].find(node => node.tagName === "h2")]);
  for (const [section, heading] of headings) {
    if (!heading || hasClass(section, "final-cta") || contentsNav) continue;
    const faq = /\b(?:faq|(?:moving|asked) questions)\b/i.test(text(heading));
    if (links.length >= 5 && !faq) continue;
    const base = text(heading).trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "section";
    let id = attribute(section, "id") || attribute(heading, "id");
    if (!id) {
      id = base;
      for (let suffix = 2; usedIds.has(id); suffix++) id = `${base}-${suffix}`;
      usedIds.add(id);
      section.attrs.push({ name: "id", value: id });
    }
    if (faq && links.length === 5) links.pop();
    links.push({ id, label: text(heading).trim() });
  }

  return {
    title: serialize(title).replace(/\b(Movers|Moving)\b/i, '<span class="cmc-editorial-accent">$1</span>'),
    subtitle: subtitle && text(subtitle).trim(),
    lead: lead && serialize(lead),
    byline,
    overlay: heroNodes.some(node => hasClass(node, "hero-overlay-new")),
    image: photo && attributes(photo),
    actions: [...walk(actions ?? hero)].filter(node => node.tagName === "a" &&
      /^(?:#quoteForm|\/#quoteForm|tel:)/.test(attribute(node, "href") ?? ""))
      .map(node => ({ href: attribute(node, "href"), label: text(node).trim() })),
    quoteHeading: quote && (text(quoteHeading).trim() || "Get a moving quote"),
    stats: heroNodes.filter(node => hasClass(node, "hero-stat-card"))
      .map(stat => stat.childNodes.filter(node => node.tagName).map(node => text(node).trim())),
    review: review && serialize(review),
    links,
    content: renderServiceSections(content),
    scripts: [...new Set([...body.childNodes, ...root.childNodes])].filter(node => node.tagName === "script" &&
      !/\/(?:quote-form-crm|quote-steps|site-refresh|website-attribution)\.js\b/.test(attribute(node, "src") ?? ""))
      .map(node => serializeOuter(node)).join("\n"),
  };
}

export function loadPage(filename, { editorial = filename.startsWith("neighborhoods/") } = {}) {
  const document = parse(readFileSync(filename, "utf8"));
  const html = document.childNodes.find((node) => node.tagName === "html");
  const head = html.childNodes.find((node) => node.tagName === "head");
  const body = html.childNodes.find((node) => node.tagName === "body");
  const homepage = filename === "index.html";
  const serviceDetail = filename.startsWith("services/");
  const serviceDirectory = filename === "services.html";
  const marker = "<!--comfort-moving-quote-->";
  let quote;
  let mainId;

  for (const node of [...walk(head), ...walk(body)]) {
    const id = attribute(node, "id");
    const classes = (attribute(node, "class") ?? "").split(/\s+/);
    const source = attribute(node, "src");
    const href = attribute(node, "href") ?? "";
    if ((serviceDetail || serviceDirectory || editorial) && node.tagName === "link" &&
        /^(?:https:\/\/fonts\.(?:googleapis|gstatic)\.com|https:\/\/cdn\.jsdelivr\.net)/.test(href)) {
      remove(node);
    }
    if ((node.tagName === "nav" && (id === "shared-nav" || classes.includes("navbar"))) ||
        (node.tagName === "footer" && (id === "shared-footer" || classes.includes("footer-section"))) ||
        (node.tagName === "script" && source && /\/(nav|footer)-include\.js(?:\?|$)/.test(source)) ||
        (homepage && classes.includes("promo-bar"))) {
      remove(node);
    }
    if (node.tagName === "main" && mainId === undefined) {
      mainId = id || "main-content";
      if (!id) node.attrs.push({ name: "id", value: mainId });
    }
    if (node.tagName === "form" && (attribute(node, "data-crm-quote-form") !== undefined || id === "marketplace-pickup-form") &&
        attribute(node, "data-service-type") !== "employment") {
      if (quote) throw new Error(`Multiple quote forms on ${filename}`);
      quote = quoteData(node);
      const siblings = node.parentNode.childNodes;
      siblings[siblings.indexOf(node)] = { nodeName: "#comment", data: "comfort-moving-quote", parentNode: node.parentNode };
    }
  }
  const main = body.childNodes.find((node) => node.tagName === "main");
  if (serviceDetail && !quote) throw new Error(`Missing quote form on ${filename}`);
  const service = serviceDetail ? serviceData(main ?? body, filename) : undefined;
  const [beforeQuote, afterQuote] = service || editorial ? [] : serialize(body).split(marker);
  return {
    lang: attribute(html, "lang") || "en",
    body: attributes(body),
    head: serialize(head),
    beforeQuote,
    afterQuote,
    homepage,
    serviceDirectory,
    service,
    editorial: editorial ? editorialData(body, main, quote) : undefined,
    mainId,
    quote,
  };
}
