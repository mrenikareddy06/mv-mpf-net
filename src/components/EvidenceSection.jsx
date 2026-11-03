import { useState } from 'react';
import { TemporalChart, EpipolarScatter, EmbeddingScatter, ScoreBar } from './Charts.jsx';

const STREAMS = [
  { id: 'e1', label: 'E1', fullLabel: 'Static Manifold Deviation', color: '#3b82f6', tab: 'E1' },
  { id: 'e2', label: 'E2', fullLabel: 'Micro-Temporal Fluctuation', color: '#6366f1', tab: 'E2' },
  { id: 'e3a', label: 'E3a', fullLabel: 'Epipolar Geometric Residual', color: '#f59e0b', tab: 'E3a' },
  { id: 'e3b', label: 'E3b', fullLabel: 'Joint Embedding Agreement', color: '#0ea5e9', tab: 'E3b' },
];

function E1Panel({ score }) {
  // Simulated feature vector deviation
  const points = Array.from({ length: 32 }, (_, i) => {
    const authentic = 0.2 + Math.sin(i * 0.5) * 0.08 + Math.cos(i * 0.3) * 0.04;
    const query = authentic + (Math.random() * 2 - 1) * score * 0.4;
    return { i, authentic, query: Math.max(0, Math.min(1, query)) };
  });

  return (
    <div className="flex-col gap-4">
      <div className="info-box" style={{ borderLeftColor: '#3b82f6' }}>
        <div className="label-row">
          <span className="chip chip-blue">E1</span>
          <strong>Static Manifold Deviation</strong>
        </div>
        Single-view backbone (MPF-Net) extracts a high-dimensional visual representation from each frame.
        Authentic frames cluster tightly around a learned manifold. A manipulated frame deviates —
        its representation is anomalous relative to the authentic distribution. Distance is measured
        as a z-score against reference population statistics.
      </div>
      <div className="formula-box">
        {'E1 = z-score( ||φ(x) - μ_auth|| / σ_auth )'}
        {'\nwhere φ(·) = MPF-Net encoder, μ/σ = authentic statistics'}
      </div>

      {/* Feature deviation bars */}
      <div className="card" style={{ padding: 'var(--space-4)' }}>
        <div className="card-header">
          <span className="card-title" style={{ fontSize: '0.85rem' }}>
            Feature Dimension Comparison (32 dims, PCA-reduced)
          </span>
          <span className="chip chip-amber" style={{ fontSize: '0.65rem' }}>Simulated</span>
        </div>
        <div style={{ height: 80 }}>
          <svg width="100%" height="80" viewBox="0 0 640 80" preserveAspectRatio="none">
            {points.map((p) => {
              const x = (p.i / 31) * 620 + 10;
              const authY = 70 - p.authentic * 60;
              const queryY = 70 - p.query * 60;
              return (
                <g key={p.i}>
                  <circle cx={x} cy={authY} r="2" fill="#6366f1" opacity="0.6" />
                  <circle cx={x} cy={queryY} r="2.5" fill={score > 0.4 ? '#ef4444' : '#3b82f6'} opacity="0.85" />
                  {Math.abs(p.query - p.authentic) > 0.15 && (
                    <line x1={x} y1={authY} x2={x} y2={queryY} stroke="#ef4444" strokeWidth="0.5" opacity="0.4" />
                  )}
                </g>
              );
            })}
            <text x="12" y="10" fill="var(--text-muted)" fontSize="7" fontFamily="monospace">● authentic ref</text>
            <text x="96" y="10" fill={score > 0.4 ? '#ef4444' : '#3b82f6'} fontSize="7" fontFamily="monospace">● query frame</text>
          </svg>
        </div>
      </div>

      <div className="grid-2">
        <div className="stream-card">
          <div className="stream-subtitle mb-2">Anomaly Distance (normalised)</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, fontFamily: 'Space Grotesk', color: score > 0.5 ? 'var(--red)' : '#60a5fa' }}>
            {score.toFixed(3)}
          </div>
          <ScoreBar label="" value={score} color={score > 0.5 ? 'var(--red)' : '#3b82f6'} />
        </div>
        <div className="stream-card">
          <div className="stream-subtitle mb-2">Interpretation</div>
          <div style={{ fontSize: '0.82rem', color: score > 0.5 ? 'var(--red)' : 'var(--green)', lineHeight: 1.6 }}>
            {score > 0.5
              ? '⚠ Frame representation significantly deviates from the authentic manifold boundary.'
              : '✓ Frame sits within the authentic distribution. Low static anomaly.'}
          </div>
        </div>
      </div>
    </div>
  );
}

