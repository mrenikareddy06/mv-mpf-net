import { useState, useRef, useEffect } from 'react';
import { SCENARIOS, computeFusion } from './data/demoData.js';
import OverviewSection from './components/OverviewSection.jsx';
import CameraSection from './components/CameraSection.jsx';
import EvidenceSection from './components/EvidenceSection.jsx';
import FusionSection from './components/FusionSection.jsx';
import ReportSection from './components/ReportSection.jsx';
import ZeroShotSection from './components/ZeroShotSection.jsx';
import Tour from './components/Tour.jsx';
import DefenseScriptModal from './components/DefenseScriptModal.jsx';

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: '⬡', eyebrow: 'A' },
  { id: 'cameras', label: 'Camera Analysis', icon: '◫', eyebrow: 'B' },
  {
    id: 'evidence',
    label: 'Evidence Streams',
    icon: '⟁',
    eyebrow: 'C',
    sub: [
      { id: 'evidence-e1', label: 'E1 — Static Manifold' },
      { id: 'evidence-e2', label: 'E2 — Micro-Temporal' },
      { id: 'evidence-e3a', label: 'E3a — Epipolar' },
      { id: 'evidence-e3b', label: 'E3b — Embedding' },
    ],
  },
  { id: 'fusion', label: 'Evidence Fusion', icon: '⋈', eyebrow: 'D' },
  { id: 'report', label: 'Detection Report', icon: '▦', eyebrow: 'E' },
  { id: 'zeroshot', label: 'Zero-Shot Protocol', icon: '∅', eyebrow: 'F' },
];

