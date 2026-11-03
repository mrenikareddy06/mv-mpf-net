// Demo data — all values are illustrative only.
// No real ML inference is performed.

export const SCENARIOS = {
  authentic: {
    id: 'authentic',
    label: 'All Views Authentic',
    description: 'All four camera views are genuine, unmanipulated footage.',
    suspiciousViews: [],
    cameras: [
      { id: 'cam-a', label: 'Camera A', angle: 'Front-Left', e1: 0.12, e2: 0.08, e3a: 0.07, e3b: 0.09 },
      { id: 'cam-b', label: 'Camera B', angle: 'Front-Right', e1: 0.15, e2: 0.11, e3a: 0.09, e3b: 0.10 },
      { id: 'cam-c', label: 'Camera C', angle: 'Rear-Left', e1: 0.10, e2: 0.09, e3a: 0.08, e3b: 0.11 },
      { id: 'cam-d', label: 'Camera D', angle: 'Rear-Right', e1: 0.13, e2: 0.10, e3a: 0.06, e3b: 0.08 },
    ],
  },
  one_fake: {
    id: 'one_fake',
    label: 'One View Manipulated',
    description: 'Camera B has been face-swapped. The cross-view inconsistency flags it.',
    suspiciousViews: ['cam-b'],
    cameras: [
      { id: 'cam-a', label: 'Camera A', angle: 'Front-Left', e1: 0.13, e2: 0.09, e3a: 0.08, e3b: 0.10 },
      { id: 'cam-b', label: 'Camera B', angle: 'Front-Right', e1: 0.78, e2: 0.71, e3a: 0.85, e3b: 0.82 },
      { id: 'cam-c', label: 'Camera C', angle: 'Rear-Left', e1: 0.11, e2: 0.10, e3a: 0.09, e3b: 0.12 },
      { id: 'cam-d', label: 'Camera D', angle: 'Rear-Right', e1: 0.14, e2: 0.11, e3a: 0.07, e3b: 0.09 },
    ],
  },
  multi_fake: {
    id: 'multi_fake',
    label: 'Multiple Views Manipulated',
    description: 'Cameras A and C have been manipulated. Both E1/E2 and cross-view evidence are elevated.',
    suspiciousViews: ['cam-a', 'cam-c'],
    cameras: [
      { id: 'cam-a', label: 'Camera A', angle: 'Front-Left', e1: 0.82, e2: 0.74, e3a: 0.79, e3b: 0.77 },
      { id: 'cam-b', label: 'Camera B', angle: 'Front-Right', e1: 0.14, e2: 0.10, e3a: 0.11, e3b: 0.09 },
      { id: 'cam-c', label: 'Camera C', angle: 'Rear-Left', e1: 0.76, e2: 0.69, e3a: 0.81, e3b: 0.80 },
      { id: 'cam-d', label: 'Camera D', angle: 'Rear-Right', e1: 0.15, e2: 0.12, e3a: 0.10, e3b: 0.11 },
    ],
  },
};

export const FORGERY_FAMILIES = [
  {
    id: 'F1',
    label: 'F1 — Face-Swap',
    description: 'Identity replacement via GAN-based latent space manipulation.',
    methods: ['FaceSwap', 'SimSwap', 'InfoSwap'],
    color: '#3b82f6',
  },
  {
    id: 'F2',
    label: 'F2 — Face-Reenactment',
    description: 'Expression and pose transfer without full identity replacement.',
    methods: ['Face2Face', 'Neural Textures', 'FSGAN'],
    color: '#6366f1',
  },
  {
    id: 'F3',
    label: 'F3 — Diffusion Synthesis',
    description: 'Score-based generative forgeries; zero-shot challenge family.',
    methods: ['DiffFace', 'LatentSwap', 'StyleDiff'],
    color: '#d97706',
  },
];

export const FUSION_METHODS = [
  {
    id: 'mean',
    label: 'Mean Fusion',
    description: 'Arithmetic mean of the four evidence branch scores. Simple, interpretable baseline.',
  },
  {
    id: 'max',
    label: 'Maximum Fusion',
    description: 'Takes the highest evidence score. Sensitive, but prone to false alarms.',
  },
  {
    id: 'dempster',
    label: 'Dempster–Shafer Fusion',
    description: 'Combines mass functions for Real, Fake and Uncertain. Tracks belief, plausibility and conflict explicitly.',
  },
];

