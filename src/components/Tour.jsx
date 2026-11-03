import { useState, useEffect } from 'react';

const TOUR_STEPS = [
  {
    id: 'welcome',
    badge: 'Step 1/9 · Introduction',
    title: '👋 Welcome to MV-MPF-Net',
    body: 'This interactive prototype demonstrates a Zero-Shot Multi-View Video Forgery Detection framework developed for university review. It solves the fundamental limitation of single-camera deepfake detectors by enforcing physical and semantic consistency across multiple synchronised camera views.',
    tip: '💡 Use the Next button or Arrow keys (← / →) to navigate. Press Esc to exit anytime.',
    target: null,
    position: 'center',
  },
  {
    id: 'hero-radar',
    badge: 'Step 2/9 · Spatial Geometry',
    title: '🛰️ Multi-View Spatial Hologram',
    body: 'Look at the spatial radar on the right. Four synchronised cameras (Cam A, B, C, D) converge on the central subject. Notice how Camera B (Front-Right) is flagged with an epipolar violation ray when deepfake manipulation breaks cross-camera geometric consistency.',
    tip: '🎯 In authentic multi-view video, rays from all cameras must satisfy epipolar geometry (Sampson distance ≈ 0).',
    target: '#spatial-radar-hud',
    position: 'left',
  },
  {
    id: 'topbar-verdict',
    badge: 'Step 3/9 · Real-Time Fusion Verdict',
    title: '🔴 Global Detection Telemetry',
    body: 'The top status bar continuously aggregates evidence across all camera streams. Right now, with Camera B manipulated, the fusion engine triggers a 98% FORGERY verdict. You can reset to clean baseline anytime with the Reset button.',
    tip: '⚡ Works without external backends or GPUs — deterministic, zero-dependency local simulation.',
    target: '#topbar-verdict-indicator',
    position: 'bottom-right',
  },
  {
    id: 'architecture',
    badge: 'Step 4/9 · Technical Pipeline',
    title: '⬡ System Architecture (Novelty)',
    body: 'The system has two tiers: (1) The baseline single-view MPF-Net backbone extracts intra-frame static artifacts (E1) and micro-temporal flickers (E2). (2) Our proposed Cross-View module adds epipolar geometry verification (E3a) and joint DINOv2 feature alignment (E3b).',
    tip: '🔍 Cross-view consistency catches deepfakes even when per-frame visual artifacts are invisible.',
    target: '#arch-diagram',
    position: 'bottom',
  },
  {
    id: 'cameras',
    badge: 'Step 5/9 · Synchronised Camera Grid',
    title: '◫ 4-Angle Surveillance Feeds',
    body: 'Section B renders synthetic synchronised camera feeds from 4 spatial angles. Camera B has been face-swapped. Notice the red telemetry HUD, glitch artifacts, and anomaly bounding box on Cam B. Click any camera card to inspect its individual breakdown!',
    tip: '👆 Click on Camera B or Camera A to see its per-branch evidence breakdown.',
    target: '#cameras-grid',
    position: 'top',
  },
  {
    id: 'scenario',
    badge: 'Step 6/9 · Threat Model Scenarios',
    title: '🎛️ Scenario Simulation Switcher',
    body: 'Switch between three realistic scenarios: "All Views Authentic" (clean baseline), "One View Manipulated" (the primary deepfake threat where an attacker targets one angle), or "Multiple Views Manipulated" (coordinated multi-angle manipulation).',
    tip: '🧪 Observe how epipolar conflict spikes specifically when only 1 or 2 views are manipulated.',
    target: '#scenario-switcher',
    position: 'bottom',
  },
  {
    id: 'evidence',
    badge: 'Step 7/9 · The 3 Evidence Streams',
    title: '⟁ Interactive Evidence Explorer',
    body: 'Section C details all four evidence branches: E1 (Static Manifold Anomaly), E2 (Micro-Temporal Inconsistency), E3a (Epipolar Epiline Sampson Error), and E3b (DINOv2 Joint Embedding Mahalanobis Distance). You can drag the interactive sliders to test sensitivity!',
    tip: '📊 All charts are custom inline SVG with live mathematical calculations.',
    target: '#evidence',
    position: 'top',
  },
  {
    id: 'fusion',
    badge: 'Step 8/9 · Dempster-Shafer Theory Fusion',
    title: '⋈ Principled Evidence Fusion',
    body: 'Instead of naive averaging, MV-MPF-Net uses Dempster-Shafer Theory (DST) to combine evidence with explicit epistemic uncertainty and conflict measurement (Conflict K). Notice how conflicting camera reports are rigorously isolated.',
    tip: '⚖️ Switch between Mean, Weighted, and Dempster-Shafer to compare fusion behaviors.',
    target: '#fusion',
    position: 'top',
  },
  {
    id: 'zeroshot',
    badge: 'Step 9/9 · Zero-Shot Generalisation',
    title: '∅ Leave-One-Family-Out Protocol',
    body: 'Why Zero-Shot? Real-world deepfakes use unseen generation methods. We calibrate thresholds exclusively on known forgery families (e.g., DeepFakes, Face2Face) and evaluate against completely novel held-out generators (e.g., NeuralTextures, FaceShifter) with zero retraining.',
    tip: '🏆 Ready to explore! Click Finish to interact with any section of the dashboard.',
    target: '#zeroshot',
    position: 'top',
  },
];

