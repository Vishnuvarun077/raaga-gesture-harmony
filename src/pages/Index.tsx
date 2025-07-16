import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LanguageSwitcher, Language } from "@/components/LanguageSwitcher";
import { ControlPanel } from "@/components/ControlPanel";
import { HandTrackingCanvas } from "@/components/HandTrackingCanvas";
import { ThreeCanvas } from "@/components/ThreeCanvas";
import { SwaraDisplay } from "@/components/SwaraDisplay";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { InstructionsPanel } from "@/components/InstructionsPanel";
import { PerformanceInfo } from "@/components/PerformanceInfo";
import { BackgroundOverlay } from "@/components/BackgroundOverlay";
import { useAudioEngine } from "@/hooks/useAudioEngine";
import { languages } from "@/data/languages";
import { ragas, talas, getRagaSpecificSwara } from "@/data/musicData";
import { useToast } from "@/hooks/use-toast";

interface Particle {
  id: string;
  position: [number, number, number];
  color: string;
  scale: number;
}

const Index = () => {
  // State management
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [showWelcome, setShowWelcome] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isExperienceActive, setIsExperienceActive] = useState(false);
  const [selectedRaga, setSelectedRaga] = useState('mayamalavagowla');
  const [selectedTala, setSelectedTala] = useState('adi');
  const [octave, setOctave] = useState(4);
  const [currentSwara, setCurrentSwara] = useState<string>('');
  const [particles, setParticles] = useState<Particle[]>([]);

  const { toast } = useToast();
  
  // Audio engine
  const {
    isAudioStarted,
    isTanpuraPlaying,
    tanpuraVolume,
    initializeAudio,
    playSwara,
    startTanpura,
    stopTanpura,
    updateTanpuraVolume
  } = useAudioEngine({ octave });

  // Get current language texts
  const texts = languages[currentLanguage];
  const currentRaga = ragas[selectedRaga];
  const currentTala = talas[selectedTala];

  // Handle beginning the experience
  const handleBeginExperience = useCallback(async () => {
    setIsLoading(true);
    
    try {
      await initializeAudio();
      setIsLoading(false);
      setShowWelcome(false);
      setIsExperienceActive(true);
      
      toast({
        title: "Experience Started",
        description: "Camera initialized. Start making gestures to play music!",
      });
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to initialize audio or camera. Please try again.",
        variant: "destructive",
      });
    }
  }, [initializeAudio, toast]);

  // Handle hand gestures
  const handleHandGesture = useCallback((swara: string, position: { x: number; y: number }) => {
    const ragaSpecificSwara = getRagaSpecificSwara(swara, currentRaga.swaras);
    
    if (currentRaga.swaras.includes(ragaSpecificSwara)) {
      playSwara(ragaSpecificSwara, octave);
      setCurrentSwara(ragaSpecificSwara);
      
      // Create particle effect
      const newParticle: Particle = {
        id: `${Date.now()}-${Math.random()}`,
        position: [
          (position.x - 0.5) * 8,
          (0.5 - position.y) * 4,
          Math.random() * 2 - 1
        ],
        color: '#ffd700',
        scale: 0.1 + Math.random() * 0.2
      };
      
      setParticles(prev => [...prev, newParticle]);
      
      // Remove particle after animation
      setTimeout(() => {
        setParticles(prev => prev.filter(p => p.id !== newParticle.id));
      }, 2000);
    }
  }, [currentRaga.swaras, playSwara, octave]);

  // Handle tanpura toggle
  const handleTanpuraToggle = useCallback(() => {
    if (isTanpuraPlaying) {
      stopTanpura();
    } else {
      startTanpura();
    }
  }, [isTanpuraPlaying, startTanpura, stopTanpura]);

  // Clear current swara after a delay
  useEffect(() => {
    if (currentSwara) {
      const timer = setTimeout(() => setCurrentSwara(''), 1000);
      return () => clearTimeout(timer);
    }
  }, [currentSwara]);

  return (
    <div className="min-h-screen bg-gradient-primary text-foreground font-primary overflow-hidden relative">
      {/* Background Overlay */}
      <BackgroundOverlay isActive={isExperienceActive} />
      
      {/* Language Switcher */}
      <LanguageSwitcher
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
      />

      {/* Header */}
      <motion.header
        className="text-center py-6 relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl sm:text-6xl font-light text-transparent bg-clip-text bg-gradient-to-r from-raga-primary via-raga-secondary to-raga-accent tracking-wider mb-2">
          {texts.appTitle}
        </h1>
        <p className="text-raga-secondary font-light text-lg">
          {texts.appSubtitle}
        </p>
      </motion.header>

      <div className="container mx-auto px-4 pb-4">
        {/* Control Panel */}
        {isExperienceActive && (
          <ControlPanel
            texts={texts}
            selectedRaga={selectedRaga}
            onRagaChange={setSelectedRaga}
            selectedTala={selectedTala}
            onTalaChange={setSelectedTala}
            isTanpuraPlaying={isTanpuraPlaying}
            onTanpuraToggle={handleTanpuraToggle}
            tanpuraVolume={tanpuraVolume}
            onVolumeChange={updateTanpuraVolume}
            octave={octave}
            onOctaveChange={setOctave}
          />
        )}

        {/* Main Experience Area */}
        <div className="relative w-full max-w-6xl mx-auto">
          {/* 3D Background */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden">
            <ThreeCanvas particles={particles} />
          </div>

          {/* Hand Tracking Canvas */}
          <div className="relative z-10 aspect-video bg-raga-surface/50 backdrop-blur-sm rounded-2xl border-2 border-raga-primary/20 overflow-hidden">
            {isExperienceActive && (
              <>
                <HandTrackingCanvas
                  onHandGesture={handleHandGesture}
                  isActive={isExperienceActive}
                />
                
                {/* Performance Info Overlay */}
                <PerformanceInfo
                  texts={texts}
                  currentSwara={currentSwara}
                  currentOctave={octave}
                  currentRaga={currentRaga.name}
                />
                
                {/* Swara Display */}
                <SwaraDisplay
                  currentSwara={currentSwara}
                  currentRagaSwaras={currentRaga.swaras}
                  currentOctave={octave}
                />
              </>
            )}
          </div>
        </div>

        {/* Instructions Panel */}
        {isExperienceActive && (
          <div className="mt-6">
            <InstructionsPanel texts={texts} />
          </div>
        )}
      </div>

      {/* Welcome Screen */}
      <AnimatePresence>
        {showWelcome && (
          <WelcomeScreen
            texts={texts}
            onBeginExperience={handleBeginExperience}
            isLoading={isLoading}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
