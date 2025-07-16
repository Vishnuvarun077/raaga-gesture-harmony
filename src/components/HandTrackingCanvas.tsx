import { useRef, useEffect, useCallback, useState } from "react";
import { motion } from "framer-motion";
import { useHandMappingConfig } from "@/hooks/useHandMappingConfig";

interface HandTrackingCanvasProps {
  onHandGesture: (swara: string, position: { x: number; y: number }) => void;
  isActive: boolean;
  handMappingConfig?: any;
}

export function HandTrackingCanvas({ onHandGesture, isActive, handMappingConfig }: HandTrackingCanvasProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handLandmarkerRef = useRef<any>(null);
  const lastVideoTimeRef = useRef(-1);
  const fingerStatesRef = useRef<any>({});
  const cooldownsRef = useRef<Map<string, number>>(new Map());
  const [isReady, setIsReady] = useState(false);
  
  const { getSwaraForFinger } = useHandMappingConfig();

  const PINCH_THRESHOLD = 0.04;
  const COOLDOWN_DURATION = 250; // Reduced for better responsiveness

  const initializeHandTracking = useCallback(async () => {
    try {
      console.log("Initializing hand tracking...");
      const { HandLandmarker, FilesetResolver } = await import("@mediapipe/tasks-vision");
      
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
      );
      
      handLandmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
          delegate: "GPU"
        },
        runningMode: "VIDEO",
        numHands: 2
      });
      
      console.log("Hand tracking initialized successfully");
      setIsReady(true);
    } catch (error) {
      console.error("Failed to initialize hand tracking:", error);
      setIsReady(false);
    }
  }, []);

  const startWebcam = useCallback(async () => {
    if (!videoRef.current) return;

    try {
      console.log("Starting webcam...");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1280 }, 
          height: { ideal: 720 },
          facingMode: 'user'
        }
      });
      videoRef.current.srcObject = stream;
      console.log("Webcam started successfully");
    } catch (error) {
      console.error("Failed to start webcam:", error);
    }
  }, []);

  const processFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !handLandmarkerRef.current || !isActive || !isReady) {
      if (isActive) {
        requestAnimationFrame(processFrame);
      }
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx || video.readyState < 2) {
      requestAnimationFrame(processFrame);
      return;
    }

    const videoTime = video.currentTime;
    if (videoTime === lastVideoTimeRef.current) {
      requestAnimationFrame(processFrame);
      return;
    }
    lastVideoTimeRef.current = videoTime;

    // Set canvas size to match video
    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }

    // Clear and draw video frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
    ctx.restore();

    try {
      // Detect hands
      const results = handLandmarkerRef.current.detectForVideo(video, videoTime * 1000);
      
      if (results.landmarks && results.landmarks.length > 0) {
        processHandGestures(results, ctx);
      }
    } catch (error) {
      console.error("Hand detection error:", error);
    }

    requestAnimationFrame(processFrame);
  }, [isActive, isReady, onHandGesture]);

  const processHandGestures = (results: any, ctx: CanvasRenderingContext2D) => {
    for (let i = 0; i < results.landmarks.length; i++) {
      const landmarks = results.landmarks[i];
      const handedness = results.handedness[i];
      
      // Draw hand landmarks
      drawHandLandmarks(ctx, landmarks);
      
      // Process finger gestures with proper hand detection
      const handType = handedness[0].categoryName;
      checkFingerGestures(landmarks, handType);
    }
  };

  const drawHandLandmarks = (ctx: CanvasRenderingContext2D, landmarks: any[]) => {
    // Draw hand landmarks with golden color
    ctx.save();
    ctx.scale(-1, 1);
    ctx.translate(-ctx.canvas.width, 0);
    
    ctx.fillStyle = "hsl(45, 100%, 55%)";
    ctx.strokeStyle = "hsl(45, 100%, 55%)";
    ctx.lineWidth = 2;

    // Draw landmarks
    landmarks.forEach((landmark) => {
      const x = landmark.x * ctx.canvas.width;
      const y = landmark.y * ctx.canvas.height;
      
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 2 * Math.PI);
      ctx.fill();
    });

    ctx.restore();
  };

  const checkFingerGestures = (landmarks: any[], handType: string) => {
    const thumbTip = landmarks[4];
    const fingerTips = [8, 12, 16, 20]; // Index, Middle, Ring, Pinky
    const hand = handType === "Left" ? "left" : "right";
    const now = Date.now();

    fingerTips.forEach((fingerId, fingerIndex) => {
      const fingerTip = landmarks[fingerId];
      const distance = Math.hypot(
        fingerTip.x - thumbTip.x,
        fingerTip.y - thumbTip.y
      );

      const fingerKey = `${hand}_${fingerIndex}`;
      const isPinching = distance < PINCH_THRESHOLD;
      const wasPressed = fingerStatesRef.current[fingerKey];

      if (isPinching && !wasPressed) {
        // Just pressed
        fingerStatesRef.current[fingerKey] = true;
        
        const swara = getSwaraForFinger(hand, fingerIndex);
        if (swara) {
          const cooldownKey = `${swara}_${hand}_${fingerIndex}`;
          const lastTrigger = cooldownsRef.current.get(cooldownKey);
          
          if (!lastTrigger || now - lastTrigger > COOLDOWN_DURATION) {
            onHandGesture(swara, { x: fingerTip.x, y: fingerTip.y });
            cooldownsRef.current.set(cooldownKey, now);
          }
        }
      } else if (!isPinching && wasPressed) {
        // Just released
        fingerStatesRef.current[fingerKey] = false;
      }
    });
  };

  useEffect(() => {
    if (isActive) {
      initializeHandTracking();
      startWebcam();
    }
    
    return () => {
      // Cleanup
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isActive, initializeHandTracking, startWebcam]);

  useEffect(() => {
    if (isActive && isReady) {
      processFrame();
    }
  }, [isActive, isReady, processFrame]);

  return (
    <motion.div 
      className="relative w-full h-full bg-background rounded-xl overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        playsInline
        muted
        onLoadedMetadata={() => {
          console.log("Video metadata loaded");
          if (canvasRef.current && videoRef.current) {
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
          }
        }}
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {!isReady && isActive && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Initializing hand tracking...</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}