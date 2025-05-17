import React from 'react';
import { Brain, Moon, Sun, Menu, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { AppPage } from '../App';

interface NavbarProps {
  currentPage: AppPage;
  navigateTo: (page: AppPage) => void;
}

export function Navbar({ currentPage, navigateTo }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleNavigate = (page: AppPage) => {
    navigateTo(page);
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <button 
                onClick={() => handleNavigate('home')}
                className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 transition-colors duration-200"
              >
                <Brain className="h-8 w-8" />
                <span className="font-bold text-xl tracking-tight">FlashRecall</span>
              </button>
            </div>
            
       
            <nav className="hidden md:ml-8 md:flex md:space-x-4">
              <NavLink 
                isActive={currentPage === 'study'} 
                onClick={() => handleNavigate('study')}
              >
                Study
              </NavLink>
              <NavLink 
                isActive={currentPage === 'manage'} 
                onClick={() => handleNavigate('manage')}
              >
                Manage Cards
              </NavLink>
              <NavLink 
                isActive={currentPage === 'dashboard'} 
                onClick={() => handleNavigate('dashboard')}
              >
                Dashboard
              </NavLink>
            </nav>
          </div>     

          <div className="flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
     
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-expanded={isMenuOpen}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
  
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-800 shadow-md transition-colors duration-200">
          <MobileNavLink 
            isActive={currentPage === 'study'} 
            onClick={() => handleNavigate('study')}
          >
            Study
          </MobileNavLink>
          <MobileNavLink 
            isActive={currentPage === 'manage'} 
            onClick={() => handleNavigate('manage')}
          >
            Manage Cards
          </MobileNavLink>
          <MobileNavLink 
            isActive={currentPage === 'dashboard'} 
            onClick={() => handleNavigate('dashboard')}
          >
            Dashboard
          </MobileNavLink>
        </div>
      </div>
    </header>
  );
}

interface NavLinkProps {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function NavLink({ isActive, onClick, children }: NavLinkProps) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
        isActive 
          ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200' 
          : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
      }`}
      aria-current={isActive ? 'page' : undefined}
    >
      {children}
    </button>
  );
}

function MobileNavLink({ isActive, onClick, children }: NavLinkProps) {
  return (
    <button
      onClick={onClick}
      className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
        isActive 
          ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200' 
          : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
      }`}
      aria-current={isActive ? 'page' : undefined}
    >
      {children}
    </button>
  );
}