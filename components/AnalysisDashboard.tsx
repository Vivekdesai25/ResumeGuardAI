import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { AnalysisResult } from '../types';
import { Wand2, Download, ArrowLeft, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import { humanizeContent } from '../services/mockAiService';

interface AnalysisDashboardProps {
  result: AnalysisResult;
  onReset: () => void;
  onUpdateResult: (updatedResult: AnalysisResult) => void;
}

export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ result, onReset, onUpdateResult }) => {
  const [isHumanizing, setIsHumanizing] = useState(false);
  const [activeTab, setActiveTab] = useState<'original' | 'humanized'>('original');

  const data = [
    { name: 'AI Written', value: result.aiProbability },
    { name: 'Human Written', value: result.humanProbability },
  ];

  const COLORS = ['#ef4444', '#22c55e']; // Red for AI, Green for Human

  const handleHumanize = async () => {
    setIsHumanizing(true);
    try {
      const humanizedText = await humanizeContent(result.originalText);
      onUpdateResult({
        ...result,
        humanizedText: humanizedText,
        aiProbability: Math.max(5, result.aiProbability - 60), // Mock improvement
        humanProbability: Math.min(95, result.humanProbability + 60)
      });
      setActiveTab('humanized');
    } catch (e) {
      console.error(e);
    } finally {
      setIsHumanizing(false);
    }
  };

  const handleDownload = () => {
    const textToDownload = activeTab === 'humanized' && result.humanizedText ? result.humanizedText : result.originalText;
    const blob = new Blob([textToDownload], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume_${activeTab}_${Date.now()}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Navigation / Header */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={onReset}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Upload
        </button>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500">File: {result.fileName}</span>
          <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-600">
            {new Date(result.timestamp).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Stats */}
        <div className="lg:col-span-1 space-y-6">
          {/* Main Score Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Detection Score</h2>
            <div className="h-64 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
              {/* Center Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                <span className={`text-4xl font-bold ${result.aiProbability > 50 ? 'text-red-500' : 'text-green-500'}`}>
                  {result.aiProbability}%
                </span>
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">AI Probability</span>
              </div>
            </div>

            <div className={`mt-4 p-4 rounded-lg flex items-start gap-3 ${result.aiProbability > 50 ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'}`}>
              {result.aiProbability > 50 ? <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" /> : <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />}
              <div>
                <p className="font-semibold text-sm">
                  {result.aiProbability > 50 ? 'High AI Content Detected' : 'Content Appears Human'}
                </p>
                <p className="text-xs mt-1 opacity-80">
                  {result.aiProbability > 50 
                    ? 'This resume shows patterns typical of AI generation. We recommend humanizing it.' 
                    : 'Great job! This resume has a natural, human tone.'}
                </p>
              </div>
            </div>
          </div>

          {/* Suggestions Panel */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-indigo-500" />
              Improvements
            </h3>
            <ul className="space-y-3">
              {result.suggestions.map((suggestion, idx) => (
                <li key={idx} className="flex gap-3 text-sm text-slate-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 flex-shrink-0" />
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Content & Humanizer */}
        <div className="lg:col-span-2 flex flex-col h-full">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-[800px]">
            {/* Toolbar */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex gap-1 p-1 bg-slate-100 rounded-lg">
                <button
                  onClick={() => setActiveTab('original')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    activeTab === 'original' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Original
                </button>
                <button
                  onClick={() => setActiveTab('humanized')}
                  disabled={!result.humanizedText}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${
                    activeTab === 'humanized' 
                      ? 'bg-white text-indigo-600 shadow-sm' 
                      : !result.humanizedText 
                        ? 'text-slate-300 cursor-not-allowed'
                        : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Humanized
                  {result.humanizedText && <span className="w-2 h-2 rounded-full bg-indigo-500" />}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={handleDownload}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                  title="Download"
                >
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-auto p-8 bg-slate-50/50">
              <div className="bg-white shadow-sm border border-slate-200 min-h-full p-8 rounded-lg font-mono text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
                {activeTab === 'original' ? result.originalText : result.humanizedText}
              </div>
            </div>

            {/* Actions Footer */}
            <div className="p-6 border-t border-slate-100 bg-white rounded-b-2xl flex items-center justify-between">
               <div>
                 {result.humanizedText && activeTab === 'original' && (
                    <p className="text-sm text-slate-500">Humanized version available. Switch tabs to view.</p>
                 )}
               </div>
               <button
                 onClick={handleHumanize}
                 disabled={isHumanizing || (!!result.humanizedText && activeTab === 'humanized')}
                 className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all hover:scale-105 active:scale-95"
               >
                 {isHumanizing ? (
                   <>
                     <RefreshCw className="w-5 h-5 animate-spin" /> Humanizing...
                   </>
                 ) : result.humanizedText ? (
                   <>
                     <Wand2 className="w-5 h-5" /> Re-Humanize
                   </>
                 ) : (
                    <>
                      <Wand2 className="w-5 h-5" /> Humanize Resume
                    </>
                 )}
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
