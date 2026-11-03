import { useState } from 'react';
import { FORGERY_FAMILIES } from '../data/demoData.js';

function ZeroShotDiagram({ heldOut }) {
  return (
    <div style={{ margin: 'var(--space-6) 0' }}>
      {/* Training pipeline */}
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <div className="text-xs text-muted uppercase mb-3" style={{ letterSpacing: '0.08em' }}>
          Leave-One-Family-Out Protocol
        </div>
        <div className="zs-diagram">
          {FORGERY_FAMILIES.map(f => (
            <div
              key={f.id}
              className={`zs-family ${f.id === heldOut ? 'heldout' : 'training'}`}
            >
              {f.id === heldOut && (
                <div style={{
                  position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
                  background: '#4f46e5', color: '#fff', fontSize: '0.6rem', fontWeight: 700,
                  padding: '2px 8px', borderRadius: 4, whiteSpace: 'nowrap',
                }}>
                  HELD-OUT (test only)
                </div>
              )}
              <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.1rem', color: f.color }}>
                {f.id}
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
                {f.label.split(' — ')[1]}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                {f.description}
              </div>
              <div style={{ marginTop: 8 }}>
                {f.methods.map(m => (
                  <span key={m} className="chip" style={{
                    background: f.id === heldOut ? 'rgba(99,102,241,0.12)' : 'var(--bg-card)',
                    color: f.id === heldOut ? '#a5b4fc' : 'var(--text-secondary)',
                    border: `1px solid ${f.id === heldOut ? 'rgba(99,102,241,0.3)' : 'var(--border)'}`,
                    marginRight: 4, marginBottom: 4, fontSize: '0.65rem',
                  }}>
                    {m}
                  </span>
                ))}
              </div>
              {f.id !== heldOut && (
                <div style={{ marginTop: 8, fontSize: '0.65rem', color: 'var(--green)', fontWeight: 600 }}>
                  ✓ Used for threshold fitting
                </div>
              )}
              {f.id === heldOut && (
                <div style={{ marginTop: 8, fontSize: '0.65rem', color: '#a5b4fc', fontWeight: 600 }}>
                  ✗ Excluded from threshold selection
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Process flow */}
      <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flexWrap: 'wrap' }}>
        {[
          { step: '1', label: 'Train MPF-Net backbone', sub: 'On all non-held-out families', color: 'var(--cyan)' },
          { step: '→', label: '', sub: '' },
          { step: '2', label: 'Fit thresholds', sub: `Using known families (excl. ${heldOut})`, color: 'var(--green)' },
          { step: '→', label: '', sub: '' },
          { step: '3', label: 'Zero-shot eval', sub: `Test on ${heldOut} — never seen during fitting`, color: 'var(--violet-light)' },
        ].map((s, i) => (
          s.step === '→'
            ? <div key={i} className="text-muted" style={{ fontSize: '1.2rem' }}>→</div>
            : (
              <div key={i} style={{
                background: 'var(--bg-raised)', border: `1px solid ${s.color}30`,
                borderRadius: 'var(--radius-md)', padding: 'var(--space-3) var(--space-4)',
                flex: 1, minWidth: 140,
              }}>
                <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.2rem', color: s.color }}>
                  Step {s.step}
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>
                  {s.label}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{s.sub}</div>
              </div>
            )
        ))}
      </div>
    </div>
  );
}

// Simulated metric table for illustration
function MetricTable({ heldOut }) {
  const families = FORGERY_FAMILIES;
  const rows = families.map(f => {
    const isTest = f.id === heldOut;
    // Deterministic illustrative numbers
    const hash = (f.id + heldOut).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const f1 = isTest
      ? (0.70 + (hash % 100) / 1000).toFixed(3)
      : (0.90 + (hash % 80) / 1000).toFixed(3);
    const auc = isTest
      ? (0.88 + (hash % 80) / 1000).toFixed(3)
      : (0.96 + (hash % 30) / 1000).toFixed(3);
    return { ...f, f1, auc, isTest };
  });

  return (
    <div className="card" style={{ overflowX: 'auto' }}>
      <div className="card-header">
        <div className="card-title">Illustrative Performance Table</div>
        <span className="chip chip-amber" style={{ fontSize: '0.65rem' }}>
          Illustrative values — not real experimental results
        </span>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)' }}>
            {['Family', 'Role', 'F1 (illus.)', 'AUC (illus.)'].map(h => (
              <th key={h} style={{
                padding: 'var(--space-2) var(--space-3)', textAlign: 'left',
                color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.75rem',
                letterSpacing: '0.06em', textTransform: 'uppercase',
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id} style={{
              borderBottom: '1px solid var(--border)',
              background: r.isTest ? 'rgba(124,58,237,0.05)' : 'transparent',
            }}>
              <td style={{ padding: 'var(--space-2) var(--space-3)', color: r.color, fontWeight: 600 }}>{r.label}</td>
              <td style={{ padding: 'var(--space-2) var(--space-3)' }}>
                {r.isTest
                  ? <span className="chip chip-violet">Zero-Shot Test</span>
                  : <span className="chip chip-green">Threshold Fitting</span>}
              </td>
              <td style={{ padding: 'var(--space-2) var(--space-3)', fontFamily: 'var(--font-mono)', color: r.isTest ? 'var(--violet-light)' : 'var(--text-primary)' }}>{r.f1}</td>
              <td style={{ padding: 'var(--space-2) var(--space-3)', fontFamily: 'var(--font-mono)', color: r.isTest ? 'var(--violet-light)' : 'var(--text-primary)' }}>{r.auc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ZeroShotSection() {
  const [heldOut, setHeldOut] = useState('F3');

  return (
    <section id="zeroshot" className="fade-in">
      <div className="section-header">
        <div>
          <div className="section-eyebrow">Section F</div>
          <h2 className="section-title">Zero-Shot Evaluation Protocol</h2>
          <p className="section-desc">
            MV-MPF-Net is designed to detect forgeries from <em>unseen</em> generation families —
            the leave-one-forgery-family-out protocol tests generalisation. Threshold selection uses
            only the known families; the held-out family is never used for any fitting.
          </p>
        </div>
      </div>

      <div className="info-box mb-4" style={{ borderLeftColor: 'var(--violet)' }}>
        <strong style={{ color: 'var(--violet-light)' }}>What "zero-shot" means here: </strong>
        The model sees forgeries from families F1 and F2 during threshold calibration but is then
        asked to detect F3 (a novel generation method) without any F3 examples.
        This tests the hypothesis that authentic video statistics generalise across forgery types —
        the authentic manifold is stable; only the deviation direction varies.
      </div>

      {/* Held-out selector */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-xs text-muted uppercase" style={{ letterSpacing: '0.08em' }}>Held-out family:</span>
        {FORGERY_FAMILIES.map(f => (
          <button
            key={f.id}
            className={`btn ${heldOut === f.id ? 'btn-active' : 'btn-ghost'}`}
            onClick={() => setHeldOut(f.id)}
            style={{ borderColor: heldOut === f.id ? f.color : undefined, color: heldOut === f.id ? f.color : undefined }}
          >
            {f.id}
          </button>
        ))}
      </div>

      <ZeroShotDiagram heldOut={heldOut} />

      <MetricTable heldOut={heldOut} />

      <div className="info-box red mt-4">
        <strong style={{ color: 'var(--red)' }}>Important: </strong>
        Numbers in the table above are illustrative placeholders generated deterministically
        from family IDs. They demonstrate the <em>structure</em> of a leave-one-out evaluation
        table. No experiments have been run; these are not real results.
      </div>
    </section>
  );
}
