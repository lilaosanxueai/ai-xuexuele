import fs from 'node:fs';

/**
 * 第90轮：孩子年级可修改。
 * ① store.updateProfile：更新名字/头像/年级
 * ② routes：PATCH /profiles/:id
 * ③ web api.updateProfile
 */
const storeP = 'apps/server/src/store.ts';
let store = fs.readFileSync(storeP, 'utf8');
if (!store.includes('export function updateProfile')) {
  const anchor = 'export function deleteProfile(id: string): void {';
  const fn = [
    'export function updateProfile(id: string, patch: { name?: string; avatar?: string; grade?: number | null }): Profile {',
    '  if (!validId(id)) throw new Error(\'非法 profileId\');',
    '  const profiles = listProfiles();',
    '  const p = profiles.find((x) => x.id === id);',
    '  if (!p) throw new Error(\'角色不存在\');',
    '  if (typeof patch.name === \'string\' && patch.name.trim()) p.name = patch.name.trim().slice(0, 12);',
    '  if (typeof patch.avatar === \'string\' && patch.avatar) p.avatar = patch.avatar;',
    '  if (patch.grade === null) delete p.grade;',
    '  else if (typeof patch.grade === \'number\' && Number.isInteger(patch.grade) && patch.grade >= 1 && patch.grade <= 12) p.grade = patch.grade;',
    '  writeJson(profilesFile, profiles);',
    '  return p;',
    '}',
    '',
  ].join('\n');
  store = store.replace(anchor, fn + anchor);
  fs.writeFileSync(storeP, store);
}
console.log('store.updateProfile:', fs.readFileSync(storeP, 'utf8').includes('updateProfile'));

const routesP = 'apps/server/src/routes.ts';
let routes = fs.readFileSync(routesP, 'utf8');
if (!routes.includes("r.patch('/profiles/:id'")) {
  const anchor = "r.delete('/profiles/:id', (req, res) => {";
  const route = [
    "  r.patch('/profiles/:id', (req, res) => {",
    "    try {",
    "      res.json(store.updateProfile(req.params.id, req.body ?? {}));",
    "    } catch (e) {",
    "      res.status(400).json({ error: (e as Error).message });",
    "    }",
    "  });",
    '',
  ].join('\n');
  routes = routes.replace(anchor, route + anchor);
  fs.writeFileSync(routesP, routes);
}
console.log('routes.PATCH:', fs.readFileSync(routesP, 'utf8').includes("/profiles/:id'"));

const apiP = 'apps/web/src/api.ts';
let api = fs.readFileSync(apiP, 'utf8');
if (!api.includes('updateProfile')) {
  const anchor = "  deleteProfile: (id: string) =>";
  const line = "  updateProfile: (id: string, patch: { name?: string; avatar?: string; grade?: number | null }) =>\n    req<Profile>(`/api/profiles/${id}`, { method: 'PATCH', body: JSON.stringify(patch) }),\n";
  api = api.replace(anchor, line + anchor);
  fs.writeFileSync(apiP, api);
}
console.log('api.updateProfile:', fs.readFileSync(apiP, 'utf8').includes('updateProfile'));
