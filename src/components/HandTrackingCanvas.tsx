import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface HandTrackingCanvasProps {
  onHandGesture: (swara: string, position: { x: number; y: number }) => void;
  isActive: boolean;
}

export function HandTrackingCanvas({ onHandGesture, isActive }: HandTrackingCanvasProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize webcam when active
  useEffect(() => {
    if (isActive && !isInitialized) {
      startWebcam();
      setIsInitialized(true);
    }
  }, [isActive, isInitialized]);

  const startWebcam = async () => {
    if (!videoRef.current) return;
    
    try {
      setIsLoading(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 }
      });
      
      videoRef.current.srcObject = stream;
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to start webcam:', error);
      setIsLoading(false);
    }
  };

  const handleVideoLoaded = () => {
    if (canvasRef.current && videoRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }
  };

  return (
    <motion.div
      className="relative w-full aspect-video bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <video
        ref={videoRef}
        className="hidden"
        autoPlay
        playsInline
        onLoadedMetadata={handleVideoLoaded}
      />
      
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover transform scale-x-[-1]"
      />
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-amber-300 text-sm">Initializing camera...</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}