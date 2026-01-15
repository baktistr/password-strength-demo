'use client';

import { StrengthResult } from '@/utils/scoring';

interface StrengthBarProps {
  result: StrengthResult;
  presenterMode: boolean;
  highContrast: boolean;
}

/**
 * Visual strength bar with score, label, and crack time estimate.
 * Uses both color and text for accessibility.
 */
export default function StrengthBar({
  result,
  presenterMode,
  highContrast,
}: StrengthBarProps) {
  // Color mapping for the bar
  const getBarColor = (score: number): string => {
    if (score < 20) return highContrast ? 'bg-red-500' : 'bg-red-600';
    if (score < 40) return highContrast ? 'bg-orange-400' : 'bg-orange-500';
    if (score < 60) return highContrast ? 'bg-yellow-400' : 'bg-yellow-500';
    if (score < 80) return highContrast ? 'bg-green-400' : 'bg-green-500';
    return highContrast ? 'bg-emerald-400' : 'bg-emerald-600';
  };

  const textClasses = highContrast ? 'text-white' : 'text-gray-900';
  const mutedClasses = highContrast ? 'text-gray-300' : 'text-gray-600';

  return (
    <div className="space-y-3">
      {/* Score and Label */}
      <div className="flex justify-between items-baseline">
        <div>
          <span
            className={`font-bold ${textClasses} ${
              presenterMode ? 'text-presenter-xl' : 'text-3xl'
            }`}
          >
            {result.score}
          </span>
          <span
            className={`${mutedClasses} ${
              presenterMode ? 'text-presenter-sm' : 'text-sm'
            } ml-1`}
          >
            / 100
          </span>
        </div>
        <span
          className={`font-semibold ${textClasses} ${
            presenterMode ? 'text-presenter-lg' : 'text-xl'
          }`}
          aria-live="polite"
        >
          {result.label}
        </span>
      </div>

      {/* Progress Bar */}
      <div
        className={`h-6 rounded-full overflow-hidden ${
          highContrast ? 'bg-gray-700' : 'bg-gray-200'
        }`}
        role="progressbar"
        aria-valuenow={result.score}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Password strength: ${result.score} out of 100, ${result.label}`}
      >
        <div
          className={`h-full transition-all duration-500 ease-out ${getBarColor(
            result.score
          )} ${result.score > 0 ? 'animate-strength' : ''}`}
          style={{ width: `${result.score}%` }}
        />
      </div>

      {/* Text label below bar for accessibility */}
      <div
        className={`flex justify-between ${
          presenterMode ? 'text-presenter-sm' : 'text-xs'
        } ${mutedClasses}`}
      >
        <span>Very weak</span>
        <span>Weak</span>
        <span>OK</span>
        <span>Strong</span>
        <span>Very strong</span>
      </div>

      {/* Crack Time Estimate & Patterns Detected */}
      {result.characterAnalysis.length > 0 && (
        <div className="flex items-center gap-4 mt-4">
          {/* Crack Time */}
          <div
            className={`flex-1 p-3 rounded-lg ${
              highContrast
                ? 'bg-gray-800 border border-gray-600'
                : 'bg-gray-50 border border-gray-200'
            }`}
          >
            <p
              className={`${mutedClasses} ${
                presenterMode ? 'text-sm' : 'text-xs'
              }`}
            >
              Estimated crack time
            </p>
            <p
              className={`font-mono font-bold ${textClasses} ${
                presenterMode ? 'text-presenter-sm' : 'text-sm'
              }`}
            >
              {result.crackTimeCategory}
            </p>
          </div>

          {/* Patterns Detected */}
          <div
            className={`flex-1 p-3 rounded-lg ${
              result.patterns.length > 0
                ? highContrast
                  ? 'bg-red-900/50 border border-red-600'
                  : 'bg-red-50 border border-red-200'
                : highContrast
                  ? 'bg-green-900/50 border border-green-600'
                  : 'bg-green-50 border border-green-200'
            }`}
          >
            <p
              className={`${mutedClasses} ${
                presenterMode ? 'text-sm' : 'text-xs'
              }`}
            >
              Patterns detected
            </p>
            <p
              className={`font-bold ${
                result.patterns.length > 0
                  ? highContrast
                    ? 'text-red-400'
                    : 'text-red-600'
                  : highContrast
                    ? 'text-green-400'
                    : 'text-green-600'
              } ${presenterMode ? 'text-presenter-sm' : 'text-sm'}`}
            >
              {result.patterns.length > 0
                ? `⚠️ ${result.patterns.length} ${result.patterns.length === 1 ? 'issue' : 'issues'}`
                : '✓ None found'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
