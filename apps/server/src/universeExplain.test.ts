import { describe, expect, it } from 'vitest';
import { offlineUniverseExplain, type UniverseExplainPayload } from './universeExplain.ts';

const base: UniverseExplainPayload = {
  subject: '物理', module: '波', count: 6, done: 2,
  accuracy: 55,
  links: [
    { subject: '音乐', module: '声学', shared: ['波的传播'] },
    { subject: '数学', module: '三角函数', shared: ['波形'] },
  ],
  next: ['波长与频率', '波的图像'],
};

describe('offlineUniverseExplain 星空讲解员模板', () => {
  it('包含模块/点亮数/跨科连线/先学建议', () => {
    const c = offlineUniverseExplain(base);
    expect(c).toContain('「波」');
    expect(c).toContain('物理');
    expect(c).toContain('6 节课');
    expect(c).toContain('点亮了 2 节');
    expect(c).toContain('正确率 55%');
    expect(c).toContain('音乐「声学」');
    expect(c).toContain('《波长与频率》');
  });

  it('零进度且无连线时不提点亮与跨科', () => {
    const c = offlineUniverseExplain({ ...base, done: 0, accuracy: null, links: [], next: ['波是什么'] });
    expect(c).toContain('还没有开始点亮');
    expect(c).not.toContain('正确率');
    expect(c).not.toContain('共享同一片知识');
    expect(c).toContain('《波是什么》');
  });

  it('kind=route：航线模板串学科名+报进度', () => {
    const c = offlineUniverseExplain({
      ...base, kind: 'route', module: '生活中的',
      links: [
        { subject: '科学', module: '磁铁', shared: [] },
        { subject: '物理', module: '流体压强', shared: [] },
        { subject: '音乐', module: '音乐的功能', shared: [] },
      ],
      done: 1,
    });
    expect(c).toContain('「生活中的」航线串起了 3 个学科');
    expect(c).toContain('科学→物理→音乐');
    expect(c).toContain('同一件事');
    expect(c).toContain('已经走过 1/3 站');
  });
});
