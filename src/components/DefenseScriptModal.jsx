import { useState } from 'react';

export default function DefenseScriptModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('script');

  if (!isOpen) return null;

  return (
    <div className="tour-overlay">
      <div className="tour-spotlight" onClick={onClose} />
      <div
        className="tour-card"
        style={{
          maxWidth: 720,
          maxHeight: '88vh',
          overflowY: 'auto',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: '#ffffff',
          border: '1px solid #cbd5e1',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          padding: '24px 28px',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
          <div>
            <span className="chip chip-blue" style={{ marginBottom: 4 }}>
              🎓 Review Panel Defense Kit
            </span>
            <h2 style={{ fontFamily: 'Space Grotesk', fontSize: '1.3rem', fontWeight: 700, color: '#0f172a' }}>
              Presenter Defense Script & Panel Q&A Guide
            </h2>
          </div>
          <button
            onClick={onClose}
            className="tour-close-btn"
            style={{ fontSize: '1.2rem', padding: '4px 8px' }}
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 mb-4" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: 8 }}>
          <button
            className={`btn btn-sm ${activeTab === 'script' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('script')}
          >
            🎤 2-Minute Stage Script
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'qa' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('qa')}
          >
            🛡️ Tough Professor Questions (5 Answers)
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'vocab' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('vocab')}
          >
            📖 Core Concepts Cheat Sheet
          </button>
        </div>

        {/* Tab 1: Script */}
        {activeTab === 'script' && (
          <div className="fade-in text-sm text-slate-700" style={{ lineHeight: 1.7 }}>
            <div style={{ background: '#eff6ff', padding: '12px 16px', borderRadius: 6, borderLeft: '4px solid #2563eb', marginBottom: 14 }}>
              <strong style={{ color: '#1e40af' }}>Tip for speaking:</strong> Speak slowly, keep your hands steady, and point at the screen during each step.
            </div>

            <h4 style={{ fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>1. The Hook (0:00 – 0:30)</h4>
            <p style={{ marginBottom: 12 }}>
              <em>"Respected panel members, virtually every deepfake detector today only inspects a single camera feed. But modern generative AI easily bypasses single-view detectors. In our project, <strong>MV-MPF-Net</strong>, we introduce a paradigm shift: we use <strong>four synchronized cameras</strong> and exploit <strong>physical 3D cross-view consistency</strong>. An attacker can edit one camera, but they cannot magically fake the physical 3D angles of the other three views."</em>
            </p>

            <h4 style={{ fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>2. The Architecture (0:30 – 1:00)</h4>
            <p style={{ marginBottom: 12 }}>
              <em>"Our system has four branches across three evidence streams: <strong>E1</strong> checks static pixel artifacts; <strong>E2</strong> catches micro-temporal flickers; and our proposed novelty, <strong>E3a and E3b</strong>, enforces stereo epipolar geometry using Fundamental Matrix Sampson distance, plus DINOv2 cross-angle embedding agreement."</em>
            </p>

            <h4 style={{ fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>3. The Live Demo (1:00 – 1:30)</h4>
            <p style={{ marginBottom: 12 }}>
              <em>"As you see in our interactive dashboard, when all 4 cameras are genuine, the stereo radar confirms 99.4% geometric compliance. When we simulate the primary threat model — <strong>Camera B manipulated</strong> — single-view checks might fluctuate, but our epipolar Sampson error spikes to 4.8 pixels. Dempster-Shafer theory fuses these four streams into an unambiguous <strong>98% Forgery Verdict</strong>."</em>
            </p>

            <h4 style={{ fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>4. Zero-Shot Conclusion (1:30 – 2:00)</h4>
            <p>
              <em>"Finally, because our checks rely on physical 3D geometry rather than fitting to specific deepfake filters, our leave-one-family-out protocol allows zero-shot detection on completely novel, unseen generative models. Thank you, and we welcome your questions."</em>
            </p>
          </div>
        )}

        {/* Tab 2: Q&A */}
        {activeTab === 'qa' && (
          <div className="fade-in text-sm text-slate-700" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ background: '#f8fafc', padding: 14, borderRadius: 6, border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 700, color: '#b91c1c', marginBottom: 4 }}>
                Q1: "Did you actually train DINOv2 and run real-time inference in this web page?"
              </div>
              <div style={{ color: '#0f172a' }}>
                <strong>Answer:</strong> <em>"No, sir. This prototype is an interactive proof-of-concept simulation designed to validate and demonstrate our mathematical pipeline and evidence fusion before deploying to a heavy multi-GPU cluster. The calculations here are deterministic test cases."</em> (Professors will praise you for this honesty).
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: 14, borderRadius: 6, border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 700, color: '#b91c1c', marginBottom: 4 }}>
                Q2: "What is Sampson distance and why is it used in E3a?"
              </div>
              <div style={{ color: '#0f172a' }}>
                <strong>Answer:</strong> <em>"Sampson distance is a first-order geometric error approximation for the Fundamental matrix epipolar constraint (x'ᵀ F x = 0). It measures how far corresponding keypoints in Camera B deviate from their theoretical epipolar line defined by Camera A. A deepfake altered in 2D inevitably breaks this 3D constraint."</em>
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: 14, borderRadius: 6, border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 700, color: '#b91c1c', marginBottom: 4 }}>
                Q3: "Why use Dempster-Shafer Theory (DST) instead of simple weighted average?"
              </div>
              <div style={{ color: '#0f172a' }}>
                <strong>Answer:</strong> <em>"Simple averaging dilutes strong evidence. If three cameras say Real and one says Fake with strong geometric violation, an average would call it Real. DST explicitly computes mass functions for Real, Fake, and Epistemic Uncertainty, while isolating conflict metric K separately."</em>
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: 14, borderRadius: 6, border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 700, color: '#b91c1c', marginBottom: 4 }}>
                Q4: "What if the attacker manipulates all 4 cameras simultaneously?"
              </div>
              <div style={{ color: '#0f172a' }}>
                <strong>Answer:</strong> <em>"That is our 'Multiple Views Manipulated' scenario in Section B. Even if an attacker manipulates multiple cameras, unless they render a unified, physically accurate 3D Gaussian splat or NeRF, independent deepfake generators cannot maintain mutual cross-view epipolar alignment."</em>
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: 14, borderRadius: 6, border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 700, color: '#b91c1c', marginBottom: 4 }}>
                Q5: "What makes this 'Zero-Shot'?"
              </div>
              <div style={{ color: '#0f172a' }}>
                <strong>Answer:</strong> <em>"We calibrate our decision thresholds strictly on authentic videos and known forgery families (e.g. FaceSwap, Face2Face). We test against completely unseen families (e.g. Diffusion-based generators) with zero retraining."</em>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Vocabulary */}
        {activeTab === 'vocab' && (
          <div className="fade-in text-sm text-slate-700">
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                  <th style={{ padding: '8px 12px', fontWeight: 700, color: '#0f172a' }}>Term</th>
                  <th style={{ padding: '8px 12px', fontWeight: 700, color: '#0f172a' }}>Meaning</th>
                  <th style={{ padding: '8px 12px', fontWeight: 700, color: '#0f172a' }}>Role in MV-MPF-Net</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '8px 12px', fontWeight: 600, color: '#2563eb' }}>MPF-Net</td>
                  <td style={{ padding: '8px 12px' }}>Multi-Perspective Feature Network (Single-view baseline)</td>
                  <td style={{ padding: '8px 12px' }}>Extracts E1 (spatial) & E2 (temporal) from each camera view.</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '8px 12px', fontWeight: 600, color: '#2563eb' }}>F-Matrix</td>
                  <td style={{ padding: '8px 12px' }}>Fundamental Matrix in stereo vision</td>
                  <td style={{ padding: '8px 12px' }}>Encodes the rigid geometric relationship between 2 camera positions.</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '8px 12px', fontWeight: 600, color: '#2563eb' }}>DINOv2</td>
                  <td style={{ padding: '8px 12px' }}>Self-supervised Vision Transformer by Meta</td>
                  <td style={{ padding: '8px 12px' }}>Produces view-invariant semantic embeddings for E3b cross-view check.</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '8px 12px', fontWeight: 600, color: '#2563eb' }}>DST</td>
                  <td style={{ padding: '8px 12px' }}>Dempster-Shafer Theory of Evidence</td>
                  <td style={{ padding: '8px 12px' }}>Combines belief from all 4 branches without losing conflict or uncertainty.</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center mt-6 pt-3 border-t border-slate-200">
          <span className="text-xs text-slate-500 font-mono">
            B.Tech Capstone · MV-MPF-Net Presentation Guide
          </span>
          <button className="btn btn-primary btn-sm" onClick={onClose}>
            ✓ Got It, Ready to Present
          </button>
        </div>
      </div>
    </div>
  );
}
