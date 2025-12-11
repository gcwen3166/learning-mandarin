import { supabase } from './supabaseClient'
import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

import LoginPage from './components/LoginPage';

// Import your pages
import StudyPage from './components/StudyPage';
import VideoLibrary from './components/VideoLibrary';
import LessonsPage from './components/LessonsPage'; // Import the new page

import Dashboard from './components/Dashboard';
import ProfessorPage from './components/ProfessorPage';

function App() {
  useEffect(() => {
  // Test the connection simply by asking "is there a user?"
  // This doesn't need a table, just the auth service.
  const checkConnection = async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error("Supabase connection error:", error);
    } else {
      console.log("Supabase connected! Session data:", data);
    }
  };

  checkConnection();
}, []);
  return (
    <Router>
      {/* Navigation Bar - Visible on every page */}
      <nav className="navbar">
        <div className="nav-brand">Learning Mandarin</div>
        <div className="nav-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/">Lessons</Link> {/* Changed Home to be the Lessons list */}
          <Link to="/videos">Videos</Link>
          <Link to="/professor">Professor</Link>
          <Link to="/login">Login</Link>
        </div>
      </nav>

      {/* The Traffic Cop: Decides which component to show */}
      <Routes>
        <Route path="/" element={<LessonsPage />} /> {/* Home is now Lessons */}
        <Route path="/videos" element={<VideoLibrary />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/professor" element={<ProfessorPage />} />

        <Route path="/dashboard" element={<Dashboard />} />

        {/* The Dynamic Route: :id is a variable! */}
        <Route path="/study/:id" element={<StudyPage />} />
      </Routes>
    </Router>
  );
}

export default App;
