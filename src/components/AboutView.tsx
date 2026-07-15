import { motion } from "motion/react";
import { Shield, Sparkles, Binary, Image as ImageIcon, Cpu, FileCheck } from "lucide-react";

export default function AboutView() {
  const steps = [
    {
      icon: <Binary className="h-4 w-4 text-[#111111] dark:text-neutral-50" />,
      title: "Frequency & Noise Forensics",
      description: "Traditional cameras record photos with a natural sensor noise distribution. Diffusion models leave artificial micro-textures and flat frequency spectra that are distinguishable from genuine camera grain.",
    },
    {
      icon: <ImageIcon className="h-4 w-4 text-[#111111] dark:text-neutral-50" />,
      title: "Lighting & Ray Geometry",
      description: "Generative networks approximate ray tracing but frequently fail to resolve complex lighting bounces, secondary reflections, and shadow projections logically, revealing structural inconsistencies.",
    },
    {
      icon: <Cpu className="h-4 w-4 text-[#111111] dark:text-neutral-50" />,
      title: "Anatomical & Edge Artifacts",
      description: "Modern diffusion model textures may look clean, but edge boundaries show unnatural blurring, inconsistent sharpening filters, and structural abnormalities (e.g. morphing hand structures or inconsistent iris boundaries).",
    },
    {
      icon: <FileCheck className="h-4 w-4 text-[#111111] dark:text-neutral-50" />,
      title: "Metadata & Tag Validation",
      description: "Real images contain extensive camera profile headers, color space curves, and lens metrics. AI generative outputs are almost completely devoid of standard camera profiles unless intentionally injected.",
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
          Forensic Methodology
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#111111] dark:text-white tracking-tight mb-4">
          How SeeMe Analyzes Images
        </h2>
        <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed text-xs sm:text-sm">
          SeeMe leverages visual forensical indicators to identify artificial pixel layouts, synthetic smoothing, and texture artifacts commonly found in diffusion and generative models.
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
            <span>Integrity Charter</span>
          </h4>
          <p className="text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
            SeeMe's goal is to aid digital verification and restore media transparency. However, as generative model architectures evolve, predictions are probabilistic forensic estimations and should not be used as an absolute replacement for careful journalism and expert peer-review.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