function LogoMark() {
  return (
    <svg width="32" height="32" viewBox="0 0 28 28" fill="none">
      <rect width="28" height="28" rx="7" fill="url(#logo-grad)" />
      <circle cx="14" cy="14" r="9" stroke="#fff" strokeWidth="1.5" strokeOpacity="0.8" fill="none" />
      <circle cx="14" cy="14" r="3.5" fill="#fff" fillOpacity="0.95" />
      <line x1="14" y1="4" x2="14" y2="24" stroke="#fff" strokeWidth="0.8" strokeOpacity="0.5" />
      <line x1="4" y1="14" x2="24" y2="14" stroke="#fff" strokeWidth="0.8" strokeOpacity="0.5" />
      <defs>
        <linearGradient id="logo-grad" x1="0" y1="0" x2="28" y2="28">
          <stop stopColor="#1e40af" />
          <stop offset="1" stopColor="#2563eb" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function Sidebar({ activeSection, onNavigate, onStartTour }) {
  return (
    <nav className="sidebar">
      <div className="sidebar-section-label">Navigation</div>
      {NAV_ITEMS.map((item) => (
        <div key={item.id}>
          <div
            className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <span style={{ fontFamily: 'monospace', fontSize: '0.95rem', width: 20, textAlign: 'center' }}>
              {item.icon}
            </span>
            <span style={{ flex: 1, fontWeight: activeSection === item.id ? 600 : 400 }}>
              {item.label}
            </span>
            <span className="text-muted" style={{ fontSize: '0.65rem', fontFamily: 'monospace' }}>
              {item.eyebrow}
            </span>
          </div>
          {item.sub && activeSection === item.id && item.sub.map((s) => (
            <div
              key={s.id}
              className="nav-item nav-item-sub"
              onClick={() => onNavigate(s.id)}
            >
              {s.label}
            </div>
          ))}
        </div>
      ))}

      {/* Tour Quick Launcher In Sidebar */}
      <div className="sidebar-tour-box">
        <button className="sidebar-tour-btn" onClick={onStartTour}>
          <span className="sidebar-tour-icon">✨</span>
          <div className="text-left">
            <div className="sidebar-tour-title">Interactive Tour</div>
            <div className="sidebar-tour-sub">9-Step Guided Walkthrough</div>
          </div>
        </button>
      </div>

      <div style={{ marginTop: 'auto', padding: 'var(--space-4)' }}>
        <div className="sidebar-capstone-card">
          <div className="flex items-center justify-between mb-1">
            <span className="sidebar-capstone-badge">B.TECH CAPSTONE</span>
            <span className="live-dot" />
          </div>
          <div className="sidebar-capstone-title">
            MV-MPF-Net Prototype
          </div>
          <div className="sidebar-capstone-desc">
            Multi-View Cross-Consistency Video Forgery Detection
          </div>
          <div className="sidebar-capstone-footer">
            Zero-Shot Evaluation · No GPU Needed
          </div>
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  const [scenarioId, setScenarioId] = useState('one_fake');
  const [selectedCam, setSelectedCam] = useState(null);
  const [fusionMethod, setFusionMethod] = useState('dempster');
  const [activeSection, setActiveSection] = useState('overview');
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [isScriptOpen, setIsScriptOpen] = useState(false);

  const mainRef = useRef(null);

  const cameras = SCENARIOS[scenarioId].cameras;
  const result = computeFusion(cameras, fusionMethod);
  const isFake = result.fakeProbability >= 0.5;

  const handleNavigate = (id) => {
    setActiveSection(id.split('-')[0]);
    const el = document.getElementById(id.split('-')[0]);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleReset = () => {
    setScenarioId('one_fake');
    setSelectedCam(null);
    setFusionMethod('dempster');
    setActiveSection('overview');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Keyboard shortcut: Press '?' or 'T' to launch the tour
  useEffect(() => {
    const handleKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 't' || e.key === 'T' || e.key === '?') {
        setIsTourOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Update active section on scroll
  useEffect(() => {
    const sections = NAV_ITEMS.map((n) => document.getElementById(n.id)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id);
        });
      },
      { threshold: 0.25 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="app-layout">
      {/* Top bar */}
      <header className="topbar">
        <div className="topbar-logo" onClick={handleReset} style={{ cursor: 'pointer' }}>
          <LogoMark />
          <div>
            <div className="topbar-title">MV-MPF-Net</div>
            <div className="topbar-subtitle">Zero-Shot Multi-View Forgery Detection</div>
          </div>
        </div>

        <div className="topbar-sep" />

        {/* Live status */}
        <div className="topbar-live-status">
          <span className="live-dot" />
          <span className="text-xs font-mono text-muted">SYNCHRONISED RIG (4 CAMS)</span>
        </div>

        {/* Current verdict indicator */}
        <div
          id="topbar-verdict-indicator"
          className={`topbar-verdict-chip ${isFake ? 'verdict-fake' : 'verdict-real'}`}
          title="Aggregated Cross-View Decision"
        >
          <span className="verdict-icon">{isFake ? '⚠' : '✓'}</span>
          <span>
            {isFake ? 'FORGERY DETECTED' : 'AUTHENTIC FOOTAGE'} · {(result.fakeProbability * 100).toFixed(0)}%
          </span>
        </div>

        <span className="topbar-badge sim">Deterministic Demo</span>

        {/* Glowing Guided Walkthrough Button */}
        <button
          id="topbar-walkthrough-btn"
          className="topbar-walkthrough-btn"
          onClick={() => setIsTourOpen(true)}
          title="Open interactive 9-step prototype tour (Shortcut: 'T')"
        >
          <span className="tour-sparkle">✨</span>
          <span>Guided Tour</span>
          <span className="tour-badge-step">9 Steps</span>
        </button>

        {/* Defense Script & Panel Cheat Sheet */}
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => setIsScriptOpen(true)}
          title="Open presenter cheat sheet & panel Q&A guide"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 600, padding: '6px 12px', borderRadius: 8 }}
        >
          <span>📋</span>
          <span>Defense Script</span>
        </button>

        <button className="reset-btn" onClick={handleReset} title="Reset prototype to initial state">
          ↺ Reset
        </button>
      </header>

      {/* Sidebar */}
      <Sidebar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onStartTour={() => setIsTourOpen(true)}
      />

      {/* Main content */}
      <main className="main-content" ref={mainRef}>
        <OverviewSection
          scenarioId={scenarioId}
          setScenarioId={setScenarioId}
          fusionMethod={fusionMethod}
          cameras={cameras}
          onStartTour={() => setIsTourOpen(true)}
          onNavigate={handleNavigate}
        />

        <hr className="divider" />

        <CameraSection
          scenarioId={scenarioId}
          setScenarioId={setScenarioId}
          selectedCam={selectedCam}
          setSelectedCam={setSelectedCam}
        />

        <hr className="divider" />

        <EvidenceSection cameras={cameras} />

        <hr className="divider" />

        <FusionSection
          cameras={cameras}
          fusionMethod={fusionMethod}
          setFusionMethod={setFusionMethod}
        />

        <hr className="divider" />

        <ReportSection
          cameras={cameras}
          scenarioId={scenarioId}
          fusionMethod={fusionMethod}
        />

        <hr className="divider" />

        <ZeroShotSection />

        {/* Footer */}
        <footer className="prototype-footer">
          <div>
            <div className="footer-title">
              MV-MPF-Net: Zero-Shot Multi-View Video Forgery Detection
            </div>
            <div className="footer-sub">
              B.Tech Capstone Project · Interactive defense prototype · Deterministic local demo with zero external dependencies
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <span className="chip chip-amber">Defense Prototype</span>
            <span className="chip chip-cyan">No GPU Required</span>
            <span className="chip chip-violet">Zero-Shot Protocol</span>
            <button className="btn btn-ghost btn-sm" onClick={() => setIsTourOpen(true)}>
              ✨ Restart Tour
            </button>
          </div>
        </footer>
      </main>

      {/* Guided Walkthrough Tour Overlay */}
      <Tour isOpen={isTourOpen} onClose={() => setIsTourOpen(false)} />

      {/* Defense Script & Cheat Sheet Modal */}
      <DefenseScriptModal isOpen={isScriptOpen} onClose={() => setIsScriptOpen(false)} />
    </div>
  );
}
