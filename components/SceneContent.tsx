import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useScroll, Float, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { PartData } from '../types';

interface SceneContentProps {
  foundPart: PartData | null;
}

// --- Realistic Materials Config ---
const MATERIAL_CHROME = { color: "#ffffff", metalness: 1.0, roughness: 0.15, envMapIntensity: 1.5 };
const MATERIAL_STEEL = { color: "#cbd5e1", metalness: 0.9, roughness: 0.3, envMapIntensity: 1.0 };
const MATERIAL_CAST_IRON = { color: "#475569", metalness: 0.7, roughness: 0.7, envMapIntensity: 0.5 };
const MATERIAL_ALUMINUM = { color: "#e2e8f0", metalness: 0.8, roughness: 0.35, envMapIntensity: 1.0 };
const MATERIAL_DARK_METAL = { color: "#1e293b", metalness: 0.8, roughness: 0.5, envMapIntensity: 0.8 };
const MATERIAL_CERAMIC = { color: "#ffffff", metalness: 0.0, roughness: 0.1, envMapIntensity: 0.2 };

// --- Engine Parts Components ---

const ValveGeometry = () => (
  <group rotation={[Math.PI, 0, 0]}>
    {/* Head Top */}
    <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[0.6, 0.1, 0.15, 32]} />
      <meshStandardMaterial {...MATERIAL_STEEL} />
    </mesh>
    {/* Head Base */}
    <mesh position={[0, 0.65, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[0.6, 0.6, 0.1, 32]} />
      <meshStandardMaterial {...MATERIAL_DARK_METAL} />
    </mesh>
    {/* Stem */}
    <mesh position={[0, 0, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[0.08, 0.08, 1.4, 16]} />
      <meshStandardMaterial {...MATERIAL_CHROME} />
    </mesh>
  </group>
);

const ConnectingRodGeometry = () => (
  <group>
    {/* Big End */}
    <mesh position={[0, -0.6, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
       <torusGeometry args={[0.4, 0.15, 16, 32]} />
       <meshStandardMaterial {...MATERIAL_CAST_IRON} />
    </mesh>
    {/* Small End */}
    <mesh position={[0, 0.6, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
       <torusGeometry args={[0.25, 0.12, 16, 32]} />
       <meshStandardMaterial {...MATERIAL_CAST_IRON} />
    </mesh>
    {/* Beam */}
    <mesh position={[0, 0, 0]} castShadow receiveShadow>
       <boxGeometry args={[0.15, 1.2, 0.08]} />
       <meshStandardMaterial {...MATERIAL_CAST_IRON} />
    </mesh>
    {/* Bolts details */}
    <mesh position={[0.3, -0.6, 0.15]} rotation={[Math.PI/2, 0, 0]} castShadow>
       <cylinderGeometry args={[0.04, 0.04, 0.1, 8]} />
       <meshStandardMaterial {...MATERIAL_STEEL} />
    </mesh>
    <mesh position={[-0.3, -0.6, 0.15]} rotation={[Math.PI/2, 0, 0]} castShadow>
       <cylinderGeometry args={[0.04, 0.04, 0.1, 8]} />
       <meshStandardMaterial {...MATERIAL_STEEL} />
    </mesh>
  </group>
);

const GearGeometry = () => {
    // More teeth for realistic look
    const teeth = useMemo(() => {
        return new Array(16).fill(0).map((_, i) => {
            const angle = (i / 16) * Math.PI * 2;
            return (
                <mesh key={i} position={[Math.cos(angle) * 0.48, Math.sin(angle) * 0.48, 0]} rotation={[0, 0, angle]} castShadow>
                    <boxGeometry args={[0.1, 0.12, 0.15]} />
                    <meshStandardMaterial {...MATERIAL_STEEL} color="#94a3b8" />
                </mesh>
            );
        });
    }, []);

    return (
        <group>
            <mesh rotation={[Math.PI/2, 0, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[0.45, 0.45, 0.15, 32]} />
                <meshStandardMaterial {...MATERIAL_STEEL} color="#64748b" />
            </mesh>
            <mesh rotation={[Math.PI/2, 0, 0]} position={[0, 0, 0.01]}>
                 <cylinderGeometry args={[0.15, 0.15, 0.16, 16]} />
                 <meshStandardMaterial {...MATERIAL_DARK_METAL} />
            </mesh>
            {teeth}
        </group>
    );
};

const SparkPlugGeometry = () => (
    <group rotation={[Math.PI, 0, 0]}>
        {/* Terminal/Top */}
        <mesh position={[0, 0.7, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 0.2, 16]} />
            <meshStandardMaterial {...MATERIAL_ALUMINUM} />
        </mesh>
        {/* Ceramic Insulator */}
        <mesh position={[0, 0.3, 0]} castShadow>
            <cylinderGeometry args={[0.11, 0.11, 0.6, 24]} />
            <meshStandardMaterial {...MATERIAL_CERAMIC} />
        </mesh>
         {/* Hex Nut */}
        <mesh position={[0, -0.1, 0]} castShadow>
            <cylinderGeometry args={[0.18, 0.18, 0.15, 6]} />
            <meshStandardMaterial {...MATERIAL_STEEL} />
        </mesh>
        {/* Thread */}
        <mesh position={[0, -0.4, 0]} castShadow>
            <cylinderGeometry args={[0.14, 0.14, 0.5, 16]} />
            <meshStandardMaterial {...MATERIAL_DARK_METAL} roughness={0.6} />
        </mesh>
        {/* Electrode */}
        <mesh position={[0, -0.7, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.1, 8]} />
            <meshStandardMaterial {...MATERIAL_STEEL} />
        </mesh>
        {/* Side Electrode */}
        <mesh position={[0.08, -0.75, 0]} rotation={[0, 0, -0.5]}>
             <boxGeometry args={[0.04, 0.1, 0.02]} />
             <meshStandardMaterial {...MATERIAL_STEEL} />
        </mesh>
    </group>
);

const PistonGeometry = () => (
    <group>
         {/* Head */}
         <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.45, 0.45, 0.6, 48]} />
             <meshStandardMaterial {...MATERIAL_ALUMINUM} roughness={0.4} />
         </mesh>
         {/* Rings */}
         <mesh position={[0, 0.2, 0]} castShadow>
             <torusGeometry args={[0.46, 0.015, 32, 64]} />
             <meshStandardMaterial {...MATERIAL_DARK_METAL} />
         </mesh>
         <mesh position={[0, 0.1, 0]} castShadow>
             <torusGeometry args={[0.46, 0.015, 32, 64]} />
             <meshStandardMaterial {...MATERIAL_DARK_METAL} />
         </mesh>
         <mesh position={[0, 0.0, 0]} castShadow>
             <torusGeometry args={[0.46, 0.015, 32, 64]} />
             <meshStandardMaterial {...MATERIAL_DARK_METAL} />
         </mesh>
         {/* Wrist Pin visual */}
         <mesh rotation={[0, 0, Math.PI/2]} position={[0, -0.1, 0]}>
             <cylinderGeometry args={[0.12, 0.12, 0.95, 24]} />
             <meshStandardMaterial {...MATERIAL_STEEL} />
         </mesh>
    </group>
);

// --- Main Geometry Wrapper ---

interface GeometryPartProps {
  position: [number, number, number];
  type: 'valve' | 'conrod' | 'gear' | 'sparkplug' | 'piston';
  scale: number;
  rotationSpeed: number;
}

const GeometryPart: React.FC<GeometryPartProps> = ({ position, type, scale, rotationSpeed }) => {
    const meshRef = useRef<THREE.Group>(null);
    
    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += delta * rotationSpeed;
            meshRef.current.rotation.y += delta * rotationSpeed * 0.5;
            meshRef.current.rotation.z += delta * rotationSpeed * 0.2;
        }
    });

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            <group ref={meshRef} position={position} scale={scale}>
                {type === 'valve' && <ValveGeometry />}
                {type === 'conrod' && <ConnectingRodGeometry />}
                {type === 'gear' && <GearGeometry />}
                {type === 'sparkplug' && <SparkPlugGeometry />}
                {type === 'piston' && <PistonGeometry />}
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
    const types: ('valve' | 'conrod' | 'gear' | 'sparkplug' | 'piston')[] = ['valve', 'conrod', 'gear', 'sparkplug', 'piston'];
    return new Array(35).fill(null).map((_, i) => ({
        position: [
            (Math.random() - 0.5) * viewport.width * 2.5,
            (Math.random() - 0.5) * viewport.height * 4,
            (Math.random() - 0.5) * 10 - 2
        ] as [number, number, number],
        scale: Math.random() * 0.8 + 0.6,
        type: types[Math.floor(Math.random() * types.length)],
        rotationSpeed: (Math.random() - 0.5) * 0.8
    }));
  }, [viewport]);

  return (
    <>
      {/* Environment for Realistic Reflections */}
      <Environment preset="city" /> 

      {/* Lighting Setup */}
      <ambientLight intensity={0.5} color="#ffffff" />
      <directionalLight position={[10, 10, 10]} intensity={1.0} castShadow shadow-mapSize={2048} />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#bfdbfe" />
      <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={1.5} castShadow />
      
      {/* Soft shadows on the "floor" */}
      <ContactShadows position={[0, -5, 0]} opacity={0.4} scale={30} blur={2.5} far={6} color="#1e293b" />

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
                 <mesh position={[0, 0, 2]}>
                    {/* Complex TorusKnot as a generic "Main Part" for now */}
                    <torusKnotGeometry args={[0.6, 0.2, 128, 32]} />
                    <meshStandardMaterial 
                        color="#2563eb" // Blue
                        roughness={0.1} 
                        metalness={1.0} 
                        envMapIntensity={2}
                    />
                 </mesh>
            </Float>
        )}
      </group>
    </>
  );
};