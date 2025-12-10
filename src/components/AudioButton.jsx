import React from 'react';

// Added 'className' prop so parents can position this button
export default function AudioButton({ text, size = "small", className = "" }) {
  const playAudio = (e) => {
    e.stopPropagation(); 
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    window.speechSynthesis.speak(utterance);
  };

  // Inline styles for basic look
  const btnStyle = {
    background: 'none',
    border: '1px solid #ddd',
    borderRadius: '50%',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: size === "small" ? '0.8rem' : '1.2rem',
    width: size === "small" ? '24px' : '40px',
    height: size === "small" ? '24px' : '40px',
    marginLeft: '8px', // Default margin
    color: '#666',
    transition: 'all 0.2s',
    zIndex: 10
  };

  return (
    <button 
      className={className} // Apply the custom class here
      style={btnStyle} 
      onClick={playAudio} 
      title="Play Audio"
      onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
      onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
    >
      🔊
    </button>
  );
}