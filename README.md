<div align="center">

<!-- Animated Header Banner -->
<img src="https://capsule-render.vercel.app/api?type=waving&height=280&color=gradient&customColorList=0,2,2,5,30&text=BJKST%20Algorithm&fontColor=00ffa8&fontSize=72&stroke=ea00d9&strokeWidth=2&animation=fadeIn&fontAlignY=38&desc=Distinct%20Element%20Counting%20on%20Spotify%20Streams&descAlignY=58&descSize=20&descColor=ffffff" width="100%"/>

<!-- Badges Row 1 -->
<p>
  <img src="https://img.shields.io/badge/React-19.2+-61DAFB?style=for-the-badge&logo=react&logoColor=black"/>
  <img src="https://img.shields.io/badge/TypeScript-6.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/>
  <img src="https://img.shields.io/badge/Vite-8.3-646CFF?style=for-the-badge&logo=vite&logoColor=white"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white"/>
</p>

<!-- Badges Row 2 -->
<p>
  <img src="https://img.shields.io/badge/Three.js-3D%20Canvas-000000?style=for-the-badge&logo=three.js&logoColor=white"/>
  <img src="https://img.shields.io/badge/KaTeX-Math%20Engine-00ffa8?style=for-the-badge&logo=latex&logoColor=black"/>
  <img src="https://img.shields.io/badge/ISI-Bangalore-1565C0?style=for-the-badge&logo=graduation-cap&logoColor=white"/>
  <img src="https://img.shields.io/badge/BSDS-Probability%20II%20(2026)-FF6B00?style=for-the-badge&logo=book&logoColor=white"/>
</p>

<br/>

```
██████╗      ██╗██╗  ██╗███████╗████████╗
██╔══██╗     ██║██║ ██╔╝██╔════╝╚══██╔══╝
██████╔╝     ██║█████╔╝ ███████╗   ██║   
██╔══██╗██   ██║██╔═██╗ ╚════██║   ██║   
██████╔╝╚█████╔╝██║  ██╗███████║   ██║   
╚═════╝  ╚════╝ ╚═╝  ╚═╝╚══════╝   ╚═╝   
   Streaming Distinct Counting v1.0
```

### *Sub-linear Space Complexity for Massive Streaming Corpora*

**Group Project & Interactive 3D Presentation** | Probability II | BSDS, 1st Year (2025–26)

<br/>

> **"In the era of massive data streams, exact counting is a memory impossibility; probabilistic approximation is mathematical elegance."**
>
> The **BJKST Algorithm** (Bar-Yossef, Jayram, Kumar, Sivakumar, Trevisan) estimates the zeroth frequency moment ($F_0$ / distinct elements) in streaming data with strictly sub-linear memory $O\left(\frac{1}{\varepsilon^2} \log\left(\frac{1}{\delta}\right) \log n\right)$, leveraging pairwise independent hashing and concentration bounds governed by **Markov's and Chebyshev's Inequalities**.

</div>

---

## 📌 Table of Contents

