/**
 * Password scoring utilities.
 * Calculates strength score based on length, variety, and patterns.
 */

import { analyzePatterns, calculatePatternPenalty, PatternMatch } from './patterns';
import { LENGTH_SCORES, SCORE_THRESHOLDS } from './constants';

export interface CharacterAnalysis {
  hasLowercase: boolean;
  hasUppercase: boolean;
  hasNumbers: boolean;
  hasSymbols: boolean;
  uniqueChars: number;
  length: number;
}

export interface StrengthResult {
  score: number;
  label: string;
  color: string;
  characterAnalysis: CharacterAnalysis;
  patterns: PatternMatch[];
  crackTimeCategory: string;
  suggestions: string[];
  betterChoice?: string; // Suggested improved password
  breachCheck?: {
    isBreached: boolean;
    count: number;
    loading?: boolean;
    error?: string;
  };
}

/**
 * Analyze character composition of password
 */
export function analyzeCharacters(password: string): CharacterAnalysis {
  const uniqueChars = new Set(password.toLowerCase()).size;

  return {
    hasLowercase: /[a-z]/.test(password),
    hasUppercase: /[A-Z]/.test(password),
    hasNumbers: /[0-9]/.test(password),
    hasSymbols: /[^a-zA-Z0-9]/.test(password),
    uniqueChars,
    length: password.length,
  };
}

/**
 * Calculate length score (up to 70 points)
 * Length is the most critical factor - CyLab research shows it's more important than complexity
 * Adjusted to be more generous for 8+ char passwords
 */
function calculateLengthScore(length: number): number {
  if (length === 0) return 0;
  if (length < 8) {
    // Below 8 chars: very weak, scale from 0-15
    return Math.floor((length / 8) * 15);
  }
  if (length < 10) {
    // 8-9 chars: baseline acceptable, score 20-30
    return 20 + Math.floor(((length - 8) / 2) * 10);
  }
  if (length < 12) {
    // 10-11 chars: decent, score 30-40
    return 30 + Math.floor(((length - 10) / 2) * 10);
  }
  if (length < 14) {
    // 12-13 chars: good, score 45-55
    return 45 + Math.floor(((length - 12) / 2) * 10);
  }
  if (length < 16) {
    // 14-15 chars: strong, score 55-60
    return 55 + Math.floor(((length - 14) / 2) * 5);
  }
  if (length < 20) {
    // 16-19 chars: very strong, score 60-70
    return 60 + Math.floor(((length - 16) / 4) * 10);
  }
  // 20+ chars: excellent, scale from 70-75
  return Math.min(75, 70 + Math.floor(((length - 20) / 5) * 5));
}

/**
 * Calculate variety score (up to 20 points)
 * CyLab research shows variety matters, but less than length
 * Unpredictable placement of character types is key
 */
function calculateVarietyScore(analysis: CharacterAnalysis): number {
  let score = 0;

  // Count character classes
  let characterClasses = 0;
  if (analysis.hasLowercase) characterClasses++;
  if (analysis.hasUppercase) characterClasses++;
  if (analysis.hasNumbers) characterClasses++;
  if (analysis.hasSymbols) characterClasses++;

  // Award points based on character class diversity (more generous)
  if (characterClasses >= 2) score += 5;  // Mixed case or letters+numbers
  if (characterClasses >= 3) score += 5;  // Three types
  if (characterClasses >= 4) score += 5;  // All four types

  // Bonus for high unique character ratio (indicates less repetition)
  if (analysis.length > 0) {
    const uniqueRatio = analysis.uniqueChars / analysis.length;
    if (uniqueRatio > 0.8) score += 3;
    else if (uniqueRatio > 0.6) score += 2;
  }

  return Math.min(score, 20);
}

/**
 * Calculate bonus points (up to 20)
 * For extra-long passwords or passphrases
 */
