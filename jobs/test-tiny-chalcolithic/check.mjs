// Checks out/gujarati.json against inputs/english.json for a Gujarati Material translation job.
// Built-in modules only. Prints PASS, or every problem found and exits 1.
// Mirrors the Material Studio translation checks (gpsc_pipeline/content_store.py and
// translation_structure.py): same pages, same artifact IDs in the same order, the same citations
// and maths, and the same HTML structure. Bold/italic/mark phrases may change order inside one
// paragraph, heading, list item or table cell, because Gujarati word order differs.
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
const CONTAINERS = new Set(["h2", "h3", "p", "li", "th", "td"]);
const MATH = /\\\(.*?\\\)|\$\$.*?\$\$/gs;
const CITATION = /\[[^\]]+\]/g;

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
const reorderable = (node) =>
  EMPHASIS.has(node.tag) && !node.void &&
  node.children.every((c) => (typeof c === "string" ? maths(c).length === 0 : reorderable(c)));
const exact = (node) =>
  node.void ? ["void", node.tag, node.attrs]
    : ["element", node.tag, node.attrs, node.children.flatMap((c) => (typeof c === "string" ? maths(c).map((v) => ["math", v]) : [exact(c)]))];
const strict = (children) => children.flatMap((c) => (typeof c === "string" ? maths(c).map((v) => ["math", v]) : [canonical(c)]));
function container(children) {
  const out = [];
  let run = [];
  const flush = () => {
    if (run.length) out.push(["emphasis-siblings", run.map((r) => JSON.stringify(r)).sort()]);
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

const english = read("inputs/english.json");
const gujarati = read("out/gujarati.json");
if (english && gujarati) {
  if (!Array.isArray(gujarati)) problems.push("out/gujarati.json must be a JSON array of pages.");
  else {
    const want = english.map((p) => p.artifact_id);
    const got = gujarati.map((p) => p && p.artifact_id);
    if (JSON.stringify(want) !== JSON.stringify(got)) {
      problems.push(`Artifact IDs or their order differ from inputs/english.json.\n  expected: ${want.join(", ")}\n  found:    ${got.join(", ")}`);
    }
    gujarati.forEach((page, i) => {
      const source = english[i];
      const where = `Page ${i + 1} (${page?.artifact_id ?? "no artifact_id"})`;
      if (!page || typeof page !== "object") return problems.push(`${where} is not an object.`);
      const extra = Object.keys(page).filter((k) => !["artifact_id", "title", "body"].includes(k));
      if (extra.length) problems.push(`${where} has extra fields: ${extra.join(", ")}. Use only artifact_id, title, body.`);
      for (const field of ["title", "body"]) {
        if (typeof page[field] !== "string" || !page[field].trim()) problems.push(`${where}: ${field} is empty.`);
      }
      if (!source || typeof page.title !== "string" || typeof page.body !== "string") return;
      if (!/[઀-૿]/.test(page.title + page.body)) problems.push(`${where} contains no Gujarati text.`);
      for (const [field, s, t] of [["title", source.title, page.title], ["body", source.body, page.body]]) {
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
