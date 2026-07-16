import { motion } from "motion/react";
import { Shield, Sparkles, Binary, Image as ImageIcon, Cpu, FileCheck, FileText, Activity } from "lucide-react";

export default function AboutView() {
  const steps = [
    {
      icon: <FileCheck className="h-4 w-4 text-[#111111] dark:text-neutral-50" />,
      title: "Metadata Analyzer",
      description: "Menganalisis profil EXIF, skema warna, penanda kompresi, serta metadata manufaktur kamera fisik yang biasanya hilang atau terhapus pada hasil gambar rekayasa model AI generatif.",
    },
    {
      icon: <Cpu className="h-4 w-4 text-[#111111] dark:text-neutral-50" />,
      title: "SDXL Detector",
      description: "Mendeteksi secara mendalam pola noise struktural dan artefak mikro-tekstur generatif spesifik yang sering ditinggalkan oleh arsitektur difusi modern seperti Stable Diffusion XL (SDXL).",
    },
    {
      icon: <Binary className="h-4 w-4 text-[#111111] dark:text-neutral-50" />,
      title: "Frequency Analysis",
      description: "Mengisolasi spektrum anomali frekuensi tinggi pada tingkat piksel untuk mengidentifikasi pola pengulangan noise, ketidakwajaran gradasi, dan penghalusan permukaan sintetis.",
    },
    {
      icon: <Activity className="h-4 w-4 text-[#111111] dark:text-neutral-50" />,
      title: "Compression Analysis",
      description: "Mengevaluasi pola kompresi matriks Discrete Cosine Transform (DCT) pada format gambar guna menguji keaslian kompresi kamera asli atau indikator pengompresan ganda oleh model saraf.",
    },
    {
      icon: <Sparkles className="h-4 w-4 text-[#111111] dark:text-neutral-50" />,
      title: "Gemini Vision",
      description: "Memanfaatkan kemampuan kognisi model visual Gemini untuk memeriksa kejanggalan semantik seperti distorsi anatomi fisik, pencahayaan bayangan abnormal, dan inkonsistensi geometri optik.",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-4xl mx-auto py-6"
    >
      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#404040] dark:text-neutral-500 block mb-2">
          Metode Analisis
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#111111] dark:text-white tracking-tight mb-4">
          Cara Kerja SeeMe
        </h2>
        <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed text-xs sm:text-sm">
          SeeMe menganalisis berbagai indikator visual untuk mengidentifikasi struktur piksel buatan, penghalusan sintetik, dan artefak tekstur yang sering ditemukan pada model difusi dan AI generatif.
        </p>
      </div>

      {/* Grid of Methods */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {steps.map((step, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-6 rounded-lg border border-[#D4D4D4] dark:border-neutral-800 bg-white dark:bg-neutral-950/40 hover:y-[-1px] transition-all duration-200"
          >
            <div className="p-3 bg-[#F5F5F5] dark:bg-neutral-900 rounded-sm w-fit border border-[#D4D4D4] dark:border-neutral-800 mb-4">
              {step.icon}
            </div>
            <h3 className="font-bold text-sm text-[#111111] dark:text-neutral-50 uppercase tracking-wider mb-2">
              {step.title}
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Philosophy Callout Card */}
      <div className="p-6 rounded-lg border border-[#D4D4D4] dark:border-neutral-800 bg-white dark:bg-neutral-950 text-[#111111] dark:text-neutral-200 flex flex-col md:flex-row items-start md:items-center gap-6 shadow-sm">
        <div className="p-3.5 bg-[#F5F5F5] dark:bg-neutral-900 rounded-sm border border-[#D4D4D4] dark:border-neutral-800 shrink-0">
          <Shield className="h-5 w-5 text-[#111111] dark:text-white" />
        </div>
        <div>
          <h4 className="font-bold text-neutral-950 dark:text-neutral-50 uppercase tracking-widest text-[10px] mb-1.5 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Integritas Sistem</span>
          </h4>
          <p className="text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
            SeeMe bertujuan untuk mendukung verifikasi digital dan mengembalikan transparansi media. Namun, seiring berkembangnya arsitektur model AI, hasil prediksi bersifat estimasi probabilistik dan tidak boleh menggantikan peran jurnalisme serta tinjauan oleh ahli.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
