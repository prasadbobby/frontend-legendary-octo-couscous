'use client';

import { useState, useEffect } from 'react';
import SimpleFallback from './SimpleFallback';

const loadThreeComponents = async () => {
  try {
    const [
      { Canvas },
      { OrbitControls, Float, Environment, PerspectiveCamera, Text, Cloud, Stars, Sphere, Box, Plane, MeshDistortMaterial, MeshWobbleMaterial },
      { useFrame },
      THREE
    ] = await Promise.all([
      import('@react-three/fiber'),
      import('@react-three/drei'),
      import('@react-three/fiber'),
      import('three')
    ]);
    
    return { Canvas, OrbitControls, Float, Environment, PerspectiveCamera, Text, Cloud, Stars, Sphere, Box, Plane, MeshDistortMaterial, MeshWobbleMaterial, useFrame, THREE };
  } catch (error) {
    console.error('Failed to load Three.js components:', error);
    throw error;
  }
};

// Enhanced Eco-Friendly Village House
function EcoVillageHouse({ position, rotation, scale = 1, useFrame, houseType = 'eco' }) {
  const { useRef } = require('react');
  const houseRef = useRef();
  
  useFrame((state) => {
    if (houseRef.current) {
      houseRef.current.rotation.y += 0.001;
      houseRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  const getHouseColors = () => {
    switch(houseType) {
      case 'bamboo': return { main: '#8FBC8F', roof: '#228B22', accent: '#556B2F' };
      case 'clay': return { main: '#CD853F', roof: '#8B4513', accent: '#A0522D' };
      case 'stone': return { main: '#708090', roof: '#2F4F4F', accent: '#696969' };
      default: return { main: '#8FBC8F', roof: '#228B22', accent: '#556B2F' };
    }
  };

  const colors = getHouseColors();

  return (
    <group ref={houseRef} position={position} rotation={rotation} scale={scale}>
      {/* Sustainable Foundation */}
      <mesh position={[0, -0.3, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.2, 2.5, 0.3, 8]} />
        <meshStandardMaterial color={colors.accent} roughness={0.9} />
      </mesh>

      {/* Main Eco House Structure */}
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.8, 2.2, 2.8]} />
        <meshStandardMaterial 
          color={colors.main} 
          roughness={0.8} 
          metalness={0.1}
          envMapIntensity={0.3}
        />
      </mesh>
      
      {/* Green Living Roof */}
      <mesh position={[0, 1.8, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[2.5, 1.4, 4]} />
        <meshStandardMaterial 
          color={colors.roof} 
          roughness={0.9}
          envMapIntensity={0.2}
        />
      </mesh>

      {/* Solar Panel */}
      <mesh position={[0.5, 2.2, -0.5]} rotation={[0.3, 0, 0]} castShadow>
        <boxGeometry args={[1.2, 0.05, 0.8]} />
        <meshStandardMaterial 
          color="#1a1a2e" 
          metalness={0.8} 
          roughness={0.2}
          emissive="#001122"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Wooden Door */}
      <mesh position={[0, -0.1, 1.41]} castShadow>
        <boxGeometry args={[0.7, 1.6, 0.1]} />
        <meshStandardMaterial color="#8B4513" roughness={0.9} />
      </mesh>
      
      {/* Natural Windows */}
      <mesh position={[-1, 0.4, 1.41]} castShadow>
        <boxGeometry args={[0.6, 0.6, 0.08]} />
        <meshStandardMaterial color="#87CEEB" transparent opacity={0.8} />
      </mesh>
      <mesh position={[1, 0.4, 1.41]} castShadow>
        <boxGeometry args={[0.6, 0.6, 0.08]} />
        <meshStandardMaterial color="#87CEEB" transparent opacity={0.8} />
      </mesh>
      
      {/* Rainwater Collection Tank */}
      <mesh position={[-2, 0, 1]} castShadow>
        <cylinderGeometry args={[0.5, 0.5, 1.5]} />
        <meshStandardMaterial color="#4682B4" metalness={0.3} roughness={0.7} />
      </mesh>
      
      {/* Garden Elements */}
      <mesh position={[2.5, -0.7, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 2]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      <mesh position={[2.5, 0.8, 0]} castShadow>
        <sphereGeometry args={[1, 12, 8]} />
        <meshStandardMaterial color="#228B22" />
      </mesh>

      {/* Vegetable Garden Plot */}
      <mesh position={[0, -0.9, 3]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <boxGeometry args={[3, 2, 0.1]} />
        <meshStandardMaterial color="#654321" />
      </mesh>

      {/* Wind Chime */}
      <mesh position={[-1.5, 1.5, 1.5]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.8]} />
        <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

// Animated Floating Trees
function FloatingTree({ position, useFrame, Float, treeType = 'oak' }) {
  const { useRef } = require('react');
  const treeRef = useRef();
  
  useFrame((state) => {
    if (treeRef.current) {
      treeRef.current.rotation.y += 0.002;
    }
  });

  const getTreeColors = () => {
    switch(treeType) {
      case 'pine': return { trunk: '#654321', leaves: '#0F5132' };
      case 'birch': return { trunk: '#F5F5DC', leaves: '#90EE90' };
      case 'banyan': return { trunk: '#8B4513', leaves: '#006400' };
      default: return { trunk: '#8B4513', leaves: '#228B22' };
    }
  };

  const colors = getTreeColors();

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.8}>
      <group ref={treeRef} position={position}>
        {/* Tree Trunk */}
        <mesh position={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.4, 3]} />
          <meshStandardMaterial color={colors.trunk} roughness={1} />
        </mesh>
        
        {/* Tree Canopy */}
        <mesh position={[0, 2.5, 0]} castShadow>
          <sphereGeometry args={[2, 12, 8]} />
          <meshStandardMaterial color={colors.leaves} />
        </mesh>

        {/* Smaller branches */}
        <mesh position={[0, 3.5, 0]} castShadow>
          <sphereGeometry args={[1.2, 8, 6]} />
          <meshStandardMaterial color={colors.leaves} />
        </mesh>
      </group>
    </Float>
  );
}

// Mystical Floating Mountains with Waterfalls
function FloatingMountain({ position, useFrame, Float }) {
  const { useRef } = require('react');
  const mountainRef = useRef();
  
  useFrame((state) => {
    if (mountainRef.current) {
      mountainRef.current.rotation.y += 0.0005;
    }
  });

  return (
    <Float speed={0.8} rotationIntensity={0.1} floatIntensity={0.5}>
      <group ref={mountainRef} position={position}>
        {/* Main Mountain */}
        <mesh castShadow>
          <coneGeometry args={[4, 8, 8]} />
          <meshStandardMaterial 
            color="#696969" 
            roughness={0.9}
            envMapIntensity={0.3}
          />
        </mesh>
        
        {/* Snow Cap */}
        <mesh position={[0, 3, 0]} castShadow>
          <coneGeometry args={[1.5, 2, 8]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>

        {/* Waterfall Effect */}
        <mesh position={[-1.5, -1, 2]} castShadow>
          <cylinderGeometry args={[0.1, 0.3, 6]} />
          <meshStandardMaterial 
            color="#87CEEB" 
            transparent 
            opacity={0.6}
            emissive="#4169E1"
            emissiveIntensity={0.1}
          />
        </mesh>

        {/* Forest on Mountain */}
        <mesh position={[1, -1, 1]} castShadow>
          <coneGeometry args={[0.5, 1.5, 6]} />
          <meshStandardMaterial color="#228B22" />
        </mesh>
        <mesh position={[-0.5, -1.5, 1.5]} castShadow>
          <coneGeometry args={[0.4, 1.2, 6]} />
          <meshStandardMaterial color="#32CD32" />
        </mesh>
      </group>
    </Float>
  );
}

// Eco-Friendly Floating Particles (representing clean air, seeds, etc.)
function EcoParticles({ useFrame, Float }) {
  const { useRef } = require('react');
  const particlesRef = useRef();
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.0008;
    }
  });

  const particles = [];
  const ecoColors = ['#90EE90', '#98FB98', '#00FF7F', '#32CD32', '#228B22', '#ADFF2F'];
  const particleTypes = ['seed', 'leaf', 'butterfly', 'pollen'];
  
  for (let i = 0; i < 80; i++) {
    const type = particleTypes[Math.floor(Math.random() * particleTypes.length)];
    const color = ecoColors[Math.floor(Math.random() * ecoColors.length)];
    
    particles.push(
      <Float key={i} speed={1 + Math.random() * 2} rotationIntensity={0.5} floatIntensity={1.5}>
        <mesh position={[
          (Math.random() - 0.5) * 40,
          Math.random() * 20,
          (Math.random() - 0.5) * 40
        ]}>
          {type === 'seed' && <sphereGeometry args={[0.02 + Math.random() * 0.03, 6, 6]} />}
          {type === 'leaf' && <boxGeometry args={[0.1, 0.05, 0.02]} />}
          {type === 'butterfly' && <boxGeometry args={[0.08, 0.02, 0.06]} />}
          {type === 'pollen' && <sphereGeometry args={[0.015, 4, 4]} />}
          
          <meshStandardMaterial 
            color={color}
            emissive={color}
            emissiveIntensity={type === 'butterfly' ? 0.4 : 0.2}
            transparent
            opacity={0.8}
          />
        </mesh>
      </Float>
    );
  }

  return <group ref={particlesRef}>{particles}</group>;
}

