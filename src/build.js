// Builds dist/index.html for Relationship Rapid Fire
const fs = require("fs");
const { CATS, Q, ORDER, PAIRS, RULES } = require("./data.js");
const L = "abcde", dims = s => Object.fromEntries(s.split(",").filter(Boolean).map(p => { const [k, v] = p.split(":"); return [k, Number(v)]; }));
const questions = [], k = {}, problems = [];
for (const id of ORDER) {
  const [text, opts] = Q[id];
  if (opts.length < 4 || opts.length > 5) problems.push(id + " options " + opts.length);
  questions.push({ id, cat: id[0], text, opts: opts.map((o, i) => ({ id: id + "-" + L[i], text: o[0] })) });
  k[id] = Object.fromEntries(opts.map((o, i) => [id + "-" + L[i], [dims(o[1]), o[2] || null]]));
}
const all = new Set(Object.values(k).flatMap(o => Object.keys(o)));
RULES.forEach(r => [...r[0], ...r[1]].forEach(x => all.has(x) || problems.push("rule " + x)));
const count = {}; ORDER.forEach(id => count[id[0]] = (count[id[0]] || 0) + 1);
const KEYS = JSON.parse(fs.readFileSync(__dirname + "/admin-keys.json", "utf8"));
let t = fs.readFileSync(__dirname + "/template.html", "utf8")
  .replace("/*__CSS__*/", () => fs.readFileSync(__dirname + "/base.css", "utf8"))
  .replace("__DATA__", () => JSON.stringify({ cats: CATS, questions }))
  .replace("__KEY__", () => Buffer.from(JSON.stringify({ k, pairs: PAIRS, rules: RULES })).toString("base64"))
  .replace("__FIREBASE_DB__", () => process.env.RRF_FIREBASE_DB || "https://imucet-32224-default-rtdb.firebaseio.com")
  .replace("__ADMIN_PUBKEY__", () => KEYS.pub)
  .replace("__ADMIN_VAULT__", () => JSON.stringify(KEYS.vault));
fs.mkdirSync(__dirname + "/dist", { recursive: true });
fs.writeFileSync(__dirname + "/dist/artifact.html", t);
const full = '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n<meta name="theme-color" content="#170A12">\n' +
  t.replace("<style>", "<style>\n:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}[hidden]{display:none!important}") .replace("</style>", "</style>\n</head>\n<body>") + "\n</body>\n</html>\n";
fs.writeFileSync(__dirname + "/dist/index.html", full);
console.log("questions", questions.length, count, "problems", problems, "size", full.length);
