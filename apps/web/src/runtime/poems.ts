/** 古诗词默写：小学必背古诗（公有领域）+ 补字/接句两种出题 */

export interface Poem {
  id: string;
  title: string;
  author: string;
  dynasty: string;
  lines: string[];
}

export const POEMS: Poem[] = [
  { id: 'yie', title: '咏鹅', author: '骆宾王', dynasty: '唐', lines: ['鹅，鹅，鹅，', '曲项向天歌。', '白毛浮绿水，', '红掌拨清波。'] },
  { id: 'jys', title: '静夜思', author: '李白', dynasty: '唐', lines: ['床前明月光，', '疑是地上霜。', '举头望明月，', '低头思故乡。'] },
  { id: 'mn2', title: '悯农（其二）', author: '李绅', dynasty: '唐', lines: ['锄禾日当午，', '汗滴禾下土。', '谁知盘中餐，', '粒粒皆辛苦。'] },
  { id: 'cx', title: '春晓', author: '孟浩然', dynasty: '唐', lines: ['春眠不觉晓，', '处处闻啼鸟。', '夜来风雨声，', '花落知多少。'] },
  { id: 'dzgl', title: '登鹳雀楼', author: '王之涣', dynasty: '唐', lines: ['白日依山尽，', '黄河入海流。', '欲穷千里目，', '更上一层楼。'] },
  { id: 'yl', title: '咏柳', author: '贺知章', dynasty: '唐', lines: ['碧玉妆成一树高，', '万条垂下绿丝绦。', '不知细叶谁裁出，', '二月春风似剪刀。'] },
  { id: 'wlsdb', title: '望庐山瀑布', author: '李白', dynasty: '唐', lines: ['日照香炉生紫烟，', '遥看瀑布挂前川。', '飞流直下三千尺，', '疑是银河落九天。'] },
  { id: 'jj', title: '绝句', author: '杜甫', dynasty: '唐', lines: ['两个黄鹂鸣翠柳，', '一行白鹭上青天。', '窗含西岭千秋雪，', '门泊东吴万里船。'] },
  { id: 'sx', title: '山行', author: '杜牧', dynasty: '唐', lines: ['远上寒山石径斜，', '白云生处有人家。', '停车坐爱枫林晚，', '霜叶红于二月花。'] },
  { id: 'qm', title: '清明', author: '杜牧', dynasty: '唐', lines: ['清明时节雨纷纷，', '路上行人欲断魂。', '借问酒家何处有，', '牧童遥指杏花村。'] },
  { id: 'jnc', title: '江南春', author: '杜牧', dynasty: '唐', lines: ['千里莺啼绿映红，', '水村山郭酒旗风。', '南朝四百八十寺，', '多少楼台烟雨中。'] },
  { id: 'yzy', title: '游子吟', author: '孟郊', dynasty: '唐', lines: ['慈母手中线，', '游子身上衣。', '临行密密缝，', '意恐迟迟归。', '谁言寸草心，', '报得三春晖。'] },
  { id: 'jyjyr', title: '九月九日忆山东兄弟', author: '王维', dynasty: '唐', lines: ['独在异乡为异客，', '每逢佳节倍思亲。', '遥知兄弟登高处，', '遍插茱萸少一人。'] },
  { id: 'syew', title: '送元二使安西', author: '王维', dynasty: '唐', lines: ['渭城朝雨浥轻尘，', '客舍青青柳色新。', '劝君更尽一杯酒，', '西出阳关无故人。'] },
  { id: 'wtms', title: '望天门山', author: '李白', dynasty: '唐', lines: ['天门中断楚江开，', '碧水东流至此回。', '两岸青山相对出，', '孤帆一片日边来。'] },
  { id: 'hhlsm', title: '黄鹤楼送孟浩然之广陵', author: '李白', dynasty: '唐', lines: ['故人西辞黄鹤楼，', '烟花三月下扬州。', '孤帆远影碧空尽，', '唯见长江天际流。'] },
  { id: 'cs', title: '出塞', author: '王昌龄', dynasty: '唐', lines: ['秦时明月汉时关，', '万里长征人未还。', '但使龙城飞将在，', '不教胡马度阴山。'] },
  { id: 'lzc', title: '凉州词', author: '王翰', dynasty: '唐', lines: ['葡萄美酒夜光杯，', '欲饮琵琶马上催。', '醉卧沙场君莫笑，', '古来征战几人回。'] },
  { id: 'zs', title: '竹石', author: '郑燮', dynasty: '清', lines: ['咬定青山不放松，', '立根原在破岩中。', '千磨万击还坚劲，', '任尔东西南北风。'] },
  { id: 'shy', title: '石灰吟', author: '于谦', dynasty: '明', lines: ['千锤万凿出深山，', '烈火焚烧若等闲。', '粉骨碎身浑不怕，', '要留清白在人间。'] },
  { id: 'xc', title: '小池', author: '杨万里', dynasty: '宋', lines: ['泉眼无声惜细流，', '树阴照水爱晴柔。', '小荷才露尖尖角，', '早有蜻蜓立上头。'] },
  { id: 'cj', title: '村居', author: '高鼎', dynasty: '清', lines: ['草长莺飞二月天，', '拂堤杨柳醉春烟。', '儿童散学归来早，', '忙趁东风放纸鸢。'] },
];

