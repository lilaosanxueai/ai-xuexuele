import { lazy, Suspense } from 'react';
import { HashRouter, Navigate, Route, Routes, useParams } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen.tsx';
import MapScreen from './screens/MapScreen.tsx';
import GalleryScreen from './screens/GalleryScreen.tsx';
import ParentScreen from './screens/ParentScreen.tsx';
import CertificateScreen from './screens/CertificateScreen.tsx';
import SubjectScreen from './screens/SubjectScreen.tsx';

// 重页面懒加载：进课程才下载 Blockly（776KB），进实验室才下载摄像头识别模块——
// 地图/首页首屏显著变快，平板上尤其明显
const WorkshopScreen = lazy(() => import('./screens/WorkshopScreen.tsx'));
const PlaygroundScreen = lazy(() => import('./screens/PlaygroundScreen.tsx'));
const WrongBookScreen = lazy(() => import('./screens/WrongBookScreen.tsx'));
const MentalMathScreen = lazy(() => import('./screens/MentalMathScreen.tsx'));

function LessonRoute() {
  const { id } = useParams();
  if (!id) return <Navigate to="/map" replace />;
  return <WorkshopScreen mode={{ kind: 'lesson', lessonId: id }} />;
}

function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-50">
      <div className="text-5xl animate-bounce">🏝</div>
      <div className="text-sm font-bold text-slate-400">马上就好，正在打开工具箱…</div>
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
          <Route path="/lesson/:id" element={<LessonRoute />} />
          <Route path="/freeplay" element={<WorkshopScreen mode={{ kind: 'freeplay' }} />} />
          <Route path="/gallery" element={<GalleryScreen />} />
          <Route path="/parent" element={<ParentScreen />} />
          <Route path="/certificate" element={<CertificateScreen />} />
          <Route path="/wrongbook" element={<WrongBookScreen />} />
          <Route path="/mentalmath" element={<MentalMathScreen />} />
          <Route path="/playground" element={<PlaygroundScreen />} />
          <Route path="/subject/:area" element={<SubjectScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </HashRouter>
  );
}
