import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

// Import your pages
import StudyPage from './components/StudyPage';
import VideoLibrary from './components/VideoLibrary';
import LessonsPage from './components/LessonsPage'; // Import the new page

function App() {
  return (
    <Router>
      {/* Navigation Bar - Visible on every page */}
      <nav className="navbar">
        <div className="nav-brand">Learning Mandarin</div>
        <div className="nav-links">
          <Link to="/">Lessons</Link> {/* Changed Home to be the Lessons list */}
          <Link to="/videos">Videos</Link>
        </div>
      </nav>

      {/* The Traffic Cop: Decides which component to show */}
      <Routes>
        <Route path="/" element={<LessonsPage />} /> {/* Home is now Lessons */}
        <Route path="/videos" element={<VideoLibrary />} />

        {/* The Dynamic Route: :id is a variable! */}
        <Route path="/study/:id" element={<StudyPage />} />
      </Routes>
    </Router>
  );
}

export default App;