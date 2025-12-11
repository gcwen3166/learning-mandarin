import { supabase } from './supabaseClient'
import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

import LoginPage from './components/LoginPage';

// Import your pages
import StudyPage from './components/StudyPage';
import VideoLibrary from './components/VideoLibrary';
import LessonsPage from './components/LessonsPage'; // Import the new page

import Dashboard from './components/Dashboard';
import ProfessorPage from './components/ProfessorPage';
import DailyReview from './components/DailyReview';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const initSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Supabase connection error:", error);
      } else {
        setUser(data?.session?.user ?? null);
      }
    };

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    initSession();
    return () => {
      subscription?.subscription?.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    }
    setUser(null);
  };

  return (
    <Router>
      {/* Navigation Bar - Visible on every page */}
      <nav className="navbar">
        <div className="nav-brand">Learning Mandarin</div>
        <div className="nav-links">
          {user && <Link to="/dashboard">Dashboard</Link>}
          <Link to="/">Lessons</Link> {/* Changed Home to be the Lessons list */}
          <Link to="/videos">Videos</Link>
          <Link to="/professor">Professor</Link>
          <Link to="/study">Study</Link>
          {!user && <Link to="/login">Login</Link>}
          {user && (
            <button className="logout-btn" onClick={handleSignOut}>
              Logout
            </button>
          )}
        </div>
      </nav>

      {/* The Traffic Cop: Decides which component to show */}
      <Routes>
        <Route path="/" element={<LessonsPage />} /> {/* Home is now Lessons */}
        <Route path="/videos" element={<VideoLibrary />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/professor" element={<ProfessorPage />} />
        <Route path="/study" element={<DailyReview />} />

        <Route path="/dashboard" element={<Dashboard />} />

        {/* The Dynamic Route: :id is a variable! */}
        <Route path="/study/:id" element={<StudyPage />} />
      </Routes>
    </Router>
  );
}

export default App;
