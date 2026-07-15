export interface DetectionResult {
  ai_probability: number;
  human_probability: number;
  confidence: number;
  status: "Likely AI Generated" | "Likely Authentic" | "Uncertain" | string;
  analysis: string;
  indicators: string[];
}

export interface TechnicalDetails {
  resolution: string;
  aspectRatio: string;
  fileSize: string;
  fileType: string;
  estimatedNoise: string;
  metadataFound: "Yes" | "No";
}

export interface HistoryItem {
  id: string;
  fileName: string;
  fileSize: string;
  fileType: string;
  resolution: string;
  aspectRatio: string;
  timestamp: string;
  result: DetectionResult;
  imageData: string; // Base64 or Object URL data for thumbnail display
}

export type ActiveTab = "home" | "analyze" | "history" | "about";

export interface ToastMessage {
  id: string;
  text: string;
  type: "success" | "error" | "info";
}
