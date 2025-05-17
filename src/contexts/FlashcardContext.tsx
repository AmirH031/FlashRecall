import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Flashcard, AnswerRecord, calculateNextAnswer, calculateDueStatus } from '../models/flashcard';

interface FlashcardContextType {
  flashcards: Flashcard[];
  dueFlashcards: Flashcard[];
  addFlashcard: (question: string, answer: string) => void;
  updateFlashcard: (id: string, question: string, answer: string) => void;
  deleteFlashcard: (id: string) => void;
  recordAnswer: (id: string, difficulty: 'easy' | 'medium' | 'hard') => void;
  studyStats: {
    answeredToday: number;
    streak: number;
    totalCards: number;
    dueCards: number;
  };
}

const FlashcardContext = createContext<FlashcardContextType | undefined>(undefined);

export function FlashcardProvider({ children }: { children: ReactNode }) {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [studyStats, setStudyStats] = useState({
    answeredToday: 0,
    streak: 0,
    totalCards: 0,
    dueCards: 0
  });

  // Load flashcards 
  useEffect(() => {
    const savedFlashcards = localStorage.getItem('flashcards');
    if (savedFlashcards) {
      setFlashcards(JSON.parse(savedFlashcards));
    }

    const savedStats = localStorage.getItem('studyStats');
    if (savedStats) {
      setStudyStats(JSON.parse(savedStats));
    } else {
      // Initialize stats
      updateStudyStats([]);
    }
  }, []);

  // Save flashcards to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('flashcards', JSON.stringify(flashcards));
    updateStudyStats(flashcards);
  }, [flashcards]);

  // Update study stats
  const updateStudyStats = (cards: Flashcard[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    
    // Count cards answered today
    const answeredToday = cards.filter(card => 
      card.lastAnswered && card.lastAnswered >= today
    ).length;
    
    // Calculate due cards
    const dueCards = cards.filter(card => 
      !card.nextAnswer || card.nextAnswer <= now.getTime()
    ).length;

    // Get streak from localStorage or initialize
    let savedStreak = localStorage.getItem('streak');
    let lastStudyDate = localStorage.getItem('lastStudyDate');
    let streak = savedStreak ? parseInt(savedStreak) : 0;
    
    // Update streak logic
    if (answeredToday > 0) {
      // Studied today
      if (lastStudyDate) {
        const lastDate = new Date(parseInt(lastStudyDate));
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        
        // If last study was yesterday, continue streak
        if (lastDate.setHours(0,0,0,0) === yesterday.setHours(0,0,0,0)) {
          streak += 1;
        } 
        // If last study was before yesterday, reset streak
        else if (lastDate < yesterday) {
          streak = 1;
        }
        // If last study was today, keep streak the same
      } else {
        // First time studying
        streak = 1;
      }
      
      // Update last study date to today
      localStorage.setItem('lastStudyDate', today.toString());
      localStorage.setItem('streak', streak.toString());
    }
    
    const newStats = {
      answeredToday,
      streak,
      totalCards: cards.length,
      dueCards
    };
    
    setStudyStats(newStats);
    localStorage.setItem('studyStats', JSON.stringify(newStats));
  };

  // Calculate due flashcards and add dueStatus
  const dueFlashcards = flashcards
    .map(card => ({
      ...card,
      dueStatus: calculateDueStatus(card),
    }))
    .filter(card => card.dueStatus === 'due' || card.dueStatus === 'learning')
    .sort((a, b) => {
      // Sort by due date (null cards first as they're new)
      if (!a.nextAnswer) return -1;
      if (!b.nextAnswer) return 1;
      return a.nextAnswer - b.nextAnswer;
    });

  // Add a new flashcard
  const addFlashcard = (question: string, answer: string) => {
    const newFlashcard: Flashcard = {
      id: crypto.randomUUID(),
      question,
      answer,
      created: Date.now(),
      lastAnswered: null,
      nextAnswer: null, // New cards are due immediately
      history: [],
    };
    
    setFlashcards(prevCards => [...prevCards, newFlashcard]);
  };

  // Update an existing flashcard
  const updateFlashcard = (id: string, question: string, answer: string) => {
    setFlashcards(prevCards => 
      prevCards.map(card => 
        card.id === id ? { ...card, question, answer } : card
      )
    );
  };

  // Delete a flashcard
  const deleteFlashcard = (id: string) => {
    setFlashcards(prevCards => prevCards.filter(card => card.id !== id));
  };

  // Record an answer for a flashcard
  const recordAnswer = (id: string, difficulty: 'easy' | 'medium' | 'hard') => {
    setFlashcards(prevCards => {
      return prevCards.map(card => {
        if (card.id !== id) return card;

        // Calculate new interval based on current interval and difficulty
        const currentInterval = card.lastAnswered && card.nextAnswer 
          ? card.nextAnswer - card.lastAnswered 
          : null;
          
        const nextAnswer = calculateNextAnswer(currentInterval, difficulty);
        
        // Create new answer record
        const newAnswer: AnswerRecord = {
          timestamp: Date.now(),
          difficulty,
          interval: (nextAnswer - Date.now()) / (24 * 60 * 60 * 1000),
        };
        
        return {
          ...card,
          lastAnswered: Date.now(),
          nextAnswer,
          history: [...card.history, newAnswer],
        };
      });
    });
  };

  return (
    <FlashcardContext.Provider value={{ 
      flashcards, 
      dueFlashcards,
      addFlashcard, 
      updateFlashcard, 
      deleteFlashcard,
      recordAnswer,
      studyStats
    }}>
      {children}
    </FlashcardContext.Provider>
  );
}

export function useFlashcards() {
  const context = useContext(FlashcardContext);
  if (context === undefined) {
    throw new Error('useFlashcards must be used within a FlashcardProvider');
  }
  return context;
}
