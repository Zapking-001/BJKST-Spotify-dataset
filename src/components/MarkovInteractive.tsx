import { useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Text } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';
import { BlockMath, InlineMath } from 'react-katex';
import { motion } from 'framer-motion';

function ProbabilityVolume({ epsilon }: { epsilon: number }) {
  const bound = Math.min(1, 1 / epsilon);
  const regionWidth = bound * 8; // Scale for 3D

  const { width } = useSpring({
    width: regionWidth,
    config: { mass: 2, tension: 170, friction: 26 }
  });

  return (
    <group>
      {/* Outer container representing Total Probability = 1 */}
      <Box args={[8, 4, 4]} material-color="#111827" material-transparent material-opacity={0.3} material-wireframe={true} />
      
      {/* Inner volume representing the bound */}
      <animated.group scale-x={width.to(w => w / 8)}>
        <Box args={[8, 4, 4]} position={[0, 0, 0]}>
          <meshPhysicalMaterial 
            color="#f43f5e" 
            transparent 
            opacity={0.6} 
            transmission={0.5} 
            roughness={0.1}
            thickness={2}
          />
        </Box>
      </animated.group>
      
      <Text position={[0, -2.5, 0]} color="#f43f5e" fontSize={0.5} anchorX="center" anchorY="middle">
        Probability Bound Region
      </Text>
    </group>
  );
}

export const MarkovInteractive = () => {
  const [epsilon, setEpsilon] = useState(1.0);
  const sliderRef = useRef<HTMLInputElement>(null);

  const bound = Math.min(1, 1 / epsilon);

  return (
    <div className="w-full h-full relative flex flex-col items-center justify-center pointer-events-auto"
      onWheel={(e) => e.stopPropagation()} 
    >
      <div className="absolute top-10 text-center z-10 pointer-events-none">
        <h1 className="text-4xl font-serif font-bold tracking-widest text-white drop-shadow-lg">MARKOV INEQUALITY</h1>
      </div>

      <div className="absolute left-10 top-1/4 w-80 z-10">
        <motion.div 
          className="glass-card rounded-2xl p-6 border-rose-500/30 shadow-[0_0_30px_rgba(244,63,94,0.15)] cursor-default transition-all duration-300 hover:border-rose-500/80 hover:shadow-[0_0_40px_rgba(244,63,94,0.5)]"
          whileHover={{ scale: 1.02, rotateY: 5, x: 10 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="font-mono text-rose-500 uppercase tracking-widest text-xs mb-4">Parameter HUD</div>
          <div className="text-4xl font-bold text-white mb-2">
            <InlineMath math={`\\varepsilon = ${epsilon.toFixed(2)}`} />
          </div>
          <div className="text-white/50 text-sm">Accuracy parameter (<InlineMath math="a = \varepsilon" />)</div>
        </motion.div>
      </div>

      <div className="absolute right-10 top-1/4 w-80 z-10">
        <motion.div 
          className="glass-card rounded-2xl p-6 border-rose-500/30 shadow-[0_0_30px_rgba(244,63,94,0.15)] cursor-default transition-all duration-300 hover:border-rose-500/80 hover:shadow-[0_0_40px_rgba(244,63,94,0.5)]"
          whileHover={{ scale: 1.02, rotateY: -5, x: -10 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="font-mono text-rose-500 uppercase tracking-widest text-xs mb-4">Bound HUD</div>
          <div className="text-2xl mb-4 text-white">
            <BlockMath math="\mathbb{P}(X \ge \varepsilon) \le \frac{\mathbb{E}[X]}{\varepsilon}" />
          </div>
          <div className="text-4xl font-bold text-rose-400 mb-2">
            <InlineMath math={`\\le ${bound.toFixed(2)}`} />
          </div>
          <div className="text-white/50 text-sm">Assuming <InlineMath math="\mathbb{E}[X] = 1" /></div>
        </motion.div>
      </div>

      <div className="absolute bottom-16 w-full max-w-2xl z-10 flex flex-col items-center">
        <div className="mb-4 text-rose-400 font-mono text-xs uppercase tracking-widest">Drag ε → Watch the bound change</div>
        <div className="flex items-center gap-6 w-full bg-black/60 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
          <div className="font-serif text-2xl text-white">0.5</div>
          <input 
            ref={sliderRef}
            type="range" 
            min="0.5" 
            max="10.0" 
            step="0.1" 
            value={epsilon}
            onChange={(e) => setEpsilon(parseFloat(e.target.value))}
            className="flex-1 accent-rose-500 h-2 bg-rose-950 rounded-lg appearance-none cursor-grab active:cursor-grabbing"
          />
          <div className="font-serif text-2xl text-white">10.0</div>
          <button 
            onClick={() => setEpsilon(1.0)}
            className="px-4 py-2 bg-rose-500/20 text-rose-300 font-mono text-xs rounded hover:bg-rose-500/40 transition-colors"
          >
            RESET ε
          </button>
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 2, 12], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#f43f5e" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#05070B" />
          
          <ProbabilityVolume epsilon={epsilon} />
          
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            minPolarAngle={Math.PI / 2.5}
            maxPolarAngle={Math.PI / 1.5}
            minAzimuthAngle={-Math.PI / 8}
            maxAzimuthAngle={Math.PI / 8}
          />
        </Canvas>
      </div>
    </div>
  );
};
