import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import ViewPdf from './pages/ViewPdf.jsx';

export default function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/view/:filename" element={<ViewPdf />} />
      </Routes>
    </div>
  );
}
