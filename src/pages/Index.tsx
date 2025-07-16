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
import { ThemeToggle } from "@/components/ThemeToggle";
import { HandMappingConfig } from "@/components/HandMappingConfig";
import { useAudioEngine } from "@/hooks/useAudioEngine";
import { useTheme } from "@/hooks/useTheme";
import { useHandMappingConfig } from "@/hooks/useHandMappingConfig";
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
  // Theme and configuration hooks
  const { theme } = useTheme();
  const { config: handMappingConfig } = useHandMappingConfig();
  
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
      
      {/* Top Controls */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <ThemeToggle />
        <LanguageSwitcher
          currentLanguage={currentLanguage}
          onLanguageChange={setCurrentLanguage}
        />
        {isExperienceActive && (
          <HandMappingConfig 
            currentLanguage={currentLanguage}
          />
        )}
      </div>

      {/* Header - Fixed clipping issue */}
      <motion.header
        className="text-center py-4 px-4 relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-transparent bg-clip-text bg-gradient-accent tracking-wider mb-2 break-words leading-tight">
          {texts.appTitle}
        </h1>
        <p className="text-raga-secondary font-light text-sm sm:text-base md:text-lg">
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
