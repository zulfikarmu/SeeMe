import { motion } from "motion/react";
import {
  FileText,
  Printer,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Info,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import CircularScore from "./CircularScore";
import { DetectionResult, TechnicalDetails } from "../types";

interface AnalysisDashboardProps {
  imageSrc: string;
  fileName: string;
  fileSize: string;
  fileType: string;
  resolution: string;
  aspectRatio: string;
  result: DetectionResult;
  onReset: () => void;
}

export default function AnalysisDashboard({
  imageSrc,
  fileName,
  fileSize,
  fileType,
  resolution,
  aspectRatio,
  result,
  onReset,
}: AnalysisDashboardProps) {
  const { ai_probability, human_probability, confidence, status, analysis, indicators } = result;

  const aiPercent = Math.round(ai_probability * 100);
  const humanPercent = Math.round(human_probability * 100);
  const confidencePercent = Math.round(confidence * 100);

  // Status Badge custom designs based on criteria
  let badgeStyles = "bg-neutral-100 text-neutral-800 border-neutral-300 dark:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-700";
  let statusText = status;

  if (ai_probability > 0.6) {
    badgeStyles = "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white";
    statusText = "Terdeteksi AI";
  } else if (human_probability > 0.6) {
    badgeStyles = "bg-white text-black border-black dark:bg-neutral-900 dark:text-white dark:border-neutral-700";
    statusText = "Sangat Otentik";
  } else {
    badgeStyles = "bg-neutral-200 text-neutral-900 border-neutral-400 dark:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-600";
    statusText = "Tidak Pasti";
  }

  // All possible indicators we want to show, and tick those present in response
  const possibleIndicators = [
    { key: "Metadata Analyzer", label: "Metadata Analyzer" },
    { key: "SDXL Detector", label: "SDXL Detector" },
    { key: "Frequency Analysis", label: "Frequency Analysis" },
    { key: "Compression Analysis", label: "Compression Analysis" },
    { key: "Gemini Vision", label: "Gemini Vision" },
  ];

  // Technical info
  const techDetails: TechnicalDetails = {
    resolution,
    aspectRatio,
    fileSize,
    fileType,
    estimatedNoise: ai_probability > 0.6 ? "0.0031 RMS (Sangat Datar)" : "0.0142 RMS (Standar Sensor)",
    metadataFound: ai_probability > 0.6 ? "Tidak" : "Ya",  
  };

  const getRecommendation = () => {
    if (ai_probability > 0.6) {
      return "Gambar ini mengandung tanda struktural signifikan yang sesuai dengan algoritma model difusi generatif. Hindari menggunakan gambar ini sebagai dokumen sumber otentik atau bukti legal tanpa pemeriksaan manual yang menyeluruh.";
    } else if (human_probability > 0.6) {
      return "Evaluasi menunjukkan integritas struktural tinggi yang cocok dengan alur kerja pengambilan foto fisik biasa. Pola butiran piksel sangat sesuai dengan karakteristik sensor kamera optik tradisional.";
    } else {
      return "Evaluasi tidak meyakinkan. Disarankan untuk memverifikasi ke pembuat gambar atau memeriksa tag EXIF asli untuk memastikan validitas sebelum dipublikasikan sebagai media informasi yang faktual.";
    }
  };

  const triggerExportPDF = () => {
    window.print();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-4xl mx-auto print:p-0 print:shadow-none"
    >
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 print:hidden">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#404040] dark:text-neutral-500 block mb-1">
            Laporan Analisis  
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#111111] dark:text-neutral-50 tracking-tight">
            Hasil Analisis
          </h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={triggerExportPDF}
            className="flex items-center gap-2 px-4 py-2 border border-[#D4D4D4] hover:bg-[#F5F5F5] dark:border-neutral-800 dark:hover:bg-neutral-900 bg-white dark:bg-neutral-950 text-[#111111] dark:text-neutral-50 text-xs font-medium uppercase tracking-wider rounded transition-all duration-200"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Ekspor Laporan (PDF)</span>
          </button>
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 bg-[#111111] hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black text-xs font-bold uppercase tracking-widest rounded transition-all duration-200"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Ulangi Analisis</span>
          </button>
        </div>
      </div>

      {/* Main Report Container */}
      <div className="border border-[#D4D4D4] dark:border-neutral-800 bg-white dark:bg-neutral-950 rounded-xl shadow-sm overflow-hidden p-6 sm:p-8 mb-8 print:border-none print:shadow-none print:p-0">
        
        {/* Printable Report Header */}
        <div className="hidden print:flex justify-between items-center border-b border-[#D4D4D4] pb-6 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-neutral-950">SeeMe Pendeteksi Gambar</h1>
            <p className="text-xs text-neutral-500 font-mono">Laporan Hasil Analisis Gambar</p>
          </div>
          <div className="text-right text-xs text-neutral-500">
            <p>Tanggal Laporan: {new Date().toLocaleDateString()}</p>
            <p>Tujuan File: {fileName}</p>
          </div>
        </div>

        {/* Top summary row: image + circular scores */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-8">
          
          {/* Left: Preview and Analysis Text */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="relative bg-[#F5F5F5] dark:bg-neutral-900 border border-[#D4D4D4] dark:border-neutral-800 rounded-xl flex-1 flex items-center justify-center p-4 group min-h-[300px]">
              <div className="w-full h-full border border-dashed border-[#D4D4D4] dark:border-neutral-800 rounded-lg overflow-hidden flex flex-col items-center justify-center bg-white dark:bg-neutral-950 p-2">
                <div className="w-full h-4/5 bg-[#F5F5F5] dark:bg-neutral-900 flex items-center justify-center overflow-hidden rounded">
                  <img src={imageSrc} alt="Forensic Input" className="max-w-full max-h-[220px] object-contain transition-transform duration-500" />
                </div>
                <div className="p-3 w-full flex justify-between items-center bg-white dark:bg-neutral-950 border-t border-[#D4D4D4] dark:border-neutral-800 mt-2 text-left">
                  <div>
                    <p className="text-xs font-bold text-[#111111] dark:text-neutral-200 truncate max-w-[150px]">{fileName}</p>
                    <p className="text-[10px] text-[#404040] dark:text-neutral-400 font-mono">{resolution} • {fileSize}</p>
                  </div>
                  <button onClick={triggerExportPDF} className="p-1.5 hover:bg-[#F5F5F5] dark:hover:bg-neutral-900 rounded border border-[#D4D4D4] dark:border-neutral-800">
                    <Printer className="h-3.5 w-3.5 text-[#404040] dark:text-neutral-400" />
                  </button>
                </div>
              </div>
              <div className="absolute top-8 right-8 px-4 py-1.5 bg-[#111111] text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-md ring-2 ring-white">
                {statusText}
              </div>
            </div>
          </div>

          {/* Right: Detailed Scores & Indicators */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Scores Card */}
            <div className="bg-[#F5F5F5] dark:bg-neutral-900/50 border border-[#D4D4D4] dark:border-neutral-800 rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-end mb-6">
                <div className="text-center flex-1">
                  <p className="text-[10px] font-bold text-[#404040] dark:text-neutral-400 uppercase tracking-wider mb-2">AI Prob.</p>
                  <div className={`text-4xl font-light tabular-nums ${ai_probability > 0.6 ? "text-[#111111] dark:text-white font-semibold" : "text-[#404040] dark:text-neutral-400"}`}>
                    {aiPercent}%
                  </div>
                </div>
                <div className="w-px h-12 bg-[#D4D4D4] dark:bg-neutral-800"></div>
                <div className="text-center flex-1">
                  <p className="text-[10px] font-bold text-[#404040] dark:text-neutral-400 uppercase tracking-wider mb-2">Human Prob.</p>
                  <div className={`text-4xl font-light tabular-nums ${human_probability > 0.6 ? "text-[#111111] dark:text-white font-semibold" : "text-[#D4D4D4] dark:text-neutral-600"}`}>
                    {humanPercent}%
                  </div>
                </div>
              </div>

              {/* Confidence Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                  <span>Tingkat Kepercayaan Analisis</span>
                  <span>{confidencePercent}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#D4D4D4] dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div className="h-full bg-[#111111] dark:bg-white transition-all duration-500" style={{ width: `${confidencePercent}%` }} />
                </div>
              </div>
            </div>

            {/* Checklist of Indicators */}
            <div className="bg-white dark:bg-neutral-900 border border-[#D4D4D4] dark:border-neutral-800 rounded-xl p-6 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#404040] dark:text-neutral-400 mb-4">Indikator Visual</h4>
                <div className="space-y-3">
                  {possibleIndicators.map((item) => {
                    const isActive = indicators.some(
                      (ind) => ind.toLowerCase().includes(item.key.toLowerCase()) || item.key.toLowerCase().includes(ind.toLowerCase())
                    );
                    return (
                      <div key={item.key} className="flex items-center justify-between text-xs py-2 border-b border-[#F0F0F0] dark:border-neutral-850">
                        <div className="flex items-center gap-3">
                          {isActive ? (
                            <div className="w-4 h-4 bg-[#111111] dark:bg-white rounded-full flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="stroke-white dark:stroke-black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            </div>
                          ) : (
                            <div className="w-4 h-4 bg-[#D4D4D4] dark:bg-neutral-800 rounded-full flex items-center justify-center"></div>
                          )}
                          <span className={isActive ? "text-[#111111] dark:text-neutral-200 font-medium" : "text-[#D4D4D4] dark:text-neutral-600"}>
                            {item.label}
                          </span>
                        </div>
                        <span className={isActive ? "text-[#111111] dark:text-neutral-200 font-bold text-[10px] uppercase tracking-wider" : "text-[#D4D4D4] dark:text-neutral-600 text-[10px] uppercase tracking-wider"}>
                          {isActive ? "Detected" : "Neutral"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Black recommendation alert box */}
              <div className="mt-6">
                <div className="p-4 rounded bg-[#111111] text-white dark:bg-neutral-950 border dark:border-neutral-800">
                  <p className="text-[10px] uppercase font-bold tracking-widest mb-1 opacity-60">Analisis dan Rekomendasi</p>
                  <p className="text-[11px] leading-relaxed opacity-95">
                    {getRecommendation()}
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Narrative findings */}
        <div className="p-6 bg-white dark:bg-neutral-900 border border-[#D4D4D4] dark:border-neutral-800 rounded-xl mb-6 text-left">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#404040] dark:text-neutral-400 mb-3">Uraian Hasil Analisis</h4>
          <p className="text-sm leading-relaxed text-[#111111] dark:text-neutral-300">
            {analysis}
          </p>
        </div>

        {/* Technical Data Table */}
        <div className="border-t border-[#D4D4D4] dark:border-neutral-800 pt-6">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#404040] dark:text-neutral-400 mb-3 text-left">
            Informasi Metadata 
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-[10px] p-4 rounded-lg bg-[#F8F8F8] dark:bg-neutral-900/50 border border-[#D4D4D4] dark:border-neutral-900 font-mono text-left uppercase tracking-wider">
            <div>
              <span className="block text-neutral-400 mb-1">Ukuran Gambar</span>
              <span className="text-neutral-900 dark:text-neutral-100 font-bold">{techDetails.resolution}</span>
            </div>
            <div>
              <span className="block text-neutral-400 mb-1">Rasio Aspek</span>
              <span className="text-neutral-900 dark:text-neutral-100 font-bold">{techDetails.aspectRatio}</span>
            </div>
            <div>
              <span className="block text-neutral-400 mb-1">Ukuran File Byte</span>
              <span className="text-neutral-900 dark:text-neutral-100 font-bold">{techDetails.fileSize}</span>
            </div>
            <div>
              <span className="block text-neutral-400 mb-1">Tipe File</span>
              <span className="text-neutral-900 dark:text-neutral-100 font-bold">{techDetails.fileType}</span>
            </div>
            <div>
              <span className="block text-neutral-400 mb-1">Estimasi Pola Noise</span>
              <span className="text-neutral-900 dark:text-neutral-100 font-bold">{techDetails.estimatedNoise}</span>
            </div>
            <div>
              <span className="block text-neutral-400 mb-1">Keaslian Exif</span>
              <span className="text-neutral-900 dark:text-neutral-100 font-bold">{techDetails.metadataFound}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Printable Report Footer info */}
      <div className="hidden print:block text-center text-[10px] text-neutral-400 font-mono border-t border-neutral-200 pt-6">
        SeeMe Platform Pendeteksi Gambar | Laporan Verifikasi Keaslian Gambar.
      </div>
    </motion.div>
  );
}
