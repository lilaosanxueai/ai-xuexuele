import type { LlmConfig } from './config.ts';

/** OpenAI 兼容接口的流式客户端：逐段 yield 文本增量；未配置 key 时走 mock 降级 */

export interface LlmMessage { role: 'system' | 'user' | 'assistant'; content: string }

const MOCK_REPLIES = [
  '（我是离线替身 🤖 还没接上真正的大模型——请爸爸妈妈在 data/config.json 里填上 apiKey，我马上就能给你完整讲解！）',
  '（离线替身）你可以先把这一课的「学习目标」和「课本知识点」读一遍，再点「动手演示」看程序跑起来的样子——接上 apiKey 后我能逐字给你讲明白～',
];

/** 离线替身的话题小词典：按学科给出通用的学习方法建议（接上真模型后不再使用） */
const MOCK_TOPICS: [RegExp, string][] = [
  [/卡住|不会|怎么办|提示|不懂|教我/, '（离线替身）先别急！把题目再读一遍，圈出「已知什么、求什么」；然后回到左侧的学习目标，看看这道题对应哪个知识点。实在卡住就记下来，明天问老师或同学 💪'],
  [/物理|力|光|电|浮力|压强|惯性|运动/, '（离线替身）学物理的小窍门：先想清楚"过程"——谁对谁做了什么、什么变了什么没变，再套公式。可以点「动手演示」看程序模拟的过程 📊'],
  [/化学|元素|反应|酸|碱|金属|分子/, '（离线替身）学化学要抓"变化"：反应前有什么、反应后生成什么、为什么。把化学式当成记账本，两边数量一定要对上 🧪'],
  [/数学|函数|方程|几何|数|面积|概率/, '（离线替身）学数学的关键：举例子！代两个不同的数进去看结果怎么变，猜想、验证、再猜——这就是数学家的思考方式 🔢'],
  [/语文|诗|成语|作文|字/, '（离线替身）学语文多读出声：先弄清每个字词的意思，再想作者为什么这样写。作文先把"谁、在哪里、做什么、结果怎样"想清楚 📖'],
  [/英语|English|单词|word/, '（离线替身）记单词的诀窍：把单词和真实的东西配对（看到苹果想 apple），大声读出来，每天记 5 个比一天记 50 个更牢 🔤'],
  [/音乐|节奏|音|拍|旋律/, '（离线替身）学音乐用耳朵：多听、跟着拍、感受强弱和快慢——先听懂了，再学乐理就轻松了 🎵'],
  [/生物|细胞|植物|动物|遗传/, '（离线替身）学生物先抓"结构与功能"：它长什么样、靠什么活、和环境怎么交换。画一张结构图比抄十遍笔记有用 🌿'],
  [/地理|气候|地形|地球|纬度/, '（离线替身）学地理要多看图：地形图、气候图——"在哪里"决定了"是什么样"。先找位置，再想原因 🌏'],
  [/AI|人工智能|训练|识别|摄像头/, '（离线替身）理解 AI 的关键：它是从数据里学出来的。去 🧠 AI 实验室亲手教它一遍（多拍不同角度的照片），比看十篇介绍都管用 🧠'],
];

function mockReplyFor(messages: LlmMessage[]): string[] {
  // 只看用户消息：system 提示词里含有「提示/引导」等词，会污染关键词匹配
  const text = messages.filter((m) => m.role === 'user').map((m) => m.content).join(' ');
  for (const [re, reply] of MOCK_TOPICS) {
    if (re.test(text)) return [reply];
  }
  return MOCK_REPLIES;
}

export async function* streamChat(
  cfg: LlmConfig,
  messages: LlmMessage[],
  opts: { mock: boolean },
): AsyncGenerator<string> {
  if (opts.mock) {
    for (const line of mockReplyFor(messages)) {
      for (const ch of line) {
        yield ch;
        await new Promise((r) => setTimeout(r, 12));
      }
      yield '\n\n';
      await new Promise((r) => setTimeout(r, 300));
    }
    return;
  }

  const resp = await fetch(`${cfg.baseURL.replace(/\/$/, '')}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${cfg.apiKey}` },
    body: JSON.stringify({ model: cfg.model, messages, max_tokens: cfg.maxTokens, temperature: 0.7, stream: true }),
  });

  if (!resp.ok || !resp.body) {
    const detail = await resp.text().catch(() => '');
    throw new Error(`LLM 接口返回 ${resp.status}：${detail.slice(0, 300)}`);
  }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let idx: number;
    while ((idx = buffer.indexOf('\n')) >= 0) {
      const line = buffer.slice(0, idx).trim();
      buffer = buffer.slice(idx + 1);
      if (!line.startsWith('data:')) continue;
      const payload = line.slice(5).trim();
      if (payload === '[DONE]') return;
      try {
        const delta = JSON.parse(payload)?.choices?.[0]?.delta?.content;
        if (typeof delta === 'string' && delta) yield delta;
      } catch { /* 忽略半包 */ }
    }
  }
}

/** 非流式一次性补全（AI 代搭转指令用：需要完整 JSON，不适合逐段流式） */
export async function completeChat(cfg: LlmConfig, messages: LlmMessage[], opts: { mock: boolean }): Promise<string> {
  if (opts.mock) return '';
  const resp = await fetch(`${cfg.baseURL.replace(/\/$/, '')}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${cfg.apiKey}` },
    body: JSON.stringify({
      model: cfg.model, messages, max_tokens: Math.min(1200, cfg.maxTokens), temperature: 0.2, stream: false,
    }),
  });
  if (!resp.ok) {
    const detail = await resp.text().catch(() => '');
    throw new Error(`LLM 接口返回 ${resp.status}：${detail.slice(0, 300)}`);
  }
  const data = (await resp.json()) as { choices?: { message?: { content?: string } }[] };
  return data.choices?.[0]?.message?.content ?? '';
}
