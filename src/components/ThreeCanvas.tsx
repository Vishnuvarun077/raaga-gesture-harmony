import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";

interface ParticleProps {
  position: [number, number, number];
  color: string;
  scale?: number;
}

function Particle({ position, color, scale = 0.1 }: ParticleProps) {
  // Safety checks for position array
  const safePosition: [number, number, number] = [
    position?.[0] || 0,
    position?.[1] || 0,
    position?.[2] || 0
  ];
  
  return (
    <mesh position={safePosition}>
      <sphereGeometry args={[scale, 8, 8]} />
      <meshStandardMaterial 
        color={color || '#ffd700'} 
        emissive={color || '#ffd700'} 
        emissiveIntensity={0.2} 
      />
    </mesh>
  );
}

interface ThreeCanvasProps {
  particles?: Array<{ id: string; position: [number, number, number]; color: string; scale?: number }>;
}

export function ThreeCanvas({ particles = [] }: ThreeCanvasProps) {
  // Filter out any invalid particles
  const validParticles = particles.filter(particle => 
    particle && 
    particle.id && 
    particle.position && 
    Array.isArray(particle.position) && 
    particle.position.length === 3 &&
    particle.color
  );

  return (
    <div className="absolute inset-0 z-0">
      <Suspense fallback={null}>
        <Canvas 
          camera={{ position: [0, 0, 5], fov: 75 }}
          gl={{ antialias: false }}
        >
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={0.8} />
          
          {validParticles.map((particle) => (
            <Particle
              key={particle.id}
              position={particle.position}
              color={particle.color}
              scale={particle.scale || 0.1}
            />
          ))}
        </Canvas>
      </Suspense>
    </div>
  );
}