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
  'passw0rd!',
  'p@ssword',
  'p@ssword!',
  'p@ssw0rd',
  'p@ssw0rd!',
  'pass1234',
  'changeme',
  'computer',
  'internet',
  'cheese',
];

// Sample passwords for demonstration (fictional, safe to display)
// One example per strength category - tested against scoring algorithm
export const SAMPLE_PASSWORDS = [
  // Very Weak (0-19): Common password with huge penalty
  { label: '🔴 Very Weak: "password"', value: 'password', category: 'very-weak' },
  
  // Weak (20-39): Short password
  { label: '🟠 Weak: "Kitty42!"', value: 'Kitty42!', category: 'weak' },
  
  // OK (40-59): 10-11 chars with variety
  { label: '🟡 OK: "BlueSky#42"', value: 'BlueSky#42', category: 'ok' },
  
  // Strong (60-79): 15+ chars with variety
  { label: '🟢 Strong: "Jazz&Blues#247!"', value: 'Jazz&Blues#247!', category: 'strong' },
  
  // Very Strong (80+): 20+ chars with all character types
  { label: '💪 Very Strong: "Kx7#Pm3@Qz9!Wy2&Rv5"', value: 'Kx7#Pm3@Qz9!Wy2&Rv5', category: 'very-strong' },
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
  'fluffy',
];

// English dictionary words (CyLab approach - common English words used in passwords)
// Based on frequently used words that appear in password dictionaries
export const DICTIONARY_WORDS: string[] = [
  // Common nouns
  'fireplace', 'computer', 'keyboard', 'password', 'security', 'internet',
  'football', 'baseball', 'basketball', 'hockey', 'soccer', 'tennis',
  'dragon', 'monkey', 'elephant', 'tiger', 'lion', 'bear', 'wolf',
  'sunshine', 'rainbow', 'thunder', 'lightning', 'butterfly', 'flower',
  'mountain', 'river', 'ocean', 'forest', 'garden', 'castle', 'house',
  'coffee', 'cookie', 'chocolate', 'banana', 'orange', 'apple', 'pizza',
  'summer', 'winter', 'spring', 'autumn', 'monday', 'friday', 'sunday',
  'master', 'shadow', 'hunter', 'killer', 'warrior', 'princess', 'prince',
  'secret', 'magic', 'wonder', 'mystery', 'fantasy', 'legend', 'hero',
  'guitar', 'music', 'movie', 'video', 'photo', 'picture', 'camera',
  'school', 'college', 'university', 'teacher', 'student', 'doctor',
  'family', 'friend', 'brother', 'sister', 'mother', 'father', 'daughter',
  // Common verbs
  'love', 'hate', 'like', 'want', 'need', 'think', 'know', 'believe',
  'running', 'walking', 'jumping', 'flying', 'swimming', 'dancing',
  // Common adjectives
  'happy', 'lucky', 'golden', 'silver', 'purple', 'blue', 'green', 'red',
  'super', 'great', 'awesome', 'amazing', 'beautiful', 'pretty', 'lovely',
  'strong', 'brave', 'smart', 'clever', 'funny', 'crazy', 'cool', 'hot',
  // Pop culture & brands
  'batman', 'superman', 'spiderman', 'ironman', 'captain', 'marvel',
  'starwars', 'pokemon', 'minecraft', 'fortnite', 'nintendo', 'playstation',
  'google', 'facebook', 'twitter', 'instagram', 'youtube', 'netflix',
  // Common password bases
  'admin', 'login', 'welcome', 'access', 'system', 'server', 'network',
  'cheese', 'pepper', 'mustard', 'butter', 'chicken', 'burger', 'sandwich',
  // Body parts & personal
  'heart', 'angel', 'devil', 'spirit', 'soul', 'dream', 'night', 'moon',
  // Technology
  'email', 'phone', 'mobile', 'tablet', 'laptop', 'desktop', 'screen',
  // Places
  'london', 'paris', 'tokyo', 'berlin', 'mexico', 'canada', 'america',
  // Sports teams & misc
  'yankees', 'lakers', 'cowboys', 'patriots', 'eagles', 'giants', 'bears',
  // More common words from breach dictionaries
  'forever', 'always', 'never', 'nothing', 'something', 'everything',
  'today', 'tomorrow', 'yesterday', 'morning', 'evening', 'midnight',
  'birthday', 'christmas', 'halloween', 'valentine', 'thanksgiving',
  'diamond', 'crystal', 'emerald', 'platinum', 'bronze', 'copper',
  'thunder', 'storm', 'fire', 'water', 'earth', 'wind', 'space',
  'vampire', 'zombie', 'ghost', 'witch', 'wizard', 'knight', 'queen', 'king',
  'ninja', 'samurai', 'pirate', 'cowboy', 'sheriff', 'soldier', 'marine',
  'rocket', 'planet', 'galaxy', 'universe', 'cosmos', 'star', 'alien',
];

