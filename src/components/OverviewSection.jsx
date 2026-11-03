import { SCENARIOS, computeFusion } from '../data/demoData.js';
import SpatialRadarHologram from './SpatialRadarHologram.jsx';

function ArchDiagram() {
  return (
    <div id="arch-diagram" className="arch-container">
      <div className="card-header">
        <div className="card-title">
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
            <rect x="1" y="1" width="6" height="6" rx="1.5" fill="#2563eb" />
            <rect x="9" y="1" width="6" height="6" rx="1.5" fill="#4f46e5" />
            <rect x="1" y="9" width="6" height="6" rx="1.5" fill="#d97706" />
            <rect x="9" y="9" width="6" height="6" rx="1.5" fill="#16a34a" />
          </svg>
          System Architecture — Two-Tier Multi-View Pipeline
        </div>
        <span className="chip chip-blue">3 streams · 4 branches</span>
      </div>
      <svg width="100%" viewBox="0 0 820 220" style={{ fontFamily: 'Inter, -apple-system, sans-serif', overflow: 'visible' }}>
        <defs>
          <marker id="arrowhead-slate" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 Z" fill="#64748b" />
          </marker>
          <marker id="arrowhead-blue" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 Z" fill="#2563eb" />
          </marker>
        </defs>

        {/* Input cameras */}
        {['Cam A (Front-L)', 'Cam B (Front-R)', 'Cam C (Rear-L)', 'Cam D (Rear-R)'].map((c, i) => (
          <g key={c}>
            <rect
              x={14 + i * 82}
              y={14}
              width={76}
              height={28}
              rx="4"
              fill="#ffffff"
              stroke="#cbd5e1"
              strokeWidth="1.2"
            />
            <text
              x={52 + i * 82}
              y={32}
              textAnchor="middle"
              fill="#0f172a"
              fontSize="8.5"
              fontWeight="600"
            >
              {c}
            </text>
          </g>
        ))}

        {/* Connector lines from cameras to MPF-Net */}
        {[52, 134, 216, 298].map((x) => (
          <line
            key={x}
            x1={x}
            y1={42}
            x2={x}
            y2={68}
            stroke="#2563eb"
            strokeWidth="1.2"
            strokeDasharray="3 2"
            markerEnd="url(#arrowhead-blue)"
          />
        ))}

        {/* MPF-Net backbone */}
        <rect
          x={14}
          y={68}
          width={326}
          height={38}
          rx="6"
          fill="#eff6ff"
          stroke="#93c5fd"
          strokeWidth="1.2"
        />
        <text x={177} y={85} textAnchor="middle" fill="#1e40af" fontSize="10.5" fontWeight="700">
          MPF-Net Backbone (Single-View)
        </text>
        <text x={177} y={98} textAnchor="middle" fill="#3b82f6" fontSize="8" fontWeight="500">
          per-camera spatial & temporal feature extraction
        </text>

        {/* Connector: cameras → E1, E2 */}
        <line x1={100} y1={106} x2={100} y2={130} stroke="#2563eb" strokeWidth="1.2" markerEnd="url(#arrowhead-slate)" />
        <line x1={250} y1={106} x2={250} y2={130} stroke="#4f46e5" strokeWidth="1.2" markerEnd="url(#arrowhead-slate)" />

        {/* E1, E2 branches */}
        <rect
          x={24}
          y={130}
          width={153}
          height={34}
          rx="4"
          fill="#f8fafc"
          stroke="#bfdbfe"
          strokeWidth="1.2"
        />
        <text x={100} y={148} textAnchor="middle" fill="#1d4ed8" fontSize="9.5" fontWeight="700">
          E1 — Static Manifold
        </text>
        <text x={100} y={159} textAnchor="middle" fill="#64748b" fontSize="7.5" fontWeight="500">
          autoencoder z-score
        </text>

        <rect
          x={194}
          y={130}
          width={140}
          height={34}
          rx="4"
          fill="#f8fafc"
          stroke="#c7d2fe"
          strokeWidth="1.2"
        />
        <text x={264} y={148} textAnchor="middle" fill="#4338ca" fontSize="9.5" fontWeight="700">
          E2 — Micro-Temporal
        </text>
        <text x={264} y={159} textAnchor="middle" fill="#64748b" fontSize="7.5" fontWeight="500">
          optical flow variance
        </text>

        {/* Cross-view connector from cams */}
        <line x1={360} y1={28} x2={420} y2={28} stroke="#d97706" strokeWidth="1.2" strokeDasharray="3 2" />
        <line x1={420} y1={28} x2={420} y2={68} stroke="#d97706" strokeWidth="1.2" markerEnd="url(#arrowhead-slate)" />

        {/* Cross-view consistency module */}
        <rect
          x={400}
          y={68}
          width={406}
          height={38}
          rx="6"
          fill="#fffbeb"
          stroke="#fde68a"
          strokeWidth="1.2"
        />
        <text x={603} y={85} textAnchor="middle" fill="#b45309" fontSize="10.5" fontWeight="700">
          Cross-View Consistency Module (Novel Proposed Extension)
        </text>
        <text x={603} y={98} textAnchor="middle" fill="#d97706" fontSize="8" fontWeight="500">
          multi-camera geometric and semantic stereo constraints
        </text>

        <line x1={490} y1={106} x2={490} y2={130} stroke="#d97706" strokeWidth="1.2" markerEnd="url(#arrowhead-slate)" />
        <line x1={715} y1={106} x2={715} y2={130} stroke="#0284c7" strokeWidth="1.2" markerEnd="url(#arrowhead-slate)" />

        {/* E3a, E3b branches */}
        <rect
          x={406}
          y={130}
          width={170}
          height={34}
          rx="4"
          fill="#f8fafc"
          stroke="#fde68a"
          strokeWidth="1.2"
        />
        <text x={491} y={148} textAnchor="middle" fill="#b45309" fontSize="9.5" fontWeight="700">
          E3a — Epipolar Geom.
        </text>
        <text x={491} y={159} textAnchor="middle" fill="#64748b" fontSize="7.5" fontWeight="500">
          Fundamental F-matrix Sampson
        </text>

        <rect
          x={630}
          y={130}
          width={170}
          height={34}
          rx="4"
          fill="#f8fafc"
          stroke="#bae6fd"
          strokeWidth="1.2"
        />
        <text x={715} y={148} textAnchor="middle" fill="#0369a1" fontSize="9.5" fontWeight="700">
          E3b — Joint Embedding
        </text>
        <text x={715} y={159} textAnchor="middle" fill="#64748b" fontSize="7.5" fontWeight="500">
          DINOv2 cross-angle distance
        </text>

        {/* Converge to fusion */}
        {[100, 264, 491, 715].map((x) => (
          <line
            key={`v${x}`}
            x1={x}
            y1={164}
            x2={x}
            y2={186}
            stroke="#cbd5e1"
            strokeWidth="1.2"
          />
        ))}
        <line x1={100} y1={186} x2={715} y2={186} stroke="#cbd5e1" strokeWidth="1.2" />
        <line x1={408} y1={186} x2={408} y2={200} stroke="#2563eb" strokeWidth="1.2" markerEnd="url(#arrowhead-slate)" />

        {/* Fusion node */}
        <rect
          x={280}
          y={200}
          width={256}
          height={18}
          rx="4"
          fill="#1d4ed8"
          stroke="#1e40af"
          strokeWidth="1"
        />
        <text x={408} y={213} textAnchor="middle" fill="#ffffff" fontSize="8.5" fontWeight="600">
          Dempster-Shafer Evidence Fusion → Final Verdict
        </text>
      </svg>
    </div>
  );
}

