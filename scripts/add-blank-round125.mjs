import fs from 'node:fs';
import path from 'node:path';

/**
 * 第125轮：为 20 节课各追加 1 道填空题，扩大覆盖至 ~80 课。
 * 覆盖：信息科技5·历史3·科学3·化学3·物理3·心理3
 */
const ROOT = path.resolve(import.meta.dirname, '..');
const DIR = path.join(ROOT, 'content', 'lessons');

const BLANKS = {
  'it-01': {
    q: '程序的三种基本结构：顺序、分支和 ___',
    options: ['循环', '跳转', '递归', '并行'], answer: 0,
    explain: '顺序+分支+循环是程序设计的三大基石',
    blank: { answerText: '循环', bank: ['循环', '跳转', '递归', '并行'] },
  },
  'it-03': {
    q: '变量是用来存储 ___ 的容器',
    options: ['数据', '图片', '代码', '文件'], answer: 0,
    explain: '变量=存数据的命名容器',
    blank: { answerText: '数据', bank: ['数据', '图片', '代码', '文件'] },
  },
  'it-05': {
    q: '算法是一系列解决问题的明确 ___',
    options: ['步骤', '代码', '公式', '图表'], answer: 0,
    explain: '算法=有序的解决步骤',
    blank: { answerText: '步骤', bank: ['步骤', '代码', '公式', '图表'] },
  },
  'basics-02': {
    q: '角色的移动需要使用 ___ 积木',
    options: ['移动', '说话', '等待', '旋转'], answer: 0,
    explain: 'move 积木让角色移动',
    blank: { answerText: '移动', bank: ['移动', '说话', '等待', '旋转'] },
  },
  'basics-05': {
    q: '调试程序就是找出并修复程序中的 ___',
    options: ['错误', '注释', '变量', '循环'], answer: 0,
    explain: 'debug = 找 bug 并修好',
    blank: { answerText: '错误', bank: ['错误', '注释', '变量', '循环'] },
  },
  'his-13': {
    q: '《南京条约》签订于鸦片战争结束后，标志着中国开始沦为半殖民地半 ___ 社会',
    options: ['封建', '资本', '殖民', '奴隶'], answer: 0,
    explain: '半殖民地半封建社会',
    blank: { answerText: '封建', bank: ['封建', '资本', '殖民', '奴隶'] },
  },
  'his-15': {
    q: '郑和下西洋比哥伦布发现新大陆早了 ___ 年',
    options: ['87', '50', '100', '200'], answer: 0,
    explain: '1405年 vs 1492年',
    blank: { answerText: '87', bank: ['87', '50', '100', '200'] },
  },
  'his-16': {
    q: '清朝 ___ 帝设立军机处，标志着君主专制达到顶峰',
    options: ['雍正', '康熙', '乾隆', '顺治'], answer: 0,
    explain: '雍正设立军机处',
    blank: { answerText: '雍正', bank: ['雍正', '康熙', '乾隆', '顺治'] },
  },
  'sci-11': {
    q: '一个物体的质量不随 ___ 的变化而变化',
    options: ['位置', '温度', '状态', '形状'], answer: 0,
    explain: '质量是物体的固有属性',
    blank: { answerText: '位置', bank: ['位置', '温度', '状态', '形状'] },
  },
  'sci-13': {
    q: '生态系统中的能量流动是从生产者流向 ___ 者再到分解者',
    options: ['消费', '捕食', '寄生', '竞争'], answer: 0,
    explain: '生产者→消费者→分解者',
    blank: { answerText: '消费', bank: ['消费', '捕食', '寄生', '竞争'] },
  },
  'sci-15': {
    q: '声音的三个特性：音调、响度和 ___',
    options: ['音色', '频率', '振幅', '波长'], answer: 0,
    explain: '音调+响度+音色',
    blank: { answerText: '音色', bank: ['音色', '频率', '振幅', '波长'] },
  },
  'chem-07': {
    q: '合金通常比纯金属硬度更 ___（大/小）',
    options: ['大', '小'], answer: 0,
    explain: '合金性能更优',
    blank: { answerText: '大', bank: ['大', '小'] },
  },
  'chem-09': {
    q: '面粉厂严禁烟火是因为粉尘 ___ 面大反应极快',
    options: ['接触', '表面', '体积', '质量'], answer: 0,
    explain: '接触面积大→反应速率极快→爆炸',
    blank: { answerText: '接触', bank: ['接触', '表面', '体积', '质量'] },
  },
  'chem-15': {
    q: '化学平衡是正逆反应速率相等的 ___ 平衡',
    options: ['动态', '静态', '永久', '绝对'], answer: 0,
    explain: '动态平衡：反应仍在进行但表观不变',
    blank: { answerText: '动态', bank: ['动态', '静态', '永久', '绝对'] },
  },
  'phy-07': {
    q: '凸透镜对光有 ___ 作用（会聚/发散）',
    options: ['会聚', '发散'], answer: 0,
    explain: '凸透镜会聚凹透镜发散',
    blank: { answerText: '会聚', bank: ['会聚', '发散'] },
  },
  'phy-09': {
    q: '牛顿第一定律：一切物体在不受外力时保持静止或 ___ 运动状态',
    options: ['匀速直线', '加速', '减速', '曲线'], answer: 0,
    explain: '惯性定律',
    blank: { answerText: '匀速直线', bank: ['匀速直线', '加速', '减速', '曲线'] },
  },
  'phy-11': {
    q: '电流的形成是电荷的定向 ___',
    options: ['移动', '静止', '旋转', '振动'], answer: 0,
    explain: '电荷定向移动形成电流',
    blank: { answerText: '移动', bank: ['移动', '静止', '旋转', '振动'] },
  },
  'psy-02': {
    q: '压力与表现的关系呈倒 ___ 形',
    options: ['U', 'V', 'L', 'S'], answer: 0,
    explain: '耶克斯-多德森定律',
    blank: { answerText: 'U', bank: ['U', 'V', 'L', 'S'] },
  },
  'psy-05': {
    q: '遗忘的规律是先快后 ___',
    options: ['慢', '快'], answer: 0,
    explain: '艾宾浩斯遗忘曲线',
    blank: { answerText: '慢', bank: ['慢', '快'] },
  },
  'psy-06': {
    q: '番茄工作法：专注 ___ 分钟休息 5 分钟',
    options: ['25', '45', '60', '15'], answer: 0,
    explain: '25+5节律',
    blank: { answerText: '25', bank: ['25', '45', '60', '15'] },
  },
};

const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.json'));
let added = 0;
for (const f of files) {
  const p = path.join(DIR, f);
  let data;
  try { data = JSON.parse(fs.readFileSync(p, 'utf8')); } catch { continue; }
  const arr = Array.isArray(data) ? data : [data];
  let changed = false;
  for (const l of arr) {
    const spec = BLANKS[l.id];
    if (!spec || !l.exercises) continue;
    if (l.exercises.some((e) => e.type === 'blank')) continue;
    l.exercises.push({ ...spec, type: 'blank' });
    changed = true;
    added++;
  }
  if (changed) fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n', 'utf8');
}
console.log('已为 ' + added + ' 节课追加填空题');
