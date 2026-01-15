/**
 * Expanded dictionaries for password analysis.
 * Based on CUPS Lab Password Meter methodology.
 * 
 * Sources:
 * - Common passwords: Xato.net corpus (passwords appearing 4+ times)
 * - English words: BYU COCA + UNIX dictionary intersection
 * - Names: US Census popular male/female names
 * - Phrases: Wikipedia top 3-word phrases
 * - Wikipedia words: Top 1-grams not in English dictionary
 * 
 * @see https://github.com/cupslab/password_meter
 */

/**
 * Most common passwords from the Xato.net corpus.
 * These passwords appeared at least 10 times in data breaches.
 * Expanded list based on CUPS Lab dictionary-passwords.
 */
export const COMMON_PASSWORDS_EXPANDED: string[] = [
  // Top 100 most common passwords
  'password', '123456', '12345678', 'qwerty', 'abc123', 'monkey', '1234567',
  'letmein', 'trustno1', 'dragon', 'baseball', 'iloveyou', 'master', 'sunshine',
  'ashley', 'bailey', 'passw0rd', 'shadow', '123123', '654321', 'superman',
  'qazwsx', 'michael', 'football', 'password1', 'password123', 'batman',
  'login', 'admin', 'welcome', 'princess', 'starwars', 'hello', 'charlie',
  'donald', 'lovely', 'freedom', 'whatever', 'qwerty123', 'mustang', 'access',
  'solo', 'flower', 'hottie', 'loveme', 'killer', 'pepper', 'robert',
  'joshua', 'thomas', 'william', 'matthew', 'jennifer', 'amanda', 'jessica',
  'michelle', 'samantha', 'daniel', 'andrew', 'anthony', 'christopher',
  'joseph', 'nicholas', 'hannah', 'nicole', 'taylor', 'heather', 'austin',
  'cheese', 'summer', 'winter', 'spring', 'autumn', 'midnight', 'computer',
  'internet', 'thunder', 'corvette', 'ranger', 'maverick', 'soccer', 'hockey',
  'jordan', 'diamond', 'platinum', 'sparky', 'buster', 'ginger', 'cookie',
  'maggie', 'jasper', 'chocolate', 'orange', 'silver', 'golden', 'purple',
  
  // Common patterns with numbers
  'password1', 'password12', 'password123', 'qwerty1', 'qwerty12', 'qwerty123',
  'abc1234', 'test123', 'hello123', 'love123', 'admin123', 'root123', 'user123',
  '1q2w3e4r', '1qaz2wsx', 'zaq12wsx', 'pass1234', 'temp1234', 'welcome1',
  'welcome123', 'changeme', 'secret', 'secret123', 'letmein1', 'letmein123',
  
  // Keyboard patterns
  'qwertyuiop', 'asdfghjkl', 'zxcvbnm', '1234567890', 'qazwsxedc', 'qweasdzxc',
  '1q2w3e', '1qaz', '2wsx', '3edc', 'zaq1', 'xsw2', 'cde3',
  
  // Leet speak variants
  'p@ssword', 'p@ssw0rd', 'p455w0rd', 'l3tm31n', 'h3ll0', 's3cr3t', 'adm1n',
  'r00t', 'us3r', 't3st', 'h4ck3r', 'sup3r', 'm4st3r',
  
  // Year-based
  'password2020', 'password2021', 'password2022', 'password2023', 'password2024',
  'qwerty2020', 'qwerty2021', 'qwerty2022', 'qwerty2023', 'qwerty2024',
  
  // Season-based
  'summer2020', 'summer2021', 'summer2022', 'summer2023', 'summer2024',
  'winter2020', 'winter2021', 'winter2022', 'winter2023', 'winter2024',
  'spring2020', 'spring2021', 'spring2022', 'spring2023', 'spring2024',
  'fall2020', 'fall2021', 'fall2022', 'fall2023', 'fall2024',
  
  // Common phrases
  'iloveyou', 'ihateyou', 'fuckyou', 'letmein', 'logmein', 'openup',
  'opensesame', 'abracadabra', 'helloworld', 'goodnight', 'goodbye',
  
  // Company/product names
  'google', 'facebook', 'twitter', 'amazon', 'apple', 'microsoft', 'netflix',
  'spotify', 'instagram', 'linkedin', 'youtube', 'tiktok', 'snapchat',
];