// Temporal residual trace — 40 frames, per camera
export function generateTemporalTrace(cameraScore) {
  const base = cameraScore * 0.6;
  const noise = 0.05;
  return Array.from({ length: 40 }, (_, i) => {
    const trend = base + Math.sin(i * 0.4) * 0.08 * cameraScore;
    const n = (Math.random() * 2 - 1) * noise;
    return Math.max(0, Math.min(1, trend + n));
  });
}

// Epipolar residual pairs — N point correspondences
export function generateEpipolarPoints(e3aScore) {
  return Array.from({ length: 30 }, (_, i) => {
    const inlier = Math.random() > e3aScore * 0.7;
    return {
      x1: 0.1 + Math.random() * 0.8,
      y1: 0.1 + Math.random() * 0.8,
      residual: inlier ? Math.random() * 0.04 : 0.08 + Math.random() * 0.6 * e3aScore,
      inlier,
    };
  });
}

// Embedding scatter — 2D PCA projection
export function generateEmbeddingScatter(e3bScore) {
  const authentic = Array.from({ length: 20 }, () => ({
    x: 0.3 + (Math.random() - 0.5) * 0.3,
    y: 0.4 + (Math.random() - 0.5) * 0.3,
    type: 'authentic',
  }));
  const query = {
    x: 0.3 + e3bScore * 0.55 + (Math.random() - 0.5) * 0.05,
    y: 0.4 - e3bScore * 0.25 + (Math.random() - 0.5) * 0.05,
    type: 'query',
  };
  return { authentic, query };
}

// Fusion calculation
export function computeFusion(cameras, method) {
  const scores = cameras.map(c => ({
    e1: c.e1,
    e2: c.e2,
    e3a: c.e3a,
    e3b: c.e3b,
    max: Math.max(c.e1, c.e2, c.e3a, c.e3b),
    mean: (c.e1 + c.e2 + c.e3a + c.e3b) / 4,
  }));

  const globalE1 = Math.max(...cameras.map(c => c.e1));
  const globalE2 = Math.max(...cameras.map(c => c.e2));
  const globalE3a = Math.max(...cameras.map(c => c.e3a));
  const globalE3b = Math.max(...cameras.map(c => c.e3b));

  const branchScores = { e1: globalE1, e2: globalE2, e3a: globalE3a, e3b: globalE3b };

  if (method === 'mean') {
    const p = (globalE1 + globalE2 + globalE3a + globalE3b) / 4;
    return {
      fakeProbability: p,
      beliefFake: p * 0.85,
      beliefReal: (1 - p) * 0.85,
      uncertainty: 0.15,
      conflict: 0,
      method: 'mean',
      branchScores,
    };
  }

  if (method === 'max') {
    const p = Math.max(globalE1, globalE2, globalE3a, globalE3b);
    return {
      fakeProbability: p,
      beliefFake: p * 0.9,
      beliefReal: (1 - p) * 0.9,
      uncertainty: 0.1,
      conflict: 0,
      method: 'max',
      branchScores,
    };
  }

  // Dempster-Shafer fusion
  // Each branch produces mass: {Fake: m_f, Real: m_r, Uncertain: m_u}
  function branchMass(score) {
    const certainty = score;
    const m_f = certainty * 0.85;
    const m_r = (1 - certainty) * 0.85;
    const m_u = 0.15;
    return { fake: m_f, real: m_r, unc: m_u };
  }

  function combineDST(m1, m2) {
    // Focal sets: Fake={F}, Real={R}, Uncertain={F,R}
    const raw = {
      fake: m1.fake * m2.fake + m1.fake * m2.unc + m1.unc * m2.fake,
      real: m1.real * m2.real + m1.real * m2.unc + m1.unc * m2.real,
      unc: m1.unc * m2.unc,
      conflict: m1.fake * m2.real + m1.real * m2.fake,
    };
    const K = raw.conflict; // conflict mass
    const norm = 1 - K;
    return {
      fake: raw.fake / norm,
      real: raw.real / norm,
      unc: raw.unc / norm,
      conflict: K,
    };
  }

  const masses = [globalE1, globalE2, globalE3a, globalE3b].map(branchMass);
  let combined = masses[0];
  let totalConflict = 0;
  for (let i = 1; i < masses.length; i++) {
    const prev = combined;
    combined = combineDST(prev, masses[i]);
    totalConflict = combined.conflict;
  }

  return {
    fakeProbability: combined.fake + 0.5 * combined.unc,
    beliefFake: combined.fake,
    beliefReal: combined.real,
    uncertainty: combined.unc,
    conflict: totalConflict,
    method: 'dempster',
    branchScores,
  };
}
