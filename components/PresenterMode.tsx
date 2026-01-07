'use client';

interface PresenterModeProps {
  presenterMode: boolean;
  setPresenterMode: (value: boolean) => void;
  highContrast: boolean;
  setHighContrast: (value: boolean) => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  showNotes: boolean;
  setShowNotes: (value: boolean) => void;
}

/**
 * Presenter mode controls for workshop settings.
 * Provides toggles for big typography, high contrast, and fullscreen.
 */
export default function PresenterMode({
  presenterMode,
  setPresenterMode,
  highContrast,
  setHighContrast,
  isFullscreen,
  toggleFullscreen,
  showNotes,
  setShowNotes,
}: PresenterModeProps) {
  const buttonClasses = (active: boolean) => `
    px-4 py-2 rounded-lg font-medium transition-all text-sm
    ${active
      ? highContrast
        ? 'bg-white text-black'
        : 'bg-blue-600 text-white'
      : highContrast
        ? 'bg-gray-800 text-white border border-gray-600 hover:bg-gray-700'
        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
    }
  `;

  return (
    <div
      className={`mb-6 p-4 rounded-lg ${
        highContrast
          ? 'bg-gray-900 border border-gray-700'
          : 'bg-gray-100 border border-gray-200'
      }`}
    >
      <div className="flex flex-wrap items-center gap-3">
        <span
          className={`font-medium ${
            highContrast ? 'text-white' : 'text-gray-700'
          } text-sm`}
        >
          Presenter Controls:
        </span>

        {/* Presenter Mode Toggle */}
        <button
          onClick={() => setPresenterMode(!presenterMode)}
          className={buttonClasses(presenterMode)}
          aria-pressed={presenterMode}
          aria-label={presenterMode ? 'Disable presenter mode' : 'Enable presenter mode'}
        >
          {presenterMode ? '[x] ' : '[ ] '}Big Text
        </button>

        {/* High Contrast Toggle */}
        <button
          onClick={() => setHighContrast(!highContrast)}
          className={buttonClasses(highContrast)}
          aria-pressed={highContrast}
          aria-label={highContrast ? 'Disable high contrast' : 'Enable high contrast'}
        >
          {highContrast ? '[x] ' : '[ ] '}High Contrast
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          className={buttonClasses(isFullscreen)}
          aria-pressed={isFullscreen}
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </button>

        {/* Speaker Notes Toggle */}
        <button
          onClick={() => setShowNotes(!showNotes)}
          className={buttonClasses(showNotes)}
          aria-pressed={showNotes}
          aria-expanded={showNotes}
          aria-label={showNotes ? 'Hide speaker notes' : 'Show speaker notes'}
        >
          {showNotes ? '[x] ' : '[ ] '}Speaker Notes
        </button>
      </div>
    </div>
  );
}
