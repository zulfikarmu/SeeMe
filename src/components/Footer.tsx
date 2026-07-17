import { Sparkles } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full h-16 border-t border-[#D4D4D4] dark:border-neutral-800 px-4 sm:px-8 flex items-center justify-between bg-[#F8F8F8] dark:bg-neutral-950/80 transition-colors duration-300">
      <p className="text-[10px] text-[#404040] dark:text-neutral-400 uppercase tracking-wider font-medium">
        © {currentYear} SEEME PLATFORM 
      </p>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
        <span className="text-[10px] text-[#111111] dark:text-neutral-200 font-bold uppercase tracking-widest">
          Sistem Aktif: MVP V1.0
        </span>
      </div>
    </footer>
  );
}
