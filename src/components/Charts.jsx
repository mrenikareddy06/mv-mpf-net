import { useMemo } from 'react';
import { generateTemporalTrace, generateEpipolarPoints, generateEmbeddingScatter } from '../data/demoData.js';

// ── ScoreBar ─────────────────────────────────────────────────
export function ScoreBar({ label, value, color = '#2563eb', showValue = true }) {
  return (
    <div className="score-bar-wrap">
      <span className="score-bar-label">{label}</span>
      <div className="score-bar-track">
        <div
          className="score-bar-fill"
          style={{ width: `${value * 100}%`, background: color }}
        />
      </div>
      {showValue && (
        <span className="score-bar-val">{value.toFixed(3)}</span>
      )}
    </div>
  );
}

// ── Temporal Chart ────────────────────────────────────────────
export function TemporalChart({ score, width = 340, height = 90 }) {
  const data = useMemo(() => generateTemporalTrace(score), [score]);

  const maxY = Math.max(...data, 1.0);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * (width - 20) + 10;
    const y = height - 10 - (v / maxY) * (height - 20);
    return `${x},${y}`;
  });
  const polyline = pts.join(' ');

  // Fill polygon
  const fillPts = `10,${height - 10} ${polyline} ${(width - 10)},${height - 10}`;
  const threshold = height - 10 - (0.35 / maxY) * (height - 20);

  return (
    <div className="chart-area" style={{ height }}>
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="temp-grad-light" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={score > 0.4 ? '#dc2626' : '#2563eb'} stopOpacity="0.15" />
            <stop offset="100%" stopColor={score > 0.4 ? '#dc2626' : '#2563eb'} stopOpacity="0.01" />
          </linearGradient>
        </defs>
        {/* Grid lines */}
        {[0.2, 0.4, 0.6, 0.8].map((v) => (
          <line
            key={v}
            x1="10"
            x2={width - 10}
            y1={height - 10 - v * (height - 20)}
            y2={height - 10 - v * (height - 20)}
            stroke="#e2e8f0"
            strokeWidth="1"
          />
        ))}
        {/* Threshold line */}
        <line
          x1="10"
          x2={width - 10}
          y1={threshold}
          y2={threshold}
          stroke="#d97706"
          strokeWidth="1"
          strokeDasharray="4 3"
        />
        <text x={width - 12} y={threshold - 3} fill="#b45309" fontSize="7.5" textAnchor="end" fontFamily="monospace" fontWeight="bold">
          τ
        </text>
        {/* Area fill */}
        <polygon points={fillPts} fill="url(#temp-grad-light)" />
        {/* Line */}
        <polyline
          points={polyline}
          fill="none"
          stroke={score > 0.4 ? '#dc2626' : '#2563eb'}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Axis labels */}
        <text x="10" y={height - 2} fill="#64748b" fontSize="7.5" fontFamily="monospace" fontWeight="600">t=0</text>
        <text x={width - 10} y={height - 2} fill="#64748b" fontSize="7.5" fontFamily="monospace" textAnchor="end" fontWeight="600">t=T</text>
        <text x="12" y="14" fill="#64748b" fontSize="7.5" fontFamily="monospace" fontWeight="600">Residual</text>
      </svg>
    </div>
  );
}

