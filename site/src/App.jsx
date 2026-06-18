import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Rep from './pages/Rep.jsx';
import ViewPdf from './pages/ViewPdf.jsx';
import { catalogPath } from './seo.js';

export default function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Navigate to={catalogPath} replace />} />
        <Route path={catalogPath} element={<Home />} />
        <Route path="/rep" element={<Rep />} />
        <Route path="/view/:filename" element={<ViewPdf />} />
      </Routes>
    </div>
  );
}
