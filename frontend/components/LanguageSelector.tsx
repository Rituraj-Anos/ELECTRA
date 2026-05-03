"use client";

import { useState, useRef, useEffect } from "react";
import { useSessionStore } from "@/lib/store";
import { motion, AnimatePresence } from "motion/react";

/**
 * All 42 supported languages — matches backend translate.ts
 */
const LANGUAGES = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
  { code: "bn", name: "বাংলা", flag: "🇮🇳" },
  { code: "te", name: "తెలుగు", flag: "🇮🇳" },
  { code: "mr", name: "मराठी", flag: "🇮🇳" },
  { code: "ta", name: "தமிழ்", flag: "🇮🇳" },
  { code: "gu", name: "ગુજરાતી", flag: "🇮🇳" },
  { code: "kn", name: "ಕನ್ನಡ", flag: "🇮🇳" },
  { code: "ml", name: "മലയാളം", flag: "🇮🇳" },
  { code: "pa", name: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
  { code: "or", name: "ଓଡ଼ିଆ", flag: "🇮🇳" },
  { code: "as", name: "অসমীয়া", flag: "🇮🇳" },
  { code: "ur", name: "اردو", flag: "🇮🇳" },
  { code: "sa", name: "संस्कृतम्", flag: "🇮🇳" },
  { code: "ne", name: "नेपाली", flag: "🇳🇵" },
  { code: "ks", name: "کٲشُر", flag: "🇮🇳" },
  { code: "sd", name: "سنڌي", flag: "🇮🇳" },
  { code: "kok", name: "कोंकणी", flag: "🇮🇳" },
  { code: "mai", name: "मैथिली", flag: "🇮🇳" },
  { code: "doi", name: "डोगरी", flag: "🇮🇳" },
  { code: "mni", name: "মৈতৈলোন্", flag: "🇮🇳" },
  { code: "sat", name: "ᱥᱟᱱᱛᱟᱲᱤ", flag: "🇮🇳" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "pt", name: "Português", flag: "🇧🇷" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "한국어", flag: "🇰🇷" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "nl", name: "Nederlands", flag: "🇳🇱" },
  { code: "pl", name: "Polski", flag: "🇵🇱" },
  { code: "tr", name: "Türkçe", flag: "🇹🇷" },
  { code: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
  { code: "th", name: "ไทย", flag: "🇹🇭" },
  { code: "sv", name: "Svenska", flag: "🇸🇪" },
  { code: "id", name: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "ms", name: "Bahasa Melayu", flag: "🇲🇾" },
  { code: "fil", name: "Filipino", flag: "🇵🇭" },
  { code: "sw", name: "Kiswahili", flag: "🇰🇪" },
];

/**
 * @description Language selector dropdown component.
 * Persists selection to Zustand session store.
 */
export default function LanguageSelector() {
  const { language, setSession } = useSessionStore();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  // Close on outside click
  useEffect(() => {
    /**
     * @description Closes the dropdown when clicking outside
     * @param {MouseEvent} e - Mouse click event
     */
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = LANGUAGES.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.code.toLowerCase().includes(search.toLowerCase())
  );

  /**
   * @description Selects a language and updates the session store
   * @param {string} code - Language code to select
   */
  function selectLanguage(code: string) {
    setSession({ language: code });
    setIsOpen(false);
    setSearch("");
  }

  return (
    <div ref={dropdownRef} style={{ position: "relative" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select language"
        aria-expanded={isOpen}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "6px 12px",
          borderRadius: "var(--r-md)",
          border: "1px solid var(--border-light)",
          background: "var(--bg-white)",
          cursor: "pointer",
          fontSize: "var(--text-sm)",
          color: "var(--text-primary)",
          fontFamily: "var(--font-body)",
          transition: "border-color 0.2s",
        }}
      >
        <span>{currentLang.flag}</span>
        <span style={{ fontWeight: 500 }}>{currentLang.code.toUpperCase()}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            style={{
              position: "absolute",
              top: "calc(100% + 6px)",
              right: 0,
              width: 260,
              maxHeight: 340,
              background: "var(--bg-white)",
              border: "1px solid var(--border-light)",
              borderRadius: "var(--r-lg)",
              boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
              overflow: "hidden",
              zIndex: 1000,
            }}
          >
            {/* Search */}
            <div style={{ padding: "8px 10px", borderBottom: "1px solid var(--border-light)" }}>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search languages..."
                autoFocus
                style={{
                  width: "100%",
                  padding: "6px 10px",
                  border: "1px solid var(--border-light)",
                  borderRadius: "var(--r-sm)",
                  fontSize: "var(--text-sm)",
                  fontFamily: "var(--font-body)",
                  outline: "none",
                }}
              />
            </div>

            {/* Language list */}
            <div style={{ maxHeight: 280, overflowY: "auto" }}>
              {filtered.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => selectLanguage(lang.code)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    width: "100%",
                    padding: "8px 14px",
                    border: "none",
                    background: lang.code === language ? "var(--accent-light)" : "transparent",
                    cursor: "pointer",
                    fontSize: "var(--text-sm)",
                    fontFamily: "var(--font-body)",
                    color: "var(--text-primary)",
                    textAlign: "left",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    if (lang.code !== language) e.currentTarget.style.background = "#f5f5f5";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = lang.code === language ? "var(--accent-light)" : "transparent";
                  }}
                >
                  <span style={{ fontSize: 18 }}>{lang.flag}</span>
                  <span style={{ flex: 1, fontWeight: lang.code === language ? 600 : 400 }}>
                    {lang.name}
                  </span>
                  <span style={{ color: "var(--text-tertiary)", fontSize: "var(--text-xs)" }}>
                    {lang.code.toUpperCase()}
                  </span>
                  {lang.code === language && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              ))}
              {filtered.length === 0 && (
                <div style={{ padding: "16px", textAlign: "center", color: "var(--text-tertiary)", fontSize: "var(--text-sm)" }}>
                  No languages found
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
