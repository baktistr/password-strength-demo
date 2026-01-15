/**
 * Have I Been Pwned (HIBP) Pwned Passwords API integration.
 * Uses k-anonymity to check if a password has been exposed in data breaches
 * without ever sending the full password to the API.
 * 
 * @see https://haveibeenpwned.com/API/v3#PwnedPasswords
 */

export interface BreachResult {
  isBreached: boolean;
  count: number; // Number of times password appeared in breaches
  error?: string;
  loading?: boolean;
}

/**
 * Convert a string to SHA-1 hash using Web Crypto API.
 * Returns uppercase hex string.
 */
async function sha1(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex.toUpperCase();
}

/**
 * Check if a password has been exposed in known data breaches.
 * Uses k-anonymity: only the first 5 characters of the SHA-1 hash are sent to the API.
 * The API returns all hash suffixes matching that prefix, and we check locally.
 * 
 * @param password - The password to check
 * @returns Promise<BreachResult> - Contains breach status and occurrence count
 * 
 * @example
 * const result = await checkPasswordBreach("password123");
 * // result.isBreached = true
 * // result.count = 123456 (times this password appeared in breaches)
 */
export async function checkPasswordBreach(password: string): Promise<BreachResult> {
  // Don't check empty or very short passwords
  if (!password || password.length < 1) {
    return { isBreached: false, count: 0 };
  }

  try {
    // Generate SHA-1 hash of the password
    const hash = await sha1(password);
    
    // Split hash: first 5 chars (prefix) and rest (suffix)
    const prefix = hash.substring(0, 5);
    const suffix = hash.substring(5);

    // Query the HIBP API with k-anonymity (only send prefix)
    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      method: 'GET',
      headers: {
        'Add-Padding': 'true', // Additional privacy protection
      },
    });

    if (!response.ok) {
      throw new Error(`HIBP API error: ${response.status}`);
    }

    const text = await response.text();
    
    // Parse response: each line is "HASH_SUFFIX:COUNT"
    const lines = text.split('\n');
    
    for (const line of lines) {
      const [hashSuffix, countStr] = line.split(':');
      if (hashSuffix && hashSuffix.trim() === suffix) {
        const count = parseInt(countStr.trim(), 10);
        // Count of 0 means it's a padding entry (not a real breach)
        if (count > 0) {
          return { isBreached: true, count };
        }
      }
    }

    // Password not found in any breach
    return { isBreached: false, count: 0 };
  } catch (error) {
    console.error('HIBP check failed:', error);
    return { 
      isBreached: false, 
      count: 0, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Format breach count for display.
 * @example formatBreachCount(1234567) => "1.2M"
 */
export function formatBreachCount(count: number): string {
  if (count === 0) return '0';
  if (count < 1000) return count.toString();
  if (count < 1000000) return `${(count / 1000).toFixed(1)}K`;
  if (count < 1000000000) return `${(count / 1000000).toFixed(1)}M`;
  return `${(count / 1000000000).toFixed(1)}B`;
}
