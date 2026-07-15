import { motion } from "motion/react";
import { History, Trash2, Calendar, ShieldAlert, Sparkles, ChevronRight } from "lucide-react";
import { HistoryItem } from "../types";

interface HistorySidebarProps {
  history: HistoryItem[];
  onSelectItem: (item: HistoryItem) => void;
  onClearHistory: () => void;
  onDeleteIndividualItem: (id: string) => void;
}

export default function HistorySidebar({
  history,
  onSelectItem,
  onClearHistory,
  onDeleteIndividualItem,
}: HistorySidebarProps) {
  
  const formatDate = (isoStr: string) => {
    try {
      const date = new Date(isoStr);
      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="w-full flex flex-col bg-[#F8F8F8] dark:bg-neutral-950 border border-[#D4D4D4] dark:border-neutral-800 rounded-lg overflow-hidden shadow-sm h-full max-h-[800px]">
      
      {/* Header section with Clear actions */}
      <div className="flex items-center justify-between border-b border-[#D4D4D4] dark:border-neutral-900 px-5 py-4">
        <div className="flex items-center gap-2">
          <History className="h-4.5 w-4.5 text-[#111111] dark:text-neutral-200" />
          <h3 className="font-bold text-sm tracking-tight text-[#111111] dark:text-neutral-50 uppercase">
            Recent History
          </h3>
        </div>
        
        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#404040] hover:text-[#111111] dark:text-neutral-400 dark:hover:text-white transition-colors border border-[#D4D4D4] hover:bg-neutral-50 dark:border-neutral-800 rounded shadow-sm bg-white dark:bg-neutral-900"
          >
            <Trash2 className="h-3 w-3" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* Main history item stack or Empty State */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[250px]">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-12 px-4 h-full">
            <div className="p-3 bg-white dark:bg-neutral-900 rounded-lg border border-[#D4D4D4] dark:border-neutral-900 mb-3">
              <History className="h-5 w-5 text-neutral-400" />
            </div>
            <h4 className="text-[10px] font-bold text-[#404040] dark:text-neutral-350 uppercase tracking-widest mb-1">
              History Empty
            </h4>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 max-w-[180px] leading-relaxed">
              Analyze an image to preserve your visual logs.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item) => {
              const aiPercent = Math.round(item.result.ai_probability * 100);
              const isAi = item.result.ai_probability > 0.6;
              const isAuthentic = item.result.human_probability > 0.6;

              let badgeText = `${aiPercent}% AI`;
              if (isAi) {
                badgeText = `${aiPercent}% AI • LIKELY AI`;
              } else if (isAuthentic) {
                badgeText = `${aiPercent}% AI • AUTHENTIC`;
              }

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -1 }}
                  className="group relative flex items-center gap-3 p-2 rounded-lg bg-white dark:bg-neutral-900 border border-[#D4D4D4] dark:border-neutral-800 shadow-sm hover:bg-[#F5F5F5] dark:hover:bg-neutral-850 cursor-pointer transition-all duration-200"
                  onClick={() => onSelectItem(item)}
                >
                  
                  {/* Image thumbnail preview */}
                  <div className="relative h-10 w-10 shrink-0 rounded bg-[#E5E5E5] dark:bg-neutral-800 border border-[#D4D4D4]/50 dark:border-neutral-700 overflow-hidden flex items-center justify-center">
                    <img
                      src={item.imageData}
                      alt={item.fileName}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Log description */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-neutral-900 dark:text-neutral-100 truncate text-xs leading-tight mb-0.5 group-hover:text-black dark:group-hover:text-white" title={item.fileName}>
                      {item.fileName}
                    </p>
                    <p className="text-[10px] text-[#404040] dark:text-neutral-400 font-medium">
                      {badgeText} • {formatDate(item.timestamp)}
                    </p>
                  </div>

                  {/* Individual Delete overlay & Action Arrow */}
                  <div className="flex items-center gap-1 shrink-0 pl-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteIndividualItem(item.id);
                      }}
                      className="p-1 rounded text-neutral-400 hover:text-red-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      title="Delete log"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    <ChevronRight className="h-4 w-4 text-neutral-300 dark:text-neutral-700 group-hover:translate-x-0.5 transition-transform duration-200" />
                  </div>

                </motion.div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
