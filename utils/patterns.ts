/**
 * Pattern detection utilities for password analysis.
 * Identifies common weak patterns in passwords.
 */

import { COMMON_PASSWORDS, KEYBOARD_PATTERNS, COMMON_WORDS } from './constants';

export interface PatternMatch {
  type: string;
  description: string;
  penalty: number;
}

/**
 * Check if password is in common passwords list
 */
export function checkCommonPassword(password: string): PatternMatch | null {
  const lower = password.toLowerCase();

  if (COMMON_PASSWORDS.includes(lower)) {
    return {
      type: 'common',
      description: 'This is a very common password that attackers try first',
      penalty: 50,
    };
  }

  // Check if password starts with a common password
  for (const common of COMMON_PASSWORDS) {
    if (lower.startsWith(common) && lower.length <= common.length + 4) {
      return {
        type: 'common-base',
        description: 'Based on a common password with minor additions',
        penalty: 30,
      };
    }
  }

  return null;
}

/**
 * Check for sequential characters (123, abc, etc.)
 */
export function checkSequentialChars(password: string): PatternMatch | null {
  const lower = password.toLowerCase();
  let sequentialCount = 0;

  for (let i = 0; i < lower.length - 2; i++) {
    const c1 = lower.charCodeAt(i);
    const c2 = lower.charCodeAt(i + 1);
    const c3 = lower.charCodeAt(i + 2);

    // Check for ascending sequence
    if (c2 === c1 + 1 && c3 === c2 + 1) {
      sequentialCount++;
    }
    // Check for descending sequence
    if (c2 === c1 - 1 && c3 === c2 - 1) {
      sequentialCount++;
    }
  }

  if (sequentialCount >= 3) {
    return {
      type: 'sequential',
      description: 'Contains multiple sequential characters (like 123 or abc)',
      penalty: 15,
    };
  } else if (sequentialCount >= 1) {
    return {
      type: 'sequential-minor',
      description: 'Contains sequential characters',
      penalty: 5,
    };
  }

  return null;
}

/**
 * Check for repeated characters (aaa, 111, etc.)
 */
export function checkRepeatedChars(password: string): PatternMatch | null {
  let maxRepeat = 1;
  let currentRepeat = 1;

  for (let i = 1; i < password.length; i++) {
    if (password[i].toLowerCase() === password[i - 1].toLowerCase()) {
      currentRepeat++;
      maxRepeat = Math.max(maxRepeat, currentRepeat);
    } else {
      currentRepeat = 1;
    }
  }

  if (maxRepeat >= 4) {
    return {
      type: 'repeated',
      description: 'Contains many repeated characters in a row',
      penalty: 15,
    };
  } else if (maxRepeat >= 3) {
    return {
      type: 'repeated-minor',
      description: 'Contains repeated characters',
      penalty: 5,
    };
  }

  return null;
}

/**
 * Check for keyboard walks (qwerty, asdf, etc.)
 */
export function checkKeyboardPatterns(password: string): PatternMatch | null {
  const lower = password.toLowerCase();

  for (const pattern of KEYBOARD_PATTERNS) {
    if (lower.includes(pattern) || lower.includes(pattern.split('').reverse().join(''))) {
      return {
        type: 'keyboard',
        description: 'Contains a keyboard pattern (like qwerty or asdf)',
        penalty: 20,
      };
    }
  }

  // Check for partial keyboard patterns (4+ chars)
  for (const pattern of KEYBOARD_PATTERNS) {
    for (let i = 0; i <= pattern.length - 4; i++) {
      const subPattern = pattern.substring(i, i + 4);
      if (lower.includes(subPattern)) {
        return {
          type: 'keyboard-partial',
          description: 'Contains a partial keyboard pattern',
          penalty: 10,
        };
      }
    }
  }

  return null;
}

/**
 * Check for year patterns (1990-2030)
 */