function E2Panel({ score }) {
  return (
    <div className="flex-col gap-4">
      <div className="info-box" style={{ borderLeftColor: '#6366f1' }}>
        <div className="label-row">
          <span className="chip chip-indigo">E2</span>
          <strong>Micro-Temporal Fluctuation</strong>
        </div>
        Deepfake generators produce subtle inter-frame inconsistencies invisible to the naked eye but
        detectable as anomalous temporal residuals. Frame-difference magnitudes are compared against
        an authentic temporal profile. A spike pattern (E2 score) flags unnatural frame transitions.
      </div>
      <div className="formula-box">
        {'E2(t) = ||Δφ(x_t) - Δφ(x_{t-1})|| / σ_temporal'}
        {'\nTemporal inconsistency score = mean peak magnitude above threshold τ'}
      </div>

      <div className="card" style={{ padding: 'var(--space-4)' }}>
        <div className="card-header">
          <span className="card-title" style={{ fontSize: '0.85rem' }}>Frame-to-Frame Residual Magnitude</span>
          <span className="chip chip-amber" style={{ fontSize: '0.65rem' }}>Simulated · 40 frames</span>
        </div>
        <TemporalChart score={score} width={640} height={100} />
        <div className="flex justify-between mt-2">
          <span className="text-xs text-muted font-mono">--- detection threshold τ</span>
          <span className="text-xs font-mono" style={{ color: score > 0.4 ? 'var(--red)' : 'var(--green)' }}>
            Temporal score: {score.toFixed(3)}
          </span>
        </div>
      </div>

      <div className="info-box" style={{ borderLeftColor: '#f59e0b' }}>
        <strong style={{ color: 'var(--amber)' }}>Physical Rationale: </strong>
        GAN and diffusion generators optimise per-frame pixel quality independently. The physical temporal coherence
        of authentic video (natural motion blur, rigid sensor integration) is not rigorously preserved,
        leaving a detectable high-frequency micro-fluctuation signature.
      </div>
    </div>
  );
}

function E3aPanel({ score }) {
  return (
    <div className="flex-col gap-4">
      <div className="info-box" style={{ borderLeftColor: '#f59e0b' }}>
        <div className="label-row">
          <span className="chip chip-amber">E3a</span>
          <strong>Epipolar Geometric Residual</strong>
        </div>
        The epipolar constraint dictates that corresponding physical points across two calibrated camera views must lie on
        conjugate epipolar lines defined by fundamental matrix F. A manipulated view
        violates this geometric constraint because the substituted 2D pixels do not obey the 3D camera rig baseline — producing elevated Sampson errors.
      </div>
      <div className="formula-box">
        {'Sampson(x, x\') = (x\'ᵀFx)² / [(Fx)₁² + (Fx)₂² + (Fᵀx\')₁² + (Fᵀx\')₂²]'}
        {'\nE3a = mean Sampson distance over detected face keypoints across stereo view pairs'}
      </div>

      <div className="card" style={{ padding: 'var(--space-4)' }}>
        <div className="card-header">
          <span className="card-title" style={{ fontSize: '0.85rem' }}>Point Correspondence Plot (Stereo View Pair)</span>
          <span className="chip chip-amber" style={{ fontSize: '0.65rem' }}>Simulated · 30 keypoints</span>
        </div>
        <EpipolarScatter score={score} width={500} height={150} />
      </div>

      <div className="grid-2">
        <div className="stream-card">
          <div className="stream-subtitle mb-2">Fundamental Matrix F</div>
          <div className="formula-box" style={{ fontSize: '0.72rem' }}>
            {`F = K'⁻ᵀ [t]× R K⁻¹`}
            {'\nK = camera intrinsics'}
            {'\nR, t = relative extrinsic pose'}
          </div>
        </div>
        <div className="stream-card">
          <div className="stream-subtitle mb-2">Geometric Residual (Sampson)</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, fontFamily: 'Space Grotesk', color: score > 0.5 ? 'var(--red)' : 'var(--amber)' }}>
            {(score * 4.2 + 0.08).toFixed(2)} px²
          </div>
          <div className="text-xs text-muted mt-2">
            {score > 0.5 ? '⚠ Exceeds inlier tolerance — epipolar constraint violated' : '✓ Within rigid stereo baseline tolerance'}
          </div>
        </div>
      </div>
    </div>
  );
}

