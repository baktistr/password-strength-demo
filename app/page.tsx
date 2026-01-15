'use client';

import { useState, useCallback } from 'react';
import PasswordMeterCompact from '@/components/PasswordMeterCompact';
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
    min-h-screen transition-all duration-300 flex flex-col
    ${presenterMode ? 'presenter-mode' : ''}
    ${highContrast ? 'high-contrast bg-black' : 'bg-gray-50'}
    ${isFullscreen ? 'fullscreen-mode' : ''}
  `;

  const cardClasses = `
    card rounded-lg shadow-lg transition-all duration-300 flex-1 overflow-auto
    ${highContrast ? 'bg-gray-900 border-2 border-white' : 'bg-white border border-gray-200'}
    ${presenterMode ? 'p-6' : 'p-4'}
  `;

  const textClasses = highContrast ? 'text-white' : 'text-gray-900';
  const mutedTextClasses = highContrast ? 'text-gray-300' : 'text-gray-600';

  return (
    <div className={containerClasses}>
      <div className="max-w-3xl mx-auto px-4 py-4 flex flex-col h-full">
        {/* Compact Header */}
        <header className="text-center mb-3 flex-shrink-0">
          <h1
            className={`font-bold ${textClasses} ${
              presenterMode ? 'text-presenter-xl' : 'text-2xl'
            }`}
          >
            Password Strength Meter
          </h1>
          <p
            className={`${mutedTextClasses} ${
              presenterMode ? 'text-presenter-sm' : 'text-sm'
            }`}
          >
            Privacy Day Workshop Demo
          </p>
        </header>

        {/* Compact Privacy Notice */}
        <div
          className={`mb-3 px-3 py-2 rounded-lg border flex-shrink-0 ${
            highContrast
              ? 'bg-blue-900 border-blue-400 text-blue-100'
              : 'bg-blue-50 border-blue-200 text-blue-800'
          } ${presenterMode ? 'text-sm' : 'text-xs'}`}
          role="alert"
        >
          <strong>🔒 Privacy First:</strong> Runs entirely in your browser. No data sent anywhere.
          <span className="ml-2 opacity-75">Don&apos;t use real passwords!</span>
        </div>

        {/* Presenter Controls - Collapsed by default */}
        <div className="flex-shrink-0 mb-3">
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
        </div>

        {/* Speaker Notes Panel */}
        {showNotes && (
          <div className="flex-shrink-0 mb-3">
            <SpeakerNotes
              highContrast={highContrast}
              presenterMode={presenterMode}
            />
          </div>
        )}

        {/* Tab Navigation - Compact */}
        <div className="flex gap-2 mb-3 flex-shrink-0" role="tablist">
          <button
            role="tab"
            aria-selected={activeTab === 'meter'}
            onClick={() => setActiveTab('meter')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              presenterMode ? 'text-sm' : 'text-sm'
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
            🔐 Password Meter
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'challenge'}
            onClick={() => setActiveTab('challenge')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              presenterMode ? 'text-sm' : 'text-sm'
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
            🎮 Challenge
          </button>
        </div>

        {/* Main Content - Fills remaining space */}
        <main className="flex-1 min-h-0">
          {activeTab === 'meter' && (
            <div className={cardClasses}>
              <PasswordMeterCompact
                presenterMode={presenterMode}
                highContrast={highContrast}
              />
            </div>
          )}

          {activeTab === 'challenge' && (
            <div className={cardClasses}>
              <ChallengeGame
                presenterMode={presenterMode}
                highContrast={highContrast}
              />
            </div>
          )}
        </main>

        {/* Compact Footer */}
        <footer
          className={`mt-2 text-center flex-shrink-0 ${mutedTextClasses} text-xs`}
        >
          Use a password manager + enable MFA! •{' '}
          <a
            href="https://github.com/baktistr/password-strength-demo"
            target="_blank"
            rel="noopener noreferrer"
            className={`underline ${highContrast ? 'text-blue-400' : 'text-blue-600'}`}
          >
            GitHub
          </a>
        </footer>
      </div>
    </div>
  );
}