// ── Epipolar Scatter ───────────────────────────────────────────
export function EpipolarScatter({ score, width = 280, height = 160 }) {
  const pts = useMemo(() => generateEpipolarPoints(score), [score]);

  return (
    <div className="chart-area" style={{ height }}>
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
        {/* Epipolar line */}
        <line
          x1="20"
          y1={height * 0.35}
          x2={width - 20}
          y2={height * 0.6}
          stroke="#64748b"
          strokeWidth="1"
          strokeDasharray="5 3"
          opacity="0.6"
        />
        <text x={width - 22} y={height * 0.6 + 12} fill="#475569" fontSize="7.5" fontFamily="monospace" textAnchor="end" fontWeight="bold">
          epipolar line
        </text>

        {pts.map((p, i) => {
          const cx = 20 + p.x1 * (width - 40);
          const cy = 16 + p.y1 * (height - 32);
          const isOutlier = !p.inlier;
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={isOutlier ? 3.8 : 2.8}
              fill={isOutlier ? '#dc2626' : '#2563eb'}
              stroke="#ffffff"
              strokeWidth="0.8"
            />
          );
        })}

        {/* Legend */}
        <circle cx="16" cy="14" r="3.2" fill="#2563eb" />
        <text x="23" y="17.5" fill="#475569" fontSize="7.5" fontFamily="monospace" fontWeight="600">inlier</text>
        <circle cx="65" cy="14" r="3.2" fill="#dc2626" />
        <text x="72" y="17.5" fill="#475569" fontSize="7.5" fontFamily="monospace" fontWeight="600">outlier</text>

        {/* Sampson distance annotation */}
        <text x={width / 2} y={height - 4} fill="#475569" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
          Sampson dist. = {(score * 4.2 + 0.08).toFixed(2)} px²
        </text>
      </svg>
    </div>
  );
}

// ── Embedding Scatter ──────────────────────────────────────────
export function EmbeddingScatter({ score, width = 280, height = 160 }) {
  const { authentic, query } = useMemo(() => generateEmbeddingScatter(score), [score]);
  const toSVG = (v, max) => 16 + v * (max - 32);

  return (
    <div className="chart-area" style={{ height }}>
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
        {/* Reference distribution ellipse */}
        <ellipse
          cx={toSVG(0.3, width)}
          cy={toSVG(0.4, height)}
          rx="38"
          ry="28"
          fill="#eef2ff"
          stroke="#a5b4fc"
          strokeWidth="1"
          strokeDasharray="4 3"
        />
        <text
          x={toSVG(0.3, width)}
          y={toSVG(0.4, height) - 32}
          fill="#4338ca"
          fontSize="7.5"
          fontFamily="monospace"
          textAnchor="middle"
          fontWeight="bold"
        >
          authentic cluster
        </text>

        {/* Authentic points */}
        {authentic.map((p, i) => (
          <circle
            key={i}
            cx={toSVG(p.x, width)}
            cy={toSVG(p.y, height)}
            r="2.8"
            fill="#4f46e5"
            stroke="#ffffff"
            strokeWidth="0.5"
          />
        ))}

        {/* Query point */}
        <circle
          cx={toSVG(query.x, width)}
          cy={toSVG(query.y, height)}
          r={4.5}
          fill={score > 0.4 ? '#dc2626' : '#16a34a'}
          stroke="#ffffff"
          strokeWidth="1.5"
        />

        {/* Mahalanobis arrow */}
        {score > 0.15 && (
          <line
            x1={toSVG(0.3, width)}
            y1={toSVG(0.4, height)}
            x2={toSVG(query.x, width)}
            y2={toSVG(query.y, height)}
            stroke="#d97706"
            strokeWidth="1"
            strokeDasharray="3 2"
          />
        )}

        {/* Legend */}
        <circle cx="16" cy="14" r="3.2" fill="#4f46e5" />
        <text x="23" y="17.5" fill="#475569" fontSize="7.5" fontFamily="monospace" fontWeight="600">authentic ref</text>
        <circle cx="95" cy="14" r="3.5" fill={score > 0.4 ? '#dc2626' : '#16a34a'} />
        <text x="102" y="17.5" fill="#475569" fontSize="7.5" fontFamily="monospace" fontWeight="600">query view</text>

        <text x={width / 2} y={height - 4} fill="#475569" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
          Mahalanobis dist. = {(score * 6.8 + 0.3).toFixed(2)}
        </text>
      </svg>
    </div>
  );
}

