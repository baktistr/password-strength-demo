/**
 * Constants for the password strength meter.
 * Contains common passwords, sample passwords, and configuration values.
 */

// Common passwords to check against (curated, small list for demo)
// These are well-known weak passwords for educational purposes
export const COMMON_PASSWORDS: string[] = [
  'password',
  'password1',
  'password123',
  '123456',
  '12345678',
  '123456789',
  '1234567890',
  'qwerty',
  'qwerty123',
  'abc123',
  'monkey',
  'letmein',
  'dragon',
  'master',
  'login',
  'admin',
  'welcome',
  'iloveyou',
  'sunshine',
  'princess',
  'football',
  'baseball',
  'soccer',
  'hockey',
  'batman',
  'superman',
  'trustno1',
  'shadow',
  'michael',
  'jennifer',
  'jordan',
  'hunter',
  'charlie',
  'andrew',
  'daniel',
  'ashley',
  'joshua',
  'jessica',
  'thomas',
  'summer',
  'winter',
  'spring',
  'secret',
  'access',
  'flower',
  'passw0rd',
  'p@ssword',
  'p@ssw0rd',
  'pass1234',
  'changeme',
  'computer',
  'internet',
  'cheese',
];

// Sample passwords for demonstration (fictional, safe to display)
export const SAMPLE_PASSWORDS = [
  { label: 'Very Weak: "password"', value: 'password' },
  { label: 'Weak: "Summer2026!"', value: 'Summer2026!' },
  { label: 'Weak: "P@ssw0rd!"', value: 'P@ssw0rd!' },
  { label: 'Medium: "MyDog$Fluffy99"', value: 'MyDog$Fluffy99' },
  { label: 'Better: "Correct7Battery!River"', value: 'Correct7Battery!River' },
  { label: 'Strong: "purple-elephant-dancing-rain"', value: 'purple-elephant-dancing-rain' },
  { label: 'Strong: "Tr0ub4dor&3Horse"', value: 'Tr0ub4dor&3Horse' },
  { label: 'Very Strong: "xK9#mP2$vL7@nQ4"', value: 'xK9#mP2$vL7@nQ4' },
];

// Keyboard patterns (rows and common walks)
export const KEYBOARD_PATTERNS: string[] = [
  'qwertyuiop',
  'asdfghjkl',
  'zxcvbnm',
  'qwerty',
  'asdfgh',
  'zxcvbn',
  'qazwsx',
  'qweasd',
  'zaq1',
  '1qaz',
  '2wsx',
  '3edc',
  '4rfv',
  '5tgb',
  '6yhn',
  '7ujm',
  '0987654321',
  '1234567890',
  'poiuytrewq',
  'lkjhgfdsa',
  'mnbvcxz',
];

// Words commonly used in passwords
export const COMMON_WORDS: string[] = [
  'love',
  'baby',
  'angel',
  'girl',
  'rock',
  'star',
  'pass',
  'word',
  'user',
  'name',
  'home',
  'work',
  'test',
  'demo',
  'temp',
  'root',
  'super',
  'hello',
  'world',
];

// Scoring thresholds
export const SCORE_THRESHOLDS = {
  VERY_WEAK: 20,
  WEAK: 40,
  OK: 60,
  STRONG: 80,
  VERY_STRONG: 100,
};

// Length scoring breakpoints
export const LENGTH_SCORES = {
  MIN_LENGTH: 8,
  GOOD_LENGTH: 12,
  GREAT_LENGTH: 16,
  EXCELLENT_LENGTH: 20,
};

// Passphrase word lists (safe, non-sensitive words)
export const PASSPHRASE_ADJECTIVES: string[] = [
  'purple', 'golden', 'silver', 'dancing', 'jumping', 'flying',
  'happy', 'gentle', 'mighty', 'clever', 'brave', 'swift',
  'ancient', 'modern', 'crystal', 'frozen', 'blazing', 'calm',
];

export const PASSPHRASE_NOUNS: string[] = [
  'elephant', 'mountain', 'river', 'castle', 'dragon', 'phoenix',
  'tiger', 'dolphin', 'forest', 'ocean', 'thunder', 'garden',
  'sunrise', 'waterfall', 'meadow', 'canyon', 'lighthouse', 'comet',
];

export const PASSPHRASE_VERBS: string[] = [
  'runs', 'jumps', 'flies', 'swims', 'dances', 'sings',
  'glides', 'soars', 'bounces', 'sparkles', 'shines', 'glows',
];

// Challenge game passwords for ranking
export const CHALLENGE_PASSWORDS = [
  {
    password: 'Summer2024!',
    score: 35,
    explanation: 'Follows a predictable pattern: Season + Year + Symbol. Easy to guess.',
  },
  {
    password: 'P@ssw0rd123',
    score: 25,
    explanation: 'Common substitutions (@ for a, 0 for o) are well-known to attackers.',
  },
  {
    password: 'correct-horse-battery-staple',
    score: 85,
    explanation: 'Long passphrase with multiple words. Length provides excellent protection.',
  },
  {
    password: 'Jk8$mN2#pL',
    score: 65,
    explanation: 'Good variety but only 10 characters. Longer would be better.',
  },
];

// Speaker notes content
export const SPEAKER_NOTES = {
  intro: `
    Welcome to the Password Strength Meter demo! This tool is designed to teach
    password security concepts interactively.

    Key talking points:
    • LENGTH is the most important factor - each character exponentially increases cracking time
    • Common patterns (Season+Year, l33tspeak) are well-known to attackers
    • Password managers + MFA are the real solutions
  `,
  meter: `
    As you demo the meter:
    • Start with "password" to show a very weak example
    • Try "Summer2026!" to show why patterns are weak
    • Show "correct-horse-battery-staple" to demonstrate passphrase strength
    • Emphasize: longer is always better than complex-but-short
  `,
  challenge: `
    For the ranking challenge:
    • Let the audience discuss before revealing answers
    • Ask "Who thinks #1 is strongest? #2?" etc.
    • Reveal answers one by one for dramatic effect
    • Key insight: the passphrase wins despite no special characters!
  `,
  tips: `
    Closing recommendations:
    1. Use a password manager (show examples: Bitwarden, 1Password)
    2. Enable MFA/2FA everywhere possible
    3. Use unique passwords for every site
    4. Check haveibeenpwned.com for breached accounts
  `,
};
