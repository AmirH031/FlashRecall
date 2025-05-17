import React from 'react';
import { Calendar, TrendingUp, BookOpen, BrainCog } from 'lucide-react';
import { useFlashcards } from '../contexts/FlashcardContext';

export function DashboardPage() {
  const { flashcards, studyStats } = useFlashcards();
  
  // Calculate answer history for the last 7 days
  const getAnswerHistory = () => {
    const history = Array(7).fill(0);
    const now = new Date();
    
    // Get timestamps for the last 7 days
    const dayTimestamps = Array(7).fill(0).map((_, index) => {
      const date = new Date(now);
      date.setDate(date.getDate() - index);
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    }).reverse(); // Reverse so index 0 is 7 days ago
    
    // Count answers for each day
    flashcards.forEach(card => {
      card.history.forEach(answer => {
        const answerDate = new Date(answer.timestamp);
        answerDate.setHours(0, 0, 0, 0);
        const answerTimestamp = answerDate.getTime();
        
        const dayIndex = dayTimestamps.findIndex((dayTimestamp, index) => 
          answerTimestamp >= dayTimestamp && 
          (index === dayTimestamps.length - 1 || answerTimestamp < dayTimestamps[index + 1])
        );
        
        if (dayIndex !== -1) {
          history[dayIndex]++;
        }
      });
    });
    
    return history;
  };
  
  const answerHistory = getAnswerHistory();
  const maxAnswers = Math.max(...answerHistory, 1); // Avoid division by zero
  
  // Calculate due cards in the next week
  const getDueCardsNextWeek = () => {
    const now = new Date();
    const oneWeek = now.getTime() + 7 * 24 * 60 * 60 * 1000;
    
    return flashcards.filter(card => 
      card.nextAnswer && card.nextAnswer >= now.getTime() && card.nextAnswer <= oneWeek
    ).length;
  };
  
  const dueNextWeek = getDueCardsNextWeek();

  // Format day labels for the chart
  const getDayLabels = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date().getDay();
    
    return Array(7).fill(0).map((_, index) => {
      const dayIndex = (today - 6 + index + 7) % 7;
      return days[dayIndex];
    });
  };
  
  const dayLabels = getDayLabels();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 transition-colors duration-200">
        Dashboard
      </h1>
      
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          icon={<Calendar className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />}
          label="Daily Streak"
          value={studyStats.streak.toString()}
          description="days in a row"
        />
        <StatCard 
          icon={<BookOpen className="h-6 w-6 text-teal-600 dark:text-teal-400" />}
          label="Total Cards"
          value={studyStats.totalCards.toString()}
          description="in your collection"
        />
        <StatCard 
          icon={<BrainCog className="h-6 w-6 text-amber-600 dark:text-amber-400" />}
          label="Cards Due Today"
          value={studyStats.dueCards.toString()}
          description="ready to answer"
        />
      </div>
      
      {/* Weekly Activity Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8 transition-colors duration-200">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-200">
          Weekly Activity
        </h2>
        <div className="h-64">
          {/* Chart */}
          <div className="flex h-48 items-end space-x-2">
            {answerHistory.map((count, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div 
                  className="w-full bg-indigo-500 dark:bg-indigo-600 rounded-t-md transition-all duration-300"
                  style={{ 
                    height: `${Math.max((count / maxAnswers) * 100, 4)}%`,
                    opacity: count > 0 ? 1 : 0.3
                  }}
                ></div>
                <div className="text-xs mt-2 text-gray-600 dark:text-gray-400 transition-colors duration-200">
                  {dayLabels[index]}
                </div>
                <div className="text-xs font-medium text-gray-900 dark:text-white transition-colors duration-200">
                  {count}
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
            Cards answered in the last 7 days: {answerHistory.reduce((sum, count) => sum + count, 0)}
          </div>
        </div>
      </div>
      
      {/* Answer insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors duration-200">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-200">
            Upcoming Answers
          </h2>
          <div className="flex items-center">
            <div className="flex-1 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400 transition-colors duration-200">Due today</span>
                <span className="font-medium text-gray-900 dark:text-white transition-colors duration-200">{studyStats.dueCards}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400 transition-colors duration-200">Due this week</span>
                <span className="font-medium text-gray-900 dark:text-white transition-colors duration-200">{dueNextWeek}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400 transition-colors duration-200">New cards</span>
                <span className="font-medium text-gray-900 dark:text-white transition-colors duration-200">
                  {flashcards.filter(c => !c.lastAnswered).length}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors duration-200">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-200">
            Learning Progress
          </h2>
          <div className="flex items-center">
            <div className="flex-1">
              {/* Progress circles */}
              <div className="flex justify-center space-x-4 mb-4">
                {[
                  { label: 'New', count: flashcards.filter(c => !c.lastAnswered).length, color: 'blue' },
                  { label: 'Learning', count: flashcards.filter(c => c.lastAnswered && c.history.length < 3).length, color: 'amber' },
                  { label: 'Learned', count: flashcards.filter(c => c.history.length >= 3).length, color: 'green' }
 ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 ${
                      item.color === 'blue' ? 'border-blue-500 dark:border-blue-400' :
                      item.color === 'amber' ? 'border-amber-500 dark:border-amber-400' :
                      'border-green-500 dark:border-green-400'
                    }`}>
                      <span className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-200">
                        {item.count}
                      </span>
                    </div>
                    <span className="mt-2 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
              
              {/* Completion percentage */}
              {flashcards.length > 0 && (
                <div className="text-center">
                  <p className="text-gray-600 dark:text-gray-400 mb-2 transition-colors duration-200">
                    Learning Progress
                  </p>
                  <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full mb-2 overflow-hidden transition-colors duration-200">
                    <div 
                      className="h-full bg-green-500 transition-all duration-300 ease-out"
                      style={{ 
                        width: `${(flashcards.filter(c => c.history.length >= 3).length / flashcards.length) * 100}%` 
                      }}
                    />
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-200">
                    {Math.round((flashcards.filter(c => c.history.length >= 3).length / flashcards.length) * 100)}% Learned
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Learning tip */}
      <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-6 transition-colors duration-200">
        <div className="flex">
          <div className="flex-shrink-0">
            <TrendingUp className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-md font-medium text-indigo-800 dark:text-indigo-300 transition-colors duration-200">Learning Tip</h3>
            <p className="mt-2 text-sm text-indigo-700 dark:text-indigo-200 transition-colors duration-200">
              Practice regularly and try to study a few cards every day. Consistency helps you remember more effectively!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  description?: string;
}

function StatCard({ icon, label, value, description }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors duration-200">
      <div className="flex items-center">
        <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 mr-4 transition-colors duration-200">
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">{label}</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white transition-colors duration-200">{value}</p>
          {description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}