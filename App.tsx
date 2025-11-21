import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls, Scroll, Loader } from '@react-three/drei';
import { SceneContent } from './components/SceneContent';
import { SearchInterface } from './components/SearchInterface';
import { PartData } from './types';

const App: React.FC = () => {
  const [foundPart, setFoundPart] = useState<PartData | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  return (
    <div className="h-screen w-screen bg-slate-50 relative">
      <Canvas shadows camera={{ position: [0, 0, 5], fov: 50 }}>
        <color attach="background" args={['#f8fafc']} />
        <fog attach="fog" args={['#f8fafc', 5, 20]} />
        
        <Suspense fallback={null}>
          <ScrollControls pages={2} damping={0.2}>
            {/* 3D Content that reacts to scroll */}
            <SceneContent foundPart={foundPart} />
            
            {/* HTML UI Overlay inside Scroll to move with flow or stay sticky */}
            <Scroll html style={{ width: '100%', height: '100%' }}>
              <SearchInterface 
                setFoundPart={setFoundPart} 
                isSearching={isSearching} 
                setIsSearching={setIsSearching}
                foundPart={foundPart}
              />
            </Scroll>
          </ScrollControls>
        </Suspense>
      </Canvas>
      <Loader 
        dataInterpolation={(p) => `Загрузка 3D... ${p.toFixed(0)}%`} 
        containerStyles={{ background: '#f8fafc' }}
        innerStyles={{ background: '#e2e8f0', width: '200px' }}
        barStyles={{ background: '#2563eb' }}
        dataStyles={{ color: '#1e293b', fontWeight: 'bold' }}
      />
    </div>
  );
};

export default App;