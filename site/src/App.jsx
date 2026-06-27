import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Landing from './pages/Landing.jsx';
import Njgo from './pages/Njgo.jsx';
import Book from './pages/Book.jsx';
import Rep from './pages/Rep.jsx';
import ViewBookPdf from './pages/ViewBookPdf.jsx';
import ViewPdf from './pages/ViewPdf.jsx';
import StylusDiagnostics from './pages/StylusDiagnostics.jsx';
import { catalogPath, njgoPath } from './seo.js';
import { isBluebridgeDomain, isNjgoDomain } from './utils/siteDomain.js';

function LegacyViewRedirect() {
  const { filename } = useParams();
  return <Navigate to={`${catalogPath}/view/${filename}`} replace />;
}

function ViewRoute() {
  if (isBluebridgeDomain()) return <ViewBookPdf />;
  return <LegacyViewRedirect />;
}

function BookRoute() {
  if (isBluebridgeDomain()) return <Navigate to="/" replace />;
  return <Book />;
}

function BookViewRoute() {
  const { filename } = useParams();
  if (isBluebridgeDomain()) return <Navigate to={`/view/${filename}`} replace />;
  return <ViewBookPdf />;
}

function RootPage() {
  if (isNjgoDomain()) return <Njgo />;
  if (isBluebridgeDomain()) return <Book />;
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
        <Route path="/book" element={<BookRoute />} />
        <Route path="/book/view/:filename" element={<BookViewRoute />} />
        <Route path="/rep" element={<Rep />} />
        <Route path="/rep/view/:filename" element={<ViewPdf />} />
        <Route path="/view/:filename" element={<ViewRoute />} />
        <Route path="/dev/stylus" element={<StylusDiagnostics />} />
      </Routes>
    </div>
  );
}
