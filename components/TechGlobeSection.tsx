"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const TechGlobe3D = dynamic(() => import("./TechGlobe3D"), { ssr: false });

export default function TechGlobeSection() {
  return (
    <div style={{ borderTop: "1px solid var(--border)", position: "relative", overflow: "hidden" }} className="tech-globe-section">
      {/* Globe */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1 }} className="tech-globe-canvas">
        <TechGlobe3D />
      </div>

      {/* Desktop gradients — hide on mobile */}
      <div className="tech-globe-grad-lr" style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", background: "linear-gradient(to right, #0b080c 30%, transparent 55%, transparent 45%, #0b080c 70%)" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 100, zIndex: 2, pointerEvents: "none", background: "linear-gradient(to top, #0b080c, transparent)" }} />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 80, zIndex: 2, pointerEvents: "none", background: "linear-gradient(to bottom, #0b080c, transparent)" }} />

      {/* Text */}
      <div className="tech-globe-text" style={{ position: "absolute", inset: 0, zIndex: 3, display: "flex", flexDirection: "column", justifyContent: "center", paddingLeft: 60, maxWidth: 480 }}>
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <div style={{ width: 32, height: 1, backgroundColor: "var(--accent)" }} />
          <p style={{ fontSize: 11, letterSpacing: 5, color: "var(--accent)", textTransform: "uppercase" }}>Tech Universe</p>
        </motion.div>
        <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.1 }} style={{ fontSize: "clamp(32px, 4.5vw, 60px)", fontWeight: 300, lineHeight: 1.1, marginBottom: 16 }}>
          My Tech<br /><span style={{ color: "var(--accent)", fontWeight: 500 }}>Stack</span>
        </motion.h2>
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }} style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.8, maxWidth: 320 }}>
          40+ technologies spanning ML, CV, NLP, LLMs, and deployment. Drag to explore.
        </motion.p>
      </div>

      <div style={{ position: "absolute", bottom: 20, right: 32, zIndex: 4, fontSize: 10, letterSpacing: 3, color: "rgba(194,164,255,0.4)", textTransform: "uppercase" }}>
        Interactive · Drag to rotate
      </div>
    </div>
  );
}
