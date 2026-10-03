import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import { InlineMath, BlockMath } from 'react-katex';
import { BackgroundShader } from './components/BackgroundShader';
import { DatasetInspector, NaiveFailsChart, PipelineSimulation } from './components/Interactive';
import { MarkovInteractive } from './components/MarkovInteractive';
import { TokenSimulator, PythonTerminal, MonteCarloHistogram, MedianTrick, MultiStream } from './components/Act4Interactive';

const slides = [
  { id: 'slide-1', type: 'hero' },
  { id: 'slide-2', type: 'standard' },
  { id: 'slide-3', type: 'standard' },
  { id: 'slide-4', type: 'standard' },
  { id: 'slide-5', type: 'standard' },
  { id: 'slide-6', type: 'full-widget' },
  { id: 'slide-7', type: 'standard' },
  { id: 'slide-8', type: 'section-break' },
  { id: 'slide-9', type: 'standard' },
  { id: 'slide-10', type: 'standard' },
  { id: 'slide-11', type: 'standard' },
  { id: 'slide-12', type: 'full-widget' }, // Scrub video
  { id: 'slide-13', type: 'standard' },
  { id: 'slide-14', type: 'standard' },
  { id: 'slide-15', type: 'section-break' },
  { id: 'slide-16', type: 'standard' },
  { id: 'slide-17', type: 'standard' },
  { id: 'slide-18', type: 'full-widget' },
  { id: 'slide-19', type: 'standard' },
  { id: 'slide-20', type: 'standard' },
  { id: 'slide-21', type: 'standard' },
  { id: 'slide-22', type: 'standard' },
  { id: 'slide-23', type: 'standard' },
  { id: 'slide-24', type: 'section-break' },
  { id: 'slide-25', type: 'standard' },
  { id: 'slide-26', type: 'full-widget' },
  { id: 'slide-27', type: 'standard' },
  { id: 'slide-28', type: 'full-widget' },
  { id: 'slide-29', type: 'standard' },
  { id: 'slide-30', type: 'standard' },
  { id: 'slide-31', type: 'standard' },
  { id: 'slide-32', type: 'standard' },
  { id: 'slide-33', type: 'section-break' }
];

