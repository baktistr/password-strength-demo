'use client';

import { useState, useMemo } from 'react';
import PasswordInput from './PasswordInput';
import StrengthBar from './StrengthBar';
import Checklist from './Checklist';
import Tips from './Tips';
import PassphraseMode from './PassphraseMode';
import Modal from './Modal';
import { calculateStrength } from '@/utils/scoring';

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

  // Calculate strength whenever password changes
  const strengthResult = useMemo(() => calculateStrength(password), [password]);

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
  // Only count "no patterns" as passing if there's actually a password entered
  const hasPasswordEntered = characterAnalysis.length > 0;
  // For very strong passwords (16+ chars), minor patterns are acceptable
  const hasAcceptablePatterns = hasPasswordEntered && (
    patterns.length === 0 || 
    (characterAnalysis.length >= 16 && patterns.every(p => p.penalty <= 10))
  );
  
  const checksPass = [
    characterAnalysis.length >= 8,
    characterAnalysis.length >= 12,
    characterAnalysis.hasLowercase,
    characterAnalysis.hasUppercase,
    characterAnalysis.hasNumbers,
    characterAnalysis.hasSymbols,
    hasAcceptablePatterns,
  ].filter(Boolean).length;
  const totalChecks = 7;

  return (
    <div className="space-y-6">
      {/* Password Input - Main focus area */}
      <section>
        <PasswordInput
          password={password}
          setPassword={setPassword}
          presenterMode={presenterMode}
          highContrast={highContrast}
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

      {/* Quick Stats Row */}
      <div className={`flex items-center justify-center gap-6 py-2 ${presenterMode ? 'text-presenter-base' : 'text-base'}`}>
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
        <div className={`text-center ${textClasses}`}>
          <span className="font-bold text-2xl">{strengthResult.score}</span>
          <span className={mutedClasses}>/100</span>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="flex gap-3">
        <button
          onClick={() => setShowChecklist(true)}
          className={actionButtonClasses()}
          aria-haspopup="dialog"
        >
          <span>📋</span>
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
          <span>💡</span>
          <span>Tips</span>
          {strengthResult.suggestions.length > 0 && (
            <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-blue-500/20 text-blue-400">
              {strengthResult.suggestions.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setShowPassphraseMode(true)}
          className={actionButtonClasses()}
          aria-haspopup="dialog"
        >
          <span>🔤</span>
          <span>Passphrase</span>
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
              💡 Try this instead:
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
