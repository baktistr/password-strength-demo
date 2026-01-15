'use client';

import { useState, useMemo } from 'react';
import PasswordInput from './PasswordInput';
import StrengthBar from './StrengthBar';
import Checklist from './Checklist';
import Tips from './Tips';
import PassphraseMode from './PassphraseMode';
import { calculateStrength } from '@/utils/scoring';

interface PasswordMeterProps {
  presenterMode: boolean;
  highContrast: boolean;
}

/**
 * Main password meter component combining all sub-components.
 */
export default function PasswordMeter({
  presenterMode,
  highContrast,
}: PasswordMeterProps) {
  const [password, setPassword] = useState('');
  const [showPassphraseMode, setShowPassphraseMode] = useState(false);

  // Calculate strength whenever password changes
  const strengthResult = useMemo(() => calculateStrength(password), [password]);

  const textClasses = highContrast ? 'text-white' : 'text-gray-900';

  const toggleButtonClasses = `
    px-4 py-2 rounded-lg font-medium transition-all
    ${presenterMode ? 'text-presenter-sm' : 'text-sm'}
    ${showPassphraseMode
      ? highContrast
        ? 'bg-purple-600 text-white'
        : 'bg-purple-600 text-white'
      : highContrast
        ? 'bg-gray-800 text-white border border-gray-600 hover:bg-gray-700'
        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
  `;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr,400px]">
      {/* Left Column - Main Content */}
      <div className="space-y-8">
        {/* Password Input Section */}
        <section aria-labelledby="input-section">
          <h2
            id="input-section"
            className={`font-semibold mb-4 ${textClasses} ${
              presenterMode ? 'text-presenter-lg' : 'text-xl'
            }`}
          >
            Test a Password
          </h2>
          <PasswordInput
            password={password}
            setPassword={setPassword}
            presenterMode={presenterMode}
            highContrast={highContrast}
          />
        </section>

        {/* Passphrase Mode Toggle */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowPassphraseMode(!showPassphraseMode)}
            className={toggleButtonClasses}
            aria-expanded={showPassphraseMode}
            aria-controls="passphrase-section"
          >
            {showPassphraseMode ? '[x] ' : '[ ] '}Passphrase Mode
          </button>
          <span
            className={`${highContrast ? 'text-gray-400' : 'text-gray-500'} ${
              presenterMode ? 'text-sm' : 'text-xs'
            }`}
          >
            Try word-based passwords
          </span>
        </div>

        {/* Passphrase Mode Panel */}
        {showPassphraseMode && (
          <section id="passphrase-section" aria-labelledby="passphrase-title">
            <PassphraseMode
              setPassword={setPassword}
              presenterMode={presenterMode}
              highContrast={highContrast}
            />
          </section>
        )}

        {/* Strength Results */}
        <section aria-labelledby="strength-section">
          <h2
            id="strength-section"
            className={`font-semibold mb-4 ${textClasses} ${
              presenterMode ? 'text-presenter-lg' : 'text-xl'
            }`}
          >
            Strength Score
          </h2>
          <StrengthBar
            result={strengthResult}
            presenterMode={presenterMode}
            highContrast={highContrast}
          />
        </section>
      </div>

      {/* Right Column - Checklist and Tips */}
      <div className="space-y-8">
        {/* Checklist */}
        <section aria-labelledby="checklist-section">
          <Checklist
            result={strengthResult}
            presenterMode={presenterMode}
            highContrast={highContrast}
          />
        </section>

        {/* Tips */}
        <section aria-labelledby="tips-section">
          <Tips
            result={strengthResult}
            presenterMode={presenterMode}
            highContrast={highContrast}
            onUseSuggestion={setPassword}
          />
        </section>
      </div>
    </div>
  );
}
