'use client';

import { useState, useCallback } from 'react';
import PasswordMeter from '@/components/PasswordMeter';
import PresenterMode from '@/components/PresenterMode';
import ChallengeGame from '@/components/ChallengeGame';
import SpeakerNotes from '@/components/SpeakerNotes';

/**
 * Main page component for the Password Strength Meter demo.
 * Manages global state for presenter mode and high contrast settings.
 */
export default function Home() {
  // Presenter mode state
  const [presenterMode, setPresenterMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  // Active tab for navigation
  const [activeTab, setActiveTab] = useState<'meter' | 'challenge'>('meter');

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  // Build class names based on mode
  const containerClasses = `
    min-h-screen transition-all duration-300
    ${presenterMode ? 'presenter-mode' : ''}
    ${highContrast ? 'high-contrast bg-black' : 'bg-gray-50'}
    ${isFullscreen ? 'fullscreen-mode' : ''}
  `;

  const cardClasses = `
    card rounded-lg shadow-lg transition-all duration-300
    ${highContrast ? 'bg-gray-900 border-2 border-white' : 'bg-white border border-gray-200'}
    ${presenterMode ? 'p-8' : 'p-6'}
  `;

  const textClasses = highContrast ? 'text-white' : 'text-gray-900';
  const mutedTextClasses = highContrast ? 'text-gray-300' : 'text-gray-600';

  return (
    <div className={containerClasses}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1
            className={`font-bold mb-2 ${textClasses} ${
              presenterMode ? 'text-presenter-2xl' : 'text-3xl'
            }`}
          >
            Password Strength Meter
          </h1>
          <p
            className={`${mutedTextClasses} ${
              presenterMode ? 'text-presenter-base' : 'text-lg'
            }`}
          >
            Privacy Day Workshop Demo
          </p>
        </header>

        {/* Privacy Notice - Always visible */}
        <div
          className={`mb-6 p-4 rounded-lg border-2 ${
            highContrast
              ? 'bg-blue-900 border-blue-400 text-blue-100'
              : 'bg-blue-50 border-blue-200 text-blue-800'
          } ${presenterMode ? 'text-presenter-sm' : 'text-sm'}`}
          role="alert"
          aria-live="polite"
        >
          <strong className="font-semibold">Privacy First:</strong> This runs
          entirely in your browser. No data is ever sent or stored anywhere.
          <br />
          <span className="font-medium">
            Tip: Don&apos;t type a real password you actually use — this is for
            learning!
          </span>
        </div>

        {/* Presenter Controls */}
        <PresenterMode
          presenterMode={presenterMode}
          setPresenterMode={setPresenterMode}
          highContrast={highContrast}
          setHighContrast={setHighContrast}
          isFullscreen={isFullscreen}
          toggleFullscreen={toggleFullscreen}
          showNotes={showNotes}
          setShowNotes={setShowNotes}
        />

        {/* Speaker Notes Panel */}
        {showNotes && (
          <SpeakerNotes
            highContrast={highContrast}
            presenterMode={presenterMode}
          />
        )}

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6" role="tablist">
          <button
            role="tab"
            aria-selected={activeTab === 'meter'}
            aria-controls="meter-panel"
            onClick={() => setActiveTab('meter')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              presenterMode ? 'text-presenter-sm' : 'text-base'
            } ${
              activeTab === 'meter'
                ? highContrast
                  ? 'bg-white text-black'
                  : 'bg-blue-600 text-white'
                : highContrast
                  ? 'bg-gray-800 text-white border border-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Password Meter
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'challenge'}
            aria-controls="challenge-panel"
            onClick={() => setActiveTab('challenge')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              presenterMode ? 'text-presenter-sm' : 'text-base'
            } ${
              activeTab === 'challenge'
                ? highContrast
                  ? 'bg-white text-black'
                  : 'bg-blue-600 text-white'
                : highContrast
                  ? 'bg-gray-800 text-white border border-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Audience Challenge
          </button>
        </div>

        {/* Main Content */}
        <main>
          {activeTab === 'meter' && (
            <div
              id="meter-panel"
              role="tabpanel"
              aria-labelledby="meter-tab"
              className={cardClasses}
            >
              <PasswordMeter
                presenterMode={presenterMode}
                highContrast={highContrast}
              />
            </div>
          )}

          {activeTab === 'challenge' && (
            <div
              id="challenge-panel"
              role="tabpanel"
              aria-labelledby="challenge-tab"
              className={cardClasses}
            >
              <ChallengeGame
                presenterMode={presenterMode}
                highContrast={highContrast}
              />
            </div>
          )}
        </main>

        {/* Footer */}
        <footer
          className={`mt-8 text-center ${mutedTextClasses} ${
            presenterMode ? 'text-presenter-sm' : 'text-sm'
          }`}
        >
          <p>
            Built for educational purposes. Remember: use a password manager and
            enable MFA everywhere!
          </p>
        </footer>
      </div>
    </div>
  );
}
