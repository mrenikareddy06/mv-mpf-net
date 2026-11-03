# MV-MPF-Net: Zero-Shot Multi-View Video Forgery Detection Using Cross-View Consistency

[![Live Demo](https://img.shields.io/badge/Live_Demo-mv--mpf--net.vercel.app-blue?style=for-the-badge&logo=vercel)](https://mv-mpf-net.vercel.app)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev)
[![Academic Design](https://img.shields.io/badge/Theme-Academic_Light_Mode-0f172a?style=for-the-badge)](https://mv-mpf-net.vercel.app)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero_Heavy_ML-emerald?style=for-the-badge)](https://mv-mpf-net.vercel.app)

> **B.Tech Capstone Demonstration & Interactive Forensic Workstation**  
> *A deterministic proof-of-concept prototype demonstrating how cross-camera 3D epipolar geometry and joint multi-view embeddings expose high-fidelity deepfakes without requiring retraining on unseen generative algorithms.*

---

## 🌐 Live Prototype

- **Production URL**: [https://mv-mpf-net.vercel.app](https://mv-mpf-net.vercel.app)
- **Local Dev Server**: `http://localhost:5173`

---

## ⚡ Quick Start

```bash
# Clone the repository
git clone https://github.com/mrenikareddy06/mv-mpf-net.git
cd mv-mpf-net

# Install dependencies (only React + Vite, 0 heavy ML backends)
npm install

# Start local interactive server
npm run dev
```

---

## 🎯 The Core Problem & Proposed Hypothesis

### 1. The Single-Camera Limitation
Current state-of-the-art deepfake detectors (e.g., XceptionNet, EfficientNet, FTCN) evaluate faces on **single 2D video feeds**. When an attacker utilizes modern latent diffusion models or 4K neural rendering, individual frames often pass texture and frequency artifact checks.

### 2. The Multi-Camera Geometric Advantage
In multi-camera surveillance environments (airports, secure checkpoints, courtrooms), physical 3D reality dictates strict mathematical relationships between camera feeds:
- **Epipolar Geometry**: Any 3D point must project onto a specific epipolar line on neighboring views governed by the Fundamental Matrix ($\mathbf{x}_j^T \mathbf{F}_{ij} \mathbf{x}_i = 0$).
- **Sampson Distance Residuals**: If an attacker synthesizes or swaps a face on Camera B, the synthesized facial landmarks inevitably violate the epipolar lines projected from Cameras A, C, and D.
- **Zero-Shot Generalization**: Because geometric laws are invariant to generative models, cross-view verification detects unseen deepfake architectures without retraining.

---

## 🔬 System Architecture

```text
               Synchronized 4-Camera Rig (Cam A, B, C, D)
                                  │
         ┌────────────────────────┴────────────────────────┐
         ▼                                                 ▼
[Intra-View Stream]                             [Cross-View Stream]
 ├── E1: Static Manifold Deviation               ├── E3a: Epipolar Geometric Residual
 │   (Boundary texture & frequency)              │   (Fundamental Matrix + Sampson Dist)
 └── E2: Micro-Temporal Fluctuation              └── E3b: Joint Feature Agreement
     (rPPG blood volume pulse continuity)            (DINOv2 patch Mahalanobis dist)
         │                                                 │
         └────────────────────────┬────────────────────────┘
                                  ▼
                   Evidence Fusion Engine
                 [Dempster-Shafer Theory]
              m({Real}) + m({Fake}) + m(Θ) = 1
                                  │
                                  ▼
                   Final Synthesized Verdict
      [Authentic vs. Forgery + Uncertainty + Top Contributor]
```

---

## 🚀 Key Features in the Interactive Prototype

| Feature | Description | Shortcut / Location |
|---|---|---|
| **✨ Guided Walkthrough Tour** | 9-step interactive guided overlay explaining every subsystem | Press `T` or topbar button |
| **📋 Presenter Defense Kit** | Complete 2-minute stage pitch, panel Q&A answers, and vocabulary cheat sheet | Topbar **"📋 Defense Script"** |
| **◫ Multi-Camera Surveillance HUD** | Interactive 4-camera CCTV view with real-time HUD telemetry and scenario triggers | Section B |
| **📡 Spatial 3D Radar Hologram** | Dynamic SVG radar visualizing camera frustums and epipolar violation vectors | Section B |
| **⟁ Evidence Stream Deep Dives** | Interactive sliders and mathematical cards for E1, E2, E3a, and E3b | Section C |
| **⋈ Dempster-Shafer Fusion Sandbox** | Toggle between Mean, Max, and Dempster-Shafer belief mass decomposition | Section D |
| **▦ Forensic Audit Certificate** | Official print-ready PDF certificate complete with tamper-evident audit serials | Section E **"Export Certificate"** |
| **📊 SOTA Benchmark Comparison** | Head-to-head comparison table against XceptionNet and FTCN single-view baselines | Section E |
| **∅ Zero-Shot Generalization Protocol** | Leave-one-generator-out evaluation matrix for unseen model evaluation | Section F |

---

## 📊 Benchmark Comparison Summary

| Metric / Dimension | Single-View Spatial (XceptionNet) | Single-View Temporal (FTCN) | **MV-MPF-Net (Proposed)** |
|---|---|---|---|
| **Input Modality** | Single 2D frame | Single camera stream | **Synchronized 4-camera array** |
| **3D Geometric Rigor** | None (pure 2D texture) | None (optical flow heuristics) | **Fundamental Matrix Sampson Distance** |
| **Diffusion FaceSwap Resistance** | Low (fooled by high-res GANs) | Moderate (fooled by motion blur) | **High (stereo lines break on breach)** |
| **Zero-Shot Robustness** | Poor (severe domain overfitting) | Moderate (overfits to temporal noise) | **High (physical laws never change)** |
| **Decision Synthesis** | Softmax Probability | Binary Sigmoid | **Dempster-Shafer Theory (measures conflict & ignorance)** |

---

## 💡 How to Explain this Prototype to Reviewers

> **Demonstration Notice**:  
> This prototype is a **deterministic architectural simulation**. It is designed to illustrate and validate the multi-view pipeline, data flow, epipolar geometry logic, and evidence fusion workflow.  
> It does not require active GPU inference or external model weights, ensuring deterministic, lag-free evaluation during viva defenses and technical demos.

---

## 📂 Project Structure

```text
mv-mpf-net/
├── index.html                   # HTML entry point with system fonts
├── vercel.json                  # Production Vite SPA routing configuration
├── package.json                 # Minimal lightweight package manifest
├── src/
│   ├── App.jsx                  # Main dashboard layout, navigation, global state
│   ├── index.css                # Clean Academic Light Mode design system
│   ├── main.jsx                 # React root mount point
│   ├── data/
│   │   └── demoData.js          # Deterministic scenarios, fusion formulas & math
│   └── components/
│       ├── OverviewSection.jsx      # Section A: hero summary & interactive scenario cards
│       ├── CameraSection.jsx        # Section B: multi-camera surveillance inspection
│       ├── SpatialRadarHologram.jsx # 3D geometric camera array radar visualization
│       ├── EvidenceSection.jsx      # Section C: E1, E2, E3a, E3b mathematical deep-dive
│       ├── FusionSection.jsx        # Section D: Dempster-Shafer vs Mean/Max sandbox
│       ├── ReportSection.jsx        # Section E: final verdict, top contributor & actions
│       ├── BenchmarkTable.jsx       # Head-to-head comparison against SOTA baselines
│       ├── ForensicReportModal.jsx  # Printable official forensic audit certificate (PDF)
│       ├── DefenseScriptModal.jsx   # Presenter cheat sheet with 2-min pitch & panel Q&A
│       ├── ZeroShotSection.jsx      # Section F: leave-one-out generalization protocol
│       ├── Charts.jsx               # Custom SVG telemetry, rings, scatters & histograms
│       ├── SceneSVG.jsx             # Architectural CCTV multi-camera vector illustrations
│       └── Tour.jsx                 # 9-step interactive guided walkthrough tour
```

---

## 🎓 Academic Defense & Review Kit

The prototype includes an in-app **Defense Script** (`src/components/DefenseScriptModal.jsx`) covering answers to the top 5 questions anticipated from review panels:

1. **"Did you train a DINOv2 model on GPUs?"**  
   *Answer*: This prototype is the architectural proof-of-concept demonstrating the inference and fusion pipeline. We mathematically formulated the Sampson distance and Dempster-Shafer mass functions deterministically. Full model fine-tuning on FaceForensics++ multi-camera recordings is scheduled for Phase 2.
2. **"What if cameras have different lighting or color balances?"**  
   *Answer*: Feature embeddings extracted with DINOv2 are foundation-model representations invariant to global illuminance variations. Additionally, epipolar geometry checks only landmark point correspondences, which are independent of photometric shifts.
3. **"What if all 4 cameras are manipulated simultaneously?"**  
   *Answer*: An attacker manipulating all 4 cameras independently would generate conflicting 3D depth maps. Synthesizing mutually consistent epipolar geometry across 4 views in real-time requires full 3D neural radiance field reconstruction (NeRF/3DGS), which is computationally infeasible for live surveillance injection.

---

## 📄 License

This research prototype is developed for academic evaluation and demonstration purposes under the B.Tech Capstone Project program.
