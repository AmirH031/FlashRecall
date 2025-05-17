import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, BarChart2, Plus } from 'lucide-react';
import { useFlashcards } from '../contexts/FlashcardContext';
import { AppPage } from '../App';

interface StudyPageProps {
  navigateTo: (page: AppPage) => void;
}

export function StudyPage({ navigateTo }: StudyPageProps) {
  const { dueFlashcards } = useFlashcards();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [sessionCards, setSessionCards] = useState(dueFlashcards);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
  useEffect(() => {
    if (currentIndex === 0 && !sessionComplete) {
      setSessionCards(dueFlashcards);
    }
  }, [dueFlashcards, currentIndex, sessionComplete]);

  const currentCard = sessionCards[currentIndex];
  
  const handleNext = () => {
    if (currentIndex < sessionCards.length - 1) {
      setCurrentIndex(prevIndex => prevIndex + 1);
      setShowAnswer(false);
      setUserAnswer('');
      setIsCorrect(null);
    } else {
      setSessionComplete(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prevIndex => prevIndex - 1);
      setShowAnswer(false);
      setUserAnswer('');
      setIsCorrect(null);
    }
  };

  const handleSubmitAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAnswer(true);
    // Simple string comparison - you might want to make this more sophisticated
    setIsCorrect(userAnswer.trim().toLowerCase() === currentCard.answer.trim().toLowerCase());
  };

  if (sessionCards.length === 0) {
    return (
      <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center transition-colors duration-200">
        <div className="inline-block p-3 bg-green-100 dark:bg-green-900/30 rounded-full mb-6 transition-colors duration-200">
          <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-200">
          Ready to Learn More?
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8 transition-colors duration-200">
          Time to expand your knowledge! Create new flashcards and start learning something new.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigateTo('manage')}
            className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create New Cards
          </button>
        </div>
      </div>
    );
  }

  if (sessionComplete) {
    return (
      <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center transition-colors duration-200">
        <div className="inline-block p-3 bg-green-100 dark:bg-green-900/30 rounded-full mb-6 transition-colors duration-200">
          <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-200">
          Session Complete!
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8 transition-colors duration-200">
          You've completed this study session with {sessionCards.length} cards. Great job!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigateTo('manage')}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create More Cards
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Session Progress */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-200">
          Study Session
        </h1>
        <div className="text-gray-600 dark:text-gray-300 transition-colors duration-200">
          Card {currentIndex + 1} of {sessionCards.length}
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-8 overflow-hidden transition-colors duration-200">
        <div 
          className="h-full bg-indigo-600 transition-all duration-300 ease-out"
          style={{ width: `${((currentIndex) / sessionCards.length) * 100}%` }}
        />
      </div>
      
      {/* Question Display */}
      <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors duration-200">
        <div className="text-center">
          <div className="text-gray-500 dark:text-gray-400 text-sm mb-3">Question</div>
          <div className="text-xl md:text-2xl font-medium text-gray-900 dark:text-white">
            {currentCard.question}
          </div>
        </div>
      </div>
      
      {/* Answer Input Form */}
      <form onSubmit={handleSubmitAnswer} className="mb-8">
        <div className="space-y-4">
          <label htmlFor="answer" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Your Answer
          </label>
          <textarea
            id="answer"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            disabled={showAnswer}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 transition-colors duration-200"
            rows={3}
            placeholder="Type your answer here..."
          />
          {!showAnswer && (
            <button
              type="submit"
              className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Check Answer
            </button>
          )}
        </div>
      </form>
      
      {/* Answer Feedback */}
      {showAnswer && (
        <div className={`mb-8 rounded-xl shadow-lg p-6 transition-colors duration-200 ${
          isCorrect 
            ? 'bg-green-50 dark:bg-green-900/20' 
            : 'bg-amber-50 dark:bg-amber-900/20'
        }`}>
          <div className="text-center">
            <div className={`text-sm mb-3 ${
              isCorrect 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-amber-600 dark:text-amber-400'
            }`}>
              {isCorrect ? 'Correct!' : 'Keep Practicing'}
            </div>
            <div className="text-xl md:text-2xl font-medium text-gray-900 dark:text-white mb-4">
              {currentCard.answer}
            </div>
            {!isCorrect && (
              <p className="text-sm text-amber-600 dark:text-amber-400">
                Don't worry! Learning takes time and practice.
              </p>
            )}
          </div>
        </div>
      )}
      
      {/* Navigation Buttons */}
      {showAnswer && (
        <div className="flex justify-between gap-4">
          {currentIndex > 0 && (
            <button
              onClick={handlePrev}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Previous
            </button>
          )}
          <button
            onClick={handleNext}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ml-auto"
          >
            {currentIndex < sessionCards.length - 1 ? 'Next' : 'Finish'}
          </button>
        </div>
      )}
    </div>
  );
}
