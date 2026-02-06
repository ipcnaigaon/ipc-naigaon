/**
 * Launch Screen Component
 * Displays a beautiful loading screen with progress bar and bible verses
 */

import React, { useState, useEffect } from 'react';
import './LaunchScreen.css';

const BIBLE_VERSES = [
  '"For where two or three gather in my name, there am I with them." - Matthew 18:20',
  '"Trust in the Lord with all your heart and lean not on your own understanding." - Proverbs 3:5',
  '"I can do all this through him who gives me strength." - Philippians 4:13',
  '"The Lord is my light and my salvation—whom shall I fear?" - Psalm 27:1',
  '"Love one another as I have loved you." - John 13:34',
  '"Therefore do not worry about tomorrow, for tomorrow will worry about itself." - Matthew 6:34',
  '"Commit to the Lord whatever you do, and your plans will succeed." - Proverbs 16:3',
  '"Peace I leave with you; my peace I give you." - John 14:27',
  '"But seek first his kingdom and his righteousness, and all these things will be given to you as well." - Matthew 6:33',
  '"Cast all your anxiety on him because he cares for you." - 1 Peter 5:7',
];

const LaunchScreen = ({ onLaunchComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showGlow, setShowGlow] = useState(false);

  // Progress bar animation
  useEffect(() => {
    if (isComplete) return;

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 30;
        return Math.min(newProgress, 100);
      });
    }, 600);

    return () => clearInterval(progressInterval);
  }, [isComplete]);

  // Bible verse rotation
  useEffect(() => {
    if (isComplete) return;

    const verseInterval = setInterval(() => {
      setCurrentVerseIndex(prev => (prev + 1) % BIBLE_VERSES.length);
    }, 2000);

    return () => clearInterval(verseInterval);
  }, [isComplete]);

  // Handle completion
  useEffect(() => {
    if (progress >= 100 && !isComplete) {
      setIsComplete(true);
      setShowGlow(true);
      
      // Show glowing animation for 2 seconds then transition
      const completeTimeout = setTimeout(() => {
        onLaunchComplete();
      }, 3000);

      return () => clearTimeout(completeTimeout);
    }
  }, [progress, isComplete, onLaunchComplete]);

  return (
    <div className={`launch-screen ${showGlow ? 'glow-complete' : ''}`}>
      {/* Glowing animated background */}
      <div className="launch-background">
        <div className="glow-circle glow-1"></div>
        <div className="glow-circle glow-2"></div>
        <div className="glow-circle glow-3"></div>
      </div>

      {/* Content */}
      <div className="launch-content">
        <div className="launch-logo">
          <span className="logo-cross">✝️</span>
        </div>

        <h1 className="launch-title">Indian Pentecostal Church of God</h1>
        <p className="launch-subtitle">Naigaon, Mumbai</p>

        {/* Bible Verse Display */}
        <div className="bible-verse-display">
          <p className="bible-verse">{BIBLE_VERSES[currentVerseIndex]}</p>
        </div>

        {/* Progress Bar */}
        <div className="launch-progress-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="progress-text">{Math.round(progress)}%</p>
        </div>

        {/* Loading Status */}
        <div className="launch-status">
          {!isComplete ? (
            <>
              <div className="spinner"></div>
              <p>Preparing your spiritual journey...</p>
            </>
          ) : (
            <>
              <p className="complete-text">Ready to begin</p>
              <div className="celebration-emoji">🙌 ✨ 🙏</div>
              <button className="launch-begin-btn" onClick={onLaunchComplete}>
                Begin Your Journey
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LaunchScreen;
