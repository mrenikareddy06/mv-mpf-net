export default function ForensicReportModal({ isOpen, onClose, cameras, scenarioId, fusionMethod, result }) {
  if (!isOpen) return null;

  const isFake = result.fakeProbability >= 0.5;
  const timestamp = new Date().toISOString();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="tour-overlay">
      <div className="tour-spotlight" onClick={onClose} />
      <div
        className="tour-card"
        style={{
          maxWidth: 780,
          maxHeight: '90vh',
          overflowY: 'auto',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: '#ffffff',
          border: '1px solid #cbd5e1',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          padding: '28px 32px',
        }}
      >
        {/* Top Control Bar */}
        <div className="flex justify-between items-center pb-3 mb-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="chip chip-blue">Forensic Certificate</span>
            <span className="text-xs font-mono text-slate-500">REF: #MV-2024-8842-SEC</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn btn-primary btn-sm" onClick={handlePrint}>
              🖨️ Print / Save as PDF
            </button>
            <button onClick={onClose} className="tour-close-btn" style={{ fontSize: '1.2rem', padding: '2px 8px' }}>
              ✕
            </button>
          </div>
        </div>

        {/* Printable Certificate Body */}
        <div id="printable-audit-certificate" style={{ color: '#0f172a' }}>
          {/* Certificate Header */}
          <div style={{ textAlign: 'center', borderBottom: '2px solid #0f172a', paddingBottom: 16, marginBottom: 20 }}>
            <h1 style={{ fontFamily: 'Space Grotesk', fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
              Multi-View Video Forensic Verification Audit
            </h1>
            <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: 4 }}>
              MV-MPF-Net Zero-Shot Geometric & Semantic Cross-Consistency Engine
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 20, fontSize: '0.72rem', color: '#64748b', marginTop: 8, fontFamily: 'monospace' }}>
              <span>AUDIT TIME: {timestamp}</span>
              <span>RIG ID: MV-SURV-4CAM-A</span>
              <span>FUSION MODEL: {fusionMethod.toUpperCase()}</span>
            </div>
          </div>

          {/* Verdict Banner */}
          <div
            style={{
              padding: '16px 20px',
              borderRadius: 6,
              background: isFake ? '#fef2f2' : '#f0fdf4',
              border: `1.5px solid ${isFake ? '#dc2626' : '#16a34a'}`,
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', color: isFake ? '#b91c1c' : '#15803d', textTransform: 'uppercase' }}>
                Official Automated Assessment
              </div>
              <div style={{ fontFamily: 'Space Grotesk', fontSize: '1.5rem', fontWeight: 800, color: isFake ? '#b91c1c' : '#15803d', marginTop: 2 }}>
                {isFake ? 'MANIPULATION CONFIRMED (SUSPECTED FORGERY)' : 'AUTHENTIC MULTI-VIEW FOOTAGE VERIFIED'}
              </div>
              <div style={{ fontSize: '0.78rem', color: isFake ? '#7f1d1d' : '#14532d', marginTop: 4 }}>
                {isFake
                  ? 'Severe epipolar geometry breakdown detected across stereoscopic camera pairs.'
                  : 'All 4 views strictly conform to baseline stereo epipolar geometry and semantic feature manifold.'}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '2rem', fontFamily: 'Space Grotesk', fontWeight: 800, color: isFake ? '#b91c1c' : '#15803d', lineHeight: 1 }}>
                {(result.fakeProbability * 100).toFixed(1)}%
              </div>
              <div style={{ fontSize: '0.68rem', fontFamily: 'monospace', color: '#64748b' }}>CONFIDENCE RATING</div>
            </div>
          </div>

          {/* Camera Telemetry Table */}
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#334155', marginBottom: 8 }}>
              Synchronised Camera Stream Analysis (4 Views)
            </h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #cbd5e1' }}>
                  <th style={{ padding: '8px 10px', fontWeight: 600 }}>Stream ID</th>
                  <th style={{ padding: '8px 10px', fontWeight: 600 }}>Angle</th>
                  <th style={{ padding: '8px 10px', fontWeight: 600 }}>E1 (Static)</th>
                  <th style={{ padding: '8px 10px', fontWeight: 600 }}>E2 (Temporal)</th>
                  <th style={{ padding: '8px 10px', fontWeight: 600 }}>E3a (Epipolar)</th>
                  <th style={{ padding: '8px 10px', fontWeight: 600 }}>E3b (Embedding)</th>
                  <th style={{ padding: '8px 10px', fontWeight: 700, textAlign: 'right' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {cameras.map((cam) => {
                  const maxVal = Math.max(cam.e1, cam.e2, cam.e3a, cam.e3b);
                  const isTampered = maxVal > 0.5;
                  return (
                    <tr key={cam.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '8px 10px', fontWeight: 700, fontFamily: 'monospace' }}>{cam.label}</td>
                      <td style={{ padding: '8px 10px', color: '#64748b' }}>{cam.angle}</td>
                      <td style={{ padding: '8px 10px', fontFamily: 'monospace' }}>{cam.e1.toFixed(3)}</td>
                      <td style={{ padding: '8px 10px', fontFamily: 'monospace' }}>{cam.e2.toFixed(3)}</td>
                      <td style={{ padding: '8px 10px', fontFamily: 'monospace', fontWeight: cam.e3a > 0.5 ? 700 : 400, color: cam.e3a > 0.5 ? '#b91c1c' : 'inherit' }}>
                        {cam.e3a.toFixed(3)}
                      </td>
                      <td style={{ padding: '8px 10px', fontFamily: 'monospace', fontWeight: cam.e3b > 0.5 ? 700 : 400, color: cam.e3b > 0.5 ? '#b91c1c' : 'inherit' }}>
                        {cam.e3b.toFixed(3)}
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'right' }}>
                        <span
                          style={{
                            padding: '2px 8px',
                            borderRadius: 3,
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            background: isTampered ? '#fee2e2' : '#f0fdf4',
                            color: isTampered ? '#b91c1c' : '#15803d',
                          }}
                        >
                          {isTampered ? 'ANOMALOUS' : 'CONFORMANT'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Dempster-Shafer Metrics */}
          <div style={{ background: '#f8fafc', padding: 14, borderRadius: 6, border: '1px solid #e2e8f0', marginBottom: 20 }}>
            <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: 8, textTransform: 'uppercase' }}>
              Dempster-Shafer Evidence Mass Decomposition
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, textAlign: 'center', fontSize: '0.78rem' }}>
              <div style={{ background: '#ffffff', padding: 8, borderRadius: 4, border: '1px solid #e2e8f0' }}>
                <div style={{ color: '#64748b', fontSize: '0.68rem' }}>BELIEF (REAL)</div>
                <div style={{ fontWeight: 800, color: '#16a34a', fontSize: '1.1rem', marginTop: 2 }}>
                  {(result.beliefReal * 100).toFixed(1)}%
                </div>
              </div>
              <div style={{ background: '#ffffff', padding: 8, borderRadius: 4, border: '1px solid #e2e8f0' }}>
                <div style={{ color: '#64748b', fontSize: '0.68rem' }}>BELIEF (FAKE)</div>
                <div style={{ fontWeight: 800, color: '#dc2626', fontSize: '1.1rem', marginTop: 2 }}>
                  {(result.beliefFake * 100).toFixed(1)}%
                </div>
              </div>
              <div style={{ background: '#ffffff', padding: 8, borderRadius: 4, border: '1px solid #e2e8f0' }}>
                <div style={{ color: '#64748b', fontSize: '0.68rem' }}>UNCERTAINTY Θ</div>
                <div style={{ fontWeight: 800, color: '#d97706', fontSize: '1.1rem', marginTop: 2 }}>
                  {(result.uncertainty * 100).toFixed(1)}%
                </div>
              </div>
              <div style={{ background: '#ffffff', padding: 8, borderRadius: 4, border: '1px solid #e2e8f0' }}>
                <div style={{ color: '#64748b', fontSize: '0.68rem' }}>CONFLICT MASS (K)</div>
                <div style={{ fontWeight: 800, color: '#475569', fontSize: '1.1rem', marginTop: 2 }}>
                  {result.conflict ? result.conflict.toFixed(3) : '0.000'}
                </div>
              </div>
            </div>
          </div>

          {/* Signoff Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: 16, borderTop: '1px solid #cbd5e1', fontSize: '0.75rem', color: '#64748b' }}>
            <div>
              <div><strong>Evaluation Framework:</strong> B.Tech Capstone Prototype</div>
              <div><strong>System Architecture:</strong> MV-MPF-Net (Single-View Backbone + Multi-View Geometry)</div>
              <div><strong>Verification Method:</strong> Deterministic Simulation Rig</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ borderBottom: '1px solid #94a3b8', width: 140, marginBottom: 4 }} />
              <div style={{ fontWeight: 600, color: '#0f172a' }}>Automated Verification Signature</div>
              <div style={{ fontSize: '0.68rem' }}>MV-MPF-NET ENGINE V1.0</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
