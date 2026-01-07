'use client';

import { StrengthResult } from '@/utils/scoring';

interface TipsProps {
  result: StrengthResult;
  presenterMode: boolean;
  highContrast: boolean;
}

/**
 * Tips panel showing top suggestions based on password weaknesses.
 */
export default function Tips({
  result,
  presenterMode,
  highContrast,
}: TipsProps) {
  const { suggestions } = result;

  const textClasses = highContrast ? 'text-white' : 'text-gray-900';
  const mutedClasses = highContrast ? 'text-gray-300' : 'text-gray-600';

  return (
    <div className="space-y-4">
      <h3
        className={`font-semibold ${textClasses} ${
          presenterMode ? 'text-presenter-lg' : 'text-lg'
        }`}
      >
        Tips to Improve
      </h3>

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
