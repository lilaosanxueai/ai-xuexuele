import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * 课程内容审校：用配置的大模型逐题审查全部课程的随堂题
 * （答案索引是否正确 / 选项是否互斥 / 解析有无知识错误 / 难度是否匹配年级）
 * 结果写 scripts/llm-audit-result.json
 */
const ROOT = fileURLToPath(new URL('../', import.meta.url));
const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/config.json'), 'utf8')).llm;
const lessons = [];
const D = path.join(ROOT, 'content/lessons');
for (const f of fs.readdirSync(D)) {
  if (!f.endsWith('.json')) continue;
  lessons.push(JSON.parse(fs.readFileSync(path.join(D, f), 'utf8')));
}

const BATCH = 6;
const batches = [];
for (let i = 0; i < lessons.length; i += BATCH) batches.push(lessons.slice(i, i + BATCH));

function lessonBlock(l) {
  const qs = (l.exercises ?? []).map((q, i) =>
    `【${l.id}#Q${i}】${l.subjectArea} ${l.grade}年级《${l.title}》\n题目：${q.q}\n选项：${q.options.map((o, j) => String.fromCharCode(65 + j) + '.' + o).join('  ')}\n当前答案：${String.fromCharCode(65 + q.answer)}\n解析：${q.explain}`
  ).join('\n\n');
  return qs;
}

const SYSTEM = `你是中小学各学科教材的资深审校编辑。用户给你一批课程的选择题（随堂练习），请逐题严格审校，只报告有问题的题：
1. 答案索引错误：当前标注的答案不是唯一正确选项（或正确的那个明显不在选项里）
2. 选项缺陷：两个选项都对 / 全都不对 / 选项明显重复或荒谬
3. 知识错误：解析与答案矛盾，或解析/题干有学科知识错误
4. 年级错配：难度或内容明显超出该年级课标（如给1年级出代数式）

判断要宽容：表述风格、比喻、简化讲解不算问题；只有知识性/结构性错误才报告。
严格输出 JSON 数组（不要任何其他文字），每个问题项：
{"id":"课程id#Q序号","type":"wrong_answer|bad_options|knowledge_error|grade_mismatch","correct_index":0-3(仅答案索引错误时给),"issue":"一句话说明问题"}
没有问题的题不要出现在数组里；整批都没问题就输出 []。`;

async function auditBatch(batch, retry = 0) {
  const body = {
    model: cfg.model,
    temperature: 0.1,
    max_tokens: 3000,
    messages: [
      { role: 'system', content: SYSTEM },
      { role: 'user', content: batch.map(lessonBlock).join('\n\n====\n\n') },
    ],
  };
  const resp = await fetch(`${cfg.baseURL.replace(/\/$/, '')}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${cfg.apiKey}` },
    body: JSON.stringify(body),
  });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}: ${(await resp.text()).slice(0, 200)}`);
  const data = await resp.json();
  const text = (data.choices?.[0]?.message?.content ?? '').trim();
  const m = text.match(/\[[\s\S]*\]/);
  if (!m) {
    if (retry < 1) return auditBatch(batch, retry + 1);
    return { parseError: true, raw: text.slice(0, 500), lessons: batch.map((l) => l.id) };
  }
  try {
    const arr = JSON.parse(m[0]);
    return { issues: arr };
  } catch {
    if (retry < 1) return auditBatch(batch, retry + 1);
    return { parseError: true, raw: m[0].slice(0, 500), lessons: batch.map((l) => l.id) };
  }
}

const CONCURRENCY = 3;
const results = [];
let done = 0;
const queue = [...batches];
async function worker() {
  while (queue.length) {
    const batch = queue.shift();
    try {
      results.push(await auditBatch(batch));
    } catch (e) {
      results.push({ error: String(e), lessons: batch.map((l) => l.id) });
    }
    done++;
    console.log(`进度 ${done}/${batches}`);
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));

const all = results.flat();
const issues = all.flatMap((r) => r.issues ?? []);
fs.writeFileSync(path.join(ROOT, 'scripts/llm-audit-result.json'), JSON.stringify(results, null, 1), 'utf-8');
console.log(`\n完成：${issues.length} 个问题，批次失败 ${all.filter((r) => r.error || r.parseError).length} 批`);
for (const iss of issues) console.log(`${iss.id} [${iss.type}] ${iss.issue}${iss.correct_index != null ? ' → 应为 ' + String.fromCharCode(65 + iss.correct_index) : ''}`);
