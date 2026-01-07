'use client';

import { useState } from 'react';
import { SPEAKER_NOTES } from '@/utils/constants';

interface SpeakerNotesProps {
  highContrast: boolean;
  presenterMode: boolean;
}

/**
 * Collapsible speaker notes panel for presenters.
 */
export default function SpeakerNotes({
  highContrast,
  presenterMode,
}: SpeakerNotesProps) {
  const [activeSection, setActiveSection] = useState<string | null>('intro');

  const sections = [
    { id: 'intro', label: 'Introduction', content: SPEAKER_NOTES.intro },
    { id: 'meter', label: 'Using the Meter', content: SPEAKER_NOTES.meter },
    { id: 'challenge', label: 'Challenge Game', content: SPEAKER_NOTES.challenge },
    { id: 'tips', label: 'Closing Tips', content: SPEAKER_NOTES.tips },
  ];

  const textClasses = highContrast ? 'text-white' : 'text-gray-900';
  const mutedClasses = highContrast ? 'text-gray-300' : 'text-gray-600';

  return (
    <div
      className={`mb-6 rounded-lg overflow-hidden ${
        highContrast
          ? 'bg-gray-900 border-2 border-yellow-500'
          : 'bg-yellow-50 border-2 border-yellow-300'
      }`}
      role="complementary"
      aria-label="Speaker notes"
    >
      <div
        className={`p-3 ${
          highContrast ? 'bg-yellow-900/50' : 'bg-yellow-100'
        }`}
      >
        <h3
          className={`font-semibold ${textClasses} ${
            presenterMode ? 'text-presenter-base' : 'text-base'
          }`}
        >
          Speaker Notes (only you can see these)
        </h3>
      </div>

      {/* Section tabs */}
      <div className="flex flex-wrap border-b border-yellow-300/50">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() =>
              setActiveSection(activeSection === section.id ? null : section.id)
            }
            className={`px-4 py-2 transition-colors ${
              presenterMode ? 'text-presenter-sm' : 'text-sm'
            } ${
              activeSection === section.id
                ? highContrast
                  ? 'bg-yellow-800 text-yellow-100 font-medium'
                  : 'bg-yellow-200 text-yellow-900 font-medium'
                : highContrast
                  ? 'text-yellow-200 hover:bg-yellow-900/50'
                  : 'text-yellow-800 hover:bg-yellow-100'
            }`}
            aria-expanded={activeSection === section.id}
            aria-controls={`notes-${section.id}`}
          >
            {section.label}
          </button>
        ))}
      </div>

      {/* Active section content */}
      {activeSection && (
        <div
          id={`notes-${activeSection}`}
          className={`p-4 ${presenterMode ? 'text-presenter-sm' : 'text-sm'}`}
        >
          <pre
            className={`whitespace-pre-wrap font-sans ${mutedClasses}`}
          >
            {sections.find((s) => s.id === activeSection)?.content}
          </pre>
        </div>
      )}
    </div>
  );
}