function calculateBonusScore(password: string, analysis: CharacterAnalysis): number {
  let bonus = 0;

  // Extra length bonus for very long passwords
  if (analysis.length >= 20) bonus += 5;
  if (analysis.length >= 25) bonus += 5;
  if (analysis.length >= 30) bonus += 5;

  // Passphrase detection: multiple words separated by spaces or hyphens
  const words = password.split(/[\s\-_]+/).filter(w => w.length >= 3);
  if (words.length >= 3) bonus += 5;
  if (words.length >= 4) bonus += 3;

  return Math.min(bonus, 20);
}

/**
 * Get strength label based on score
 */
function getStrengthLabel(score: number): string {
  if (score < SCORE_THRESHOLDS.VERY_WEAK) return 'Very weak';
  if (score < SCORE_THRESHOLDS.WEAK) return 'Weak';
  if (score < SCORE_THRESHOLDS.OK) return 'OK';
  if (score < SCORE_THRESHOLDS.STRONG) return 'Strong';
  return 'Very strong';
}

/**
 * Get color for strength level
 */
function getStrengthColor(score: number): string {
  if (score < SCORE_THRESHOLDS.VERY_WEAK) return 'strength-veryWeak';
  if (score < SCORE_THRESHOLDS.WEAK) return 'strength-weak';
  if (score < SCORE_THRESHOLDS.OK) return 'strength-ok';
  if (score < SCORE_THRESHOLDS.STRONG) return 'strength-strong';
  return 'strength-veryStrong';
}

/**
 * Estimate crack time category
 * This is a rough educational estimate, not precise
 */
function estimateCrackTime(score: number, analysis: CharacterAnalysis): string {
  // Very rough estimates for educational purposes
  if (score < 15) return 'Instantly';
  if (score < 25) return 'Seconds to minutes';
  if (score < 40) return 'Minutes to hours';
  if (score < 55) return 'Hours to days';
  if (score < 70) return 'Days to weeks';
  if (score < 85) return 'Months to years';
  return 'Many years';
}

/**
 * Generate prioritized suggestions based on weaknesses
 * Show all relevant feedback (no arbitrary limits)
 */
