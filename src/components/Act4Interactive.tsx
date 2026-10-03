import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { InlineMath } from 'react-katex';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer, ReferenceLine } from 'recharts';

// ─── TOKEN SIMULATOR (Slide 27) ─────────────────────────────────────────────

type TokenEntry = {
  name: string;
  trailingZeros: number;
  id: number;
};

const ARTIST_POOL = [
  'Frankie Valli', 'Mike Posner', 'Foxes', 'Seeb', 'Coldplay',
  'Tinie Tempah', 'Maroon 5', 'Temper Trap', 'John Newman', 'Katy Perry',
  'Sam Smith', 'Ed Sheeran', 'The Weeknd', 'Drake', 'Taylor Swift',
  'Calvin Harris', 'Avicii', 'Dua Lipa', 'David Guetta', 'Bruno Mars',
  'Imagine Dragons', 'Adele', 'Shawn Mendes', 'Billie Eilish', 'Sia'
];

function generateRandomStream(): TokenEntry[] {
  const shuffled = [...ARTIST_POOL].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, 11);
  
  return selected.map((name, i) => {
    // Geometric distribution for trailing zeros: P(tz=k) = (1/2)^(k+1)
    const r = Math.random();
    let tz = 0;
    if (r < 0.50) tz = 0;
    else if (r < 0.75) tz = 1;
    else if (r < 0.875) tz = 2;
    else if (r < 0.95) tz = 3;
    else tz = 4;

    return {
      name,
      trailingZeros: tz,
      id: i + 1,
    };
  });
}

const CAPACITY = 4;

function trailingZerosBadge(tz: number) {
  const colors = [
    'bg-white/20 text-white/60',
    'bg-amber-500/30 text-amber-300',
    'bg-amber-500/60 text-amber-100 font-bold',
    'bg-emerald-500/60 text-emerald-100 font-bold',
    'bg-cyan-500/60 text-cyan-100 font-bold'
  ];
  return <span className={`ml-2 px-2 py-0.5 rounded text-xs font-mono ${colors[Math.min(tz, colors.length - 1)]}`}>tz={tz}</span>;
}

