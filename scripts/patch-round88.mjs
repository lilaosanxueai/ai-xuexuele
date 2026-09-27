import fs from 'node:fs';

/** 第88轮A：routes.ts 的 POST /profiles 接收可选 grade（1-12） */
const p = 'apps/server/src/routes.ts';
let s = fs.readFileSync(p, 'utf8');

if (!s.includes('Number.isInteger(g)')) {
  s = s.replace(
    "const { name, avatar } = req.body ?? {};",
    "const { name, avatar, grade } = req.body ?? {};",
  );
  s = s.replace(
    "res.status(201).json(store.createProfile(name, typeof avatar === 'string' ? avatar : '🧒'));",
    "const g = Number(grade);\n    res.status(201).json(store.createProfile(name, typeof avatar === 'string' ? avatar : '🧒', Number.isInteger(g) && g >= 1 && g <= 12 ? g : undefined));",
  );
  fs.writeFileSync(p, s);
}
console.log('route updated:', fs.readFileSync(p, 'utf8').includes('Number.isInteger(g)'));

// web api.createProfile 透传 grade
const ap = 'apps/web/src/api.ts';
let a = fs.readFileSync(ap, 'utf8');
if (!a.includes('grade?: number') && a.includes('createProfile')) {
  a = a.replace(
    /createProfile: \(([^)]*)\)\s*=>\s*req<Profile>\(`\/api\/profiles`, \{ method: 'POST', body: JSON\.stringify\(\{([^}]*)\}\) \}\),/,
    (m, args, body) => {
      const clean = body.trim().replace(/,$/, '');
      return 'createProfile: (' + args.replace('name: string', 'name: string').replace(/\)$/, '') + ' grade?: number) =>\n    req<Profile>(`/api/profiles`, { method: \'POST\', body: JSON.stringify({ ' + clean + ', grade }) }),';
    },
  );
  fs.writeFileSync(ap, a);
}
console.log('api updated:', fs.readFileSync(ap, 'utf8').includes('grade })'));
