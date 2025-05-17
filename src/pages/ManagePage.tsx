import { useState } from 'react';
import { Plus, Pencil, Trash2, Search, CheckCircle } from 'lucide-react';
import { useFlashcards } from '../contexts/FlashcardContext';
import { FlashcardForm } from '../components/FlashcardForm';
import { Flashcard as FlashcardType } from '../models/flashcard';

export function ManagePage() {
  const { flashcards, addFlashcard, updateFlashcard, deleteFlashcard } = useFlashcards();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCard, setEditingCard] = useState<FlashcardType | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  

  const filteredCards = flashcards.filter(card => 
    card.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCard = (question: string, answer: string) => {
    addFlashcard(question, answer);
    setShowAddForm(false);
    showSuccess();
  };

  const handleUpdateCard = (question: string, answer: string) => {
    if (editingCard) {
      updateFlashcard(editingCard.id, question, answer);
      setEditingCard(null);
      showSuccess();
    }
  };

  const handleDeleteCard = (id: string) => {
    if (window.confirm('Are you sure you want to delete this flashcard? This action cannot be undone.')) {
      deleteFlashcard(id);
    }
  };

  const showSuccess = () => {
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-200">
          Manage Flashcards
        </h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Card
        </button>
      </div>

     
      {showSuccessMessage && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg flex items-center transition-colors duration-200">
          <CheckCircle className="h-5 w-5 mr-2" />
          <span>Flashcard saved successfully!</span>
        </div>
      )}

      {(showAddForm || editingCard) && (
        <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md transition-colors duration-200">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-200">
            {editingCard ? 'Edit Flashcard' : 'Add New Flashcard'}
          </h2>
          <FlashcardForm 
            initialQuestion={editingCard?.question || ''}
            initialAnswer={editingCard?.answer || ''}
            onSubmit={editingCard ? handleUpdateCard : handleAddCard}
            onCancel={() => {
              setShowAddForm(false);
              setEditingCard(null);
            }}
            submitLabel={editingCard ? 'Update Card' : 'Add Card'}
          />
        </div>
      )}

      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search flashcards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
          />
        </div>
      </div>

      {filteredCards.length > 0 ? (
        <div className="space-y-4">
          {filteredCards.map(card => (
            <div 
              key={card.id} 
              className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-200"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1 transition-colors duration-200">
                    {card.question}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 transition-colors duration-200">
                    {card.answer}
                  </p>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => setEditingCard(card)}
                    className="p-1.5 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 rounded-md transition-colors duration-200"
                    aria-label="Edit flashcard"
                  >
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteCard(card.id)}
                    className="p-1.5 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded-md transition-colors duration-200"
                    aria-label="Delete flashcard"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              {card.lastAnswered && (
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">
                  Last answered: {new Date(card.lastAnswered).toLocaleDateString()}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 mb-4 transition-colors duration-200">
            {searchTerm ? 'No flashcards match your search.' : null}
          </p>
          {!searchTerm && !showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Your First Flashcard
            </button>
          )}
        </div>
      )}
    </div>
  );
}