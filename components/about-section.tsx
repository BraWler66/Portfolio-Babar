"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        position: "relative",
        borderTop: "1px solid var(--border)",
        padding: "clamp(60px, 10vw, 120px) 0 clamp(70px, 12vw, 140px)",
      }}
    >
      {/* Ambient glows */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none">
        <div style={{ position: "absolute", top: "0%", right: "-5%", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(127,64,255,0.07) 0%, transparent 65%)" }} />
        <div style={{ position: "absolute", bottom: "0%", left: "-5%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(194,164,255,0.04) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", top: "40%", left: "30%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(194,164,255,0.03) 0%, transparent 60%)" }} />
      </motion.div>

      {/* Star dots */}
      {[...Array(16)].map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          width: i % 4 === 0 ? 2 : 1, height: i % 4 === 0 ? 2 : 1,
          borderRadius: "50%",
          backgroundColor: i % 3 === 0 ? "rgba(194,164,255,0.5)" : i % 3 === 1 ? "rgba(194,164,255,0.3)" : "rgba(127,64,255,0.4)",
          left: `${(i * 19 + 5) % 95}%`,
          top: `${(i * 27 + 11) % 88}%`,
          animation: `twinkleAbout ${2 + (i % 3)}s ease-in-out infinite ${i * 0.25}s`,
          pointerEvents: "none",
        }} />
      ))}

      <div
        className="relative"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 clamp(20px, 6vw, 80px)",
          zIndex: 2,
        }}
      >

        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 40 }}
        >
          <div style={{ width: 40, height: 1, backgroundColor: "var(--accent)" }} />
          <p style={{ fontSize: 11, letterSpacing: 6, color: "var(--accent)", textTransform: "uppercase", fontWeight: 500 }}>
            About Me
          </p>
        </motion.div>

        {/* Two column on md+, single column on mobile */}
        <div
          className="grid grid-cols-1 md:grid-cols-2"
          style={{ gap: "clamp(32px, 5vw, 80px)", alignItems: "start", marginBottom: 80 }}
        >

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 1, ease: [0.33, 0, 0, 1] }}
            style={{ fontSize: "clamp(36px, 5vw, 72px)", fontWeight: 300, lineHeight: 1.1, letterSpacing: -2, color: "var(--text)" }}
          >
            I build{" "}
            <span style={{ color: "var(--accent)", fontWeight: 700 }}>intelligent</span>
            <br />systems that{" "}
            <span style={{ color: "var(--pink)", fontStyle: "italic", fontWeight: 400 }}>think</span>.
          </motion.h2>

          {/* Bio + facts */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }}
              style={{ fontSize: 16, color: "var(--muted)", lineHeight: 1.95, fontWeight: 300, marginBottom: 48 }}
            >
              From detecting tumors in medical scans to training autonomous agents in
              simulation — I bridge cutting-edge research with real-world deployment.
              I live at the intersection of{" "}
              <span style={{ color: "var(--accent)", fontWeight: 400 }}>Computer Vision</span>,{" "}
              <span style={{ color: "var(--pink)" }}>LLMs</span>, and{" "}
              <span style={{ color: "var(--accent)", fontWeight: 400 }}>Reinforcement Learning</span>.
            </motion.p>

            {/* Quick facts — always 2 columns */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.35 }}
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px 40px", paddingTop: 32, borderTop: "1px solid var(--border)" }}
            >
              {[
                { label: "Education", value: "BS Artificial Intelligence", sub: "Bahria University" },
                { label: "Experience", value: "1.5+ Years", sub: "AI / ML Engineering" },
                { label: "Location", value: "Islamabad, PK", sub: "Open to Remote" },
                { label: "Status", value: "Open to Work", sub: "Full-time · Contract" },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.08, duration: 0.5 }}
                >
                  <span style={{ fontSize: 10, letterSpacing: 4, color: "var(--muted)", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                    {item.label}
                  </span>
                  <span style={{ fontSize: 15, color: "var(--text)", fontWeight: 600, display: "block", marginBottom: 3 }}>
                    {item.value}
                  </span>
                  <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 300, display: "block" }}>
                    {item.sub}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            {/* Available badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ delay: 0.7, duration: 0.5 }}
              style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 40 }}
            >
              <div style={{
                width: 8, height: 8, borderRadius: "50%",
                backgroundColor: "#44ffaa",
                boxShadow: "0 0 12px rgba(68,255,170,0.8)",
                animation: "pulseGlow 2s ease-in-out infinite",
              }} />
              <span style={{ fontSize: 12, color: "#44ffaa", letterSpacing: 3, textTransform: "uppercase", fontWeight: 400 }}>
                Available for opportunities
              </span>
            </motion.div>
          </div>
        </div>

        {/* Bottom accent line */}
        <motion.div
          initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }}
          viewport={{ once: true }} transition={{ duration: 1.2, ease: [0.33, 0, 0, 1] }}
          style={{
            height: 1,
            background: "linear-gradient(to right, transparent, var(--accent), var(--pink), transparent)",
            transformOrigin: "left",
          }}
        />
      </div>

      <style>{`
        @keyframes twinkleAbout {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.6); }
        }
      `}</style>
    </section>
  );
}
