import { motion } from "motion/react";

interface CircularScoreProps {
  score: number; // 0 to 100
  label: string;
  size?: number; // width and height
  strokeWidth?: number;
  highlight?: boolean; // Highlight with inverted colors (black instead of gray)
  subtitle?: string;
}

export default function CircularScore({
  score,
  label,
  size = 140,
  strokeWidth = 10,
  highlight = false,
  subtitle,
}: CircularScoreProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center text-center p-4">
      <div className="relative" style={{ width: size, height: size }}>
        
        {/* SVG Circle Frame */}
        <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="stroke-neutral-100 dark:stroke-neutral-800 fill-none"
            strokeWidth={strokeWidth}
          />
          
          {/* Animated active circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className={`fill-none transition-all duration-1000 ease-out ${
              highlight
                ? "stroke-neutral-950 dark:stroke-neutral-50"
                : "stroke-neutral-400 dark:stroke-neutral-600"
            }`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            strokeLinecap="round"
          />
        </svg>

        {/* Center content (text overlays) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-2xl sm:text-3xl font-bold font-sans tracking-tight text-neutral-900 dark:text-neutral-50"
          >
            {score}%
          </motion.span>
          {subtitle && (
            <span className="text-[10px] uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-bold mt-0.5">
              {subtitle}
            </span>
          )}
        </div>
      </div>

      <div className="mt-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          {label}
        </h4>
      </div>
    </div>
  );
}
