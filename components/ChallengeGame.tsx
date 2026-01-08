'use client';

import { useState, useMemo, useCallback } from 'react';
import { CHALLENGE_PASSWORDS_POOL } from '@/utils/constants';

interface ChallengeGameProps {
  presenterMode: boolean;
  highContrast: boolean;
}

interface ChallengePassword {
  password: string;
  score: number;
  explanation: string;
}

interface RankedPassword extends ChallengePassword {
  actualRank: number;
}

/**
 * Randomly select n items from an array
 */
function selectRandom<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Interactive challenge game where audience ranks passwords by strength.
 * Randomly selects 4 passwords from a pool each round.
 */
export default function ChallengeGame({
  presenterMode,
  highContrast,
}: ChallengeGameProps) {
  const [revealed, setRevealed] = useState(false);
  const [selectedRanks, setSelectedRanks] = useState<{ [key: number]: number }>({});
  const [roundKey, setRoundKey] = useState(0); // Used to trigger new random selection

  const textClasses = highContrast ? 'text-white' : 'text-gray-900';
  const mutedClasses = highContrast ? 'text-gray-300' : 'text-gray-600';

  // Randomly select 4 passwords and sort by score for ranking
  const rankedPasswords: RankedPassword[] = useMemo(() => {
    const selected = selectRandom(CHALLENGE_PASSWORDS_POOL, 4);
    const sorted = [...selected].sort((a, b) => b.score - a.score);
    return sorted.map((pw, index) => ({
      ...pw,
      actualRank: index + 1,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundKey]);

  // Shuffled order for display (randomize so strongest isn't always first)
  const displayOrder = useMemo(() => {
    const shuffled = [...rankedPasswords];
    shuffled.sort(() => Math.random() - 0.5);
    return shuffled;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rankedPasswords]);

  const handleRankSelect = (passwordIndex: number, rank: number) => {
    if (revealed) return;

    // Remove this rank from any other password
    const newRanks = { ...selectedRanks };
    Object.keys(newRanks).forEach((key) => {
      if (newRanks[parseInt(key)] === rank) {
        delete newRanks[parseInt(key)];
      }
    });

    // Assign rank to this password
    newRanks[passwordIndex] = rank;
    setSelectedRanks(newRanks);
  };

  const resetGame = useCallback(() => {
    setRevealed(false);
    setSelectedRanks({});
    setRoundKey((prev) => prev + 1); // Trigger new random selection
  }, []);

  const cardClasses = `
    p-4 rounded-lg transition-all
    ${highContrast
      ? 'bg-gray-800 border-2 border-gray-600'
      : 'bg-white border-2 border-gray-200'}
  `;

  const buttonClasses = (active: boolean, correct?: boolean) => `
    w-10 h-10 rounded-full font-bold transition-all
    ${presenterMode ? 'text-lg' : 'text-sm'}
    ${revealed && correct !== undefined
      ? correct
        ? 'bg-green-500 text-white'
        : 'bg-red-500 text-white'
      : active
        ? highContrast
          ? 'bg-blue-500 text-white'
          : 'bg-blue-600 text-white'
        : highContrast
          ? 'bg-gray-700 text-white hover:bg-gray-600'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
  `;

  // Find the strongest password for the takeaway message
  const strongestPassword = rankedPasswords.find((pw) => pw.actualRank === 1);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2
          className={`font-bold mb-2 ${textClasses} ${
            presenterMode ? 'text-presenter-xl' : 'text-2xl'
          }`}
        >
          Rank These Passwords!
        </h2>
        <p className={`${mutedClasses} ${presenterMode ? 'text-presenter-sm' : 'text-base'}`}>
          Which password is strongest? Rank them 1 (strongest) to 4 (weakest)
        </p>
      </div>

      {/* Password cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {displayOrder.map((pw, index) => (
          <div
            key={`${roundKey}-${index}`}
            className={`${cardClasses} ${
              revealed
                ? pw.actualRank === 1
                  ? highContrast
                    ? 'border-green-500 bg-green-900/30'
                    : 'border-green-500 bg-green-50'
                  : ''
                : ''
            }`}
          >
            {/* Password display */}
            <p
              className={`font-mono mb-3 break-all ${textClasses} ${
                presenterMode ? 'text-presenter-base' : 'text-lg'
              }`}
            >
              {pw.password}
            </p>

            {/* Rank buttons */}
            <div className="flex gap-2 mb-3">
              <span className={`${mutedClasses} ${presenterMode ? 'text-sm' : 'text-xs'} mr-2`}>
                Your rank:
              </span>
              {[1, 2, 3, 4].map((rank) => {
                const isSelected = selectedRanks[index] === rank;
                const isCorrect = revealed && isSelected && rank === pw.actualRank;
                const isWrong = revealed && isSelected && rank !== pw.actualRank;

                return (
                  <button
                    key={rank}
                    onClick={() => handleRankSelect(index, rank)}
                    disabled={revealed}
                    className={buttonClasses(
                      isSelected,
                      revealed ? (isCorrect ? true : isWrong ? false : undefined) : undefined
                    )}
                    aria-label={`Rank ${rank}${isSelected ? ' (selected)' : ''}`}
                    aria-pressed={isSelected}
                  >
                    {rank}
                  </button>
                );
              })}
            </div>

            {/* Reveal info */}
            {revealed && (
              <div
                className={`p-3 rounded ${
                  highContrast
                    ? 'bg-gray-900 border border-gray-700'
                    : 'bg-gray-50 border border-gray-200'
                }`}
              >
                <p className={`font-medium ${textClasses} ${presenterMode ? 'text-presenter-sm' : 'text-sm'}`}>
                  Actual Rank: <strong>#{pw.actualRank}</strong> (Score: {pw.score}/100)
                </p>
                <p className={`mt-1 ${mutedClasses} ${presenterMode ? 'text-sm' : 'text-xs'}`}>
                  {pw.explanation}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex justify-center gap-4">
        {!revealed ? (
          <button
            onClick={() => setRevealed(true)}
            className={`px-8 py-4 rounded-lg font-bold transition-all
              ${presenterMode ? 'text-presenter-base' : 'text-lg'}
              ${highContrast
                ? 'bg-green-600 text-white hover:bg-green-500 border-2 border-green-400'
                : 'bg-green-600 text-white hover:bg-green-700'}`}
          >
            Reveal Answers!
          </button>
        ) : (
          <button
            onClick={resetGame}
            className={`px-8 py-4 rounded-lg font-bold transition-all
              ${presenterMode ? 'text-presenter-base' : 'text-lg'}
              ${highContrast
                ? 'bg-blue-600 text-white hover:bg-blue-500 border-2 border-blue-400'
                : 'bg-blue-600 text-white hover:bg-blue-700'}`}
          >
            New Round
          </button>
        )}
      </div>

      {/* Key takeaway after reveal */}
      {revealed && strongestPassword && (
        <div
          className={`p-6 rounded-lg ${
            highContrast
              ? 'bg-purple-900/50 border-2 border-purple-400'
              : 'bg-purple-50 border-2 border-purple-200'
          }`}
        >
          <h3
            className={`font-bold mb-3 ${textClasses} ${
              presenterMode ? 'text-presenter-lg' : 'text-xl'
            }`}
          >
            Key Takeaway
          </h3>
          <p className={`${mutedClasses} ${presenterMode ? 'text-presenter-sm' : 'text-base'}`}>
            The winner is <strong className="font-mono">{strongestPassword.password}</strong> with
            a score of <strong>{strongestPassword.score}/100</strong>. {strongestPassword.explanation}
          </p>
          <p className={`mt-3 ${mutedClasses} ${presenterMode ? 'text-presenter-sm' : 'text-base'}`}>
            <strong>Remember:</strong> Length beats complexity. A long passphrase
            is both easier to remember AND more secure than a short complex password.
          </p>
        </div>
      )}
    </div>
  );
}
