import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** 第23轮内容审校修复：知识错误 + 年级错配（全部经人工逐题审校确认） */
const D = fileURLToPath(new URL('../content/lessons/', import.meta.url));

const FIX = {
  // 地震能量：震级每 +1 级能量约 ×31.6≈32（导学故事和题目原写成 ×10，与实验代码 31.6 自相矛盾）
  'cross-103': {
    story: '里氏 6 级地震比 5 级强多少？不是强一点——能量约是 32 倍！7 级更是 5 级的约 1000 倍！震级每加 1，能量约乘 32（10^1.5）。反过来问「1000 倍是几个 32 相乘？」——这就用到了对数！今天用程序数一数地震的能量阶梯，你会震撼于对数的威力。',
    exercises: [
      null, // Q1 保留
      null, // Q2 保留（log₁₀(1000)=3 纯数学题，正确）
      null,
    ],
  },
};

function fixQ(exs, idx, patch) {
  Object.assign(exs[idx], patch);
}

const byFile = {};
for (const f of fs.readdirSync(D)) {
  if (!f.endsWith('.json')) continue;
  const j = JSON.parse(fs.readFileSync(path.join(D, f), 'utf8'));
  byFile[j.id] = { file: f, j };
}

// ---- cross-103 对数：地震能量（知识错误） ----
{
  const { file, j } = byFile['cross-103'];
  j.story = FIX['cross-103'].story;
  fixQ(j.exercises, 0, {
    q: '里氏震级每增加 1 级，能量约变为？',
    options: ['2 倍', '10 倍', '32 倍', '100 倍'],
    answer: 2,
    explain: '震级每加 1 级，能量约乘 10^1.5≈31.6 倍（约 32 倍）',
  });
  fixQ(j.exercises, 2, {
    q: '7 级地震的能量约是 5 级的？',
    options: ['约 10 倍', '约 32 倍', '约 1000 倍', '约 4 倍'],
    answer: 2,
    explain: '差 2 级：31.6×31.6≈1000 倍（实验室里可以调出来验证）',
  });
  fs.writeFileSync(path.join(D, file), JSON.stringify(j, null, 2) + '\n', 'utf8');
  console.log('cross-103 地震能量已修正（×32 / ×1000）');
}

// ---- cross-05 数学：题干引用了信息科技模块名 ----
{
  const { file, j } = byFile['cross-05'];
  fixQ(j.exercises, 2, { q: '关于随机现象，正确的说法是？' });
  fs.writeFileSync(path.join(D, file), JSON.stringify(j, null, 2) + '\n', 'utf8');
  console.log('cross-05 题干模块引用已修正');
}

// ---- cross-127 声音：发声 vs 传声概念（题干与解析矛盾） ----
{
  const { file, j } = byFile['cross-127'];
  fixQ(j.exercises, 2, {
    q: '下列哪种情况我们听不到声音？',
    explain: '真空不能传声：铃铛仍在振动发声，但声音无法传到我们耳朵',
  });
  fs.writeFileSync(path.join(D, file), JSON.stringify(j, null, 2) + '\n', 'utf8');
  console.log('cross-127 发声/传声表述已修正');
}

// ---- 年级错配：三节高中课内容实为小学水平 ----
for (const [id, grade, band, textbook] of [
  ['cross-14', 3, 'primary', '人教PEP英语（三年级起点）'],
  ['cross-15', 3, 'primary', '人教PEP英语（三年级起点）'],
  ['cross-19', 3, 'primary', '统编版语文（小学）'],
]) {
  const { file, j } = byFile[id];
  j.grade = grade;
  j.gradeBand = band;
  j.textbook = textbook;
  fs.writeFileSync(path.join(D, file), JSON.stringify(j, null, 2) + '\n', 'utf8');
  console.log(`${id} 年级错配已修正 → ${grade}年级/${band}`);
}
