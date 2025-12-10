import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // Import the connection
import { lessonsData } from '../data';

function LessonsPage() {
  const [profile, setProfile] = useState(null);
  const [completedIds, setCompletedIds] = useState([]); // Store IDs of finished lessons
  const [loading, setLoading] = useState(true);

  // Fetch User Profile AND Completed Lessons on Load
  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // 1. Get Profile Stats
        const { data: profileData } = await supabase
          .from('profiles')
          .select('streak, total_xp')
          .eq('id', user.id)
          .single();
        
        if (profileData) setProfile(profileData);

        // 2. Get Completed Lessons
        const { data: completedData } = await supabase
          .from('user_lessons')
          .select('lesson_id')
          .eq('user_id', user.id);
        
        // Transform [{lesson_id: 1}, {lesson_id: 2}] -> [1, 2]
        if (completedData) {
          setCompletedIds(completedData.map(item => item.lesson_id));
        }
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="app-container">
      
      {/* --- DASHBOARD HEADER --- */}
      <div className="dashboard-header">
        <h1 className="main-title">Choose a Lesson</h1>
        
        {/* Show Stats only if logged in */}
        {profile ? (
          <div className="user-stats">
            <div className="stat-badge">🔥 {profile.streak} Day Streak</div>
            <div className="stat-badge">💎 {profile.total_xp} XP</div>
          </div>
        ) : (
          !loading && (
            <Link to="/login" className="login-nudge">
              Log in to save progress ➔
            </Link>
          )
        )}
      </div>

      <div className="lessons-grid">
        {lessonsData.map((lesson) => {
          // Check if this specific lesson is in our completed list
          const isDone = completedIds.includes(lesson.id);

          return (
            <div key={lesson.id} className={`lesson-card ${isDone ? 'completed' : ''}`}>
              <div className="card-header-row">
                <h2>{lesson.title}</h2>
                {isDone && <span className="check-mark">✅ Done</span>}
              </div>
              
              <p>{lesson.description}</p>
              
              <Link to={`/study/${lesson.id}`}>
                <button className="start-btn">
                  {isDone ? "Review Lesson" : "Start Lesson"}
                </button>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default LessonsPage;