import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { Upload, X, FileImage, ShieldCheck, HelpCircle } from "lucide-react";
import { motion } from "motion/react";

interface UploadBoxProps {
  onImageSelected: (payload: {
    base64: string;
    fileName: string;
    fileSize: string;
    fileType: string;
    resolution: string;
    aspectRatio: string;
  }) => void;
  isLoading: boolean;
}

export default function UploadBox({ onImageSelected, isLoading }: UploadBoxProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{
    base64: string;
    fileName: string;
    fileSize: string;
    fileType: string;
    resolution: string;
    aspectRatio: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getAspectRatio = (width: number, height: number): string => {
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
    const divisor = gcd(width, height);
    const rW = width / divisor;
    const rH = height / divisor;

    // Approximate common standard ratios for better UX
    const tolerance = 0.05;
    const currentRatio = width / height;

    if (Math.abs(currentRatio - 16 / 9) < tolerance) return "16:9";
    if (Math.abs(currentRatio - 4 / 3) < tolerance) return "4:3";
    if (Math.abs(currentRatio - 1 / 1) < tolerance) return "1:1";
    if (Math.abs(currentRatio - 3 / 2) < tolerance) return "3:2";
    if (Math.abs(currentRatio - 9 / 16) < tolerance) return "9:16";
    if (Math.abs(currentRatio - 2 / 3) < tolerance) return "2:3";

    return `${rW}:${rH}`;
  };

  const processFile = (file: File) => {
    // Check type
    const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!validTypes.includes(file.type)) {
      alert("Invalid format! Please upload PNG, JPEG or WEBP image.");
      return;
    }

    // Check size max 20MB
    const maxSize = 20 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("File is too large! Maximum limit is 20MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Data = e.target?.result as string;
      
      // Load image in memory to extract metadata (resolution & ratio)
      const img = new Image();
      img.onload = () => {
        const resolution = `${img.width} × ${img.height} px`;
        const aspectRatio = getAspectRatio(img.width, img.height);

        const payload = {
          base64: base64Data,
          fileName: file.name,
          fileSize: formatBytes(file.size),
          fileType: file.type.split("/")[1].toUpperCase(),
          resolution,
          aspectRatio,
        };

        setSelectedFile(payload);
        onImageSelected(payload);
      };
      img.src = base64Data;
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerInputClick = () => {
    fileInputRef.current?.click();
  };

  const clearSelection = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {!selectedFile ? (
        <motion.div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={triggerInputClick}
          whileHover={{ y: -1 }}
          transition={{ duration: 0.2 }}
          className={`relative group cursor-pointer flex flex-col items-center justify-center border border-dashed rounded-lg p-12 text-center transition-all duration-300 min-h-[300px] ${
            dragActive
              ? "border-[#111111] bg-[#F5F5F5] dark:border-white dark:bg-neutral-900"
              : "border-[#D4D4D4] hover:border-[#111111] bg-white dark:border-neutral-800 dark:hover:border-neutral-600 dark:bg-neutral-950"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/png, image/jpeg, image/jpg, image/webp"
            onChange={handleFileChange}
            disabled={isLoading}
          />

          <div className="mb-4 p-4 rounded-sm bg-[#F5F5F5] dark:bg-neutral-900 border border-[#D4D4D4] dark:border-neutral-800 group-hover:scale-105 transition-transform duration-300">
            <Upload className="h-6 w-6 text-[#111111] dark:text-neutral-400" />
          </div>

          <h3 className="text-sm font-bold text-[#111111] dark:text-neutral-50 uppercase tracking-widest mb-1">
            Drag & Drop Image
          </h3>
          <p className="text-xs text-[#404040] dark:text-neutral-400 mb-6 uppercase tracking-wider">
            or <span className="underline font-bold text-black dark:text-white">Click to Upload</span>
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-widest text-[#404040] dark:text-neutral-500">
            <span>PNG</span>
            <span>•</span>
            <span>JPEG</span>
            <span>•</span>
            <span>WEBP</span>
            <span>•</span>
            <span>Max 20 MB</span>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          className="border border-[#D4D4D4] dark:border-neutral-800 bg-white dark:bg-neutral-950 rounded-lg overflow-hidden p-6 shadow-sm"
        >
          <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-[#F5F5F5] dark:bg-neutral-900 border border-[#D4D4D4] dark:border-neutral-800 flex items-center justify-center group mb-6 p-4">
            <div className="w-full h-full border border-dashed border-[#D4D4D4] dark:border-neutral-800 rounded-lg overflow-hidden flex flex-col items-center justify-center bg-white dark:bg-neutral-950 p-2">
              <img
                src={selectedFile.base64}
                alt="Uploaded Preview"
                className="max-w-full max-h-[300px] object-contain"
              />
            </div>
            
            {!isLoading && (
              <button
                onClick={clearSelection}
                className="absolute top-6 right-6 bg-white/90 hover:bg-white text-neutral-900 p-2 rounded-full shadow-md border border-[#D4D4D4] hover:scale-105 transition-all duration-200"
                title="Remove image"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            {/* Forensic Scan Effect Layer */}
            {isLoading && (
              <div className="absolute inset-x-0 h-1 bg-[#111111] dark:bg-white animate-[bounce_2.5s_infinite] shadow-lg" />
            )}
          </div>

          {/* Image specs summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 rounded-lg bg-[#F8F8F8] dark:bg-neutral-900/50 border border-[#D4D4D4] dark:border-neutral-900 text-[10px] font-mono uppercase tracking-wider">
            <div>
              <span className="block text-[#404040] dark:text-neutral-500 mb-0.5">Filename</span>
              <span className="font-bold text-[#111111] dark:text-neutral-100 truncate block" title={selectedFile.fileName}>
                {selectedFile.fileName}
              </span>
            </div>
            <div>
              <span className="block text-[#404040] dark:text-neutral-500 mb-0.5">File Size</span>
              <span className="font-bold text-[#111111] dark:text-neutral-100">
                {selectedFile.fileSize}
              </span>
            </div>
            <div>
              <span className="block text-[#404040] dark:text-neutral-500 mb-0.5">Resolution</span>
              <span className="font-bold text-[#111111] dark:text-neutral-100">
                {selectedFile.resolution}
              </span>
            </div>
            <div>
              <span className="block text-[#404040] dark:text-neutral-500 mb-0.5">Aspect Ratio</span>
              <span className="font-bold text-[#111111] dark:text-neutral-100">
                {selectedFile.aspectRatio}
              </span>
            </div>
          </div>

          {/* Informative bottom shield */}
          <div className="flex items-start gap-3 p-4 rounded bg-[#111111] text-white text-xs dark:bg-neutral-900 border dark:border-neutral-800">
            <ShieldCheck className="h-5 w-5 text-white/80 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold uppercase tracking-widest text-[10px] mb-1 opacity-60">Secure Local Sandbox</p>
              <p className="leading-relaxed opacity-95 text-[11px]">This metadata calculation is executed inside your client browser sandbox securely. Ready for forensic analysis.</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
