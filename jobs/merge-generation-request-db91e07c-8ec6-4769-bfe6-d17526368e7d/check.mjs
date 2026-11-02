// Checks a Gujarati translation answer against inputs/english.json. Built-in modules only.
// inputs/job.json names the step (material_gu, quick_notes_gu, flashcards_gu or mcqs_gu) and the
// answer file (default out/answer.json); without it, a Material job answering in out/gujarati.json.
// Prints PASS, or every problem found and exits 1. Mirrors the Material Studio translation checks
// (gpsc_pipeline/content_store.py, translation_structure.py, generation_execution.py): same items and
// artifact IDs in the same order, the same citations and maths, the same correct MCQ option, no
// markdown or raw links, and for Material the same HTML structure. Bold/italic/mark phrases may
// change order inside one paragraph, heading, list item or table cell (Gujarati word order differs).
import fs from "node:fs";

const problems = [];
const read = (file) => {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (e) {
    problems.push(`${file} is not valid JSON: ${e.message}`);
    return null;
  }
};

const VOID = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"]);
const EMPHASIS = new Set(["strong", "em", "mark"]);
const SCRIPTS = new Set(["sub", "sup"]);
const CONTAINERS = new Set(["h2", "h3", "p", "li", "th", "td", "figcaption"]);
const MATH = /\\\(.*?\\\)|\$\$.*?\$\$/gs;
// "[(...)]" is a worded formula, translated like any text; citations never start with "(".
const CITATION = /\[(?!\s*\()[^\]]+\]/g;

