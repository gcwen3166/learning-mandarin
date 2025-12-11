import React, { useEffect, useMemo, useState } from 'react';
import Flashcard from './Flashcard';
import { supabase } from '../supabaseClient';
import { lessonsData } from '../data';

export default function DailyReview() {
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionTotal, setSessionTotal] = useState(0);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [isAuthed, setIsAuthed] = useState(true);

  const wordMap = useMemo(() => {
    const map = new Map();
    lessonsData.forEach((lesson) => {
      (lesson.words || []).forEach((w) => {
        const compositeWordId = Number(lesson.id) * 1000 + Number(w.id);
        map.set(compositeWordId, w);
      });
    });
    return map;
  }, []);

  const currentCard = queue[currentIndex];

  useEffect(() => {
    const loadDueCards = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setIsAuthed(false);
          setQueue([]);
          return;
        }
        setIsAuthed(true);

        const now = new Date().toISOString();
        const { data, error: fetchError } = await supabase
          .from('user_flashcards')
          .select('*')
          .eq('user_id', user.id)
          .lte('next_review', now)
          .order('next_review', { ascending: true })
          .limit(50);

        if (fetchError) throw fetchError;
        const cards = (data || []).map((card) => {
          const word = wordMap.get(card.word_id);
          return word ? { ...word, ...card } : card;
        });
        setQueue(cards);
        setCurrentIndex(0);
        setIsFlipped(false);
        setSessionTotal(cards.length);
        setReviewedCount(0);
      } catch (err) {
        setError(err.message || 'Unable to load cards');
      } finally {
        setLoading(false);
      }
    };

    loadDueCards();
  }, []);

  const handleGrade = async (grade) => {
    if (!currentCard) return;

    const now = new Date();
    let { interval = 0, ease_factor = 2.5, reps = 0, lapses = 0 } = currentCard;
    let nextReview = now;

    if (grade === 'again') {
      interval = 0;
      reps = 0;
      lapses += 1;
      ease_factor = Math.max(1.3, ease_factor - 0.2);
      nextReview = new Date(now.getTime() + 10 * 60 * 1000); // 10 minutes
    } else if (grade === 'hard') {
      reps = Math.max(1, reps); // don't reset reps, but don't advance much
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

    // advance locally
    if (grade === 'again') {
      // Requeue the card to the end; do NOT advance progress count
      setQueue((prev) => {
        const next = [...prev];
        const [card] = next.splice(currentIndex, 1);
        if (card) next.push(card);
        return next;
      });
      setCurrentIndex((prev) => Math.min(prev, Math.max(0, queue.length - 1)));
    } else {
      // Remove the graded card and advance progress
      setQueue((prev) => {
        const next = [...prev];
        next.splice(currentIndex, 1);
        return next;
      });
      setCurrentIndex(0);
      setReviewedCount((prev) => prev + 1);
    }
    setIsFlipped(false);
  };

  const isFinished = useMemo(() => currentIndex >= queue.length, [currentIndex, queue.length]);
  const progressPct = useMemo(() => {
    if (!sessionTotal) return 0;
    const completed = Math.min(reviewedCount, sessionTotal);
    return Math.round((completed / sessionTotal) * 100);
  }, [reviewedCount, sessionTotal]);

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

  if (!queue.length && !error && sessionTotal === 0) {
    return (
      <div className="app-container">
        <h1 className="main-title">Daily Flashcards</h1>
        {!isAuthed ? (
          <div className="finished-container">
            <h2>Login required</h2>
            <p>Please log in to access Daily Flashcards.</p>
          </div>
        ) : (
          <div className="finished-container">
            <h2>All caught up</h2>
            <p>You have no cards due right now.</p>
          </div>
        )}
      </div>
    );
  }

  if ((isFinished || (!currentCard && !loading)) && sessionTotal > 0) {
    return (
      <div className="app-container">
        <h1 className="main-title">Daily Flashcards</h1>
        <div className="finished-container">
          <h2>All done for now</h2>
          <p>You reviewed {sessionTotal} cards.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <h1 className="main-title">Daily Flashcards</h1>

      {error && <div className="error-msg">{error}</div>}

      {!queue.length && !error && sessionTotal === 0 && (
        <div className="finished-container">
          <h2>All caught up</h2>
          <p>You have no cards due right now.</p>
        </div>
      )}

      {!isFinished && currentCard && (
        <>
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${progressPct}%` }} />
          </div>
          <div className="progress-text">
            {reviewedCount}/{sessionTotal} reviewed
          </div>
          <div className="flashcard-container">
            <Flashcard
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

      {isFinished && sessionTotal > 0 && (
        <div className="finished-container">
          <h2>All done for now</h2>
          <p>You reviewed {sessionTotal} cards.</p>
        </div>
      )}

      {/* Fallback if no card is current but we’re not loading */}
      {!loading && !error && !currentCard && sessionTotal > 0 && (
        <div className="finished-container">
          <h2>All done for now</h2>
          <p>You reviewed {sessionTotal} cards.</p>
        </div>
      )}
    </div>
  );
}
