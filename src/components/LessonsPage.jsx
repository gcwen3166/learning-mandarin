import React from 'react';
import { Link } from 'react-router-dom';
import { lessonsData } from '../data'; // Import the data we just created

function LessonsPage() {
  return (
    <div className="app-container">
      <h1 className="main-title">Choose a Lesson</h1>
      <div className="lessons-grid">
        {lessonsData.map((lesson) => (
          <div key={lesson.id} className="lesson-card">
            <h2>{lesson.title}</h2>
            <p>{lesson.description}</p>
            {/* Link to the study page with the specific ID */}
            <Link to={`/study/${lesson.id}`}>
              <button className="start-btn">Start Lesson</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LessonsPage;