/**
 * Common English words (subset of BYU COCA + UNIX dictionary).
 * Used to detect dictionary-based passwords.
 */
export const ENGLISH_WORDS: string[] = [
  // Common nouns
  'house', 'money', 'world', 'school', 'family', 'water', 'country', 'place',
  'mother', 'father', 'brother', 'sister', 'friend', 'office', 'company',
  'system', 'program', 'question', 'business', 'government', 'number', 'night',
  'point', 'story', 'study', 'problem', 'group', 'party', 'music', 'power',
  'change', 'market', 'service', 'health', 'player', 'history', 'result',
  'moment', 'reason', 'book', 'game', 'phone', 'movie', 'light', 'color',
  'picture', 'paper', 'letter', 'window', 'table', 'chair', 'door', 'floor',
  'wall', 'room', 'kitchen', 'bathroom', 'bedroom', 'garden', 'street',
  
  // Common verbs
  'love', 'hate', 'want', 'need', 'make', 'take', 'give', 'find', 'know',
  'think', 'feel', 'become', 'leave', 'call', 'keep', 'believe', 'allow',
  'remember', 'create', 'continue', 'happen', 'appear', 'include', 'consider',
  'follow', 'learn', 'change', 'watch', 'bring', 'begin', 'write', 'provide',
  'develop', 'move', 'play', 'run', 'hold', 'turn', 'offer', 'build',
  
  // Common adjectives
  'good', 'great', 'little', 'different', 'large', 'small', 'important',
  'young', 'long', 'black', 'white', 'red', 'blue', 'green', 'yellow',
  'orange', 'purple', 'pink', 'brown', 'dark', 'bright', 'beautiful',
  'happy', 'lucky', 'strong', 'special', 'super', 'magic', 'amazing',
  
  // Animals
  'dragon', 'tiger', 'lion', 'bear', 'wolf', 'eagle', 'horse', 'monkey',
  'dolphin', 'shark', 'snake', 'spider', 'butterfly', 'phoenix', 'unicorn',
  'panther', 'jaguar', 'falcon', 'hawk', 'raven', 'crow', 'owl', 'fox',
  'rabbit', 'kitty', 'puppy', 'doggy', 'kitten', 'panda', 'koala',
  
  // Sports
  'soccer', 'football', 'baseball', 'basketball', 'hockey', 'tennis', 'golf',
  'volleyball', 'swimming', 'running', 'boxing', 'wrestling', 'racing',
  
  // Technology
  'computer', 'internet', 'website', 'software', 'hardware', 'network',
  'server', 'database', 'security', 'hacker', 'cyber', 'digital', 'online',
  
  // Nature
  'sunshine', 'moonlight', 'starlight', 'rainbow', 'thunder', 'lightning',
  'ocean', 'river', 'mountain', 'forest', 'desert', 'island', 'beach',
  'flower', 'garden', 'nature', 'weather', 'storm', 'cloud', 'sunset',
  
  // Time
  'morning', 'evening', 'tonight', 'tomorrow', 'yesterday', 'forever',
  'always', 'never', 'sometimes', 'moment', 'second', 'minute', 'hour',
  
  // Emotions/concepts
  'freedom', 'destiny', 'legend', 'warrior', 'champion', 'victory', 'glory',
  'honor', 'power', 'strength', 'courage', 'wisdom', 'justice', 'peace',
  'dream', 'hope', 'faith', 'trust', 'truth', 'spirit', 'soul', 'heart',
  'angel', 'devil', 'heaven', 'shadow', 'darkness', 'light', 'fire',
  'flame', 'ice', 'frost', 'storm', 'wind', 'earth', 'star', 'moon', 'sun',
];

/**
 * Common US names (male and female).
 * Based on US Census data for popular names.
 */
