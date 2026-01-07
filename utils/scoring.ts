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
 * Calculate length score (up to 60 points)
 * Length is weighted heavily as it's the most important factor
 */
function calculateLengthScore(length: number): number {
  if (length === 0) return 0;
  if (length < LENGTH_SCORES.MIN_LENGTH) {
    // Below minimum: scale from 0-15
    return Math.floor((length / LENGTH_SCORES.MIN_LENGTH) * 15);
  }
  if (length < LENGTH_SCORES.GOOD_LENGTH) {
    // 8-11 chars: scale from 15-35
    return 15 + Math.floor(((length - LENGTH_SCORES.MIN_LENGTH) / 4) * 20);
  }
  if (length < LENGTH_SCORES.GREAT_LENGTH) {
    // 12-15 chars: scale from 35-50
    return 35 + Math.floor(((length - LENGTH_SCORES.GOOD_LENGTH) / 4) * 15);
  }
  if (length < LENGTH_SCORES.EXCELLENT_LENGTH) {
    // 16-19 chars: scale from 50-55
    return 50 + Math.floor(((length - LENGTH_SCORES.GREAT_LENGTH) / 4) * 5);
  }
  // 20+ chars: max length score of 60
  return 60;
}

/**
 * Calculate variety score (up to 20 points)
 * Based on character types used
 */
function calculateVarietyScore(analysis: CharacterAnalysis): number {
  let score = 0;

  // Points for each character type
  if (analysis.hasLowercase) score += 4;
  if (analysis.hasUppercase) score += 4;
  if (analysis.hasNumbers) score += 4;
  if (analysis.hasSymbols) score += 5;

  // Bonus for high unique character ratio
  if (analysis.length > 0) {
    const uniqueRatio = analysis.uniqueChars / analysis.length;
    if (uniqueRatio > 0.8) score += 3;
    else if (uniqueRatio > 0.6) score += 2;
    else if (uniqueRatio > 0.4) score += 1;
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
 * Generate suggestions based on weaknesses
 */
function generateSuggestions(
  analysis: CharacterAnalysis,
  patterns: PatternMatch[]
): string[] {
  const suggestions: string[] = [];

  // Length suggestions (most important)
  if (analysis.length < LENGTH_SCORES.MIN_LENGTH) {
    suggestions.push('Make it at least 12 characters (length is the most important factor!)');
  } else if (analysis.length < LENGTH_SCORES.GOOD_LENGTH) {
    suggestions.push('Aim for 12+ characters — longer passwords are exponentially harder to crack');
  } else if (analysis.length < LENGTH_SCORES.GREAT_LENGTH) {
    suggestions.push('Great length! Consider 16+ characters for sensitive accounts');
  }

  // Pattern-based suggestions
  for (const pattern of patterns) {
    switch (pattern.type) {
      case 'common':
        suggestions.push('Avoid common passwords — attackers try these first');
        break;
      case 'keyboard':
      case 'keyboard-partial':
        suggestions.push('Avoid keyboard patterns like "qwerty" or "asdf"');
        break;
      case 'sequential':
        suggestions.push('Avoid sequential characters like "123" or "abc"');
        break;
      case 'year-recent':
      case 'season-year':
      case 'month-year':
        suggestions.push('Avoid date patterns — they\'re commonly guessed');
        break;
      case 'leet':
        suggestions.push('Letter substitutions (@ for a, 0 for o) are well-known to attackers');
        break;
    }

    // Limit suggestions
    if (suggestions.length >= 3) break;
  }

  // Variety suggestions (lower priority than length)
  if (suggestions.length < 3) {
    if (!analysis.hasLowercase && !analysis.hasUppercase) {
      suggestions.push('Add some letters for variety');
    }
    if (analysis.length >= 12 && !analysis.hasNumbers && !analysis.hasSymbols) {
      suggestions.push('Consider adding numbers or symbols for extra variety');
    }
  }

  // Always recommend password manager and MFA
  if (suggestions.length < 4) {
    suggestions.push('Use a password manager to generate and store unique passwords');
  }
  if (suggestions.length < 5) {
    suggestions.push('Enable two-factor authentication (MFA) whenever possible');
  }

  return suggestions.slice(0, 5);
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
  return {
    score,
    label: getStrengthLabel(score),
    color: getStrengthColor(score),
    characterAnalysis: analysis,
    patterns,
    crackTimeCategory: estimateCrackTime(score, analysis),
    suggestions: generateSuggestions(analysis, patterns),
  };
}
