import { motion } from "framer-motion";
import { allBaseSwaras, allSwarasWithVariants } from "@/data/musicData";

interface SwaraDisplayProps {
  currentSwara?: string;
  currentRaga: any;
}

export function SwaraDisplay({ 
  currentSwara, 
  currentRaga
}: SwaraDisplayProps) {
  const isSwaraPresent = (baseSwara: string) => {
    const relevantSwaras = allSwarasWithVariants.filter(s => s.startsWith(baseSwara));
    return relevantSwaras.some(variant => currentRaga.swaras.includes(variant));
  };

  const isSwaraActive = (swara: string) => {
    return currentSwara?.replace(/\d/g, '') === swara;
  };

  return (
    <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 flex justify-center space-x-1 sm:space-x-2">
      {allBaseSwaras.map((swara, index) => {
        const isPresent = isSwaraPresent(swara);
        const isActive = isSwaraActive(swara);
        
        return (
          <div
            key={swara}
            className={`
              swara-note bg-black bg-opacity-50 rounded-lg p-1 sm:p-2 text-center min-w-8 sm:min-w-12 text-xs sm:text-sm transition-all duration-100
              ${isPresent ? '' : 'opacity-30 line-through pointer-events-none'}
              ${isActive ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-lg transform scale-110' : 'text-white'}
            `}
            data-swara={swara}
          >
            {swara}
          </div>
        );
      })}
    </div>
  );
}