// Animated Natural Ground with Rivers
function NaturalGround({ useFrame }) {
  const { useRef } = require('react');
  const groundRef = useRef();
  
  useFrame((state) => {
    if (groundRef.current) {
      groundRef.current.material.uniforms.time = { value: state.clock.elapsedTime };
    }
  });

  return (
    <group>
      {/* Main Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]} receiveShadow>
        <planeGeometry args={[80, 80, 64, 64]} />
        <meshStandardMaterial 
          color="#90EE90" 
          roughness={1}
          envMapIntensity={0.1}
        />
      </mesh>

      {/* River */}
      <mesh rotation={[-Math.PI / 2, 0, Math.PI / 6]} position={[10, -2.9, 0]} receiveShadow>
        <planeGeometry args={[4, 60]} />
        <meshStandardMaterial 
          color="#4169E1" 
          transparent 
          opacity={0.7}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>

      {/* Flower Patches */}
      {Array.from({ length: 15 }).map((_, i) => (
        <mesh 
          key={i}
          position={[
            (Math.random() - 0.5) * 50,
            -2.8,
            (Math.random() - 0.5) * 50
          ]}
          rotation={[-Math.PI / 2, 0, Math.random() * Math.PI]}
        >
          <circleGeometry args={[0.5 + Math.random() * 0.5]} />
          <meshStandardMaterial 
            color={['#FF69B4', '#FFB6C1', '#FF1493', '#FFC0CB'][Math.floor(Math.random() * 4)]}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}

// Animated Clouds
function AnimatedClouds({ useFrame, Cloud }) {
  const { useRef } = require('react');
  const cloudsRef = useRef();
  
  useFrame((state) => {
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.0002;
      cloudsRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.1) * 2;
    }
  });

  return (
    <group ref={cloudsRef}>
      <Cloud position={[-20, 15, -10]} speed={0.2} opacity={0.4} />
      <Cloud position={[20, 12, -15]} speed={0.3} opacity={0.3} />
      <Cloud position={[0, 18, -20]} speed={0.1} opacity={0.5} />
      <Cloud position={[-10, 20, -25]} speed={0.15} opacity={0.35} />
    </group>
  );
}

// Rainbow Arc Effect
function RainbowArc({ useFrame }) {
  const { useRef } = require('react');
  const rainbowRef = useRef();
  
  useFrame((state) => {
    if (rainbowRef.current) {
      rainbowRef.current.material.opacity = 0.3 + Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <mesh ref={rainbowRef} position={[0, 10, -30]} rotation={[0, 0, Math.PI]}>
      <torusGeometry args={[25, 0.5, 8, 100, Math.PI]} />
      <meshStandardMaterial 
        color="#FF69B4"
        transparent
        opacity={0.3}
        emissive="#FF1493"
        emissiveIntensity={0.2}
      />
    </mesh>
  );
}

// Enhanced 3D Scene Content with Nature Focus
function Scene3DContent({ components }) {
  const { OrbitControls, Float, Environment, PerspectiveCamera, Stars, Cloud, useFrame } = components;
  
  try {
    return (
      <>
        <PerspectiveCamera makeDefault position={[12, 8, 15]} />
        
        {/* Enhanced Natural Lighting */}
        <ambientLight intensity={0.6} color="#FFF8DC" />
        <directionalLight 
          position={[20, 20, 10]} 
          intensity={1.5} 
          color="#FFE4B5"
          castShadow
          shadow-mapSize-width={4096}
          shadow-mapSize-height={4096}
          shadow-camera-far={50}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
        />
        <pointLight position={[-15, 15, -10]} intensity={0.8} color="#87CEEB" />
        <pointLight position={[15, 10, 15]} intensity={0.6} color="#98FB98" />
        <spotLight 
          position={[0, 25, 0]} 
          intensity={1} 
          color="#F0E68C"
          angle={Math.PI / 6}
          penumbra={0.5}
          castShadow
        />
        
        {/* Natural Environment */}
        <Environment preset="forest" />
        <Stars radius={150} depth={60} count={2000} factor={6} saturation={0.5} fade />
        
        {/* Animated Clouds */}
        <AnimatedClouds useFrame={useFrame} Cloud={Cloud} />
        
        {/* Natural Ground with Rivers */}
        <NaturalGround useFrame={useFrame} />
        
        {/* Rainbow Effect */}
        <RainbowArc useFrame={useFrame} />
        
        {/* Eco Village Houses */}
        <EcoVillageHouse position={[-6, 0, 3]} rotation={[0, 0.8, 0]} houseType="bamboo" useFrame={useFrame} />
        <EcoVillageHouse position={[0, 0, -2]} rotation={[0, 0, 0]} scale={0.9} houseType="clay" useFrame={useFrame} />
        <EcoVillageHouse position={[6, 0, 2]} rotation={[0, -0.8, 0]} scale={1.1} houseType="stone" useFrame={useFrame} />
        <EcoVillageHouse position={[-3, 0, -6]} rotation={[0, 1.2, 0]} scale={0.8} houseType="eco" useFrame={useFrame} />
        <EcoVillageHouse position={[4, 0, -4]} rotation={[0, -1.2, 0]} scale={0.9} houseType="bamboo" useFrame={useFrame} />
        
        {/* Floating Trees Forest */}
        <FloatingTree position={[-12, 2, -5]} useFrame={useFrame} Float={Float} treeType="oak" />
        <FloatingTree position={[12, 3, -8]} useFrame={useFrame} Float={Float} treeType="pine" />
        <FloatingTree position={[-8, 1, 8]} useFrame={useFrame} Float={Float} treeType="birch" />
        <FloatingTree position={[8, 2, 6]} useFrame={useFrame} Float={Float} treeType="banyan" />
        <FloatingTree position={[0, 4, -12]} useFrame={useFrame} Float={Float} treeType="oak" />
        
        {/* Mystical Floating Mountains */}
        <FloatingMountain position={[-25, 8, -20]} useFrame={useFrame} Float={Float} />
        <FloatingMountain position={[25, 6, -25]} useFrame={useFrame} Float={Float} />
        <FloatingMountain position={[0, 10, -35]} useFrame={useFrame} Float={Float} />
        
        {/* Eco-Friendly Particles */}
        <EcoParticles useFrame={useFrame} Float={Float} />
        
        {/* Enhanced Interactive Controls */}
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          autoRotate 
          autoRotateSpeed={0.2}
          maxPolarAngle={Math.PI / 2.2}
          minPolarAngle={Math.PI / 6}
          target={[0, 2, 0]}
        />
      </>
    );
  } catch (error) {
    console.error('3D Scene Content Error:', error);
    return null;
  }
}

// Main 3D Scene
function Scene3D() {
  const [components, setComponents] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    const initializeThree = async () => {
      try {
        const threeComponents = await loadThreeComponents();
        if (mounted) {
          setComponents(threeComponents);
          setLoading(false);
        }
      } catch (error) {
        console.error('Failed to initialize Three.js:', error);
        if (mounted) {
          setError(true);
          setLoading(false);
        }
      }
    };

    const timer = setTimeout(initializeThree, 100);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, []);

  if (loading || error || !components || typeof window === 'undefined') {
    return <SimpleFallback />;
  }

  try {
    const { Canvas } = components;
    const { Suspense } = require('react');
    
    return (
      <Canvas 
        className="w-full h-full" 
        gl={{ 
          antialias: true, 
          alpha: true,
          shadowMap: true,
          shadowMapType: 2,
          toneMapping: 1,
          toneMappingExposure: 1.2
        }}
        shadows
        onError={() => setError(true)}
        fallback={<SimpleFallback />}
      >
        <Suspense fallback={null}>
          <Scene3DContent components={components} />
        </Suspense>
      </Canvas>
    );
  } catch (error) {
    console.error('3D Scene Render Error:', error);
    return <SimpleFallback />;
  }
}

export default Scene3D;