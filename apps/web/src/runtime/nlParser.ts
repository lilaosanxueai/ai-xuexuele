import type { BuildOp } from '@shared/types.ts';

/**
 * 本地中文口述解析（离线降级）：把「帮我搭：说你好，重复4次{右转90，移动80}」
 * 转成代搭指令。规则式、零成本；大模型可用时优先走 /api/build。
 */

const NUM = '(-?\\d+(?:\\.\\d+)?)';
const COSTUME_MAP: Record<string, string> = {
  机器人: '🤖', 小猫: '🐱', 火箭: '🚀', 狐狸: '🦊', 星星: '⭐', 蛋糕: '🎂', 篮球: '🏀',
  熊猫: '🐼', 灯笼: '🏮', 龙: '🐉', 太阳: '⭐', 农民: '🐼', 稻草人: '🦊',
};
const PEN_COLOR: Record<string, string> = { 蓝: 'blue', 红: 'red', 绿: 'green', 橙: 'orange' };
const SOUND_MAP: Record<string, string> = { 叮咚: 'ding', 欢呼: 'cheer', 喵: 'meow', 砰: 'pop', 掌声: 'cheer' };

/** 解析一条顶层/子级语句片段为单个积木指令；识别不出返回 null */
function parseOne(seg: string): BuildOp | null {
  const s = seg.trim();
  if (!s) return null;

  let m = s.match(new RegExp(`说(.{1,30}?)停${NUM}秒`));
  if (m) return { op: 'add', type: 'island_say_for', fields: { TEXT: m[1], SECS: m[2] } };
  m = s.match(/(?:说|说一句|喊)\s*["“']?(.{1,30}?)["”']?$/);
  if (m && m[1].trim()) return { op: 'add', type: 'island_say', fields: { TEXT: m[1].trim() } };
  m = s.match(new RegExp(`(?:移动|前进|走)${NUM}(?:步)?`));
  if (m) return { op: 'add', type: 'island_move', fields: { STEPS: m[1] } };
  m = s.match(new RegExp(`右转${NUM}(?:度)?`));
  if (m) return { op: 'add', type: 'island_turn_right', fields: { DEG: m[1] } };
  m = s.match(new RegExp(`左转${NUM}(?:度)?`));
  if (m) return { op: 'add', type: 'island_turn_left', fields: { DEG: m[1] } };
  m = s.match(new RegExp(`移到[^\\d-]*${NUM}\\s*[,，]?\\s*[yY]?[：:]?\\s*${NUM}`));
  if (m) return { op: 'add', type: 'island_goto', fields: { X: m[1], Y: m[2] } };
  m = s.match(new RegExp(`等待${NUM}秒?`));
  if (m) return { op: 'add', type: 'island_wait', fields: { SECS: m[1] } };
  if (/碰到边缘就反弹|边缘反弹/.test(s)) return { op: 'add', type: 'island_bounce' };
  if (/落笔|开始画/.test(s)) return { op: 'add', type: 'island_pen_down' };
  if (/抬笔|停止画/.test(s)) return { op: 'add', type: 'island_pen_up' };
  m = s.match(new RegExp(`(?:换|用|笔).{0,3}?([蓝红绿橙])(?:色|的颜色|笔)`));
  if (m) return { op: 'add', type: 'island_pen_color', fields: { COLOR: PEN_COLOR[m[1]] } };
  m = s.match(/(?:变成|换个?(?:样子|造型)为?)\s*(\S{1,6})/);
  if (m) {
    const emoji = m[1].match(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u)?.[0];
    const costume = emoji ?? COSTUME_MAP[m[1]] ?? (/^[🤖🐱🚀🦊⭐🎂🏀🐼🏮🐉]$/.test(m[1]) ? m[1] : null);
    if (costume) return { op: 'add', type: 'island_costume', fields: { COSTUME: costume } };
  }
  m = s.match(/播放(?:声音)?(叮咚|欢呼|喵|砰|掌声)/);
  if (m) return { op: 'add', type: 'island_play', fields: { SOUND: SOUND_MAP[m[1]] } };
  if (/^(显示|出现)$/.test(s)) return { op: 'add', type: 'island_show' };
  if (/^(隐藏|消失)$/.test(s)) return { op: 'add', type: 'island_hide' };
  m = s.match(new RegExp(`(?:变大|放大)${NUM}`));
  if (m) return { op: 'add', type: 'island_change_size', fields: { NUM: m[1] } };
  m = s.match(new RegExp(`(?:变小|缩小)${NUM}`));
  if (m) return { op: 'add', type: 'island_change_size', fields: { NUM: String(-Math.abs(Number(m[1]))) } };
  return null;
}

/** 解析一段逗号/顿号分隔的语句列表（不含重复容器） */
function parseList(body: string): BuildOp[] {
  return body
    .split(/[，,、;；]/)
    .map(parseOne)
    .filter((x): x is BuildOp => x !== null);
}

/** 解析可能含「重复N次{…} / 一直重复{…}」嵌套的语句串 */
function parseNested(body: string): BuildOp[] {
  const repeat = body.match(new RegExp(`重复${NUM}次?\\s*[：:]?\\s*[{（(]([^{}）)]*)[}）)]`));
  if (repeat) {
    const before = body.slice(0, repeat.index);
    const after = body.slice((repeat.index ?? 0) + repeat[0].length);
    return [
      ...parseList(before),
      { op: 'add', type: 'island_repeat', fields: { TIMES: repeat[1] }, branch: 'STACK', children: parseList(repeat[2]) },
      ...parseNested(after),
    ];
  }
  const forever = body.match(/(?:一直重复|永远重复)\s*[：:]?\s*[{（(]([^{}）)]*)[}）)]/);
  if (forever) {
    const before = body.slice(0, forever.index);
    const after = body.slice((forever.index ?? 0) + forever[0].length);
    return [
      ...parseList(before),
      { op: 'add', type: 'island_forever', branch: 'STACK', children: parseList(forever[1]) },
      ...parseNested(after),
    ];
  }
  return parseList(body);
}

/**
 * 主入口：中文口述 → 代搭指令。
 * - 「清空 / 重新搭」开头 → 先 clear
 * - 「删掉最后一块 / 删掉X」→ remove
 * - 「把X改成Y」→ 删X再搭Y
 * - 自动在最前面补「当 ▶ 开始」（若孩子没说）
 * - 一个字都没解析出来 → null（提示换个说法）
 */
export function parseChineseBuild(text: string): BuildOp[] | null {
  return parseImpl(text, true);
}

function parseImpl(text: string, autoHat: boolean): BuildOp[] | null {
  const raw = text.trim();
  if (!raw) return null;
  // 「然后」当分隔符，方便孩子口述长指令
  const normalized = raw.replace(/然后/g, '，');
  const ops: BuildOp[] = [];

  // 删掉最后一块 / 删掉移动（之类的语句积木）
  let m = normalized.match(/删掉最后(一)?[块个]/);
  if (m) return [{ op: 'remove', scope: 'last' }];
  m = normalized.match(/(?:删掉|删除|去掉)(说|移动|走|右转|左转|等待|落笔|抬笔|重复|声音|音效)/);
  if (m) {
    const kind = m[1];
    const type = kind === '说' ? 'island_say'
      : kind === '移动' || kind === '走' ? 'island_move'
      : kind === '右转' ? 'island_turn_right'
      : kind === '左转' ? 'island_turn_left'
      : kind === '等待' ? 'island_wait'
      : kind === '落笔' ? 'island_pen_down'
      : kind === '抬笔' ? 'island_pen_up'
      : kind === '重复' ? 'island_repeat'
      : 'island_play';
    return [{ op: 'remove', type, scope: 'all' }];
  }
  // 把移动改成200 → 删移动 + 搭新移动（不补帽子：这是改现有程序）
  m = normalized.match(/把(移动|走|右转|左转|等待|说)(\d+(?:\.\d+)?)(步|度|秒)?改成?(\d+(?:\.\d+)?)/);
  if (m) {
    const rebuilt = normalized.replace(/把(移动|走|右转|左转|等待|说)(\d+(?:\.\d+)?)(步|度|秒)?改成?(\d+(?:\.\d+)?)/, `${m[1]}${m[4]}${m[3] ?? ''}`);
    const removed: BuildOp[] = [{
      op: 'remove',
      type: m[1] === '移动' || m[1] === '走' ? 'island_move' : m[1] === '右转' ? 'island_turn_right' : m[1] === '左转' ? 'island_turn_left' : m[1] === '等待' ? 'island_wait' : 'island_say',
      scope: 'all',
    }];
    const added = parseImpl(rebuilt, false) ?? [];
    return [...removed, ...added];
  }

  const body = normalized.replace(/^(帮我|请|给我)?(搭|拼|编)(?:一个)?[：:]?/, '').replace(/^(先)?(清空|全部删掉|删掉全部|重新搭)(画布|画板|积木)?[，,。！!]?/, (mm) => {
    if (/清空|删掉|重新搭/.test(mm)) ops.push({ op: 'clear' });
    return '';
  });

  const parsed = parseNested(body);
  const statements = parsed.filter((o) => o.op === 'add');
  if (statements.length === 0) return ops.length ? ops : null;

  const hasHat = statements.some((o) => typeof o.type === 'string' && o.type.startsWith('island_when'));
  const result: BuildOp[] = [...ops];
  if (!hasHat && autoHat) result.push({ op: 'add', type: 'island_when_run' });
  result.push(...statements);
  return result;
}
