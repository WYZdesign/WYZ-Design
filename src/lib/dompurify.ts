import DOMPurify from "isomorphic-dompurify";

const ALLOWED_TAGS = [
  "p", "br", "strong", "em", "ul", "ol", "li", "h1", "h2", "h3", "h4", "h5", "h6",
  "a", "img", "span", "div", "section", "blockquote", "hr", "table", "thead", "tbody",
  "tr", "td", "th", "pre", "code", "figure", "figcaption", "video", "source",
];

const ALLOWED_ATTR = [
  "href", "src", "alt", "class", "id", "style", "target", "rel", "width", "height",
  "loading", "autoplay", "controls", "poster", "data-gdrive", "data-upload",
  "colspan", "rowspan", "cellpadding", "cellspacing",
];

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    FORBID_TAGS: ["script", "iframe", "object", "embed"],
    FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover", "onfocus", "onblur"],
    FORCE_BODY: true,
  });
}
