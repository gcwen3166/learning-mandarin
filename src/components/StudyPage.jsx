import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom';
import { lessonsData } from '../data';
import Flashcard from './Flashcard';
import AudioButton from './AudioButton';
import '../App.css';
import { supabase } from '../supabaseClient';

function StudyPage() {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  
  // Modes: "reading", "video", "vocab", "flashcards", "quiz"
  const [mode, setMode] = useState("reading"); 
  const [flipped, setFlipped] = useState(false);
  
  // --- STATES ---
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviewQueue, setReviewQueue] = useState([]); // The list of cards currently active
  const [starredIds, setStarredIds] = useState([]);   // List of IDs that are starred

  const markLessonComplete = async () => {
    // 1. Check User
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("Please log in to save progress!");
      return;
    }

    // 2. Mark Lesson as Done in DB
    const { error: lessonError } = await supabase
      .from('user_lessons')
      .upsert({ user_id: user.id, lesson_id: lesson.id });

    if (lessonError) console.error('Error marking lesson:', lessonError);

    // 3. Add Cards to Anki Deck
    // We map your lesson words to the database format
    // Use a composite word key to avoid collisions across lessons that reuse word ids
    const newCards = lesson.words.map(word => {
      // Use a composite to keep IDs unique across lessons
      const compositeWordId = Number(lesson.id) * 1000 + Number(word.id);
      return {
        user_id: user.id,
        word_id: compositeWordId,
        lesson_id: lesson.id,
        // Default Anki Settings:
        interval: 0,
        ease_factor: 2.5,
        reps: 0,
        lapses: 0,
        next_review: new Date().toISOString() // Due Immediately
      };
    });

    // "ignoreDuplicates" ensures we don't reset progress if they click it twice
    const { error: cardError } = await supabase
      .from('user_flashcards')
      // We added 'lesson_id' to the conflict check
      .upsert(newCards, { onConflict: 'user_id, word_id' });

    if (cardError) {
      console.error('Error adding cards:', cardError);
      alert("There was an issue adding cards to your daily review.");
    } else {
      alert("Lesson Complete! Cards added to your daily review.");
      // Optional: Redirect to Dashboard
    }
  };

  // Quiz States
  const [quizInput, setQuizInput] = useState("");
  const [quizStatus, setQuizStatus] = useState("guessing"); // 'guessing', 'correct', 'error', 'revealed'
  const [attempts, setAttempts] = useState(0);

  // --- HELPERS ---
  const currentWord = reviewQueue[currentIndex];
  const isFinished = currentIndex >= reviewQueue.length;
  
  const progress = reviewQueue.length > 0 
    ? ((currentIndex + 1) / reviewQueue.length) * 100 
    : 0;

  // Resets for navigation
  const resetQuiz = () => {
    setQuizInput("");
    setQuizStatus("guessing");
    setAttempts(0);
  };

  const nextCard = () => {
    setFlipped(false);
    resetQuiz();
    setCurrentIndex(currentIndex + 1);
  };

  const prevCard = () => {
    setFlipped(false);
    resetQuiz();
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Load Lesson Data
  useEffect(() => {
    const foundLesson = lessonsData.find(l => l.id === parseInt(id));
    setLesson(foundLesson);
    
    // Initialize queue with ALL words
    if (foundLesson && foundLesson.words) {
      setReviewQueue(foundLesson.words);
    }
    
    // Reset everything
    setCurrentIndex(0);
    setFlipped(false);
    setStarredIds([]); 
    setMode("reading"); 
    resetQuiz();
  }, [id]);

  if (!lesson) {
    return <div className="app-container"><h1>Lesson not found!</h1></div>;
  }

  // --- QUIZ LOGIC ---
  // --- QUIZ LOGIC ---
  const handleQuizSubmit = (e) => {
    e.preventDefault();
    
    // 1. Get what the user typed (cleaned up)
    const userAnswer = quizInput.trim().toLowerCase();
    
    // 2. Get BOTH correct answers
    // Answer A: Numbered (e.g., "ni3 hao3")
    const correctNum = currentWord.pinyinNum ? currentWord.pinyinNum.toLowerCase() : "";
    // Answer B: Toned (e.g., "nǐ hǎo")
    const correctTone = currentWord.pinyin ? currentWord.pinyin.toLowerCase() : "";

    // 3. Check if the user matched EITHER one
    if (userAnswer === correctNum || userAnswer === correctTone) {
      setQuizStatus("correct");
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setQuizInput("");
      if (newAttempts >= 3) {
        setQuizStatus("revealed");
      } else {
        setQuizStatus("error");
      }
    }
  };

  // --- STAR LOGIC ---
  const toggleStar = (wordId) => {
    setStarredIds(prev => {
      if (prev.includes(wordId)) return prev.filter(id => id !== wordId);
      return [...prev, wordId];
    });
  };
  const isCurrentStarred = currentWord && starredIds.includes(currentWord.id);

  // --- RESTART LOGIC ---
  const restartFullReview = () => {
    setReviewQueue(lesson.words);
    setCurrentIndex(0);
    setFlipped(false);
    resetQuiz();
  };

  const startStarredReview = () => {
    const starredWords = lesson.words.filter(word => starredIds.includes(word.id));
    setReviewQueue(starredWords);
    setCurrentIndex(0);
    setFlipped(false);
    resetQuiz();
  };

  return (
    <div className="app-container">
      <div className="study-page-wrapper">

        <div className="study-header">
          <Link to="/" className="back-link">← Back</Link>
        </div>

        <h1 className="lesson-title">{lesson.title}</h1>

        {/* Mode Switcher */}
        <div className="mode-switch">
          <button className={mode === "reading" ? "active" : ""} onClick={() => setMode("reading")}>📖 Read</button>
          <button className={mode === "video" ? "active" : ""} onClick={() => setMode("video")}>🎥 Video</button>
          <button className={mode === "vocab" ? "active" : ""} onClick={() => setMode("vocab")}>📝 Vocab</button>
          <button className={mode === "flashcards" ? "active" : ""} onClick={() => { setMode("flashcards"); restartFullReview(); }}>🗂️ Cards</button>
          <button className={mode === "quiz" ? "active" : ""} onClick={() => { setMode("quiz"); restartFullReview(); }}>✍️ Quiz</button>
        </div>

        {/* --- 1. READER MODE --- */}
        {/* --- 1. READER MODE --- */}
        {mode === "reading" && (
          <div className="text-reader-container">
            {lesson.content && lesson.content.map((line, index) => {
              
              if (line.type === "break") return <hr key={index} className="text-break"/>;
              
              // No audio for English headers
              if (line.type === "section-header") {
                return <h3 key={index} className="section-header">{line.english}</h3>;
              }

              // --- NEW: HANDLE CONNECT & COMPARE ---
              // --- HANDLE CONNECT & COMPARE (Flexible Groups) ---
              if (line.type === "compare-grid") {
                return (
                  <div key={index} className="compare-container">
                    {line.groups.map((group, groupIndex) => (
                      <div key={groupIndex} className="compare-pair">
                        {group.map((char, charIndex) => (
                          // We use a "Fragment" to group the Char + Divider
                          // <span key={charIndex}> is simpler if we don't need keys on fragments
                          <span key={charIndex} style={{ display: 'flex', alignItems: 'center' }}>
                            
                            <span className="compare-char">{char}</span>
                            
                            {/* Only show the divider if it's NOT the last item */}
                            {charIndex < group.length - 1 && (
                              <span className="compare-divider" style={{margin: '0 10px'}}>-</span>
                            )}
                            
                          </span>
                        ))}
                      </div>
                    ))}
                  </div>
                );
              }

              // --- NEW: HANDLE INFO BOX (Review Lessons) ---
              if (line.type === "info-box") {
                return (
                  <div key={index} className="info-box">
                    <p>🔔 {line.text}</p>
                  </div>
                );
              }

              if (line.type === "ruby-line" || line.type === "title") {
                const fullHanzi = line.segments.map(s => s.char).join('');
                
                return (
                  <div 
                    key={index} 
                    className="text-line ruby-container with-audio" 
                    // ONLY add title if english text exists and is not empty
                    title={line.english ? line.english : undefined}
                  >
                    <div className="text-content">
                      {line.segments.map((segment, i) => (
                        <ruby key={i}>
                          {segment.char}
                          <rt>{segment.py}</rt>
                        </ruby>
                      ))}
                    </div>
                    <AudioButton text={fullHanzi} size="small" />
                  </div>
                );
              }

              // --- STANDARD LINES (Notes, etc.) ---
              return (
                <div key={index} className={`text-line ${line.type} with-audio`} title={line.english}>
                  <div className="text-content">
                    <div className="pinyin-line">{line.pinyin}</div>
                    <div className="hanzi-line">{line.hanzi}</div>
                  </div>
                  {/* Add the AudioButton */}
                  <AudioButton text={line.hanzi} size="small" />
                </div>
              )
            })}
            <div className="finish-section">
              <button className="finish-btn" onClick={markLessonComplete}>
                ✅ Mark Lesson as Done & Add Cards
              </button>
            </div>
          </div>
        )}

        {/* --- 2. VIDEO MODE --- */}
        {mode === "video" && (
          <div className="lesson-video-container">
            {lesson.videoUrl ? (
              <div className="video-wrapper">
                <iframe src={lesson.videoUrl} title={lesson.title} frameBorder="0" allowFullScreen></iframe>
              </div>
            ) : (
              <div className="no-video-message"><h3>No video available</h3></div>
            )}
          </div>
        )}

        {/* --- 3. VOCAB MODE --- */}
        {/* --- 3. VOCAB MODE --- */}
        {mode === "vocab" && (
          <div className="vocab-list-container">
            {lesson.words.map((word) => (
              <div key={word.id} className="vocab-item">
                <div className="vocab-char">
                  {word.hanzi}
                  {/* ADD THIS LINE: */}
                  <AudioButton text={word.hanzi} size="small" />
                </div>
                <div className="vocab-pinyin">{word.pinyin}</div>
                <div className="vocab-english">{word.english}</div>
              </div>
            ))}
          </div>
        )}

        {/* --- 4. FLASHCARDS & QUIZ SHARED WRAPPER --- */}
        {(mode === "flashcards" || mode === "quiz") && (
          <>
            {isFinished ? (
              /* FINISHED SCREEN */
              <div className="finished-container">
                <h2>🎉 {mode === "quiz" ? "Quiz" : "Review"} Complete!</h2>
                <p>You went through {reviewQueue.length} items.</p>
                
                <div className="button-container finished-buttons">
                  <button className="reset-btn" onClick={restartFullReview}>
                    {mode === "quiz" ? "Restart Quiz" : "Restart Review"} ⟳
                  </button>
                  
                  {starredIds.length > 0 && (
                    <button className="star-review-btn" onClick={startStarredReview}>
                      {mode === "quiz" ? "Quiz" : "Review"} {starredIds.length} Starred Items ★
                    </button>
                  )}
                  
                  <Link to="/">
                    <button className="home-btn">Back to Lessons</button>
                  </Link>
                </div>
              </div>
            ) : (
              /* ACTIVE CARD SCREEN */
              <>
                <div className="progress-container">
                  <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                </div>
                
                {/* Header with Star Button (Visible in BOTH modes) */}
                <div className="card-header">
                  <span className="progress-text">{currentIndex + 1} / {reviewQueue.length}</span>
                  <button 
                    className={`star-btn ${isCurrentStarred ? "starred" : ""}`}
                    onClick={() => toggleStar(currentWord.id)}
                    title="Star this item to review later"
                  >
                    {isCurrentStarred ? "★" : "☆"}
                  </button>
                </div>
                
                {/* --- DISPLAY LOGIC --- */}
                {mode === "flashcards" ? (
                  /* FLASHCARD SPECIFIC */
                  <>
                    <div className="flashcard-container">
                        <Flashcard 
                            key={currentIndex} // <--- THE MAGIC FIX
                            cardData={currentWord} 
                            isFlipped={flipped} 
                            toggleFlip={() => setFlipped(!flipped)} 
                        />
                    </div>
                    <div className="button-container">
                      <button onClick={prevCard} disabled={currentIndex === 0} className="nav-btn">←</button>
                      <button onClick={nextCard} className="nav-btn">Next →</button>
                    </div>
                  </>
                ) : (
                  /* QUIZ SPECIFIC */
                  <div className="quiz-container">
                    <div className="quiz-card">
                      <h2 className="chinese-char">{currentWord.hanzi}</h2>
                    </div>
                    
                    <form onSubmit={handleQuizSubmit} className="quiz-form">
                      <p style={{ color: "#ff6b6b" }}>Type Pinyin (e.g. "ni3 hao3")</p>
                      
                      <input 
                        type="text" 
                        className={`quiz-input ${quizStatus}`}
                        value={quizInput}
                        onChange={(e) => setQuizInput(e.target.value)}
                        disabled={quizStatus === "correct" || quizStatus === "revealed"}
                        placeholder="Type pinyin..."
                        autoFocus
                      />
                      
                      <button 
                        type="submit" 
                        className="quiz-submit-btn"
                        disabled={quizStatus === "correct" || quizStatus === "revealed"}
                      >
                        Check
                      </button>
                    </form>

                    {/* Feedback Area */}
                    {quizStatus === "error" && (
                      <p className="quiz-feedback error">Incorrect. Try again! ({3 - attempts} left)</p>
                    )}
                    
                    {/* --- SUCCESS STATE (With Audio) --- */}
                    {quizStatus === "correct" && (
                      <div className="quiz-feedback success">
                        <div className="feedback-row">
                          <p>✅ Correct! {currentWord.pinyin}</p>
                          {/* Audio only appears here, after success */}
                          <AudioButton text={currentWord.hanzi} size="small" />
                        </div>
                        <button className="next-btn" onClick={nextCard}>Next Card →</button>
                      </div>
                    )}
                    
                    {/* --- REVEALED STATE (With Audio) --- */}
                    {quizStatus === "revealed" && (
                      <div className="quiz-feedback error">
                        <div className="feedback-row">
                          <p>❌ Answer: <strong>{currentWord.pinyin}</strong></p>
                          {/* Audio only appears here, after fail */}
                          <AudioButton text={currentWord.hanzi} size="small" />
                        </div>
                        <button className="next-btn" onClick={nextCard}>Next Card →</button>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </>
        )}

      </div> 
    </div>
  )
}

export default StudyPage
