'use client';

import { useState, useCallback } from 'react';
import {
  PASSPHRASE_ADJECTIVES,
  PASSPHRASE_NOUNS,
  PASSPHRASE_VERBS,
} from '@/utils/constants';

interface PassphraseModeProps {
  setPassword: (password: string) => void;
  presenterMode: boolean;
  highContrast: boolean;
}

/**
 * Passphrase mode with example generator.
 * Demonstrates the power of long, word-based passwords.
 */
export default function PassphraseMode({
  setPassword,
  presenterMode,
  highContrast,
}: PassphraseModeProps) {
  const [examplePassphrase, setExamplePassphrase] = useState<string>('');
  const [wordCount, setWordCount] = useState(4);
  const [separator, setSeparator] = useState('-');

  const textClasses = highContrast ? 'text-white' : 'text-gray-900';
  const mutedClasses = highContrast ? 'text-gray-300' : 'text-gray-600';

  const buttonClasses = `
    rounded-lg font-medium transition-all
    ${presenterMode ? 'px-6 py-3 text-presenter-sm' : 'px-4 py-2 text-sm'}
    ${highContrast
      ? 'bg-purple-700 text-white hover:bg-purple-600 border border-purple-400'
      : 'bg-purple-600 text-white hover:bg-purple-700'}
  `;

  const selectClasses = `
    rounded-lg border-2 transition-all
    ${presenterMode ? 'p-3 text-presenter-sm' : 'p-2 text-sm'}
    ${highContrast
      ? 'bg-black text-white border-white'
      : 'bg-white text-gray-900 border-gray-300'}
  `;

  // Generate a random passphrase
  const generatePassphrase = useCallback(() => {
    const words: string[] = [];

    // Helper to get random item from array
    const random = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

    for (let i = 0; i < wordCount; i++) {
      // Alternate between adjectives, nouns, and verbs for variety
      const wordType = i % 3;
      if (wordType === 0) {
        words.push(random(PASSPHRASE_ADJECTIVES));
      } else if (wordType === 1) {
        words.push(random(PASSPHRASE_NOUNS));
      } else {
        words.push(random(PASSPHRASE_VERBS));
      }
    }

    const passphrase = words.join(separator);
    setExamplePassphrase(passphrase);
  }, [wordCount, separator]);

  // Use the generated passphrase
  const usePassphrase = useCallback(() => {
    if (examplePassphrase) {
      setPassword(examplePassphrase);
    }
  }, [examplePassphrase, setPassword]);

  return (
    <div
      className={`p-4 rounded-lg ${
        highContrast
          ? 'bg-purple-900/30 border-2 border-purple-500'
          : 'bg-purple-50 border-2 border-purple-200'
      }`}
    >
      <h3
        className={`font-semibold mb-3 ${textClasses} ${
          presenterMode ? 'text-presenter-lg' : 'text-lg'
        }`}
      >
        Passphrase Mode
      </h3>

      <p className={`mb-4 ${mutedClasses} ${presenterMode ? 'text-presenter-sm' : 'text-sm'}`}>
        Passphrases use multiple random words — they&apos;re easier to remember
        and very strong due to their length. Example: &quot;correct-horse-battery-staple&quot;
      </p>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-4">
        <div>
          <label
            className={`block mb-1 ${mutedClasses} ${
              presenterMode ? 'text-sm' : 'text-xs'
            }`}
          >
            Words:
          </label>
          <select
            value={wordCount}
            onChange={(e) => setWordCount(Number(e.target.value))}
            className={selectClasses}
            aria-label="Number of words in passphrase"
          >
            <option value={3}>3 words</option>
            <option value={4}>4 words</option>
            <option value={5}>5 words</option>
            <option value={6}>6 words</option>
          </select>
        </div>

        <div>
          <label
            className={`block mb-1 ${mutedClasses} ${
              presenterMode ? 'text-sm' : 'text-xs'
            }`}
          >
            Separator:
          </label>
          <select
            value={separator}
            onChange={(e) => setSeparator(e.target.value)}
            className={selectClasses}
            aria-label="Word separator"
          >
            <option value="-">Hyphen (-)</option>
            <option value="_">Underscore (_)</option>
            <option value=".">Period (.)</option>
            <option value=" ">Space</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={generatePassphrase}
            className={buttonClasses}
            aria-label="Generate new example passphrase"
          >
            Generate Example
          </button>
        </div>
      </div>

      {/* Generated passphrase display */}
      {examplePassphrase && (
        <div
          className={`p-4 rounded-lg mb-4 ${
            highContrast
              ? 'bg-black border border-purple-400'
              : 'bg-white border border-purple-300'
          }`}
        >
          <p
            className={`font-mono ${textClasses} ${
              presenterMode ? 'text-presenter-base' : 'text-lg'
            } break-all`}
          >
            {examplePassphrase}
          </p>
          <p className={`mt-2 ${mutedClasses} ${presenterMode ? 'text-sm' : 'text-xs'}`}>
            Length: {examplePassphrase.length} characters
          </p>
          <button
            onClick={usePassphrase}
            className={`mt-3 ${buttonClasses}`}
          >
            Test This Passphrase
          </button>
        </div>
      )}

      {/* Warning */}
      <p
        className={`p-3 rounded ${
          highContrast
            ? 'bg-yellow-900/50 text-yellow-100 border border-yellow-500'
            : 'bg-yellow-50 text-yellow-800 border border-yellow-200'
        } ${presenterMode ? 'text-sm' : 'text-xs'}`}
      >
        <strong>Example only!</strong> Don&apos;t use generated examples as
        real passwords. Use a password manager to generate truly random passphrases.
      </p>
    </div>
  );
}
