import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '../supabaseClient';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { addDays, format, startOfDay, startOfWeek, subDays, isSameDay, parseISO } from 'date-fns';

const THEME_NAMES = ['flame', 'ice'];
const THEME_LABELS = {
  flame: 'Flame',
  ice: 'Ice',
  olive: 'Olive',
  lime: 'Lime',
  magenta: 'Magenta'
};

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [studyLogs, setStudyLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heatmapTheme, setHeatmapTheme] = useState('flame');
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const normalizeToDayKey = (value) => {
    if (!value) return null;
    const dateObj = typeof value === 'string' ? parseISO(value) : value;
    return startOfDay(dateObj).toISOString();
  };

  const calculateStreakFromLogs = (logDateSet) => {
    let streak = 0;
    let cursor = startOfDay(new Date());

    while (logDateSet.has(cursor.toISOString())) {
      streak += 1;
      cursor = subDays(cursor, 1);
    }

    return streak;
  };

  const fetchUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    const { data: logData } = await supabase
      .from('study_logs')
      .select('study_date')
      .eq('user_id', user.id);

    setProfile(profileData);
    
    const formattedLogs = (logData || []).map(log => ({
      date: log.study_date,
      count: 1
    }));
    setStudyLogs(formattedLogs);

    await handleStreakCheck(profileData, user.id, logData || []);
    
    setLoading(false);
  };

  const handleStreakCheck = async (currentProfile, userId, existingLogs = []) => {
    if (!currentProfile) return;

    const todayKey = normalizeToDayKey(new Date());
    const logDateSet = new Set(
      existingLogs
        .map((log) => normalizeToDayKey(log.study_date || log.date))
        .filter(Boolean)
    );
    let updatedLogSet = new Set(logDateSet);
    let latestLogDate = null;

    if (!updatedLogSet.has(todayKey)) {
      const nowIso = new Date().toISOString();
      const { error: logError } = await supabase.from('study_logs').insert({
        user_id: userId,
        study_date: nowIso
      });

      if (logError) {
        console.error('Unable to create today study log', logError);
      } else {
        updatedLogSet.add(todayKey);
        latestLogDate = nowIso;
        setStudyLogs((prev) => [...prev, { date: nowIso, count: 1 }]);
      }
    }

    const newStreak = calculateStreakFromLogs(updatedLogSet);
    const lastStudyDate = currentProfile.last_study_date
      ? parseISO(currentProfile.last_study_date)
      : null;
    const shouldUpdateProfile =
      newStreak !== (currentProfile.streak || 0) ||
      !lastStudyDate ||
      !isSameDay(lastStudyDate, new Date());

    if (shouldUpdateProfile) {
      const nowIso = latestLogDate || new Date().toISOString();
      const { error: profileError } = await supabase.from('profiles').update({
        streak: newStreak,
        last_study_date: nowIso
      }).eq('id', userId);

      if (profileError) {
        console.error('Unable to update profile streak', profileError);
      }
    }

    setProfile(prev => ({
      ...(prev || {}),
      ...(currentProfile || {}),
      streak: newStreak,
      last_study_date: latestLogDate || currentProfile.last_study_date || new Date().toISOString()
    }));
  };

  const weeklyProgress = useMemo(() => {
    const today = startOfDay(new Date());
    const weekStart = startOfWeek(today, { weekStartsOn: 0 });
    const logDateSet = new Set(
      studyLogs
        .map((log) => normalizeToDayKey(log.date || log.study_date))
        .filter(Boolean)
    );

    return Array.from({ length: 7 }).map((_, index) => {
      const day = startOfDay(addDays(weekStart, index));
      const key = day.toISOString();

      return {
        label: format(day, 'EEEEE'),
        active: logDateSet.has(key)
      };
    });
  }, [studyLogs]);

  const stats = useMemo(() => {
    if (!studyLogs.length) {
      return {
        dailyAverage: 0,
        daysLearnedPercent: 0,
        longestStreak: 0,
        currentStreak: profile?.streak || 0
      };
    }

    const dayMap = new Map();
    studyLogs.forEach((log) => {
      const key = normalizeToDayKey(log.date || log.study_date);
      if (!key) return;
      const count = typeof log.count === 'number' ? log.count : 1;
      dayMap.set(key, (dayMap.get(key) || 0) + count);
    });

    const sortedKeys = Array.from(dayMap.keys()).sort();
    const earliest = startOfDay(parseISO(sortedKeys[0]));
    const today = startOfDay(new Date());
    const totalDaysRange = Math.max(1, Math.floor((today - earliest) / (1000 * 60 * 60 * 24)) + 1);
    const totalCards = Array.from(dayMap.values()).reduce((sum, val) => sum + val, 0);
    const dailyAverage = Math.round((totalCards / totalDaysRange) * 10) / 10;
    const daysLearnedPercent = Math.round((dayMap.size / totalDaysRange) * 100);

    let longest = 0;
    let current = 0;
    const daySet = new Set(dayMap.keys());
    let cursor = today;
    while (daySet.has(cursor.toISOString())) {
      current += 1;
      cursor = subDays(cursor, 1);
    }

    const allDays = sortedKeys.map((k) => startOfDay(parseISO(k)));
    for (let i = 0; i < allDays.length; i++) {
      let streak = 1;
      let runner = allDays[i];
      while (daySet.has(subDays(runner, streak).toISOString())) {
        streak += 1;
      }
      if (streak > longest) longest = streak;
    }

    return {
      dailyAverage,
      daysLearnedPercent,
      longestStreak: longest,
      currentStreak: current || profile?.streak || 0
    };
  }, [studyLogs, profile?.streak]);

  const heatmapValues = useMemo(() => {
    const today = startOfDay(new Date());
    const startRange = subDays(today, 364);
    const endRange = today;

    const dayMap = new Map();
    studyLogs.forEach((log) => {
      const key = normalizeToDayKey(log.date || log.study_date);
      if (!key) return;
      const count = typeof log.count === 'number' ? log.count : 1;
      dayMap.set(key, (dayMap.get(key) || 0) + count);
    });

    const totalDays = Math.floor((endRange - startRange) / (1000 * 60 * 60 * 24)) + 1;

    return Array.from({ length: totalDays }).map((_, idx) => {
      const current = addDays(startRange, idx);
      const key = current.toISOString();
      return {
        date: key,
        count: dayMap.get(key) || 0,
        isFuture: current > today
      };
    });
  }, [studyLogs]);

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
        <div className="week-progress">
          {weeklyProgress.map((day, index) => (
            <div
              key={`${day.label}-${index}`}
              className={`day-dot ${day.active ? 'active' : ''}`}
            >
              {day.label}
            </div>
          ))}
        </div>
      </div>

      {/* Heatmap Section */}
      <div className={`heatmap-card theme-${heatmapTheme}`}>
        <div className="heatmap-header">
          <div className="heatmap-nav">
            <button className="nav-btn" aria-label="Previous">←</button>
            <button className="nav-btn" aria-label="Today">⊙</button>
            <button className="nav-btn" aria-label="Next">→</button>
          </div>
          <div className="heatmap-gear">
            <button
              className="gear-btn"
              aria-label="Heatmap settings"
              onClick={() => setShowThemeMenu((prev) => !prev)}
            >
              ⚙️
            </button>
            {showThemeMenu && (
              <div className="theme-menu">
                <div className="menu-section">
                  <div className="menu-label">Color scheme</div>
                  {THEME_NAMES.map((theme) => (
                    <button
                      key={theme}
                      className={`${heatmapTheme === theme ? 'active' : ''} theme-${theme}`}
                      onClick={() => {
                        setHeatmapTheme(theme);
                        setShowThemeMenu(false);
                      }}
                    >
                      {THEME_LABELS[theme]}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <CalendarHeatmap
          startDate={subDays(new Date(), 364)}
          endDate={new Date()}
          values={heatmapValues}
          showMonthLabels={false}
          classForValue={(value) => {
            if (!value) return 'color-empty';
            const count = typeof value.count === 'number' ? value.count : 1;
            if (count <= 0) {
              return value.isFuture ? 'color-empty-future' : 'color-empty-past';
            }
            const avg = stats.dailyAverage || 1;
            const ratio = count / avg;
            let level = 1;
            if (ratio > 2) level = 4;
            else if (ratio > 1.2) level = 3;
            else if (ratio > 0.6) level = 2;
            return `color-level-${level} theme-${heatmapTheme}`;
          }}
        />

        <div className="heatmap-stats">
          <div className="stat-item">
            <strong>Daily average:</strong>{' '}
            <span className={`stat-accent theme-${heatmapTheme}`}>{stats.dailyAverage} cards</span>
          </div>
          <div className="stat-item">
            <strong>Days learned:</strong>{' '}
            <span className={`stat-accent theme-${heatmapTheme}`}>{stats.daysLearnedPercent}%</span>
          </div>
          <div className="stat-item">
            <strong>Longest streak:</strong>{' '}
            <span className={`stat-accent theme-${heatmapTheme}`}>{stats.longestStreak} days</span>
          </div>
          <div className="stat-item">
            <strong>Current streak:</strong>{' '}
            <span className={`stat-accent theme-${heatmapTheme}`}>{stats.currentStreak} days</span>
          </div>
        </div>
      </div>
    </div>
  );
}
