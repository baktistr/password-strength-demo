'use client';

import { useEffect, useRef, ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  highContrast: boolean;
  presenterMode: boolean;
}

/**
 * Reusable modal component with accessibility support.
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  highContrast,
  presenterMode,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const overlayClasses = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm';
  
  const modalClasses = `
    relative w-full max-w-lg max-h-[80vh] overflow-auto rounded-xl shadow-2xl
    ${highContrast ? 'bg-gray-900 border-2 border-white' : 'bg-white border border-gray-200'}
    ${presenterMode ? 'p-6' : 'p-5'}
  `;

  const titleClasses = `
    font-bold mb-4
    ${highContrast ? 'text-white' : 'text-gray-900'}
    ${presenterMode ? 'text-presenter-lg' : 'text-xl'}
  `;

  const closeButtonClasses = `
    absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center
    transition-colors
    ${highContrast ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
    ${presenterMode ? 'text-lg' : 'text-base'}
  `;

  return (
    <div 
      className={overlayClasses} 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className={modalClasses}
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        <button
          onClick={onClose}
          className={closeButtonClasses}
          aria-label="Close modal"
        >
          ✕
        </button>
        <h2 id="modal-title" className={titleClasses}>
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}
