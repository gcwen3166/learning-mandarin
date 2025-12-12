import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '../supabaseClient';

const MISSION_DEFS = [
  { code: 'login_once', title: 'First Login', description: 'Log in to the website', target: 1, rewardLabel: '+10 pts', rewardPoints: 10 },
  { code: 'review_1', title: 'Quick Warmup', description: 'Review 1 flashcard', target: 1, rewardLabel: '+5 pts', rewardPoints: 5 },
  { code: 'review_10', title: 'Getting Serious', description: 'Review 10 flashcards', target: 10, rewardLabel: '+20 pts', rewardPoints: 20 },
];

export default function Missions() {
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [claiming, setClaiming] = useState({});

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (!user) {
        setLoading(false);
        return;
      }
      const { data, error: fetchErr } = await supabase
        .from('user_missions')
        .select('mission_code, progress, completed, claimed');
      if (fetchErr) {
        setError(fetchErr.message);
      } else {
        const map = {};
        (data || []).forEach((row) => {
          map[row.mission_code] = row;
        });
        setProgress(map);
      }
      setLoading(false);
    };
    init();
  }, []);

  const rows = useMemo(() => {
    return MISSION_DEFS.map((def) => {
      const row = progress[def.code] || {};
      const prog = Math.min(def.target, row.progress || 0);
      const pct = Math.round((prog / def.target) * 100);
      return {
        ...def,
        progress: prog,
        pct,
        completed: !!row.completed,
        claimed: !!row.claimed
      };
    });
  }, [progress]);

  const totalPoints = useMemo(() => {
    return rows
      .filter((m) => m.claimed)
      .reduce((sum, m) => sum + (m.rewardPoints || 0), 0);
  }, [rows]);

  const handleClaim = async (code) => {
    if (!user) return;
    setClaiming((prev) => ({ ...prev, [code]: true }));
    try {
      const { error: updateErr } = await supabase
        .from('user_missions')
        .update({ claimed: true })
        .eq('user_id', user.id)
        .eq('mission_code', code);
      if (updateErr) {
        setError(updateErr.message);
      } else {
        setProgress((prev) => ({
          ...prev,
          [code]: { ...(prev[code] || {}), claimed: true }
        }));
      }
    } finally {
      setClaiming((prev) => ({ ...prev, [code]: false }));
    }
  };

  if (loading) return <div className="app-container">Loading missions...</div>;
  if (!user) {
    return (
      <div className="app-container">
        <h1 className="main-title">Missions</h1>
        <div className="finished-container">
          <h2>Login required</h2>
          <p>Please log in to view and claim missions.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container missions-container">
      <h1 className="main-title">Missions</h1>
      <div className="missions-summary">
        <div className="summary-card">
          <div className="summary-label">Total points</div>
          <div className="summary-value">{totalPoints}</div>
        </div>
      </div>
      {error && <div className="error-msg">{error}</div>}
      <div className="missions-grid">
        {rows.map((m) => (
          <div key={m.code} className="mission-card">
            <div className="mission-header">
              <div>
                <h3>{m.title}</h3>
                <p className="mission-desc">{m.description}</p>
              </div>
              <span className="mission-reward">{m.rewardLabel}</span>
            </div>
            <div className="mission-progress">
              <div className="mission-progress-bar">
                <div className="mission-progress-fill" style={{ width: `${m.pct}%` }} />
              </div>
              <div className="mission-progress-text">
                {m.progress}/{m.target} ({m.pct}%)
              </div>
            </div>
            <div className="mission-status">
              {m.completed ? <span className="status complete">Completed</span> : <span className="status inprogress">In progress</span>}
              {m.completed && !m.claimed && (
                <button
                  className="claim-btn"
                  disabled={!!claiming[m.code]}
                  onClick={() => handleClaim(m.code)}
                >
                  {claiming[m.code] ? 'Claiming...' : 'Claim reward'}
                </button>
              )}
              {m.claimed && <span className="status claimed">Claimed</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
