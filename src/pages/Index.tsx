import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LanguageSwitcher, Language } from "@/components/LanguageSwitcher";
import { ControlPanel } from "@/components/ControlPanel";
import { HandTrackingCanvas } from "@/components/HandTrackingCanvas";
import { SwaraDisplay } from "@/components/SwaraDisplay";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { InstructionsPanel } from "@/components/InstructionsPanel";
import { PerformanceInfo } from "@/components/PerformanceInfo";
import { useAudioEngine } from "@/hooks/useAudioEngine";
import { languages } from "@/data/languages";
import { ragas, talas, getRagaSpecificSwara } from "@/data/musicData";
import { useToast } from "@/hooks/use-toast";

interface Particle {
  id: string;
  position: [number, number, number];
  color: string;
  scale: number;
  life: number;
  velocity: [number, number, number];
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
  const [currentSwara, setCurrentSwara] = useState<string>('--');
  const [talaCounter, setTalaCounter] = useState(0);

  const { toast } = useToast();
  
  // Refs
  const swaraClearTimeoutRef = useRef<NodeJS.Timeout>();
  const talaIntervalRef = useRef<NodeJS.Timeout>();
  
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

  // Start tala counter
  const startTalaCounter = useCallback(() => {
    if (talaIntervalRef.current) {
      clearInterval(talaIntervalRef.current);
    }
    
    talaIntervalRef.current = setInterval(() => {
      setTalaCounter(prev => (prev + 1) % currentTala.beats);
    }, 500);
  }, [currentTala.beats]);

  // Handle beginning the experience
  const handleBeginExperience = useCallback(async () => {
    setIsLoading(true);
    
    try {
      await initializeAudio();
      setIsLoading(false);
      setShowWelcome(false);
      setIsExperienceActive(true);
      startTalaCounter();
      
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
  }, [initializeAudio, toast, startTalaCounter]);

  // Handle hand gestures
  const handleHandGesture = useCallback((swara: string, position: { x: number; y: number }) => {
    const ragaSpecificSwara = getRagaSpecificSwara(swara, currentRaga.swaras);
    
    if (currentRaga.swaras.includes(ragaSpecificSwara)) {
      playSwara(ragaSpecificSwara, octave);
      setCurrentSwara(ragaSpecificSwara);
      
      // Clear swara after delay
      if (swaraClearTimeoutRef.current) {
        clearTimeout(swaraClearTimeoutRef.current);
      }
      swaraClearTimeoutRef.current = setTimeout(() => {
        setCurrentSwara('--');
      }, 800);
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

  // Handle raga change
  const handleRagaChange = useCallback((ragaKey: string) => {
    setSelectedRaga(ragaKey);
  }, []);

  // Handle tala change
  const handleTalaChange = useCallback((talaKey: string) => {
    setSelectedTala(talaKey);
  }, []);

  // Restart tala when tala changes
  useEffect(() => {
    if (isExperienceActive) {
      startTalaCounter();
    }
  }, [selectedTala, isExperienceActive, startTalaCounter]);

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      if (talaIntervalRef.current) {
        clearInterval(talaIntervalRef.current);
      }
      if (swaraClearTimeoutRef.current) {
        clearTimeout(swaraClearTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white font-sans">
      {/* Language Switcher */}
      <LanguageSwitcher 
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
      />

      <div className="container mx-auto p-2 sm:p-4 max-w-7xl">
        {/* Header - Fixed clipping issue */}
        <motion.header 
          className="text-center mb-4 sm:mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 tracking-wider mb-2 leading-tight">
            {texts.appTitle}
          </h1>
          <p className="text-amber-200 mt-2 font-light text-base sm:text-lg">
            {texts.appSubtitle}
          </p>
        </motion.header>

        {/* Control Panel */}
        <ControlPanel
          texts={texts}
          selectedRaga={selectedRaga}
          selectedTala={selectedTala}
          octave={octave}
          talaCounter={talaCounter}
          currentTala={currentTala}
          isTanpuraPlaying={isTanpuraPlaying}
          tanpuraVolume={tanpuraVolume}
          onRagaChange={handleRagaChange}
          onTalaChange={handleTalaChange}
          onOctaveChange={setOctave}
          onTanpuraToggle={handleTanpuraToggle}
          onTanpuraVolumeChange={updateTanpuraVolume}
        />

        {/* Main Experience Area */}
        <main className="mb-6">
          <div className="relative w-full max-w-6xl mx-auto bg-black rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden border-2 border-amber-500">
            {/* Hand Tracking Canvas */}
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
              currentRaga={currentRaga}
              currentSwara={currentSwara}
            />
            
            {/* Welcome Screen Overlay */}
            <AnimatePresence>
              {showWelcome && (
                <WelcomeScreen
                  texts={texts}
                  isLoading={isLoading}
                  onBeginExperience={handleBeginExperience}
                />
              )}
            </AnimatePresence>
          </div>
        </main>

        {/* Instructions Panel */}
        <InstructionsPanel 
          texts={texts}
        />
      </div>
    </div>
  );
};

export default Index;