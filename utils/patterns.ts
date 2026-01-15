/**
 * Pattern detection utilities for password analysis.
 * Identifies common weak patterns in passwords.
 */

import { COMMON_PASSWORDS, KEYBOARD_PATTERNS, COMMON_WORDS, PET_NAMES, DICTIONARY_WORDS } from './constants';
import { checkDictionaries, DictionaryMatch } from './dictionaries';

export interface PatternMatch {
  type: string;
  description: string;
  penalty: number;
  matched?: string; // The actual matched substring
  originalWord?: string; // Original word before transformation (e.g., "mydogs" -> "MyDog$")
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
      penalty: 70, // Severe penalty - nearly impossible to recover from
    };
  }

  // Check if password starts with a common password
  for (const common of COMMON_PASSWORDS) {
    if (lower.startsWith(common) && lower.length <= common.length + 4) {
      return {
        type: 'common-base',
        description: 'Based on a common password with minor additions',
        penalty: 50, // Major penalty - dictionary base is very weak
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

  if (sequentialCount >= 4) {
    return {
      type: 'sequential',
      description: 'Contains multiple sequential characters (like 123 or abc)',
      penalty: 10,
    };
  } else if (sequentialCount >= 2) {
    return {
      type: 'sequential-minor',
      description: 'Contains sequential characters',
      penalty: 3,
    };
  }
  // Don't penalize single short sequences like "123" - very common
  return null;
}

/**
 * Check for repeated characters (aaa, 111, etc.)
 * CyLab research: repeated chars don't add strength even if they make password longer
 */
export function checkRepeatedChars(password: string): PatternMatch | null {
  let maxRepeat = 1;
  let currentRepeat = 1;
  let totalRepeats = 0;

  for (let i = 1; i < password.length; i++) {
    if (password[i].toLowerCase() === password[i - 1].toLowerCase()) {
      currentRepeat++;
      maxRepeat = Math.max(maxRepeat, currentRepeat);
      totalRepeats++;
    } else {
      currentRepeat = 1;
    }
  }

  // Severe penalty for many repeats - they're predictable padding
  if (maxRepeat >= 5) {
    return {
      type: 'repeated',
      description: 'Contains many repeated characters in a row (adds length but not strength)',
      penalty: 30, // Severe - clearly padding
    };
  } else if (maxRepeat >= 4) {
    return {
      type: 'repeated',
      description: 'Contains repeated characters (adds minimal strength)',
      penalty: 20,
    };
  } else if (maxRepeat >= 3) {
    return {
      type: 'repeated-minor',
      description: 'Contains repeated characters',
      penalty: 10,
    };
  }

  // Additional penalty if overall repetition is high
  if (totalRepeats > password.length * 0.3) {
    return {
      type: 'repeated-excessive',
      description: 'Too many repeated characters throughout password',
      penalty: 15,
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
        penalty: 8,
      };
    }
    return {
      type: 'year',
      description: 'Contains a year pattern',
      penalty: 5,
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
 * CyLab: dictionary words with substitutions are still dictionary-based
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
      penalty: 25, // Significant penalty - still dictionary-based
    };
  }

  // Check for common words with leet speak
  for (const word of COMMON_WORDS) {
    if (converted.includes(word) && word.length >= 4) {
      return {
        type: 'leet-word',
        description: 'Contains a common word with substitutions',
        penalty: 10, // Minor penalty
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
      penalty: 15,
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
      penalty: 12,
    };
  }

  return null;
}

/**
 * Check for pet names in the password (CyLab research)
 */
export function checkPetNames(password: string): PatternMatch | null {
  const lower = password.toLowerCase();

  for (const petName of PET_NAMES) {
    if (lower.includes(petName) && petName.length >= 3) {
      return {
        type: 'pet-name',
        description: `Don't use pet names (${petName.charAt(0).toUpperCase() + petName.slice(1)}) in passwords`,
        penalty: 8,
        matched: petName,
      };
    }
  }

  return null;
}

/**
 * Check for dictionary words in the password (CyLab approach)
 * Detects when password IS a dictionary word or contains one as the main component
 */
export function checkDictionaryWord(password: string): PatternMatch | null {
  const lower = password.toLowerCase();
  // Remove common suffixes/prefixes like numbers and symbols for checking
  const stripped = lower.replace(/^[^a-z]+|[^a-z]+$/gi, '');

  // Check if the password is exactly a dictionary word (only penalize if short)
  if (DICTIONARY_WORDS.includes(stripped) && stripped.length >= 4) {
    // Only penalize heavily if the word IS the password
    if (stripped === lower || stripped.length >= lower.length - 2) {
      return {
        type: 'dictionary-word',
        description: `Don't use dictionary words (${stripped})`,
        penalty: 15,
        matched: stripped,
      };
    }
  }

  // Check if password is a dictionary word with minor additions (1-3 chars)
  for (const word of DICTIONARY_WORDS) {
    if (word.length >= 5) {
      // Password is essentially just the word with small additions
      if (stripped === word ||
          (stripped.startsWith(word) && stripped.length <= word.length + 3) ||
          (stripped.endsWith(word) && stripped.length <= word.length + 3)) {
        return {
          type: 'dictionary-word',
          description: `Don't use dictionary words (${word})`,
          penalty: 25,
          matched: word,
        };
      }
    }
  }

  return null;
}

/**
 * Check for simple word transformations (e.g., "mydogs" -> "MyDog$")
 * Detects when users take a phrase and apply predictable transformations:
 * - Capitalization changes
 * - Symbol substitutions ($=s, @=a, etc.)
 * - Removing or adding letters
 */
export function checkWordTransformation(password: string): PatternMatch | null {
  // Common transformation patterns
  const symbolMap: { [key: string]: string } = {
    '$': 's',
    '@': 'a',
    '!': 'i',
    '1': 'i',
    '0': 'o',
    '3': 'e',
    '4': 'a',
    '5': 's',
    '7': 't',
  };

  // Convert password to normalized form (lowercase, symbols to letters)
  let normalized = password.toLowerCase();
  for (const [symbol, letter] of Object.entries(symbolMap)) {
    normalized = normalized.split(symbol).join(letter);
  }

  // Common phrase patterns like "my<pet>", "my<thing>s", "i<verb><noun>"
  const phrasePatterns = [
    /my\s*(\w+)s?/i,  // "my dog", "mydogs", "my cats"
    /i\s*love\s*(\w+)/i,  // "i love pizza"
    /(\w+)\s*is\s*(\w+)/i,  // "life is good"
  ];

  for (const pattern of phrasePatterns) {
    const match = normalized.match(pattern);
    if (match) {
      // Check if the original password has symbol substitutions or case changes
      const hasSymbolSubs = /[$@!013457]/.test(password);
      const hasMixedCase = /[a-z]/.test(password) && /[A-Z]/.test(password);

      if (hasSymbolSubs || hasMixedCase) {
        // Find what transformation was applied
        const originalPhrase = match[0];
        return {
          type: 'word-transformation',
          description: `Simple transformations of words or phrases (${originalPhrase} → ${password.replace(/[0-9]+$/, '')}) are predictable`,
          penalty: 20,
          matched: password,
          originalWord: originalPhrase,
        };
      }
    }
  }

  return null;
}

/**
 * Check for common password substrings (e.g., "fluffy" within a larger password)
 */
export function checkCommonSubstring(password: string): PatternMatch | null {
  const lower = password.toLowerCase();

  // Check for common passwords used as substrings (but not the whole password)
  for (const common of [...COMMON_PASSWORDS, ...COMMON_WORDS]) {
    if (common.length >= 4 && lower.includes(common) && lower !== common) {
      // Don't double-report if it's already caught as common-base
      if (!lower.startsWith(common)) {
        return {
          type: 'common-substring',
          description: `Avoid using very common passwords like "${common}" as part of your own password`,
          penalty: 15,
          matched: common,
        };
      }
    }
  }

  return null;
}

/**
 * Check for digits only at the end (CyLab research shows this is a weak pattern)
 */
export function checkDigitPlacement(password: string): PatternMatch | null {
  // Check if password has digits
  const hasDigits = /\d/.test(password);
  if (!hasDigits) return null;

  // Check if all digits are at the end
  const endDigitsMatch = password.match(/^([^\d]*?)(\d+)$/);
  if (endDigitsMatch && endDigitsMatch[1].length > 0) {
    const digits = endDigitsMatch[2];
    // Only flag if there are many trailing digits (4+)
    if (digits.length >= 4) {
      return {
        type: 'digits-at-end',
        description: 'Consider inserting digits into the middle, not just at the end',
        penalty: 5,
        matched: digits,
      };
    }
  }

  return null;
}

/**
 * Check against expanded dictionaries (CUPS Lab methodology)
 * Checks: common passwords, English words, names, phrases, pet names
 */
export function checkExpandedDictionaries(password: string): PatternMatch | null {
  const matches = checkDictionaries(password);
  
  if (matches.length === 0) {
    return null;
  }
  
  // Find the most severe match (highest penalty)
  const worstMatch = matches.reduce((worst, current) => 
    current.penalty > worst.penalty ? current : worst
  );
  
  // Map dictionary categories to user-friendly descriptions
  const categoryDescriptions: Record<string, string> = {
    'password': 'commonly used password',
    'english': 'common English word',
    'name': 'common name',
    'phrase': 'common phrase',
    'pet': 'common pet name'
  };
  
  const categoryDesc = categoryDescriptions[worstMatch.category] || 'dictionary word';
  
  return {
    type: `dictionary-${worstMatch.category}`,
    description: `Contains "${worstMatch.word}" (${categoryDesc})`,
    penalty: worstMatch.penalty,
    matched: worstMatch.word,
  };
}

/**
 * Get all pattern matches for a password
 */
export function analyzePatterns(password: string): PatternMatch[] {
  const matches: PatternMatch[] = [];

  const checks = [
    checkExpandedDictionaries, // CUPS Lab methodology - primary dictionary check
    checkSequentialChars,
    checkRepeatedChars,
    checkKeyboardPatterns,
    checkYearPatterns,
    checkDatePatterns,
    checkSeasonPattern,
    checkMonthPattern,
    checkCommonSubstring,
    checkDigitPlacement,
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