const PUNCT = '，。？！、；：""\'\'《》＿ ';

/** 默写判定的归一化：去标点、空格 */
export function normalizePoem(s: string): string {
  return [...s].filter((ch) => !PUNCT.includes(ch)).join('');
}

/** 判分：忽略标点后逐字比对 */
export function checkPoem(input: string, answer: string): boolean {
  return normalizePoem(input) === normalizePoem(answer);
}

/**
 * 补字题：在一句诗里随机遮掉 n 个连续的非标点字。
 * 返回带 ＿ 的展示句和被遮掉的答案。
 */
export function blankLine(line: string, n = 2): { display: string; answer: string } {
  const chars = [...line];
  const validIdx = chars.map((ch, i) => (PUNCT.includes(ch) ? -1 : i)).filter((i) => i >= 0);
  const maxK = Math.max(0, validIdx.length - n);
  const k = Math.floor(Math.random() * (maxK + 1));
  const blanked = new Set(validIdx.slice(k, k + n));
  const display = chars.map((ch, i) => (blanked.has(i) ? '＿' : ch)).join('');
  return { display, answer: chars.filter((_, i) => blanked.has(i)).join('') };
}

export type PoemMode = 'fill' | 'next';

export interface PoemQuestion {
  poem: Poem;
  /** 考的行下标（fill=该行本身，next=要默写的下一句） */
  lineIdx: number;
  /** 题面：fill=带＿的诗句，next=上一句 */
  prompt: string;
  /** 正确答案（归一化比对） */
  answer: string;
  /** TTS 朗读内容：整句诗 */
  speakText: string;
  mode: PoemMode;
}

/** 从一首诗出一道题；next 模式只在有下一句的行出题 */
export function questionFrom(poem: Poem, mode: PoemMode): PoemQuestion {
  if (mode === 'fill') {
    const lineIdx = Math.floor(Math.random() * poem.lines.length);
    const { display, answer } = blankLine(poem.lines[lineIdx], 2);
    return { poem, lineIdx, prompt: display, answer, speakText: poem.lines[lineIdx], mode };
  }
  const lineIdx = Math.floor(Math.random() * (poem.lines.length - 1));
  return { poem, lineIdx, prompt: poem.lines[lineIdx], answer: poem.lines[lineIdx + 1], speakText: poem.lines[lineIdx + 1], mode };
}

/** 组卷：随机抽 count 道题（避免连续同诗） */
export function makeQuiz(count: number, mode: PoemMode): PoemQuestion[] {
  const out: PoemQuestion[] = [];
  let lastId = '';
  for (let i = 0; i < count; i++) {
    let poem = POEMS[Math.floor(Math.random() * POEMS.length)];
    let guard = 0;
    while (poem.id === lastId && guard < 5) { poem = POEMS[Math.floor(Math.random() * POEMS.length)]; guard++; }
    lastId = poem.id;
    out.push(questionFrom(poem, mode));
  }
  return out;
}
