'use client';

import { StrengthResult } from '@/utils/scoring';

interface TipsProps {
  result: StrengthResult;
  presenterMode: boolean;
  highContrast: boolean;
  onUseSuggestion?: (suggestion: string) => void;
}

/**
 * Tips panel showing top suggestions based on password weaknesses.
 */
export default function Tips({
  result,
  presenterMode,
  highContrast,
  onUseSuggestion,
}: TipsProps) {
  const { suggestions, betterChoice } = result;

  const textClasses = highContrast ? 'text-white' : 'text-gray-900';
  const mutedClasses = highContrast ? 'text-gray-300' : 'text-gray-600';

  const handleUseSuggestion = () => {
    if (betterChoice && onUseSuggestion) {
      onUseSuggestion(betterChoice);
    }
  };

  return (
    <div className="space-y-4">
      <h3
        className={`font-semibold ${textClasses} ${
          presenterMode ? 'text-presenter-lg' : 'text-lg'
        }`}
      >
        Tips to Improve
      </h3>

      {/* Better Choice Suggestion */}
      {betterChoice && (
        <div
          className={`p-4 rounded-lg border-2 ${
            highContrast
              ? 'bg-green-900/50 border-green-400'
              : 'bg-green-50 border-green-300'
          }`}
        >
          <div className={`font-semibold mb-2 ${highContrast ? 'text-green-300' : 'text-green-700'} ${presenterMode ? 'text-presenter-base' : 'text-base'}`}>
            A better choice:
          </div>
          <button
            onClick={handleUseSuggestion}
            className={`block w-full text-left px-3 py-2 rounded font-mono cursor-pointer transition-all ${
              highContrast
                ? 'bg-gray-800 text-green-300 hover:bg-gray-700 hover:ring-2 hover:ring-green-400'
                : 'bg-white text-green-800 border border-green-200 hover:bg-green-100 hover:ring-2 hover:ring-green-400'
            } ${presenterMode ? 'text-presenter-base' : 'text-base'}`}
            title="Click to use this password"
          >
            {betterChoice}
          </button>
          <p className={`mt-2 ${mutedClasses} ${presenterMode ? 'text-sm' : 'text-xs'}`}>
            Click to use this suggestion (scores 60+)
          </p>
        </div>
      )}

      <ol className="space-y-3">
        {suggestions.slice(0, 5).map((suggestion, index) => (
          <li
            key={index}
            className={`flex items-start gap-3 p-3 rounded-lg ${
              highContrast
                ? 'bg-gray-800 border border-gray-600'
                : 'bg-gray-50 border border-gray-200'
            }`}
          >
            <span
              className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-bold
                ${highContrast ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'}
                ${presenterMode ? 'text-lg' : 'text-sm'}`}
              aria-hidden="true"
            >
              {index + 1}
            </span>
            <p
              className={`${textClasses} ${
                presenterMode ? 'text-presenter-sm' : 'text-sm'
              }`}
            >
              {suggestion}
            </p>
          </li>
        ))}
      </ol>

      {/* Key recommendations box */}
      <div
        className={`mt-6 p-4 rounded-lg ${
          highContrast
            ? 'bg-blue-900/50 border-2 border-blue-400'
            : 'bg-blue-50 border-2 border-blue-200'
        }`}
      >
        <h4
          className={`font-semibold mb-3 ${textClasses} ${
            presenterMode ? 'text-presenter-base' : 'text-base'
          }`}
        >
          Key Recommendations
        </h4>
        <ul className={`space-y-2 ${mutedClasses} ${presenterMode ? 'text-presenter-sm' : 'text-sm'}`}>
          <li className="flex items-start gap-2">
            <span aria-hidden="true">[Lock]</span>
            <span>
              <strong>Password Manager:</strong> Use one to generate and store
              unique passwords for every account (e.g., Bitwarden, 1Password,
              or your browser&apos;s built-in manager)
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span aria-hidden="true">[Phone]</span>
            <span>
              <strong>Two-Factor Authentication (MFA/2FA):</strong> Enable it
              everywhere possible. Even if your password is compromised,
              attackers can&apos;t access your account without the second factor.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span aria-hidden="true">[Refresh]</span>
            <span>
              <strong>Unique Passwords:</strong> Never reuse passwords across
              sites. If one site gets breached, your other accounts stay safe.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
