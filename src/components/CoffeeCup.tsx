'use client';

import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// 3D Coffee Cup Model
function Cup() {
  return (
    <group position={[0, -1, 0]}>
      {/* Saucer */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[2.2, 1.6, 0.1, 32]} />
        <meshStandardMaterial 
          color="#1a100c" 
          roughness={0.5} 
          metalness={0.1}
        />
      </mesh>
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[2.22, 1.62, 0.1, 32]} />
        <meshStandardMaterial 
          color="#c28854" 
          wireframe
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* Cup Body */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[1.3, 0.9, 1.2, 32, 1, true]} />
        <meshStandardMaterial 
          color="#18110e" 
          roughness={0.3} 
          metalness={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Cup Base rim */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.92, 0.92, 0.1, 32]} />
        <meshStandardMaterial color="#c28854" roughness={0.2} />
      </mesh>

      {/* Cup Handle */}
      <mesh position={[1.1, 0.6, 0]} rotation={[0, 0, Math.PI / 6]}>
        <torusGeometry args={[0.45, 0.09, 16, 32, Math.PI * 1.5]} />
        <meshStandardMaterial color="#c28854" roughness={0.3} />
      </mesh>

      {/* Liquid surface */}
      <mesh position={[0, 1.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.25, 1.25, 0.02, 32]} />
        <meshStandardMaterial 
          color="#382115" 
          roughness={0.1} 
          metalness={0.8}
        />
      </mesh>

      {/* Crema foam detail */}
      <mesh position={[0, 1.16, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.8, 1.2, 32]} />
        <meshStandardMaterial 
          color="#c28854" 
          roughness={0.9} 
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  );
}

// Steam Particles System rising from the coffee surface
interface SteamParticle {
  id: number;
  x: number;
  y: number;
  z: number;
  speed: number;
  wiggleSpeed: number;
  wigglePhase: number;
  size: number;
  maxHeight: number;
}

function SteamParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  
  const particleCount = 60;
  const [particles, setParticles] = useState<SteamParticle[]>(() => {
    const arr: SteamParticle[] = [];
    for (let i = 0; i < particleCount; i++) {
      arr.push({
        id: i,
        x: (Math.random() - 0.5) * 1.2,
        y: 0.2 + Math.random() * 3,
        z: (Math.random() - 0.5) * 1.2,
        speed: 0.015 + Math.random() * 0.02,
        wiggleSpeed: 1 + Math.random() * 3,
        wigglePhase: Math.random() * Math.PI * 2,
        size: 0.1 + Math.random() * 0.15,
        maxHeight: 3.5 + Math.random() * 1.5,
      });
    }
    return arr;
  });

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    
    setParticles((prev) => {
      return prev.map((p, index) => {
        let nextY = p.y + p.speed;
        let nextX = p.x + Math.sin(state.clock.getElapsedTime() * p.wiggleSpeed + p.wigglePhase) * 0.005;
        let nextZ = p.z + Math.cos(state.clock.getElapsedTime() * p.wiggleSpeed + p.wigglePhase) * 0.005;
        
        // Reset if too high
        if (nextY > p.maxHeight) {
          nextY = 0.2;
          nextX = (Math.random() - 0.5) * 1.2;
          nextZ = (Math.random() - 0.5) * 1.2;
        }

        // Update Three.js buffer positions
        positions[index * 3] = nextX;
        positions[index * 3 + 1] = nextY;
        positions[index * 3 + 2] = nextZ;

        return { ...p, x: nextX, y: nextY, z: nextZ };
      });
    });
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  // Position buffer array for Points geometry
  const initialPositions = useMemo(() => {
    return new Float32Array(particleCount * 3);
  }, []);

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position"
          args={[initialPositions, 3]}
          count={particleCount}
          array={initialPositions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        color="#ecdcd3"
        size={0.12}
        transparent
        opacity={0.35}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Floating HTML Cards emerging from steam
interface FloatingCardProps {
  title: string;
  source: string;
  impact: string;
  initialY: number;
  delay: number;
}

function FloatingCard({ title, source, impact, initialY, delay }: FloatingCardProps) {
  const htmlRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<[number, number, number]>([0, initialY, 0]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime() + delay;
    const y = initialY + Math.sin(time * 0.5) * 0.4; // smooth hover
    const x = Math.sin(time * 0.3) * 0.3;
    const z = Math.cos(time * 0.4) * 0.3;
    setPosition([x, y, z]);
  });

  return (
    <Html 
      position={position} 
      center 
      distanceFactor={6}
      style={{ pointerEvents: 'none' }}
    >
      <div 
        ref={htmlRef}
        className="w-48 p-3 bg-[#0f0a08]/90 border border-coffee-accent/30 rounded-lg shadow-xl shadow-black/80 text-left transition-all duration-300 hover:scale-105 hover:border-coffee-accent flex flex-col gap-1 select-none backdrop-blur-md"
      >
        <div className="flex justify-between items-center text-[8px] font-mono text-coffee-text-muted">
          <span>{source}</span>
          <span className="text-coffee-accent font-bold">Signal</span>
        </div>
        <h4 className="text-[10px] font-bold text-coffee-cream leading-snug line-clamp-2">
          {title}
        </h4>
        <p className="text-[7.5px] text-coffee-text-muted leading-relaxed truncate">
          {impact}
        </p>
      </div>
    </Html>
  );
}

export default function CoffeeCup() {
  return (
    <div className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center cursor-grab active:cursor-grabbing">
      <Canvas 
        camera={{ position: [0, 2.5, 4.5], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#ecdcd3" />
        <pointLight position={[-10, 5, -10]} intensity={0.5} color="#c28854" />
        
        {/* Spot light directly on the coffee cup */}
        <spotLight 
          position={[0, 5, 0]} 
          intensity={2.5} 
          angle={0.6} 
          penumbra={0.5} 
          color="#c28854" 
        />
        
        {/* Cup mesh */}
        <Cup />

        {/* Dynamic rising steam */}
        <SteamParticles />

        {/* Floating cards presenting live AI developments */}
        <FloatingCard 
          title="GPT-5 Preview Released Natively"
          source="OpenAI.com"
          impact="YAML-defined agentic architectures"
          initialY={1.1}
          delay={0}
        />
        
        <FloatingCard 
          title="Claude 3.5 Opus Graph Routing"
          source="Anthropic"
          impact="Graph Mapping reduces hallucinations"
          initialY={2.2}
          delay={3.5}
        />

        <FloatingCard 
          title="NVDA Market Cap Surges +4.2%"
          source="NASDAQ"
          impact="Tech leading broader market indexes"
          initialY={1.65}
          delay={1.8}
        />

        {/* Basic interaction controls */}
        <OrbitControls 
          enableZoom={false} 
          maxPolarAngle={Math.PI / 2.1} 
          minPolarAngle={Math.PI / 4}
        />
      </Canvas>
    </div>
  );
}
