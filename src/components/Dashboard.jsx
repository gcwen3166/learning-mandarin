import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { subDays, isSameDay, parseISO } from 'date-fns';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [studyLogs, setStudyLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dueCount, setDueCount] = useState(0); // <--- NEW STATE

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // 1. Get Profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    // 2. Get Heatmap Logs
    const { data: logData } = await supabase
      .from('study_logs')
      .select('study_date')
      .eq('user_id', user.id);

    // 3. --- NEW: Get Due Cards Count ---
    // We count cards where next_review is Less Than or Equal (lte) to right now
    const now = new Date().toISOString();
    const { count } = await supabase
      .from('user_flashcards')
      .select('*', { count: 'exact', head: true }) // head:true means "just count, don't download data"
      .eq('user_id', user.id)
      .lte('next_review', now);
    
    if (count !== null) setDueCount(count);

    setProfile(profileData);
    
    const formattedLogs = logData.map(log => ({
      date: log.study_date,
      count: 1
    }));
    setStudyLogs(formattedLogs);

    handleStreakCheck(profileData, user.id);
    
    setLoading(false);
  };

  const handleStreakCheck = async (currentProfile, userId) => {
    if (!currentProfile) return;
    
    const today = new Date();
    const lastDate = currentProfile.last_study_date ? parseISO(currentProfile.last_study_date) : null;
    
    if (lastDate && isSameDay(lastDate, today)) return;

    const yesterday = subDays(today, 1);
    let newStreak = 1; 

    if (lastDate && isSameDay(lastDate, yesterday)) {
      newStreak = currentProfile.streak + 1;
    } else if (lastDate && isSameDay(lastDate, today)) {
        newStreak = currentProfile.streak;
    }

    await supabase.from('profiles').update({
      streak: newStreak,
      last_study_date: new Date().toISOString()
    }).eq('id', userId);

    await supabase.from('study_logs').insert({
      user_id: userId,
      study_date: new Date().toISOString()
    });

    setProfile(prev => ({ ...prev, streak: newStreak }));
  };

  if (loading) return <div className="app-container">Loading Dashboard...</div>;

  return (
    <div className="app-container">
      <h1 className="main-title">Welcome back!</h1>
      
      {/* Streak Section */}
      <div className="streak-container">
        <div className="streak-circle">
          <span className="fire-icon">🔥</span>
          <span className="streak-number">{profile?.streak || 0}</span>
          <span className="streak-label">Day Streak</span>
        </div>
      </div>

      {/* Heatmap Section */}
      <div className="heatmap-card">
        <h3>Study History</h3>
        <CalendarHeatmap
          startDate={subDays(new Date(), 100)}
          endDate={new Date()}
          values={studyLogs}
          classForValue={(value) => {
            if (!value) return 'color-empty';
            return `color-scale-1`;
          }}
        />
      </div>

      {/* Action Buttons */}
      <div className="dashboard-actions">
        {/* --- UPDATED BUTTON --- */}
        <button className="review-deck-btn">
          Start Daily Review ({dueCount} Cards)
        </button>
        
        <Link to="/">
          <button className="lessons-btn">Go to Lessons</button>
        </Link>
      </div>

    </div>
  );
}