function generateSuggestions(
  analysis: CharacterAnalysis,
  patterns: PatternMatch[],
  score: number
): string[] {
  const suggestions: string[] = [];

  // Priority 1: Critical patterns (common passwords, keyboard patterns, dictionary words)
  const criticalPatterns = patterns.filter(p =>
    p.type === 'common' ||
    p.type === 'common-base' ||
    p.type === 'dictionary-word' ||
    p.type === 'keyboard' ||
    p.type === 'season-year' ||
    p.type === 'month-year' ||
    p.type === 'leet' ||
    p.type === 'leet-word'
  );

  for (const pattern of criticalPatterns) {
    if (pattern.type === 'common') {
      suggestions.push('This is a very common password that appears in attacker dictionaries');
    } else if (pattern.type === 'common-base') {
      suggestions.push('Based on a common password — minor additions don\'t help much');
    } else if (pattern.type === 'dictionary-word') {
      suggestions.push(pattern.description); // "Don't use dictionary words (word)"
    } else if (pattern.type === 'keyboard') {
      suggestions.push('Avoid keyboard patterns like "qwerty" or "asdf" — they\'re easily guessed');
    } else if (pattern.type === 'season-year' || pattern.type === 'month-year') {
      suggestions.push('Season+Year or Month+Year patterns are extremely predictable');
    } else if (pattern.type === 'leet') {
      suggestions.push('Letter substitutions (@=a, 0=o, etc.) are well-known to password crackers');
    } else if (pattern.type === 'leet-word') {
      suggestions.push('Dictionary words with letter substitutions are still vulnerable');
    }
  }

  // Priority 2: Repeated characters (they add length but not strength)
  const repeatPatterns = patterns.filter(p =>
    p.type === 'repeated' ||
    p.type === 'repeated-minor' ||
    p.type === 'repeated-excessive'
  );

  for (const pattern of repeatPatterns) {
    if (pattern.type === 'repeated' || pattern.type === 'repeated-excessive') {
      suggestions.push('Repeated characters add length but very little actual strength');
    } else if (pattern.type === 'repeated-minor') {
      suggestions.push('Some repeated characters detected — try varying your characters more');
    }
  }

  // Priority 3: Length (most important positive factor) - CyLab style messages
  if (analysis.length < 8) {
    suggestions.push(`Make your password longer than ${analysis.length} characters`);
  } else if (analysis.length < 12) {
    suggestions.push('Aim for 12+ characters — length is your strongest defense');
  } else if (analysis.length < 16) {
    suggestions.push('Consider 16+ characters for maximum security on important accounts');
  }

  // Priority 4: Other patterns
  const otherPatterns = patterns.filter(p =>
    p.type === 'sequential' ||
    p.type === 'sequential-minor' ||
    p.type === 'year-recent' ||
    p.type === 'year' ||
    p.type === 'date' ||
    p.type === 'keyboard-partial'
  );

  for (const pattern of otherPatterns) {
    if (pattern.type === 'sequential' || pattern.type === 'sequential-minor') {
      suggestions.push('Avoid sequential patterns like "123" or "abc"');
    } else if (pattern.type === 'year-recent') {
      suggestions.push('Recent years (2000-2030) are commonly guessed by attackers');
    } else if (pattern.type === 'year') {
      suggestions.push('Birth years and dates are commonly tried in password attacks');
    } else if (pattern.type === 'date') {
      suggestions.push('Date patterns are predictable — avoid them in passwords');
    } else if (pattern.type === 'keyboard-partial') {
      suggestions.push('Even partial keyboard patterns weaken your password');
    }
  }

  // Priority 5: Character variety - CyLab style messages
  if (patterns.length === 0 || score > 40) {
    if (!analysis.hasSymbols) {
      suggestions.push('Consider using 1 or more symbols');
    }
    if (!analysis.hasNumbers) {
      suggestions.push('Consider using 1 or more digits');
    }
    if (!analysis.hasUppercase && analysis.hasLowercase) {
      suggestions.push('Consider using 1 or more uppercase letters');
    }
    if (!analysis.hasLowercase && analysis.hasUppercase) {
      suggestions.push('Consider using 1 or more lowercase letters');
    }
  }

  // If password is very strong, show positive reinforcement and best practices
  if (score >= 75 && patterns.length === 0) {
    suggestions.push('✓ Strong password! Remember: never reuse it across different sites');
    suggestions.push('✓ Use a password manager to generate and store unique passwords');
    suggestions.push('✓ Enable two-factor authentication (MFA) for maximum protection');
  } else if (score >= 60 && suggestions.length === 0) {
    suggestions.push('✓ Good password! Consider making it even longer for important accounts');
    suggestions.push('✓ Never reuse passwords across sites');
    suggestions.push('✓ Enable MFA wherever possible');
  }

  return suggestions;
}

/**
 * Generate a "better choice" password by fixing identified issues
 * CyLab approach: insert digits/symbols into the middle, not just at ends
 * For any password scoring below 60, generate a suggestion that scores above 60
 */
