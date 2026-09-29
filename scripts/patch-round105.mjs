import fs from 'node:fs';

/** 第105轮：XP 服务端支持——类型字段 + mergeProgress + 路由校验 */
// 1) shared 类型
const tp = 'shared/types.ts';
let t = fs.readFileSync(tp, 'utf8');
if (!t.includes('xp?: number')) {
  // ProfileProgress 接口内加字段：找 profileId 行（ProfileProgress 特有）
  t = t.replace(
    /export interface ProfileProgress \{\s*\n(\s*)profileId: string;/,
    (m, sp) => `export interface ProfileProgress {\n${sp}profileId: string;\n${sp}/** 学习之星（XP）：随堂练发放，等级成长用 */\n${sp}xp?: number;`,
  );
  fs.writeFileSync(tp, t);
}
console.log('types xp:', fs.readFileSync(tp, 'utf8').includes('xp?: number'));

// 2) store.mergeProgress：patch 加 xpDelta，尾部累加
const sp = 'apps/server/src/store.ts';
let s = fs.readFileSync(sp, 'utf8');
if (!s.includes('xpDelta')) {
  s = s.replace(
    '    parentNotes?: ParentNote[];\n    lessonNotes?: Record<string, string>;\n  }): ProfileProgress {',
    '    parentNotes?: ParentNote[];\n    lessonNotes?: Record<string, string>;\n    /** 学习之星增量（0-200） */\n    xpDelta?: number;\n  }): ProfileProgress {',
  );
  s = s.replace(
    '  }): ProfileProgress {\n    const cur = getProgress(profileId);',
    '  }): ProfileProgress {\n    const cur = getProgress(profileId);\n    if (typeof patch.xpDelta === \'number\' && Number.isInteger(patch.xpDelta) && patch.xpDelta >= 0 && patch.xpDelta <= 200) {\n      cur.xp = (cur.xp ?? 0) + patch.xpDelta;\n    }',
  );
  fs.writeFileSync(sp, s);
}
console.log('store xpDelta:', fs.readFileSync(sp, 'utf8').includes('xpDelta'));

// 3) routes：解构 + 透传
const rp = 'apps/server/src/routes.ts';
let r = fs.readFileSync(rp, 'utf8');
if (!r.includes('xpDelta')) {
  r = r.replace(
    'const { lessonId, tasks, completed, minutesDelta, draft, code, exercise, wrongAdds, wrongClears, labNote, parentNotes, lessonNotes } = req.body ?? {};',
    'const { lessonId, tasks, completed, minutesDelta, draft, code, exercise, wrongAdds, wrongClears, labNote, parentNotes, lessonNotes, xpDelta } = req.body ?? {};',
  );
  r = r.replace(
    'store.mergeProgress(req.params.profileId, { lessonId, tasks, completed, minutesDelta, draft, code, exercise, wrongAdds, wrongClears, labNote, parentNotes, lessonNotes })',
    'store.mergeProgress(req.params.profileId, { lessonId, tasks, completed, minutesDelta, draft, code, exercise, wrongAdds, wrongClears, labNote, parentNotes, lessonNotes, xpDelta })',
  );
  fs.writeFileSync(rp, r);
}
console.log('routes xpDelta:', fs.readFileSync(rp, 'utf8').includes('xpDelta'));