export default function Tour({ isOpen, onClose }) {
  const [step, setStep] = useState(0);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        e.preventDefault();
        setStep((s) => (s < TOUR_STEPS.length - 1 ? s + 1 : s));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setStep((s) => Math.max(0, s - 1));
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Target highlighting and scrolling
  useEffect(() => {
    if (!isOpen) {
      document.querySelectorAll('.tour-highlight').forEach((el) => el.classList.remove('tour-highlight'));
      return;
    }

    const current = TOUR_STEPS[step];
    document.querySelectorAll('.tour-highlight').forEach((el) => el.classList.remove('tour-highlight'));

    if (current && current.target) {
      const el = document.querySelector(current.target);
      if (el) {
        el.classList.add('tour-highlight');
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    return () => {
      document.querySelectorAll('.tour-highlight').forEach((el) => el.classList.remove('tour-highlight'));
    };
  }, [step, isOpen]);

  if (!isOpen) return null;

  const current = TOUR_STEPS[step];
  const isFirst = step === 0;
  const isLast = step === TOUR_STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      onClose();
    } else {
      setStep((s) => s + 1);
    }
  };

  const handlePrev = () => {
    setStep((s) => Math.max(0, s - 1));
  };

  return (
    <div className="tour-overlay">
      {/* Dimming backdrop */}
      <div className="tour-spotlight" onClick={onClose} />

      {/* Floating Tour Modal Card */}
      <div className={`tour-card tour-pos-${current.position}`} role="dialog" aria-modal="true">
        <div className="tour-header-bar">
          <span className="tour-badge">{current.badge}</span>
          <button className="tour-close-btn" onClick={onClose} title="Close Tour (Esc)">
            ✕
          </button>
        </div>

        {/* Progress bar */}
        <div className="tour-progress-bar-bg">
          <div
            className="tour-progress-bar-fill"
            style={{ width: `${((step + 1) / TOUR_STEPS.length) * 100}%` }}
          />
        </div>

        <div className="tour-title">{current.title}</div>
        <div className="tour-body">{current.body}</div>

        {current.tip && (
          <div className="tour-tip">
            {current.tip}
          </div>
        )}

        {/* Footer controls */}
        <div className="tour-actions">
          <div className="tour-dots">
            {TOUR_STEPS.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`tour-dot ${i === step ? 'active' : ''}`}
                onClick={() => setStep(i)}
                aria-label={`Go to step ${i + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button className="btn btn-ghost tour-btn-skip" onClick={onClose}>
              Skip Tour
            </button>
            {!isFirst && (
              <button className="btn btn-ghost" onClick={handlePrev}>
                ← Back
              </button>
            )}
            <button className="btn btn-primary tour-btn-next" onClick={handleNext}>
              {isLast ? 'Finish Tour ✓' : 'Next Step →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
