import React from 'react';
import { Brain, BookOpen, BarChart2, Calendar } from 'lucide-react';
import { AppPage } from '../App';
import { useFlashcards } from '../contexts/FlashcardContext';

interface HomePageProps {
  navigateTo: (page: AppPage) => void;
}

export function HomePage({ navigateTo }: HomePageProps) {
  const { studyStats } = useFlashcards();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <section className="text-center py-12 px-4">
        <div className="inline-block p-3 bg-indigo-100 dark:bg-indigo-900 rounded-full mb-6 transition-colors duration-200">
          <Brain className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight transition-colors duration-200">
          Master Any Subject with FlashRecall
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto transition-colors duration-200">
          Leverage the power of spaced repetition to remember anything forever.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigateTo('study')}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Start Studying
          </button>
          <button
            onClick={() => navigateTo('manage')}
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Create Flashcards
          </button>
        </div>
      </section>

      {/* Stats Section */}
      {studyStats.totalCards > 0 && (
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard 
              icon={<BookOpen className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />}
              label="Cards in your deck"
              value={studyStats.totalCards.toString()}
            />
            <StatCard 
              icon={<Calendar className="h-6 w-6 text-teal-600 dark:text-teal-400" />}
              label="Day streak"
              value={studyStats.streak.toString()}
            />
            <StatCard 
              icon={<BarChart2 className="h-6 w-6 text-amber-600 dark:text-amber-400" />}
              label="Cards due today"
              value={studyStats.dueCards.toString()}
            />
          </div>
        </section>
      )}

      {/* What is Spaced Repetition Section */}
      <section className="mb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 transition-colors duration-200">
          What is Spaced Repetition?
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors duration-200">
          <p className="text-gray-700 dark:text-gray-300 mb-4 transition-colors duration-200">
            Spaced repetition is a learning technique that incorporates increasing intervals of time between subsequent review of previously learned material to exploit the psychological spacing effect.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-4 transition-colors duration-200">
            The system is particularly effective if you need to:
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mb-4 transition-colors duration-200">
            <li>Memorize vocabulary for language learning</li>
            <li>Master terminology for academic subjects</li>
            <li>Retain important facts for exams or professional certifications</li>
            <li>Learn concepts that build on one another</li>
          </ul>
          <p className="text-gray-700 dark:text-gray-300 transition-colors duration-200">
            Each time you review a flashcard, you'll rate how well you remembered it. Cards you find difficult will appear more frequently, while those you know well will appear less often, optimizing your study time.
          </p>
        </div>
      </section>

      {/* How to Use FlashRecall Section */}
      <section className="mb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 transition-colors duration-200">
          How to Use FlashRecall
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard 
            number="1"
            title="Create Flashcards"
            description="Add questions on one side and answers on the other. Organize them into categories if needed."
          />
          <FeatureCard 
            number="2"
            title="Study Daily"
            description="Review cards that are due each day. Rate your recall as Easy, Medium, or Hard."
          />
          <FeatureCard 
            number="3"
            title="Track Progress"
            description="Monitor your learning with statistics and visualizations on the dashboard."
          />
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center py-12 px-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl mb-8 transition-colors duration-200">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-200">
          Ready to Start Learning?
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto transition-colors duration-200">
          Create your first flashcard deck and begin your journey to more effective learning.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigateTo('manage')}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Flashcards
          </button>
          <button
            onClick={() => navigateTo('study')}
            className="px-6 py-3 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 dark:focus:ring-gray-600"
          >
            Start Studying
          </button>
        </div>
      </section>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 flex items-center space-x-4 transition-colors duration-200">
      <div className="flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">{label}</p>
        <p className="text-2xl font-semibold text-gray-900 dark:text-white transition-colors duration-200">{value}</p>
      </div>
    </div>
  );
}

interface FeatureCardProps {
  number: string;
  title: string;
  description: string;
}

function FeatureCard({ number, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-colors duration-200">
      <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mb-4 transition-colors duration-200">
        <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{number}</span>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-200">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 transition-colors duration-200">{description}</p>
    </div>
  );
}