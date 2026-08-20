"use client";

import { motion, AnimatePresence } from "framer-motion";

/**
 * VRSessionStage — an animated, designed visualization of a VR therapy session.
 *
 * This is deliberately a STYLIZED SYSTEM VISUALIZATION, not recorded footage:
 * it shows how the 6-agent pipeline behaves during a session (something no
 * screenshot can convey), while never pretending to be a screen capture of
 * the Unity build.
 */

type Phase = 0 | 1 | 2 | 3 | 4;

const AGENTS = [
  { id: "emotion", label: "Emotion", color: "#fb8dff" },
  { id: "sentiment", label: "Sentiment", color: "#c2a4ff" },
  { id: "crisis", label: "Risk", color: "#ff8d8d" },
  { id: "topic", label: "Topic", color: "#44ffaa" },
];

const CAPTIONS: Record<Phase, { tag: string; line: string }> = {
  0: { tag: "SESSION START", line: "Welcome to AI VR Therapy — please state your name and ID." },
  1: { tag: "LISTENING", line: "“I've been feeling overwhelmed at work lately…”" },
  2: { tag: "PIPELINE ACTIVE", line: "LangGraph fanning out to 4 BERT classifiers + Mistral-7B" },
  3: { tag: "AVATAR RESPONDING", line: "“That sounds exhausting. Let's take this one piece at a time.”" },
  4: { tag: "SESSION LOGGED", line: "XAI report generated · written to MongoDB" },
};

