import React from 'react';
import { ShieldCheck, History, Menu, X } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  toggleHistory: () => void;
  showHistory: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, toggleHistory, showHistory }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-lg bg-white/80 border-b border-slate-200">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-600">
            <ShieldCheck className="w-8 h-8" />
            <span className="font-bold text-xl tracking-tight text-slate-900">ResumeGuard<span className="text-indigo-600">AI</span></span>
          </div>

          <nav className="flex items-center gap-4">
            <button 
              onClick={toggleHistory}
              className={`p-2 rounded-full transition-colors relative ${showHistory ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-slate-100 text-slate-600'}`}
              title="View History"
            >
              <History className="w-5 h-5" />
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 relative">
        {children}
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-slate-400 text-sm border-t border-slate-200 bg-white">
        <p>© {new Date().getFullYear()} ResumeGuard AI. All rights reserved.</p>
      </footer>
    </div>
  );
};
