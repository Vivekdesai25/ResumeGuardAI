import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { FileUpload } from './components/FileUpload';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { HistoryDrawer } from './components/HistoryDrawer';
import { analyzeContent } from './services/mockAiService';
import { AnalysisResult, AppView, AnalysisHistoryItem } from './types';

export default function App() {
  const [view, setView] = useState<AppView>(AppView.UPLOAD);
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);

  // Load history from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('resume_guard_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save history whenever it changes
  useEffect(() => {
    localStorage.setItem('resume_guard_history', JSON.stringify(history));
  }, [history]);

  const handleAnalyze = async (text: string, fileName: string) => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeContent(text, fileName);
      setCurrentAnalysis(result);
      
      // Add to history
      const historyItem: AnalysisHistoryItem = {
        id: result.id,
        fileName: result.fileName || 'Untitled',
        date: new Date(result.timestamp).toISOString(),
        aiScore: result.aiProbability,
        preview: text.substring(0, 100) + '...'
      };
      
      setHistory(prev => [historyItem, ...prev]);
      setView(AppView.DASHBOARD);
    } catch (error) {
      console.error("Analysis failed", error);
      alert("Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDeleteHistory = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const handleSelectHistory = (id: string) => {
    // In a real app we might fetch the full details. 
    // Here we just acknowledge we can't fully restore the state without storing full text.
    // For this demo, let's just close history.
    // A production version would store the full result blob in IDB or DB.
    alert("In a full implementation, this would reload the full analysis report.");
    setShowHistory(false);
  };
  
  const handleUpdateResult = (updated: AnalysisResult) => {
    setCurrentAnalysis(updated);
    // Update history score if needed
    setHistory(prev => prev.map(h => 
      h.id === updated.id 
        ? { ...h, aiScore: updated.aiProbability } 
        : h
    ));
  };

  return (
    <Layout 
      toggleHistory={() => setShowHistory(!showHistory)} 
      showHistory={showHistory}
    >
      {view === AppView.UPLOAD && (
        <div className="flex items-center justify-center min-h-[80vh]">
          <FileUpload onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
        </div>
      )}

      {view === AppView.DASHBOARD && currentAnalysis && (
        <AnalysisDashboard 
          result={currentAnalysis} 
          onReset={() => setView(AppView.UPLOAD)}
          onUpdateResult={handleUpdateResult}
        />
      )}

      <HistoryDrawer 
        isOpen={showHistory} 
        onClose={() => setShowHistory(false)}
        history={history}
        onSelect={handleSelectHistory}
        onDelete={handleDeleteHistory}
      />
    </Layout>
  );
}
