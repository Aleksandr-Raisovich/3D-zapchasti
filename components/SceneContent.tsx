import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useScroll, Float, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { PartData } from '../types';

interface SceneContentProps {
  foundPart: PartData | null;
}

// --- Procedural Parts Components ---

const NutGeometry = () => (
  <cylinderGeometry args={[0.5, 0.5, 0.3, 6]} />
);

const BoltGeometry = () => (
    <group>
        {/* Head */}
        <mesh position={[0, 0.4, 0]}>
            <cylinderGeometry args={[0.4, 0.4, 0.3, 6]} />
            <meshStandardMaterial color="#b0b0b0" metalness={0.9} roughness={0.3} />
        </mesh>
        {/* Thread */}
        <mesh position={[0, -0.2, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 1, 16]} />
            <meshStandardMaterial color="#909090" metalness={0.8} roughness={0.5} />
        </mesh>
    </group>
);

const WasherGeometry = () => (
  <torusGeometry args={[0.4, 0.15, 16, 32]} />
);

const PistonHeadGeometry = () => (
    <group>
         <mesh>
            <cylinderGeometry args={[0.5, 0.5, 0.6, 32]} />
             <meshStandardMaterial color="#e2e8f0" metalness={0.6} roughness={0.2} />
         </mesh>
         <mesh position={[0, 0.4, 0]}>
             <cylinderGeometry args={[0.4, 0.4, 0.1, 32]} />
             <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.4} />
         </mesh>
    </group>
);

// --- Main Geometry Wrapper ---

interface GeometryPartProps {
  position: [number, number, number];
  type: 'nut' | 'bolt' | 'washer' | 'piston';
  scale: number;
  rotationSpeed: number;
}

const GeometryPart: React.FC<GeometryPartProps> = ({ position, type, scale, rotationSpeed }) => {
    const meshRef = useRef<THREE.Group>(null);
    
    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += delta * rotationSpeed;
            meshRef.current.rotation.y += delta * rotationSpeed * 0.5;
        }
    });

    // Material preset
    const materialProps = {
        color: type === 'nut' ? '#fbbf24' : (type === 'washer' ? '#cbd5e1' : '#94a3b8'), // Gold for nuts, silver for others
        roughness: 0.3,
        metalness: 0.8,
    };

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            <group ref={meshRef} position={position} scale={scale}>
                {type === 'nut' && (
                    <mesh>
                        <NutGeometry />
                        <meshStandardMaterial {...materialProps} color="#d4af37" />
                    </mesh>
                )}
                {type === 'bolt' && <BoltGeometry />}
                {type === 'washer' && (
                    <mesh>
                        <WasherGeometry />
                        <meshStandardMaterial {...materialProps} color="#a1a1aa" />
                    </mesh>
                )}
                {type === 'piston' && <PistonHeadGeometry />}
            </group>
        </Float>
    );
}

export const SceneContent: React.FC<SceneContentProps> = ({ foundPart }) => {
  const scroll = useScroll();
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  useFrame((state, delta) => {
    const offset = scroll.offset;
    
    if (groupRef.current) {
        // Rotate the entire group based on scroll
        groupRef.current.rotation.y = THREE.MathUtils.damp(
            groupRef.current.rotation.y,
            offset * Math.PI * 2, 
            2,
            delta
        );

        // Move closer
        groupRef.current.position.z = THREE.MathUtils.damp(
            groupRef.current.position.z,
            offset * 2,
            2,
            delta
        );
    }
  });

  // Generate random mechanical parts
  const parts = useMemo(() => {
    const types: ('nut' | 'bolt' | 'washer' | 'piston')[] = ['nut', 'bolt', 'washer', 'piston'];
    return new Array(25).fill(null).map((_, i) => ({
        position: [
            (Math.random() - 0.5) * viewport.width * 1.8,
            (Math.random() - 0.5) * viewport.height * 2.5,
            (Math.random() - 0.5) * 6
        ] as [number, number, number],
        scale: Math.random() * 0.8 + 0.4,
        type: types[Math.floor(Math.random() * types.length)],
        rotationSpeed: (Math.random() - 0.5) * 1.5
    }));
  }, [viewport]);

  return (
    <>
      {/* Environment for Reflections */}
      <Environment preset="city" /> 

      {/* Lighting for Light Mode */}
      <ambientLight intensity={0.8} color="#ffffff" />
      <directionalLight position={[5, 5, 5]} intensity={1.5} castShadow shadow-mapSize={1024} />
      <spotLight position={[-5, 5, -5]} intensity={1} color="#bfdbfe" angle={0.5} penumbra={1} />
      
      {/* Soft shadows on the "floor" */}
      <ContactShadows position={[0, -4, 0]} opacity={0.4} scale={20} blur={2.5} far={4.5} color="#94a3b8" />

      <group ref={groupRef}>
        {parts.map((part, i) => (
            <GeometryPart 
                key={i} 
                position={part.position} 
                scale={part.scale} 
                type={part.type}
                rotationSpeed={part.rotationSpeed}
            />
        ))}
        
        {/* Hero Part - Shown when found */}
        {foundPart && (
            <Float speed={4} rotationIntensity={1.5} floatIntensity={1.5}>
                 <mesh position={[0, 0, 1.5]}>
                    {/* Complex TorusKnot as a generic "Main Part" */}
                    <torusKnotGeometry args={[0.7, 0.25, 120, 20]} />
                    <meshStandardMaterial 
                        color="#2563eb" // Blue
                        roughness={0.2} 
                        metalness={0.9} 
                    />
                 </mesh>
            </Float>
        )}
      </group>
    </>
  );
};