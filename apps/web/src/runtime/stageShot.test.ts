import { describe, expect, it } from 'vitest';
import { buildShotName } from './stageShot.ts';

describe('buildShotName 实验截图文件名', () => {
  const now = new Date('2026-10-05T14:03:00');

  it('替换非法字符为连字符并带时间戳', () => {
    expect(buildShotName('匀变速直线运动', now)).toBe('实验-匀变速直线运动-20261005-1403.png');
  });

  it('斜杠冒号等全部清理，连续分隔符合一', () => {
    expect(buildShotName('a/b:c*d?e', now)).toBe('实验-a-b-c-d-e-20261005-1403.png');
  });

  it('超长课题截断到 30 字符，空课题有兜底名', () => {
    expect(buildShotName('很长的课题'.repeat(20), now).length).toBeLessThanOrEqual('实验--20261005-1403.png'.length + 30);
    expect(buildShotName('   ', now)).toMatch(/^实验-演示-20261005-1403\.png$/);
  });
});
