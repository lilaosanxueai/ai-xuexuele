import type { LlmConfig } from './config.ts';

/** OpenAI 兼容接口的流式客户端：逐段 yield 文本增量；未配置 key 时走 mock 降级 */

export interface LlmMessage { role: 'system' | 'user' | 'assistant'; content: string }

const MOCK_REPLIES = [
  '（我是离线替身 🤖 还没接上真正的大模型——请爸爸妈妈在 data/config.json 里填上 apiKey，我马上变得超级聪明！）',
  '先偷偷告诉你：等接上大脑之后，我可以陪你头脑风暴、讲解积木、给你只差一步的提示～现在你先拖几块积木试试？',
];

/** 离线替身的话题小词典：按关键词给出有引导价值的本地回复（接上真模型后不再使用） */
const MOCK_TOPICS: [RegExp, string][] = [
  [/卡住|不会|怎么办|提示|不懂|教我/, '（离线替身）先别急！看看左侧任务卡的 💡 要提示，把提示念出来，再对照程序一步一步试——试错本来就是编程的一部分，你已经在变强了 💪'],
  [/物理|力|光|电|浮力|压强|惯性|运动/, '（离线替身）物理主题课的秘诀：按 ▶ 把程序跑一遍，盯住角色报出的每一个数字——规律就藏在数字的变化里！改一个参数再跑，对比两次结果 📊'],
  [/化学|元素|反应|酸|碱|金属|分子/, '（离线替身）化学观察法：程序每一行都在模拟一个变化——先跑一遍看结果，再改一个数字重跑，像做对照实验一样找规律 🧪'],
  [/数学|函数|方程|几何|数|面积|概率/, '（离线替身）数学课的关键：让程序替你算！把不同的数代进去，看输出的变化——猜想、验证、再猜，这就是数学家的思考方式 🔢'],
  [/语文|诗|成语|作文|字/, '（离线替身）语文创作课的思路：先把故事想清楚（谁、在哪里、做什么），再用「说」的积木把台词一句句排好顺序——顺序对了，故事就通了 📖'],
  [/英语|English|单词|word/, '（离线替身）英语课大声读出来！跟着程序念、跟着造型记——实物和单词配对，记得最牢 🔤'],
  [/音乐|节奏|音|拍|旋律/, '（离线替身）音乐课用耳朵学：播放音效后闭眼听，感受强弱和快慢——节奏就是「重复 + 等待」的魔法 🎵'],
  [/AI|人工智能|训练|识别|摄像头/, '（离线替身）AI 课的两步走：先去 🧠 AI 实验室教它（多拍不同角度的照片），再回来用「当 AI 认出」积木触发动作——教得越好，它认得越准 🧠'],
  [/画|画笔|线|图案/, '（离线替身）画笔三兄弟：落笔（开始画）、移动（走线）、抬笔（停止）。想画对称的图案？左边走几步，右边镜像走同样几步 🎨'],
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