export const COMMON_NAMES: string[] = [
  // Male names
  'james', 'john', 'robert', 'michael', 'david', 'william', 'richard',
  'joseph', 'thomas', 'charles', 'christopher', 'daniel', 'matthew',
  'anthony', 'mark', 'donald', 'steven', 'paul', 'andrew', 'joshua',
  'kenneth', 'kevin', 'brian', 'george', 'timothy', 'ronald', 'edward',
  'jason', 'jeffrey', 'ryan', 'jacob', 'gary', 'nicholas', 'eric',
  'jonathan', 'stephen', 'larry', 'justin', 'scott', 'brandon', 'benjamin',
  'samuel', 'raymond', 'gregory', 'frank', 'alexander', 'patrick', 'jack',
  'dennis', 'jerry', 'tyler', 'aaron', 'jose', 'adam', 'nathan', 'henry',
  'douglas', 'zachary', 'peter', 'kyle', 'noah', 'ethan', 'jeremy', 'walter',
  'christian', 'keith', 'roger', 'terry', 'austin', 'sean', 'gerald',
  'carl', 'harold', 'dylan', 'arthur', 'lawrence', 'jordan', 'jesse',
  'bryan', 'billy', 'bruce', 'gabriel', 'joe', 'logan', 'albert', 'willie',
  'alan', 'eugene', 'russell', 'vincent', 'philip', 'bobby', 'johnny',
  'bradley', 'connor', 'hunter', 'mason', 'liam', 'oliver', 'lucas',
  
  // Female names
  'mary', 'patricia', 'jennifer', 'linda', 'barbara', 'elizabeth', 'susan',
  'jessica', 'sarah', 'karen', 'lisa', 'nancy', 'betty', 'margaret', 'sandra',
  'ashley', 'kimberly', 'emily', 'donna', 'michelle', 'dorothy', 'carol',
  'amanda', 'melissa', 'deborah', 'stephanie', 'rebecca', 'sharon', 'laura',
  'cynthia', 'kathleen', 'amy', 'angela', 'shirley', 'anna', 'brenda',
  'pamela', 'emma', 'nicole', 'helen', 'samantha', 'katherine', 'christine',
  'debra', 'rachel', 'carolyn', 'janet', 'catherine', 'maria', 'heather',
  'diane', 'ruth', 'julie', 'olivia', 'joyce', 'virginia', 'victoria',
  'kelly', 'lauren', 'christina', 'joan', 'evelyn', 'judith', 'megan',
  'andrea', 'cheryl', 'hannah', 'jacqueline', 'martha', 'gloria', 'teresa',
  'ann', 'sara', 'madison', 'frances', 'kathryn', 'janice', 'jean', 'abigail',
  'alice', 'judy', 'sophia', 'grace', 'denise', 'amber', 'doris', 'marilyn',
  'danielle', 'beverly', 'isabella', 'theresa', 'diana', 'natalie', 'brittany',
  'charlotte', 'marie', 'kayla', 'alexis', 'lori', 'chloe', 'ava', 'mia',
  'ella', 'lily', 'zoe', 'riley', 'claire', 'sophie', 'harper', 'scarlett',
];

/**
 * Common phrases (3-grams from Wikipedia).
 * Removed spaces for password matching.
 */
export const COMMON_PHRASES: string[] = [
  // Common 2-3 word combinations (no spaces)
  'iloveyou', 'ihateyou', 'ilove', 'loveyou', 'missyou', 'thankyou',
  'letmein', 'openup', 'getout', 'comein', 'goaway', 'comehere',
  'helloworld', 'goodnight', 'goodmorning', 'goodevening', 'goodbye',
  'seeya', 'seeyou', 'byebye', 'takecare', 'havefun', 'begood',
  'mypassword', 'mypass', 'thepassword', 'secretpassword', 'newpassword',
  'oldpassword', 'forgotpassword', 'changepassword', 'resetpassword',
  'firstname', 'lastname', 'fullname', 'username', 'myname', 'yourname',
  'tryme', 'testme', 'hackme', 'findme', 'catchme', 'followme',
  'trustme', 'believeme', 'helpme', 'saveme', 'killme', 'loveme',
  'onelove', 'truelove', 'firstlove', 'mylove', 'yourlove', 'lovelove',
  'bigboy', 'biggirl', 'badboy', 'badgirl', 'goodboy', 'goodgirl',
  'hotdog', 'hotgirl', 'hotboy', 'sexygirl', 'sexyboy', 'cutegirl',
  'codeblue', 'codered', 'blackops', 'callofduty', 'grandtheft',
  'starwars', 'startrek', 'harrypotter', 'lordoftherings', 'gameofthrones',
  'breakingbad', 'walkingdead', 'strangerthings', 'squidgame',
  'happybirthday', 'merrychristmas', 'happynewyear', 'thanksgiving',
  'halloween', 'valentines', 'mothersday', 'fathersday',
  'newyork', 'losangeles', 'sanfrancisco', 'lasvegas', 'chicago',
  'unitedstates', 'america', 'california', 'florida', 'texas',
  'rockandroll', 'hiphop', 'countrymusic', 'classicrock', 'heavymetal',
];

