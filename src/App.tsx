import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Portfolio from './pages/Portfolio';
import Projects from './pages/Projects';
import Gear from './pages/Gear';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/lobby" element={<Navigate to="/?lobby=1" replace />} />
        <Route path="/gear" element={<Gear />} />
      </Routes>
    </Router>
  );
}

export default App;
