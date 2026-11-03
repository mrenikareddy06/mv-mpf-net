# MV-MPF-Net — Interactive Research Prototype

**Zero-Shot Multi-View Video Forgery Detection Using Cross-View Consistency**

B.Tech Capstone demonstration prototype. Runs fully in the browser with no backend,
no ML inference, and no external API keys.

---

## Quick Start

```bash
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## What This Is

An interactive dashboard that demonstrates the architecture and working concept of
MV-MPF-Net to a university review panel. All scores and verdicts are computed from
locally defined demo data using deterministic calculations.

**No real ML inference is performed.**  
**No DINOv2, no GPU, no datasets required.**

---

## What You Can Do

| Action | Where |
|---|---|
| Launch 9-step Interactive Tour | Topbar "✨ Guided Tour" or press 'T' |
| Open Presenter Defense Script & Panel Q&A | Topbar "📋 Defense Script" |
| Switch forgery scenarios (all authentic / one fake / multi fake) | Section B — Camera Analysis |
| Click individual camera views to inspect branch scores | Section B |
| Drag sliders to manually adjust evidence scores | Section C — Evidence Streams |
| Switch between E1, E2, E3a, E3b explanation tabs | Section C |
| Switch fusion methods (Mean / Max / Dempster–Shafer) | Section D — Fusion |
| Export Official Forensic Audit Certificate (PDF) | Section E — Final Detection Report |
| Compare with single-view baselines (XceptionNet/FTCN) | Section E — Benchmark Table |
| Select held-out forgery family for zero-shot protocol | Section F — Zero-Shot Protocol |
| Reset everything | Topbar ↺ button |

---

## Architecture

```
4 cameras
    │
    ▼
MPF-Net backbone (per-view)
    ├── E1: Static Manifold Deviation
    └── E2: Micro-Temporal Fluctuation

Cross-View Module (proposed extension)
    ├── E3a: Epipolar Geometric Residual (Fundamental Matrix + Sampson distance)
    └── E3b: Joint Embedding Agreement (DINOv2 + Mahalanobis distance)

Evidence Fusion → Mean | Max | Dempster–Shafer
    └── Final Verdict (Fake probability + Uncertainty + Conflict)
```

---

## Tech Stack

- **React 19** + **Vite 6**
- **Vanilla CSS** (no Tailwind, no external UI libraries)
- **No dependencies** beyond React itself

---

## Important Disclaimers

- All scores are illustrative demo values
- No experimental results are presented as real
- DINOv2 embeddings are simulated — no actual ViT inference runs
- The zero-shot evaluation table shows placeholder numbers to illustrate the structure of a leave-one-out experiment

---

## Project Structure

```
src/
├── data/
│   └── demoData.js          # All demo scenarios, fusion logic, data generators
├── components/
│   ├── OverviewSection.jsx  # Section A: architecture overview
│   ├── CameraSection.jsx    # Section B: multi-view camera panels
│   ├── EvidenceSection.jsx  # Section C: E1/E2/E3a/E3b tabs
│   ├── FusionSection.jsx    # Section D: evidence fusion
│   ├── ReportSection.jsx    # Section E: final verdict
│   ├── ZeroShotSection.jsx  # Section F: zero-shot protocol
│   ├── Charts.jsx           # ScoreBar, TemporalChart, EpipolarScatter, etc.
│   └── SceneSVG.jsx         # Synthetic camera scene illustrations
├── App.jsx                  # Layout, navigation, global state
├── index.css                # Design system (dark charcoal + cyan + violet)
└── main.jsx                 # React entry point
```
