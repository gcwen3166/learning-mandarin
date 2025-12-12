import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import CalendarHeatmap from 'react-calendar-heatmap';
import { addDays, format, startOfDay, startOfWeek, subDays, isSameDay, parseISO } from 'date-fns';
import Flashcard from './Flashcard';
import { supabase } from '../supabaseClient';
import { lessonsData } from '../data';

export default function DailyReview() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionTotal, setSessionTotal] = useState(0);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [isAuthed, setIsAuthed] = useState(true);
  const [deckCounts, setDeckCounts] = useState({ translate: 0, pinyin: 0 });
  const [deck, setDeck] = useState(() => searchParams.get('deck'));
  const [typedAnswer, setTypedAnswer] = useState('');
  const [answerStatus, setAnswerStatus] = useState('idle'); // idle | correct | error
  const [profile, setProfile] = useState(null);
  const [studyLogs, setStudyLogs] = useState([]);
  const [todayLogId, setTodayLogId] = useState(null);
  const [todayLogCount, setTodayLogCount] = useState(0);
  const [heatmapTheme, setHeatmapTheme] = useState('flame');
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [heatmapLoading, setHeatmapLoading] = useState(true);

  const wordMap = useMemo(() => {
    const map = new Map();
    lessonsData.forEach((lesson) => {
      (lesson.words || []).forEach((w) => {
        const key = `${lesson.id}-${Number(w.id)}`;
        map.set(key, { ...w, lessonId: lesson.id });
      });
    });
    return map;
  }, []);

  const normalizeToDayKey = (value) => {
    if (!value) return null;
    const dateObj = typeof value === 'string' ? parseISO(value) : value;
    return startOfDay(dateObj).toISOString();
  };

  const todayKey = useMemo(() => normalizeToDayKey(new Date()), []);

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
      const { data: newLog, error: logError } = await supabase
        .from('study_logs')
        .insert({
          user_id: userId,
          study_date: nowIso,
          count: 0
        })
        .select('id, study_date, count')
        .single();

      if (logError) {
        console.error('Unable to create today study log', logError);
      } else {
        updatedLogSet.add(todayKey);
        latestLogDate = nowIso;
        setStudyLogs((prev) => [...prev, { id: newLog?.id, date: nowIso, count: newLog?.count ?? 0 }]);
        setTodayLogId(newLog?.id || null);
        setTodayLogCount(newLog?.count ?? 0);
      }
    }

    const calculateStreakFromLogs = (logSet) => {
      let streak = 0;
      let cursor = startOfDay(new Date());
      while (logSet.has(cursor.toISOString())) {
        streak += 1;
        cursor = subDays(cursor, 1);
      }
      return streak;
    };

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

  useEffect(() => {
    setDeck(searchParams.get('deck'));
  }, [searchParams]);

  const currentCard = queue[currentIndex];

  useEffect(() => {
    const fetchCounts = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setDeckCounts({ translate: 0, pinyin: 0 });
        return;
      }
      const now = new Date().toISOString();
      const fetchCount = async (deckName) => {
        const { count } = await supabase
          .from('user_flashcards')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('deck', deckName)
          .lte('next_review', now);
        return count || 0;
      };
      const [translateCount, pinyinCount] = await Promise.all([
        fetchCount('translate'),
        fetchCount('pinyin')
      ]);
      setDeckCounts({ translate: translateCount, pinyin: pinyinCount });
    };
    fetchCounts();
  }, []);

  useEffect(() => {
    const fetchLogs = async () => {
      setHeatmapLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setProfile(null);
        setStudyLogs([]);
        setHeatmapLoading(false);
        return;
      }
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      const { data: logData } = await supabase
        .from('study_logs')
        .select('id, study_date, count')
        .eq('user_id', user.id);
      setProfile(profileData || null);
      const formattedLogs = (logData || []).map((log) => ({
        id: log.id,
        date: log.study_date,
        count: log.count ?? 0
      }));
      setStudyLogs(formattedLogs);
      const todayEntry = (logData || []).find(
        (log) => normalizeToDayKey(log.study_date) === todayKey
      );
      setTodayLogId(todayEntry?.id || null);
      setTodayLogCount(todayEntry?.count || 0);
      await handleStreakCheck(profileData, user.id, logData || []);
      setHeatmapLoading(false);
    };
    fetchLogs();
  }, []);

  useEffect(() => {
    const loadDueCards = async () => {
      if (!deck) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setIsAuthed(false);
          setQueue([]);
          setSessionTotal(0);
          return;
        }
        setIsAuthed(true);
        const now = new Date().toISOString();
        const { data, error: fetchError } = await supabase
          .from('user_flashcards')
          .select('*')
          .eq('user_id', user.id)
          .eq('deck', deck)
          .lte('next_review', now)
          .order('next_review', { ascending: true })
          .limit(50);

        if (fetchError) throw fetchError;
        const cards = (data || []).map((card) => {
          const compositeKey = `${card.lesson_id || 'none'}-${card.word_id}`;
          const word = wordMap.get(compositeKey) || wordMap.get(`undefined-${card.word_id}`);
          return word ? { ...word, ...card } : card;
        });
        setQueue(cards);
        setCurrentIndex(0);
        setIsFlipped(false);
        setSessionTotal(cards.length);
        setReviewedCount(0);
        setTypedAnswer('');
        setAnswerStatus('idle');
        setDeckCounts((prev) => ({ ...prev, [deck]: cards.length }));
      } catch (err) {
        setError(err.message || 'Unable to load cards');
      } finally {
        setLoading(false);
      }
    };
    loadDueCards();
  }, [deck, wordMap]);

  useEffect(() => {
    setTypedAnswer('');
    setAnswerStatus('idle');
    setIsFlipped(false);
  }, [currentIndex, deck]);

  const bumpMissionProgress = async (userId, code, target) => {
    const { data: existing, error: fetchErr } = await supabase
      .from('user_missions')
      .select('id, progress, completed')
      .eq('user_id', userId)
      .eq('mission_code', code)
      .single();

    if (fetchErr && fetchErr.code !== 'PGRST116') {
      console.error('Mission fetch error', fetchErr);
      return;
    }

    const currentProgress = existing?.progress || 0;
    const newProgress = Math.min(target, currentProgress + 1);
    const completed = newProgress >= target ? true : existing?.completed || false;

    const { error: upsertErr } = await supabase.from('user_missions').upsert({
      user_id: userId,
      mission_code: code,
      progress: newProgress,
      completed,
      completed_at: completed ? new Date().toISOString() : existing?.completed_at || null
    }, { onConflict: 'user_id,mission_code' });

    if (upsertErr) {
      console.error('Mission upsert error', upsertErr);
    }
  };

  const handleGrade = async (grade) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!currentCard || !user) return;

    const now = new Date();
    let { interval = 0, ease_factor = 2.5, reps = 0, lapses = 0 } = currentCard;
    let nextReview = now;
    setIsFlipped(false);
    setTypedAnswer('');
    setAnswerStatus('idle');

    if (grade === 'again') {
      interval = 0;
      reps = 0;
      lapses += 1;
      ease_factor = Math.max(1.3, ease_factor - 0.2);
      nextReview = new Date(now.getTime() + 10 * 60 * 1000); // 10 minutes
    } else if (grade === 'hard') {
      reps = Math.max(1, reps);
      interval = interval === 0 ? 1 : Math.max(1, Math.round(interval * 1.2));
      ease_factor = Math.max(1.3, ease_factor - 0.05);
      nextReview = new Date(now.getTime() + interval * 24 * 60 * 60 * 1000);
    } else if (grade === 'good') {
      reps += 1;
      interval = interval === 0 ? 1 : Math.round(interval * ease_factor);
      nextReview = new Date(now.getTime() + interval * 24 * 60 * 60 * 1000);
    } else if (grade === 'easy') {
      reps += 1;
      interval = interval === 0 ? 2 : Math.round(interval * ease_factor * 1.3);
      ease_factor = ease_factor + 0.05;
      nextReview = new Date(now.getTime() + interval * 24 * 60 * 60 * 1000);
    }

    const { error: updateError } = await supabase
      .from('user_flashcards')
      .update({
        interval,
        ease_factor,
        reps,
        lapses,
        last_review: now.toISOString(),
        next_review: nextReview.toISOString()
      })
      .eq('id', currentCard.id);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    const shouldIncrement = grade !== 'again';

    setQueue((prev) => {
      const next = [...prev];
      const [card] = next.splice(currentIndex, 1);
      if (grade === 'again' && card) {
        next.push(card);
      }
      return next;
    });
    if (shouldIncrement) {
      setReviewedCount((prevCount) => prevCount + 1);
      setDeckCounts((prev) => ({
        ...prev,
        [deck]: Math.max(0, (prev[deck] || 0) - 1)
      }));

      // Update today's study log count locally and in Supabase
      const nextCount = (todayLogCount || 0) + 1;
      setTodayLogCount(nextCount);
      setStudyLogs((prev) => {
        const updated = [...prev];
        let found = false;
        for (let i = 0; i < updated.length; i++) {
          if (normalizeToDayKey(updated[i].date || updated[i].study_date) === todayKey) {
            updated[i] = { ...updated[i], count: nextCount, id: updated[i].id || todayLogId };
            found = true;
            break;
          }
        }
        if (!found) {
          updated.push({ id: todayLogId, date: new Date().toISOString(), count: nextCount });
        }
        return updated;
      });

      let newLogId = todayLogId;
      if (todayLogId) {
        const { data: updatedLog, error: logErr } = await supabase
          .from('study_logs')
          .update({ count: nextCount })
          .eq('id', todayLogId)
          .select('id')
          .single();
        if (logErr) {
          console.error('Failed to update study log', logErr);
        } else if (updatedLog?.id) {
          newLogId = updatedLog.id;
        }
      } else {
        const { data: inserted, error: logErr } = await supabase
          .from('study_logs')
          .insert({ user_id: user.id, study_date: new Date().toISOString(), count: nextCount })
          .select('id, study_date, count')
          .single();
        if (logErr) {
          console.error('Failed to insert study log', logErr);
        } else if (inserted?.id) {
          newLogId = inserted.id;
          setStudyLogs((prev) => {
            const updated = [...prev];
            updated.push({ id: inserted.id, date: inserted.study_date, count: inserted.count ?? nextCount });
            return updated;
          });
        }
      }
      if (newLogId && newLogId !== todayLogId) {
        setTodayLogId(newLogId);
      }

      // Missions: review counts
      await bumpMissionProgress(user.id, 'review_1', 1);
      await bumpMissionProgress(user.id, 'review_10', 10);
    }
    setCurrentIndex(0);
  };

  const isFinished = useMemo(() => currentIndex >= queue.length, [currentIndex, queue.length]);

  const clampedReviewed = useMemo(
    () => Math.min(reviewedCount, sessionTotal || reviewedCount),
    [reviewedCount, sessionTotal]
  );

  const progressPct = useMemo(() => {
    if (!sessionTotal) return 0;
    return Math.round((clampedReviewed / sessionTotal) * 100);
  }, [clampedReviewed, sessionTotal]);

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
      const count = typeof log.count === 'number' ? log.count : 0;
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
      const count = typeof log.count === 'number' ? log.count : 0;
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

  const titleForValue = (value) => {
    if (!value) return '';
    const count = typeof value.count === 'number' ? value.count : 0;
    const dateLabel = value.date ? format(parseISO(value.date), 'EEEE, MMMM d, yyyy') : '';
    return `${count} cards reviewed on ${dateLabel}`;
  };

  const formatInterval = (minutesTotal) => {
    if (minutesTotal < 60) return `<${Math.max(1, Math.round(minutesTotal))}m`;
    const days = minutesTotal / (60 * 24);
    if (days < 1.5) return `${Math.round(minutesTotal / 60)}h`;
    return `${Math.round(days)}d`;
  };

  const previews = useMemo(() => {
    if (!currentCard) return {};
    const { interval = 0, ease_factor = 2.5 } = currentCard;
    return {
      again: '<10m',
      hard: formatInterval((interval === 0 ? 1 : Math.max(1, Math.round(interval * 1.2))) * 24 * 60),
      good: formatInterval((interval === 0 ? 1 : Math.round(interval * ease_factor)) * 24 * 60),
      easy: formatInterval((interval === 0 ? 2 : Math.round(interval * ease_factor * 1.3)) * 24 * 60),
    };
  }, [currentCard]);

  if (loading) return <div className="app-container">Loading daily flashcards...</div>;

  // Deck selection screen
  if (!deck) {
    return (
      <div className="app-container">
        <h1 className="main-title">Study</h1>
        <div className="finished-container study-select">
          <h2>Select a deck</h2>
          <div className="deck-row">
            <button className="link-button" onClick={() => navigate('/study?deck=translate')}>
              Translate:
            </button>
            <span className="due-count">{deckCounts.translate}</span> due
          </div>
          <div className="deck-row">
            <button className="link-button" onClick={() => navigate('/study?deck=pinyin')}>
              Pinyin:
            </button>
            <span className="due-count">{deckCounts.pinyin}</span> due
          </div>
        </div>

        <div className={`heatmap-card theme-${heatmapTheme}`}>
          <div className="heatmap-header">
            <div className="heatmap-nav">
              <button className="nav-btn" aria-label="Previous">{'<'}</button>
              <button className="nav-btn" aria-label="Today">o</button>
              <button className="nav-btn" aria-label="Next">{'>'}</button>
            </div>
            <div className="heatmap-gear">
              <button
                className="gear-btn"
                aria-label="Heatmap settings"
                onClick={() => setShowThemeMenu((prev) => !prev)}
              >
                ⚙
              </button>
              {showThemeMenu && (
                <div className="theme-menu">
                  <div className="menu-section">
                    <div className="menu-label">Color scheme</div>
                    {['flame', 'ice'].map((theme) => (
                      <button
                        key={theme}
                        className={`${heatmapTheme === theme ? 'active' : ''} theme-${theme}`}
                        onClick={() => {
                          setHeatmapTheme(theme);
                          setShowThemeMenu(false);
                        }}
                      >
                        {theme === 'flame' ? 'Flame' : 'Ice'}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          {heatmapLoading ? (
            <div className="heatmap-loading">Loading heatmap...</div>
          ) : (
            <>
              <CalendarHeatmap
                startDate={subDays(new Date(), 364)}
                endDate={new Date()}
                values={heatmapValues}
                showMonthLabels={false}
                titleForValue={titleForValue}
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
            </>
          )}
        </div>
      </div>
    );
  }

  if (!isAuthed) {
    return (
      <div className="app-container">
        <h1 className="main-title">Daily Flashcards</h1>
        <div className="finished-container">
          <h2>Login required</h2>
          <p>Please log in to access this deck.</p>
        </div>
      </div>
    );
  }

  if (!queue.length && sessionTotal === 0) {
    return (
      <div className="app-container">
        <div className="study-header">
          <button className="nav-btn" onClick={() => navigate('/study')}>← Back</button>
        </div>
        <h1 className="main-title">{deck === 'pinyin' ? 'Pinyin Review' : 'Translate Review'}</h1>
        <div className="finished-container">
          <h2>All caught up</h2>
          <p>You have no cards due right now.</p>
        </div>
      </div>
    );
  }

  if ((isFinished || (!currentCard && !loading)) && sessionTotal > 0) {
    return (
      <div className="app-container">
        <div className="study-header">
          <button className="nav-btn" onClick={() => navigate('/study')}>← Back</button>
        </div>
        <h1 className="main-title">{deck === 'pinyin' ? 'Pinyin Review' : 'Translate Review'}</h1>
        <div className="finished-container">
          <h2>All done for now</h2>
          <p>You reviewed {sessionTotal} cards.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="study-header">
        <button className="nav-btn" onClick={() => navigate('/study')}>← Back</button>
      </div>
      <h1 className="main-title">{deck === 'pinyin' ? 'Pinyin Review' : 'Translate Review'}</h1>

      {error && <div className="error-msg">{error}</div>}

      {currentCard && (
        <>
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${progressPct}%` }} />
          </div>
          <div className="progress-text">
            {clampedReviewed}/{sessionTotal} reviewed
          </div>

          {currentCard.card_type === 'pinyin' ? (
            <>
              <div className="quiz-container">
                <div className="quiz-card">
                  <h2 className="chinese-char">{currentCard.hanzi}</h2>
                </div>
                <div className="quiz-form">
                  <input
                    type="text"
                    className={`quiz-input ${answerStatus === 'correct' ? 'correct' : answerStatus === 'error' ? 'error' : ''}`}
                    value={typedAnswer}
                    onChange={(e) => setTypedAnswer(e.target.value)}
                    placeholder="Type pinyin..."
                  />
                  <button
                    className="quiz-submit-btn"
                    onClick={() => {
                      const userAns = typedAnswer.trim().toLowerCase();
                      const correctNum = (currentCard.pinyinNum || '').toLowerCase();
                      const correctTone = (currentCard.pinyin || '').toLowerCase();
                      if (userAns && (userAns === correctNum || userAns === correctTone)) {
                        setAnswerStatus('correct');
                      } else {
                        setAnswerStatus('error');
                      }
                    }}
                  >
                    Check
                  </button>
                </div>
                {answerStatus === 'correct' && (
                  <div className="quiz-feedback success">Correct! {currentCard.pinyin}</div>
                )}
                {answerStatus === 'error' && (
                  <div className="quiz-feedback error">Not quite. Try again or grade it.</div>
                )}
              </div>
              <div className="button-container">
                <button className="nav-btn" onClick={() => handleGrade('again')}>
                  <div className="srs-label">{previews.again}</div>
                  Again
                </button>
                <button className="nav-btn" onClick={() => handleGrade('hard')}>
                  <div className="srs-label">{previews.hard}</div>
                  Hard
                </button>
                <button className="nav-btn" onClick={() => handleGrade('good')}>
                  <div className="srs-label">{previews.good}</div>
                  Good
                </button>
                <button className="nav-btn" onClick={() => handleGrade('easy')}>
                  <div className="srs-label">{previews.easy}</div>
                  Easy
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flashcard-container">
                <Flashcard
                  key={currentCard.id || `${currentCard.lesson_id}-${currentCard.word_id}-${currentIndex}`}
                  cardData={currentCard}
                  isFlipped={isFlipped}
                  toggleFlip={() => setIsFlipped((prev) => !prev)}
                />
              </div>
              <div className="button-container">
                <button className="nav-btn" onClick={() => handleGrade('again')}>
                  <div className="srs-label">{previews.again}</div>
                  Again
                </button>
                <button className="nav-btn" onClick={() => handleGrade('hard')}>
                  <div className="srs-label">{previews.hard}</div>
                  Hard
                </button>
                <button className="nav-btn" onClick={() => handleGrade('good')}>
                  <div className="srs-label">{previews.good}</div>
                  Good
                </button>
                <button className="nav-btn" onClick={() => handleGrade('easy')}>
                  <div className="srs-label">{previews.easy}</div>
                  Easy
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
