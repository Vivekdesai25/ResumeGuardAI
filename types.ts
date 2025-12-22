export interface AnalysisResult {
  id: string;
  fileName?: string;
  originalText: string;
  aiProbability: number;
  humanProbability: number;
  timestamp: number;
  suggestions: string[];
  humanizedText?: string;
}

export interface AnalysisHistoryItem {
  id: string;
  fileName: string;
  date: string;
  aiScore: number;
  preview: string;
}

export enum AppView {
  UPLOAD = 'UPLOAD',
  DASHBOARD = 'DASHBOARD',
}

export type FileType = 'application/pdf' | 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' | 'text/plain';
