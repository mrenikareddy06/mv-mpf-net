import { useState } from 'react';
import { FUSION_METHODS, computeFusion } from '../data/demoData.js';
import { ScoreBar, BeliefBar, VerdictRing } from './Charts.jsx';

export default function FusionSection({ cameras, fusionMethod, setFusionMethod }) {
  const result = computeFusion(cameras, fusionMethod);
  const isFake = result.fakeProbability >= 0.5;

  return (
    <section id="fusion" className="fade-in">
      <div className="section-header">
        <div>
          <div className="section-eyebrow">Section D</div>
          <h2 className="section-title">Evidence Fusion</h2>
          <p className="section-desc">
            Branch scores from E1, E2, E3a and E3b are combined into a single detection verdict.
            Three fusion strategies are available. Dempster–Shafer explicitly represents belief,
            plausibility and conflict — conflict is reported separately and does not automatically
            increase uncertainty without a principled reason.
          </p>
        </div>
      </div>

      {/* Method selector */}
      <div className="flex items-center gap-3 mb-6" style={{ flexWrap: 'wrap' }}>
        <span className="text-xs text-muted uppercase" style={{ letterSpacing: '0.08em' }}>Fusion Method:</span>
        {FUSION_METHODS.map(m => (
          <button
            key={m.id}
            className={`btn ${fusionMethod === m.id ? 'btn-active' : 'btn-ghost'}`}
            onClick={() => setFusionMethod(m.id)}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Method description */}
      <div className="info-box mb-6" style={{ borderLeftColor: '#3b82f6' }}>
        <strong style={{ color: '#93c5fd' }}>{FUSION_METHODS.find(m => m.id === fusionMethod)?.label}</strong>
        {' — '}
        {FUSION_METHODS.find(m => m.id === fusionMethod)?.description}
      </div>

      <div className="grid-2 mb-6">
        {/* Branch inputs */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Branch Inputs (max-pooled across views)</div>
            <span className="chip chip-blue">4 branches</span>
          </div>
          <ScoreBar label="E1" value={result.branchScores.e1} color="#3b82f6" />
          <ScoreBar label="E2" value={result.branchScores.e2} color="#6366f1" />
          <ScoreBar label="E3a" value={result.branchScores.e3a} color="#f59e0b" />
          <ScoreBar label="E3b" value={result.branchScores.e3b} color="#0ea5e9" />

          {/* Fusion formula */}
          <div className="formula-box mt-4" style={{ fontSize: '0.75rem' }}>
            {fusionMethod === 'mean' && 'p_fake = (E1 + E2 + E3a + E3b) / 4'}
            {fusionMethod === 'max' && 'p_fake = max(E1, E2, E3a, E3b)'}
            {fusionMethod === 'dempster' && [
              'Each branch → mass {m_F, m_R, m_U}',
              'm_F = s·0.85,  m_R = (1−s)·0.85,  m_U = 0.15',
              'Combined via Dempster\'s rule (normalised)',
              'Conflict K reported separately (not absorbed)',
              'p_fake = m_F + 0.5·m_U   [pignistic transform]',
            ].join('\n')}
          </div>
        </div>

        {/* Result */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-6)' }}>
          <VerdictRing probability={result.fakeProbability} size={140} />
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: 'Space Grotesk', fontSize: '1.1rem', fontWeight: 700,
              color: isFake ? 'var(--red)' : 'var(--green)',
            }}>
              {isFake ? '⚠ Suspected Forgery' : '✓ Appears Authentic'}
            </div>
            <div className="text-xs text-muted mt-1">
              Fake probability: <span className="font-mono" style={{ color: isFake ? 'var(--red)' : 'var(--green)' }}>
                {(result.fakeProbability * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* DST belief display */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Belief Distribution</div>
          {fusionMethod === 'dempster' && (
            <span className="text-xs text-muted">Conflict is shown separately — it is NOT added to uncertainty</span>
          )}
        </div>
        <BeliefBar
          beliefReal={result.beliefReal}
          beliefFake={result.beliefFake}
          uncertainty={result.uncertainty}
          conflict={result.conflict}
        />

        {fusionMethod === 'dempster' && result.conflict > 0.05 && (
          <div className="info-box amber mt-4">
            <strong style={{ color: 'var(--amber)' }}>Conflict K = {(result.conflict * 100).toFixed(1)}%</strong>
            {' — '}
            Non-zero conflict indicates branches assign evidence to contradictory hypotheses.
            Standard Dempster–Shafer normalises by (1−K) but does not conflate conflict with
            epistemic uncertainty. High conflict may indicate boundary cases or adversarial inputs.
          </div>
        )}

        {/* Metric grid */}
        <div className="stat-grid mt-6">
          {[
            { label: 'Belief in Real', val: result.beliefReal, color: 'var(--green)' },
            { label: 'Belief in Fake', val: result.beliefFake, color: 'var(--red)' },
            { label: 'Uncertainty', val: result.uncertainty, color: 'var(--amber)' },
            { label: 'Conflict K', val: result.conflict, color: '#9ca3af' },
          ].map(m => (
            <div key={m.label} className="stat-tile">
              <div className="stat-value" style={{ fontSize: '1.4rem', color: m.color }}>
                {(m.val * 100).toFixed(1)}%
              </div>
              <div className="stat-label">{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
