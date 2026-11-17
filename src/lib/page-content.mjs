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

const contactFields = new Set(["name", "fullName", "phone", "email"]);
const projectFields = new Set(["buildingType", "coiRequired", "freightElevatorOrDock", "itemList", "details"]);
const autocomplete = { name: "name", fullName: "name", phone: "tel", email: "email", businessName: "organization" };

function quoteData(form, homepage) {
  const nodes = [...walk(form)];
  const formAttrs = attributes(form);
  const submit = nodes.find((node) => node.tagName === "button" && attribute(node, "type") === "submit");
  const marketplace = formAttrs.id === "marketplace-pickup-form";
  const project = nodes.some((node) => attribute(node, "name") === "projectAddress");
  const fields = { service: [], move: [], access: [], contact: [] };
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
      required: inputAttrs.required !== undefined && !["phone", "email", "referralSource"].includes(name),
      label: label ? text(label).trim() : name,
      content: serialize(input),
    };
    delete field.attrs.required;
    if (name === "referralSource") {
      field.content = '<option value="Other">Prefer not to say</option>' +
        input.childNodes.filter((option) => option.tagName === "option" &&
          !["", "Other"].includes(attribute(option, "value")) && attribute(option, "selected") === undefined)
          .map(serializeOuter).join("");
      referral = field;
    } else if (homepage && name === "services") {
      field.options = input.childNodes.filter((option) => option.tagName === "option")
        .map((option) => ({ value: attribute(option, "value") ?? text(option), label: text(option).trim() }));
      fields.service.push(field);
    } else if (contactFields.has(name)) {
      fields.contact.push(field);
    } else if (project && projectFields.has(name)) {
      fields.access.push(field);
    } else {
      fields.move.push(field);
    }
  }

  return {
    attrs: formAttrs,
    hidden: hidden.join(""),
    referral,
    sms,
    marketplace,
    submitLabel: attribute(submit, "data-default-text") || text(submit).trim(),
    loadingLabel: attribute(submit, "data-loading-text") || "Sending your request…",
    steps: [
      { kind: "service", title: "What do you need help with?", fields: fields.service },
      { kind: "move", title: marketplace ? "Where is the pickup?" : project ? "Tell us about the project" : "Tell us about your move", fields: fields.move },
      { kind: "access", title: "What should the crew know?", fields: fields.access },
      { kind: "contact", title: "How can we reach you?", fields: fields.contact },
    ].filter((step) => step.fields.length),
  };
}

export function loadPage(filename) {
  const document = parse(readFileSync(filename, "utf8"));
  const html = document.childNodes.find((node) => node.tagName === "html");
  const head = html.childNodes.find((node) => node.tagName === "head");
  const body = html.childNodes.find((node) => node.tagName === "body");
  const homepage = filename === "index.html";
  const marker = "<!--comfort-moving-quote-->";
  let quote;
  let mainId;

  for (const node of [...walk(head), ...walk(body)]) {
    const id = attribute(node, "id");
    const classes = (attribute(node, "class") ?? "").split(/\s+/);
    const source = attribute(node, "src");
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
      quote = quoteData(node, homepage);
      const siblings = node.parentNode.childNodes;
      siblings[siblings.indexOf(node)] = { nodeName: "#comment", data: "comfort-moving-quote", parentNode: node.parentNode };
    }
  }
  const [beforeQuote, afterQuote] = serialize(body).split(marker);
  return {
    lang: attribute(html, "lang") || "en",
    body: attributes(body),
    head: serialize(head),
    beforeQuote,
    afterQuote,
    homepage,
    mainId,
    quote,
  };
}
