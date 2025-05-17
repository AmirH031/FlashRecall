

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  created: number; // timestamp
  lastAnswered: number | null; // timestamp
  nextAnswer: number | null; // timestamp
  history: AnswerRecord[];
  dueStatus?: DueStatus; // Calculated field, not stored
}

export interface AnswerRecord {
  timestamp: number;
  difficulty: 'easy' | 'medium' | 'hard';
  interval: number; // days until next answer
}

export type DueStatus = 'due' | 'learning' | 'due-soon' | 'done';

// SRS algorithm parameters
export const SRS_INTERVALS = {
  new: {
    easy: 4, // days
    medium: 2,
    hard: 1,
  },
  answer: {
    easy: 2.5, // multiplier
    medium: 1.5,
    hard: 1.2,
  },
  minimum: 1, // minimum interval (days)
  maximum: 365, // maximum interval (days)
  dueSoonThreshold: 2, // days
};

// Calculate next answer date based on user response
export function calculateNextAnswer(
  currentInterval: number | null,
  difficulty: 'easy' | 'medium' | 'hard'
): number {
  const now = Date.now();
  
  // First time answering the card
  if (currentInterval === null) {
    const days = SRS_INTERVALS.new[difficulty];
    return now + days * 24 * 60 * 60 * 1000;
  }
  
  // Convert ms to days
  const currentIntervalDays = currentInterval / (24 * 60 * 60 * 1000);
  
  // Calculate new interval with the appropriate multiplier
  let newIntervalDays = currentIntervalDays * SRS_INTERVALS.answer[difficulty];
  
  // Apply bounds
  newIntervalDays = Math.max(SRS_INTERVALS.minimum, newIntervalDays);
  newIntervalDays = Math.min(SRS_INTERVALS.maximum, newIntervalDays);
  
  // Convert back to ms and add to current time
  return now + Math.round(newIntervalDays * 24 * 60 * 60 * 1000);
}

// Calculate due status of a card
export function calculateDueStatus(card: Flashcard): DueStatus {
  if (!card.nextAnswer) return 'due'; // New card, due immediately
  
  const now = Date.now();
  const msInDay = 24 * 60 * 60 * 1000;
  
  if (now >= card.nextAnswer) return 'due';
  
  const daysUntilDue = (card.nextAnswer - now) / msInDay;
  
  if (daysUntilDue <= SRS_INTERVALS.dueSoonThreshold) return 'due-soon';
  
  return card.lastAnswered ? 'done' : 'learning';
}