export default function OverviewSection({
  scenarioId,
  setScenarioId,
  fusionMethod,
  cameras,
  onStartTour,
  onNavigate,
}) {
  const result = computeFusion(cameras, fusionMethod);
  const scenario = SCENARIOS[scenarioId];
  const isFake = result.fakeProbability >= 0.5;

  const stats = [
    { label: 'Camera Views', val: '4 Views', sub: 'Synchronised 360° rig', color: '#1d4ed8' },
    { label: 'Evidence Streams', val: '3 Streams', sub: 'Spatial, Temporal, Stereo', color: '#4338ca' },
    { label: 'Evidence Branches', val: '4 Branches', sub: 'E1, E2, E3a, E3b', color: '#b45309' },
    {
      label: 'Active Scenario',
      val: scenario.suspiciousViews.length > 0 ? 'Tampered' : 'Authentic',
      sub: scenario.label,
      color: scenario.suspiciousViews.length > 0 ? 'var(--red)' : 'var(--green)',
    },
    {
      label: 'Fusion Method',
      val: fusionMethod === 'dempster' ? 'DST (Belief)' : fusionMethod.toUpperCase(),
      sub: 'Principled uncertainty',
      color: '#0f172a',
    },
    {
      label: 'Forgery Probability',
      val: `${(result.fakeProbability * 100).toFixed(0)}%`,
      sub: isFake ? '⚠ Exceeds decision threshold' : '✓ Below decision threshold',
      color: isFake ? 'var(--red)' : 'var(--green)',
    },
    {
      label: 'Epistemic Uncertainty',
      val: `${(result.uncertainty * 100).toFixed(0)}%`,
      sub: 'Dempster mass on Θ',
      color: '#b45309',
    },
    {
      label: 'Final Verdict',
      val: isFake ? 'MANIPULATED' : 'AUTHENTIC',
      sub: 'Zero-shot decision',
      color: isFake ? 'var(--red)' : 'var(--green)',
    },
  ];

  return (
    <section id="overview" className="fade-in">
      {/* 2-Column Hero Section */}
      <div className="hero-grid">
        {/* Left Column: Hero Copy & Actions */}
        <div className="hero-copy">
          <div className="hero-eyebrow">
            <span className="live-dot" />
            <span>B.Tech Capstone Project · Defense Prototype</span>
          </div>

          <h1 className="hero-title">
            <span className="hero-title-gradient">MV-MPF-Net</span>
            <span className="hero-title-sub">
              Zero-Shot Multi-View Video Forgery Detection
              <br />
              <span className="hero-title-highlight">Using Cross-View Consistency</span>
            </span>
          </h1>

          <p className="hero-subtitle">
            While single-camera deepfake detectors are vulnerable to novel generative artifacts,
            <strong> MV-MPF-Net</strong> exploits multi-camera geometric constraints (epipolar Sampson distance)
            and multi-angle feature manifolds (DINOv2) to expose manipulations without requiring forgery-specific training.
          </p>

          {/* Interactive CTAs */}
          <div className="hero-cta-group">
            <button
              id="hero-walkthrough-btn"
              className="btn btn-hero-walkthrough"
              onClick={onStartTour}
              title="Launch the 9-step interactive walkthrough"
            >
              <span className="hero-btn-icon">✨</span>
              <span>
                <strong>Launch Guided Walkthrough</strong>
                <small className="hero-btn-sub">Interactive 9-Step Evaluation Tour</small>
              </span>
            </button>

            <button
              className="btn btn-hero-ghost"
              onClick={() => onNavigate && onNavigate('cameras')}
            >
              <span>◫ Live Multi-Camera Grid</span>
            </button>
          </div>

          {/* Quick Scenario Toggles */}
          <div className="hero-quick-scenarios" id="hero-quick-switcher">
            <span className="hero-quick-lbl">Quick Scenario Test:</span>
            {Object.values(SCENARIOS).map((s) => (
              <button
                key={s.id}
                className={`hero-scenario-chip ${scenarioId === s.id ? 'active' : ''}`}
                onClick={() => setScenarioId && setScenarioId(s.id)}
              >
                <span
                  className="hero-scenario-dot"
                  style={{
                    backgroundColor:
                      s.id === 'all_authentic'
                        ? 'var(--green)'
                        : s.id === 'one_fake'
                        ? 'var(--red)'
                        : 'var(--amber)',
                  }}
                />
                {s.label}
              </button>
            ))}
          </div>

          {/* Technical Badges */}
          <div className="hero-pills">
            <span className="chip chip-indigo">⊘ Zero-Shot (Leave-One-Family-Out)</span>
            <span className="chip chip-blue">◫ 4-View Epipolar Geometry</span>
            <span className="chip chip-amber">⟁ Dempster-Shafer Fusion</span>
            <span className="chip chip-green">∑ Client-Side · Zero External GPU</span>
          </div>
        </div>

        {/* Right Column: Spatial Radar Hologram */}
        <div className="hero-radar-col">
          <SpatialRadarHologram scenarioId={scenarioId} cameras={cameras} />
        </div>
      </div>

      <div className="divider" style={{ margin: '32px 0' }} />

      {/* Architecture Diagram */}
      <ArchDiagram />

      {/* Live Stats Metric Tiles */}
      <div className="stat-grid mt-6">
        {stats.map((s) => (
          <div key={s.label} className="stat-tile">
            <div className="stat-value" style={{ color: s.color }}>{s.val}</div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Key Concept Cards */}
      <div className="grid-3 mt-6">
        {[
          {
            icon: '⬡',
            title: '1. Single-View Backbone (MPF-Net)',
            badge: 'Tier 1 Baseline',
            color: '#1d4ed8',
            borderColor: '#bfdbfe',
            body: 'MPF-Net analyzes each camera stream independently using static spatial autoencoders (E1) and micro-temporal optical flow residuals (E2) to flag unnatural pixel artifacts.',
          },
          {
            icon: '⟁',
            title: '2. Cross-View Consistency (Our Contribution)',
            badge: 'Tier 2 Novelty',
            color: '#b45309',
            borderColor: '#fde68a',
            body: 'Enforces rigorous stereo epipolar geometry via Fundamental matrix Sampson distance (E3a) and multi-angle semantic correspondence with DINOv2 (E3b) to catch manipulations invisible in 2D.',
          },
          {
            icon: '∅',
            title: '3. Zero-Shot Generalisation Protocol',
            badge: 'Evaluation Rigor',
            color: '#4338ca',
            borderColor: '#c7d2fe',
            body: 'Thresholds are calibrated exclusively on authentic footage and known forgery families. Tested against completely novel generative attacks (e.g. FaceShifter, NeuralTextures) without retraining.',
          },
        ].map((c) => (
          <div key={c.title} className="concept-card" style={{ borderLeft: `3px solid ${c.color}` }}>
            <div className="concept-card-top">
              <div
                className="concept-icon-box"
                style={{
                  background: '#f8fafc',
                  color: c.color,
                  border: `1px solid ${c.borderColor}`,
                }}
              >
                {c.icon}
              </div>
              <div>
                <span className="concept-badge">{c.badge}</span>
                <div className="concept-title" style={{ color: c.color }}>
                  {c.title}
                </div>
              </div>
            </div>
            <div className="concept-body">{c.body}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