export default function App() {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => setCurrent(p => Math.min(p + 1, slides.length - 1));
  const prevSlide = () => setCurrent(p => Math.max(p - 1, 0));
  const goToSlide = (idx: number) => setCurrent(Math.max(0, Math.min(idx, slides.length - 1)));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement || e.target instanceof HTMLTextAreaElement) return;
      if (['ArrowRight', 'ArrowDown', 'Space', 'PageDown', 'Enter', 'KeyN', 'KeyJ'].includes(e.code)) {
        e.preventDefault();
        setCurrent(p => Math.min(p + 1, slides.length - 1));
      } else if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace', 'KeyP', 'KeyK'].includes(e.code)) {
        e.preventDefault();
        setCurrent(p => Math.max(p - 1, 0));
      } else if (e.code === 'Home') {
        e.preventDefault();
        setCurrent(0);
      } else if (e.code === 'End') {
        e.preventDefault();
        setCurrent(slides.length - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);


  
  let currentAct = 1;
  if (current >= 7 && current <= 13) currentAct = 2;
  if (current >= 14 && current <= 22) currentAct = 3;
  if (current >= 23) currentAct = 4;

  // Safelist classes for Tailwind v4 scanner
  // selection:bg-emerald-500/30 border-emerald-500/30 bg-emerald-500 text-emerald-400
  // selection:bg-cyan-500/30 border-cyan-500/30 bg-cyan-500 text-cyan-400
  // selection:bg-rose-500/30 border-rose-500/30 bg-rose-500 text-rose-400
  // selection:bg-amber-500/30 border-amber-500/30 bg-amber-500 text-amber-400

  const getActColor = () => {
    if (currentAct === 1) return 'emerald';
    if (currentAct === 2) return 'cyan';
    if (currentAct === 3) return 'rose';
    if (currentAct === 4) return 'amber';
    return 'emerald';
  };

  const actColor = getActColor();

  return (
    <div className={`w-full h-screen bg-[#05070B] relative overflow-hidden text-white font-sans selection:bg-${actColor}-500/30`}>
      
      {/* BACKGROUND WEBGL */}
      <div className="absolute inset-0 z-0">
        <Canvas orthographic camera={{ position: [0, 0, 1], zoom: 1 }}>
          <BackgroundShader currentAct={currentAct} />
        </Canvas>
      </div>

      {/* FOREGROUND 2D SLIDE ENGINE */}
      <div className="relative z-10 w-full h-full flex flex-col justify-center items-center pointer-events-none">
        
        {/* HUD */}
        <div className="absolute top-8 left-8 right-8 flex justify-between items-center opacity-60 z-50">
          <div className="flex items-center gap-4">
            <div className={`w-8 h-8 rounded-full border border-${actColor}-500/30 flex items-center justify-center bg-black/20 backdrop-blur-md`}>
              <div className={`w-2 h-2 rounded-full animate-pulse bg-${actColor}-500`}></div>
            </div>
            <div className="font-mono text-xs tracking-widest uppercase">
              <div className="opacity-50">Probability II / BSDS 2026</div>
              <div className={`font-bold text-${actColor}-400`}>
                {currentAct === 1 ? 'PART 1: ARKAROY' : currentAct === 2 ? 'PART 2: ASHISH' : currentAct === 3 ? 'PART 3: SAGNIK' : 'PART 4: PRITHAM'}
              </div>
            </div>
          </div>
          <div className="font-mono text-xs tracking-widest bg-black/40 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
            {String(current + 1).padStart(2, '0')} — {String(slides.length).padStart(2, '0')}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* SLIDE 1: HERO INTRO */}
          {current === 0 && (
            <motion.div
              key="hero"
              initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-5xl text-center pointer-events-auto"
            >
              <h1 className="text-6xl md:text-8xl font-black font-serif tracking-tighter text-white drop-shadow-2xl mb-6">
                Counting Distinct Elements in a Data Stream
              </h1>
              <h2 className="text-3xl md:text-5xl font-serif text-emerald-400 font-bold mb-16 italic">
                The BJKST Algorithm
              </h2>
              
              <div className="grid grid-cols-2 gap-8 text-left max-w-2xl mx-auto font-mono text-sm border-t border-white/10 pt-12">
                <div>
                  <div className="text-white/40 uppercase tracking-widest mb-4">The Team</div>
                  <ul className="space-y-2 text-white/80">
                    <li><span className="text-emerald-400 font-bold">Arkaroy</span> (bsdbg2501)</li>
                    <li><span className="text-cyan-400 font-bold">Ashish</span> (bsdbg2502)</li>
                    <li><span className="text-rose-400 font-bold">Sagnik Das</span> (bsdbg2516)</li>
                    <li><span className="text-amber-400 font-bold">Pritham Prajwin V</span> (bsdbg2512)</li>
                  </ul>
                </div>
                <div>
                  <div className="text-white/40 uppercase tracking-widest mb-4">Course Info</div>
                  <div className="text-white/80 leading-relaxed">
                    Probability II<br />
                    BSDS 2026<br />
                    Prof. Arnab Chakraborty
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* SLIDE 2: THE PROBLEM STATEMENT */}
          {current === 1 && (
            <motion.div key="hook" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.5 }} className="w-full max-w-5xl pointer-events-auto">
              <div className="glass-card rounded-3xl p-16 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
                <div className="font-mono text-emerald-500 uppercase tracking-widest text-sm mb-8">01 / The Problem Statement</div>
                <h2 className="text-5xl font-serif leading-tight text-white/90 transition-all duration-300 hover:drop-shadow-[0_0_20px_rgba(16,185,129,0.8)] cursor-default">
                  How do you count the number of <span className="text-emerald-400 font-bold italic transition-all duration-300 hover:drop-shadow-[0_0_15px_rgba(16,185,129,0.8)]">different</span> things in a huge stream when you cannot afford to remember everything?
                </h2>
              </div>
            </motion.div>
          )}

          {/* SLIDE 3: FORMAL PROBLEM STATEMENT */}
          {current === 2 && (
            <motion.div key="problem" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.5 }} className="w-full max-w-5xl pointer-events-auto">
              <div className="glass-card rounded-3xl p-16 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
                <div className="font-mono text-emerald-500 uppercase tracking-widest text-sm mb-8">02 / Problem Statement</div>
                <h1 className="text-4xl font-serif font-bold mb-10">The Streaming Model</h1>
                
                <div className="bg-black/50 border border-white/5 rounded-xl p-8 mb-8 text-2xl text-center shadow-inner transition-all duration-300 hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:text-emerald-300 cursor-default">
                  <BlockMath math="\sigma = \langle a_1, a_2, \dots, a_m \rangle" />
                </div>
                
                <p className="text-lg text-white/70 mb-8 font-light leading-relaxed">
                  The stream <InlineMath math="\sigma" /> consists of <InlineMath math="m" /> items drawn from a universe <InlineMath math="U = \{1, 2, \dots, n\}" />. 
                  Our goal is to compute <InlineMath math="d" />, the number of <strong className="text-white">distinct</strong> elements in <InlineMath math="\sigma" />.
                </p>

                <div className="border-l-4 border-emerald-500 pl-8 py-4 bg-gradient-to-r from-emerald-500/10 to-transparent text-xl">
                  <p className="text-white/60 text-sm font-mono uppercase tracking-widest mb-4">Target Guarantee</p>
                  <BlockMath math="\mathbb{P}(|\hat{d}/d - 1| > \varepsilon) \le \delta" />
                </div>
              </div>
            </motion.div>
          )}

          {/* SLIDE 4: WHY NAIVE FAILS */}
          {current === 3 && (
            <motion.div key="naive" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.5 }} className="w-full max-w-5xl pointer-events-auto">
              <div className="glass-card rounded-3xl p-12 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
                <div className="grid grid-cols-5 gap-12 items-center">
                  <div className="col-span-2">
                    <div className="font-mono text-emerald-500 uppercase tracking-widest text-sm mb-6">03 / The Intuition</div>
                    <h1 className="text-4xl font-serif font-bold mb-6">Why Random Sampling Fails</h1>
                    <p className="text-white/70 leading-relaxed font-light mb-6">
                      If we just randomly sample 10% of the stream, we will repeatedly sample the "heavy hitters" (like Ed Sheeran) while completely missing the "long tail" of rare artists.
                    </p>
                    <p className="text-emerald-400 font-mono text-sm border border-emerald-500/30 bg-emerald-500/10 p-4 rounded-lg">
                      <span className="font-bold">Result:</span> Massive underestimation of <InlineMath math="d" />.
                    </p>
                  </div>
                  <div className="col-span-3">
                    <NaiveFailsChart />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* SLIDE 5: DATASET */}
          {current === 4 && (
            <motion.div key="dataset" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.5 }} className="w-full max-w-5xl pointer-events-auto">
              <div className="glass-card rounded-3xl p-16 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
                <div className="font-mono text-emerald-500 uppercase tracking-widest text-sm mb-8">04 / Experimental Data</div>
                <h1 className="text-4xl font-serif font-bold mb-10">The Spotify Dataset</h1>
                
                <div className="grid grid-cols-3 gap-6 font-mono">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-6 transition-all duration-300 hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:bg-emerald-500/10 cursor-default">
                    <div className="text-emerald-400 text-sm mb-2">Dataset</div>
                    <div className="text-xl font-bold">top_10000_1950-now.csv</div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-6 transition-all duration-300 hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:bg-emerald-500/10 cursor-default">
                    <div className="text-emerald-400 text-sm mb-2">Rows (<InlineMath math="m" />)</div>
                    <div className="text-3xl font-bold">10,000</div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-6 transition-all duration-300 hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:bg-emerald-500/10 cursor-default">
                    <div className="text-emerald-400 text-sm mb-2">Variables</div>
                    <div className="text-3xl font-bold">35</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* SLIDE 6: BORDERLESS R-STUDIO */}
          {current === 5 && (
            <motion.div key="rstudio" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="w-full h-full pt-24 pb-8 px-12 pointer-events-auto flex flex-col">
              <div className="font-mono text-emerald-500 uppercase tracking-widest text-sm mb-4 shrink-0">05 / Data Inspection</div>
              <DatasetInspector />
            </motion.div>
          )}

          {/* SLIDE 7: BJKST RECIPE */}
          {current === 6 && (
            <motion.div key="recipe" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.5 }} className="w-full max-w-5xl pointer-events-auto">
              <div className="glass-card rounded-3xl p-16 relative overflow-hidden border-transparent transition-all duration-300 hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
                <div className="font-mono text-emerald-500 uppercase tracking-widest text-sm mb-8">06 / The Solution</div>
                <h1 className="text-4xl font-serif font-bold mb-12">The BJKST Recipe</h1>
                
                <div className="space-y-6">
                  <div className="bg-black/40 border border-white/10 p-6 rounded-xl flex items-center gap-8 transition-all duration-300 hover:bg-black/60 hover:border-emerald-500/30">
                    <div className="text-4xl font-bold text-emerald-500 font-mono opacity-50">1</div>
                    <div className="text-2xl font-light">Assign "frozen luck" to every item via a hash function.</div>
                  </div>
                  <div className="bg-black/40 border border-white/10 p-6 rounded-xl flex items-center gap-8 transition-all duration-300 hover:bg-black/60 hover:border-emerald-500/30">
                    <div className="text-4xl font-bold text-emerald-500 font-mono opacity-50">2</div>
                    <div className="text-2xl font-light flex items-center gap-3">Keep only the "lucky" items where trailing zeros <InlineMath math="\ge z" />.</div>
                  </div>
                  <div className="bg-black/40 border border-white/10 p-6 rounded-xl flex items-center gap-8 transition-all duration-300 hover:bg-black/60 hover:border-emerald-500/30">
                    <div className="text-4xl font-bold text-emerald-500 font-mono opacity-50">3</div>
                    <div className="text-2xl font-light flex items-center gap-3">Estimate the total distinct count: <span className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded font-bold"><InlineMath math="\hat{d} = |B| \cdot 2^z" /></span></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* SLIDE 8: SECTION BREAK */}
          {current === 7 && (
            <motion.div 
              key="break-2" 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 1.05 }} 
              transition={{ duration: 0.8 }} 
              onClick={nextSlide}
              className="w-full h-full flex flex-col justify-center items-center pointer-events-auto cursor-pointer select-none text-center"
            >
              <h1 className="text-7xl md:text-9xl font-black font-serif tracking-tighter text-white drop-shadow-2xl mb-8">
                ACT 2: HASH FUNCTIONS & LUCK
              </h1>
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="bg-cyan-500/10 border border-cyan-500/30 px-8 py-4 rounded-full font-mono text-cyan-400 uppercase tracking-widest text-lg shadow-[0_0_20px_rgba(6,182,212,0.3)] mb-6 hover:bg-cyan-500/20 hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all cursor-default"
              >
                Speaker: Ashish
              </motion.div>
              <div className="text-cyan-400/50 font-mono text-xs tracking-widest uppercase animate-pulse">
                Click anywhere or press → to proceed
              </div>
            </motion.div>
          )}

          {/* SLIDE 9: THE FROZEN COIN */}
          {current === 8 && (
            <motion.div key="frozen-coin" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.5 }} className="w-full max-w-5xl pointer-events-auto">
              <div className="glass-card rounded-3xl p-16 relative overflow-hidden border-cyan-500/20 shadow-[0_0_50px_rgba(6,182,212,0.1)] transition-all duration-300 hover:border-cyan-500/50">
                <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500 shadow-[0_0_20px_#06b6d4]"></div>
                <div className="font-mono text-cyan-500 uppercase tracking-widest text-sm mb-8">09 / Theoretical Model</div>
                <h1 className="text-4xl font-serif font-bold mb-10">The Frozen Coin Problem</h1>
                
                <div className="grid grid-cols-2 gap-12">
                  <div className="bg-black/40 border border-white/5 p-8 rounded-xl shadow-inner transition-all duration-300 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                    <h2 className="text-2xl font-serif text-white mb-4">Standard Coin Flip</h2>
                    <p className="text-white/70 font-light mb-6">Flipping a coin multiple times yields independent, random results. A single user streaming multiple times would be counted as many distinct users.</p>
                    <div className="font-mono text-white/40 text-sm">Play 1: <span className="text-rose-400">Heads</span></div>
                    <div className="font-mono text-white/40 text-sm mt-2">Play 2: <span className="text-emerald-400">Tails</span></div>
                  </div>
                  <div className="bg-cyan-950/20 border border-cyan-500/20 p-8 rounded-xl shadow-inner relative overflow-hidden transition-all duration-300 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-cyan-500/10 blur-3xl rounded-full"></div>
                    <h2 className="text-2xl font-serif text-cyan-300 mb-4">Deterministic Hashing</h2>
                    <p className="text-white/80 font-light mb-6">A hash function <InlineMath math="h(x)" /> maps an item to a "frozen" random value. No matter how many times Ed Sheeran plays, he always hits the identical luck score.</p>
                    <div className="font-mono text-cyan-400 text-sm font-bold bg-cyan-900/40 p-3 rounded">Play 1..N: <InlineMath math="h(x) = \text{0110...00}" /> (Luck = 2)</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* SLIDE 10: 2-UNIVERSAL HASHING */}
          {current === 9 && (
            <motion.div key="universal" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.5 }} className="w-full max-w-5xl pointer-events-auto">
              <div className="glass-card rounded-3xl p-16 relative overflow-hidden border-cyan-500/20">
                <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500"></div>
                <div className="font-mono text-cyan-500 uppercase tracking-widest text-sm mb-8">10 / The Math</div>
                <h1 className="text-4xl font-serif font-bold mb-10">2-Universal Hashing</h1>
                
                <p className="text-xl text-white/80 font-light mb-12">
                  For our variance bounds to hold, we don't need full independence. Pairwise independence is sufficient and much cheaper to implement.
                </p>

                <div className="bg-black/60 border border-white/5 rounded-2xl p-12 text-center text-3xl shadow-inner mb-8 transition-all hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                  <BlockMath math="\mathbb{P}(h(x) = y \land h(x') = y') = \frac{1}{|Y|^2}" />
                </div>
                
                <p className="text-center text-cyan-400 font-mono text-sm uppercase tracking-widest">Definition of Pairwise Independence</p>
              </div>
            </motion.div>
          )}

          {/* SLIDE 11: THE CONCRETE FAMILY */}
          {current === 10 && (
            <motion.div key="concrete" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.5 }} className="w-full max-w-5xl pointer-events-auto">
              <div className="glass-card rounded-3xl p-16 relative overflow-hidden border-cyan-500/20">
                <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500"></div>
                <div className="font-mono text-cyan-500 uppercase tracking-widest text-sm mb-8">11 / Implementation</div>
                <h1 className="text-4xl font-serif font-bold mb-10">The Concrete Family</h1>
                
                <div className="flex flex-col items-center justify-center space-y-12">
                  <div className="bg-cyan-950/30 border-l-4 border-cyan-500 p-8 rounded-r-xl w-full text-2xl font-mono text-center">
                    <BlockMath math="h(x) = (ax + b) \pmod p" />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-6 w-full font-mono text-sm">
                    <div className="bg-white/5 p-6 rounded-lg text-center border border-white/10 hover:border-cyan-500/50 transition-colors">
                      <div className="text-cyan-400 mb-2">Prime Field <InlineMath math="p" /></div>
                      <div className="text-xl font-bold"><InlineMath math="2^{61} - 1" /></div>
                    </div>
                    <div className="bg-white/5 p-6 rounded-lg text-center border border-white/10 hover:border-cyan-500/50 transition-colors">
                      <div className="text-cyan-400 mb-2">Random <InlineMath math="a" /></div>
                      <div className="text-xl font-bold"><InlineMath math="a \in \{1, \dots, p-1\}" /></div>
                    </div>
                    <div className="bg-white/5 p-6 rounded-lg text-center border border-white/10 hover:border-cyan-500/50 transition-colors">
                      <div className="text-cyan-400 mb-2">Random <InlineMath math="b" /></div>
                      <div className="text-xl font-bold"><InlineMath math="b \in \{0, \dots, p-1\}" /></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* SLIDE 12: PIPELINE SIMULATION */}
          {current === 11 && (
            <motion.div key="pipeline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }} className="w-full h-full pointer-events-auto">
              <PipelineSimulation onComplete={() => setCurrent(p => Math.min(p + 1, slides.length - 1))} />
            </motion.div>
          )}

          {/* SLIDE 13: THE LUCK LADDER */}
          {current === 12 && (
            <motion.div key="luck-ladder" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.5 }} className="w-full max-w-5xl pointer-events-auto">
              <div className="glass-card rounded-3xl p-12 relative overflow-hidden border-cyan-500/20">
                <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500"></div>
                <div className="font-mono text-cyan-500 uppercase tracking-widest text-sm mb-6">13 / Ground Truth vs Hash</div>
                <h1 className="text-4xl font-serif font-bold mb-8">The Luck Ladder</h1>
                
                <div className="w-full overflow-hidden rounded-xl border border-white/10 bg-black/40">
                  <table className="w-full text-left font-mono text-sm">
                    <thead className="bg-white/5 text-cyan-400">
                      <tr>
                        <th className="p-4 border-b border-white/10">Level <InlineMath math="r" /></th>
                        <th className="p-4 border-b border-white/10">Expected <InlineMath math="d/2^r" /></th>
                        <th className="p-4 border-b border-white/10">Observed <InlineMath math="Y_r" /></th>
                        <th className="p-4 border-b border-white/10 text-right">Variance / Error</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {[
                        { r: 0, exp: 3813 / Math.pow(2, 0), obs: 3813, err: '0.0%' },
                        { r: 2, exp: 3813 / Math.pow(2, 2), obs: 971, err: '+1.9%' },
                        { r: 5, exp: 3813 / Math.pow(2, 5), obs: 110, err: '-7.7%' },
                        { r: 8, exp: 3813 / Math.pow(2, 8), obs: 15, err: '+0.7%' },
                        { r: 12, exp: 3813 / Math.pow(2, 12), obs: 1, err: '+7.4%' },
                        { r: 16, exp: 3813 / Math.pow(2, 16), obs: 0, err: '-100.0%' },
                        { r: 20, exp: 3813 / Math.pow(2, 20), obs: 0, err: '-100.0%' },
                      ].map((row) => (
                        <tr key={row.r} className="hover:bg-cyan-900/20 transition-colors">
                          <td className="p-4 font-bold text-white"><InlineMath math={`r=${row.r}`} /></td>
                          <td className="p-4 text-white/60">{row.exp.toFixed(6)}</td>
                          <td className="p-4 text-cyan-300 font-bold">{row.obs}</td>
                          <td className="p-4 text-right text-white/40">{row.err}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* SLIDE 14: PAIRWISE INDEPENDENCE IN ACTION */}
          {current === 13 && (
            <motion.div key="pairwise" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.5 }} className="w-full max-w-5xl pointer-events-auto">
              <div className="glass-card rounded-3xl p-16 relative overflow-hidden border-cyan-500/20">
                <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500"></div>
                <div className="font-mono text-cyan-500 uppercase tracking-widest text-sm mb-8">14 / Variance Bound</div>
                <h1 className="text-4xl font-serif font-bold mb-10">Pairwise Independence in Action</h1>
                
                <div className="bg-black/40 border border-white/5 p-8 rounded-xl shadow-inner space-y-6 text-xl transition-all duration-300 hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                  <BlockMath math="Y_r = \sum_{a \in \text{distinct elements}} I_a" />
                  <p className="text-center text-white/60 font-light text-base mt-2 mb-6">where <InlineMath math="I_a" /> is the indicator that item <InlineMath math="a" /> survives level <InlineMath math="r" />.</p>
                  
                  <BlockMath math="\mathrm{Var}(Y_r) = \sum_{a} \mathrm{Var}(I_a) + \sum_{a \neq b} \mathrm{Cov}(I_a, I_b)" />
                  <p className="text-center text-cyan-400 font-bold text-sm mt-4 mb-4">By Pairwise Independence, <InlineMath math="\mathrm{Cov}(I_a, I_b) = 0" /></p>
                  
                  <div className="bg-cyan-950/30 p-6 rounded-lg border border-cyan-500/30 mt-8">
                    <BlockMath math="\mathrm{Var}(Y_r) \le \frac{d}{2^r}" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* SLIDE 15: SECTION BREAK ACT 3 */}
          {current === 14 && (
            <motion.div 
              key="break-3" 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 1.05 }} 
              transition={{ duration: 0.8 }} 
              onClick={nextSlide}
              className="w-full h-full flex flex-col justify-center items-center pointer-events-auto cursor-pointer select-none"
            >
              <h1 className="text-7xl md:text-9xl font-black font-serif tracking-tighter text-white drop-shadow-2xl mb-8">
                ACT 3: MARKOV, CHEBYSHEV & THE PROOF
              </h1>
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="bg-rose-500/10 border border-rose-500/30 px-8 py-4 rounded-full font-mono text-rose-400 uppercase tracking-widest text-lg shadow-[0_0_20px_rgba(244,63,94,0.3)] mb-6 hover:bg-rose-500/20 hover:shadow-[0_0_30px_rgba(244,63,94,0.6)] transition-all cursor-default"
              >
                Speaker: Sagnik Das
              </motion.div>
              <div className="text-rose-400/50 font-mono text-xs tracking-widest uppercase animate-pulse">
                Click anywhere or press → to proceed
              </div>
            </motion.div>
          )}

          {/* SLIDE 16 (User's 17): THE BUDGET INTUITION */}
          {current === 15 && (
            <motion.div key="budget" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.5 }} className="w-full max-w-5xl pointer-events-auto">
              <div className="glass-card rounded-3xl p-16 relative overflow-hidden border-rose-500/20 shadow-[0_0_50px_rgba(244,63,94,0.1)]">
                <div className="absolute top-0 left-0 w-full h-1 bg-rose-500 shadow-[0_0_20px_#f43f5e]"></div>
                <div className="font-mono text-rose-500 uppercase tracking-widest text-sm mb-8">17 / Conceptual Setup</div>
                <h1 className="text-4xl font-serif font-bold mb-10">The Budget Intuition</h1>
                
                <p className="text-xl text-white/80 font-light mb-12">
                  Imagine 10 people sharing a pool of exactly <strong className="text-rose-400">100 Rupees</strong>. Can 3 of them hold 35 Rupees each?
                </p>

                <div className="flex gap-4 justify-center items-end h-40 mb-12">
                  {[1,2,3,4,5,6,7,8,9,10].map((person, i) => (
                    <div key={i} className="flex flex-col items-center gap-4">
                      {i < 2 ? (
                        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.2 }} className="text-rose-400 font-bold font-mono">₹35</motion.div>
                      ) : (
                        <div className="h-6"></div>
                      )}
                      <div className={`w-16 rounded-t-xl transition-all duration-500 ${i < 2 ? 'bg-rose-500/40 border border-rose-500 h-24 shadow-[0_0_20px_rgba(244,63,94,0.3)]' : 'bg-black/60 border border-white/10 h-12'}`}>
                      </div>
                      <div className="text-white/40 font-mono text-xs">P{person}</div>
                    </div>
                  ))}
                </div>
                
                <div className="bg-rose-950/20 border border-rose-500/30 p-6 rounded-xl text-center text-rose-300 font-light text-lg">
                  <span className="font-bold text-rose-500">No.</span> <InlineMath math="3 \times 35 = 105 > 100" />. At most <strong className="text-white">two</strong> people can hold ₹35. This is the essence of Markov's Inequality.
                </div>
              </div>
            </motion.div>
          )}

          {/* SLIDE 17 (User's 18): FORMAL STATEMENT & PROOF */}
          {current === 16 && (
            <motion.div key="markov-proof" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.5 }} className="w-full max-w-5xl pointer-events-auto">
              <div className="glass-card rounded-3xl p-16 relative overflow-hidden border-rose-500/20">
                <div className="absolute top-0 left-0 w-full h-1 bg-rose-500"></div>
                <div className="font-mono text-rose-500 uppercase tracking-widest text-sm mb-8">18 / The Mathematics</div>
                <h1 className="text-4xl font-serif font-bold mb-10">Formal Statement & Proof</h1>
                
                <div className="bg-black/60 border border-white/5 rounded-2xl p-10 text-center text-3xl shadow-inner mb-8 transition-all hover:border-rose-500/50 hover:shadow-[0_0_30px_rgba(244,63,94,0.2)]">
                  <BlockMath math="\mathbb{P}(X \ge t) \le \frac{\mathbb{E}[X]}{t}" />
                </div>
                
                <div className="space-y-6 text-xl text-white/70 font-light pl-6 border-l-2 border-rose-500/30">
                  <BlockMath math="\mathbb{E}[X] = \mathbb{E}[X \mid X \ge t]\mathbb{P}(X \ge t) + \mathbb{E}[X \mid X < t]\mathbb{P}(X < t)" />
                  <div className="text-center text-rose-400 font-bold text-sm my-4">Since <InlineMath math="X \ge 0" />, we can drop the second term:</div>
                  <BlockMath math="\mathbb{E}[X] \ge \mathbb{E}[X \mid X \ge t]\mathbb{P}(X \ge t)" />
                  <div className="text-center text-rose-400 font-bold text-sm my-4">And since <InlineMath math="\mathbb{E}[X \mid X \ge t] \ge t" />:</div>
                  <BlockMath math="\mathbb{E}[X] \ge t \cdot \mathbb{P}(X \ge t)" />
                </div>
              </div>
            </motion.div>
          )}

          {/* SLIDE 18 (User's 19): EMPIRICAL INEQUALITY WORKBENCH */}
          {current === 17 && (
            <motion.div key="workbench" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }} className="w-full h-full pointer-events-auto">
              <MarkovInteractive />
            </motion.div>
          )}

          {/* SLIDE 19 (User's 20): CHEBYSHEV INEQUALITY */}
          {current === 18 && (
            <motion.div key="chebyshev" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.5 }} className="w-full max-w-5xl pointer-events-auto">
              <div className="glass-card rounded-3xl p-16 relative overflow-hidden border-rose-500/20">
                <div className="absolute top-0 left-0 w-full h-1 bg-rose-500"></div>
                <div className="font-mono text-rose-500 uppercase tracking-widest text-sm mb-8">20 / The Next Step</div>
                <h1 className="text-4xl font-serif font-bold mb-10">Chebyshev's Inequality</h1>
                
                <p className="text-xl text-white/80 font-light mb-8">
                  Markov gives bounds based on the mean, but Chebyshev uses variance to bound deviations from the mean. We prove it by applying Markov to the squared deviation.
                </p>

                <div className="bg-black/40 border border-white/5 p-8 rounded-xl shadow-inner space-y-8 text-xl">
                  <BlockMath math="\mathbb{P}(|X - \mu| \ge k\sigma) = \mathbb{P}((X - \mu)^2 \ge k^2\sigma^2)" />
                  <div className="text-center text-rose-400 font-bold text-sm">Apply Markov's Inequality where <InlineMath math="t = k^2\sigma^2" />:</div>
                  <BlockMath math="\le \frac{\mathbb{E}[(X - \mu)^2]}{k^2\sigma^2} = \frac{\sigma^2}{k^2\sigma^2} = \frac{1}{k^2}" />
                  
                  <div className="bg-rose-950/30 p-6 rounded-lg border border-rose-500/30 mt-8 text-center text-3xl">
                    <BlockMath math="\mathbb{P}(|X - \mu| \ge \varepsilon) \le \frac{\text{Var}(X)}{\varepsilon^2}" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* SLIDE 20 (User's 21): THE TIDEMARK ESTIMATOR */}
          {current === 19 && (
            <motion.div key="tidemark" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.5 }} className="w-full max-w-5xl pointer-events-auto">
              <div className="glass-card rounded-3xl p-14 relative overflow-hidden border-rose-500/20 transition-all duration-300 hover:border-rose-500/50 hover:shadow-[0_0_30px_rgba(244,63,94,0.3)] cursor-default">
                <div className="absolute top-0 left-0 w-full h-1 bg-rose-500"></div>
                <div className="font-mono text-rose-500 uppercase tracking-widest text-sm mb-6">21 / Application</div>
                <h1 className="text-4xl font-serif font-bold mb-6">The Tidemark Estimator</h1>
                
                {/* Horizontal scale with plenty of vertical margin to avoid overlap */}
                <div className="w-full flex justify-between items-center my-24 px-8 relative">
                  <div className="absolute top-1/2 left-8 right-8 h-0.5 bg-white/10 -z-10"></div>
                  
                  {[1, 2, 3, 4, 5, 6, 7].map(level => (
                    <div key={level} className="flex flex-col items-center relative">
                      {/* Top Annotation: Chebyshev */}
                      {level === 2 && (
                        <div className="absolute bottom-full mb-3 text-rose-400 font-mono text-xs whitespace-nowrap flex flex-col items-center">
                          <span className="bg-rose-950/90 border border-rose-500/40 px-2.5 py-1 rounded-md text-[11px] shadow-lg text-rose-200">
                            Chebyshev bounds MIN
                          </span>
                          <div className="w-px h-6 bg-gradient-to-b from-rose-400 to-rose-400/30"></div>
                          <div className="text-rose-400 text-xs -mt-1 leading-none">▿</div>
                        </div>
                      )}

                      {/* Bottom Annotation: Markov */}
                      {level === 6 && (
                        <div className="absolute top-full mt-3 text-rose-400 font-mono text-xs whitespace-nowrap flex flex-col items-center">
                          <div className="text-rose-400 text-xs -mb-1 leading-none">▵</div>
                          <div className="w-px h-6 bg-gradient-to-t from-rose-400 to-rose-400/30"></div>
                          <span className="bg-rose-950/90 border border-rose-500/40 px-2.5 py-1 rounded-md text-[11px] shadow-lg text-rose-200">
                            Markov bounds MAX
                          </span>
                        </div>
                      )}

                      <div className={`w-12 h-16 rounded-lg flex items-center justify-center font-bold font-mono transition-all duration-500 ${
                        level === 4
                          ? 'bg-white text-black scale-125 shadow-[0_0_30px_rgba(255,255,255,0.3)]'
                          : level === 2 || level === 6
                          ? 'bg-rose-500/20 border-2 border-rose-500 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                          : 'bg-black border border-white/20 text-white/40'
                      }`}>
                        {level}
                      </div>

                      {/* Middle Target Label */}
                      {level === 4 && (
                        <div className="absolute top-full mt-3 font-mono text-xs text-white/60 bg-white/10 px-2 py-0.5 rounded">
                          <InlineMath math="\approx \log_2 d" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <p className="text-center text-white/70 font-light text-base mt-6">
                  We trap the true distinct count <InlineMath math="d" /> in a narrow band. We use <strong className="text-rose-400 font-semibold">Chebyshev</strong> to prove the bucket array isn't too empty, and <strong className="text-rose-400 font-semibold">Markov</strong> to prove it isn't too full.
                </p>
              </div>
            </motion.div>
          )}

          {/* SLIDE 21 (User's 22): THE BJKST PROOF CENTERPIECE */}
          {current === 20 && (
            <motion.div key="bjkst-proof" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.5 }} className="w-full max-w-5xl pointer-events-auto">
              <div className="glass-card rounded-3xl p-16 relative overflow-hidden border-rose-500/20 transition-all duration-300 hover:border-rose-500/50 hover:shadow-[0_0_30px_rgba(244,63,94,0.3)] cursor-default">
                <div className="absolute top-0 left-0 w-full h-1 bg-rose-500"></div>
                <div className="font-mono text-rose-500 uppercase tracking-widest text-sm mb-8">22 / Critical Split</div>
                <h1 className="text-4xl font-serif font-bold mb-10">The Proof Centerpiece</h1>
                
                <p className="text-xl text-white/80 font-light mb-8">
                  Let <InlineMath math="s" /> be the critical level where the expected number of items is just right:
                </p>

                <div className="bg-black/60 border border-white/5 rounded-2xl p-10 text-center text-3xl shadow-inner mb-12">
                  <BlockMath math="\frac{12}{\varepsilon^2} \le \frac{d}{2^s} < \frac{24}{\varepsilon^2}" />
                </div>
                
                <div className="grid grid-cols-2 gap-8">
                  <div className="bg-rose-950/20 border-l-4 border-rose-500 p-6 rounded-r-xl transition-all duration-300 hover:bg-rose-950/40 hover:shadow-[0_0_20px_rgba(244,63,94,0.2)]">
                    <h3 className="text-rose-300 font-bold mb-2">Failure Type 1: Too Empty</h3>
                    <p className="text-white/60 text-sm font-light"><InlineMath math="Y_s" /> deviates too far below its expectation <InlineMath math="d/2^s" />.</p>
                  </div>
                  <div className="bg-rose-950/20 border-l-4 border-rose-500 p-6 rounded-r-xl transition-all duration-300 hover:bg-rose-950/40 hover:shadow-[0_0_20px_rgba(244,63,94,0.2)]">
                    <h3 className="text-rose-300 font-bold mb-2">Failure Type 2: Too Full</h3>
                    <p className="text-white/60 text-sm font-light"><InlineMath math="Y_{s+1}" /> exceeds its capacity (the algorithm runs out of space).</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* SLIDE 22 (User's 23): DUAL BOUNDING */}
          {current === 21 && (
            <motion.div key="dual-bounding" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.5 }} className="w-full max-w-5xl pointer-events-auto">
              <div className="glass-card rounded-3xl p-16 relative overflow-hidden border-rose-500/20 transition-all duration-300 hover:border-rose-500/50 hover:shadow-[0_0_30px_rgba(244,63,94,0.3)] cursor-default">
                <div className="absolute top-0 left-0 w-full h-1 bg-rose-500"></div>
                <div className="font-mono text-rose-500 uppercase tracking-widest text-sm mb-8">23 / Simultaneous Guarantees</div>
                <h1 className="text-4xl font-serif font-bold mb-10">Dual Bounding</h1>
                
                <div className="grid grid-cols-2 gap-8">
                  <div className="bg-black/40 border border-rose-500/30 p-8 rounded-2xl shadow-[0_0_30px_rgba(244,63,94,0.1)] relative transition-all duration-300 hover:bg-black/60 hover:shadow-[0_0_40px_rgba(244,63,94,0.3)]">
                    <div className="absolute -top-3 left-8 bg-[#05070B] px-4 text-rose-400 font-mono text-sm font-bold tracking-widest">CHEBYSHEV</div>
                    <div className="mt-4 text-xl">
                      <BlockMath math="\mathbb{P}(|Y_s - \mathbb{E}[Y_s]| \ge \frac{\varepsilon}{2}\mathbb{E}[Y_s])" />
                      <div className="text-center text-white/40 text-sm my-4">is bounded by</div>
                      <BlockMath math="\le \frac{\text{Var}(Y_s)}{(\varepsilon/2)^2 (\mathbb{E}[Y_s])^2}" />
                      <div className="text-center text-rose-300 font-bold text-2xl mt-6"><InlineMath math="\le \frac{1}{12}" /></div>
                    </div>
                  </div>
                  <div className="bg-black/40 border border-rose-500/30 p-8 rounded-2xl shadow-[0_0_30px_rgba(244,63,94,0.1)] relative transition-all duration-300 hover:bg-black/60 hover:shadow-[0_0_40px_rgba(244,63,94,0.3)]">
                    <div className="absolute -top-3 left-8 bg-[#05070B] px-4 text-rose-400 font-mono text-sm font-bold tracking-widest">MARKOV</div>
                    <div className="mt-4 text-xl">
                      <BlockMath math="\mathbb{P}(Y_{s+1} \ge \text{Capacity})" />
                      <div className="text-center text-white/40 text-sm my-4">using Capacity = <InlineMath math="O(1/\varepsilon^2)" /></div>
                      <BlockMath math="\le \frac{\mathbb{E}[Y_{s+1}]}{\text{Capacity}}" />
                      <div className="text-center text-rose-300 font-bold text-2xl mt-6"><InlineMath math="\le \frac{1}{12}" /></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* SLIDE 23 (User's 24): TOTAL ERROR GUARANTEE */}
          {current === 22 && (
            <motion.div key="total-error" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.6 }} className="w-full max-w-5xl pointer-events-auto">
              <div className="glass-card rounded-3xl p-20 relative overflow-hidden border-rose-500/40 shadow-[0_0_80px_rgba(244,63,94,0.2)] text-center transition-all duration-300 hover:border-rose-500/60 hover:shadow-[0_0_100px_rgba(244,63,94,0.4)] cursor-default">
                <div className="absolute top-0 left-0 w-full h-1 bg-rose-500"></div>
                <div className="font-mono text-rose-500 uppercase tracking-widest text-sm mb-6">24 / Union Bound</div>
                <h1 className="text-5xl font-serif font-bold mb-12">Total Error Guarantee</h1>
                
                <p className="text-2xl text-white/80 font-light mb-12">
                  By the Union Bound, the probability of <strong className="text-rose-400">any</strong> failure occurring is at most the sum of the individual failure probabilities:
                </p>

                <div className="inline-block bg-rose-950/40 border border-rose-500 p-12 rounded-2xl shadow-[0_0_50px_rgba(244,63,94,0.3)] transition-all duration-300 hover:scale-105 hover:bg-rose-950/60">
                  <div className="text-4xl mb-6">
                    <BlockMath math="\mathbb{P}(\text{FAIL}) \le \frac{1}{12} + \frac{1}{12}" />
                  </div>
                  <div className="text-6xl text-rose-400 font-bold mt-8">
                    <BlockMath math="\mathbb{P}(\text{FAIL}) \le \frac{1}{6}" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* SLIDE 24 (User's 25): SECTION BREAK ACT 4 */}
          {current === 23 && (
            <motion.div 
              key="break-4" 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 1.05 }} 
              transition={{ duration: 0.8 }} 
              onClick={nextSlide}
              className="w-full h-full flex flex-col justify-center items-center pointer-events-auto cursor-pointer select-none"
            >
              <h1 className="text-7xl md:text-9xl font-black font-serif tracking-tighter text-white drop-shadow-2xl mb-8 text-center px-12">
                ACT 4: SYNTHESIS, REAL RUNS & CLOSER
              </h1>
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="bg-amber-500/10 border border-amber-500/30 px-8 py-4 rounded-full font-mono text-amber-400 uppercase tracking-widest text-lg shadow-[0_0_20px_rgba(245,158,11,0.3)] mb-6 hover:bg-amber-500/20 hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] transition-all cursor-default"
              >
                Speaker: Pritham
              </motion.div>
              <div className="text-amber-400/50 font-mono text-xs tracking-widest uppercase animate-pulse">
                Click anywhere or press → to proceed
              </div>
            </motion.div>
          )}

          {/* ── SLIDE 25: SECTION BREAK ACT 4 (already rendered at current===23) ─────────── */}

          {/* ── SLIDE 26: THE COMPLETE BJKST MACHINE ─────────────────────────────────────── */}
          {current === 24 && (
            <motion.div key="bjkst-machine" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.5 }} className="w-full max-w-5xl pointer-events-auto">
              <div className="glass-card rounded-3xl p-14 relative overflow-hidden border-amber-500/20 shadow-[0_0_50px_rgba(245,158,11,0.08)]">
                <div className="absolute top-0 left-0 w-full h-1 bg-amber-500 shadow-[0_0_20px_#f59e0b]"></div>
                <div className="font-mono text-amber-500 uppercase tracking-widest text-sm mb-8">26 / Full Architecture</div>
                <h1 className="text-4xl font-serif font-bold mb-10">The Complete BJKST Machine</h1>

                {/* Pipeline diagram */}
                <div className="flex items-center justify-between gap-2 mb-12 overflow-x-auto py-4">
                  {[
                    { label: 'Stream', sub: 'x₁, x₂, …', icon: '⟶', color: 'border-white/20 text-white' },
                    { label: 'Hash h(x)', sub: '(ax+b) mod p', icon: '⟶', color: 'border-amber-500/50 text-amber-300' },
                    { label: 'Trailing Zeros', sub: 'tz(h(x)) ≥ z?', icon: '⟶', color: 'border-amber-500/50 text-amber-300' },
                    { label: 'Bucket B', sub: `cap = 2,304`, icon: '⟶', color: 'border-amber-500/80 text-amber-200' },
                    { label: 'Output d̂', sub: '|B|·2ᶻ', icon: '', color: 'border-amber-500 text-amber-100 bg-amber-500/10' },
                  ].map((step, i) => (
                    <div key={i} className="flex items-center gap-2 flex-shrink-0">
                      <div className={`border rounded-2xl px-5 py-4 text-center ${step.color}`}>
                        <div className="font-bold text-base">{step.label}</div>
                        <div className="text-xs opacity-60 font-mono mt-1">{step.sub}</div>
                      </div>
                      {step.icon && <span className="text-2xl text-white/30">{step.icon}</span>}
                    </div>
                  ))}
                </div>

                {/* Proof settings */}
                <div className="grid grid-cols-3 gap-6">
                  <div className="bg-black/40 border border-white/5 p-6 rounded-2xl text-center">
                    <div className="text-xs font-mono text-white/30 uppercase tracking-widest mb-2">Accuracy Parameter</div>
                    <div className="text-3xl font-bold text-amber-400"><InlineMath math="\varepsilon = 0.5" /></div>
                  </div>
                  <div className="bg-black/40 border border-white/5 p-6 rounded-2xl text-center">
                    <div className="text-xs font-mono text-white/30 uppercase tracking-widest mb-2">Constant c</div>
                    <div className="text-3xl font-bold text-amber-400"><InlineMath math="c = 576" /></div>
                  </div>
                  <div className="bg-black/40 border border-white/5 p-6 rounded-2xl text-center">
                    <div className="text-xs font-mono text-white/30 uppercase tracking-widest mb-2">Bucket Capacity</div>
                    <div className="text-3xl font-bold text-amber-400"><InlineMath math="\frac{c}{\varepsilon^2} = 2{,}304" /></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── SLIDE 27: TOKEN STREAM SIMULATOR ─────────────────────────────────────────── */}
          {current === 25 && (
            <motion.div key="token-sim" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.5 }} className="w-full max-w-5xl pointer-events-auto">
              <TokenSimulator />
            </motion.div>
          )}

          {/* ── SLIDE 28: PYTHON TERMINAL ─────────────────────────────────────────────────── */}
          {current === 26 && (
            <motion.div key="python-term" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }} className="w-full h-full pointer-events-auto">
              <PythonTerminal />
            </motion.div>
          )}

          {/* ── SLIDE 29: MONTE CARLO HISTOGRAM ──────────────────────────────────────────── */}
          {current === 27 && (
            <motion.div key="monte-carlo" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.5 }} className="w-full max-w-5xl pointer-events-auto">
              <MonteCarloHistogram />
            </motion.div>
          )}

          {/* ── SLIDE 30: MEDIAN TRICK ─────────────────────────────────────────────────────  */}
          {current === 28 && (
            <motion.div key="median-trick" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.5 }} className="w-full max-w-5xl pointer-events-auto">
              <div className="transition-all duration-300 hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] rounded-3xl">
                <MedianTrick />
              </div>
            </motion.div>
          )}

          {/* ── SLIDE 31: MULTI-STREAM ─────────────────────────────────────────────────────  */}
          {current === 29 && (
            <motion.div key="multi-stream" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.5 }} className="w-full max-w-5xl pointer-events-auto">
              <MultiStream />
            </motion.div>
          )}

          {/* ── SLIDE 32: MEMORY vs ACCURACY ─────────────────────────────────────────────── */}
          {current === 30 && (
            <motion.div key="mem-accuracy" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.5 }} className="w-full max-w-5xl pointer-events-auto">
              <div className="glass-card rounded-3xl p-14 relative overflow-hidden border-amber-500/20 transition-all duration-500 hover:border-amber-500/70 hover:shadow-[0_0_60px_rgba(245,158,11,0.6)] cursor-default">
                <div className="absolute top-0 left-0 w-full h-1 bg-amber-500"></div>
                <div className="font-mono text-amber-500 uppercase tracking-widest text-sm mb-8">32 / Tradeoff Analysis</div>
                <h1 className="text-4xl font-serif font-bold mb-4">Memory vs. Accuracy: <InlineMath math="1/\varepsilon^2" /> Scaling</h1>
                <p className="text-white/60 font-light mb-10">Halving the error requires <strong className="text-amber-400">quadrupling</strong> the bucket capacity.</p>

                <div className="overflow-hidden rounded-2xl border border-white/10 transition-all duration-300 hover:border-amber-500/40 hover:shadow-[0_0_30px_rgba(245,158,11,0.3)]">
                  <table className="w-full font-mono text-sm">
                    <thead className="bg-amber-950/30 text-amber-300">
                      <tr>
                        <th className="p-4 text-left border-b border-white/10"><InlineMath math="\varepsilon" /> (Max Error)</th>
                        <th className="p-4 text-left border-b border-white/10">Capacity <InlineMath math="c/\varepsilon^2" /></th>
                        <th className="p-4 text-left border-b border-white/10">Memory (integers)</th>
                        <th className="p-4 text-right border-b border-white/10">Ratio</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {[
                        { eps: '1.00', cap: '576', mem: '576', ratio: '1×' },
                        { eps: '0.50', cap: '2,304', mem: '2,304', ratio: '4×' },
                        { eps: '0.25', cap: '9,216', mem: '9,216', ratio: '16×' },
                        { eps: '0.10', cap: '57,600', mem: '57,600', ratio: '100×' },
                        { eps: '0.01', cap: '5,760,000', mem: '5.76M', ratio: '10,000×' },
                      ].map((row, i) => (
                        <tr key={i} className={`hover:bg-amber-900/10 transition-colors ${i === 1 ? 'bg-amber-950/20 text-amber-200' : 'text-white/70'}`}>
                          <td className="p-4 font-bold">{row.eps}</td>
                          <td className="p-4">{row.cap}</td>
                          <td className="p-4">{row.mem}</td>
                          <td className="p-4 text-right text-amber-400">{row.ratio}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-6 text-center">
                  <BlockMath math="\text{Capacity} = \frac{c}{\varepsilon^2} \quad \Rightarrow \quad \text{Halving } \varepsilon \text{ costs } 4\times \text{ memory}" />
                </div>
              </div>
            </motion.div>
          )}

          {/* ── SLIDE 33: CONCLUSIONS ─────────────────────────────────────────────────────── */}
          {current === 31 && (
            <motion.div key="conclusions" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.5 }} className="w-full max-w-5xl pointer-events-auto">
              <div className="glass-card rounded-3xl p-14 relative overflow-hidden border-amber-500/20">
                <div className="absolute top-0 left-0 w-full h-1 bg-amber-500"></div>
                <div className="font-mono text-amber-500 uppercase tracking-widest text-sm mb-8">33 / Conclusions</div>
                <h1 className="text-4xl font-serif font-bold mb-10">Key Takeaways</h1>

                <div className="space-y-6">
                  {[
                    { n: '01', title: 'The One-Line Proof', body: 'BJKST works because Markov + Chebyshev bound failure at each level below 1/12. Union bound gives total failure ≤ 1/6.', math: '\\mathbb{P}(\\text{FAIL}) \\le \\tfrac{1}{12} + \\tfrac{1}{12} = \\tfrac{1}{6}' },
                    { n: '02', title: 'The Memory Cost', body: 'Exact counting needs O(n) memory. BJKST achieves ε-approximation in O(1/ε²) — independent of the stream length.', math: 'O(1/\\varepsilon^2) \\ll O(n)' },
                    { n: '03', title: 'Two Tuning Dials', body: 'ε controls accuracy (smaller = more memory). δ controls failure probability (smaller = more parallel copies via median trick).', math: '\\varepsilon \\text{ (accuracy)} \\quad \\delta \\text{ (confidence)}' },
                    { n: '04', title: 'Honest Dataset Limits', body: 'Our dataset is finite (10,000 songs) and static. A true streaming setting processes an infinite, one-pass sequence.', math: null },
                  ].map((item, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1, duration: 0.4 }}
                      className="flex gap-6 items-start p-6 bg-black/30 border border-white/5 rounded-2xl hover:border-amber-500/20 transition-colors">
                      <span className="text-amber-500/60 font-mono text-xs w-8 flex-shrink-0 mt-1">{item.n}</span>
                      <div className="flex-1">
                        <div className="text-white font-bold mb-1">{item.title}</div>
                        <div className="text-white/50 text-sm font-light mb-2">{item.body}</div>
                        {item.math && <div className="text-sm"><InlineMath math={item.math} /></div>}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── SLIDE 34: THANK YOU / Q&A ─────────────────────────────────────────────────── */}
          {current === 32 && (
            <motion.div key="thankyou" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.8 }} className="w-full h-full flex flex-col justify-center items-center pointer-events-auto">
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.7 }}
                className="text-[clamp(6rem,18vw,14rem)] font-black font-serif tracking-tighter text-white drop-shadow-2xl mb-8 leading-none"
              >
                Q&A
              </motion.h1>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.5 }}
                className="flex gap-6 mb-10 flex-wrap justify-center">
                {['Arkaroy · bsdbg2501', 'Ashish · bsdbg2502', 'Sagnik Das · bsdbg2516', 'Pritham Prajwin V · bsdbg2512'].map((name, i) => (
                  <div key={i} className="px-6 py-3 rounded-full border border-amber-500/30 font-mono text-amber-300 text-sm bg-amber-500/5">
                    {name}
                  </div>
                ))}
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0, duration: 0.5 }}
                className="text-center">
                <div className="text-white/30 font-mono text-sm uppercase tracking-widest">Probability II · BSDS 2026</div>
                <div className="text-white/20 font-light text-base mt-2">Counting Distinct Elements in a Data Stream using the BJKST Algorithm</div>
              </motion.div>
            </motion.div>
          )}

        </AnimatePresence>

        {/* Floating Side Nav Controls */}
        {current > 0 && (
          <button
            onClick={prevSlide}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 hover:bg-black/80 border border-white/10 hover:border-white/30 flex items-center justify-center text-white/50 hover:text-white backdrop-blur-xl pointer-events-auto transition-all duration-300 hover:scale-110 z-40 group cursor-pointer shadow-lg"
            title="Previous Slide (← / ↑ / Backspace)"
            aria-label="Previous slide"
          >
            <span className="text-2xl font-mono leading-none group-hover:-translate-x-0.5 transition-transform">‹</span>
          </button>
        )}
        {current < slides.length - 1 && (
          <button
            onClick={nextSlide}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 hover:bg-black/80 border border-white/10 hover:border-white/30 flex items-center justify-center text-white/50 hover:text-white backdrop-blur-xl pointer-events-auto transition-all duration-300 hover:scale-110 z-40 group cursor-pointer shadow-lg"
            title="Next Slide (→ / ↓ / Space / Enter)"
            aria-label="Next slide"
          >
            <span className="text-2xl font-mono leading-none group-hover:translate-x-0.5 transition-transform">›</span>
          </button>
        )}

        {/* Global Footer Navigation */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 pointer-events-auto bg-black/70 px-4 py-2 rounded-full backdrop-blur-2xl border border-white/10 shadow-2xl z-50">
          <button
            onClick={prevSlide}
            disabled={current === 0}
            className="w-7 h-7 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 disabled:opacity-20 transition-all cursor-pointer select-none text-base font-mono"
            title="Previous Slide"
          >
            ‹
          </button>

          <div className="flex gap-1.5 px-2 items-center">
            {slides.map((s, i) => {
              const isActive = current === i;
              const isBreak = s.type === 'section-break';
              let activeColorClass = 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]';
              if (actColor === 'cyan') activeColorClass = 'bg-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.5)]';
              else if (actColor === 'rose') activeColorClass = 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.5)]';
              else if (actColor === 'amber') activeColorClass = 'bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.5)]';

              return (
                <button 
                  key={i}
                  onClick={() => goToSlide(i)}
                  title={`Jump to slide ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    isActive ? `w-8 ${activeColorClass}` : 
                    isBreak ? 'w-2.5 bg-white/40 hover:bg-white/70 hover:scale-125' : 'w-2 bg-white/15 hover:bg-white/50 hover:scale-125'
                  }`}
                />
              );
            })}
          </div>

          <button
            onClick={nextSlide}
            disabled={current === slides.length - 1}
            className="w-7 h-7 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 disabled:opacity-20 transition-all cursor-pointer select-none text-base font-mono"
            title="Next Slide"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
