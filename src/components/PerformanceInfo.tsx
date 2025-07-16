import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { LanguageTexts } from "@/data/languages";

interface PerformanceInfoProps {
  texts: LanguageTexts;
  currentSwara: string;
  currentOctave: number;
  currentRaga: string;
}

export function PerformanceInfo({ 
  texts, 
  currentSwara, 
  currentOctave, 
  currentRaga 
}: PerformanceInfoProps) {
  return (
    <motion.div
      className="absolute top-4 left-4"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <Card className="bg-background/70 backdrop-blur-sm border-border">
        <CardContent className="p-3 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-raga-primary font-medium text-sm">
              {texts.currentSwaraLabel}:
            </span>
            <motion.span 
              className="text-foreground font-bold"
              key={currentSwara}
              initial={{ scale: 1.2, color: "hsl(var(--raga-primary))" }}
              animate={{ scale: 1, color: "hsl(var(--foreground))" }}
              transition={{ duration: 0.3 }}
            >
              {currentSwara || "--"}
            </motion.span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">
              {texts.octaveLabel}:
            </span>
            <span className="text-foreground text-sm">{currentOctave}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">
              {texts.ragaLabel}:
            </span>
            <span className="text-foreground text-sm">{currentRaga}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}