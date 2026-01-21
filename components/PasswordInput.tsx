'use client';

import { useState, useId } from 'react';
import { SAMPLE_PASSWORDS } from '@/utils/constants';

interface PasswordInputProps {
  password: string;
  setPassword: (password: string) => void;
  presenterMode: boolean;
  highContrast: boolean;
  onOpenPassphrase?: () => void;
}

/**
 * Password input component with show/hide toggle, clear button,
 * and sample password dropdown.
 */
export default function PasswordInput({
  password,
  setPassword,
  presenterMode,
  highContrast,
  onOpenPassphrase,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showSamples, setShowSamples] = useState(false);

  // Unique ID for accessibility
  const passwordId = useId();

  const inputClasses = `
    w-full rounded-lg border-2 transition-all
    ${presenterMode ? 'p-4 text-presenter-base' : 'p-3 text-lg'}
    ${highContrast
      ? 'bg-black text-white border-white focus:border-blue-400'
      : 'bg-white text-gray-900 border-gray-300 focus:border-blue-500'}
    focus:outline-none
  `;

  const buttonClasses = `
    rounded-lg font-medium transition-all
    ${presenterMode ? 'px-4 py-3 text-presenter-sm' : 'px-3 py-2 text-sm'}
    ${highContrast
      ? 'bg-gray-800 text-white border border-white hover:bg-gray-700'
      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
  `;

  const labelClasses = `
    block font-medium mb-2
    ${presenterMode ? 'text-presenter-sm' : 'text-sm'}
    ${highContrast ? 'text-white' : 'text-gray-700'}
  `;

  return (
    <div className="space-y-4">
      {/* Password Input */}
      <div>
        <label htmlFor={passwordId} className={labelClasses}>
          Test Password
        </label>
        <div className="relative">
          <input
            id={passwordId}
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Type a test password..."
            className={inputClasses}
            aria-describedby={`${passwordId}-help`}
            autoComplete="off"
            spellCheck="false"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
            {/* Show/Hide Toggle */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={buttonClasses}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
            {/* Clear Button */}
            {password && (
              <button
                type="button"
                onClick={() => setPassword('')}
                className={buttonClasses}
                aria-label="Clear password"
              >
                Clear
              </button>
            )}
          </div>
        </div>
        <p
          id={`${passwordId}-help`}
          className={`mt-1 ${presenterMode ? 'text-presenter-sm' : 'text-xs'} ${
            highContrast ? 'text-gray-300' : 'text-gray-500'
          }`}
        >
          This is for testing only — don&apos;t enter a real password you use.
        </p>
      </div>

      {/* Sample Passwords and Passphrase Buttons */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <button
            type="button"
            onClick={() => setShowSamples(!showSamples)}
            className={`${buttonClasses} w-full text-left flex justify-between items-center`}
            aria-expanded={showSamples}
            aria-haspopup="listbox"
          >
            <span>Sample passwords</span>
            <span className={`transition-transform ${showSamples ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>

          {showSamples && (
            <ul
              className={`absolute z-10 w-full mt-1 rounded-lg shadow-lg border-2 max-h-64 overflow-y-auto
                ${highContrast ? 'bg-gray-900 border-white' : 'bg-white border-gray-200'}`}
              role="listbox"
              aria-label="Sample passwords"
            >
              {SAMPLE_PASSWORDS.map((sample, index) => (
                <li key={index}>
                  <button
                    type="button"
                    onClick={() => {
                      setPassword(sample.value);
                      setShowSamples(false);
                    }}
                    className={`w-full text-left px-4 py-3 transition-colors
                      ${presenterMode ? 'text-presenter-sm' : 'text-sm'}
                      ${highContrast
                        ? 'hover:bg-gray-800 text-white'
                        : 'hover:bg-gray-100 text-gray-700'}`}
                    role="option"
                  >
                    {sample.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {onOpenPassphrase && (
          <button
            type="button"
            onClick={onOpenPassphrase}
            className={`${buttonClasses} flex items-center gap-2`}
            aria-haspopup="dialog"
          >
            <span>Passphrase</span>
          </button>
        )}
      </div>
    </div>
  );
}