export default function VRSessionStage({ phase }: { phase: number }) {
  const p = Math.max(0, Math.min(4, phase)) as Phase;
  const listening = p === 1;
  const thinking = p === 2;
  const speaking = p === 3;
  const logged = p === 4;
  const caption = CAPTIONS[p];

  return (
    <div className="vrs-stage">
      <svg viewBox="0 0 640 400" className="vrs-svg" role="img"
        aria-label="Stylized visualization of an AI-powered VR therapy session">
        <defs>
          <linearGradient id="vrsRoom" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a0f33" />
            <stop offset="60%" stopColor="#120a24" />
            <stop offset="100%" stopColor="#0b080c" />
          </linearGradient>
          <radialGradient id="vrsHalo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#7f40ff" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#7f40ff" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="vrsAvatarGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#c2a4ff" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#c2a4ff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="vrsFloor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c2a4ff" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#c2a4ff" stopOpacity="0" />
          </linearGradient>
          <filter id="vrsSoft" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        {/* ── Room ── */}
        <rect width="640" height="400" fill="url(#vrsRoom)" />

        {/* Perspective floor grid */}
        <g opacity="0.5">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <line key={`h${i}`} x1="0" x2="640"
              y1={286 + i * i * 3.4} y2={286 + i * i * 3.4}
              stroke="#c2a4ff" strokeOpacity={0.18 - i * 0.02} strokeWidth="1" />
          ))}
          {[-6, -4, -2, 0, 2, 4, 6].map((i) => (
            <line key={`v${i}`} x1={320 + i * 26} y1="286"
              x2={320 + i * 150} y2="400"
              stroke="#c2a4ff" strokeOpacity="0.12" strokeWidth="1" />
          ))}
        </g>
        <rect y="286" width="640" height="114" fill="url(#vrsFloor)" />

        {/* Ambient haze */}
        <ellipse cx="320" cy="250" rx="250" ry="120" fill="url(#vrsHalo)" opacity="0.5" />

        {/* ── AI therapist avatar (left) ── */}
        <g transform="translate(180, 150)">
          <circle cx="0" cy="18" r="86" fill="url(#vrsAvatarGlow)"
            className={speaking ? "vrs-pulse-fast" : "vrs-pulse-slow"} />
          {/* body */}
          <path d="M -42 108 Q -42 56 0 56 Q 42 56 42 108 Z" fill="#2a1a4d" stroke="#c2a4ff"
            strokeOpacity="0.5" strokeWidth="1.5" />
          {/* head */}
          <circle cx="0" cy="18" r="30" fill="#33205c" stroke="#c2a4ff" strokeOpacity="0.6" strokeWidth="1.5" />
          {/* calm eyes */}
          <circle cx="-11" cy="14" r="3.2" fill="#c2a4ff" />
          <circle cx="11" cy="14" r="3.2" fill="#c2a4ff" />
          {/* mouth — animates while speaking */}
          <rect x="-9" y="28" width="18" rx="3"
            height={speaking ? 8 : 2.5}
            fill="#fb8dff" fillOpacity="0.9"
            className={speaking ? "vrs-mouth" : ""} />
          {/* halo ring */}
          <ellipse cx="0" cy="-16" rx="22" ry="6" fill="none" stroke="#fb8dff"
            strokeOpacity="0.55" strokeWidth="1.5" className="vrs-halo" />
        </g>
        <text x="180" y="300" textAnchor="middle" className="vrs-name">AI THERAPIST</text>

        {/* ── Patient in headset (right) ── */}
        <g transform="translate(470, 156)">
          {/* listening bloom */}
          <circle cx="0" cy="14" r="70" fill="url(#vrsHalo)"
            opacity={listening ? 0.9 : 0.25} className={listening ? "vrs-pulse-fast" : ""} />
          {/* shoulders */}
          <path d="M -40 104 Q -40 54 0 54 Q 40 54 40 104 Z" fill="#241738" stroke="#7f40ff"
            strokeOpacity="0.45" strokeWidth="1.5" />
          {/* head */}
          <circle cx="0" cy="16" r="28" fill="#2e1f47" stroke="#9a7bd6" strokeOpacity="0.5" strokeWidth="1.5" />
          {/* VR headset */}
          <rect x="-31" y="4" width="62" height="24" rx="7" fill="#0e0a18"
            stroke="#c2a4ff" strokeOpacity="0.75" strokeWidth="1.5" />
          {/* headset lens glow */}
          <rect x="-24" y="10" width="20" height="11" rx="3" fill="#7f40ff" fillOpacity="0.55" className="vrs-lens" />
          <rect x="4" y="10" width="20" height="11" rx="3" fill="#7f40ff" fillOpacity="0.55" className="vrs-lens" />
          {/* strap */}
          <path d="M -31 14 Q -40 14 -40 22" fill="none" stroke="#c2a4ff" strokeOpacity="0.5" strokeWidth="2" />
          <path d="M 31 14 Q 40 14 40 22" fill="none" stroke="#c2a4ff" strokeOpacity="0.5" strokeWidth="2" />
        </g>
        <text x="470" y="300" textAnchor="middle" className="vrs-name">PATIENT · VR HEADSET</text>

        {/* ── Voice waveform: patient → pipeline ── */}
        <AnimatePresence>
          {listening && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                <rect key={i} x={330 + i * 13} width="5" rx="2.5" fill="#44ffaa"
                  y={150} height={10} className={`vrs-wave vrs-wave-${i % 4}`} />
              ))}
            </motion.g>
          )}
        </AnimatePresence>

        {/* ── Response beam: avatar → patient ── */}
        <AnimatePresence>
          {speaking && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {[0, 1, 2].map((i) => (
                <circle key={i} cy="160" r="4" fill="#fb8dff" className={`vrs-beam vrs-beam-${i}`} />
              ))}
            </motion.g>
          )}
        </AnimatePresence>

        {/* ── Agent pipeline rail (top) ── */}
        <g transform="translate(0, 34)">
          <rect x="150" y="-16" width="340" height="46" rx="10"
            fill="#0b0818" fillOpacity="0.85" stroke="#c2a4ff" strokeOpacity="0.22" />
          <text x="320" y="-24" textAnchor="middle" className="vrs-rail-label">
            LANGGRAPH · 4× BERT · MISTRAL-7B
          </text>
          {AGENTS.map((a, i) => {
            const x = 190 + i * 87;
            return (
              <g key={a.id} transform={`translate(${x}, 8)`}>
                <circle r="11" fill={thinking ? a.color : "#1a1030"}
                  fillOpacity={thinking ? 0.28 : 1}
                  stroke={a.color} strokeOpacity={thinking ? 0.95 : 0.35} strokeWidth="1.5"
                  className={thinking ? `vrs-agent vrs-agent-${i}` : ""} />
                <circle r="3.5" fill={a.color} opacity={thinking ? 1 : 0.35} />
                <text y="27" textAnchor="middle" className="vrs-agent-label"
                  fill={a.color} opacity={thinking ? 1 : 0.45}>{a.label}</text>
              </g>
            );
          })}
        </g>

        {/* Data lines from pipeline down into the scene while thinking */}
        <AnimatePresence>
          {thinking && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} exit={{ opacity: 0 }}>
              {AGENTS.map((a, i) => (
                <line key={a.id} x1={190 + i * 87} y1="58" x2="320" y2="120"
                  stroke={a.color} strokeOpacity="0.5" strokeWidth="1"
                  strokeDasharray="4 6" className={`vrs-flow vrs-flow-${i}`} />
              ))}
            </motion.g>
          )}
        </AnimatePresence>

        {/* ── Session log chip ── */}
        <AnimatePresence>
          {logged && (
            <motion.g
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <rect x="238" y="120" width="164" height="46" rx="9"
                fill="#0b0818" fillOpacity="0.92" stroke="#44ffaa" strokeOpacity="0.5" />
              <text x="320" y="140" textAnchor="middle" className="vrs-log-title">XAI SESSION REPORT</text>
              <text x="320" y="156" textAnchor="middle" className="vrs-log-sub">MongoDB · saved</text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* ── Session timer (Unity-style HUD) ── */}
        <g transform="translate(320, 372)">
          <rect x="-52" y="-16" width="104" height="26" rx="13"
            fill="#0b0818" fillOpacity="0.9" stroke="#c2a4ff" strokeOpacity="0.3" />
          <circle cx="-34" cy="-3" r="4" fill="#fb8dff" className="vrs-rec" />
          <text x="6" y="2" textAnchor="middle" className="vrs-timer">SESSION 02:00</text>
        </g>
      </svg>

      {/* ── Caption bar ── */}
      <div className="vrs-caption">
        <span className="vrs-caption-tag">{caption.tag}</span>
        <AnimatePresence mode="wait">
          <motion.p key={p}
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28 }} className="vrs-caption-line">
            {caption.line}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Honest labelling — this is a visualization, not a capture */}
      <p className="vrs-disclaimer">Stylized visualization of the session pipeline</p>
    </div>
  );
}
