import { describe, expect, it } from 'vitest';
import { fmtCoord, mapClientToView, niceStep } from '../components/StageSvg.tsx';

describe('mapClientToView（取点读数的逆映射）', () => {
  it('等比容器：像素坐标线性映射到 viewBox', () => {
    // 容器 420×330 与 viewBox 完全同比例：无偏移，1:1
    expect(mapClientToView(0, 0, 420, 330)).toEqual({ vx: 0, vy: 0 });
    expect(mapClientToView(210, 165, 420, 330)).toEqual({ vx: 210, vy: 165 });
    expect(mapClientToView(420, 330, 420, 330)).toEqual({ vx: 420, vy: 330 });
  });

  it('更宽容器（letterbox 左右留白）：先补偏移再映射', () => {
    // 容器 840×330：宽是两倍，meet 后左右各留 210px
    expect(mapClientToView(210, 0, 840, 330)).toEqual({ vx: 0, vy: 0 });
    expect(mapClientToView(630, 165, 840, 330)).toEqual({ vx: 420, vy: 165 });
  });

  it('更高容器（上下留白）与退化输入', () => {
    // 容器 420×660：高是两倍，上下各留 165px
    expect(mapClientToView(0, 165, 420, 660)).toEqual({ vx: 0, vy: 0 });
    const bad = mapClientToView(10, 10, 0, 0);
    expect(Number.isNaN(bad.vx)).toBe(true);
  });
});

describe('fmtCoord（坐标读数格式）', () => {
  it('整数不带小数，小数保留 1 位', () => {
    expect(fmtCoord(3)).toBe('3');
    expect(fmtCoord(3.46)).toBe('3.5');
    expect(fmtCoord(-0.04)).toBe('0');
  });
  it('非有限数显示占位符', () => {
    expect(fmtCoord(NaN)).toBe('—');
  });
});

describe('niceStep（数据对齐网格的好刻度）', () => {
  it('取 1/2/5×10^k 系列里满足最小间距的第一个', () => {
    // scale=1：52px 最小间距 → 步长 100（100×1≥52，50×1<52）
    expect(niceStep(52, 1, 1)).toBe(100);
    // scale=0.5：52/0.5=104 → 200
    expect(niceStep(52, 0.5, 1)).toBe(200);
    // scale=2：52/2=26 → 50
    expect(niceStep(52, 2, 1)).toBe(50);
  });
  it('unit 模式：步长是 unit 的整数倍（数学单位刻度）', () => {
    // unit=30（一次函数课）：scale≈1 → 候选 30/60/150/300，52px 门槛 → 60
    const s = niceStep(52, 1, 30);
    expect(s % 30).toBe(0);
    expect(s).toBe(60);
    // unit=20（数轴课）：scale=0.8 → 门槛 65 舞台单位 → 100（=5 个数学单位）
    expect(niceStep(52, 0.8, 20)).toBe(100);
  });
});
