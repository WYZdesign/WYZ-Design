// Copy-lint: enforces the house copy rules on customer-facing code (Codex #49).
// Rules: no en/em-dashes, no AI-tell words. Comment-only lines are ignored.
// Run: node _agent/copy_lint.mjs   (exit 1 = violations)
import fs from "node:fs";
import path from "node:path";

const ROOTS = ["src/app", "src/components", "src/lib"];
const BANNED = [
  "leverage", "seamless", "delve", "elevate", "unlock", "curate", "empower",
  "moreover", "furthermore", "in today\u2019s fast-paced", "in today's fast-paced",
  "passionate about", "take it to the next level",
];

const isComment = (l) => {
  const t = l.trim();
  return t.startsWith("//") || t.startsWith("*") || t.startsWith("/*") || t.startsWith("{/*");
};

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(tsx|ts)$/.test(e.name) && !p.includes(path.sep + "api" + path.sep)) out.push(p);
  }
  return out;
}

const violations = [];
for (const root of ROOTS) {
  for (const f of walk(root)) {
    const lines = fs.readFileSync(f, "utf8").split("\n");
    lines.forEach((l, i) => {
      if (isComment(l)) return;
      if (/[\u2013\u2014]/.test(l)) violations.push(`${f}:${i + 1}: en/em-dash`);
      const low = l.toLowerCase();
      for (const b of BANNED) {
        if (low.includes(b)) { violations.push(`${f}:${i + 1}: banned phrase "${b}"`); break; }
      }
    });
  }
}

if (violations.length) {
  console.error(`copy-lint: ${violations.length} issue(s)`);
  violations.slice(0, 80).forEach((v) => console.error("  " + v));
  process.exit(1);
}
console.log("copy-lint: clean");