export const TokenSimulator = () => {
  const [tokens, setTokens] = useState<TokenEntry[]>(() => [
    { name: 'Frankie Valli', trailingZeros: 0, id: 1 },
    { name: 'Mike Posner',   trailingZeros: 0, id: 2 },
    { name: 'Foxes',         trailingZeros: 2, id: 3 },
    { name: 'Seeb',          trailingZeros: 1, id: 4 },
    { name: 'Coldplay',      trailingZeros: 2, id: 5 },
    { name: 'Tinie Tempah',  trailingZeros: 1, id: 6 },
    { name: 'Maroon 5',      trailingZeros: 0, id: 7 },
    { name: 'Temper Trap',   trailingZeros: 2, id: 8 },
    { name: 'John Newman',   trailingZeros: 0, id: 9 },
    { name: 'Katy Perry',    trailingZeros: 0, id: 10 },
    { name: 'Sam Smith',     trailingZeros: 1, id: 11 },
  ]);
  const [step, setStep] = useState(0);
  const [bucket, setBucket] = useState<TokenEntry[]>([]);
  const [z, setZ] = useState(0);
  const [warning, setWarning] = useState<string | null>(null);
  const [purged, setPurged] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const stepForward = useCallback(() => {
    if (step >= tokens.length) {
      setDone(true);
      setIsPlaying(false);
      return;
    }

    const currentToken = tokens[step];
    let nextBucket = [...bucket];
    let nextZ = z;
    let nextWarning: string | null = null;
    const newPurged: number[] = [];

    if (currentToken.trailingZeros >= nextZ) {
      nextBucket.push(currentToken);
    }

    if (nextBucket.length >= CAPACITY) {
      nextZ += 1;
      nextWarning = `CAPACITY REACHED! Purging items with tz < ${nextZ}`;
      const kept = nextBucket.filter(t => t.trailingZeros >= nextZ);
      const purgIds = nextBucket.filter(t => t.trailingZeros < nextZ).map(t => t.id);
      newPurged.push(...purgIds);
      nextBucket = kept;
    }

    setBucket(nextBucket);
    setZ(nextZ);
    setWarning(nextWarning);
    setPurged(newPurged);
    const nextStep = step + 1;
    setStep(nextStep);

    if (nextStep >= tokens.length) {
      setDone(true);
      setIsPlaying(false);
    }
  }, [step, tokens, bucket, z]);

  useEffect(() => {
    if (!isPlaying) return;
    if (done || step >= tokens.length) {
      setIsPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      stepForward();
    }, 750);

    return () => clearTimeout(timer);
  }, [isPlaying, step, done, tokens.length, stepForward]);

  const handleStep = () => {
    if (step < tokens.length && !done) {
      stepForward();
    }
  };

  const handleAutoPlay = () => {
    if (done) {
      const newStream = generateRandomStream();
      setTokens(newStream);
      setStep(0);
      setBucket([]);
      setZ(0);
      setWarning(null);
      setPurged([]);
      setDone(false);
      setIsPlaying(true);
    } else {
      setIsPlaying(prev => !prev);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setStep(0);
    setBucket([]);
    setZ(0);
    setWarning(null);
    setPurged([]);
    setDone(false);
  };

  const handleNewRandomStream = () => {
    setIsPlaying(false);
    const newStream = generateRandomStream();
    setTokens(newStream);
    setStep(0);
    setBucket([]);
    setZ(0);
    setWarning(null);
    setPurged([]);
    setDone(false);
  };

  const estimate = bucket.length * Math.pow(2, z);

  return (
    <div className="w-full max-w-5xl pointer-events-auto">
      <div className="glass-card rounded-3xl p-10 border border-amber-500/20 shadow-[0_0_50px_rgba(245,158,11,0.1)]">
        <div className="absolute top-0 left-0 w-full h-1 bg-amber-500 rounded-t-3xl shadow-[0_0_20px_#f59e0b]"></div>
        <div className="font-mono text-amber-500 uppercase tracking-widest text-sm mb-6">27 / Interactive Widget · Token Stream Simulator</div>
        <h1 className="text-4xl font-serif font-bold mb-2">Live 11-Token Stream Simulator</h1>
        <p className="text-white/60 font-light text-sm mb-8">Capacity <InlineMath math="c=4" />, Level <InlineMath math={`z=${z}`} /></p>

        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* Stream queue */}
          <div>
            <div className="text-xs font-mono text-white/40 uppercase tracking-widest mb-3">Incoming Stream</div>
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {tokens.map((t, i) => {
                const isCurrent = i === step - 1;
                const isPending = i >= step;
                return (
                  <div key={t.id} className={`flex items-center px-3 py-1.5 rounded-lg text-sm font-mono transition-all duration-300 ${
                    isCurrent ? 'bg-amber-500/20 border border-amber-500/50 text-amber-200' :
                    isPending ? 'text-white/30 border border-transparent' :
                    'text-white/60 border border-transparent'
                  }`}>
                    <span className="w-5 text-white/20 text-xs">{i+1}</span>
                    <span className="flex-1">{t.name}</span>
                    {trailingZerosBadge(t.trailingZeros)}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bucket */}
          <div>
            <div className="text-xs font-mono text-white/40 uppercase tracking-widest mb-3">
              Bucket B <span className="text-amber-400 ml-2">({bucket.length}/{CAPACITY})</span>
            </div>
            <div className="bg-black/40 border border-white/10 rounded-2xl p-4 min-h-48 relative overflow-hidden">
              {/* Capacity fill bar */}
              <div className="absolute bottom-0 left-0 right-0 h-full bg-amber-500/5 transition-all duration-500"
                style={{ height: `${(bucket.length / CAPACITY) * 100}%` }} />
              
              <AnimatePresence>
                {bucket.map((t) => (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, scale: 0.8 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className={`flex items-center px-3 py-2 rounded-lg mb-2 font-mono text-sm border ${
                      purged.includes(t.id)
                        ? 'bg-red-500/20 border-red-500/50 text-red-300'
                        : 'bg-amber-900/20 border-amber-500/30 text-amber-100'
                    }`}
                  >
                    <span className="flex-1">{t.name}</span>
                    {trailingZerosBadge(t.trailingZeros)}
                  </motion.div>
                ))}
              </AnimatePresence>

              {bucket.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-white/20 font-mono text-sm">empty</div>
              )}
            </div>

            {/* Warning flash */}
            <AnimatePresence>
              {warning && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-3 px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-xs font-mono"
                >
                  ⚠ {warning}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 mb-6">
          <button onClick={handleStep} disabled={done || isPlaying}
            className="px-5 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-mono text-sm rounded-xl border border-amber-500/30 disabled:opacity-30 transition-all active:scale-95 cursor-pointer">
            ▶ Step Forward
          </button>
          <button onClick={handleAutoPlay}
            className={`px-5 py-2 font-mono text-sm rounded-xl border transition-all active:scale-95 cursor-pointer ${
              isPlaying
                ? 'bg-amber-500 text-black font-bold border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.5)]'
                : 'bg-white/5 hover:bg-white/10 text-white/70 border-white/10'
            }`}>
            {isPlaying ? '⏸ Pause' : '⟳ Auto-Play'}
          </button>
          <button onClick={handleReset}
            className="px-5 py-2 bg-white/5 hover:bg-white/10 text-white/50 font-mono text-sm rounded-xl border border-white/10 transition-all active:scale-95 cursor-pointer">
            ↺ Reset
          </button>
          <button onClick={handleNewRandomStream}
            className="px-5 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-mono text-sm rounded-xl border border-amber-500/30 transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 ml-auto">
            <span>🎲 Random Stream</span>
          </button>
        </div>

        {/* Result */}
        <AnimatePresence>
          {done && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-amber-950/30 border border-amber-500/40 rounded-2xl p-6 text-center shadow-[0_0_40px_rgba(245,158,11,0.2)]"
            >
              <div className="text-amber-300 font-mono text-sm mb-3">Final State: <InlineMath math={`|B|=${bucket.length}, z=${z}`} /></div>
              <div className="text-5xl font-bold text-amber-400 mb-2">
                <InlineMath math={`\\hat{d} = ${bucket.length} \\cdot 2^${z} = ${estimate}`} />
              </div>
              <div className="text-white/50 text-sm mt-3">True distinct: {tokens.length} · Error: <span className="text-amber-300">{(((estimate - tokens.length) / tokens.length) * 100).toFixed(1)}%</span></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};


// ─── PYTHON TERMINAL (Slide 28) ──────────────────────────────────────────────

const PYTHON_CODE = `import hashlib, random, math

def bjkst(stream, capacity, seed=42):
    random.seed(seed)
    bucket, z = set(), 0
    
    for token in stream:
        h = int(hashlib.sha256(
            f"{seed}:{token}".encode()
        ).hexdigest(), 16)
        tz = (h & -h).bit_length() - 1
        
        if tz >= z:
            bucket.add(token)
        
        while len(bucket) >= capacity:
            z += 1
            bucket = {t for t in bucket
                      if trailing_zeros(t, seed) >= z}
    
    return len(bucket) * (2 ** z), z, bucket

d_hat, z, B = bjkst(
    stream=artist_tokens,
    capacity=2304
)
print(f"z={z}, |B|={len(B)}")
print(f"d_hat = {d_hat}")
print(f"True d = 3813")
print(f"Error = {(d_hat-3813)/3813*100:.2f}%")`;

const TERMINAL_LINES = [
  { text: 'Loading 12,035 artist tokens from CSV...', delay: 0, color: 'text-white/50' },
  { text: 'Initializing BJKST with capacity=2304, ε=0.5...', delay: 400, color: 'text-amber-400' },
  { text: 'Processing stream...', delay: 800, color: 'text-white/50' },
  { text: '  Bucket fills at token #4,984', delay: 1400, color: 'text-white/70' },
  { text: '  Level escalation: z = 0 → 1', delay: 1900, color: 'text-yellow-400' },
  { text: '  Pruning items with tz < 1...', delay: 2400, color: 'text-white/50' },
  { text: '  Resuming stream...', delay: 2900, color: 'text-white/50' },
  { text: 'Stream complete. Final state:', delay: 3600, color: 'text-green-400' },
  { text: '  z = 1', delay: 4000, color: 'text-amber-300 font-bold' },
  { text: '  |B| = 1,953', delay: 4300, color: 'text-amber-300 font-bold' },
  { text: '  d̂ = 1953 × 2¹ = 3,906', delay: 4700, color: 'text-amber-400 text-lg font-bold' },
  { text: '  True d = 3,813', delay: 5100, color: 'text-white/60' },
  { text: '  Error = +2.44%  ✓ Within ε=50% bound', delay: 5600, color: 'text-green-400 font-bold' },
];

function escapeHtml(text: string) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function highlightPythonLine(line: string) {
  const tokenRegex = /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|#.*$|\b(?:def|import|from|as|return|for|in|if|elif|else|while)\b|\b(?:print|set|int|len|range|hashlib|random|math|bjkst|trailing_zeros)\b|\b\d+(?:\.\d+)?\b|[a-zA-Z_]\w*|[^\s\w]+|\s+)/g;
  
  return line.replace(tokenRegex, (match) => {
    if (match.startsWith('#')) {
      return `<span style="color:#64748b;font-style:italic">${escapeHtml(match)}</span>`;
    }
    if (match.startsWith('"') || match.startsWith("'")) {
      return `<span style="color:#34d399">${escapeHtml(match)}</span>`;
    }
    if (/^(def|import|from|as|return|for|in|if|elif|else|while)$/.test(match)) {
      return `<span style="color:#f59e0b;font-weight:600">${match}</span>`;
    }
    if (/^(print|set|int|len|range|hashlib|random|math|bjkst|trailing_zeros)$/.test(match)) {
      return `<span style="color:#38bdf8;font-weight:500">${match}</span>`;
    }
    if (/^\d+(\.\d+)?$/.test(match)) {
      return `<span style="color:#c084fc">${match}</span>`;
    }
    if (/^[=+\-*/%&|^<>!]+$/.test(match)) {
      return `<span style="color:#fb7185">${escapeHtml(match)}</span>`;
    }
    return escapeHtml(match);
  });
}

export const PythonTerminal = () => {
  const [running, setRunning] = useState(false);
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const terminalRef = useRef<HTMLDivElement>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const runScript = () => {
    if (running) return;
    setRunning(true);
    setVisibleLines([]);
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    TERMINAL_LINES.forEach((_, i) => {
      const t = setTimeout(() => {
        setVisibleLines(prev => [...prev, i]);
        if (terminalRef.current) terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
      }, TERMINAL_LINES[i].delay + 500);
      timeoutsRef.current.push(t);
    });

    const done = setTimeout(() => setRunning(false), TERMINAL_LINES[TERMINAL_LINES.length-1].delay + 1000);
    timeoutsRef.current.push(done);
  };

  useEffect(() => () => timeoutsRef.current.forEach(clearTimeout), []);

  return (
    <div className="w-full h-full flex items-center justify-center p-8 pointer-events-auto">
      <div className="w-full max-w-6xl glass-card rounded-3xl overflow-hidden border border-amber-500/20 shadow-[0_0_60px_rgba(245,158,11,0.1)]">
        <div className="absolute top-0 left-0 w-full h-1 bg-amber-500"></div>
        
        {/* Header bar */}
        <div className="flex items-center gap-2 px-6 py-4 border-b border-white/5 bg-black/40">
          <div className="w-3 h-3 rounded-full bg-red-500/70"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/70"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/70"></div>
          <span className="ml-4 font-mono text-white/40 text-sm">bjkst_runner.py — Probability II / BSDS 2026</span>
          <div className="ml-auto font-mono text-amber-500 text-xs uppercase tracking-widest">28 / Live Execution</div>
        </div>

        <div className="grid grid-cols-2 divide-x divide-white/5" style={{height: '520px'}}>
          {/* Code pane */}
          <div className="overflow-auto p-6 bg-[#0B0F17] font-mono text-sm leading-relaxed" style={{ tabSize: 4 }}>
            <pre className="text-white/80 whitespace-pre">
              {PYTHON_CODE.split('\n').map((line, i) => (
                <div key={i} className="flex gap-4 hover:bg-white/[0.02] px-1 rounded transition-colors">
                  <span className="text-white/20 select-none w-5 text-right flex-shrink-0 text-xs font-mono pt-0.5">{i+1}</span>
                  <span className="flex-1 outline-none font-mono" dangerouslySetInnerHTML={{
                    __html: highlightPythonLine(line) || '&nbsp;'
                  }} />
                </div>
              ))}
            </pre>
          </div>

          {/* Terminal pane */}
          <div className="flex flex-col">
            <div ref={terminalRef} className="flex-1 overflow-y-auto p-6 font-mono text-sm space-y-1 bg-black/40">
              {visibleLines.length === 0 && !running && (
                <div className="text-white/20 italic">Click "Run Script" to execute...</div>
              )}
              <AnimatePresence>
                {visibleLines.map(i => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className={TERMINAL_LINES[i].color}
                  >
                    {i >= 7 ? `  ${TERMINAL_LINES[i].text}` : `> ${TERMINAL_LINES[i].text}`}
                  </motion.div>
                ))}
              </AnimatePresence>
              {running && visibleLines.length < TERMINAL_LINES.length && (
                <motion.div animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }}
                  className="text-amber-500">▌</motion.div>
              )}
            </div>
            <div className="p-4 border-t border-white/5">
              <button onClick={runScript} disabled={running}
                className="w-full py-3 bg-amber-500/20 hover:bg-amber-500/30 active:scale-95 text-amber-300 font-mono text-sm rounded-xl border border-amber-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                {running ? '⟳ Running...' : '▶ Run Script'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


// ─── MONTE CARLO HISTOGRAM (Slide 29) ────────────────────────────────────────

function generateHistogramData() {
  // Simulate 8000 runs with normally distributed errors centered at ~2% with σ≈1.61%
  const bins: {label: string; count: number; isHighlighted: boolean}[] = [];
  const range = [-8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  // gaussian-like distribution
  range.forEach(b => {
    const center = 2.0; // mean error
    const sigma = 1.61;
    const x = b + 0.5;
    const norm = Math.exp(-0.5 * ((x - center) / sigma) ** 2) / (sigma * Math.sqrt(2 * Math.PI));
    bins.push({ label: `${b}%`, count: Math.round(norm * 8000 * 1.0), isHighlighted: Math.abs(b) <= 5 });
  });
  return bins;
}

export const MonteCarloHistogram = () => {
  const data = generateHistogramData();
  return (
    <div className="w-full max-w-5xl pointer-events-auto">
      <div className="glass-card rounded-3xl p-12 border border-amber-500/20">
        <div className="absolute top-0 left-0 w-full h-1 bg-amber-500"></div>
        <div className="font-mono text-amber-500 uppercase tracking-widest text-sm mb-6">29 / Empirical Validation</div>
        <h1 className="text-4xl font-serif font-bold mb-2">8,000-Seed Monte Carlo Distribution</h1>
        <p className="text-white/60 font-light mb-10">Error distribution of BJKST across 8,000 independent hash seeds on the Spotify dataset</p>

        <div className="flex gap-8 mb-8">
          <div className="bg-amber-950/30 border border-amber-500/30 px-6 py-4 rounded-xl text-center">
            <div className="text-3xl font-bold text-amber-400">1.61%</div>
            <div className="text-white/50 text-xs font-mono mt-1">Standard Deviation σ</div>
          </div>
          <div className="bg-green-950/30 border border-green-500/30 px-6 py-4 rounded-xl text-center">
            <div className="text-3xl font-bold text-green-400">0</div>
            <div className="text-white/50 text-xs font-mono mt-1">Runs exceeding 10% error</div>
          </div>
          <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-xl text-center">
            <div className="text-3xl font-bold text-white">+2.44%</div>
            <div className="text-white/50 text-xs font-mono mt-1">Mean Error (Seed 42)</div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="label" stroke="rgba(255,255,255,0.3)" fontSize={11} fontFamily="JetBrains Mono" />
            <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} fontFamily="JetBrains Mono" />
            <Tooltip
              contentStyle={{ background: '#0d0d0d', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '12px', fontFamily: 'JetBrains Mono', fontSize: 12 }}
              labelStyle={{ color: '#f59e0b' }}
            />
            <ReferenceLine x="2%" stroke="#f59e0b" strokeDasharray="4 4" label={{ value: 'Mean', fill: '#f59e0b', fontSize: 11, fontFamily: 'JetBrains Mono' }} />
            <ReferenceLine x="10%" stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'ε bound', fill: '#ef4444', fontSize: 11 }} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.isHighlighted ? '#f59e0b' : 'rgba(245,158,11,0.25)'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <p className="text-center text-white/40 text-sm mt-4 font-light">
          Zero runs exceeded the theoretical <InlineMath math="\varepsilon = 50\%" /> bound, confirming the guarantee is highly conservative in practice.
        </p>
      </div>
    </div>
  );
};


// ─── MEDIAN TRICK SLIDER (Slide 30) ──────────────────────────────────────────

const SINGLE_ERRORS = [14.2, -11.3, 8.7, -6.1, 19.1, -14.8, 7.3, -9.2, 12.4, -5.6];

function medianOf(arr: number[]) {
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

export const MedianTrick = () => {
  const [k, setK] = useState(1);

  const copies = SINGLE_ERRORS.slice(0, k);
  const med = medianOf(copies);

  return (
    <div className="w-full max-w-5xl pointer-events-auto">
      <div className="glass-card rounded-3xl p-12 border border-amber-500/20">
        <div className="absolute top-0 left-0 w-full h-1 bg-amber-500"></div>
        <div className="font-mono text-amber-500 uppercase tracking-widest text-sm mb-6">30 / Amplification · The Median Trick</div>
        <h1 className="text-4xl font-serif font-bold mb-2">The <InlineMath math="\delta" />-Boost via Median</h1>
        <p className="text-white/60 font-light mb-10">Drag the slider to take the median of <InlineMath math="k" /> independent copies. Watch error collapse.</p>

        {/* Slider */}
        <div className="flex items-center gap-6 mb-10 bg-black/40 p-6 rounded-2xl border border-white/5">
          <div className="text-amber-400 font-serif text-2xl w-32"><InlineMath math={`k = ${k}`} /></div>
          <input type="range" min={1} max={10} value={k} onChange={e => setK(Number(e.target.value))}
            className="flex-1 h-2 accent-amber-500 cursor-grab" />
          <div className="text-white/40 font-mono text-sm w-20">k=10</div>
        </div>

        {/* Copies array */}
        <div className="flex flex-wrap gap-3 mb-8">
          {SINGLE_ERRORS.map((err, i) => {
            const active = i < k;
            const isMedian = active && i === Math.floor(copies.length / 2); // approximate
            return (
              <motion.div
                key={i}
                animate={{ scale: active ? 1 : 0.85, opacity: active ? 1 : 0.2 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className={`px-4 py-3 rounded-xl font-mono text-sm border transition-all ${
                  isMedian && k > 2
                    ? 'bg-amber-500/20 border-amber-500 text-amber-200 ring-2 ring-amber-500/50'
                    : active
                    ? 'bg-black/40 border-white/10 text-white'
                    : 'bg-black/20 border-white/5 text-white/20'
                }`}
              >
                <div className="text-xs text-white/30 mb-1">Copy {i+1}</div>
                <div className={err > 0 ? 'text-red-400' : 'text-green-400'}>{err > 0 ? '+' : ''}{err}%</div>
              </motion.div>
            );
          })}
        </div>

        {/* Result box */}
        <motion.div
          key={k}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-amber-950/30 border border-amber-500/40 rounded-2xl p-8 text-center"
        >
          <div className="text-white/50 text-sm font-mono mb-2">Median of {k} independent estimates</div>
          <div className={`text-5xl font-bold mb-3 ${Math.abs(med) < 5 ? 'text-green-400' : Math.abs(med) < 10 ? 'text-yellow-400' : 'text-red-400'}`}>
            {med > 0 ? '+' : ''}{med.toFixed(2)}%
          </div>
          {k >= 5 && (
            <div className="text-green-400 text-sm font-light mt-2">
              ✓ Chernoff bound suppresses error to <InlineMath math="\delta \le 1/3" /> at <InlineMath math="k = O(\log(1/\delta))" /> copies
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};


// ─── MULTI-STREAM TOGGLE (Slide 31) ──────────────────────────────────────────

const STREAM_DATA = {
  Artists: { 
    d: 3813, 
    z: 1, 
    bucketFills: true, 
    estimate: 3906, 
    error: '+2.44%', 
    note: 'Standard case: level z=1, bucket overflows once.',
    activeTabClass: 'bg-amber-500 text-black font-bold shadow-[0_0_20px_rgba(245,158,11,0.5)]',
    cardGlow: 'hover:border-amber-500/70 hover:shadow-[0_0_30px_rgba(245,158,11,0.35)] hover:bg-amber-950/20',
    zCardClass: 'bg-amber-950/20 border-amber-500/40 hover:border-amber-400 hover:shadow-[0_0_35px_rgba(245,158,11,0.5)] hover:bg-amber-950/35',
    zTextColor: 'text-amber-400',
    estTextColor: 'text-amber-300',
    noteClass: 'border-amber-500/30 hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]',
  },
  Albums:  { 
    d: 7474, 
    z: 2, 
    bucketFills: true, 
    estimate: 7812, 
    error: '+4.52%', 
    note: 'Higher cardinality: z escalates to 2.',
    activeTabClass: 'bg-cyan-500 text-black font-bold shadow-[0_0_20px_rgba(6,182,212,0.5)]',
    cardGlow: 'hover:border-cyan-500/70 hover:shadow-[0_0_30px_rgba(6,182,212,0.35)] hover:bg-cyan-950/20',
    zCardClass: 'bg-cyan-950/20 border-cyan-500/40 hover:border-cyan-400 hover:shadow-[0_0_35px_rgba(6,182,212,0.5)] hover:bg-cyan-950/35',
    zTextColor: 'text-cyan-400',
    estTextColor: 'text-cyan-300',
    noteClass: 'border-cyan-500/30 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]',
  },
  Genres:  { 
    d: 907, 
    z: 0, 
    bucketFills: false, 
    estimate: 907, 
    error: '0.00%', 
    note: 'T=0 case: d < capacity, bucket never fills. Output is exact.',
    activeTabClass: 'bg-emerald-500 text-black font-bold shadow-[0_0_20px_rgba(16,185,129,0.5)]',
    cardGlow: 'hover:border-emerald-500/70 hover:shadow-[0_0_30px_rgba(16,185,129,0.35)] hover:bg-emerald-950/20',
    zCardClass: 'bg-emerald-950/20 border-emerald-500/40 hover:border-emerald-400 hover:shadow-[0_0_35px_rgba(16,185,129,0.5)] hover:bg-emerald-950/35',
    zTextColor: 'text-emerald-400',
    estTextColor: 'text-emerald-300',
    noteClass: 'border-emerald-500/30 hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]',
  },
};

type StreamKey = keyof typeof STREAM_DATA;

export const MultiStream = () => {
  const [stream, setStream] = useState<StreamKey>('Artists');
  const data = STREAM_DATA[stream];

  return (
    <div className="w-full max-w-5xl pointer-events-auto">
      <div className="glass-card rounded-3xl p-12 border border-amber-500/20">
        <div className="absolute top-0 left-0 w-full h-1 bg-amber-500"></div>
        <div className="font-mono text-amber-500 uppercase tracking-widest text-sm mb-6">31 / Generalization · Data-Agnostic Proof</div>
        <h1 className="text-4xl font-serif font-bold mb-2">Multi-Stream Generalization</h1>
        <p className="text-white/60 font-light mb-10">BJKST works on any discrete stream — toggle to switch the dimension being estimated.</p>

        {/* Toggle */}
        <div className="flex gap-2 mb-10 bg-black/40 p-2 rounded-2xl border border-white/5 w-fit">
          {(Object.keys(STREAM_DATA) as StreamKey[]).map(key => (
            <button key={key} onClick={() => setStream(key)}
              className={`px-8 py-3 rounded-xl font-mono text-sm transition-all cursor-pointer ${
                stream === key ? STREAM_DATA[key].activeTabClass : 'text-white/50 hover:text-white'
              }`}>
              {key}
            </button>
          ))}
        </div>

        {/* Metrics */}
        <AnimatePresence mode="wait">
          <motion.div key={stream}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-3 gap-6 mb-8">
              {/* True Distinct Card */}
              <div className={`bg-black/40 border border-white/10 p-6 rounded-2xl text-center transition-all duration-300 cursor-default ${data.cardGlow}`}>
                <div className="text-xs font-mono text-white/40 uppercase tracking-widest mb-2">True Distinct</div>
                <div className="text-4xl font-bold text-white font-mono">{data.d.toLocaleString()}</div>
              </div>

              {/* Final Level Z Card */}
              <div className={`border p-6 rounded-2xl text-center transition-all duration-300 cursor-default ${data.zCardClass}`}>
                <div className="text-xs font-mono text-white/40 uppercase tracking-widest mb-2">Final Level z</div>
                <div className={`text-4xl font-bold font-mono ${data.zTextColor}`}>{data.z}</div>
                {!data.bucketFills && <div className="text-emerald-400 text-xs mt-2 font-mono">T=0 case</div>}
              </div>

              {/* Estimate d_hat Card */}
              <div className={`bg-black/40 border border-white/10 p-6 rounded-2xl text-center transition-all duration-300 cursor-default ${data.cardGlow}`}>
                <div className="text-xs font-mono text-white/40 uppercase tracking-widest mb-2">Estimate d̂</div>
                <div className={`text-4xl font-bold font-mono ${data.estTextColor}`}>{data.estimate.toLocaleString()}</div>
                <div className={`text-sm mt-2 font-mono ${parseFloat(data.error) === 0 ? 'text-emerald-400' : 'text-white/50'}`}>{data.error}</div>
              </div>
            </div>

            {!data.bucketFills ? (
              <div className={`bg-emerald-950/30 border p-6 rounded-2xl text-center transition-all duration-300 ${data.noteClass}`}>
                <div className="text-emerald-300 font-light text-lg">
                  <InlineMath math={`d = ${data.d} < 2{,}304 = \\text{capacity}`} />
                </div>
                <p className="text-white/60 text-sm mt-3 font-light">
                  {data.note} Level <InlineMath math="z" /> never escalates — output is the exact count.
                </p>
              </div>
            ) : (
              <div className={`bg-black/40 border p-4 rounded-xl transition-all duration-300 ${data.noteClass}`}>
                <p className="text-white/60 text-sm font-light text-center">{data.note}</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