- [The Problem We Solve](#-the-problem-we-solve)
- [How BJKST Works](#-how-bjkst-works)
- [The Math Behind the Magic](#-the-math-behind-the-magic)
- [Empirical Benchmark: Spotify Top 10,000](#-empirical-benchmark-spotify-top-10000)
- [Interactive 3D Presentation Architecture](#-interactive-3d-presentation-architecture)
- [Tech Stack](#%EF%B8%8F-tech-stack)
- [Quick Start](#-quick-start)
- [Team & Presentation Structure](#-team--presentation-structure)

---

## 🎯 The Problem We Solve

```
[ Exact Counting ]   ──→ Stores every seen token ──→ O(N) RAM   ──→ 📉 Memory Exhaustion
[ BJKST Algorithm ]  ──→ Hashes & dynamic bucket ──→ O(log N)   ──→ 📈 Real-Time Sub-Linear Scale
```

Computing unique visitors, network flows, or distinct artists in massive streaming datasets typically demands maintaining a global hash set. When stream length $m$ reaches millions or billions of tokens, storing every unique token in memory is computationally prohibitive.

**BJKST bridges that gap.**

Instead of storing values, BJKST hashes stream tokens into a fixed domain and dynamically retains only a statistically controlled sample of "rare" items (elements hashing with at least $z$ trailing zeros). As the stream expands, the threshold $z$ increments, halving the expected sample size while scaling the final estimate by $2^z$.

---

## ⚙️ How BJKST Works

```
┌─────────────────────────────────────────────────────────────────┐
│                        BJKST PIPELINE                           │
│                                                                 │
│  📥 INPUT STREAM                                                │
│  └─ Stream of tokens x₁, x₂, ..., xₘ (e.g. Spotify Artist URIs) │
│                          │                                      │
│                          ▼                                      │
│  🧮 2-INDEPENDENT HASH ENGINE                                  │
│  └─ Map item x to uniform pseudo-random hash h(x) ∈ [0, 2ⁿ - 1] │
│                          │                                      │
│                          ▼                                      │
│  🎯 TRAILING ZERO FILTER                                        │
│  └─ Compute zeros(h(x)); test if zeros(h(x)) ≥ z                │
│                          │                                      │
│                          ▼                                      │
│  💾 BOUNDED BUFFER (B)                                          │
│  └─ If |B| > Buffer Capacity C:                                 │
│     Increment threshold z ← z + 1                               │
│     Evict elements with zeros(h(x)) < z                         │
│                          │                                      │
│                          ▼                                      │
│  📤 UNBIASED ESTIMATE                                           │
│  └─ Output: F̂₀ = |B| × 2ᶻ                                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🧠 The Math Behind the Magic

The theoretical core of BJKST combines universal hash families with fundamental probabilistic concentration bounds.

### 1. The Subsampling Indicator

Let $h: U \to [0, 2^k - 1]$ be a pairwise independent hash function. For an item $x$, let $zeros(h(x))$ denote the number of trailing binary zeros. The probability that an element passes threshold $z$ is:

$$\mathbb{P}(\text{zeros}(h(x)) \ge z) = \frac{1}{2^z}$$

For distinct elements $x_1, x_2, \dots, x_d$, define indicator variables $Y_i = \mathbb{I}(\text{zeros}(h(x_i)) \ge z)$.

### 2. Expectation & Markov's Inequality

The expected number of retained elements in buffer $B$ is:

$$\mathbb{E}[|B|] = \sum_{i=1}^d \mathbb{E}[Y_i] = \frac{d}{2^z}$$

By **Markov's Inequality**, for any buffer threshold capacity $C$:

$$\mathbb{P}(|B| \ge C) \le \frac{\mathbb{E}[|B|]}{C} = \frac{d}{C \cdot 2^z}$$

### 3. Chebyshev's Inequality & $(\varepsilon, \delta)$-Guarantee

Because $h$ is pairwise independent, the indicators $Y_i$ are pairwise independent:

$$\text{Var}(|B|) = \sum_{i=1}^d \text{Var}(Y_i) \le \frac{d}{2^z}$$

Applying **Chebyshev's Inequality** gives concentration around the mean:

$$\mathbb{P}\left(\left| |B| \cdot 2^z - d \right| \ge \varepsilon d\right) \le \frac{\text{Var}(|B|)}{\varepsilon^2 \cdot (\mathbb{E}[|B|])^2} \le \frac{2^z}{\varepsilon^2 d}$$

Setting the buffer capacity $C = \Theta(1/\varepsilon^2)$ guarantees the estimation error is bounded within $(1 \pm \varepsilon)d$ with constant probability. Repeating across independent hashes and taking the **median** amplifies success probability to $1 - \delta$.

---

## 📊 Empirical Benchmark: Spotify Top 10,000

We benchmarked the algorithm on the real-world **Top 10,000 Spotify Tracks Dataset**:

* **Tracks Examined:** 10,000 rows (9,952 distinct Track URIs)
* **Total Stream Length ($m$):** 12,035 artist occurrences (after collaboration splitting)
* **Exact Ground-Truth Distinct Artists ($d$):** **3,813**
* **Single-appearance Artists:** 1,987 (52.1% of artist space)

### Benchmark Results across Buffer Capacities

| Buffer Capacity ($C$) | Final Depth ($z$) | Retained Buffer ($\vert B \vert$) | Estimate ($\hat{F}_0$) | True ($d$) | Relative Error |
|:---|:---:|:---:|:---:|:---:|:---:|
| **$C = 64$** | 6 | 59 | **3,776** | 3,813 | **-0.97%** |
| **$C = 128$** | 5 | 119 | **3,808** | 3,813 | **-0.13%** |
| **$C = 256$** | 4 | 239 | **3,824** | 3,813 | **+0.29%** |
| **Naive HashSet** | N/A | 3,813 | **3,813** | 3,813 | 0.00% (High Memory) |

---

## 🎬 Interactive 3D Presentation Architecture

This repository includes a cinematic, web-based presentation platform built with **React 19**, **Three.js**, and **Framer Motion**:

* **Interactive Hashing Canvas:** Live 3D particle visualization of hash scattering into buckets.
* **Real-Time Stream Simulator:** Watch tokens from the Spotify dataset pass through trailing-zero filters step-by-step.
* **Dynamic KaTeX Derivation Cards:** Interactive breakdowns of Markov, Chebyshev, and the Median Trick.
* **Synchronized Speaker Teleprompter:** Integrated presentation notes and Q&A flashcards for all 4 speakers.

---

## 🛠️ Tech Stack

* **Frontend:** React 19, TypeScript, Vite 8, Tailwind CSS v4
* **Animation & 3D:** Three.js, React Three Fiber (`@react-three/fiber`, `@react-three/drei`), Framer Motion, GSAP
* **Mathematics & Charts:** KaTeX (`react-katex`), Recharts
* **Dataset Engine:** Node.js stream parsers (`parse_all_35_dataset.cjs`)

---

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/Zapking-001/BJKST-Spotify-dataset.git
cd BJKST-Spotify-dataset
```

### 2. Install dependencies
```bash
npm install
```

### 3. Launch Development Server
```bash
npm run dev
```

Visit `http://localhost:5173` to launch the interactive presentation deck.

---

## 👥 Team & Presentation Structure

**Course:** Probability II | BSDS 2026, ISI Bangalore

| Act | Speaker | Role & Topic | Stage Time | Defense Dossier Depth |
|:---:|---|---|:---:|:---:|
| **Act 1** | **Arkaroy** | The Distinct Elements Problem, Streaming Limits & Spotify Dataset | ~7–8 min | 3,466 words (Full Prep & Q&A) |
| **Act 2** | **Ashish** | Universal Hash Families, Trailing Zeros & Stream Filtering | ~6–7 min | 3,738 words (Full Prep & Q&A) |
| **Act 3** | **Sagnik Das** | Theoretical Proof: Markov's & Chebyshev's Bounds, Variance Control | ~9–10 min | 4,807 words (Full Prep & Q&A) |
| **Act 4** | **Pritham Prajwin V** | Full Synthesis: Worked Example, Real Values & Live Simulation | ~9–10 min | 4,757 words (Full Prep & Q&A) |
| **Total** | **Team (4)** | **Complete BJKST Capstone Presentation** | **~32–35 min** | **16,768 words total** |

> 💡 **Note on Speaker Notes vs. Stage Time:**  
> The `.docx` files in `/public/speaker_notes/` serve as **comprehensive defense dossiers** (~3,500–4,800 words each). They are not intended to be recited verbatim in the 7–10 minute stage window (which would require speaking at >400 WPM). Rather, they provide full mathematical derivations, contingency proofs, and exhaustive Q&A defense banks for faculty cross-examination.

---

<div align="center">
  <sub>Built for BSDS 2026 • Probability II Course Showcase</sub>
</div>
