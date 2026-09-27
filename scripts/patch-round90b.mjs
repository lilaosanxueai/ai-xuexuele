import fs from 'node:fs';

/**
 * 第90轮B：家长端「设置」页增加「孩子档案」区块——改名字/换头像/调年级。
 * SettingsTab 增加 profileId 属性并渲染档案编辑卡。
 */
const p = 'apps/web/src/screens/ParentScreen.tsx';
let s = fs.readFileSync(p, 'utf8');

// 1) 调用处传 profileId
s = s.replace(': <SettingsTab />', ': <SettingsTab profileId={profileId} />');

// 2) SettingsTab 签名与状态
s = s.replace(
  'function SettingsTab() {\n  const [settings, setSettings] = useState<Settings | null>(null);\n  const [saved, setSaved] = useState(false);\n\n  useEffect(() => { void api.settings().then(setSettings); }, []);',
  'function SettingsTab({ profileId }: { profileId: string }) {\n  const [settings, setSettings] = useState<Settings | null>(null);\n  const [saved, setSaved] = useState(false);\n  const [profiles, setProfiles] = useState<Profile[]>([]);\n  const [savedKid, setSavedKid] = useState(false);\n\n  useEffect(() => { void api.settings().then(setSettings); }, []);\n  useEffect(() => { void api.profiles().then(setProfiles); }, []);',
);

// 3) 在「保存设置」按钮前插入孩子档案卡
const kidCard = `      <div>
        <h3 className="mb-3 font-black">🧒 孩子档案</h3>
        {(() => {
          const kid = profiles.find((x) => x.id === profileId);
          if (!kid) return <p className="text-sm text-slate-400">未找到该角色</p>;
          const setKid = (patch: { name?: string; avatar?: string; grade?: number | null }) => {
            void api.updateProfile(kid.id, patch).then(() => {
              void api.profiles().then(setProfiles);
              setSavedKid(true);
              setTimeout(() => setSavedKid(false), 2000);
            }).catch(() => {});
          };
          return (
            <div>
              <div className="flex items-center gap-2">
                <input
                  value={kid.name}
                  onChange={(e) => setProfiles(profiles.map((x) => x.id === kid.id ? { ...x, name: e.target.value } : x))}
                  onBlur={(e) => e.target.value.trim() !== kid.name && setKid({ name: e.target.value })}
                  maxLength={12}
                  className="w-32 rounded-xl border border-slate-300 px-3 py-2 font-bold"
                />
                <span className="text-2xl">{kid.avatar}</span>
                {kid.grade != null && <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-700">{kid.grade}年级</span>}
                {savedKid && <span className="text-sm text-emerald-600">已保存 ✓</span>}
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((g) => (
                  <button
                    key={g}
                    onClick={() => setKid({ grade: kid.grade === g ? null : g })}
                    className={\`h-9 w-11 rounded-xl text-sm font-bold transition \${kid.grade === g ? 'bg-amber-400 text-white shadow' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}\`}
                  >
                    {g}
                  </button>
                ))}
                <button
                  onClick={() => setKid({ grade: null })}
                  className={\`h-9 rounded-xl px-3 text-sm font-bold transition \${kid.grade == null ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}\`}
                >
                  不设年级
                </button>
              </div>
              <p className="mt-2 text-xs text-slate-400">年级用于：学科页「⭐ 我的年级」标识、首页智能推荐优先推同龄课程</p>
            </div>
          );
        })()}
      </div>

      <div className="flex items-center gap-3">
        <button onClick={() => void save()} className="rounded-xl bg-emerald-500 px-6 py-2 font-bold text-white hover:bg-emerald-600">保存设置</button>`;

s = s.replace(
  '      <div className="flex items-center gap-3">\n        <button onClick={() => void save()} className="rounded-xl bg-emerald-500 px-6 py-2 font-bold text-white hover:bg-emerald-600">保存设置</button>',
  kidCard,
);

fs.writeFileSync(p, s);
const out = fs.readFileSync(p, 'utf8');
console.log('kid card in:', out.includes('孩子档案'));
console.log('profileId prop:', out.includes('<SettingsTab profileId={profileId} />'));
console.log('Profile imported:', out.includes("type Profile") || out.includes('Profile,'));
