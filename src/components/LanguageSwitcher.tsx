import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export type Language = 'en' | 'te' | 'hi';

interface LanguageSwitcherProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
}

const languages = [
  { code: 'en' as const, label: 'EN' },
  { code: 'te' as const, label: 'తె' },
  { code: 'hi' as const, label: 'हि' }
];

export function LanguageSwitcher({ currentLanguage, onLanguageChange }: LanguageSwitcherProps) {
  return (
    <motion.div 
      className="fixed top-4 right-4 z-50 flex space-x-2"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {languages.map((lang) => (
        <Button
          key={lang.code}
          variant={currentLanguage === lang.code ? "default" : "secondary"}
          size="sm"
          onClick={() => onLanguageChange(lang.code)}
          className={`
            px-3 py-2 text-sm font-medium transition-all duration-300
            ${currentLanguage === lang.code 
              ? 'bg-gradient-accent text-black shadow-glow' 
              : 'bg-raga-surface hover:bg-raga-surface-elevated text-foreground'
            }
          `}
        >
          {lang.label}
        </Button>
      ))}
    </motion.div>
  );
}