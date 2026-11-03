import { useState, useEffect } from 'react';
import { SCENARIOS } from '../data/demoData.js';
import SceneSVG from './SceneSVG.jsx';
import { ScoreBar } from './Charts.jsx';

export default function CameraSection({ scenarioId, setScenarioId, selectedCam, setSelectedCam }) {
  const scenario = SCENARIOS[scenarioId];
  const cameras = scenario.cameras;
  const suspicious = scenario.suspiciousViews;

  // Live timer for CCTV timestamp
  const [timeStr, setTimeStr] = useState('14:23:45.81');
  useEffect(() => {
    const timer = setInterval(() => {
      const d = new Date();
      const ms = Math.floor(d.getMilliseconds() / 10).toString().padStart(2, '0');
      setTimeStr(`${d.toTimeString().split(' ')[0]}.${ms}`);
    }, 100);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="cameras" className="fade-in">
      <div className="section-header">
        <div>
          <div className="section-eyebrow">Section B · Multi-View Capture Rig</div>
          <h2 className="section-title">Synchronised Multi-Camera Surveillance</h2>
          <p className="section-desc">
            Four calibrated cameras capture the target from complementary spatial angles. While single-view detectors evaluate only 2D pixel statistics, MV-MPF-Net checks whether all 4 views obey 3D epipolar geometry and consistent semantic representations.
          </p>
        </div>
      </div>

      {/* Scenario selector */}
      <div id="scenario-switcher" className="scenario-switcher-bar">
        <div className="flex items-center gap-2">
          <span className="live-dot" />
          <span className="text-xs uppercase font-mono text-muted" style={{ letterSpacing: '0.08em', fontWeight: 600 }}>
            Threat Simulation Scenario:
          </span>
        </div>
        <div className="scenario-btn-group">
          {Object.values(SCENARIOS).map((s) => {
            const isActive = scenarioId === s.id;
            return (
              <button
                key={s.id}
                className={`scenario-btn ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setScenarioId(s.id);
                  setSelectedCam(null);
                }}
              >
                <span
                  className="scenario-btn-dot"
                  style={{
                    backgroundColor:
                      s.id === 'all_authentic'
                        ? '#16a34a'
                        : s.id === 'one_fake'
                        ? '#dc2626'
                        : '#d97706',
                  }}
                />
                <span className="scenario-btn-text">{s.label}</span>
                {isActive && <span className="scenario-active-chip">ACTIVE</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Scenario Info Alert */}
      <div
        className="scenario-alert-box"
        style={{
          borderLeftColor: scenario.suspiciousViews.length > 0 ? '#dc2626' : '#16a34a',
          background:
            scenario.suspiciousViews.length > 0
              ? '#fef2f2'
              : '#f0fdf4',
          borderColor:
            scenario.suspiciousViews.length > 0
              ? '#fecaca'
              : '#bbf7d0',
        }}
      >
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <strong style={{ color: scenario.suspiciousViews.length > 0 ? '#b91c1c' : '#15803d' }}>
              {scenario.suspiciousViews.length > 0
                ? '⚠ FORGERY THREAT MODEL ACTIVE'
                : '✓ AUTHENTIC BASELINE ACTIVE'}
            </strong>
            <span style={{ color: 'var(--text-secondary)', marginLeft: 8 }}>
              {scenario.description}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="badge-cctv">RIG TIME: {timeStr}</span>
            <span className="badge-cctv">SYNC: ±0.4ms</span>
          </div>
        </div>
      </div>

      {/* Camera 4-Grid */}
      <div id="cameras-grid" className="grid-4 mb-6">
        {cameras.map((cam) => {
          const isSuspicious = suspicious.includes(cam.id);
          const isSelected = selectedCam === cam.id;
          const aggScore = Math.max(cam.e1, cam.e2, cam.e3a, cam.e3b);

          return (
            <div
              key={cam.id}
              className={`camera-panel ${isSuspicious ? 'suspicious' : ''} ${isSelected ? 'selected' : ''}`}
              onClick={() => setSelectedCam(isSelected ? null : cam.id)}
              title={`Click to inspect ${cam.label} evidence`}
            >
              {/* CCTV Camera Header */}
              <div className="camera-cctv-header">
                <span className="cctv-cam-id">{cam.label}</span>
                <span className="cctv-angle-tag">{cam.angle}</span>
                <span className={`cctv-status-dot ${isSuspicious ? 'dot-red' : 'dot-green'}`} />
              </div>

              {/* Viewport Scene */}
              <div className="camera-scene">
                <SceneSVG cameraId={cam.id} suspicious={isSuspicious} selected={isSelected} />
              </div>

              {/* HUD Footer */}
              <div className="camera-hud">
                <div>
                  <div className="camera-label">{cam.label} · {cam.angle}</div>
                  {isSuspicious ? (
                    <div className="camera-status-alert">
                      <span className="status-blink-icon">⚠</span> ANOMALOUS VIEW
                    </div>
                  ) : (
                    <div className="camera-status-ok">✓ PASSES CHECKS</div>
                  )}
                </div>

                <div
                  className="camera-score-badge"
                  style={{
                    background: aggScore > 0.5 ? '#fef2f2' : '#eff6ff',
                    color: aggScore > 0.5 ? '#b91c1c' : '#1d4ed8',
                    border: `1px solid ${aggScore > 0.5 ? '#fecaca' : '#bfdbfe'}`,
                  }}
                >
                  <span className="score-val">{aggScore.toFixed(2)}</span>
                  <span className="score-lbl">{aggScore > 0.5 ? 'FLAGGED' : 'NORMAL'}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Camera Deep-Dive Inspection */}
      {selectedCam && (() => {
        const cam = cameras.find((c) => c.id === selectedCam);
        if (!cam) return null;
        const isSusp = suspicious.includes(cam.id);

        return (
          <div className="camera-inspection-card fade-in">
            <div className="inspection-header">
              <div className="flex items-center gap-3">
                <span className="chip chip-blue">{cam.label}</span>
                <span className="inspection-title">
                  Detailed Evidence Breakdown — Angle: {cam.angle}
                </span>
                {isSusp ? (
                  <span className="chip chip-red">⚠ Manipulated Stream</span>
                ) : (
                  <span className="chip chip-green">✓ Clean Stream</span>
                )}
              </div>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setSelectedCam(null)}
              >
                ✕ Close Breakdown
              </button>
            </div>

            <div className="grid-4 mt-4">
              {[
                {
                  label: 'E1',
                  desc: 'Static Manifold',
                  sub: 'Pixel artifact z-score',
                  val: cam.e1,
                  color: '#2563eb',
                },
                {
                  label: 'E2',
                  desc: 'Micro-Temporal',
                  sub: 'Flow temporal flicker',
                  val: cam.e2,
                  color: '#4f46e5',
                },
                {
                  label: 'E3a',
                  desc: 'Epipolar Geom.',
                  sub: 'F-matrix Sampson error',
                  val: cam.e3a,
                  color: '#d97706',
                },
                {
                  label: 'E3b',
                  desc: 'Joint Embedding',
                  sub: 'DINOv2 Mahalanobis dist.',
                  val: cam.e3b,
                  color: '#0284c7',
                },
              ].map((b) => (
                <div key={b.label} className="stream-card">
                  <div className="stream-header">
                    <div
                      className="stream-badge"
                      style={{
                        background: '#f8fafc',
                        color: b.color,
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      {b.label}
                    </div>
                    <div>
                      <div className="stream-title">{b.desc}</div>
                      <div className="stream-subtitle">{b.sub}</div>
                    </div>
                  </div>
                  <div
                    className="stream-val-display"
                    style={{ color: b.val > 0.5 ? '#dc2626' : b.color }}
                  >
                    {b.val.toFixed(3)}
                  </div>
                  <ScoreBar label="" value={b.val} color={b.val > 0.5 ? '#dc2626' : b.color} />
                  <div className="stream-thresh-lbl">
                    {b.val > 0.5 ? '↑ Exceeds baseline threshold' : '↓ Consistent with authentic baseline'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}
    </section>
  );
}
