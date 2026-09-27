import fs from 'node:fs';

/** 第90轮B2：CRLF 兼容——SettingsTab 签名/状态 + 孩子档案卡插入 */
const p = 'apps/web/src/screens/ParentScreen.tsx';
let s = fs.readFileSync(p, 'utf8');

// 1) SettingsTab 签名与状态（CRLF 安全：用正则处理换行）
if (!s.includes('SettingsTab({ profileId }')) {
  s = s.replace(
    /function SettingsTab\(\) \{[\s\S]*?useEffect\(\(\) => \{ void api\.settings\(\)\.then\(setSettings\); \}, \[\]\);/,
    [
      'function SettingsTab({ profileId }: { profileId: string }) {',
      '  const [settings, setSettings] = useState<Settings | null>(null);',
      '  const [saved, setSaved] = useState(false);',
      '  const [profiles, setProfiles] = useState<Profile[]>([]);',
      '  const [savedKid, setSavedKid] = useState(false);',
      '',
      '  useEffect(() => { void api.settings().then(setSettings); }, []);',
      '  useEffect(() => { void api.profiles().then(setProfiles); }, []);',
    ].join('\n'),
  );
}

// 2) 在保存按钮行前插入孩子档案卡（正则定位该按钮段落）
if (!s.includes('孩子档案')) {
  const kidCard = [
    '      <div>',
    '        <h3 className="mb-3 font-black">🧒 孩子档案</h3>',
    '        {(() => {',
    '          const kid = profiles.find((x) => x.id === profileId);',
    '          if (!kid) return <p className="text-sm text-slate-400">未找到该角色</p>;',
    '          const setKid = (patch: { name?: string; avatar?: string; grade?: number | null }) => {',
    '            void api.updateProfile(kid.id, patch).then(() => {',
    '              void api.profiles().then(setProfiles);',
    '              setSavedKid(true);',
    '              setTimeout(() => setSavedKid(false), 2000);',
    '            }).catch(() => {});',
    '          };',
    '          return (',
    '            <div>',
    '              <div className="flex items-center gap-2">',
    '                <input',
    '                  value={kid.name}',
    '                  onChange={(e) => setProfiles(profiles.map((x) => x.id === kid.id ? { ...x, name: e.target.value } : x))}',
    '                  onBlur={(e) => e.target.value.trim() !== kid.name && setKid({ name: e.target.value })}',
    '                  maxLength={12}',
    '                  className="w-32 rounded-xl border border-slate-300 px-3 py-2 font-bold"',
    '                />',
    '                <span className="text-2xl">{kid.avatar}</span>',
    '                {kid.grade != null && <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-700">{kid.grade}年级</span>}',
    '                {savedKid && <span className="text-sm text-emerald-600">已保存 ✓</span>}',
    '              </div>',
    '              <div className="mt-3 flex flex-wrap gap-1.5">',
    '                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((g) => (',
    '                  <button',
    '                    key={g}',
    '                    onClick={() => setKid({ grade: kid.grade === g ? null : g })}',
    '                    className={`h-9 w-11 rounded-xl text-sm font-bold transition ${kid.grade === g ? \'bg-amber-400 text-white shadow\' : \'bg-slate-100 text-slate-500 hover:bg-slate-200\'}`}',
    '                  >',
    '                    {g}',
    '                  </button>',
    '                ))}',
    '                <button',
    '                  onClick={() => setKid({ grade: null })}',
    '                  className={`h-9 rounded-xl px-3 text-sm font-bold transition ${kid.grade == null ? \'bg-sky-500 text-white\' : \'bg-slate-100 text-slate-500 hover:bg-slate-200\'}`}',
    '                >',
    '                  不设年级',
    '                </button>',
    '              </div>',
    '              <p className="mt-2 text-xs text-slate-400">年级用于：学科页「⭐ 我的年级」标识、首页智能推荐优先推同龄课程</p>',
    '            </div>',
    '          );',
    '        })()}',
    '      </div>',
    '',
  ].join('\n');
  s = s.replace(
    /(<div className="flex items-center gap-3">\s*<button onClick=\{\(\) => void save\(\)\} className="rounded-xl bg-emerald-500)/,
    kidCard + '$1',
  );
}

fs.writeFileSync(p, s);
const out = fs.readFileSync(p, 'utf8');
console.log('signature:', out.includes('SettingsTab({ profileId }'));
console.log('kid card:', out.includes('孩子档案'));
