import { useTheme } from '../contexts/ThemeContext';

export function Footer() {
  useTheme();
  
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-gray-600 dark:text-gray-300 text-sm transition-colors duration-200">
            &copy; {new Date().getFullYear()} FlashRecall. All rights reserved.
          </p>
          
        </div>
      </div>
    </footer>
  );
}