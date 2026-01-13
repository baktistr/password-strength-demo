'use client';

import { StrengthResult } from '@/utils/scoring';
import { LENGTH_SCORES } from '@/utils/constants';

interface ChecklistProps {
  result: StrengthResult;
  presenterMode: boolean;
  highContrast: boolean;
}

/**
 * Live checklist showing password characteristics with friendly explanations.
 */
export default function Checklist({
  result,
  presenterMode,
  highContrast,
}: ChecklistProps) {
  const { characterAnalysis, patterns } = result;
  const { length, hasLowercase, hasUppercase, hasNumbers, hasSymbols } = characterAnalysis;

  // Style classes
  const itemClasses = `
    flex items-start gap-3 p-3 rounded-lg transition-all
    ${presenterMode ? 'text-presenter-sm' : 'text-sm'}
  `;

  const passClasses = highContrast
    ? 'bg-green-900/50 border border-green-500'
    : 'bg-green-50 border border-green-200';

  const failClasses = highContrast
    ? 'bg-gray-800 border border-gray-600'
    : 'bg-gray-50 border border-gray-200';

  const warnClasses = highContrast
    ? 'bg-orange-900/50 border border-orange-500'
    : 'bg-orange-50 border border-orange-200';

  const textClasses = highContrast ? 'text-white' : 'text-gray-900';
  const mutedClasses = highContrast ? 'text-gray-300' : 'text-gray-600';

  // Check icon component
  const CheckIcon = ({ pass }: { pass: boolean }) => (
    <span
      className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center font-bold
        ${pass
          ? highContrast ? 'bg-green-500 text-black' : 'bg-green-500 text-white'
          : highContrast ? 'bg-gray-600 text-gray-300' : 'bg-gray-300 text-gray-600'
        }`}
      aria-hidden="true"
    >
      {pass ? '✓' : '–'}
    </span>
  );

  return (
    <div className="space-y-3">
      <h3
        className={`font-semibold ${textClasses} ${
          presenterMode ? 'text-presenter-lg' : 'text-lg'
        }`}
      >
        Password Checklist
      </h3>

      <div className="space-y-2">
        {/* Length checks - emphasized as most important */}
        <div className={`${itemClasses} ${length >= 8 ? passClasses : failClasses}`}>
          <CheckIcon pass={length >= 8} />
          <div>
            <p className={textClasses}>
              <strong>At least 8 characters</strong>
              {length > 0 && (
                <span className={mutedClasses}> (currently {length})</span>
              )}
            </p>
            <p className={`${mutedClasses} ${presenterMode ? 'text-sm' : 'text-xs'}`}>
              Absolute minimum — but you should aim higher!
            </p>
          </div>
        </div>

        <div className={`${itemClasses} ${length >= LENGTH_SCORES.GOOD_LENGTH ? passClasses : failClasses}`}>
          <CheckIcon pass={length >= LENGTH_SCORES.GOOD_LENGTH} />
          <div>
            <p className={textClasses}>
              <strong>12+ characters</strong>
              <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium
                ${highContrast ? 'bg-blue-800 text-blue-100' : 'bg-blue-100 text-blue-800'}`}>
                Recommended
              </span>
            </p>
            <p className={`${mutedClasses} ${presenterMode ? 'text-sm' : 'text-xs'}`}>
              Each additional character makes cracking exponentially harder
            </p>
          </div>
        </div>

        <div className={`${itemClasses} ${length >= LENGTH_SCORES.GREAT_LENGTH ? passClasses : failClasses}`}>
          <CheckIcon pass={length >= LENGTH_SCORES.GREAT_LENGTH} />
          <div>
            <p className={textClasses}>
              <strong>16+ characters</strong>
              <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium
                ${highContrast ? 'bg-purple-800 text-purple-100' : 'bg-purple-100 text-purple-800'}`}>
                Excellent
              </span>
            </p>
            <p className={`${mutedClasses} ${presenterMode ? 'text-sm' : 'text-xs'}`}>
              Great for sensitive accounts like banking or email
            </p>
          </div>
        </div>

        {/* Character variety - shown but de-emphasized */}
        <div
          className={`mt-4 p-3 rounded-lg ${
            highContrast ? 'bg-gray-800 border border-gray-600' : 'bg-gray-50'
          }`}
        >
          <p className={`${mutedClasses} ${presenterMode ? 'text-sm' : 'text-xs'} mb-2`}>
            Character variety (helpful but less important than length):
          </p>
          <div className="flex flex-wrap gap-2">
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                hasLowercase
                  ? highContrast ? 'bg-green-800 text-green-100' : 'bg-green-100 text-green-800'
                  : highContrast ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'
              }`}
            >
              lowercase (a-z)
            </span>
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                hasUppercase
                  ? highContrast ? 'bg-green-800 text-green-100' : 'bg-green-100 text-green-800'
                  : highContrast ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'
              }`}
            >
              UPPERCASE (A-Z)
            </span>
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                hasNumbers
                  ? highContrast ? 'bg-green-800 text-green-100' : 'bg-green-100 text-green-800'
                  : highContrast ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'
              }`}
            >
              numbers (0-9)
            </span>
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                hasSymbols
                  ? highContrast ? 'bg-green-800 text-green-100' : 'bg-green-100 text-green-800'
                  : highContrast ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'
              }`}
            >
              symbols (!@#$)
            </span>
          </div>
        </div>

        {/* Pattern warnings */}
        {patterns.length > 0 && (
          <div className="mt-4 space-y-2">
            <p
              className={`font-medium ${textClasses} ${
                presenterMode ? 'text-presenter-sm' : 'text-sm'
              }`}
            >
              Patterns Detected:
            </p>
            {patterns.map((pattern, index) => (
              <div
                key={index}
                className={`${itemClasses} ${warnClasses}`}
                role="alert"
              >
                <span className="text-xl" aria-hidden="true">!</span>
                <p className={highContrast ? 'text-orange-100' : 'text-orange-800'}>
                  {pattern.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
