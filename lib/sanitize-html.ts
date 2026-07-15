/**
 * Lightweight HTML sanitizer for blog article bodies.
 * Strips scripts, event handlers, and unsafe URLs while allowing
 * common rich-text tags produced by the dashboard editor.
 */

const ALLOWED_TAGS = new Set([
  "P",
  "BR",
  "DIV",
  "SPAN",
  "STRONG",
  "B",
  "EM",
  "I",
  "U",
  "S",
  "STRIKE",
  "H1",
  "H2",
  "H3",
  "H4",
  "H5",
  "H6",
  "UL",
  "OL",
  "LI",
  "A",
  "BLOCKQUOTE",
  "PRE",
  "CODE",
  "HR",
  "IMG",
  "TABLE",
  "THEAD",
  "TBODY",
  "TR",
  "TH",
  "TD",
  "SUB",
  "SUP",
]);

const ALLOWED_ATTRS = new Set([
  "href",
  "target",
  "rel",
  "src",
  "alt",
  "title",
  "class",
  "colspan",
  "rowspan",
]);

function isSafeUrl(value: string, attr: "href" | "src"): boolean {
  const trimmed = value.trim().toLowerCase();
  if (
    trimmed.startsWith("javascript:") ||
    trimmed.startsWith("vbscript:") ||
    trimmed.startsWith("data:text/html")
  ) {
    return false;
  }
  // href: only relative, http(s), mailto, tel
  if (attr === "href") {
    if (
      trimmed.startsWith("http://") ||
      trimmed.startsWith("https://") ||
      trimmed.startsWith("mailto:") ||
      trimmed.startsWith("tel:") ||
      trimmed.startsWith("/") ||
      trimmed.startsWith("#") ||
      trimmed.startsWith("?")
    ) {
      return true;
    }
    return false;
  }
  // src: only http(s) or relative paths (no data: URIs)
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("/")
  ) {
    return true;
  }
  return false;
}

/**
 * Sanitize HTML for safe rendering in the blog detail page.
 */
export function sanitizeHtml(dirty: string): string {
  if (!dirty) return "";

  if (typeof document !== "undefined") {
    const template = document.createElement("template");
    template.innerHTML = dirty;
    sanitizeNode(template.content);
    return template.innerHTML;
  }

  // SSR / non-DOM: strip clearly dangerous constructs
  return dirty
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, "")
    .replace(/<object[\s\S]*?>[\s\S]*?<\/object>/gi, "")
    .replace(/<embed[\s\S]*?>/gi, "")
    .replace(/\son\w+\s*=\s*(['"]).*?\1/gi, "")
    .replace(/\son\w+\s*=\s*[^\s>]+/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/vbscript:/gi, "")
    .replace(/data:text\/html/gi, "");
}

function sanitizeNode(root: ParentNode): void {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, null);
  const toRemove: Element[] = [];
  const elements: Element[] = [];

  let current = walker.nextNode();
  while (current) {
    elements.push(current as Element);
    current = walker.nextNode();
  }

  for (const el of elements) {
    const tag = el.tagName.toUpperCase();
    if (!ALLOWED_TAGS.has(tag)) {
      toRemove.push(el);
      continue;
    }

    for (const attr of Array.from(el.attributes)) {
      const name = attr.name.toLowerCase();
      if (name.startsWith("on") || name === "style" || !ALLOWED_ATTRS.has(name)) {
        el.removeAttribute(attr.name);
        continue;
      }
      if (name === "href" && !isSafeUrl(attr.value, "href")) {
        el.removeAttribute(attr.name);
      }
      if (name === "src" && !isSafeUrl(attr.value, "src")) {
        el.removeAttribute(attr.name);
      }
    }

    if (tag === "A") {
      el.setAttribute("rel", "noopener noreferrer");
      if (!el.getAttribute("target")) {
        el.setAttribute("target", "_blank");
      }
    }
  }

  for (const el of toRemove) {
    const parent = el.parentNode;
    if (!parent) continue;
    while (el.firstChild) {
      parent.insertBefore(el.firstChild, el);
    }
    parent.removeChild(el);
  }
}
