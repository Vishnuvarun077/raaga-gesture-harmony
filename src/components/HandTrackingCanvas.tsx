import { useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

interface HandTrackingCanvasProps {
  onHandGesture: (swara: string, position: { x: number; y: number }) => void;
  isActive: boolean;
}

export function HandTrackingCanvas({ onHandGesture, isActive }: HandTrackingCanvasProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handLandmarkerRef = useRef<any>(null);

  const initializeHandTracking = useCallback(async () => {
    try {
      // Import MediaPipe modules
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
    } catch (error) {
      console.error("Failed to initialize hand tracking:", error);
    }
  }, []);

  const startWebcam = useCallback(async () => {
    if (!videoRef.current) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 }
      });
      videoRef.current.srcObject = stream;
    } catch (error) {
      console.error("Failed to start webcam:", error);
    }
  }, []);

  const processFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !handLandmarkerRef.current || !isActive) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx || video.readyState < 2) {
      requestAnimationFrame(processFrame);
      return;
    }

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    try {
      // Detect hands
      const results = handLandmarkerRef.current.detectForVideo(video, performance.now());
      
      if (results.landmarks && results.landmarks.length > 0) {
        // Process hand gestures
        processHandGestures(results, ctx);
      }
    } catch (error) {
      console.error("Hand detection error:", error);
    }

    requestAnimationFrame(processFrame);
  }, [isActive, onHandGesture]);

  const processHandGestures = (results: any, ctx: CanvasRenderingContext2D) => {
    // Hand gesture processing logic here
    // This is a simplified version - you can expand based on your needs
    
    for (let i = 0; i < results.landmarks.length; i++) {
      const landmarks = results.landmarks[i];
      const handedness = results.handedness[i];
      
      // Draw hand landmarks
      drawHandLandmarks(ctx, landmarks);
      
      // Check for finger-thumb pinch gestures
      checkFingerGestures(landmarks, handedness[0].categoryName);
    }
  };

  const drawHandLandmarks = (ctx: CanvasRenderingContext2D, landmarks: any[]) => {
    ctx.fillStyle = "#ffd700";
    ctx.strokeStyle = "#ffd700";
    ctx.lineWidth = 2;

    // Draw connections between landmarks
    landmarks.forEach((landmark, index) => {
      const x = landmark.x * ctx.canvas.width;
      const y = landmark.y * ctx.canvas.height;
      
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
    });
  };

  const checkFingerGestures = (landmarks: any[], handType: string) => {
    const thumbTip = landmarks[4];
    const fingerTips = [8, 12, 16, 20]; // Index, Middle, Ring, Pinky
    
    // New mapping: Left hand pinky to right hand pinky in order
    // Left hand: Pinky=Sa, Ring=Ri, Middle=Ga, Index=Ma
    // Right hand: Index=Pa, Middle=Da, Ring=Ni, Pinky=unused (for now)
    const swaras = handType === "Left" 
      ? ["Ma", "Ga", "Ri", "Sa"] // Index, Middle, Ring, Pinky
      : ["Pa", "Da", "Ni", null]; // Index, Middle, Ring, Pinky

    fingerTips.forEach((fingerId, index) => {
      const fingerTip = landmarks[fingerId];
      const distance = Math.hypot(
        fingerTip.x - thumbTip.x,
        fingerTip.y - thumbTip.y
      );

      if (distance < 0.04 && swaras[index]) { // Threshold for pinch detection
        onHandGesture(swaras[index]!, {
          x: fingerTip.x,
          y: fingerTip.y
        });
      }
    });
  };

  useEffect(() => {
    if (isActive) {
      initializeHandTracking();
      startWebcam();
    }
  }, [isActive, initializeHandTracking, startWebcam]);

  useEffect(() => {
    if (isActive && handLandmarkerRef.current) {
      processFrame();
    }
  }, [isActive, processFrame]);

  return (
    <motion.div 
      className="relative w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover rounded-xl transform scale-x-[-1]"
        autoPlay
        playsInline
        onLoadedMetadata={() => {
          if (canvasRef.current && videoRef.current) {
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
          }
        }}
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover rounded-xl transform scale-x-[-1] pointer-events-none"
        style={{ aspectRatio: '16/9' }}
      />
    </motion.div>
  );
}