const h = await fetch('http://127.0.0.1:8787/').then((r) => r.text());
const js = [...h.matchAll(/assets\/([^"]+\.js)/g)].map((m) => m[1]);
console.log('scripts:', js.join(', '));
for (const j of js) {
  const r = await fetch('http://127.0.0.1:8787/assets/' + j);
  console.log(j, r.status, (await r.arrayBuffer()).byteLength, 'B');
}
const css = [...h.matchAll(/assets\/([^"]+\.css)/g)].map((m) => m[1]);
for (const c of css) {
  const r = await fetch('http://127.0.0.1:8787/assets/' + c);
  console.log(c, r.status);
}
const prof = await fetch('http://127.0.0.1:8787/api/profiles');
console.log('/api/profiles', prof.status, (await prof.text()).slice(0, 200));
