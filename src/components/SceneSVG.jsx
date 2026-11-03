// Clean Academic Light Multi-View Camera Feeds
const PALETTES = {
  'cam-a': { sky: '#e2e8f0', mid: '#cbd5e1', ground: '#94a3b8', accent: '#64748b', person: '#1e293b', highlight: '#2563eb' },
  'cam-b': { sky: '#e2e8f0', mid: '#cbd5e1', ground: '#94a3b8', accent: '#64748b', person: '#1e293b', highlight: '#2563eb' },
  'cam-c': { sky: '#e2e8f0', mid: '#cbd5e1', ground: '#94a3b8', accent: '#64748b', person: '#1e293b', highlight: '#2563eb' },
  'cam-d': { sky: '#e2e8f0', mid: '#cbd5e1', ground: '#94a3b8', accent: '#64748b', person: '#1e293b', highlight: '#2563eb' },
};

function hashNum(str, salt = 0) {
  let h = salt;
  for (let c of str) h = (Math.imul(31, h) + c.charCodeAt(0)) | 0;
  return Math.abs(h);
}

export default function SceneSVG({ cameraId, suspicious, selected }) {
  const pal = PALETTES[cameraId] || PALETTES['cam-a'];
  const seed = hashNum(cameraId);

  const px = 72 + (seed % 110);
  const scale = 0.85 + (hashNum(cameraId, 7) % 30) / 100;

  // Secondary figure (background)
  const px2 = 30 + (hashNum(cameraId, 5) % 60);
  const buildingSeeds = [1, 2, 3, 4, 5].map((i) => hashNum(cameraId, i * 13));

  return (
    <svg viewBox="0 0 320 200" className="scene-svg" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`sky-${cameraId}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f1f5f9" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </linearGradient>
        <linearGradient id={`ground-${cameraId}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
      </defs>

      {/* Daylight background */}
      <rect width="320" height="200" fill={`url(#sky-${cameraId})`} />

      {/* Ground plane */}
      <rect x="0" y="140" width="320" height="60" fill={`url(#ground-${cameraId})`} />

      {/* Perspective baseline grid */}
      {[-3, -1, 1, 3, 5].map((v, i) => (
        <line
          key={i}
          x1={160 - v * 180}
          y1="140"
          x2={160 - v * 8}
          y2="200"
          stroke="#64748b"
          strokeWidth="0.5"
          opacity="0.3"
        />
      ))}
      {[0.2, 0.45, 0.7].map((t, i) => {
        const y = 140 + t * 60;
        return (
          <line
            key={i}
            x1="0"
            y1={y}
            x2="320"
            y2={y}
            stroke="#64748b"
            strokeWidth="0.5"
            opacity="0.25"
          />
        );
      })}

      {/* Background architecture silhouettes */}
      {buildingSeeds.map((bs, i) => {
        const bx = 10 + i * 65 + (bs % 30);
        const bw = 22 + ((bs >> 4) % 22);
        const bh = 32 + ((bs >> 2) % 52);
        const by = 140 - bh;
        const windows = Math.floor(bw / 8);
        return (
          <g key={i}>
            <rect x={bx} y={by} width={bw} height={bh} fill="#94a3b8" opacity="0.65" />
            {Array.from({ length: Math.min(windows * 3, 9) }, (_, wi) => {
              const col = wi % windows;
              const row = Math.floor(wi / windows);
              const lit = (bs >> wi) % 3 !== 0;
              return lit ? (
                <rect
                  key={wi}
                  x={bx + 4 + col * 8}
                  y={by + 5 + row * 10}
                  width={4}
                  height={6}
                  rx="1"
                  fill="#f8fafc"
                  opacity="0.75"
                />
              ) : null;
            })}
          </g>
        );
      })}

      {/* Background figure (secondary authentic reference) */}
      <g transform={`translate(${px2}, 95) scale(0.55)`} opacity="0.45">
        <ellipse cx="0" cy="0" rx="9" ry="10" fill="#475569" />
        <rect x="-10" y="9" width="20" height="25" rx="3" fill="#475569" />
      </g>

      {/* Main Subject */}
      <g transform={`translate(${px}, 68) scale(${scale})`}>
        <ellipse cx="0" cy="66" rx="14" ry="4" fill="#64748b" opacity="0.3" />
        <rect x="-9" y="46" width="7" height="22" rx="3" fill="#1e293b" />
        <rect x="2" y="46" width="7" height="22" rx="3" fill="#1e293b" />
        <rect x="-13" y="14" width="26" height="34" rx="4" fill="#1e293b" />
        <rect x="-13" y="14" width="26" height="6" rx="3" fill="#334155" />
        <rect x="-22" y="15" width="9" height="22" rx="4" fill="#1e293b" />
        <rect x="13" y="15" width="9" height="22" rx="4" fill="#1e293b" />
        <rect x="-4" y="4" width="8" height="12" rx="2" fill="#1e293b" />
        <ellipse cx="0" cy="-4" rx="12" ry="13" fill="#1e293b" />
        <ellipse cx="-4" cy="-6" rx="2" ry="2.5" fill="#60a5fa" />
        <ellipse cx="4" cy="-6" rx="2" ry="2.5" fill="#60a5fa" />

        {/* Subtle anomaly band if suspicious */}
        {suspicious && (
          <rect x="-15" y="-12" width="30" height="3" fill="#dc2626" opacity="0.8" />
        )}
      </g>

      {/* Suspicious forensic overlay */}
      {suspicious && (
        <>
          {/* Red corner brackets */}
          {[
            [[4, 4], [4, 18], [4, 4], [18, 4]],
            [[316, 4], [316, 18], [316, 4], [300, 4]],
            [[4, 196], [4, 182], [4, 196], [18, 196]],
            [[316, 196], [316, 182], [316, 196], [300, 196]],
          ].map((pts, i) => (
            <g key={i}>
              <line x1={pts[0][0]} y1={pts[0][1]} x2={pts[1][0]} y2={pts[1][1]} stroke="#dc2626" strokeWidth="2" />
              <line x1={pts[2][0]} y1={pts[2][1]} x2={pts[3][0]} y2={pts[3][1]} stroke="#dc2626" strokeWidth="2" />
            </g>
          ))}

          {/* Anomaly pill */}
          <rect x="7" y="7" width="98" height="18" rx="3" fill="#fee2e2" stroke="#dc2626" strokeWidth="1" />
          <circle cx="16" cy="16" r="3" fill="#dc2626" />
          <text x="23" y="20" fill="#991b1b" fontSize="7" fontFamily="monospace" fontWeight="bold">
            ANOMALY DETECTED
          </text>

          {/* Face bounding box */}
          <rect
            x={px - 20}
            y={38}
            width="40"
            height="44"
            rx="2"
            fill="rgba(254, 226, 226, 0.3)"
            stroke="#dc2626"
            strokeWidth="1.2"
            strokeDasharray="4 2"
          />
          <text x={px} y={84} textAnchor="middle" fill="#dc2626" fontSize="6.5" fontFamily="monospace" fontWeight="bold">
            TAMPERED ROI
          </text>
        </>
      )}

      {/* Academic CCTV HUD tags */}
      <circle cx="304" cy="11" r="3" fill="#dc2626" />
      <text x="310" y="14.5" fill="#dc2626" fontSize="7" fontFamily="monospace" fontWeight="bold">REC</text>

      <text x="8" y="193" fill="#475569" fontSize="6.5" fontFamily="monospace" fontWeight="600">
        {`CAM RIG · 14:23:${30 + (hashNum(cameraId) % 20)}`}
      </text>

      <text x="312" y="193" fill="#475569" fontSize="6.5" fontFamily="monospace" fontWeight="600" textAnchor="end">
        {`f=${24 + (hashNum(cameraId, 3) % 36)}mm`}
      </text>

      {/* Selected indicator */}
      {selected && (
        <rect
          x="1"
          y="1"
          width="318"
          height="198"
          rx="4"
          fill="none"
          stroke="#2563eb"
          strokeWidth="2"
        />
      )}
    </svg>
  );
}