function generateBetterChoice(
  password: string,
  patterns: PatternMatch[],
  analysis: CharacterAnalysis,
  currentScore: number
): string | undefined {
  if (!password || password.length < 2) return undefined;

  // Only generate suggestions for passwords scoring below 60
  if (currentScore >= 60) return undefined;

  let improved = password;

  // Step 1: If digits are at the end, move them into the middle
  const hasDigitsAtEnd = patterns.some(p => p.type === 'digits-at-end');
  if (hasDigitsAtEnd) {
    const endDigitsMatch = improved.match(/^(.+?)(\d+)$/);
    if (endDigitsMatch) {
      const [, base, digits] = endDigitsMatch;
      const insertPos = Math.min(Math.ceil(base.length / 4), 3);
      improved = base.slice(0, insertPos) + digits + base.slice(insertPos);
    }
  }

  // Step 2: Ensure minimum length of 12+ characters for good score
  // Add random word segments if too short
  const targetLength = 16;
  if (improved.length < targetLength) {
    const additions = ['Kx', 'Qz', 'Jv', 'Pw', 'Ry'];
    const additionIndex = password.length % additions.length;
    // Insert in the middle to avoid end patterns
    const midpoint = Math.floor(improved.length / 2);
    while (improved.length < targetLength) {
      const toAdd = additions[(additionIndex + improved.length) % additions.length];
      improved = improved.slice(0, midpoint) + toAdd + improved.slice(midpoint);
    }
  }

  // Step 3: Ensure has uppercase (capitalize middle letter if needed)
  if (!/[A-Z]/.test(improved)) {
    const midIdx = Math.floor(improved.length / 2);
    const chars = improved.split('');
    // Find a lowercase letter near the middle to capitalize
    for (let i = midIdx; i < chars.length; i++) {
      if (/[a-z]/.test(chars[i])) {
        chars[i] = chars[i].toUpperCase();
        break;
      }
    }
    improved = chars.join('');
  }

  // Step 4: Ensure has lowercase
  if (!/[a-z]/.test(improved)) {
    const midIdx = Math.floor(improved.length / 2);
    const chars = improved.split('');
    for (let i = midIdx; i < chars.length; i++) {
      if (/[A-Z]/.test(chars[i])) {
        chars[i] = chars[i].toLowerCase();
        break;
      }
    }
    improved = chars.join('');
  }

  // Step 5: Ensure has digits in the middle (not at end)
  if (!/\d/.test(improved)) {
    const insertPos = Math.floor(improved.length / 3);
    improved = improved.slice(0, insertPos) + '7' + improved.slice(insertPos);
  }

  // Step 6: Ensure has symbols in the middle
  if (!/[^a-zA-Z0-9]/.test(improved)) {
    const insertPos = Math.floor(improved.length * 2 / 3);
    improved = improved.slice(0, insertPos) + '$' + improved.slice(insertPos);
  }

  // Final check: Make sure it's different from original
  if (improved === password) {
    // Force a change by inserting characters
    const midpoint = Math.floor(improved.length / 2);
    improved = improved.slice(0, midpoint) + '7$Kx' + improved.slice(midpoint);
  }

  return improved;
}

/**
 * Calculate overall password strength
 */
export function calculateStrength(password: string): StrengthResult {
  // Empty password
  if (!password) {
    return {
      score: 0,
      label: 'Enter a password',
      color: 'gray',
      characterAnalysis: {
        hasLowercase: false,
        hasUppercase: false,
        hasNumbers: false,
        hasSymbols: false,
        uniqueChars: 0,
        length: 0,
      },
      patterns: [],
      crackTimeCategory: '-',
      suggestions: ['Type a password above to see how strong it is'],
    };
  }

  // Analyze the password
  const analysis = analyzeCharacters(password);
  const patterns = analyzePatterns(password);
  const patternPenalty = calculatePatternPenalty(patterns);

  // Calculate component scores
  const lengthScore = calculateLengthScore(analysis.length);
  const varietyScore = calculateVarietyScore(analysis);
  const bonusScore = calculateBonusScore(password, analysis);

  // Calculate final score
  let score = lengthScore + varietyScore + bonusScore - patternPenalty;

  // Clamp score between 0-100
  score = Math.max(0, Math.min(100, score));

  // Generate results
  const betterChoice = generateBetterChoice(password, patterns, analysis, score);

  return {
    score,
    label: getStrengthLabel(score),
    color: getStrengthColor(score),
    characterAnalysis: analysis,
    patterns,
    crackTimeCategory: estimateCrackTime(score, analysis),
    suggestions: generateSuggestions(analysis, patterns, score),
    betterChoice,
  };
}