/**
 * Common pet names.
 * Based on popular pet names in the US.
 */
export const PET_NAMES_EXPANDED: string[] = [
  // Dogs
  'buddy', 'max', 'charlie', 'cooper', 'rocky', 'bear', 'duke', 'tucker',
  'jack', 'teddy', 'oliver', 'riley', 'bailey', 'bentley', 'milo', 'buster',
  'cody', 'murphy', 'zeus', 'lucky', 'oscar', 'leo', 'winston', 'toby',
  'louie', 'bruno', 'bandit', 'diesel', 'rusty', 'jake', 'gus', 'sam',
  'harley', 'jax', 'rex', 'shadow', 'hunter', 'beau', 'apollo', 'henry',
  
  // Cats
  'luna', 'bella', 'lucy', 'kitty', 'chloe', 'lily', 'sophie', 'cleo',
  'gracie', 'molly', 'mia', 'princess', 'callie', 'angel', 'daisy', 'abby',
  'simba', 'tiger', 'smokey', 'tigger', 'mittens', 'felix', 'garfield',
  'ginger', 'fluffy', 'patches', 'whiskers', 'oreo', 'pepper', 'pumpkin',
  'jasper', 'boots', 'cinnamon', 'biscuit', 'cookie', 'cupcake', 'mocha',
  'peanut', 'snickers', 'butterscotch', 'caramel', 'cocoa', 'toffee',
  
  // General pet names
  'sparky', 'princess', 'maggie', 'sadie', 'coco', 'penny', 'honey', 'missy',
  'roxy', 'lola', 'zoey', 'sasha', 'gizmo', 'pebbles', 'ruby', 'stella',
];

/**
 * Check if a password or substring matches any dictionary word.
 * Returns the matched word and its category if found.
 */
export interface DictionaryMatch {
  word: string;
  category: 'password' | 'english' | 'name' | 'phrase' | 'pet';
  penalty: number;
}

/**
 * Check password against all dictionaries.
 * Returns all matches found.
 */
export function checkDictionaries(password: string): DictionaryMatch[] {
  const lower = password.toLowerCase();
  const matches: DictionaryMatch[] = [];
  
  // Check common passwords (highest penalty)
  for (const pw of COMMON_PASSWORDS_EXPANDED) {
    if (lower === pw || lower.includes(pw)) {
      matches.push({ word: pw, category: 'password', penalty: 40 });
    }
  }
  
  // Check common names (medium-high penalty)
  for (const name of COMMON_NAMES) {
    if (name.length >= 4 && lower.includes(name)) {
      // Don't double-count if already matched as password
      if (!matches.some(m => m.word === name)) {
        matches.push({ word: name, category: 'name', penalty: 15 });
      }
    }
  }
  
  // Check pet names
  for (const pet of PET_NAMES_EXPANDED) {
    if (pet.length >= 4 && lower.includes(pet)) {
      if (!matches.some(m => m.word === pet)) {
        matches.push({ word: pet, category: 'pet', penalty: 15 });
      }
    }
  }
  
  // Check common phrases
  for (const phrase of COMMON_PHRASES) {
    if (phrase.length >= 6 && lower.includes(phrase)) {
      if (!matches.some(m => m.word === phrase)) {
        matches.push({ word: phrase, category: 'phrase', penalty: 20 });
      }
    }
  }
  
  // Check English words (lower penalty, only for longer matches)
  for (const word of ENGLISH_WORDS) {
    if (word.length >= 5 && lower.includes(word)) {
      // Don't double-count
      if (!matches.some(m => m.word === word)) {
        matches.push({ word: word, category: 'english', penalty: 10 });
      }
    }
  }
  
  return matches;
}

/**
 * Get category display name.
 */
export function getCategoryLabel(category: DictionaryMatch['category']): string {
  switch (category) {
    case 'password': return 'Common Password';
    case 'english': return 'Dictionary Word';
    case 'name': return 'Common Name';
    case 'phrase': return 'Common Phrase';
    case 'pet': return 'Pet Name';
    default: return 'Dictionary Match';
  }
}