// Pictures travel as <figure data-picture="pic-..."> slots plus a "pictures" list of specs.
// The slots stay byte-identical; in the specs only words are translated (never numbers,
// templates, icons or structure). Mirrors gpsc_pipeline/ai_pictures.py.
const FIGURE = /<figure\b([^>]*)>[\s\S]*?<\/figure\s*>/gi;
const FIXED_KEYS = new Set(["template", "dir", "shape", "pos", "size", "icon", "start_icon", "final_icon", "center_icon", "event_icon", "heading_icon"]);
const figureKeys = (html) => [...String(html ?? "").matchAll(FIGURE)].map((m) => {
  const slot = m[1].match(/^\s+data-picture\s*=\s*(["']?)([^"'\s>]*)\1\s*$/i);
  return slot ? `slot:${slot[2]}` : /<img\b/i.test(m[0]) ? "img" : "figure";
});
const numbers = (text) => (String(text).match(/\d+(?:[.,]\d+)*/g) ?? []).sort();
// A drawing the picture AI redraws in the target language, or a word-free illustration
// that keeps its image: the translator sends only its alt (up to 300 characters) and
// caption (up to 140), and may write a Roman numeral as digits (Part III -> Part 3).
const ALT_CAPTION_LIMITS = { alt: 300, caption: 140 };
const normNumber = (n) => { let t = n.replace(/,/g, ""); if (t.includes(".")) t = t.replace(/0+$/, "").replace(/\.$/, ""); return t; };
const romanValues = (text) => [...String(text).matchAll(/\b(?=[IVXL])L?X{0,3}(?:IX|IV|V?I{0,3})\b/g)]
  .map((m) => m[0]).filter(Boolean).map((r) => {
    const v = [...r].map((c) => ({ I: 1, V: 5, X: 10, L: 50 })[c]);
    return String(v.reduce((sum, x, i) => sum + (i + 1 < v.length && x < v[i + 1] ? -x : x), 0));
  });
function redrawnTextProblem(s, t) {
  const allowed = new Set([...numbers(s).map(normNumber), ...romanValues(s)]);
  return numbers(t).map(normNumber).some((n) => !allowed.has(n));
}
function compareSpec(s, t, path, key, out) {
  if (Array.isArray(s)) {
    if (!Array.isArray(t) || s.length !== t.length) return out.push(`${path}: keep the same number of entries as English`);
    s.forEach((v, k) => compareSpec(v, t[k], `${path}[${k}]`, key, out));
  } else if (s && typeof s === "object") {
    if (!t || typeof t !== "object" || Array.isArray(t)) return out.push(`${path}: must stay an object`);
    const a = Object.keys(s).sort(), b = Object.keys(t).sort();
    if (JSON.stringify(a) !== JSON.stringify(b)) return out.push(`${path}: keep exactly the fields ${a.join(", ")}`);
    const redrawn = (s.template === "custom" && !("texts" in s)) || s.template === "illustration";
    a.forEach((k) => {
      if (redrawn && (k === "alt" || k === "caption")) {
        if (typeof t[k] !== "string" || !t[k].trim()) out.push(`${path}.${k}: must stay non-empty text`);
        else if (t[k].length > ALT_CAPTION_LIMITS[k]) out.push(`${path}.${k}: keep it under ${ALT_CAPTION_LIMITS[k]} characters`);
        else if (redrawnTextProblem(s[k], t[k])) out.push(`${path}.${k}: keep the numbers exactly as in English, as digits 0-9`);
      } else compareSpec(s[k], t[k], `${path}.${k}`, k, out);
    });
  } else if (typeof s === "string") {
    if (typeof t !== "string" || !t.trim()) out.push(`${path}: must stay non-empty text`);
    else if (FIXED_KEYS.has(key) && s !== t) out.push(`${path}: must stay "${s}" (translate only words)`);
    else if (!FIXED_KEYS.has(key) && JSON.stringify(numbers(s)) !== JSON.stringify(numbers(t))) {
      out.push(`${path}: numbers must stay exactly as in English, as digits 0-9`);
    }
  } else if (s !== t) out.push(`${path}: must stay ${JSON.stringify(s)}`);
}
function checkPictures(where, source, page, fields) {
  for (const field of fields) {
    if (JSON.stringify(figureKeys(source[field])) !== JSON.stringify(figureKeys(page[field]))) {
      problems.push(`${where} ${field}: keep every <figure data-picture="..."></figure> exactly as in English, in the same place.`);
    }
  }
  const want = Array.isArray(source.pictures) ? source.pictures : [];
  if (!want.length) {
    if (page.pictures !== undefined) problems.push(`${where}: the English item has no pictures; remove "pictures".`);
    return;
  }
  if (!Array.isArray(page.pictures)) {
    return problems.push(`${where}: return "pictures" with every picture of the English item, words translated.`);
  }
  const got = new Map(page.pictures.map((p) => [p && p.id, p]));
  if (got.size !== page.pictures.length || got.size !== want.length || want.some((p) => !got.has(p.id))) {
    return problems.push(`${where}: "pictures" must list exactly the English picture ids ${want.map((p) => p.id).join(", ")}.`);
  }
  for (const spec of want) {
    const out = [];
    compareSpec(spec, got.get(spec.id), `${where} picture ${spec.id}`, null, out);
    problems.push(...out);
  }
}

function parse(html) {
  const root = [];
  const stack = [];
  const token = /<(\/?)([a-zA-Z][a-zA-Z0-9]*)((?:\s+[^\s=/>]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'>]+))?)*)\s*(\/?)>|([^<]+)|(<)/g;
  const add = (node) => {
    const list = stack.length ? stack[stack.length - 1].children : root;
    if (typeof node === "string" && typeof list[list.length - 1] === "string") list[list.length - 1] += node;
    else list.push(node);
  };
  for (const m of html.matchAll(token)) {
    if (m[5] !== undefined || m[6] !== undefined) {
      add(m[5] ?? m[6]);
      continue;
    }
    const tag = m[2].toLowerCase();
    if (m[1]) {
      if (!stack.length || stack[stack.length - 1].tag !== tag) throw new Error("malformed element nesting");
      stack.pop();
      continue;
    }
    const attrs = [...m[3].matchAll(/([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g)]
      .map((a) => [a[1].toLowerCase(), a[2] ?? a[3] ?? a[4] ?? ""])
      .sort((x, y) => (x[0] < y[0] ? -1 : x[0] > y[0] ? 1 : x[1] < y[1] ? -1 : x[1] > y[1] ? 1 : 0));
    const element = { tag, attrs, children: [], void: VOID.has(tag) || m[4] === "/" };
    add(element);
    if (!element.void) stack.push(element);
  }
  if (stack.length) throw new Error("unclosed elements");
  return root;
}

const maths = (text) => text.match(MATH) ?? [];
// sub/sup move with word order, alone ("N<sub>2</sub>") or inside an emphasised phrase ("CO<sub>2</sub>e").
const reorderable = (node) =>
  (EMPHASIS.has(node.tag) || SCRIPTS.has(node.tag)) && !node.void &&
  node.children.every((c) => (typeof c === "string" ? maths(c).length === 0 : reorderable(c)));
const exact = (node) =>
  node.void ? ["void", node.tag, node.attrs]
    : ["element", node.tag, node.attrs, node.children.flatMap((c) => (typeof c === "string" ? maths(c).map((v) => ["math", v]) : [exact(c)]))];
const strict = (children) => children.flatMap((c) => (typeof c === "string" ? maths(c).map((v) => ["math", v]) : [canonical(c)]));
function container(children) {
  const out = [];
  let run = [];
  const flush = () => {
    // By kind, not count, as the Python check: word order may split, join or repeat a phrase or formula.
    if (run.length) out.push(["emphasis-siblings", [...new Set(run.map((r) => JSON.stringify(r)))].sort()]);
    run = [];
  };
  for (const c of children) {
    if (typeof c === "string") {
      const found = maths(c);
      if (found.length) {
        flush();
        out.push(...found.map((v) => ["math", v]));
      }
    } else if (reorderable(c)) run.push(exact(c));
    else {
      flush();
      out.push(canonical(c));
    }
  }
  flush();
  return out;
}
const canonical = (node) =>
  node.void ? ["void", node.tag, node.attrs]
    : ["element", node.tag, node.attrs, CONTAINERS.has(node.tag) ? container(node.children) : strict(node.children)];
const signature = (html) => JSON.stringify(strict(parse(html)));

const FIELDS = {
  material_gu: ["title", "body"],
  quick_notes_gu: ["content_html"],
  flashcards_gu: ["front", "back"],
  mcqs_gu: ["question", "option_a", "option_b", "option_c", "option_d", "explanation"],
};
const MARKUP = [[/\]\(\s*https?:\/\//, "a markdown link [text](https://...)"], [/https?:\/\//i, "a raw http(s) link"], [/\*\*/, "markdown ** emphasis"]];

let job = { step_key: "material_gu", answer_file: "out/gujarati.json" };
if (fs.existsSync("inputs/job.json")) job = { answer_file: "out/answer.json", ...read("inputs/job.json") };
const fields = FIELDS[job.step_key];
if (!fields) problems.push(`Unknown step ${job.step_key}.`);
const english = read("inputs/english.json");
const gujarati = fields ? read(job.answer_file) : null;
if (english && gujarati) {
  if (!Array.isArray(gujarati)) problems.push(`${job.answer_file} must be a JSON array of items.`);
  else {
    const want = english.map((p) => p.artifact_id);
    const got = gujarati.map((p) => p && p.artifact_id);
    if (JSON.stringify(want) !== JSON.stringify(got)) {
      problems.push(`Artifact IDs or their order differ from inputs/english.json.\n  expected: ${want.join(", ")}\n  found:    ${got.join(", ")}`);
    }
    gujarati.forEach((page, i) => {
      const source = english[i];
      const where = `Item ${i + 1} (${page?.artifact_id ?? "no artifact_id"})`;
      if (!page || typeof page !== "object") return problems.push(`${where} is not an object.`);
      const allowed = ["artifact_id", "pictures", ...fields, ...(job.step_key === "mcqs_gu" ? ["correct_option"] : [])];
      const extra = Object.keys(page).filter((k) => !allowed.includes(k));
      if (extra.length) problems.push(`${where} has extra fields: ${extra.join(", ")}. Use only ${allowed.join(", ")}.`);
      for (const field of fields) {
        if (typeof page[field] !== "string" || !page[field].trim()) problems.push(`${where}: ${field} is empty.`);
      }
      if (!source || fields.some((field) => typeof page[field] !== "string")) return;
      checkPictures(where, source, page, fields);
      if (!/[\u0A80-\u0AFF]/.test(fields.map((field) => page[field]).join(" "))) problems.push(`${where} contains no Gujarati text.`);
      if (job.step_key === "mcqs_gu" && page.correct_option !== source.correct_option) {
        problems.push(`${where}: correct_option must stay ${source.correct_option} (found ${page.correct_option}).`);
      }
      for (const field of fields) {
        const found = MARKUP.find(([pattern]) => pattern.test(page[field]));
        if (found) problems.push(`${where} ${field}: contains ${found[1]}. Use HTML only and plain bracketed citations without links.`);
      }
      for (const [field, s, t] of fields.map((field) => [field, String(source[field] ?? ""), page[field]])) {
        const sc = s.match(CITATION) ?? [];
        const tc = t.match(CITATION) ?? [];
        if (JSON.stringify(sc) !== JSON.stringify(tc)) {
          const first = sc.findIndex((c, k) => c !== tc[k]);
          problems.push(`${where} ${field}: citations in [brackets] must stay exactly as in English, in the same order.` +
            (first >= 0 ? `\n  expected: ${sc[first]}\n  found:    ${tc[first] ?? "(missing)"}` : ` Found ${tc.length}, expected ${sc.length}.`));
        }
        if (JSON.stringify(s.match(MATH) ?? []) !== JSON.stringify(t.match(MATH) ?? [])) {
          problems.push(`${where} ${field}: mathematical expressions \\( … \\) and $$ … $$ must stay exactly as in English.`);
        }
      }
      if (job.step_key !== "material_gu") return;
      try {
        if (signature(source.body) !== signature(page.body)) {
          problems.push(`${where} body: the HTML structure differs from English. Keep every block (h2, h3, p, ul/ol, li, ` +
            `table, blockquote) in the same order and nesting with the same attributes, and keep the same number of ` +
            `<strong>, <em> and <mark> phrases in each paragraph, heading, list item and table cell (their order may change).`);
        }
      } catch (e) {
        problems.push(`${where} body: the HTML could not be read (${e.message}).`);
      }
    });
  }
}

if (problems.length) {
  console.log(problems.map((p) => `- ${p}`).join("\n"));
  process.exit(1);
}
console.log("PASS");
