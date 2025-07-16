import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Music } from "lucide-react";
import { LanguageTexts } from "@/data/languages";

interface WelcomeScreenProps {
  texts: LanguageTexts;
  onBeginExperience: () => void;
  isLoading: boolean;
}

export function WelcomeScreen({ texts, onBeginExperience, isLoading }: WelcomeScreenProps) {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center bg-background/90 backdrop-blur-md z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="max-w-md mx-4 bg-gradient-surface border-border shadow-medium">
        <CardContent className="p-8 text-center">
          {!isLoading ? (
            <>
              <motion.div
                className="mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Music className="w-16 h-16 mx-auto text-raga-primary" />
              </motion.div>
              
              <motion.h2
                className="text-2xl font-semibold mb-4 text-raga-primary"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {texts.welcomeTitle}
              </motion.h2>
              
              <motion.p
                className="text-muted-foreground mb-6 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {texts.welcomeDescription}
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Button
                  onClick={onBeginExperience}
                  size="lg"
                  className="bg-gradient-accent hover:opacity-90 text-black font-semibold shadow-glow"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  {texts.beginBtnText}
                </Button>
              </motion.div>
            </>
          ) : (
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-16 h-16 mx-auto mb-6 border-4 border-raga-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-raga-primary font-medium">{texts.loadingText}</p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}