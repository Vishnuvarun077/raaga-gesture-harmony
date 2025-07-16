import { motion } from "framer-motion";
import { allBaseSwaras, allSwarasWithVariants } from "@/data/musicData";

interface SwaraDisplayProps {
  currentSwara?: string;
  currentRagaSwaras: string[];
  currentOctave: number;
  onSwaraClick?: (swara: string) => void;
}

export function SwaraDisplay({ 
  currentSwara, 
  currentRagaSwaras, 
  currentOctave,
  onSwaraClick 
}: SwaraDisplayProps) {
  const isSwaraPresent = (baseSwara: string) => {
    const relevantSwaras = allSwarasWithVariants.filter(s => s.startsWith(baseSwara));
    return relevantSwaras.some(variant => currentRagaSwaras.includes(variant));
  };

  const isSwaraActive = (swara: string) => {
    return currentSwara?.replace(/\d/g, '') === swara;
  };

  return (
    <motion.div 
      className="flex justify-center space-x-2 absolute bottom-4 left-4 right-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {allBaseSwaras.map((swara, index) => {
        const isPresent = isSwaraPresent(swara);
        const isActive = isSwaraActive(swara);
        
        return (
          <motion.button
            key={swara}
            onClick={() => onSwaraClick && isPresent && onSwaraClick(swara)}
            className={`
              relative min-w-12 h-12 rounded-lg text-sm font-medium transition-all duration-300
              ${isPresent 
                ? 'bg-raga-surface hover:bg-raga-surface-elevated text-foreground cursor-pointer' 
                : 'bg-muted/30 text-muted-foreground/50 line-through cursor-not-allowed'
              }
              ${isActive ? 'animate-swara-glow bg-gradient-accent text-black' : ''}
            `}
            disabled={!isPresent}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={isPresent ? { scale: 1.05 } : {}}
            whileTap={isPresent ? { scale: 0.95 } : {}}
          >
            {swara}
            {isActive && (
              <motion.div
                className="absolute inset-0 rounded-lg border-2 border-raga-primary"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              />
            )}
          </motion.button>
        );
      })}
    </motion.div>
  );
}