function E3bPanel({ score }) {
  return (
    <div className="flex-col gap-4">
      <div className="info-box" style={{ borderLeftColor: '#0ea5e9' }}>
        <div className="label-row">
          <span className="chip chip-blue">E3b</span>
          <strong>Joint Embedding Agreement</strong>
        </div>
        DINOv2 self-supervised patch tokens produce view-invariant semantic embeddings. For authentic
        multi-camera footage, embeddings of the target subject across views cluster tightly.
        A forged view produces an embedding that drifts semantically from its authentic counterparts —
        quantified via Mahalanobis distance against the reference embedding distribution.
      </div>
      <div className="formula-box">
        {'D_M(q, μ, Σ) = √[(q - μ)ᵀ Σ⁻¹ (q - μ)]'}
        {'\nE3b = D_M(emb(view_q), μ_auth, Σ_auth)   [DINOv2 ViT-L/14 representation]'}
      </div>

      <div className="card" style={{ padding: 'var(--space-4)' }}>
        <div className="card-header">
          <span className="card-title" style={{ fontSize: '0.85rem' }}>Embedding Space (2D PCA projection)</span>
          <span className="chip chip-amber" style={{ fontSize: '0.65rem' }}>Simulated · authentic cluster + query</span>
        </div>
        <EmbeddingScatter score={score} width={500} height={150} />
      </div>

      <div className="grid-2">
        <div className="stream-card">
          <div className="stream-subtitle mb-2">Theoretical Principle</div>
          <div className="text-sm text-secondary" style={{ lineHeight: 1.65 }}>
            Self-supervised Vision Transformers learn view-equivariant features without label supervision.
            Cross-view agreement is a natural consequence of consistent subject identity — a strong semantic prior
            that deepfakes disrupt.
          </div>
        </div>
        <div className="stream-card">
          <div className="stream-subtitle mb-2">Mahalanobis Distance</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, fontFamily: 'Space Grotesk', color: score > 0.5 ? 'var(--red)' : 'var(--green)' }}>
            {(score * 6.8 + 0.3).toFixed(2)}
          </div>
          <div className="text-xs text-muted mt-2">
            {score > 0.5 ? '⚠ Query embedding outside 3σ authentic cluster' : '✓ Query within authentic embedding cluster'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EvidenceSection({ cameras }) {
  const [activeTab, setActiveTab] = useState('e1');
  const [manualScores, setManualScores] = useState(null);

  const maxCam = cameras.reduce((a, b) =>
    Math.max(a.e1, a.e2, a.e3a, a.e3b) > Math.max(b.e1, b.e2, b.e3a, b.e3b) ? a : b
  );

  const scores = manualScores || {
    e1: maxCam.e1, e2: maxCam.e2, e3a: maxCam.e3a, e3b: maxCam.e3b,
  };

  return (
    <section id="evidence" className="fade-in">
      <div className="section-header">
        <div>
          <div className="section-eyebrow">Section C · Evidence Stream Taxonomy</div>
          <h2 className="section-title">Three Evidence Streams</h2>
          <p className="section-desc">
            MV-MPF-Net aggregates four branches across three evidence streams. Each branch is
            independently evaluated per camera view and pooled across the multi-camera rig.
            Select a branch below to explore its mathematical formulation and output behavior.
          </p>
        </div>
      </div>

      {/* Score sliders for manual override */}
      <div className="card mb-6">
        <div className="card-header">
          <div className="card-title">Interactive Sensitivity Control</div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted">Adjust branch scores to evaluate fusion sensitivity</span>
            <button className="reset-btn" onClick={() => setManualScores(null)}>↺ Reset to scenario</button>
          </div>
        </div>
        <div className="grid-4" style={{ gap: 'var(--space-4)' }}>
          {STREAMS.map((s) => (
            <div key={s.id}>
              <div className="flex justify-between mb-2">
                <span className="text-xs font-mono font-bold" style={{ color: s.color }}>{s.label}</span>
                <span className="text-xs font-mono text-secondary">{scores[s.id].toFixed(3)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={scores[s.id]}
                onChange={(e) =>
                  setManualScores((prev) => ({
                    ...(prev || scores),
                    [s.id]: parseFloat(e.target.value),
                  }))
                }
                style={{ accentColor: s.color, width: '100%' }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Branch tabs */}
      <div className="tab-bar flex gap-2 mb-4" style={{ borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
        {STREAMS.map((s) => {
          const isActive = activeTab === s.id;
          return (
            <button
              key={s.id}
              className={`btn ${isActive ? 'btn-active' : 'btn-ghost'}`}
              onClick={() => setActiveTab(s.id)}
              style={{
                borderColor: isActive ? s.color : 'var(--border)',
                background: isActive ? `${s.color}15` : 'transparent',
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
              }}
            >
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: s.color, marginRight: 6 }}>
                {s.label}
              </span>
              {s.fullLabel}
            </button>
          );
        })}
      </div>

      {/* Branch content */}
      <div className="fade-in" key={activeTab}>
        {activeTab === 'e1' && <E1Panel score={scores.e1} />}
        {activeTab === 'e2' && <E2Panel score={scores.e2} />}
        {activeTab === 'e3a' && <E3aPanel score={scores.e3a} />}
        {activeTab === 'e3b' && <E3bPanel score={scores.e3b} />}
      </div>
    </section>
  );
}
