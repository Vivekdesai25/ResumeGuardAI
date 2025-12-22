import { AnalysisResult } from '../types';
// @ts-ignore
import * as pdfjsModule from 'pdfjs-dist';
// @ts-ignore
import mammoth from 'mammoth';

// Helper to handle different ESM import behaviors (default vs named exports)
// Some CDN builds wrap the library in a default export, others use named exports.
const pdfjsLib = (pdfjsModule as any).default || pdfjsModule;

// Configure PDF.js worker
if (pdfjsLib.GlobalWorkerOptions) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://esm.sh/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
} else {
  console.warn("PDF.js GlobalWorkerOptions not found. PDF parsing may not work correctly.");
}

// Helper to simulate network delay for the AI analysis part
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const SUGGESTION_POOL = [
  "Use more active verbs to describe your achievements.",
  "Include specific metrics (e.g., 'increased revenue by 20%') to ground your claims.",
  "Vary your sentence structure to avoid a robotic rhythm.",
  "Inject more personal voice when describing your career objectives.",
  "Replace generic buzzwords with specific industry terminology.",
  "Focus on 'storytelling' for your major projects rather than just listing tasks.",
];

export const analyzeContent = async (text: string, fileName: string = "Raw Text"): Promise<AnalysisResult> => {
  await delay(1500); // Simulate processing time

  // Deterministic "randomness" based on text length to keep it consistent for the same text
  const pseudoRandom = text.length % 100;
  
  // Skew towards higher AI detection for longer, formal texts (common in resumes)
  let aiProb = 0;
  // Simple heuristic: very short text might be less likely to be confidently flagged as AI
  if (text.length > 500) {
    aiProb = Math.min(95, 40 + (pseudoRandom / 2));
  } else {
    aiProb = Math.min(90, 20 + pseudoRandom);
  }

  // Generate 3-4 random suggestions
  const shuffledSuggestions = [...SUGGESTION_POOL].sort(() => 0.5 - Math.random());
  const suggestions = shuffledSuggestions.slice(0, 3);

  return {
    id: crypto.randomUUID(),
    fileName,
    originalText: text,
    aiProbability: Math.floor(aiProb),
    humanProbability: 100 - Math.floor(aiProb),
    timestamp: Date.now(),
    suggestions,
  };
};

export const humanizeContent = async (text: string): Promise<string> => {
  await delay(2000); // Simulate complex rewriting

  // Simple mock transformation: 
  // 1. Prefixes some sentences with natural transitions.
  // 2. Randomly replaces some common corporate words.
  
  const sentences = text.split('. ');
  const transitions = ["Furthermore,", "Additionally,", "In my experience,", "Notably,", "To elaborate,"];
  
  const humanized = sentences.map((sentence, index) => {
    let newSentence = sentence;
    if (index % 3 === 0 && index !== 0) {
      const transition = transitions[Math.floor(Math.random() * transitions.length)];
      newSentence = `${transition} ${newSentence.charAt(0).toLowerCase() + newSentence.slice(1)}`;
    }
    return newSentence;
  }).join('. ');

  return humanized + " (Enhanced for personal tone and flow)";
};

const parsePdf = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  // Load the PDF document
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  
  let fullText = '';
  
  // Iterate over all pages
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    
    // Extract text items and join them
    // item.hasEOL might be useful for newlines, but usually we just join with space and handle blocks
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ');
      
    fullText += pageText + '\n\n';
  }
  
  return fullText.trim();
};

const parseDocx = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  // Extract raw text using mammoth
  // Note: mammoth might be on 'mammoth' or 'mammoth.default' depending on import
  const lib = (mammoth as any).default || mammoth;
  const result = await lib.extractRawText({ arrayBuffer });
  return result.value.trim();
};

export const parseFile = async (file: File): Promise<string> => {
  // Determine file type and parse accordingly
  
  if (file.type === 'text/plain') {
    return await file.text();
  }
  
  if (file.type === 'application/pdf') {
    try {
      return await parsePdf(file);
    } catch (error) {
      console.error("PDF Parsing Error:", error);
      throw new Error("Could not extract text from PDF. Please ensure it is a valid text-based PDF.");
    }
  }
  
  // Check for DOCX mime types
  if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name.endsWith('.docx')) {
    try {
      return await parseDocx(file);
    } catch (error) {
      console.error("DOCX Parsing Error:", error);
      throw new Error("Could not extract text from DOCX.");
    }
  }
  
  throw new Error(`Unsupported file type: ${file.type}`);
};