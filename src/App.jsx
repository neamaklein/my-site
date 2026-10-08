import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import CaseStudy from './pages/CaseStudy.jsx';
import { projects } from './data/projects/index.js';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home projects={projects} />} />
      <Route path="/work/:slug" element={<CaseStudy />} />
    </Routes>
  );
}
