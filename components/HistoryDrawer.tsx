import React from 'react';
import { X, FileText, Trash2 } from 'lucide-react';
import { AnalysisHistoryItem } from '../types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: AnalysisHistoryItem[];
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({ isOpen, onClose, history, onSelect, onDelete }) => {
  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={`fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h2 className="text-lg font-bold text-slate-900">History</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-slate-400 text-center">
                <FileText className="w-10 h-10 mb-2 opacity-20" />
                <p>No history yet.</p>
              </div>
            ) : (
              history.map((item) => (
                <div 
                  key={item.id} 
                  className="group p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer relative"
                  onClick={() => onSelect(item.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-slate-900 truncate pr-6" title={item.fileName}>{item.fileName}</h3>
                    <div className={`text-xs font-bold px-2 py-0.5 rounded-full ${item.aiScore > 50 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      AI: {item.aiScore}%
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">{new Date(item.date).toLocaleString()}</p>
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(item.id);
                    }}
                    className="absolute bottom-4 right-4 p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};
