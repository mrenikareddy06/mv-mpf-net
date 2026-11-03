export default function BenchmarkTable() {
  const benchmarks = [
    {
      feature: 'Primary Surveillance Input',
      singleSpatial: 'Single 2D frame',
      singleTemporal: 'Single camera video stream',
      ourMethod: '4 Synchronised spatial camera array',
      winner: 'our',
    },
    {
      feature: 'Physical 3D Constraint Rigor',
      singleSpatial: 'None (Pure 2D texture)',
      singleTemporal: 'None (Optical flow heuristics)',
      ourMethod: 'Fundamental F-Matrix Sampson distance',
      winner: 'our',
    },
    {
      feature: 'Resistance to High-Quality FaceSwaps',
      singleSpatial: 'Low (Fooled by high-res GANs)',
      singleTemporal: 'Moderate (Fooled by temporal blurs)',
      ourMethod: 'High (Single camera breach breaks stereo lines)',
      winner: 'our',
    },
    {
      feature: 'Zero-Shot Unseen Generator Defense',
      singleSpatial: 'Poor (Severe domain overfitting)',
      singleTemporal: 'Partial (Overfits to known artifacts)',
      ourMethod: 'Robust (Geometric laws do not change per generator)',
      winner: 'our',
    },
    {
      feature: 'Decision Synthesis Model',
      singleSpatial: 'Softmax probability (Binary)',
      singleTemporal: 'Logistic regression / Sigmoid',
      ourMethod: 'Dempster-Shafer Theory (Explicit uncertainty & conflict)',
      winner: 'our',
    },
  ];

  return (
    <div className="card mb-6" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
      <div className="card-header">
        <div>
          <span className="chip chip-blue" style={{ marginBottom: 4 }}>
            Competitive Advantage
          </span>
          <div className="card-title" style={{ fontSize: '1.05rem', fontWeight: 700 }}>
            Comparative Analysis: Single-View Baselines vs. MV-MPF-Net
          </div>
        </div>
        <span className="text-xs text-muted font-mono">Literature Benchmark Matrix</span>
      </div>

      <div style={{ overflowX: 'auto', marginTop: 12 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
              <th style={{ padding: '10px 14px', fontWeight: 700, color: '#0f172a' }}>Evaluation Dimension</th>
              <th style={{ padding: '10px 14px', fontWeight: 600, color: '#64748b' }}>Single-View Spatial (XceptionNet)</th>
              <th style={{ padding: '10px 14px', fontWeight: 600, color: '#64748b' }}>Single-View Spatiotemporal (FTCN)</th>
              <th style={{ padding: '10px 14px', fontWeight: 700, color: '#1d4ed8', background: '#eff6ff' }}>
                ⭐ MV-MPF-Net (Proposed)
              </th>
            </tr>
          </thead>
          <tbody>
            {benchmarks.map((row, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '10px 14px', fontWeight: 600, color: '#1e293b' }}>{row.feature}</td>
                <td style={{ padding: '10px 14px', color: '#64748b' }}>{row.singleSpatial}</td>
                <td style={{ padding: '10px 14px', color: '#64748b' }}>{row.singleTemporal}</td>
                <td
                  style={{
                    padding: '10px 14px',
                    fontWeight: 600,
                    color: '#1e40af',
                    background: '#eff6ff',
                    borderLeft: '1px solid #dbeafe',
                    borderRight: '1px solid #dbeafe',
                  }}
                >
                  ✓ {row.ourMethod}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 12, padding: '8px 12px', background: '#f8fafc', borderRadius: 6, fontSize: '0.75rem', color: '#64748b' }}>
        <strong>Key Reviewer Takeaway:</strong> Single-view detectors play a perpetual cat-and-mouse game with generative architectures. MV-MPF-Net anchors detection in unassailable 3D stereo physics that generative models cannot bypass.
      </div>
    </div>
  );
}