// Common pet names (CyLab research shows these are frequently used)
export const PET_NAMES: string[] = [
  'fluffy',
  'buddy',
  'max',
  'bella',
  'charlie',
  'lucy',
  'cooper',
  'daisy',
  'rocky',
  'molly',
  'bailey',
  'sadie',
  'maggie',
  'sophie',
  'chloe',
  'duke',
  'tucker',
  'bear',
  'jack',
  'coco',
  'oliver',
  'murphy',
  'sam',
  'oscar',
  'teddy',
  'winston',
  'penny',
  'harley',
  'pepper',
  'ginger',
  'shadow',
  'princess',
  'bandit',
  'zeus',
  'sasha',
  'lucky',
  'rex',
  'spot',
  'fido',
  'buster',
  'milo',
  'simba',
  'tiger',
  'kitty',
  'mittens',
  'whiskers',
  'oreo',
  'toby',
  'bruno',
  'max',
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

// Challenge game passwords pool - 4 random ones selected each round
// Scores are actual values from the scoring algorithm
export const CHALLENGE_PASSWORDS_POOL = [
  // === VERY WEAK (0-19) - Common passwords, huge penalties ===
  {
    password: 'password',
    score: 0,
    explanation: 'One of the most common passwords. Attackers try this first!',
  },
  {
    password: 'qwerty',
    score: 0,
    explanation: 'Keyboard pattern - in every attacker\'s dictionary.',
  },
  {
    password: '123456789',
    score: 0,
    explanation: 'Simple number sequence. Cracked in milliseconds.',
  },
  {
    password: 'letmein',
    score: 0,
    explanation: 'Classic common password. Never use it!',
  },
  {
    password: 'P@ssw0rd!',
    score: 3,
    explanation: 'Leet speak (@ for a, 0 for o) is well-known to attackers.',
  },
  {
    password: 'Summer2026!',
    score: 0,
    explanation: 'Season+Year pattern is extremely common and guessable.',
  },
  {
    password: 'MySecret#2024',
    score: 0,
    explanation: 'Contains \"secret\" - a common password word. Heavily penalized.',
  },

  // === WEAK (20-39) - Short or patterned ===
  {
    password: 'Kitty42!',
    score: 23,
    explanation: '8 chars with variety, but too short and contains pet name.',
  },
  {
    password: 'Max!2025',
    score: 25,
    explanation: '8 chars with variety, but contains common name "Max".',
  },
  {
    password: 'Bear123!',
    score: 23,
    explanation: '8 chars - pet name "bear" reduces strength significantly.',
  },
  {
    password: 'Fluffy!1',
    score: 22,
    explanation: '8 chars with pet name. Too short and predictable.',
  },
  {
    password: 'Abc!@#12',
    score: 38,
    explanation: '8 chars with symbols, but sequential letters are weak.',
  },
  {
    password: 'Star!123',
    score: 38,
    explanation: '8 chars - common word "star" and sequential numbers.',
  },
  {
    password: 'Moon#42!',
    score: 38,
    explanation: '8 chars with variety, but common word "moon" detected.',
  },
  {
    password: 'Sunset2024!',
    score: 35,
    explanation: '11 chars but year pattern (2024) is predictable.',
  },

  // === OK (40-59) - Decent length, some issues ===
  {
    password: 'BlueSky#42',
    score: 48,
    explanation: '10 chars with good variety. Decent but could be longer.',
  },
  {
    password: 'Ocean#Wave7',
    score: 43,
    explanation: '11 chars with variety. Dictionary words reduce score.',
  },
  {
    password: 'Cloud9#Sky!',
    score: 43,
    explanation: '11 chars - common words detected but good variety.',
  },
  {
    password: 'Zx9@Km4!Pq',
    score: 48,
    explanation: '10 random chars. No patterns, approaching strong.',
  },
  {
    password: 'Nq5#Wr8!Yt',
    score: 48,
    explanation: '10 random chars with symbols. Good entropy!',
  },
  {
    password: 'RedBlue#42!',
    score: 53,
    explanation: '11 chars with colors. Simple words but good length.',
  },
  {
    password: 'Alpha#Beta9',
    score: 53,
    explanation: '11 chars with Greek letters. Creative approach!',
  },
  {
    password: 'Gamma!Ray#4',
    score: 52,
    explanation: '11 chars with science theme. Good variety.',
  },
  {
    password: 'xK9mL2pQ7nR4',
    score: 58,
    explanation: '12 random chars. Good variety, approaching strong territory.',
  },

  // === STRONG (60-79) - Good length and variety ===
  {
    password: 'Jazz&Blues#247!',
    score: 75,
    explanation: '15 chars with symbols, numbers. No dictionary words!',
  },
  {
    password: 'Coffee&Cake22',
    score: 67,
    explanation: '13 chars with symbols. Length helps even with simple words.',
  },
  {
    password: 'R2D2&C3PO#Rule!',
    score: 75,
    explanation: '15 chars with pop culture reference. Creative and strong!',
  },
  {
    password: 'jumping-frogs-swim',
    score: 77,
    explanation: '18-char passphrase. Easy to remember, hard to crack.',
  },
  {
    password: '2Fast&2Furious!',
    score: 74,
    explanation: '15 chars with numbers in middle. Movie reference works!',
  },
  {
    password: 'Tr0ub4dor&3Horse',
    score: 68,
    explanation: '16 mixed chars. Good variety and length combination.',
  },

  // === VERY STRONG (80+) - Long passphrases with variety ===
  {
    password: 'Kx7#Pm3@Qz9!Wy2&Rv5',
    score: 85,
    explanation: '20 random chars with all types. No patterns detected!',
  },
  {
    password: 'My3Dogs&2CatsRunFast!',
    score: 94,
    explanation: '21 chars, memorable sentence. Numbers in middle helps!',
  },
  {
    password: 'Green-Frog$Jumps-High#42',
    score: 91,
    explanation: '24 chars, creative passphrase with variety. Outstanding!',
  },
  {
    password: 'Kx7#Pm3@Qz9!Wy2&Jv5',
    score: 85,
    explanation: '19 random chars with all types. Maximum entropy!',
  },
  {
    password: 'Rocket$Moon#Stars42!',
    score: 77,
    explanation: '20 chars with space theme. Creative and strong!',
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
