import React from 'react';
import AudioButton from './AudioButton';

export default function Flashcard({ cardData, isFlipped, toggleFlip }) {
  
  if (!cardData) {
    return <div className="flashcard">Loading...</div>;
  }

  // Helper to Bold the Target Word in the Sentence
  const highlightText = (sentence, target) => {
    if (!sentence || !target) return sentence;
    const parts = sentence.split(target);
    return (
      <span>
        {parts.map((part, i) => (
          <React.Fragment key={i}>
            {part}
            {i < parts.length - 1 && <strong className="highlight">{target}</strong>}
          </React.Fragment>
        ))}
      </span>
    );
  };

  return (
    <div 
      className={`flashcard ${isFlipped ? "flipped" : ""}`} 
      onClick={toggleFlip}
    >
      {/* Front Side */}
      <div className="front">
        <AudioButton text={cardData.hanzi} size="large" className="audio-btn" />
        <div className="card-content">
          <h2 className="chinese-char">{cardData.hanzi}</h2>
          <p className="pinyin">({cardData.pinyin})</p>
        </div>
        <p className="hint">Click to flip</p>
      </div>

      {/* Back Side */}
      <div className="back">
        <div className="def-section">
          <h2 className="english-text">{cardData.english}</h2>
        </div>

        {/* Example Sentence Section */}
        {cardData.exampleHanzi && (
          <div className="example-section" onClick={(e) => e.stopPropagation()}>
            <hr className="divider"/>
            <div className="example-row">
              <p className="ex-hanzi">
                {highlightText(cardData.exampleHanzi, cardData.hanzi)}
              </p>
              <AudioButton text={cardData.exampleHanzi} size="small" />
            </div>
            <p className="ex-pinyin">{cardData.examplePinyin}</p>
            <p className="ex-english">{cardData.exampleEnglish}</p>
          </div>
        )}
      </div>
    </div>
  );
}