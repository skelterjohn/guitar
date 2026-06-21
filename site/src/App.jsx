import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Landing from './pages/Landing.jsx';
import Njgo from './pages/Njgo.jsx';
import Rep from './pages/Rep.jsx';
import ViewPdf from './pages/ViewPdf.jsx';
import StylusDiagnostics from './pages/StylusDiagnostics.jsx';
import { catalogPath, njgoPath } from './seo.js';
import { isNjgoDomain } from './utils/siteDomain.js';

function LegacyViewRedirect() {
  const { filename } = useParams();
  return <Navigate to={`${catalogPath}/view/${filename}`} replace />;
}

function RootPage() {
  if (isNjgoDomain()) return <Njgo />;
  return <Landing />;
}

export default function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<RootPage />} />
        <Route path={njgoPath} element={<Njgo />} />
        <Route path={catalogPath} element={<Home />} />
        <Route path={`${catalogPath}/view/:filename`} element={<ViewPdf />} />
        <Route path="/rep" element={<Rep />} />
        <Route path="/rep/view/:filename" element={<ViewPdf />} />
        <Route path="/view/:filename" element={<LegacyViewRedirect />} />
        <Route path="/dev/stylus" element={<StylusDiagnostics />} />
      </Routes>
    </div>
  );
}
