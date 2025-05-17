import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface FlashcardProps {
  front: string;
  back: string;
  onNext?: () => void;
  onPrev?: () => void;
  showControls?: boolean;
}

export function Flashcard({ front, back, onNext, onPrev, showControls = true }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === ' ' || event.key === 'Enter') {
        setIsFlipped(prev => !prev);
        event.preventDefault();
      } else if (event.key === 'ArrowRight' && onNext) {
        onNext();
        event.preventDefault();
      } else if (event.key === 'ArrowLeft' && onPrev) {
        onPrev();
        event.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNext, onPrev]);

  // Touch gestures
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const diffX = touchStartX.current - touchEndX.current;
    
    // Swipe threshold (50px)
    if (Math.abs(diffX) > 50) {
      if (diffX > 0 && onNext) {
        // Swipe left, go next
        onNext();
      } else if (diffX < 0 && onPrev) {
        // Swipe right, go prev
        onPrev();
      }
    } else {
      // Small movement, flip the card
      setIsFlipped(prev => !prev);
    }
    
    // Reset values
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div className="w-full max-w-lg mx-auto perspective-1000">
      <div className="relative">
        {/* Navigation controls */}
        {showControls && (
          <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between pointer-events-none z-10">
            {onPrev && (
              <button 
                onClick={onPrev}
                className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 pointer-events-auto"
                aria-label="Previous flashcard"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}
            {onNext && (
              <button 
                onClick={onNext}
                className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 pointer-events-auto"
                aria-label="Next flashcard"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            )}
          </div>
        )}

        {/* Flashcard */}
        <div 
          ref={cardRef}
          className={`w-full aspect-[3/2] cursor-pointer transform-style-3d transition-transform duration-500 ${isFlipped ? 'rotate-y-180' : ''}`}
          onClick={() => setIsFlipped(prev => !prev)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Front of card */}
          <div className="absolute inset-0 backface-hidden bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 flex flex-col items-center justify-center transform-style-3d transition-colors duration-200">
            <div className="text-center">
              <div className="text-gray-500 dark:text-gray-400 text-sm mb-3 transition-colors duration-200">Question</div>
              <div className="text-xl md:text-2xl font-medium text-gray-900 dark:text-white transition-colors duration-200">
                {front}
              </div>
            </div>
            <div className="mt-8 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
              Tap to reveal answer
            </div>
          </div>
          
          {/* Back of card */}
          <div className="absolute inset-0 backface-hidden bg-indigo-50 dark:bg-gray-700 rounded-xl shadow-lg p-6 md:p-8 flex flex-col items-center justify-center rotate-y-180 transform-style-3d transition-colors duration-200">
            <div className="text-center">
              <div className="text-indigo-600 dark:text-indigo-300 text-sm mb-3 transition-colors duration-200">Answer</div>
              <div className="text-xl md:text-2xl font-medium text-gray-900 dark:text-white transition-colors duration-200">
                {back}
              </div>
            </div>
            <div className="mt-8 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
              Tap to see question
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}