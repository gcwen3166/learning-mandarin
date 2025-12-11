import React from 'react';
import { Link } from 'react-router-dom';

export default function ProfessorPage() {
  return (
    <div className="app-container">
      <div className="bio-hero">
        <p className="eyebrow">Meet the Originator</p>
        <h1 className="bio-title">Professor Dai Ruqian</h1>
        <p className="bio-subtitle">
          Educational researcher and literacy innovator focused on fast, science-based Chinese character learning.
        </p>
      </div>

      <div className="bio-grid">
        <div className="bio-card">
          <h3>Why Listen To Him?</h3>
          <ul>
            <li>Researcher at China's Central Institute of Educational Science.</li>
            <li>Former senior title reviewer for the National Education Commission.</li>
            <li>Board member of the Educational Experiment Society; secretary-general of the Hanzi Culture Education Center.</li>
            <li>Authored 100+ papers and multiple teaching guides on literacy and curriculum reform.</li>
          </ul>
        </div>

        <div className="bio-card">
          <h3>Signature Contribution</h3>
          <p>
            Professor Dai champions a sequenced, high-efficiency character learning approach. By weaving rhyme-based
            memory, character structure cues, and frequency-driven sequencing, his method reports results like learning
            2,500 characters in about two years and writing 300-character short essays—giving learners a faster path to real reading.
          </p>
        </div>

        <div className="bio-card">
          <h3>What This Means For You</h3>
          <ul>
            <li>Character-first: focuses on character form, sound, and meaning together for stronger recall.</li>
            <li>Efficient sequencing: starts with the highest-frequency characters so you read real texts sooner.</li>
            <li>Integrated skills: reading, writing, and speaking reinforce each other.</li>
            <li>Evidence-minded: his work is cited by <em>People's Education</em> as a breakthrough for language teaching quality.</li>
          </ul>
        </div>

        <div className="bio-card">
          <h3>Publications & Roles</h3>
          <p>
            Lead author of China's first "Middle School Family Education" guide; chief editor of "Scientific Methods for
            Literacy Education"; co-author of "Practical Educational Experiment Methods"; and editor-in-chief for journals
            on curriculum and teaching research.
          </p>
        </div>

        <div className="bio-card">
          <h3>Guiding Idea</h3>
          <p>
            He argues that Chinese should have a language system built around the unique logic of Hanzi—treating characters
            as the core unit of reading and writing—so learners build literacy that is both fast and culturally grounded.
          </p>
        </div>
      </div>
    </div>
  );
}
