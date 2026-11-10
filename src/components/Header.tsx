import React from 'react';
import { Sparkles, Plus, History, Sun, Moon } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  activeTab: 'workspace' | 'sorting' | 'checklist' | 'storage' | 'blueprint';
  setActiveTab: (tab: 'workspace' | 'sorting' | 'checklist' | 'storage' | 'blueprint') => void;
  hasAnalysis: boolean;
  onNewScan: () => void;
  onOpenHistory: () => void;
  savedRoomsCount: number;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  hasAnalysis,
  onNewScan,
  onOpenHistory,
  savedRoomsCount,
  darkMode,
  setDarkMode,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-teal-600 dark:bg-teal-500 text-white flex items-center justify-center font-bold text-base shadow-sm">
            T
          </div>
          <button
            onClick={onNewScan}
            className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 text-left hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
          >
            TidySpace AI
          </button>
        </div>

        {/* Zone 2: Navigation Links (Single-line, concise) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => setActiveTab('workspace')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              activeTab === 'workspace'
                ? 'border-teal-600 text-teal-600 dark:border-teal-400 dark:text-teal-400 font-semibold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Spatial Analysis
          </button>

          <button
            onClick={() => {
              if (hasAnalysis) setActiveTab('sorting');
            }}
            disabled={!hasAnalysis}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              !hasAnalysis
                ? 'border-transparent text-slate-400 dark:text-slate-600 cursor-not-allowed'
                : activeTab === 'sorting'
                ? 'border-teal-600 text-teal-600 dark:border-teal-400 dark:text-teal-400 font-semibold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            3-Pile Sorting
          </button>

          <button
            onClick={() => {
              if (hasAnalysis) setActiveTab('checklist');
            }}
            disabled={!hasAnalysis}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              !hasAnalysis
                ? 'border-transparent text-slate-400 dark:text-slate-600 cursor-not-allowed'
                : activeTab === 'checklist'
                ? 'border-teal-600 text-teal-600 dark:border-teal-400 dark:text-teal-400 font-semibold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Action Plan
          </button>

          <button
            onClick={() => {
              if (hasAnalysis) setActiveTab('storage');
            }}
            disabled={!hasAnalysis}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              !hasAnalysis
                ? 'border-transparent text-slate-400 dark:text-slate-600 cursor-not-allowed'
                : activeTab === 'storage'
                ? 'border-teal-600 text-teal-600 dark:border-teal-400 dark:text-teal-400 font-semibold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Storage Solutions
          </button>

          <button
            onClick={() => {
              if (hasAnalysis) setActiveTab('blueprint');
            }}
            disabled={!hasAnalysis}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              !hasAnalysis
                ? 'border-transparent text-slate-400 dark:text-slate-600 cursor-not-allowed'
                : activeTab === 'blueprint'
                ? 'border-teal-600 text-teal-600 dark:border-teal-400 dark:text-teal-400 font-semibold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Layout Blueprint
          </button>
        </nav>

        {/* Zone 3: Actions & Theme toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <PWAInstallButton />

          <button
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {savedRoomsCount > 0 && (
            <button
              onClick={onOpenHistory}
              title="Saved room analyses"
              className="px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <History className="w-3.5 h-3.5" />
              <span>Saved ({savedRoomsCount})</span>
            </button>
          )}

          <button
            onClick={onNewScan}
            className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Scan Room</span>
          </button>
        </div>
      </div>
    </header>
  );
};
