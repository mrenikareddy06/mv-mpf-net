import { useState } from 'react';
import { computeFusion, SCENARIOS } from '../data/demoData.js';
import { VerdictRing } from './Charts.jsx';
import BenchmarkTable from './BenchmarkTable.jsx';
import ForensicReportModal from './ForensicReportModal.jsx';

function TopContributor({ branchScores }) {
  const entries = Object.entries(branchScores).sort((a, b) => b[1] - a[1]);
  const [topKey, topVal] = entries[0];
  const labels = { e1: 'E1 — Static Manifold', e2: 'E2 — Micro-Temporal', e3a: 'E3a — Epipolar Geom.', e3b: 'E3b — Joint Embedding' };
  const colors = { e1: '#1d4ed8', e2: '#4338ca', e3a: '#b45309', e3b: '#0284c7' };
  return (
    <span style={{ color: colors[topKey], fontWeight: 700 }}>
      {labels[topKey]} ({(topVal * 100).toFixed(1)}%)
    </span>
  );
}

export default function ReportSection({ cameras, scenarioId, fusionMethod }) {
  const [isCertOpen, setIsCertOpen] = useState(false);
  const result = computeFusion(cameras, fusionMethod);
  const scenario = SCENARIOS[scenarioId];
  const isFake = result.fakeProbability >= 0.5;
  const suspicious = scenario.suspiciousViews;

  const explanation = isFake
    ? `The detection system identified elevated evidence across multiple branches. ${
        result.branchScores.e3a > 0.5 || result.branchScores.e3b > 0.5
          ? 'Cross-view consistency checks (E3a/E3b) show the strongest signal, suggesting the inserted face violates geometric and semantic agreement with the remaining authentic views.'
          : 'Static manifold and temporal fluctuation evidence (E1/E2) dominate, suggesting a per-frame artefact consistent with GAN or diffusion synthesis.'
      } Suspicious view(s): ${suspicious.length > 0 ? suspicious.map(v => v.toUpperCase()).join(', ') : 'none identified at this threshold'}.`
    : 'All evidence streams return scores within the authentic distribution. Cross-view geometric and embedding consistency is maintained across the camera rig. No manipulation artefacts detected above the calibrated threshold. [Simulated demonstration — not a real inference result.]';

  return (
    <section id="report" className="fade-in">
      <div className="section-header">
        <div>
          <div className="section-eyebrow">Section E · Formal Synthesis</div>
          <h2 className="section-title">Final Detection Report</h2>
          <p className="section-desc">
            End-to-end verdict synthesised from all evidence branches and the selected fusion method.
            All values reflect the current interactive scenario and slider settings.
          </p>
        </div>
      </div>

      <div className="info-box mb-6" style={{ borderLeftColor: '#d97706' }}>
        <strong style={{ color: '#b45309' }}>⚠ Demonstration Notice</strong>
        {' — '}
        All scores and verdicts below are computed from locally defined demo data using deterministic
        calculations. No real ML inference, no DINOv2, no actual video analysis is performed.
        This prototype illustrates the system architecture and evidence workflow only.
      </div>

      {/* Main verdict card */}
      <div className="card mb-6" style={{
        background: isFake ? '#fef2f2' : '#f0fdf4',
        borderColor: isFake ? '#fecaca' : '#bbf7d0',
      }}>
        <div style={{ display: 'flex', gap: 'var(--space-8)', alignItems: 'center', flexWrap: 'wrap' }}>
          <VerdictRing probability={result.fakeProbability} size={160} />
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: 'Space Grotesk', fontSize: '1.8rem', fontWeight: 800,
              color: isFake ? '#b91c1c' : '#15803d',
              marginBottom: 'var(--space-2)',
            }}>
              {isFake ? '⚠ Suspected Forgery' : '✓ Authentic'}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
              {[
                { label: 'Fake Probability', val: `${(result.fakeProbability * 100).toFixed(1)}%`, color: isFake ? '#b91c1c' : '#15803d' },
                { label: 'Uncertainty', val: `${(result.uncertainty * 100).toFixed(1)}%`, color: '#b45309' },
                { label: 'Suspicious Camera', val: suspicious.length > 0 ? suspicious.map(v => v.replace('cam-', 'Cam ').toUpperCase()).join(', ') : 'None', color: suspicious.length > 0 ? '#b91c1c' : 'var(--text-secondary)' },
                { label: 'Fusion Method', val: fusionMethod.charAt(0).toUpperCase() + fusionMethod.slice(1), color: '#1d4ed8' },
              ].map(item => (
                <div key={item.label}>
                  <div className="text-xs text-muted uppercase mb-1" style={{ letterSpacing: '0.07em', fontWeight: 600 }}>{item.label}</div>
                  <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, color: item.color }}>{item.val}</div>
                </div>
              ))}
            </div>

            <div className="text-xs text-muted uppercase mb-1" style={{ letterSpacing: '0.07em' }}>Top Evidence Contributor</div>
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <TopContributor branchScores={result.branchScores} />
            </div>

            <button
              className="btn btn-primary btn-sm"
              onClick={() => setIsCertOpen(true)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 600, padding: '7px 14px' }}
            >
              <span>📄</span>
              <span>Export Forensic Audit Certificate</span>
            </button>
          </div>
        </div>
      </div>

      {/* Decision explanation */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Decision Explanation</div>
          <span className="chip chip-amber" style={{ fontSize: '0.65rem' }}>Simulated reasoning</span>
        </div>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
          {explanation}
        </p>

        <hr className="divider" />

        {/* Branch summary */}
        <div className="grid-4" style={{ gap: 'var(--space-3)' }}>
          {[
            { key: 'e1', label: 'E1', name: 'Static Manifold', color: 'var(--cyan)' },
            { key: 'e2', label: 'E2', name: 'Micro-Temporal', color: 'var(--violet-light)' },
            { key: 'e3a', label: 'E3a', name: 'Epipolar Geom.', color: 'var(--amber)' },
            { key: 'e3b', label: 'E3b', name: 'Joint Embedding', color: 'var(--green)' },
          ].map(b => {
            const val = result.branchScores[b.key];
            return (
              <div key={b.key} className="stream-card" style={{ textAlign: 'center' }}>
                <div className="stream-badge" style={{ margin: '0 auto var(--space-2)', background: `${b.color}18`, color: b.color, border: `1px solid ${b.color}30` }}>
                  {b.label}
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'Space Grotesk', color: val > 0.5 ? 'var(--red)' : b.color }}>
                  {val.toFixed(3)}
                </div>
                <div className="text-xs text-muted mt-1">{b.name}</div>
                <div className="text-xs mt-1" style={{ color: val > 0.5 ? 'var(--red)' : 'var(--green)' }}>
                  {val > 0.5 ? '⚠' : '✓'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Benchmark comparison against existing single-view SOTA */}
      <div className="mt-8">
        <BenchmarkTable />
      </div>

      {/* Forensic Audit Certificate Modal */}
      <ForensicReportModal
        isOpen={isCertOpen}
        onClose={() => setIsCertOpen(false)}
        cameras={cameras}
        scenarioId={scenarioId}
        fusionMethod={fusionMethod}
        result={result}
      />
    </section>
  );
}
