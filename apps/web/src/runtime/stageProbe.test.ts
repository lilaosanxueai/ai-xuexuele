import { describe, expect, it } from 'vitest';
import { fmtCoord, mapClientToView } from '../components/StageSvg.tsx';

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