export function checkYearPatterns(password: string): PatternMatch | null {
  // Match years from 1900-2099
  const yearRegex = /(19[0-9]{2}|20[0-9]{2})/;
  const matches = password.match(yearRegex);

  if (matches) {
    const year = parseInt(matches[1]);
    // Extra penalty for recent/upcoming years (more commonly used)
    if (year >= 2000 && year <= 2030) {
      return {
        type: 'year-recent',
        description: 'Contains a recent year (commonly used in passwords)',
        penalty: 15,
      };
    }
    return {
      type: 'year',
      description: 'Contains a year pattern',
      penalty: 10,
    };
  }

  return null;
}

/**
 * Check for date patterns (like 01/01, 1234, etc.)
 */
export function checkDatePatterns(password: string): PatternMatch | null {
  // Common date formats
  const datePatterns = [
    /\d{2}\/\d{2}/,      // 01/01
    /\d{2}-\d{2}/,       // 01-01
    /\d{2}\.\d{2}/,      // 01.01
    /\d{4}\/\d{2}/,      // 2024/01
    /\d{8}/,             // 20240101 (8 consecutive digits)
  ];

  for (const pattern of datePatterns) {
    if (pattern.test(password)) {
      return {
        type: 'date',
        description: 'Contains a date-like pattern',
        penalty: 10,
      };
    }
  }

  return null;
}

/**
 * Check for leet speak substitutions (@ for a, 0 for o, etc.)
 */
export function checkLeetSpeak(password: string): PatternMatch | null {
  // Convert leet speak to regular letters
  const leetMap: { [key: string]: string } = {
    '@': 'a',
    '4': 'a',
    '3': 'e',
    '1': 'i',
    '!': 'i',
    '0': 'o',
    '$': 's',
    '5': 's',
    '7': 't',
    '+': 't',
  };

  let converted = password.toLowerCase();
  for (const [leet, letter] of Object.entries(leetMap)) {
    converted = converted.split(leet).join(letter);
  }

  // Check if the converted version is a common password
  if (COMMON_PASSWORDS.includes(converted) && converted !== password.toLowerCase()) {
    return {
      type: 'leet',
      description: 'Uses common letter substitutions (like @ for a) that attackers know',
      penalty: 25,
    };
  }

  // Check for common words with leet speak
  for (const word of COMMON_WORDS) {
    if (converted.includes(word)) {
      return {
        type: 'leet-word',
        description: 'Contains a common word with substitutions',
        penalty: 10,
      };
    }
  }

  return null;
}

/**
 * Check for Season+Year pattern (Summer2024, Winter2025, etc.)
 */
export function checkSeasonPattern(password: string): PatternMatch | null {
  const seasonPattern = /(spring|summer|fall|autumn|winter)(20[0-9]{2}|19[0-9]{2})/i;

  if (seasonPattern.test(password)) {
    return {
      type: 'season-year',
      description: 'Uses a Season+Year pattern that is very commonly guessed',
      penalty: 25,
    };
  }

  return null;
}

/**
 * Check for Month+Year pattern (January2024, etc.)
 */
export function checkMonthPattern(password: string): PatternMatch | null {
  const months = 'january|february|march|april|may|june|july|august|september|october|november|december';
  const monthPattern = new RegExp(`(${months})(20[0-9]{2}|19[0-9]{2})`, 'i');

  if (monthPattern.test(password)) {
    return {
      type: 'month-year',
      description: 'Uses a Month+Year pattern that is commonly guessed',
      penalty: 20,
    };
  }

  return null;
}

/**
 * Get all pattern matches for a password
 */
export function analyzePatterns(password: string): PatternMatch[] {
  const matches: PatternMatch[] = [];

  const checks = [
    checkCommonPassword,
    checkSequentialChars,
    checkRepeatedChars,
    checkKeyboardPatterns,
    checkYearPatterns,
    checkDatePatterns,
    checkLeetSpeak,
    checkSeasonPattern,
    checkMonthPattern,
  ];

  for (const check of checks) {
    const match = check(password);
    if (match) {
      matches.push(match);
    }
  }

  return matches;
}

/**
 * Calculate total penalty from pattern matches
 */
export function calculatePatternPenalty(patterns: PatternMatch[]): number {
  let totalPenalty = 0;

  for (const pattern of patterns) {
    totalPenalty += pattern.penalty;
  }

  // Cap penalty at 80 to leave some room
  return Math.min(totalPenalty, 80);
}
