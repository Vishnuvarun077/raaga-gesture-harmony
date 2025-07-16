import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sphere, Stars, Float } from "@react-three/drei";
import { useRef } from "react";
import { Mesh } from "three";
import { useFrame } from "@react-three/fiber";

interface ParticleProps {
  position: [number, number, number];
  color: string;
  scale?: number;
}

function Particle({ position, color, scale = 1 }: ParticleProps) {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.7;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={meshRef} position={position} scale={scale}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
      </Sphere>
    </Float>
  );
}

interface ThreeCanvasProps {
  particles: Array<{ id: string; position: [number, number, number]; color: string; scale?: number }>;
}

export function ThreeCanvas({ particles }: ThreeCanvasProps) {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#ffd700" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff8c00" />
        
        <Stars 
          radius={50} 
          depth={50} 
          count={1000} 
          factor={4} 
          saturation={0} 
          fade 
        />
        
        {particles.map((particle) => (
          <Particle
            key={particle.id}
            position={particle.position}
            color={particle.color}
            scale={particle.scale}
          />
        ))}
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          autoRotate 
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}