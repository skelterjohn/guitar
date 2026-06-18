import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Landing from './pages/Landing.jsx';
import Rep from './pages/Rep.jsx';
import ViewPdf from './pages/ViewPdf.jsx';
import { catalogPath } from './seo.js';

function LegacyViewRedirect() {
  const { filename } = useParams();
  return <Navigate to={`${catalogPath}/view/${filename}`} replace />;
}

export default function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path={catalogPath} element={<Home />} />
        <Route path={`${catalogPath}/view/:filename`} element={<ViewPdf />} />
        <Route path="/rep" element={<Rep />} />
        <Route path="/rep/view/:filename" element={<ViewPdf />} />
        <Route path="/view/:filename" element={<LegacyViewRedirect />} />
      </Routes>
    </div>
  );
}
