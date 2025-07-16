import { useCallback, useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import { swarasthanas } from "@/data/musicData";

interface AudioEngineOptions {
  basePitch?: number;
  octave?: number;
}

export function useAudioEngine(options: AudioEngineOptions = {}) {
  const { basePitch = 261.63, octave = 4 } = options;
  
  const [isAudioStarted, setIsAudioStarted] = useState(false);
  const [isTanpuraPlaying, setIsTanpuraPlaying] = useState(false);
  const [tanpuraVolume, setTanpuraVolume] = useState(-20);
  
  const synthRef = useRef<Tone.PolySynth | null>(null);
  const tanpuraSynthRef = useRef<Tone.PolySynth | null>(null);
  const reverbRef = useRef<Tone.Reverb | null>(null);
  const vibratoRef = useRef<Tone.Vibrato | null>(null);
  const noteCooldownsRef = useRef<Map<string, number>>(new Map());
  
  const COOLDOWN_DURATION = 300; // Reduced for better responsiveness

  const initializeAudio = useCallback(async () => {
    if (isAudioStarted) return;
    
    try {
      await Tone.start();
      
      // Create audio effects
      reverbRef.current = new Tone.Reverb({
        decay: 1.5,
        wet: 0.4
      }).toDestination();
      
      vibratoRef.current = new Tone.Vibrato({
        frequency: 5,
        depth: 0.1,
        type: 'sine'
      });
      
      // Create main synth for playing swaras
      synthRef.current = new Tone.PolySynth(Tone.Synth, {
        oscillator: {
          type: 'sine'
        },
        envelope: {
          attack: 0.01,
          decay: 0.4,
          sustain: 0.2,
          release: 0.4
        },
        volume: -8
      });
      
      // Create tanpura synth
      tanpuraSynthRef.current = new Tone.PolySynth(Tone.FMSynth, {
        harmonicity: 3,
        modulationIndex: 10,
        envelope: {
          attack: 1,
          decay: 0.1,
          sustain: 1,
          release: 1
        },
        volume: tanpuraVolume
      });
      
      // Connect audio chain
      if (synthRef.current && vibratoRef.current && reverbRef.current) {
        synthRef.current.chain(vibratoRef.current, reverbRef.current);
      }
      
      if (tanpuraSynthRef.current && reverbRef.current) {
        tanpuraSynthRef.current.connect(reverbRef.current);
      }
      
      setIsAudioStarted(true);
    } catch (error) {
      console.error("Failed to initialize audio:", error);
    }
  }, [isAudioStarted, tanpuraVolume]);

  const playSwara = useCallback((swara: string, currentOctave: number = octave) => {
    if (!synthRef.current || !swarasthanas[swara]) return;
    
    const now = Date.now();
    const cooldown = noteCooldownsRef.current.get(swara);
    
    if (cooldown && now - cooldown < COOLDOWN_DURATION) {
      return;
    }
    
    const frequency = basePitch * swarasthanas[swara].ratio * Math.pow(2, currentOctave - 4);
    synthRef.current.triggerAttackRelease(frequency, "8n", Tone.now());
    
    noteCooldownsRef.current.set(swara, now);
  }, [basePitch, octave]);

  const startTanpura = useCallback(() => {
    if (!tanpuraSynthRef.current || isTanpuraPlaying) return;
    
    const saFreq = basePitch * swarasthanas.Sa.ratio * Math.pow(2, 3 - 4);
    const paFreq = basePitch * swarasthanas.Pa.ratio * Math.pow(2, 3 - 4);
    
    tanpuraSynthRef.current.triggerAttack(saFreq, Tone.now());
    tanpuraSynthRef.current.triggerAttack(paFreq, Tone.now() + 0.1);
    
    setIsTanpuraPlaying(true);
  }, [basePitch, isTanpuraPlaying]);

  const stopTanpura = useCallback(() => {
    if (!tanpuraSynthRef.current || !isTanpuraPlaying) return;
    
    tanpuraSynthRef.current.releaseAll();
    setIsTanpuraPlaying(false);
  }, [isTanpuraPlaying]);

  const updateTanpuraVolume = useCallback((volume: number) => {
    if (tanpuraSynthRef.current) {
      tanpuraSynthRef.current.volume.value = volume;
    }
    setTanpuraVolume(volume);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (synthRef.current) {
        synthRef.current.dispose();
      }
      if (tanpuraSynthRef.current) {
        tanpuraSynthRef.current.dispose();
      }
      if (reverbRef.current) {
        reverbRef.current.dispose();
      }
      if (vibratoRef.current) {
        vibratoRef.current.dispose();
      }
    };
  }, []);

  return {
    isAudioStarted,
    isTanpuraPlaying,
    tanpuraVolume,
    initializeAudio,
    playSwara,
    startTanpura,
    stopTanpura,
    updateTanpuraVolume
  };
}