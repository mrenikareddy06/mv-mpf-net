import { useState, useEffect } from 'react';

export default function SpatialRadarHologram({ scenarioId, cameras }) {
  const [rotation, setRotation] = useState(0);

  // Smooth radar rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((r) => (r + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const isOneFake = scenarioId === 'one_fake';
  const isMultiFake = scenarioId === 'multi_fake';
  const isClean = scenarioId === 'all_authentic';

  // Radar circle geometry (radius = 95, center = 160, 150)
  const cx = 160;
  const cy = 150;
  const r = 100;

  const camNodes = [
    {
      id: 'cam-a',
      label: 'CAM A',
      sub: 'Front-L (-35°)',
      angle: 235,
      isFake: false,
      color: '#2563eb',
    },
    {
      id: 'cam-b',
      label: 'CAM B',
      sub: 'Front-R (+35°)',
      angle: 305,
      isFake: isOneFake || isMultiFake,
      color: isOneFake || isMultiFake ? '#dc2626' : '#2563eb',
    },
    {
      id: 'cam-c',
      label: 'CAM C',
      sub: 'Rear-L (-145°)',
      angle: 125,
      isFake: false,
      color: '#2563eb',
    },
    {
      id: 'cam-d',
      label: 'CAM D',
      sub: 'Rear-R (+145°)',
      angle: 55,
      isFake: isMultiFake,
      color: isMultiFake ? '#dc2626' : '#2563eb',
    },
  ];

  return (
    <div id="spatial-radar-hud" className="radar-card">
      <div className="radar-header">
        <div className="flex items-center gap-2">
          <span className={`radar-beacon ${isClean ? 'beacon-green' : 'beacon-red'}`} />
          <span className="radar-title">SPATIAL STEREO GEOMETRY RADAR</span>
        </div>
        <span
          className="radar-badge"
          style={{
            background: isClean ? '#f0fdf4' : '#fef2f2',
            color: isClean ? '#15803d' : '#b91c1c',
            borderColor: isClean ? '#bbf7d0' : '#fecaca',
          }}
        >
          {isClean ? 'GEOMETRY: 99.4% CONFORMANT' : 'EPIPOLAR MISMATCH DETECTED'}
        </span>
      </div>

      <div className="radar-viewport">
        <svg viewBox="0 0 320 300" className="radar-svg">
          <defs>
            <linearGradient id="sweep-grad-light" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(37, 99, 235, 0.2)" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>

          {/* Coordinate circles */}
          <circle cx={cx} cy={cy} r={r} fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
          <circle cx={cx} cy={cy} r={r * 0.75} fill="none" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx={cx} cy={cy} r={r * 0.5} fill="none" stroke="#cbd5e1" strokeWidth="1" />
          <circle cx={cx} cy={cy} r={r * 0.25} fill="none" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="2 2" />

          {/* Crosshairs */}
          <line x1={cx - r - 15} y1={cy} x2={cx + r + 15} y2={cy} stroke="#cbd5e1" strokeWidth="1" />
          <line x1={cx} y1={cy - r - 15} x2={cx} y2={cy + r + 15} stroke="#cbd5e1" strokeWidth="1" />

          {/* Angle degree labels */}
          <text x={cx} y={cy - r - 6} fill="#64748b" fontSize="8" textAnchor="middle" fontFamily="monospace" fontWeight="600">0° (N)</text>
          <text x={cx + r + 16} y={cy + 3} fill="#64748b" fontSize="8" textAnchor="middle" fontFamily="monospace" fontWeight="600">90° (E)</text>
          <text x={cx} y={cy + r + 14} fill="#64748b" fontSize="8" textAnchor="middle" fontFamily="monospace" fontWeight="600">180° (S)</text>
          <text x={cx - r - 16} y={cy + 3} fill="#64748b" fontSize="8" textAnchor="middle" fontFamily="monospace" fontWeight="600">270° (W)</text>

          {/* Rotating radar sweep */}
          <g transform={`rotate(${rotation} ${cx} ${cy})`}>
            <line x1={cx} y1={cy} x2={cx + r} y2={cy} stroke="#2563eb" strokeWidth="1.2" />
            <path
              d={`M ${cx} ${cy} L ${cx + r} ${cy} A ${r} ${r} 0 0 0 ${cx + r * Math.cos(-Math.PI / 6)} ${cy + r * Math.sin(-Math.PI / 6)} Z`}
              fill="url(#sweep-grad-light)"
            />
          </g>

          {/* Camera Frustum Projection Rays Converging onto Target */}
          {camNodes.map((cam) => {
            const rad = (cam.angle * Math.PI) / 180;
            const nx = cx + r * Math.cos(rad);
            const ny = cy + r * Math.sin(rad);

            return (
              <g key={cam.id}>
                {/* Ray line to center */}
                <line
                  x1={nx}
                  y1={ny}
                  x2={cx}
                  y2={cy}
                  stroke={cam.color}
                  strokeWidth={cam.isFake ? '2' : '1.2'}
                  strokeDasharray={cam.isFake ? '4 3' : 'none'}
                  opacity={cam.isFake ? '1' : '0.55'}
                />

                {/* Frustum cone preview */}
                <polygon
                  points={`${nx},${ny} ${cx - 8},${cy - 8} ${cx + 8},${cy + 8}`}
                  fill={cam.color}
                  opacity={cam.isFake ? '0.12' : '0.05'}
                />

                {/* Anomaly breach ping if manipulated */}
                {cam.isFake && (
                  <g>
                    <circle cx={(nx + cx) / 2} cy={(ny + cy) / 2} r="10" fill="#fee2e2" stroke="#dc2626" strokeWidth="1" strokeDasharray="2 2" />
                    <text x={(nx + cx) / 2} y={(ny + cy) / 2 + 3} fill="#b91c1c" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                      Δ 4.8σ
                    </text>
                  </g>
                )}

                {/* Camera node marker */}
                <circle cx={nx} cy={ny} r="8" fill="#ffffff" stroke={cam.color} strokeWidth="2" />
                <circle cx={nx} cy={ny} r="3" fill={cam.color} />

                {/* Node tag */}
                <text
                  x={nx > cx ? nx + 12 : nx - 12}
                  y={ny + 3}
                  fill={cam.color}
                  fontSize="8.5"
                  fontWeight="bold"
                  textAnchor={nx > cx ? 'start' : 'end'}
                  fontFamily="Space Grotesk, sans-serif"
                >
                  {cam.label}
                </text>
                <text
                  x={nx > cx ? nx + 12 : nx - 12}
                  y={ny + 12}
                  fill={cam.isFake ? '#dc2626' : '#64748b'}
                  fontSize="7"
                  fontWeight={cam.isFake ? '700' : '500'}
                  textAnchor={nx > cx ? 'start' : 'end'}
                  fontFamily="monospace"
                >
                  {cam.isFake ? '⚠ INCONSISTENT' : cam.sub}
                </text>
              </g>
            );
          })}

          {/* Central Subject Target */}
          <circle cx={cx} cy={cy} r="14" fill={isClean ? '#dcfce7' : '#fee2e2'} />
          <circle cx={cx} cy={cy} r="6" fill={isClean ? '#16a34a' : '#dc2626'} />
          <circle cx={cx} cy={cy} r="2" fill="#ffffff" />
          <text x={cx} y={cy + 20} fill="#475569" fontSize="7.5" fontWeight="700" textAnchor="middle" fontFamily="monospace">
            SUBJECT RIG (0,0)
          </text>
        </svg>
      </div>

      {/* Telemetry Footer */}
      <div className="radar-footer">
        <div className="radar-stat-box">
          <span className="radar-stat-lbl">SAMPSON DISTANCE</span>
          <span className={`radar-stat-val ${isClean ? 'text-green' : 'text-red'}`}>
            {isClean ? '0.038 px' : '4.821 px (Violation)'}
          </span>
        </div>
        <div className="radar-stat-box">
          <span className="radar-stat-lbl">DINOv2 ALIGNMENT</span>
          <span className={`radar-stat-val ${isClean ? 'text-green' : 'text-amber'}`}>
            {isClean ? '0.962 CosSim' : '0.384 CosSim (Drift)'}
          </span>
        </div>
        <div className="radar-stat-box">
          <span className="radar-stat-lbl">STEREO BASELINE</span>
          <span className="radar-stat-val text-blue">1.84 m · 4 Cams</span>
        </div>
      </div>
    </div>
  );
}
