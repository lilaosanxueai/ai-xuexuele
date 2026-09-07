# -*- coding: utf-8 -*-
"""数据迁移：全部课程统一打 subjectArea（学科）+ gradeBand（学段）标签"""
import json, glob, os, re

LESSONS = os.path.join(os.path.dirname(__file__), '..', 'content', 'lessons')

# 学科映射（显式，最稳）
AREA = {
    # 信息科技（基础+拓展）
    'basics-01': '信息科技', 'basics-02': '信息科技', 'basics-03': '信息科技',
    'basics-04': '信息科技', 'basics-05-fix': '信息科技', 'basics-05': '信息科技',
    'extra-02': '信息科技', 'extra-03': '信息科技',
    # 数学
    'extra-01': '数学',
    'math-01': '数学', 'math-02': '数学', 'math-03': '数学', 'math-04': '数学',
    'math-05': '数学', 'math-06': '数学', 'math-07': '数学', 'math-08': '数学',
    'math-09': '数学', 'math-10': '数学', 'math-11': '数学', 'math-12': '数学',
    'math-13': '数学', 'math-14': '数学', 'math-15': '数学', 'math-16': '数学',
    'math-17': '数学', 'math-18': '数学', 'math-19': '数学', 'math-20': '数学',
    # 交叉学院
    'cross-01': '语文', 'cross-19': '语文',
    'cross-02': '数学', 'cross-05': '数学',
    'cross-03': '音乐',
    'cross-04': '科学',
    'cross-06': '物理', 'cross-07': '物理', 'cross-08': '物理', 'cross-09': '物理',
    'cross-10': '化学', 'cross-11': '化学', 'cross-18': '化学',
    'cross-12': '生物', 'cross-13': '生物',
    'cross-14': '英语', 'cross-15': '英语',
    'cross-16': '地理', 'cross-17': '地理',
}

def band_of(lesson_id, stage):
    """学段三档：primary 小学 / junior 初中 / senior 高中衔接"""
    if lesson_id.startswith('math-'):
        order = int(lesson_id.split('-')[1])
        return 'primary' if order <= 8 else 'junior' if order <= 16 else 'senior'
    s = stage or ''
    if '高中' in s:
        return 'senior'
    if '第四学段' in s or '7-9' in s or '9年级' in s or '8年级' in s or '初中' in s:
        return 'junior'
    return 'primary'

count = 0
for f in glob.glob(os.path.join(LESSONS, '*.json')):
    lid = os.path.basename(f)[:-5]
    d = json.load(open(f, encoding='utf-8'))
    d['subjectArea'] = AREA.get(lid, d.get('subjectArea', '信息科技'))
    d['gradeBand'] = band_of(lid, (d.get('curriculum') or {}).get('stage', ''))
    json.dump(d, open(f, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
    count += 1

# 汇总
from collections import Counter
areas = Counter()
for f in glob.glob(os.path.join(LESSONS, '*.json')):
    d = json.load(open(f, encoding='utf-8'))
    areas[d['subjectArea']] += 1
print(f'{count} lessons tagged:', dict(areas))