// ── Belief Bar (Clean Light) ───────────────────────────────────
export function BeliefBar({ beliefReal, beliefFake, uncertainty, conflict }) {
  const total = beliefReal + beliefFake + uncertainty + (conflict || 0);
  const scale = total > 0 ? 1 / total : 1;

  return (
    <div>
      <div className="belief-bar" style={{ display: 'flex', height: 28, borderRadius: 4, overflow: 'hidden', border: '1px solid #cbd5e1' }}>
        <div
          className="belief-segment"
          style={{
            flex: beliefReal * scale,
            background: '#16a34a',
            minWidth: beliefReal > 0.05 ? 24 : 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontSize: '0.75rem',
            fontWeight: 700,
          }}
        >
          {beliefReal > 0.12 && `${(beliefReal * 100).toFixed(0)}%`}
        </div>
        <div
          className="belief-segment"
          style={{
            flex: beliefFake * scale,
            background: '#dc2626',
            minWidth: beliefFake > 0.05 ? 24 : 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontSize: '0.75rem',
            fontWeight: 700,
          }}
        >
          {beliefFake > 0.12 && `${(beliefFake * 100).toFixed(0)}%`}
        </div>
        <div
          className="belief-segment"
          style={{
            flex: uncertainty * scale,
            background: '#d97706',
            minWidth: uncertainty > 0.03 ? 16 : 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontSize: '0.75rem',
            fontWeight: 700,
          }}
        >
          {uncertainty > 0.1 && `${(uncertainty * 100).toFixed(0)}%`}
        </div>
        {conflict > 0.01 && (
          <div
            className="belief-segment"
            style={{
              flex: conflict * scale,
              background: '#64748b',
              minWidth: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontSize: '0.75rem',
              fontWeight: 700,
            }}
          >
            {conflict > 0.08 && `${(conflict * 100).toFixed(0)}%`}
          </div>
        )}
      </div>
      <div className="flex gap-4 mt-3" style={{ flexWrap: 'wrap' }}>
        {[
          { label: 'Real', val: beliefReal, color: '#16a34a' },
          { label: 'Fake', val: beliefFake, color: '#dc2626' },
          { label: 'Uncertain', val: uncertainty, color: '#d97706' },
          ...(conflict > 0.01 ? [{ label: 'Conflict K', val: conflict, color: '#64748b' }] : []),
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <div style={{ width: 10, height: 10, borderRadius: 2, background: item.color, flexShrink: 0 }} />
            <span className="text-xs text-secondary font-medium">{item.label}</span>
            <span className="font-mono text-xs font-bold" style={{ color: item.color }}>
              {(item.val * 100).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Verdict Ring (Clean Light) ─────────────────────────────────
export function VerdictRing({ probability, size = 120 }) {
  const r = 46;
  const circ = 2 * Math.PI * r;
  const dash = probability * circ;
  const isFake = probability >= 0.5;

  return (
    <svg width={size} height={size} viewBox="0 0 120 120">
      <circle cx="60" cy="60" r={r} fill="none" stroke="#f1f5f9" strokeWidth="10" />
      <circle
        cx="60"
        cy="60"
        r={r}
        fill="none"
        stroke={isFake ? '#dc2626' : '#16a34a'}
        strokeWidth="10"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 60 60)"
        style={{ transition: 'stroke-dasharray 0.4s ease' }}
      />
      <text
        x="60"
        y="56"
        textAnchor="middle"
        fill="#0f172a"
        fontSize="18"
        fontWeight="800"
        fontFamily="Space Grotesk, sans-serif"
      >
        {(probability * 100).toFixed(0)}%
      </text>
      <text
        x="60"
        y="72"
        textAnchor="middle"
        fill={isFake ? '#dc2626' : '#16a34a'}
        fontSize="8"
        fontFamily="monospace"
        fontWeight="700"
      >
        {isFake ? 'MANIPULATED' : 'AUTHENTIC'}
      </text>
    </svg>
  );
}
