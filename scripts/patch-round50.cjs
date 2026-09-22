/** 第50轮接线：四个页面的战绩埋点 + MapScreen/ParentScreen 徽章读战绩（幂等） */
const fs = require('fs');

function patchFile(p, edits) {
  let t = fs.readFileSync(p, 'utf8');
  for (const [name, from, to] of edits) {
    if (t.includes(to)) { console.log(`${p} [${name}]: already`); continue; }
    if (!t.includes(from)) throw new Error(`${p} [${name}]: anchor missing`);
    t = t.replace(from, to);
    console.log(`${p} [${name}]: ok`);
  }
  fs.writeFileSync(p, t);
}

// 1. PairsGameScreen：终局 pairsPlays+1
patchFile('apps/web/src/screens/PairsGameScreen.tsx', [
  ['import', "import { buildDeck } from '../runtime/flashcards.ts';",
    "import { buildDeck } from '../runtime/flashcards.ts';\nimport { bumpRecords, readRecords, recordsKey } from '../runtime/achievements.ts';"],
  ['record', '              if (next.size >= left.length * 2) { setDone(true); setRunning(false); }',
    '              if (next.size >= left.length * 2) {\n                setDone(true); setRunning(false);\n                try {\n                  const k = recordsKey(profile.id);\n                  const prev = readRecords(JSON.parse(localStorage.getItem(k) ?? \'{}'));\n                  localStorage.setItem(k, JSON.stringify(bumpRecords(prev, { pairsPlays: prev.pairsPlays + 1 })));\n                } catch { /* 忽略 */ }\n              }'],
]);

// 2. FlashcardScreen：听音满分 listenPerfect+1
patchFile('apps/web/src/screens/FlashcardScreen.tsx', [
  ['import', "import { bumpCounter } from '../runtime/dailyQuests.ts';",
    "import { bumpCounter } from '../runtime/dailyQuests.ts';\nimport { bumpRecords, readRecords, recordsKey } from '../runtime/achievements.ts';"],
  ['record', '            <div className="text-5xl">{listenScore.ok === listenScore.total ? \'🏆\' : listenScore.ok >= 3 ? \'👍\' : \'💪\'}</div>',
    '            <div className="text-5xl">{listenScore.ok === listenScore.total ? \'🏆\' : listenScore.ok >= 3 ? \'👍\' : \'💪\'}</div>\n            {listenScore.ok === listenScore.total && listenScore.total >= 5 ? (() => { try { const k = recordsKey(profile.id); const prev = readRecords(JSON.parse(localStorage.getItem(k) ?? \'{}\')); localStorage.setItem(k, JSON.stringify(bumpRecords(prev, { listenPerfect: prev.listenPerfect + 1 }))); } catch { /* 忽略 */ } return null; })() : null}'],
]);

// 3. ChallengeScreen：终局 challengeBest 取最大
patchFile('apps/web/src/screens/ChallengeScreen.tsx', [
  ['import', "import { bumpCounter } from '../runtime/dailyQuests.ts';",
    "import { bumpCounter } from '../runtime/dailyQuests.ts';\nimport { bumpRecords, readRecords, recordsKey } from '../runtime/achievements.ts';"],
  ['record', "        wrongAdds: wrongsRef.current,\n        minutesDelta: 5,\n      }).catch(() => {});",
    "        wrongAdds: wrongsRef.current,\n        minutesDelta: 5,\n      }).catch(() => {});\n      try {\n        const k = recordsKey(profile.id);\n        const prev = readRecords(JSON.parse(localStorage.getItem(k) ?? '{}'));\n        localStorage.setItem(k, JSON.stringify(bumpRecords(prev, { challengeBest: score })));\n      } catch { /* 忽略 */ }"],
]);

// 4. ExamScreen：交卷 examBest 取最高正确率
patchFile('apps/web/src/screens/ExamScreen.tsx', [
  ['import', "import { sampleQuestions, type ChallengeQ } from '../runtime/challenge.ts';",
    "import { sampleQuestions, type ChallengeQ } from '../runtime/challenge.ts';\nimport { bumpRecords, readRecords, recordsKey } from '../runtime/achievements.ts';"],
  ['record', "    if (profile && wrongAdds.length > 0) {\n      void api.updateProgress(profile.id, { wrongAdds, minutesDelta: 5 }).catch(() => {});\n    }",
    "    if (profile) {\n      if (wrongAdds.length > 0) void api.updateProgress(profile.id, { wrongAdds, minutesDelta: 5 }).catch(() => {});\n      const rate = finalAnswers.length ? Math.round((finalAnswers.filter((a) => a.pick === a.q.answer).length / finalAnswers.length) * 100) : 0;\n      try {\n        const k = recordsKey(profile.id);\n        const prev = readRecords(JSON.parse(localStorage.getItem(k) ?? '{}'));\n        localStorage.setItem(k, JSON.stringify(bumpRecords(prev, { examBest: rate })));\n      } catch { /* 忽略 */ }\n    }"],
]);

console.log('all record writers wired');
