"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Floating trigger for the "swarm rebuild" effect (see lib/swarm/engine.ts).
 * Desktop only — it needs a real pointer and a GPU budget for the 3D scenes.
 */
export default function SwarmRebuildButton() {
  const [supported, setSupported] = useState(false);
  const [running, setRunning] = useState(false);
  const handle = useRef<{ stop: () => void } | null>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setSupported(fine && !reduce && window.innerWidth >= 900);
    return () => handle.current?.stop();
  }, []);

  const start = async () => {
    if (running) return;
    setRunning(true);
    const { startSwarm } = await import("@/lib/swarm/engine");
    handle.current = startSwarm(() => {
      handle.current = null;
      setRunning(false);
    });
  };

  if (!supported || running) return null;

  return (
    <button
      type="button"
      data-swarm-ignore=""
      onClick={start}
      aria-label="Watch this site rebuild itself"
      className="swarm-btn"
      style={{
        position: "fixed",
        right: 24,
        bottom: 28,
        zIndex: 60,
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "11px 18px 11px 14px",
        borderRadius: 999,
        border: "1px solid rgba(194,164,255,0.35)",
        background: "rgba(17,13,20,0.78)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        color: "var(--text)",
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: 2.2,
        textTransform: "uppercase",
        cursor: "pointer",
        transition: "border-color .25s, background .25s, transform .25s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(194,164,255,0.8)";
        e.currentTarget.style.background = "rgba(127,64,255,0.22)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(194,164,255,0.35)";
        e.currentTarget.style.background = "rgba(17,13,20,0.78)";
        e.currentTarget.style.transform = "none";
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M4.6 3.9 C4.2 3.1 4.9 2.4 5.7 2.8 L20.6 9.4 C21.5 9.8 21.4 11.1 20.4 11.3 L13.9 12.9 C13.4 13 13 13.4 12.9 13.9 L11.3 20.4 C11.1 21.4 9.8 21.5 9.4 20.6 Z"
          fill="#c2a4ff"
          stroke="#fff"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
      Rebuild live
    </button>
  );
}
