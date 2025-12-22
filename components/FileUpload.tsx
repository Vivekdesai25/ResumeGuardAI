import React, { useState, useCallback } from 'react';
import { Upload, FileText, Clipboard, AlertCircle, Loader2, ShieldCheck, History } from 'lucide-react';
import { parseFile } from '../services/mockAiService';

interface FileUploadProps {
  onAnalyze: (text: string, fileName: string) => void;
  isAnalyzing: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onAnalyze, isAnalyzing }) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [dragActive, setDragActive] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      await processFile(file);
    }
  }, []);

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!validTypes.includes(file.type)) {
      setError("Unsupported file format. Please upload PDF, DOCX, or TXT.");
      return;
    }
    
    try {
      const text = await parseFile(file);
      onAnalyze(text, file.name);
    } catch (err) {
      setError("Failed to parse file.");
    }
  };

  const handleTextSubmit = () => {
    if (textInput.trim().length < 50) {
      setError("Please enter at least 50 characters for accurate analysis.");
      return;
    }
    onAnalyze(textInput, "Manual Entry");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
          Is your resume <span className="text-indigo-600">AI-proof?</span>
        </h1>
        <p className="text-lg text-slate-600">
          Upload your resume to detect AI-generated content patterns and humanize it for better impact.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-slate-100">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'upload' 
                ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Upload className="w-4 h-4" />
            Upload File
          </button>
          <button
            onClick={() => setActiveTab('paste')}
            className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'paste' 
                ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            <FileText className="w-4 h-4" />
            Paste Text
          </button>
        </div>

        <div className="p-8">
          {activeTab === 'upload' ? (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-xl p-10 transition-all text-center ${
                dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'
              }`}
            >
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept=".pdf,.docx,.txt"
                onChange={handleFileInput}
                disabled={isAnalyzing}
              />
              <label 
                htmlFor="file-upload" 
                className="cursor-pointer flex flex-col items-center justify-center h-full"
              >
                <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4">
                  {isAnalyzing ? <Loader2 className="w-8 h-8 animate-spin" /> : <Upload className="w-8 h-8" />}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-1">
                  {isAnalyzing ? 'Analyzing Document...' : 'Click to upload or drag and drop'}
                </h3>
                <p className="text-sm text-slate-500 mb-4">PDF, DOCX, or TXT (Max 5MB)</p>
                <span className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors">
                  Select File
                </span>
              </label>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Paste your resume content here..."
                className="w-full h-64 p-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-slate-700 placeholder:text-slate-400"
                disabled={isAnalyzing}
              />
              <button
                onClick={handleTextSubmit}
                disabled={isAnalyzing || !textInput.trim()}
                className="self-end px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Analyzing...
                  </>
                ) : (
                  <>
                    <Clipboard className="w-4 h-4" /> Analyze Text
                  </>
                )}
              </button>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Features Grid (Small below upload) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">Deep Analysis</h3>
          <p className="text-sm text-slate-500">Advanced pattern recognition to identify AI-generated phrasing.</p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">Humanizer</h3>
          <p className="text-sm text-slate-500">Rewrite content to sound natural, personal, and authentic.</p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4">
            <History className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">Track History</h3>
          <p className="text-sm text-slate-500">Keep track of your resume versions and improvements over time.</p>
        </div>
      </div>
    </div>
  );
};