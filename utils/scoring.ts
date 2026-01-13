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
 * Calculate length score (up to 70 points)
 * Length is the most critical factor - CyLab research shows it's more important than complexity
 */
function calculateLengthScore(length: number): number {
  if (length === 0) return 0;
  if (length < 8) {
    // Below 8 chars: very weak, scale from 0-10
    return Math.floor((length / 8) * 10);
  }
  if (length < 12) {
    // 8-11 chars: weak to ok, scale from 10-30
    return 10 + Math.floor(((length - 8) / 4) * 20);
  }
  if (length < 16) {
    // 12-15 chars: good, scale from 30-50
    return 30 + Math.floor(((length - 12) / 4) * 20);
  }
  if (length < 20) {
    // 16-19 chars: strong, scale from 50-60
    return 50 + Math.floor(((length - 16) / 4) * 10);
  }
  // 20+ chars: very strong, scale from 60-70 (max out at 25 chars)
  return Math.min(70, 60 + Math.floor(((length - 20) / 5) * 10));
}

/**
 * Calculate variety score (up to 15 points)
 * CyLab research shows variety matters, but less than length
 * Unpredictable placement of character types is key
 */
function calculateVarietyScore(analysis: CharacterAnalysis): number {
  let score = 0;

  // Count character classes (lowercase is baseline, doesn't add points)
  let characterClasses = 0;
  if (analysis.hasLowercase) characterClasses++;
  if (analysis.hasUppercase) characterClasses++;
  if (analysis.hasNumbers) characterClasses++;
  if (analysis.hasSymbols) characterClasses++;

  // Award points based on character class diversity
  if (characterClasses >= 2) score += 3;
  if (characterClasses >= 3) score += 3;
  if (characterClasses >= 4) score += 3;

  // Bonus for high unique character ratio (indicates less repetition)
  if (analysis.length > 0) {
    const uniqueRatio = analysis.uniqueChars / analysis.length;
    if (uniqueRatio > 0.8) score += 3;
    else if (uniqueRatio > 0.6) score += 2;
    else if (uniqueRatio > 0.5) score += 1;
  }

  return Math.min(score, 15);
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
 * Following CyLab methodology: limit to top 3 most critical improvements
 */
function generateSuggestions(
  analysis: CharacterAnalysis,
  patterns: PatternMatch[],
  score: number
): string[] {
  const suggestions: string[] = [];

  // Priority 1: Critical patterns (common passwords, keyboard patterns)
  const criticalPatterns = patterns.filter(p =>
    p.type === 'common' ||
    p.type === 'common-base' ||
    p.type === 'keyboard' ||
    p.type === 'season-year' ||
    p.type === 'month-year'
  );

  if (criticalPatterns.length > 0) {
    const pattern = criticalPatterns[0];
    if (pattern.type === 'common' || pattern.type === 'common-base') {
      suggestions.push('This password (or parts of it) appears in common password lists');
    } else if (pattern.type === 'keyboard') {
      suggestions.push('Avoid keyboard patterns — attackers check these first');
    } else if (pattern.type === 'season-year' || pattern.type === 'month-year') {
      suggestions.push('Avoid predictable patterns like Season+Year or Month+Year');
    }
  }

  // Priority 2: Length (most important positive factor)
  if (suggestions.length < 3 && analysis.length < 12) {
    suggestions.push('Make it at least 12 characters — length is your strongest defense');
  } else if (suggestions.length < 3 && analysis.length < 16) {
    suggestions.push('Consider 16+ characters for maximum security');
  }

  // Priority 3: Other patterns
  if (suggestions.length < 3) {
    const otherPatterns = patterns.filter(p =>
      p.type === 'leet' ||
      p.type === 'leet-word' ||
      p.type === 'sequential' ||
      p.type === 'repeated' ||
      p.type === 'year-recent'
    );

    if (otherPatterns.length > 0) {
      const pattern = otherPatterns[0];
      if (pattern.type === 'leet' || pattern.type === 'leet-word') {
        suggestions.push('Simple substitutions (@=a, 0=o) don\'t fool modern crackers');
      } else if (pattern.type === 'sequential') {
        suggestions.push('Avoid sequential patterns like "123" or "abc"');
      } else if (pattern.type === 'repeated') {
        suggestions.push('Avoid repeated characters');
      } else if (pattern.type === 'year-recent') {
        suggestions.push('Avoid recent years — they\'re commonly guessed');
      }
    }
  }

  // Priority 4: Character variety (only if no major issues)
  if (suggestions.length < 3) {
    const characterClasses = [
      analysis.hasLowercase,
      analysis.hasUppercase,
      analysis.hasNumbers,
      analysis.hasSymbols
    ].filter(Boolean).length;

    if (characterClasses < 2) {
      suggestions.push('Mix different character types (letters, numbers, symbols)');
    } else if (analysis.length >= 12 && characterClasses < 3) {
      suggestions.push('Add symbols or numbers in unpredictable positions');
    }
  }

  // If password is very strong, show positive reinforcement
  if (score >= 75 && suggestions.length === 0) {
    suggestions.push('Strong password! Remember: never reuse it across sites');
    suggestions.push('Use a password manager to store it securely');
    suggestions.push('Enable two-factor authentication for maximum protection');
  }

  // Always limit to top 3 most critical suggestions (CyLab approach)
  return suggestions.slice(0, 3);
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
    suggestions: generateSuggestions(analysis, patterns, score),
  };
}
