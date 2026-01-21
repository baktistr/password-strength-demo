'use client';

import { useState, useMemo, useEffect } from 'react';
import PasswordInput from './PasswordInput';
import StrengthBar from './StrengthBar';
import Checklist from './Checklist';
import Tips from './Tips';
import PassphraseMode from './PassphraseMode';
import Modal from './Modal';
import { calculateStrength } from '@/utils/scoring';
import { checkPasswordBreach, formatBreachCount, BreachResult } from '@/utils/hibp';

interface PasswordMeterCompactProps {
  presenterMode: boolean;
  highContrast: boolean;
}

/**
 * Compact password meter with modal-based details.
 * Designed to minimize scrolling on a single screen.
 */
export default function PasswordMeterCompact({
  presenterMode,
  highContrast,
}: PasswordMeterCompactProps) {
  const [password, setPassword] = useState('');
  const [showPassphraseMode, setShowPassphraseMode] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [showPatterns, setShowPatterns] = useState(false);
  const [breachResult, setBreachResult] = useState<BreachResult>({ isBreached: false, count: 0 });
  const [breachLoading, setBreachLoading] = useState(false);

  // Calculate strength whenever password changes
  const strengthResult = useMemo(() => calculateStrength(password), [password]);

  // Check HIBP breach status (debounced)
  useEffect(() => {
    if (!password || password.length < 4) {
      setBreachResult({ isBreached: false, count: 0 });
      return;
    }

    setBreachLoading(true);
    const timeoutId = setTimeout(async () => {
      const result = await checkPasswordBreach(password);
      setBreachResult(result);
      setBreachLoading(false);
    }, 500); // Debounce 500ms

    return () => clearTimeout(timeoutId);
  }, [password]);

  const textClasses = highContrast ? 'text-white' : 'text-gray-900';
  const mutedClasses = highContrast ? 'text-gray-300' : 'text-gray-600';

  // Quick action button styles
  const actionButtonClasses = (active: boolean = false) => `
    flex-1 px-4 py-3 rounded-lg font-medium transition-all
    flex items-center justify-center gap-2
    ${presenterMode ? 'text-presenter-sm' : 'text-sm'}
    ${active
      ? highContrast
        ? 'bg-blue-600 text-white ring-2 ring-blue-400'
        : 'bg-blue-600 text-white'
      : highContrast
        ? 'bg-gray-800 text-white border border-gray-600 hover:bg-gray-700'
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
    }
  `;

  // Count passed checks for quick summary
  const { characterAnalysis, patterns } = strengthResult;

  const checksPass = [
    characterAnalysis.length >= 8,
    characterAnalysis.length >= 12,
    characterAnalysis.hasLowercase,
    characterAnalysis.hasUppercase,
    characterAnalysis.hasNumbers,
    characterAnalysis.hasSymbols,
  ].filter(Boolean).length;
  const totalChecks = 6;

  return (
    <div className="space-y-6">
      {/* Password Input - Main focus area */}
      <section>
        <PasswordInput
          password={password}
          setPassword={setPassword}
          presenterMode={presenterMode}
          highContrast={highContrast}
          onOpenPassphrase={() => setShowPassphraseMode(true)}
        />
      </section>

      {/* Strength Bar - Always visible, prominent */}
      <section>
        <StrengthBar
          result={strengthResult}
          presenterMode={presenterMode}
          highContrast={highContrast}
        />
      </section>

      {/* Quick Stats Row - only chars and checks */}
      <div className={`flex items-center justify-center gap-4 sm:gap-8 py-2 ${presenterMode ? 'text-presenter-base' : 'text-base'}`}>
        <div className={`text-center ${textClasses}`}>
          <span className="font-bold text-2xl">{characterAnalysis.length}</span>
          <span className={mutedClasses}> chars</span>
        </div>
        <div className={`text-center ${textClasses}`}>
          <span className={`font-bold text-2xl ${checksPass >= 5 ? 'text-green-500' : checksPass >= 3 ? 'text-yellow-500' : 'text-red-500'}`}>
            {checksPass}/{totalChecks}
          </span>
          <span className={mutedClasses}> checks</span>
        </div>
      </div>

      {/* Breach Status Alert */}
      {hasPasswordEntered && (
        <div
          className={`p-3 rounded-lg flex items-center gap-3 ${
            breachLoading
              ? highContrast
                ? 'bg-gray-800 border border-gray-600'
                : 'bg-gray-50 border border-gray-200'
              : breachResult.isBreached
                ? highContrast
                  ? 'bg-red-900/50 border border-red-500'
                  : 'bg-red-50 border border-red-200'
                : highContrast
                  ? 'bg-green-900/50 border border-green-500'
                  : 'bg-green-50 border border-green-200'
          }`}
        >
          <span className={`font-bold ${presenterMode ? 'text-xl' : 'text-lg'}`}>
            {breachLoading ? '...' : breachResult.isBreached ? '!' : 'OK'}
          </span>
          <div className="flex-1">
            <p className={`font-medium ${
              breachLoading
                ? highContrast ? 'text-gray-300' : 'text-gray-600'
                : breachResult.isBreached
                  ? highContrast ? 'text-red-400' : 'text-red-700'
                  : highContrast ? 'text-green-400' : 'text-green-700'
            } ${presenterMode ? 'text-presenter-sm' : 'text-sm'}`}>
              {breachLoading
                ? 'Checking data breaches...'
                : breachResult.isBreached
                  ? `Found in ${formatBreachCount(breachResult.count)} data breaches!`
                  : 'Not found in known data breaches'}
            </p>
            <p className={`${highContrast ? 'text-gray-400' : 'text-gray-500'} ${presenterMode ? 'text-sm' : 'text-xs'}`}>
              {breachLoading
                ? 'Using Have I Been Pwned API'
                : breachResult.isBreached
                  ? 'This password has been exposed. Choose a different one!'
                  : 'Checked via Have I Been Pwned (k-anonymity)'}
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons Row - Checklist, Tips, Patterns */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <button
          onClick={() => setShowChecklist(true)}
          className={actionButtonClasses()}
          aria-haspopup="dialog"
        >
          <span>Checklist</span>
          <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
            checksPass >= 5 
              ? 'bg-green-500/20 text-green-400' 
              : checksPass >= 3 
                ? 'bg-yellow-500/20 text-yellow-400' 
                : 'bg-red-500/20 text-red-400'
          }`}>
            {checksPass}/{totalChecks}
          </span>
        </button>

        <button
          onClick={() => setShowTips(true)}
          className={actionButtonClasses()}
          aria-haspopup="dialog"
        >
          <span>Tips</span>
          {strengthResult.suggestions.length > 0 && (
            <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-blue-500/20 text-blue-400">
              {strengthResult.suggestions.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setShowPatterns(true)}
          className={actionButtonClasses()}
          aria-haspopup="dialog"
        >
          <span>Patterns</span>
          <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
            patterns.length > 0
              ? 'bg-red-500/20 text-red-400'
              : hasPasswordEntered
                ? 'bg-green-500/20 text-green-400'
                : 'bg-gray-500/20 text-gray-400'
          }`}>
            {patterns.length}
          </span>
        </button>
      </div>

      {/* Better Choice Quick Preview (if available) */}
      {strengthResult.betterChoice && strengthResult.score < 60 && (
        <div 
          className={`p-3 rounded-lg cursor-pointer transition-all ${
            highContrast 
              ? 'bg-green-900/30 border border-green-500 hover:bg-green-900/50' 
              : 'bg-green-50 border border-green-200 hover:bg-green-100'
          }`}
          onClick={() => setPassword(strengthResult.betterChoice!)}
        >
          <div className="flex items-center justify-between">
            <span className={`${presenterMode ? 'text-presenter-sm' : 'text-sm'} ${highContrast ? 'text-green-300' : 'text-green-700'}`}>
              Try this instead:
            </span>
            <code className={`font-mono ${presenterMode ? 'text-presenter-sm' : 'text-sm'} ${highContrast ? 'text-green-400' : 'text-green-800'}`}>
              {strengthResult.betterChoice}
            </code>
          </div>
        </div>
      )}

      {/* Checklist Modal */}
      <Modal
        isOpen={showChecklist}
        onClose={() => setShowChecklist(false)}
        title="Password Checklist"
        highContrast={highContrast}
        presenterMode={presenterMode}
      >
        <Checklist
          result={strengthResult}
          presenterMode={presenterMode}
          highContrast={highContrast}
        />
      </Modal>

      {/* Tips Modal */}
      <Modal
        isOpen={showTips}
        onClose={() => setShowTips(false)}
        title="Tips to Improve"
        highContrast={highContrast}
        presenterMode={presenterMode}
      >
        <Tips
          result={strengthResult}
          presenterMode={presenterMode}
          highContrast={highContrast}
          onUseSuggestion={(suggestion) => {
            setPassword(suggestion);
            setShowTips(false);
          }}
        />
      </Modal>

      {/* Patterns Modal */}
      <Modal
        isOpen={showPatterns}
        onClose={() => setShowPatterns(false)}
        title={`Patterns Detected (${patterns.length})`}
        highContrast={highContrast}
        presenterMode={presenterMode}
      >
        <div className="space-y-4">
          {patterns.length === 0 ? (
            <div className={`p-4 rounded-lg ${
              highContrast
                ? 'bg-green-900/30 border border-green-600'
                : 'bg-green-50 border border-green-200'
            }`}>
              <p className={`font-medium ${
                highContrast ? 'text-green-400' : 'text-green-700'
              } ${presenterMode ? 'text-presenter-sm' : 'text-base'}`}>
                No weak patterns detected.
              </p>
              <p className={`mt-2 ${
                highContrast ? 'text-gray-300' : 'text-gray-600'
              } ${presenterMode ? 'text-sm' : 'text-xs'}`}>
                {hasPasswordEntered 
                  ? 'Your password avoids common patterns that attackers look for.'
                  : 'Enter a password to check for weak patterns.'}
              </p>
            </div>
          ) : (
            patterns.map((pattern, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${
                  highContrast
                    ? 'bg-red-900/30 border border-red-600'
                    : 'bg-red-50 border border-red-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className={`font-medium ${
                      highContrast ? 'text-red-400' : 'text-red-700'
                    } ${presenterMode ? 'text-presenter-sm' : 'text-sm'}`}>
                      {pattern.type.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                    </p>
                    <p className={`mt-1 ${
                      highContrast ? 'text-gray-300' : 'text-gray-600'
                    } ${presenterMode ? 'text-sm' : 'text-xs'}`}>
                      {pattern.description}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-mono ${
                    highContrast
                      ? 'bg-red-900 text-red-300'
                      : 'bg-red-100 text-red-600'
                  }`}>
                    -{pattern.penalty} pts
                  </span>
                </div>
                {pattern.matched && (
                  <p className={`mt-2 font-mono text-xs ${
                    highContrast ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Found: "{pattern.matched}"
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </Modal>

      {/* Passphrase Modal */}
      <Modal
        isOpen={showPassphraseMode}
        onClose={() => setShowPassphraseMode(false)}
        title="Passphrase Generator"
        highContrast={highContrast}
        presenterMode={presenterMode}
      >
        <PassphraseMode
          setPassword={(passphrase) => {
            setPassword(passphrase);
            setShowPassphraseMode(false);
          }}
          presenterMode={presenterMode}
          highContrast={highContrast}
        />
      </Modal>
    </div>
  );
}
