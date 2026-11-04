// Builds index.html (GitHub/Cloudflare Pages) and artifact.html from template.html + data.js
const fs = require("fs");
const { Q, ORDER, PAIRS, RULES, IX, IX_ORDER } = require("./data.js");

const parseDims = s => Object.fromEntries(s.split(",").filter(Boolean).map(p => { const [k, v] = p.split(":"); return [k, Number(v)]; }));
const L = "abcdef";
const questions = [], k = {}, ixq = [], ik = {};
const problems = [];

for (const id of ORDER) {
  const [text, opts] = Q[id];
  if (opts.length < 5 || opts.length > 6) problems.push(id + " has " + opts.length + " options");
  questions.push({ id, text, opts: opts.map((o, i) => ({ id: id + "-" + L[i], text: o[0] })) });
  k[id] = Object.fromEntries(opts.map((o, i) => [id + "-" + L[i], [parseDims(o[1]), o[2], o[3] || null]]));
}
for (const id of IX_ORDER) {
  const [text, opts] = IX[id];
  if (opts.length < 5 || opts.length > 6) problems.push(id + " has " + opts.length + " options");
  ixq.push({ id, text, opts: opts.map((o, i) => ({ id: id + "-" + L[i], text: o[0] })) });
  ik[id] = Object.fromEntries(opts.map((o, i) => [id + "-" + L[i], [parseDims(o[1]), null, o[2] || null]]));
}
// merged order: an intimacy question after every ~4 main ones, starting after the 8th
const merged = questions.slice();
[8,13,18,23,28,32,35,38].forEach((pos, i) => merged.splice(pos, 0, ixq[i]));
if (questions.length !== 30) problems.push("expected 30 questions, got " + questions.length);
const cats = {}; ORDER.forEach(id => cats[id[0]] = (cats[id[0]] || 0) + 1);
// coverage per dimension
const cov = {};
for (const q in k) { const ds = new Set(); Object.values(k[q]).forEach(o => Object.keys(o[0]).forEach(d => ds.add(d))); ds.forEach(d => cov[d] = (cov[d] || 0) + 1); }
// rule/pair ids exist
const allOpts = new Set(Object.values(k).flatMap(o => Object.keys(o)));
RULES.forEach(r => [...r[0], ...r[1]].forEach(x => { if (!allOpts.has(x)) problems.push("rule refers to missing " + x); }));
PAIRS.forEach(p => { if (!k[p[0]] || !k[p[1]]) problems.push("pair missing " + p); });

const keypack = Buffer.from(JSON.stringify({ k, ik, pairs: PAIRS, rules: RULES }), "utf8").toString("base64");
function fnv(str){let h=0x811c9dc5;for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,0x01000193)>>>0}return h.toString(16).padStart(8,"0")}
const code = process.env.HDP_ADMIN || "HDP-ADMIN-2026";
const adminHash = fnv("hdp::" + code) + fnv(code + "::hdp");

const KEYS = JSON.parse(fs.readFileSync(__dirname + "/keys/admin-keys.json", "utf8"));
let t = fs.readFileSync(__dirname + "/template2.html", "utf8");
t = t.replace("/*__ANALYSIS__*/", () => fs.readFileSync(__dirname + "/analysis_block.js", "utf8"));
t = t.replace("__QUESTIONS__", () => JSON.stringify(merged))
     .replace("__FIREBASE_DB__", () => (process.env.HDP_FIREBASE_DB || "https://imucet-32224-default-rtdb.firebaseio.com"))
     .replace("__ADMIN_PUBKEY__", () => KEYS.pub)
     .replace("__ADMIN_VAULT__", () => JSON.stringify(KEYS.vault))
     .replace("__KEY__", () => keypack)
     ;
fs.mkdirSync(__dirname + "/dist", { recursive: true });
fs.writeFileSync(__dirname + "/dist/artifact.html", t);
const full = '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n<meta name="theme-color" content="#0A0F1F">\n' +
  t.replace(/<style>/, "<style>\n:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}[hidden]{display:none!important}img{max-width:100%}") .replace(/(<\/style>)/, "$1\n</head>\n<body>") + "\n</body>\n</html>\n";
fs.writeFileSync(__dirname + "/dist/index.html", full);
console.log("order", merged.map(q=>q.id).join(" "), "\ncategories", cats, "\ncoverage", cov, "\nproblems", problems, "\nsize", full.length);
