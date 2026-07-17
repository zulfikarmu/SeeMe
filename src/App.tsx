import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Upload,
  History as HistoryIcon,
  Shield,
  FileText,
  Image as ImageIcon,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Clock,
  ExternalLink,
} from "lucide-react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import UploadBox from "./components/UploadBox";
import AnalysisDashboard from "./components/AnalysisDashboard";
import HistorySidebar from "./components/HistorySidebar";
import AboutView from "./components/AboutView";
import ToastContainer from "./components/ToastContainer";

import { ActiveTab, HistoryItem, ToastMessage, DetectionResult } from "./types";

// Standard sample image URLs for immediate testing
const SAMPLE_HUMAN_IMAGE = "./image/lombok.jpeg";
const SAMPLE_AI_IMAGE = "./image/pantai_ai.jpg";

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("home");
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("seeMeTheme") === "dark";
  });
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [scanPhase, setScanPhase] = useState<string>("Initializing...");

  // Active file upload selection state
  const [selectedImage, setSelectedImage] = useState<{
    base64: string;
    fileName: string;
    fileSize: string;
    fileType: string;
    resolution: string;
    aspectRatio: string;
  } | null>(null);

  // Active forensic output report state
  const [analysisResult, setAnalysisResult] = useState<DetectionResult | null>(null);

  // Apply dark mode theme class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("seeMeTheme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("seeMeTheme", "light");
    }
  }, [darkMode]);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("seeMeHistory");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (err) {
        console.error("Failed to parse history data:", err);
      }
    }
  }, []);

  // Sync history to localStorage
  const saveHistory = (newHistory: HistoryItem[]) => {
    setHistory(newHistory);
    localStorage.setItem("seeMeHistory", JSON.stringify(newHistory));
  };

  // Toast utilities
  const addToast = (text: string, type: "success" | "error" | "info" = "success") => {
    const newToast: ToastMessage = {
      id: Math.random().toString(36).substring(2, 9),
      text,
      type,
    };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      removeToast(newToast.id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Triggered when an image file is uploaded and processed in UploadBox
  const handleImageSelected = (payload: typeof selectedImage) => {
    setSelectedImage(payload);
    setAnalysisResult(null); // Clear previous results
  };

  // Initiates image scanning process calling the Express Backend API
  const handleAnalyze = async () => {
    if (!selectedImage) {
      addToast("Please upload an image first.", "error");
      return;
    }

    setIsLoading(true);
    setScanProgress(5);
    setScanPhase("Reading visual buffers...");

    // Progression of descriptive scanning logs
    const progressIntervals = [
      { p: 15, msg: "Isolating frequency anomalies..." },
      { p: 35, msg: "Evaluating pixel grain distribution..." },
      { p: 55, msg: "Computing ray and light source vectors..." },
      { p: 75, msg: "Validating EXIF & metadata profiles..." },
      { p: 90, msg: "Assembling visual forensic predictions..." },
    ];

    progressIntervals.forEach((interval, index) => {
      setTimeout(() => {
        if (isLoading) return; // guard
        setScanProgress(interval.p);
        setScanPhase(interval.msg);
      }, (index + 1) * 450);
    });

    try {
      const response = await fetch("/api/detect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: selectedImage.base64,
          fileName: selectedImage.fileName,
          mimeType: `image/${selectedImage.fileType.toLowerCase()}`,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status} status.`);
      }

      const result: DetectionResult = await response.json();

      setScanProgress(100);
      setScanPhase("Analysis report complete.");

      setTimeout(() => {
        setAnalysisResult(result);
        setIsLoading(false);

        // Add to history log
        const newHistoryItem: HistoryItem = {
          id: Date.now().toString(),
          fileName: selectedImage.fileName,
          fileSize: selectedImage.fileSize,
          fileType: selectedImage.fileType,
          resolution: selectedImage.resolution,
          aspectRatio: selectedImage.aspectRatio,
          timestamp: new Date().toISOString(),
          result: result,
          imageData: selectedImage.base64, // Keep full or thumb base64
        };

        const updatedHistory = [newHistoryItem, ...history];
        saveHistory(updatedHistory);

        addToast("Forensic signature analysis finalized.", "success");
      }, 300);

    } catch (err: any) {
      console.error(err);
      setIsLoading(false);
      addToast(err.message || "Forensic analysis pipeline failed. Please retry.", "error");
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
    setScanProgress(0);
  };

  // Clicked history item: re-load the complete dataset in analyze dashboard view
  const handleSelectItemFromHistory = (item: HistoryItem) => {
    setSelectedImage({
      base64: item.imageData,
      fileName: item.fileName,
      fileSize: item.fileSize,
      fileType: item.fileType,
      resolution: item.resolution,
      aspectRatio: item.aspectRatio,
    });
    setAnalysisResult(item.result);
    setActiveTab("analyze");
    addToast(`Loaded results for "${item.fileName}"`, "info");
  };

  const handleDeleteIndividualItem = (id: string) => {
    const updated = history.filter((item) => item.id !== id);
    saveHistory(updated);
    addToast("Forensic record removed.", "info");
  };

  const handleClearHistory = () => {
    if (confirm("Are you sure you want to delete all past forensic analysis records?")) {
      saveHistory([]);
      addToast("Analysis logs successfully emptied.", "info");
    }
  };

  // Launch pre-configured playground test samples directly on home page
  const handleLoadSample = (type: "ai" | "human") => {
    if (type === "ai") {
      const payload = {
        base64: SAMPLE_AI_IMAGE,
        fileName: "Image-2 (Pantai - AI)",
        fileSize: "131.31 KB",
        fileType: "JPEG",
        resolution: "1024 × 559 px",
        aspectRatio: "16:9",
      };
      setSelectedImage(payload);
      setAnalysisResult({
        ai_probability: 0.96,
        human_probability: 0.04,
        confidence: 0.95,
        status: "Likely AI Generated",
        analysis: "Terdeteksi pola interferensi frekuensi tinggi dan penghalusan tekstur sintetis khas algoritma difusi modern. Struktur pencahayaan sekunder dan bayangan pada detail kontur perbukitan serta siluet manusia di pesisir tidak konsisten secara optik dengan arah datangnya cahaya matahari, menunjukkan indikator kuat rekayasa generatif neural.",
        indicators: ["Pola Difusi Frekuensi", "Anomali Pencahayaan", "Penghalusan Tekstur"],
      });
    } else {
      const payload = {
        base64: SAMPLE_HUMAN_IMAGE,
        fileName: "Image-1 (Lombok)",
        fileSize: "72.84 KB",
        fileType: "JPEG",
        resolution: "960 × 540 px",
        aspectRatio: "16:9",
      };
      setSelectedImage(payload);
      setAnalysisResult({
        ai_probability: 0.01,
        human_probability: 0.99,
        confidence: 0.98,
        status: "Likely Authentic",
        analysis: "Karakteristik tekstur batuan koral yang tajam dan formasinya di tengah laut, yang terlihat di Lombok.jpeg, telah terverifikasi secara forensik. Pola bayangan alami dan distribusi piksel fisik menunjukkan karakteristik foto otentik, bebas dari artefak atau pola noise generatif.",
        indicators: ["Pola tekstur batuan koral yang tajam", "Karakteristik foto otentik"],
      });
    }
    setActiveTab("analyze");
    addToast("Playground sample file loaded.", "success");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-950 text-[#111111] dark:text-neutral-100 transition-colors duration-300 font-sans selection:bg-neutral-900 selection:text-white dark:selection:bg-neutral-100 dark:selection:text-neutral-900">
      
      {/* Navigation Layer */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Main Container Layer */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <AnimatePresence mode="wait">
          
          {/* Active View Router */}
          {activeTab === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-16"
            >
              {/* Hero Banner Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-6 sm:py-10">
                <div className="space-y-6 text-left">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider bg-[#F5F5F5] dark:bg-neutral-900 text-[#111111] dark:text-neutral-200 border border-[#D4D4D4] dark:border-neutral-800">
                    <Shield className="h-3.5 w-3.5" />
                    <span>Analisis Gambar</span>
                  </div>
                  <div>
                    <h1 className="text-6xl font-black uppercase tracking-tight text-[#111111] dark:text-white leading-none">
                      SeeMe.
                    </h1>
                    <p className="text-xs uppercase tracking-widest text-[#404040] dark:text-neutral-400 font-bold mt-2">
                      Melihat Lebih Dalam
                    </p>
                  </div>
                  <p className="text-xs leading-relaxed text-neutral-500 dark:text-neutral-400 max-w-md">
                    SeeMe merupakan website pendeteksi keaslian sebuah gambar berbasis kecerdasan buatan (Artificial Intelligence). Tugas utama SeeMe adalah memastikan bahwa gambar yang diunggah bukan hasil edit dan atau buatan Artificial Intelegence.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-4">
                    <button
                      onClick={() => {
                        handleReset();
                        setActiveTab("analyze");
                      }}
                      className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#111111] hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black text-xs font-bold uppercase tracking-widest rounded transition-all duration-300 shadow-sm"
                    >
                      <span>Analisis Gambar</span>
                      <ArrowRight className="h-4.5 w-4.5" />
                    </button>
                    <button
                      onClick={() => setActiveTab("about")}
                      className="inline-flex items-center gap-2 px-6 py-3.5 border border-[#D4D4D4] dark:border-neutral-800 bg-white dark:bg-neutral-900 text-[#111111] dark:text-neutral-100 text-xs font-bold uppercase tracking-widest rounded hover:bg-[#F5F5F5] dark:hover:bg-neutral-850/50 transition-colors"
                    >
                      <span>Cara Kerja</span>
                    </button>
                  </div>
                </div>

                {/* Aesthetic Visual Sidecard (Monochrome Wireframe Representation) */}
                <div className="border border-[#D4D4D4] dark:border-neutral-850 bg-[#F8F8F8] dark:bg-neutral-950 rounded-lg p-8 shadow-sm flex flex-col justify-between min-h-[360px] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-neutral-200 dark:bg-neutral-900 rounded-full blur-2xl opacity-30" />
                  
                  <div className="flex items-center justify-between border-b border-[#D4D4D4] dark:border-neutral-900 pb-4 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-[#111111] dark:bg-white animate-pulse" />
                      <span className="text-[10px] font-mono font-bold text-[#404040]">ANALYSIS_STAGE_1</span>
                    </div>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded border border-[#D4D4D4] bg-white dark:bg-neutral-900 font-mono">MVP v1.0</span>
                  </div>

                  {/* Wireframe graphical circles */}
                  <div className="flex justify-around items-center py-6 gap-4">
                    <div className="flex flex-col items-center">
                      <div className="h-16 w-16 rounded bg-white dark:bg-neutral-900 border border-[#D4D4D4] flex items-center justify-center shadow-sm">
                        <span className="text-xs font-mono font-bold">GEMINI</span>
                      </div>
                      <span className="text-[9px] text-[#404040] font-bold uppercase tracking-wider mt-2">Gemini Vision</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="h-16 w-16 rounded bg-white dark:bg-neutral-900 border border-dashed border-[#D4D4D4] flex items-center justify-center">
                        <span className="text-xs font-mono font-bold text-neutral-400">METADATA</span>
                      </div>
                      <span className="text-[9px] text-[#404040] font-bold uppercase tracking-wider mt-2">Analisis Metadata</span>
                    </div>
                  </div>

                  <p className="text-[10px] leading-relaxed text-[#404040] dark:text-neutral-500 font-mono bg-white dark:bg-neutral-900/50 p-4 rounded border border-[#D4D4D4] dark:border-neutral-900 mt-4 uppercase tracking-wider">
                    SeeMe menggunakan Gemini Vision untuk mendeteksi keaslian gambar berdasarkan anomali pada pencahayaan dan ketidakkonsistenan pada piksel gambar.
                  </p>
                </div>
              </div>

              {/* Sample Playground / Quick Test Section */}
              <div className="border-t border-[#D4D4D4] dark:border-neutral-850 pt-16">
                <div className="text-left max-w-xl mb-10">
                  <h3 className="text-lg font-bold uppercase tracking-wider text-[#111111] dark:text-white">
                    Mulai Analisis?
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5 leading-relaxed">
                    Tidak memiliki file gambar untuk uji coba? Klik salah satu contoh gambar di bawah ini untuk melihat simulasi laporan analisis secara instan.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Sample 1: Authentic Image-1 */}
                  <div
                    onClick={() => handleLoadSample("human")}
                    className="group cursor-pointer rounded-lg border border-[#D4D4D4] dark:border-neutral-850 bg-white dark:bg-neutral-950 overflow-hidden hover:border-[#111111] dark:hover:border-neutral-200 transition-all duration-300 hover:y-[-1px] shadow-sm hover:shadow-md"
                  >
                    <div className="aspect-video w-full bg-neutral-100 flex items-center justify-center relative overflow-hidden">
                      <img src={SAMPLE_HUMAN_IMAGE} alt="Image-1 (Asli)" className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" />
                      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur text-neutral-900 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider rounded-sm border border-neutral-200">
                        Gambar Asli
                      </div>
                    </div>
                    <div className="p-5 flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-[#111111] dark:text-neutral-100 text-xs uppercase tracking-wider">
                          Image-1 (Lombok - Real)
                        </h4>
                        <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-1 font-mono uppercase tracking-wider">
                          98.8% Kemungkinan Gambar Asli 
                        </p>
                      </div>
                      <span className="p-2 bg-neutral-50 dark:bg-neutral-900 rounded border border-[#D4D4D4] dark:border-neutral-800 group-hover:bg-[#111111] group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-neutral-950 transition-all duration-300">
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>

                  {/* Sample 2: AI Image-2 */}
                  <div
                    onClick={() => handleLoadSample("ai")}
                    className="group cursor-pointer rounded-lg border border-[#D4D4D4] dark:border-neutral-850 bg-white dark:bg-neutral-950 overflow-hidden hover:border-[#111111] dark:hover:border-neutral-200 transition-all duration-300 hover:y-[-1px] shadow-sm hover:shadow-md"
                  >
                    <div className="aspect-video w-full bg-neutral-900 flex items-center justify-center relative overflow-hidden">
                      <img src={SAMPLE_AI_IMAGE} alt="Image-2 (AI)" className="w-full h-full object-cover opacity-80 group-hover:scale-102 transition-transform duration-500" />
                      <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur text-white px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider rounded-sm">
                        Gambar AI
                      </div>
                    </div>
                    <div className="p-5 flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-[#111111] dark:text-neutral-100 text-xs uppercase tracking-wider">
                          Image-2 (Pantai - AI)
                        </h4>
                        <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-1 font-mono uppercase tracking-wider">
                          96.4% Kemungkinan Gambar AI 
                        </p>
                      </div>
                      <span className="p-2 bg-neutral-50 dark:bg-neutral-900 rounded border border-[#D4D4D4] dark:border-neutral-800 group-hover:bg-[#111111] group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-neutral-950 transition-all duration-300">
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Analyze tab View */}
          {activeTab === "analyze" && (
            <motion.div
              key="analyze"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Workspace Left (Upload box or Dashboard) */}
                <div className="lg:col-span-8 space-y-6">
                  
                  {/* Active Analysis Result */}
                  {analysisResult ? (
                    <AnalysisDashboard
                      imageSrc={selectedImage?.base64 || ""}
                      fileName={selectedImage?.fileName || ""}
                      fileSize={selectedImage?.fileSize || ""}
                      fileType={selectedImage?.fileType || ""}
                      resolution={selectedImage?.resolution || ""}
                      aspectRatio={selectedImage?.aspectRatio || ""}
                      result={analysisResult}
                      onReset={handleReset}
                    />
                  ) : (
                    <>
                      {/* Active Upload Box */}
                      <div className="text-left max-w-xl">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#404040] dark:text-neutral-500 block mb-1">
                          Analisis Gambar Anda
                        </span>
                        <h2 className="text-2xl font-bold text-[#111111] dark:text-white uppercase tracking-tight">
                          Unggah Gambar
                        </h2>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5 leading-relaxed">
                          Gunakan file berformat JPG, PNG, atau WEBP hingga 20MB. Gambar Anda akan melalui pemeriksaan mikrotekstur dan metadata untuk mendeteksi tanda rekayasa AI.
                        </p>
                      </div>

                      {/* Loading skeleton or box */}
                      {isLoading ? (
                        <div className="border border-[#D4D4D4] dark:border-neutral-800 bg-white dark:bg-neutral-950 rounded-lg p-8 flex flex-col items-center justify-center min-h-[350px] shadow-sm">
                          <div className="relative w-16 h-16 mb-6 flex items-center justify-center">
                            {/* Outer Spinning Loader Ring */}
                            <div className="absolute inset-0 border-2 border-neutral-100 dark:border-neutral-900 rounded-full" />
                            <div className="absolute inset-0 border-2 border-[#111111] dark:border-white border-t-transparent rounded-full animate-spin" />
                            <Shield className="h-6 w-6 text-neutral-500 dark:text-neutral-400 animate-pulse" />
                          </div>

                          <span className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase mb-2">
                            SCAN_STAGE_METRIC: {scanProgress}%
                          </span>

                          <h3 className="text-sm font-bold text-[#111111] dark:text-neutral-100 uppercase tracking-wider animate-pulse mb-2">
                            {scanPhase}
                          </h3>

                          {/* Progress bar visual indicator */}
                          <div className="w-full max-w-xs h-1 bg-neutral-100 dark:bg-neutral-900 rounded-full overflow-hidden mt-2">
                            <motion.div
                              className="h-full bg-[#111111] dark:bg-white"
                              initial={{ width: 0 }}
                              animate={{ width: `${scanProgress}%` }}
                              transition={{ duration: 0.2 }}
                            />
                          </div>
                        </div>
                      ) : (
                        <UploadBox onImageSelected={handleImageSelected} isLoading={isLoading} />
                      )}

                      {/* Action buttons under upload box */}
                      {selectedImage && !isLoading && (
                        <div className="flex gap-3 justify-center">
                          <button
                            onClick={handleReset}
                            className="px-5 py-2.5 border border-[#D4D4D4] dark:border-neutral-800 text-[#111111] dark:text-neutral-200 text-xs font-bold uppercase tracking-widest rounded hover:bg-[#F5F5F5] dark:hover:bg-neutral-900 transition-colors"
                          >
                            Ganti Gambar
                          </button>
                          <button
                            onClick={handleAnalyze}
                            className="px-6 py-2.5 bg-[#111111] hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black text-xs font-bold uppercase tracking-widest rounded transition-all hover:y-[-1px] shadow"
                          >
                            Analisis Sekarang
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Sidebar Right (Forensic logs list) */}
                <div className="lg:col-span-4 h-full">
                  <HistorySidebar
                    history={history}
                    onSelectItem={handleSelectItemFromHistory}
                    onClearHistory={handleClearHistory}
                    onDeleteIndividualItem={handleDeleteIndividualItem}
                  />
                </div>

              </div>
            </motion.div>
          )}

          {/* History tab full View */}
          {activeTab === "history" && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-4xl mx-auto"
            >
              <div className="mb-6">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#404040] dark:text-neutral-500 block mb-1">
                  Hasil Analisis Sebelumnya
                </span>
                <h2 className="text-2xl font-bold text-[#111111] dark:text-white uppercase tracking-tight">
                  Seluruh Riwayat Analisis
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5 leading-relaxed">
                  Kelola hasil analisis gambar yang tersimpan. Klik pada item untuk melihat kembali metrik laporan lengkapnya di lab visual.
                </p>
              </div>

              <div className="border border-[#D4D4D4] dark:border-neutral-800 bg-white dark:bg-neutral-950 rounded-lg overflow-hidden shadow-sm">
                <HistorySidebar
                  history={history}
                  onSelectItem={handleSelectItemFromHistory}
                  onClearHistory={handleClearHistory}
                  onDeleteIndividualItem={handleDeleteIndividualItem}
                />
              </div>
            </motion.div>
          )}

          {/* About tab View */}
          {activeTab === "about" && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <AboutView />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Global Toast Notification block */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Footer Layer */}
      <Footer />
    </div>
  );
}
