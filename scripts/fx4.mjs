import fs from 'node:fs';
const R = {
  'lab-04': [
    ['write("切菜：指头弯成"猫爪"关节抵刀面", -60, -135, "#7c3aed", 11)', 'write("切菜：指头弯成猫爪状关节抵刀面", -60, -135, "#7c3aed", 11)'],
  ],
  'mus-04': [
    ['write("不协和：二、七度 → 紧张（需要"解决"）", -70, -120, "#ea580c", 11)', 'write("不协和：二度七度紧张需要解决", -70, -120, "#ea580c", 11)'],
  ],
  'mus-05': [
    ['write("读法：四分读"嗒"，八分读"提-嗒"", -90, -100, "#0369a1", 11)', 'write("读法：四分读嗒，八分读提嗒", -90, -100, "#0369a1", 11)'],
  ],
};
for (const [id, pairs] of Object.entries(R)) {
  const p = `content/lessons/${id}.json`;
  const j = JSON.parse(fs.readFileSync(p, 'utf8'));
  let c = j.lab.code;
  for (const [from, to] of pairs) c = c.replace(from, to);
  j.lab.code = c;
  j.starterCode = c;
  fs.writeFileSync(p, JSON.stringify(j, null, 2) + '\n');
  console.log(`fixed ${id}`);
}
