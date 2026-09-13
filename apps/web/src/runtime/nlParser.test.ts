import { describe, expect, it } from 'vitest';
import { parseChineseBuild } from './nlParser.ts';
import { sanitizeOps } from './builder.ts';
import { buildCatalog } from './builder.ts';
import { ALL_BLOCK_TYPES } from '../blocks/definitions.ts';

describe('parseChineseBuild 中文口述 → 代搭指令', () => {
  it('顺序语句：说你好，移动100（自动补当开始）', () => {
    const ops = parseChineseBuild('说你好，移动100');
    expect(ops).toEqual([
      { op: 'add', type: 'island_when_run' },
      { op: 'add', type: 'island_say', fields: { TEXT: '你好' } },
      { op: 'add', type: 'island_move', fields: { STEPS: '100' } },
    ]);
  });

  it('重复嵌套：重复4次{右转90，移动80}', () => {
    const ops = parseChineseBuild('帮我搭：重复4次{右转90，移动80}');
    expect(ops).toEqual([
      { op: 'add', type: 'island_when_run' },
      { op: 'add', type: 'island_repeat', fields: { TIMES: '4' }, branch: 'STACK', children: [
        { op: 'add', type: 'island_turn_right', fields: { DEG: '90' } },
        { op: 'add', type: 'island_move', fields: { STEPS: '80' } },
      ] },
    ]);
  });

  it('清空画布 → 单条 clear', () => {
    expect(parseChineseBuild('清空画布')).toEqual([{ op: 'clear' }]);
  });

  it('带前缀 + 清空 + 后续语句的完整组合（回归：前缀曾导致 clear 丢失）', () => {
    const ops = parseChineseBuild('帮我搭：清空画布，说锄禾日当午，重复4次{右转25，等待0.3}');
    expect(ops?.[0]).toEqual({ op: 'clear' });
    expect(ops?.[1]).toEqual({ op: 'add', type: 'island_when_run' });
    const repeat = ops?.find((o) => o.type === 'island_repeat');
    expect(repeat?.children).toEqual([
      { op: 'add', type: 'island_turn_right', fields: { DEG: '25' } },
      { op: 'add', type: 'island_wait', fields: { SECS: '0.3' } },
    ]);
  });

  it('说X停N秒 → say_for', () => {
    const ops = parseChineseBuild('说你好停2秒');
    expect(ops?.[1]).toEqual({ op: 'add', type: 'island_say_for', fields: { TEXT: '你好', SECS: '2' } });
  });

  it('移到坐标 / 等待 / 落笔 / 换颜色', () => {
    const ops = parseChineseBuild('移到 x:120 y:0，落笔，等待0.5秒，换成红色');
    expect(ops).toEqual([
      { op: 'add', type: 'island_when_run' },
      { op: 'add', type: 'island_goto', fields: { X: '120', Y: '0' } },
      { op: 'add', type: 'island_pen_down' },
      { op: 'add', type: 'island_wait', fields: { SECS: '0.5' } },
      { op: 'add', type: 'island_pen_color', fields: { COLOR: 'red' } },
    ]);
  });

  it('变成emoji造型', () => {
    const ops = parseChineseBuild('变成🚀');
    expect(ops?.[1]).toEqual({ op: 'add', type: 'island_costume', fields: { COSTUME: '🚀' } });
  });

  it('完全听不懂 → null', () => {
    expect(parseChineseBuild('今天天气怎么样')).toBeNull();
  });

  it('删掉最后一块 → remove last', () => {
    expect(parseChineseBuild('删掉最后一块')).toEqual([{ op: 'remove', scope: 'last' }]);
  });

  it('删掉移动 → remove 该类型全部', () => {
    expect(parseChineseBuild('帮我删掉移动')).toEqual([{ op: 'remove', type: 'island_move', scope: 'all' }]);
  });

  it('把移动100改成200 → 删旧 + 搭新（无自动 hat，因为返回含 remove 开头）', () => {
    const ops = parseChineseBuild('把移动100改成200');
    expect(ops?.[0]).toEqual({ op: 'remove', type: 'island_move', scope: 'all' });
    expect(ops?.[1]).toEqual({ op: 'add', type: 'island_move', fields: { STEPS: '200' } });
  });

  it('「然后」当分隔符：说你好然后移动50', () => {
    const ops = parseChineseBuild('说你好然后移动50');
    expect(ops).toEqual([
      { op: 'add', type: 'island_when_run' },
      { op: 'add', type: 'island_say', fields: { TEXT: '你好' } },
      { op: 'add', type: 'island_move', fields: { STEPS: '50' } },
    ]);
  });
});

describe('sanitizeOps 指令清洗（白名单防注入）', () => {
  const catalog = buildCatalog(ALL_BLOCK_TYPES);

  it('目录包含全部积木且画笔字段正确', () => {
    const pen = catalog.find((c) => c.type === 'island_pen_color');
    expect(pen?.fields[0]).toMatchObject({ name: 'COLOR', kind: 'dropdown', options: ['blue', 'red', 'green', 'orange'] });
    expect(catalog.find((c) => c.type === 'island_repeat')?.container).toBe(true);
    expect(catalog.find((c) => c.type === 'island_when_run')?.hat).toBe(true);
  });

  it('白名单外的积木被丢弃', () => {
    const ops = sanitizeOps([
      { op: 'add', type: 'island_move', fields: { STEPS: '50' } },
      { op: 'add', type: 'evil_block' },
      { op: 'add', type: 'console.log("x")' },
    ], catalog);
    expect(ops).toEqual([{ op: 'add', type: 'island_move', fields: { STEPS: '50' } }]);
  });

  it('下拉字段非法值被丢弃、数值被限幅、文本被截断', () => {
    const ops = sanitizeOps([
      { op: 'add', type: 'island_pen_color', fields: { COLOR: 'purple' } },
      { op: 'add', type: 'island_turn_right', fields: { DEG: '99999' } },
      { op: 'add', type: 'island_say', fields: { TEXT: 'a'.repeat(100) } },
    ], catalog);
    expect(ops[0].fields).toBeUndefined();
    expect(ops[1].fields?.DEG).toBe('999');
    expect(ops[2].fields?.TEXT?.length).toBe(40);
  });

  it('children 深度超限被剪掉', () => {
    const deep = { op: 'add', type: 'island_repeat', fields: { TIMES: '2' }, children: [] as unknown[] };
    let node = deep;
    for (let i = 0; i < 8; i++) {
      node.children = [{ op: 'add', type: 'island_repeat', fields: { TIMES: '2' }, children: [] }];
      node = node.children[0] as typeof deep;
    }
    const ops = sanitizeOps([deep], catalog);
    expect(JSON.stringify(ops).length).toBeLessThan(JSON.stringify([deep]).length);
    expect(ops.length).toBe(1);
  });
});
