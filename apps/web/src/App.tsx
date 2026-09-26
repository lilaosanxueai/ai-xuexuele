import { lazy, Suspense } from 'react';
import { HashRouter, Navigate, Route, Routes, useParams } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen.tsx';
import MapScreen from './screens/MapScreen.tsx';
import GalleryScreen from './screens/GalleryScreen.tsx';
import ParentScreen from './screens/ParentScreen.tsx';
import SubjectScreen from './screens/SubjectScreen.tsx';
import AskScreen from './screens/AskScreen.tsx';
import TutorScreen from './screens/TutorScreen.tsx';
import LabScreen from './screens/LabScreen.tsx';

// 重页面懒加载：进练习才下载 Blockly（776KB），进实验室才下载摄像头识别模块——
// 首页/辅导页首屏显著变快，平板上尤其明显
const WorkshopScreen = lazy(() => import('./screens/WorkshopScreen.tsx'));
const PlaygroundScreen = lazy(() => import('./screens/PlaygroundScreen.tsx'));
const WrongBookScreen = lazy(() => import('./screens/WrongBookScreen.tsx'));
const MentalMathScreen = lazy(() => import('./screens/MentalMathScreen.tsx'));
const FlashcardScreen = lazy(() => import('./screens/FlashcardScreen.tsx'));
const ChallengeScreen = lazy(() => import('./screens/ChallengeScreen.tsx'));
const SearchScreen = lazy(() => import('./screens/SearchScreen.tsx'));
const ExamScreen = lazy(() => import('./screens/ExamScreen.tsx'));
const PairsGameScreen = lazy(() => import('./screens/PairsGameScreen.tsx'));
const SpeakingScreen = lazy(() => import('./screens/SpeakingScreen.tsx'));
const DictationScreen = lazy(() => import('./screens/DictationScreen.tsx'));
const PoemScreen = lazy(() => import('./screens/PoemScreen.tsx'));
const BalanceScreen = lazy(() => import('./screens/BalanceScreen.tsx'));

/** 旧书签 /lesson/:id 重定向到辅导页（学习主入口） */
function LegacyLessonRoute() {
  const { id } = useParams();
  return <Navigate to={`/tutor/${id ?? ''}`} replace />;
}

function PracticeRoute() {
  const { id } = useParams();
  if (!id) return <Navigate to="/map" replace />;
  return <WorkshopScreen mode={{ kind: 'lesson', lessonId: id }} />;
}

function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-50">
      <div className="text-5xl animate-bounce">📖</div>
      <div className="text-sm font-bold text-slate-400">马上就好，正在打开这一课…</div>
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/map" element={<MapScreen />} />
          <Route path="/tutor/:id" element={<TutorScreen />} />
          <Route path="/lab/:id" element={<LabScreen />} />
          <Route path="/lesson/:id" element={<LegacyLessonRoute />} />
          <Route path="/practice/:id" element={<PracticeRoute />} />
          <Route path="/ask" element={<AskScreen />} />
          <Route path="/freeplay" element={<WorkshopScreen mode={{ kind: 'freeplay' }} />} />
          <Route path="/gallery" element={<GalleryScreen />} />
          <Route path="/parent" element={<ParentScreen />} />
          <Route path="/wrongbook" element={<WrongBookScreen />} />
          <Route path="/mentalmath" element={<MentalMathScreen />} />
          <Route path="/flashcards" element={<FlashcardScreen />} />
          <Route path="/challenge" element={<ChallengeScreen />} />
          <Route path="/search" element={<SearchScreen />} />
          <Route path="/exam/:subject" element={<ExamScreen />} />
          <Route path="/pairs" element={<PairsGameScreen />} />
          <Route path="/speaking" element={<SpeakingScreen />} />
          <Route path="/dictation" element={<DictationScreen />} />
          <Route path="/poem" element={<PoemScreen />} />
          <Route path="/balance" element={<BalanceScreen />} />
          <Route path="/playground" element={<PlaygroundScreen />} />
          <Route path="/subject/:area" element={<SubjectScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </HashRouter>
  );
}
