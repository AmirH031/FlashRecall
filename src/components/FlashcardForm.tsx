import React, { useState } from 'react';

interface FlashcardFormProps {
  initialQuestion?: string;
  initialAnswer?: string;
  onSubmit: (question: string, answer: string) => void;
  onCancel?: () => void;
  submitLabel?: string;
}

export function FlashcardForm({ 
  initialQuestion = '', 
  initialAnswer = '', 
  onSubmit, 
  onCancel,
  submitLabel = 'Add Card'
}: FlashcardFormProps) {
  const [question, setQuestion] = useState(initialQuestion);
  const [answer, setAnswer] = useState(initialAnswer);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!question.trim()) {
      setErrorMessage('Question cannot be empty');
      return;
    }
    
    if (!answer.trim()) {
      setErrorMessage('Answer cannot be empty');
      return;
    }
    
    // Clear error if valid
    setErrorMessage('');
    
    // Submit form
    onSubmit(question, answer);
    
    // Clear form if it's for adding new cards (not editing)
    if (!initialQuestion && !initialAnswer) {
      setQuestion('');
      setAnswer('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMessage && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md text-sm transition-colors duration-200">
          {errorMessage}
        </div>
      )}
      
      <div>
        <label htmlFor="question" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">
          Question
        </label>
        <textarea
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
          rows={3}
          placeholder="Enter the question or front side of card"
        />
      </div>
      
      <div>
        <label htmlFor="answer" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">
          Answer
        </label>
        <textarea
          id="answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
          rows={3}
          placeholder="Enter the answer or back side of card"
        />
      </div>
      
      <div className="flex justify-end space-x-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}