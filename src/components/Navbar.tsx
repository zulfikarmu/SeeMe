import { Menu, X, Sun, Moon, Sparkles } from "lucide-react";
import { useState } from "react";
import { ActiveTab } from "../types";
import LogoIcon from "/Image/Logo.svg";

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

export default function Navbar({ activeTab, setActiveTab, darkMode, setDarkMode }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "home" as ActiveTab, label: "Utama" },
    { id: "analyze" as ActiveTab, label: "Analisis" },
    { id: "history" as ActiveTab, label: "Riwayat" },
    { id: "about" as ActiveTab, label: "Tentang" },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-[#D4D4D4] bg-white/95 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/95 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab("home")}
              className="flex items-center gap-2.5 group text-left focus:outline-none"
            >
              <img
                src={LogoIcon}
                alt="SeeMe Logo"
                className="w-13 h-13 object-contain transition-all group-hover:scale-105 duration-300"
              />
              <div>
                <span className="block font-bold text-lg tracking-tight text-[#111111] dark:text-white leading-none">
                  SeeMe
                </span>
                <span className="block text-[9px] uppercase tracking-widest text-[#404040] dark:text-neutral-400 mt-1">
                  Melihat Lebih Jauh
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative px-1 py-1.5 text-xs font-medium uppercase tracking-widest transition-all duration-200 ${activeTab === item.id
                      ? "text-[#111111] dark:text-white font-bold"
                      : "text-[#404040] hover:text-[#111111] dark:text-neutral-400 dark:hover:text-white"
                    }`}
                >
                  {item.label}
                  {activeTab === item.id && (
                    <span className="absolute bottom-[-18px] left-0 right-0 h-[2px] bg-[#111111] dark:bg-white rounded" />
                  )}
                </button>
              ))}
            </div>

            {/* Dark Mode Toggle */}
            <div className="h-4 w-[1px] bg-[#D4D4D4] dark:bg-neutral-800" />

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-1.5 rounded border border-[#D4D4D4] dark:border-neutral-800 hover:bg-[#F5F5F5] dark:hover:bg-neutral-900 text-[#404040] dark:text-neutral-400 hover:text-[#111111] dark:hover:text-white transition-all focus:outline-none"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded border border-[#D4D4D4] dark:border-neutral-800 text-[#404040] dark:text-neutral-400 hover:text-[#111111] dark:hover:text-white"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded border border-[#D4D4D4] dark:border-neutral-800 text-[#404040] dark:text-neutral-400 hover:text-[#111111] dark:hover:text-white"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-4 py-3 space-y-1 transition-colors duration-300 animate-in fade-in duration-200">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-4 py-2.5 text-base font-medium rounded-md transition-colors ${activeTab === item.id
                  ? "bg-neutral-100 dark:bg-neutral-900 text-neutral-950 dark:text-neutral-50"
                  : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 hover:text-neutral-950 dark:hover:text-neutral-50"
                }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
