"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const medicalProjects = [
  {
    id: "breast",
    label: "Breast Cancer Detection",
    sublabel: "Tumor Segmentation",
    tools: ["YOLOv8", "U-Net", "PyTorch"],
    desc: "Pixel-level segmentation of malignant tumors in mammography scans. Trained on CBIS-DDSM dataset achieving 94% Dice score with U-Net architecture enhanced by attention gates.",
    github: "https://github.com/BraWler66/YOLOv8_Medical_Imaging",
    dot: { top: "27%", left: "40%" },   // chest / breast area
    side: "left" as const,
  },
  {
    id: "kidney",
    label: "Kidney CT Analysis",
    sublabel: "Abnormality Detection",
    tools: ["TensorFlow", "CNN", "OpenCV"],
    desc: "Multi-class classification of cysts, stones, and tumors from CT scans. Custom CNN with residual connections achieves 96.3% accuracy across 4 pathology classes.",
    github: "https://github.com/BraWler66/Deep-Learning-Based-Detection-of-Kidney-Abnormalities-from-CT-Scans",
    dot: { top: "48%", left: "38%" },   // kidney area (mid-back)
    side: "left" as const,
  },
  {
    id: "blood",
    label: "Blood Cell Detection",
    sublabel: "RBC & WBC Analysis",
    tools: ["YOLOv8", "COCO", "Python"],
    desc: "Real-time detection and differential counting of red & white blood cells in microscopy images. Deployed as a FastAPI service with <50ms inference latency.",
    github: "https://github.com/BraWler66/YOLOv8_Medical_Imaging",
    dot: { top: "32%", left: "60%" },   // upper arm / blood draw site
    side: "right" as const,
  },
  {
    id: "knee",
    label: "Knee Osteoarthritis",
    sublabel: "Severity Grading",
    tools: ["ResNet-50", "Transfer Learning", "Grad-CAM"],
    desc: "Grades knee osteoarthritis severity (KL grades 0–4) from X-ray images using ResNet-50 fine-tuned on the OAI dataset. Grad-CAM visualization highlights diagnostic regions.",
    github: "https://github.com/BraWler66/Knee-Osteoarthritis-Grading-Using-X-ray-Images-ResNet-",
    dot: { top: "72%", left: "56%" },   // knee joint
    side: "right" as const,
  },
  {
    id: "covid",
    label: "COVID-19 Detection",
    sublabel: "Chest X-Ray Analysis",
    tools: ["YOLOv8", "Transfer Learning", "Streamlit"],
    desc: "Detects COVID-19, pneumonia, and normal lung patterns in chest X-rays. 3-class classifier with 97.1% accuracy, deployed as an interactive Streamlit app.",
    github: "https://github.com/BraWler66/YOLOv8_Medical_Imaging",
    dot: { top: "20%", left: "50%" },   // lungs / chest center
    side: "right" as const,
  },
];

const otherProjects = [
  {
    title: "Line Following Robot",
    category: "Robotics · Hardware",
    tools: "Arduino · PID Control · IR Sensors",
    desc: "Autonomous robot that tracks black-line paths using IR sensor array and real-time PID correction.",
    icon: "🤖",
    accent: "#c2a4ff",
  },
  {
    title: "Wall Following Robot",
    category: "Robotics · Hardware",
    tools: "Arduino · Ultrasonic Sensors · Python",
    desc: "Obstacle-aware rover that maintains fixed distance from walls using ultrasonic ranging & closed-loop control.",
    icon: "📡",
    accent: "#c2a4ff",
  },
  {
    title: "Billease",
    category: "FinTech · Software",
    tools: "React · Node.js · MongoDB",
    desc: "Smart expense management app with categorized spending, budget alerts, and monthly analytics.",
    icon: "💸",
    accent: "#44ffaa",
  },
  {
    title: "Bin Classifier",
    category: "Hardware · AI",
    tools: "Raspberry Pi · TensorFlow Lite · Servo",
    desc: "Physical bin that auto-sorts trash vs recyclables using an embedded CNN and servo-actuated lid.",
    icon: "♻️",
    accent: "#c2a4ff",
  },
  {
    title: "PDF Chatbot",
    category: "LLM · RAG",
    tools: "LangChain · DeepSeek · Gradio",
    desc: "Upload any PDF and chat with it — powered by RAG pipeline with semantic chunking and vector search.",
    icon: "📄",
    accent: "#c2a4ff",
  },
  {
    title: "Web Chatbot",
    category: "LLM Application",
    tools: "LangChain · FastAPI · React",
    desc: "Conversational AI assistant with memory, tool use, and a slick React UI backed by FastAPI.",
    icon: "💬",
    accent: "#7f40ff",
  },
  {
    title: "Data Dashboards",
    category: "Data Science · BI",
    tools: "Power BI · Pandas · Plotly",
    desc: "Interactive business intelligence dashboards with drill-downs, KPI cards, and live data pipelines.",
    icon: "📊",
    accent: "#44ffaa",
  },
  {
    title: "WhatsApp Automations",
    category: "Automation",
    tools: "Twilio · Python · N8N",
    desc: "End-to-end WhatsApp bots for lead capture, reminders, and customer support — zero manual effort.",
    icon: "📲",
    accent: "#c2a4ff",
  },
  {
    title: "WooCommerce Crawler",
    category: "Web Automation",
    tools: "Scrapy · Selenium · WordPress API",
    desc: "Scrapes competitor product listings, auto-redesigns content, and publishes to WooCommerce stores.",
    icon: "🕷️",
    accent: "#c2a4ff",
  },
  {
    title: "Padel Booking Software",
    category: "Software · SaaS",
    tools: "Next.js · Stripe · PostgreSQL",
    desc: "Full-stack court booking platform with real-time slot availability, payments, and player profiles.",
    icon: "🎾",
    accent: "#44ffaa",
  },
];

// ─── GitHub Icon SVG ───────────────────────────────────────────────────────
function GithubIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  );
}

// ─── Mobile Modal ──────────────────────────────────────────────────────────
function MobileModal({ project, onClose }: { project: typeof medicalProjects[0]; onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(6px)",
          display: "flex", alignItems: "flex-end", justifyContent: "center",
          padding: "0 0 0 0",
        }}
      >
        <motion.div
          key="sheet"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 28, stiffness: 260 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "100%",
            maxWidth: 520,
            background: "rgba(11,8,12,0.98)",
            border: "1px solid rgba(194,164,255,0.25)",
            borderBottom: "none",
            borderRadius: "20px 20px 0 0",
            padding: "28px 24px 40px",
            position: "relative",
          }}
        >
          {/* Top glow */}
          <div style={{ position: "absolute", top: 0, left: 40, right: 40, height: 1, background: "linear-gradient(to right, transparent, rgba(194,164,255,0.6), transparent)" }} />

          {/* Handle bar */}
          <div style={{ width: 40, height: 4, borderRadius: 2, background: "rgba(194,164,255,0.3)", margin: "0 auto 24px" }} />

          {/* Header */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <p style={{ fontSize: 10, letterSpacing: 4, color: "var(--pink)", textTransform: "uppercase", marginBottom: 6 }}>
                {project.sublabel}
              </p>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: "var(--text)", lineHeight: 1.2 }}>
                {project.label}
              </h3>
            </div>
            <button
              onClick={onClose}
              style={{
                width: 32, height: 32, borderRadius: "50%",
                border: "1px solid rgba(194,164,255,0.3)",
                background: "rgba(194,164,255,0.06)",
                color: "var(--muted)", fontSize: 16,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", flexShrink: 0, marginTop: 2,
              }}
            >
              ×
            </button>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: "linear-gradient(to right, rgba(194,164,255,0.3), transparent)", marginBottom: 16 }} />

          {/* Description */}
          <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.85, fontWeight: 300, marginBottom: 20 }}>
            {project.desc}
          </p>

          {/* Tools */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
            {project.tools.map((t) => (
              <span key={t} style={{ fontSize: 11, color: "var(--accent)", border: "1px solid rgba(194,164,255,0.25)", padding: "4px 12px", borderRadius: 4, background: "rgba(194,164,255,0.06)" }}>{t}</span>
            ))}
          </div>

          {/* GitHub button */}
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              padding: "12px 24px",
              border: "1px solid rgba(194,164,255,0.35)",
              borderRadius: 8,
              color: "var(--accent)",
              fontSize: 13, letterSpacing: 1,
              textDecoration: "none",
              background: "rgba(194,164,255,0.06)",
              width: "100%",
            }}
          >
            <GithubIcon size={14} /> View on GitHub
          </a>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Medical Body Model ────────────────────────────────────────────────────
function MedicalBodyModel() {
  const [active, setActive] = useState<string | null>(null);
  const [mobileModal, setMobileModal] = useState<string | null>(null);
  const activeProject = medicalProjects.find((p) => p.id === active);
  const modalProject = medicalProjects.find((p) => p.id === mobileModal);

  return (
    <section id="projects" className="relative overflow-hidden" style={{ borderTop: "1px solid var(--border)", padding: "clamp(60px, 8vw, 100px) 0 clamp(50px, 6vw, 80px)" }}>
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div style={{ position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(194,164,255,0.05) 0%, transparent 65%)" }} />
        <div style={{ position: "absolute", bottom: "5%", right: "10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(194,164,255,0.04) 0%, transparent 70%)" }} />
      </div>

      <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 clamp(16px, 5vw, 80px)" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "clamp(40px, 6vw, 72px)", flexWrap: "wrap", gap: 16 }}>
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}
            >
              <div style={{ width: 32, height: 1, backgroundColor: "var(--accent)" }} />
              <p style={{ fontSize: 11, letterSpacing: 5, color: "var(--accent)", textTransform: "uppercase" }}>Medical AI</p>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.1 }}
              style={{ fontSize: "clamp(32px, 5vw, 64px)", fontWeight: 300, letterSpacing: -1, color: "var(--text)", lineHeight: 1.1 }}
            >
              Medical Imaging{" "}
              <span style={{ color: "var(--accent)", fontWeight: 700 }}>Suite</span>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ delay: 0.3 }}
            style={{ fontSize: 13, color: "var(--muted)", maxWidth: 320, lineHeight: 1.8, fontWeight: 300 }}
          >
            5 production-grade CV models detecting diseases across the human body. Click any dot to explore.
          </motion.p>
        </div>

        {/* ── Desktop layout: 3-column grid (hidden on mobile) ── */}
        <div className="hidden md:grid" style={{ gridTemplateColumns: "1fr 340px 1fr", gap: 32, alignItems: "center", minHeight: 620 }}>

          {/* Left cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-end" }}>
            {medicalProjects.filter((p) => p.side === "left").map((p, i) => (
              <ProjectCard key={p.id} project={p} active={active} setActive={setActive} delay={i * 0.1} align="right" />
            ))}
          </div>

          {/* Center body */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }} transition={{ duration: 1 }}
            style={{ position: "relative", margin: "0 auto", width: 340, height: 600 }}
          >
            <div style={{ position: "absolute", inset: -60, background: "radial-gradient(ellipse, rgba(194,164,255,0.07) 0%, transparent 65%)", pointerEvents: "none" }} />
            <Image
              src="/Human-body2.png"
              alt="Human body model"
              fill
              sizes="340px"
              className="object-contain"
              style={{ filter: "brightness(0.9) saturate(0.5) hue-rotate(200deg)", mixBlendMode: "screen" }}
            />
            {medicalProjects.map((p) => (
              <button
                key={p.id}
                onClick={() => setActive(active === p.id ? null : p.id)}
                style={{
                  position: "absolute",
                  top: p.dot.top, left: p.dot.left,
                  transform: "translate(-50%,-50%)",
                  width: active === p.id ? 20 : 13,
                  height: active === p.id ? 20 : 13,
                  borderRadius: "50%",
                  background: active === p.id ? "var(--pink)" : "var(--accent)",
                  border: `2px solid ${active === p.id ? "rgba(194,164,255,0.8)" : "rgba(194,164,255,0.6)"}`,
                  boxShadow: active === p.id
                    ? "0 0 24px rgba(194,164,255,0.9), 0 0 48px rgba(194,164,255,0.4)"
                    : "0 0 10px rgba(194,164,255,0.6)",
                  transition: "all 0.3s ease",
                  zIndex: 10,
                  animation: active === p.id ? "none" : "pulseGlow 2s ease-in-out infinite",
                  cursor: "pointer", padding: 0, outline: "none",
                }}
                title={p.label}
              />
            ))}
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 5, overflow: "visible" }}>
              {medicalProjects.map((p) => {
                const dotX = parseFloat(p.dot.left) / 100 * 340;
                const dotY = parseFloat(p.dot.top) / 100 * 600;
                const endX = p.side === "left" ? -80 : 420;
                const isAct = active === p.id;
                return (
                  <g key={p.id}>
                    <line x1={dotX} y1={dotY} x2={endX} y2={dotY}
                      stroke={isAct ? "var(--pink)" : "rgba(194,164,255,0.15)"}
                      strokeWidth={isAct ? 1.5 : 0.8}
                      strokeDasharray={isAct ? "none" : "4,6"}
                      style={{ transition: "stroke 0.3s, stroke-width 0.3s" }}
                    />
                    {isAct && <circle cx={endX} cy={dotY} r={3} fill="var(--pink)" opacity={0.8} />}
                  </g>
                );
              })}
            </svg>
          </motion.div>

          {/* Right column — cards OR detail panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-start" }}>
            <AnimatePresence mode="wait">
              {activeProject ? (
                /* ── Inline detail panel ── */
                <motion.div
                  key={`detail-${activeProject.id}`}
                  initial={{ opacity: 0, x: 30, scale: 0.97 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.97 }}
                  transition={{ duration: 0.35 }}
                  style={{
                    width: "100%",
                    padding: "24px 24px 20px",
                    background: "rgba(11,8,12,0.92)",
                    border: "1px solid rgba(194,164,255,0.3)",
                    borderRadius: 12,
                    backdropFilter: "blur(12px)",
                    boxShadow: "0 0 40px rgba(194,164,255,0.1)",
                    position: "relative",
                  }}
                >
                  {/* Top glow line */}
                  <div style={{ position: "absolute", top: 0, left: 32, right: 32, height: 1, background: "linear-gradient(to right, transparent, rgba(194,164,255,0.6), transparent)" }} />

                  {/* Close button */}
                  <button
                    onClick={() => setActive(null)}
                    style={{
                      position: "absolute", top: 12, right: 12,
                      width: 28, height: 28, borderRadius: "50%",
                      border: "1px solid rgba(194,164,255,0.25)",
                      background: "rgba(194,164,255,0.06)",
                      color: "var(--muted)", fontSize: 14,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer",
                    }}
                  >×</button>

                  <p style={{ fontSize: 10, letterSpacing: 4, color: "var(--pink)", textTransform: "uppercase", marginBottom: 6 }}>
                    {activeProject.sublabel}
                  </p>
                  <h3 style={{ fontSize: 19, fontWeight: 700, color: "var(--text)", marginBottom: 12, paddingRight: 32 }}>
                    {activeProject.label}
                  </h3>

                  <div style={{ height: 1, background: "linear-gradient(to right, rgba(194,164,255,0.25), transparent)", marginBottom: 14 }} />

                  <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.85, fontWeight: 300, marginBottom: 18 }}>
                    {activeProject.desc}
                  </p>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 20 }}>
                    {activeProject.tools.map((t) => (
                      <span key={t} style={{ fontSize: 11, color: "var(--accent)", border: "1px solid rgba(194,164,255,0.25)", padding: "3px 10px", borderRadius: 4, background: "rgba(194,164,255,0.06)" }}>{t}</span>
                    ))}
                  </div>

                  <a
                    href={activeProject.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      padding: "10px 20px",
                      border: "1px solid rgba(194,164,255,0.3)",
                      borderRadius: 7,
                      color: "var(--accent)",
                      fontSize: 12, letterSpacing: 1,
                      textDecoration: "none",
                      background: "rgba(194,164,255,0.06)",
                      transition: "all 0.2s",
                      width: "100%",
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--accent)"; (e.currentTarget as HTMLAnchorElement).style.background = "rgba(194,164,255,0.12)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(194,164,255,0.3)"; (e.currentTarget as HTMLAnchorElement).style.background = "rgba(194,164,255,0.06)"; }}
                  >
                    <GithubIcon size={14} /> View on GitHub
                  </a>
                </motion.div>
              ) : (
                /* ── Right cards (default) ── */
                <motion.div key="right-cards" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
                  style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%" }}>
                  {medicalProjects.filter((p) => p.side === "right").map((p, i) => (
                    <ProjectCard key={p.id} project={p} active={active} setActive={setActive} delay={i * 0.1} align="left" />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Mobile layout ── */}
        <div className="md:hidden" style={{ position: "relative" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr min(220px, 55vw) 1fr", gap: 8, alignItems: "center", minHeight: 500 }}>

            {/* Left labels */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-end" }}>
              {medicalProjects.filter((p) => p.side === "left").map((p) => (
                <button key={p.id} onClick={() => setMobileModal(mobileModal === p.id ? null : p.id)}
                  style={{
                    textAlign: "right",
                    background: mobileModal === p.id ? "rgba(194,164,255,0.06)" : "rgba(11,8,12,0.5)",
                    border: `1px solid ${mobileModal === p.id ? "rgba(194,164,255,0.4)" : "rgba(194,164,255,0.15)"}`,
                    borderRadius: 6, padding: "8px 10px", cursor: "pointer", transition: "all 0.25s", width: "100%",
                  }}>
                  <p style={{ fontSize: 10, letterSpacing: 2, color: "var(--pink)", textTransform: "uppercase", marginBottom: 4 }}>{p.sublabel}</p>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", lineHeight: 1.3 }}>{p.label}</p>
                </button>
              ))}
            </div>

            {/* Center body */}
            <motion.div initial={{ opacity: 0, scale: 0.92 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1 }}
              style={{ position: "relative", width: "100%", aspectRatio: "0.57", margin: "0 auto" }}>
              <div style={{ position: "absolute", inset: -30, background: "radial-gradient(ellipse, rgba(194,164,255,0.07) 0%, transparent 65%)", pointerEvents: "none" }} />
              <Image src="/Human-body2.png" alt="Human body model" fill sizes="55vw" className="object-contain"
                style={{ filter: "brightness(0.9) saturate(0.5) hue-rotate(200deg)", mixBlendMode: "screen" }} />
              {medicalProjects.map((p) => (
                <button key={p.id} onClick={() => setMobileModal(mobileModal === p.id ? null : p.id)}
                  style={{
                    position: "absolute", top: p.dot.top, left: p.dot.left,
                    transform: "translate(-50%,-50%)",
                    width: mobileModal === p.id ? 20 : 13, height: mobileModal === p.id ? 20 : 13,
                    borderRadius: "50%",
                    background: mobileModal === p.id ? "var(--pink)" : "var(--accent)",
                    border: `2px solid ${mobileModal === p.id ? "rgba(194,164,255,0.8)" : "rgba(194,164,255,0.6)"}`,
                    boxShadow: mobileModal === p.id ? "0 0 24px rgba(194,164,255,0.9)" : "0 0 10px rgba(194,164,255,0.6)",
                    transition: "all 0.3s ease", zIndex: 10,
                    animation: mobileModal === p.id ? "none" : "pulseGlow 2s ease-in-out infinite",
                    cursor: "pointer", padding: 0, outline: "none",
                  }} />
              ))}
              <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 5, overflow: "visible" }}>
                {medicalProjects.map((p) => {
                  const bodyW = 220; const bodyH = bodyW / 0.57;
                  const dotX = parseFloat(p.dot.left) / 100 * bodyW;
                  const dotY = parseFloat(p.dot.top) / 100 * bodyH;
                  const endX = p.side === "left" ? -40 : bodyW + 40;
                  const isAct = mobileModal === p.id;
                  return (
                    <g key={p.id}>
                      <line x1={dotX} y1={dotY} x2={endX} y2={dotY}
                        stroke={isAct ? "var(--pink)" : "rgba(194,164,255,0.15)"}
                        strokeWidth={isAct ? 1.5 : 0.8} strokeDasharray={isAct ? "none" : "4,6"}
                        style={{ transition: "stroke 0.3s, stroke-width 0.3s" }} />
                      {isAct && <circle cx={endX} cy={dotY} r={3} fill="var(--pink)" opacity={0.8} />}
                    </g>
                  );
                })}
              </svg>
            </motion.div>

            {/* Right labels */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
              {medicalProjects.filter((p) => p.side === "right").map((p) => (
                <button key={p.id} onClick={() => setMobileModal(mobileModal === p.id ? null : p.id)}
                  style={{
                    textAlign: "left",
                    background: mobileModal === p.id ? "rgba(194,164,255,0.06)" : "rgba(11,8,12,0.5)",
                    border: `1px solid ${mobileModal === p.id ? "rgba(194,164,255,0.4)" : "rgba(194,164,255,0.15)"}`,
                    borderRadius: 6, padding: "8px 10px", cursor: "pointer", transition: "all 0.25s", width: "100%",
                  }}>
                  <p style={{ fontSize: 10, letterSpacing: 2, color: "var(--pink)", textTransform: "uppercase", marginBottom: 4 }}>{p.sublabel}</p>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", lineHeight: 1.3 }}>{p.label}</p>
                </button>
              ))}
            </div>
          </div>

          <p style={{ textAlign: "center", fontSize: 11, color: "var(--muted)", letterSpacing: 2, marginTop: 16, textTransform: "uppercase" }}>
            Tap any dot or label to explore
          </p>

          {/* Mobile inline detail — slides in below the 3-col grid */}
          <AnimatePresence>
            {mobileModal && (() => {
              const mp = medicalProjects.find(p => p.id === mobileModal);
              if (!mp) return null;
              return (
                <motion.div
                  key={mp.id}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.3 }}
                  style={{
                    marginTop: 20,
                    padding: "20px 20px 18px",
                    background: "rgba(11,8,12,0.95)",
                    border: "1px solid rgba(194,164,255,0.3)",
                    borderRadius: 12,
                    backdropFilter: "blur(12px)",
                    position: "relative",
                  }}
                >
                  <div style={{ position: "absolute", top: 0, left: 32, right: 32, height: 1, background: "linear-gradient(to right, transparent, rgba(194,164,255,0.5), transparent)" }} />
                  <button onClick={() => setMobileModal(null)}
                    style={{
                      position: "absolute", top: 10, right: 10,
                      width: 26, height: 26, borderRadius: "50%",
                      border: "1px solid rgba(194,164,255,0.25)", background: "rgba(194,164,255,0.06)",
                      color: "var(--muted)", fontSize: 14,
                      display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                    }}>×</button>
                  <p style={{ fontSize: 9, letterSpacing: 3, color: "var(--pink)", textTransform: "uppercase", marginBottom: 4 }}>{mp.sublabel}</p>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--text)", marginBottom: 10, paddingRight: 28 }}>{mp.label}</h3>
                  <div style={{ height: 1, background: "linear-gradient(to right, rgba(194,164,255,0.2), transparent)", marginBottom: 12 }} />
                  <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.8, fontWeight: 300, marginBottom: 14 }}>{mp.desc}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                    {mp.tools.map((t) => (
                      <span key={t} style={{ fontSize: 10, color: "var(--accent)", border: "1px solid rgba(194,164,255,0.25)", padding: "3px 9px", borderRadius: 4, background: "rgba(194,164,255,0.06)" }}>{t}</span>
                    ))}
                  </div>
                  <a href={mp.github} target="_blank" rel="noopener noreferrer"
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      padding: "11px", border: "1px solid rgba(194,164,255,0.3)", borderRadius: 7,
                      color: "var(--accent)", fontSize: 12, textDecoration: "none",
                      background: "rgba(194,164,255,0.06)", width: "100%",
                    }}>
                    <GithubIcon size={13} /> View on GitHub
                  </a>
                </motion.div>
              );
            })()}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}

// ─── Project Card ──────────────────────────────────────────────────────────
function ProjectCard({ project, active, setActive, delay, align, fullWidth }: {
  project: typeof medicalProjects[0];
  active: string | null;
  setActive: (id: string | null) => void;
  delay: number;
  align: "left" | "right";
  fullWidth?: boolean;
}) {
  const isActive = active === project.id;
  return (
    <motion.div
      initial={{ opacity: 0, x: align === "right" ? 30 : -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
      onClick={() => setActive(isActive ? null : project.id)}
      style={{
        padding: "16px 20px",
        border: `1px solid ${isActive ? "rgba(194,164,255,0.45)" : "var(--border)"}`,
        borderRadius: 8,
        cursor: "pointer",
        background: isActive ? "rgba(194,164,255,0.05)" : "rgba(11,8,12,0.6)",
        backdropFilter: "blur(8px)",
        transition: "all 0.3s ease",
        textAlign: fullWidth ? "left" : align,
        maxWidth: fullWidth ? "100%" : 280,
        width: "100%",
        boxShadow: isActive ? "0 0 20px rgba(194,164,255,0.1)" : "none",
      }}
    >
      <p style={{ fontSize: 10, letterSpacing: 3, color: isActive ? "var(--pink)" : "var(--accent)", textTransform: "uppercase", marginBottom: 4 }}>
        {project.sublabel}
      </p>
      <p style={{ fontSize: 14, fontWeight: 500, color: "var(--text)", marginBottom: 6, lineHeight: 1.3 }}>{project.label}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, justifyContent: fullWidth ? "flex-start" : align === "right" ? "flex-end" : "flex-start" }}>
        {project.tools.map((t) => (
          <span key={t} style={{ fontSize: 10, color: "var(--muted)", letterSpacing: 0.5 }}>{t}</span>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Autonomous Car Section ────────────────────────────────────────────────
function AutonomousCarSection() {
  const videoRef = useRef<HTMLDivElement>(null);
  const [gifIndex, setGifIndex] = useState(1);
  const gifs = ["/car1.gif", "/car2.gif", "/car3.gif"];

  useEffect(() => {
    const interval = setInterval(() => setGifIndex((i) => (i % 3) + 1), 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden" style={{ borderTop: "1px solid var(--border)", padding: "clamp(60px, 8vw, 100px) 0" }}>
      <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 clamp(16px, 5vw, 80px)" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "clamp(40px, 6vw, 72px)", flexWrap: "wrap", gap: 16 }}>
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
              <div style={{ width: 32, height: 1, backgroundColor: "var(--pink)" }} />
              <p style={{ fontSize: 11, letterSpacing: 5, color: "var(--pink)", textTransform: "uppercase" }}>Reinforcement Learning</p>
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} style={{ fontSize: "clamp(32px, 5vw, 64px)", fontWeight: 300, letterSpacing: -1, lineHeight: 1.1 }}>
              Autonomous <span style={{ color: "var(--pink)", fontWeight: 700 }}>Driving</span> RL
            </motion.h2>
          </div>
          <a
            href="https://github.com/BraWler66/Autonomous-Driving-using-Reinforcement-Learning"
            target="_blank" rel="noopener noreferrer"
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "12px 24px",
              border: "1px solid rgba(194,164,255,0.35)",
              borderRadius: 8,
              color: "var(--pink)",
              fontSize: 13,
              letterSpacing: 1,
              textDecoration: "none",
              background: "rgba(194,164,255,0.05)",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(194,164,255,0.1)"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--pink)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(194,164,255,0.05)"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(194,164,255,0.35)"; }}
          >
            <GithubIcon size={15} /> View on GitHub
          </a>
        </div>

        {/* 2-column on desktop, stacked on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: "clamp(32px, 5vw, 80px)", alignItems: "center" }}>
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <p style={{ fontSize: "clamp(14px, 1.6vw, 20px)", fontWeight: 300, lineHeight: 1.9, color: "var(--muted)", marginBottom: 40 }}>
              A self-driving agent trained with{" "}
              <span style={{ color: "var(--accent)" }}>Deep Q-Network</span> reinforcement learning inside
              the <span style={{ color: "var(--pink)" }}>CARLA Simulator</span>. Observes RGB camera feeds,
              plans routes, and learns urban navigation purely through reward signals — zero hand-coded rules.
            </p>

            <div className="grid grid-cols-2" style={{ gap: 20, marginBottom: 36 }}>
              {[
                { label: "Algorithm", value: "Deep Q-Network" },
                { label: "Environment", value: "CARLA Simulator" },
                { label: "Observation", value: "RGB Camera" },
                { label: "Framework", value: "OpenAI Gym" },
              ].map((item) => (
                <div key={item.label} style={{ borderLeft: "1px solid var(--border)", paddingLeft: 16 }}>
                  <p style={{ fontSize: 10, letterSpacing: 3, color: "var(--muted)", textTransform: "uppercase", marginBottom: 4 }}>{item.label}</p>
                  <p style={{ fontSize: 15, fontWeight: 500, color: "var(--text)" }}>{item.value}</p>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {["Reinforcement Learning", "CARLA", "DQN", "Computer Vision", "TensorBoard", "Python"].map((t) => (
                <span key={t} style={{ fontSize: 11, color: "var(--pink)", border: "1px solid rgba(194,164,255,0.25)", padding: "4px 12px", borderRadius: 4, background: "rgba(194,164,255,0.05)" }}>{t}</span>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} ref={videoRef}>
            <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", border: "1px solid rgba(194,164,255,0.2)", boxShadow: "0 0 60px rgba(194,164,255,0.08)", aspectRatio: "16/10" }}>
              <AnimatePresence mode="wait">
                <motion.div key={gifIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} style={{ position: "relative", width: "100%", height: "100%" }}>
                  <Image src={gifs[gifIndex - 1]} alt={`Autonomous car simulation ${gifIndex}`} fill unoptimized className="object-cover" />
                </motion.div>
              </AnimatePresence>
              <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "linear-gradient(to top, rgba(11,8,12,0.6) 0%, transparent 40%)" }} />
              <div style={{ position: "absolute", bottom: 14, left: 16, fontSize: 10, letterSpacing: 3, color: "rgba(194,164,255,0.7)", textTransform: "uppercase" }}>
                CARLA Simulator · DQN Agent
              </div>
              {[["top-2 left-2", true, false, true, false], ["top-2 right-2", true, false, false, true], ["bottom-2 left-2", false, true, true, false], ["bottom-2 right-2", false, true, false, true]].map(([pos, bt, bb, bl, br], i) => (
                <div key={i} className={`absolute ${pos} w-4 h-4 pointer-events-none`} style={{ borderTop: bt ? "1px solid rgba(194,164,255,0.5)" : "none", borderBottom: bb ? "1px solid rgba(194,164,255,0.5)" : "none", borderLeft: bl ? "1px solid rgba(194,164,255,0.5)" : "none", borderRight: br ? "1px solid rgba(194,164,255,0.5)" : "none" }} />
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 16 }}>
              {gifs.map((_, i) => (
                <button key={i} onClick={() => setGifIndex(i + 1)} style={{ width: gifIndex === i + 1 ? 24 : 8, height: 8, borderRadius: 4, background: gifIndex === i + 1 ? "var(--pink)" : "var(--border)", border: "none", transition: "all 0.3s ease", cursor: "pointer" }} />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Other Projects Marquee ────────────────────────────────────────────────
// Two horizontal rows scrolling in opposite directions.
// 10 cards × ~340px each = ~3400px total width per row.
// Duration is set so a card takes ~6s to travel its own width — slow enough
// that it won't reappear at the far end before it feels natural.
function OtherProjectsMarquee() {
  // Split 10 projects: first 5 in row1, last 5 in row2 — no duplicates between rows
  const half1 = otherProjects.slice(0, 5);
  const half2 = otherProjects.slice(5);
  // 4× copies for seamless loop on both desktop and mobile
  const row1 = [...half1, ...half1, ...half1, ...half1];
  const row2x = [...half2, ...half2, ...half2, ...half2];

  return (
    <section
      className="relative overflow-hidden"
      style={{ borderTop: "1px solid var(--border)", padding: "clamp(60px, 8vw, 100px) 0" }}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div style={{ position: "absolute", top: "20%", left: "20%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(194,164,255,0.05) 0%, transparent 65%)" }} />
        <div style={{ position: "absolute", bottom: "10%", right: "15%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(194,164,255,0.04) 0%, transparent 70%)" }} />
      </div>

      {/* Header */}
      <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 clamp(16px, 5vw, 80px)", marginBottom: 56 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}
        >
          <div style={{ width: 32, height: 1, backgroundColor: "var(--accent)" }} />
          <p style={{ fontSize: 11, letterSpacing: 5, color: "var(--accent)", textTransform: "uppercase" }}>More Work</p>
        </motion.div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <motion.h2
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.1 }}
            style={{ fontSize: "clamp(32px, 5vw, 64px)", fontWeight: 300, letterSpacing: -1, lineHeight: 1.1 }}
          >
            Beyond the{" "}
            <span style={{ color: "var(--accent)", fontWeight: 700 }}>spotlight</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ delay: 0.3 }}
            style={{ fontSize: 13, color: "var(--muted)", maxWidth: 280, lineHeight: 1.8, fontWeight: 300 }}
          >
            10 more builds — hardware, SaaS, automation & AI. Every card is a shipped product.
          </motion.p>
        </div>
      </div>

      {/* Rows */}
      <div style={{ overflow: "hidden", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        {/* Row 1 — left */}
        <div style={{ borderBottom: "1px solid rgba(127,64,255,0.12)", paddingTop: 2, paddingBottom: 2 }}>
          <div className="marquee-row1" style={{ display: "flex", gap: 12, animation: `marquee-desktop 90s linear infinite`, width: "max-content" }}>
            {row1.map((p, i) => <MarqueeCard key={i} project={p} />)}
          </div>
        </div>
        {/* Row 2 — right */}
        <div style={{ paddingTop: 2, paddingBottom: 2 }}>
          <div className="marquee-row2" style={{ display: "flex", gap: 12, animation: `marquee-desktop 80s linear infinite reverse`, width: "max-content" }}>
            {row2x.map((p, i) => <MarqueeCard key={i} project={p} />)}
          </div>
        </div>
      </div>

      <style>{`
        /* Desktop: card = 340px, 5 cards × 4 copies = 20 cards, one set = 5 × 352px = 1760px, translate = 25% (1 of 4 sets) */
        @keyframes marquee-desktop {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-25%); }
        }
        /* Mobile: card = 220px, gap = 10px, one set = 5 × 230px = 1150px, translate = 25% (1 of 4 sets) */
        @keyframes marquee-mobile {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-25%); }
        }
        @media (max-width: 767px) {
          .marquee-row1 {
            animation-name: marquee-mobile !important;
            animation-duration: 18s !important;
            gap: 10px !important;
          }
          .marquee-row2 {
            animation-name: marquee-mobile !important;
            animation-duration: 15s !important;
            gap: 10px !important;
          }
          .marquee-card {
            width: 220px !important;
            padding: 16px 16px !important;
          }
        }
      `}</style>
    </section>
  );
}

function MarqueeCard({ project, dim }: { project: typeof otherProjects[0]; dim?: boolean }) {
  return (
    <div
      className="marquee-card"
      style={{
        flexShrink: 0,
        width: 340,
        padding: "22px 24px",
        border: `1px solid ${project.accent}22`,
        borderRadius: 10,
        opacity: dim ? 0.5 : 1,
        position: "relative",
        background: "rgba(11,8,12,0.6)",
        backdropFilter: "blur(6px)",
        transition: "opacity 0.3s, border-color 0.3s",
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.opacity = "1"; (e.currentTarget as HTMLDivElement).style.borderColor = `${project.accent}55`; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.opacity = dim ? "0.5" : "1"; (e.currentTarget as HTMLDivElement).style.borderColor = `${project.accent}22`; }}
    >
      {/* Top accent line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 1,
        background: `linear-gradient(to right, transparent, ${project.accent}60, transparent)`,
      }} />

      {/* Icon + category */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <p style={{ fontSize: 9, letterSpacing: 2.5, color: project.accent, textTransform: "uppercase", fontWeight: 500 }}>
          {project.category}
        </p>
        <span style={{ fontSize: 18, lineHeight: 1 }}>{project.icon}</span>
      </div>

      {/* Title */}
      <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", marginBottom: 8, letterSpacing: -0.2, lineHeight: 1.3 }}>
        {project.title}
      </p>

      {/* Desc */}
      <p style={{ fontSize: 11, color: "var(--muted)", lineHeight: 1.7, marginBottom: 14, fontWeight: 300 }}>
        {project.desc}
      </p>

      {/* Tools */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
        {project.tools.split(" · ").map((t) => (
          <span key={t} style={{
            fontSize: 10, color: project.accent,
            border: `1px solid ${project.accent}30`,
            backgroundColor: `${project.accent}08`,
            padding: "2px 8px", borderRadius: 3, letterSpacing: 0.3,
          }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

// ─── VR Therapy FYP Section ───────────────────────────────────────────────
function VRTherapySection() {
  const [activeStep, setActiveStep] = useState(0);
  const [activeTrack, setActiveTrack] = useState<"chat" | "vr">("chat");
  const [isPlaying, setIsPlaying] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const chatSteps = [
    {
      id: 0,
      icon: "🔐",
      label: "Login / Register",
      sublabel: "Secure Auth",
      color: "#7f40ff",
      desc: "Patient logs in via secure web portal. Role-based access — user or admin panel with full dashboard.",
      screen: "/vr/vr-login.png",
      screenLabel: "Auth Portal",
    },
    {
      id: 1,
      icon: "🎙️",
      label: "Voice / Text Input",
      sublabel: "Whisper STT",
      color: "#c2a4ff",
      desc: "Patient speaks or types. Whisper STT transcribes speech to text in real-time.",
      screen: "/vr/vr-chat.png",
      screenLabel: "Therapy Chat",
    },
    {
      id: 2,
      icon: "🧠",
      label: "LangGraph Routes",
      sublabel: "Multi-Agent Orchestration",
      color: "#c2a4ff",
      desc: "LangGraph orchestrates agents — routes input to Mistral-7B, BERT classifiers and XAI in parallel.",
      screen: null,
      screenLabel: null,
    },
    {
      id: 3,
      icon: "🤖",
      label: "Mistral-7B Responds",
      sublabel: "LoRA Fine-tuned LLM",
      color: "#c2a4ff",
      desc: "Fine-tuned Mistral-7B generates a compassionate CBT/mindfulness response tailored to patient state.",
      screen: "/vr/vr-chat.png",
      screenLabel: "Therapy Session",
    },
    {
      id: 4,
      icon: "📊",
      label: "Admin Dashboard",
      sublabel: "Analytics & Monitoring",
      color: "#c2a4ff",
      desc: "Admin monitors all sessions, user activity, reports generated, and platform analytics in real-time.",
      screen: "/vr/vr-admin.png",
      screenLabel: "Admin Panel",
    },
  ];

  const vrSteps = [
    {
      id: 0,
      icon: "🥽",
      label: "VR Initialization",
      sublabel: "Unity · Welcome Screen",
      color: "#7f40ff",
      desc: "Patient puts on VR headset. Unity scene loads — 'Welcome to AI VR Therapy. Please speak your NAME and ID to begin.'",
      screen: "/vr/vr-welcome.png",
      screenLabel: "VR Welcome",
    },
    {
      id: 1,
      icon: "🎙️",
      label: "Voice Authentication",
      sublabel: "Whisper STT · Identity",
      color: "#c2a4ff",
      desc: "Patient speaks name and ID. Whisper STT transcribes. System authenticates and starts therapy session timer.",
      screen: "/vr/vr-avatar.png",
      screenLabel: "VR Environment",
    },
    {
      id: 2,
      icon: "🧠",
      label: "AI Pipeline Runs",
      sublabel: "LangGraph + 4× BERT + Mistral",
      color: "#c2a4ff",
      desc: "Speech flows through LangGraph → 4× BERT classifiers (emotion, sentiment, crisis, topic) → Mistral-7B generates response → XAI analyzer explains output.",
      screen: null,
      screenLabel: null,
    },
    {
      id: 3,
      icon: "🗣️",
      label: "Avatar Speaks",
      sublabel: "ElevenLabs TTS · Unity Avatar",
      color: "#c2a4ff",
      desc: "AI therapist avatar inside the VR room speaks the response via ElevenLabs ultra-realistic TTS. Avatar lip-syncs in Unity.",
      screen: "/vr/vr-avatar.png",
      screenLabel: "Therapy Session",
    },
    {
      id: 4,
      icon: "📋",
      label: "Session Report",
      sublabel: "XAI · MongoDB · FastAPI",
      color: "#c2a4ff",
      desc: "Session data, emotions detected, and AI decisions are logged to MongoDB via FastAPI. XAI report generated for clinician review.",
      screen: null,
      screenLabel: null,
    },
  ];

  const steps = activeTrack === "chat" ? chatSteps : vrSteps;
  const current = steps[activeStep];

  const advance = useCallback(() => {
    setActiveStep(prev => (prev + 1) % steps.length);
  }, [steps.length]);

  useEffect(() => {
    setActiveStep(0);
  }, [activeTrack]);

  useEffect(() => {
    if (!isPlaying) return;
    timerRef.current = setTimeout(advance, 2200);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [isPlaying, advance, activeStep]);

  const techStack = [
    "Mistral-7B", "LoRA", "LangGraph", "BERT ×4", "T5-Large",
    "TextCNN", "Unity VR", "Whisper STT", "ElevenLabs", "FastAPI", "MongoDB", "XAI / SHAP",
  ];

  const stats = [
    { label: "AI Models", value: "8+", color: "#c2a4ff" },
    { label: "Agents", value: "6", color: "#c2a4ff" },
    { label: "Platform", value: "Unity", color: "#c2a4ff" },
    { label: "Classifiers", value: "4× BERT", color: "#7f40ff" },
  ];

  return (
    <section
      className="relative overflow-hidden"
      style={{ borderTop: "1px solid var(--border)", padding: "clamp(70px, 9vw, 120px) 0" }}
    >
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div style={{ position: "absolute", top: "5%", left: "50%", transform: "translateX(-50%)", width: 900, height: 900, borderRadius: "50%", background: "radial-gradient(circle, rgba(127,64,255,0.07) 0%, transparent 60%)" }} />
        <div style={{ position: "absolute", bottom: "10%", right: "5%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(194,164,255,0.05) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", top: "40%", left: "5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(127,64,255,0.04) 0%, transparent 70%)" }} />
        {[...Array(16)].map((_, i) => (
          <div key={i} className="vr-particle" style={{
            position: "absolute", borderRadius: "50%",
            width: i % 3 === 0 ? 2 : 1, height: i % 3 === 0 ? 2 : 1,
            background: ["rgba(194,164,255,0.5)", "rgba(194,164,255,0.4)", "rgba(194,164,255,0.3)", "rgba(127,64,255,0.5)"][i % 4],
            top: `${10 + (i * 37) % 80}%`, left: `${5 + (i * 53) % 90}%`,
            animationDelay: `${(i * 0.7) % 5}s`,
          }} />
        ))}
      </div>

      <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 clamp(16px, 5vw, 80px)", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ marginBottom: "clamp(40px, 6vw, 72px)" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
            <div style={{ width: 32, height: 1, background: "linear-gradient(to right, var(--accent-dark), var(--accent))" }} />
            <p style={{ fontSize: 11, letterSpacing: 5, color: "var(--accent)", textTransform: "uppercase" }}>Final Year Project · FYP</p>
          </motion.div>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
            <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              style={{ fontSize: "clamp(28px, 4.5vw, 60px)", fontWeight: 300, letterSpacing: -1, lineHeight: 1.1, maxWidth: 700 }}>
              AI-Powered{" "}
              <span style={{ color: "var(--accent)", fontWeight: 700 }}>VR Therapy</span>
              {" "}for <span style={{ color: "var(--accent)", fontWeight: 400, fontStyle: "italic" }}>Mental Health</span>
            </motion.h2>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
              style={{ fontSize: 13, color: "var(--muted)", maxWidth: 300, lineHeight: 1.8, fontWeight: 300 }}>
              Two interfaces — a web chatbot and an immersive Unity VR session — both powered by the same 6-agent AI pipeline.
            </motion.p>
          </div>
        </div>

        {/* Stats row */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="vr-stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: "clamp(40px, 6vw, 64px)" }}>
          {stats.map((s) => (
            <div key={s.label} style={{ background: "rgba(11,8,12,0.6)", border: `1px solid ${s.color}30`, borderRadius: 10, padding: "14px 12px", textAlign: "center", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(to right, transparent, ${s.color}60, transparent)` }} />
              <p style={{ fontSize: "clamp(18px, 2.5vw, 26px)", fontWeight: 700, color: s.color, marginBottom: 4 }}>{s.value}</p>
              <p style={{ fontSize: 9, letterSpacing: 1.5, color: "var(--muted)", textTransform: "uppercase" }}>{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* ── ANIMATED WORKFLOW ── */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>

          {/* Track switcher */}
          <div style={{ display: "flex", gap: 12, marginBottom: 28, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: 8 }}>
              {(["chat", "vr"] as const).map((track) => (
                <button key={track} onClick={() => { setActiveTrack(track); setIsPlaying(true); }}
                  style={{
                    padding: "8px 20px", borderRadius: 8, border: "1px solid",
                    borderColor: activeTrack === track ? "var(--accent)" : "var(--border)",
                    background: activeTrack === track ? "rgba(194,164,255,0.1)" : "transparent",
                    color: activeTrack === track ? "var(--accent)" : "var(--muted)",
                    fontSize: 12, fontWeight: 600, letterSpacing: 1, cursor: "pointer",
                    transition: "all 0.2s",
                    display: "flex", alignItems: "center", gap: 8,
                  }}>
                  {track === "chat" ? "💬" : "🥽"} {track === "chat" ? "WEB CHATBOT" : "VR SESSION"}
                </button>
              ))}
            </div>
            {/* Play/Pause */}
            <button onClick={() => setIsPlaying(p => !p)}
              style={{
                padding: "6px 14px", borderRadius: 6, border: "1px solid var(--border)",
                background: "rgba(194,164,255,0.06)", color: "var(--accent)",
                fontSize: 11, letterSpacing: 1, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 6,
              }}>
              {isPlaying ? "⏸ PAUSE" : "▶ PLAY"}
            </button>
          </div>

          {/* Main workflow area */}
          <div className="vr-workflow-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(24px, 4vw, 56px)", alignItems: "start" }}>

            {/* LEFT — Step-by-step flow */}
            <div>
              <p style={{ fontSize: 10, letterSpacing: 4, color: "var(--muted)", textTransform: "uppercase", marginBottom: 16 }}>
                {activeTrack === "chat" ? "Web Chatbot Flow" : "VR Session Flow"}
              </p>
              <div style={{ position: "relative" }}>
                {/* Vertical connector line */}
                <div style={{ position: "absolute", left: 19, top: 20, bottom: 20, width: 1, background: "linear-gradient(to bottom, rgba(127,64,255,0.5), rgba(194,164,255,0.3), rgba(127,64,255,0.1))", zIndex: 0 }} />

                {steps.map((step, i) => {
                  const isActive = activeStep === i;
                  const isDone = i < activeStep;
                  return (
                    <div key={step.id} onClick={() => { setActiveStep(i); setIsPlaying(false); }}
                      style={{ display: "flex", gap: 14, marginBottom: 12, cursor: "pointer", position: "relative", zIndex: 1 }}>
                      {/* Node circle */}
                      <div style={{
                        width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
                        border: `2px solid ${isActive ? step.color : isDone ? step.color + "60" : "rgba(255,255,255,0.1)"}`,
                        background: isActive ? `${step.color}20` : isDone ? `${step.color}10` : "rgba(11,8,12,0.8)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 15, transition: "all 0.3s ease",
                        boxShadow: isActive ? `0 0 18px ${step.color}50` : "none",
                      }}>
                        {isDone && !isActive ? "✓" : step.icon}
                      </div>
                      {/* Content card */}
                      <div style={{
                        flex: 1, padding: "10px 14px", borderRadius: 10,
                        border: `1px solid ${isActive ? step.color + "50" : "rgba(255,255,255,0.07)"}`,
                        background: isActive ? `${step.color}0a` : "rgba(11,8,12,0.4)",
                        transition: "all 0.3s ease",
                        position: "relative", overflow: "hidden",
                      }}>
                        {isActive && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(to right, transparent, ${step.color}70, transparent)` }} />}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: isActive ? 6 : 0 }}>
                          <div>
                            <p style={{ fontSize: 13, fontWeight: isActive ? 600 : 400, color: isActive ? "var(--text)" : "var(--muted)", lineHeight: 1.2, transition: "all 0.3s" }}>{step.label}</p>
                            <p style={{ fontSize: 10, color: step.color, letterSpacing: 0.8, marginTop: 2, opacity: isActive ? 1 : 0.5, transition: "opacity 0.3s" }}>{step.sublabel}</p>
                          </div>
                          {/* Progress dot */}
                          <div style={{ width: 6, height: 6, borderRadius: "50%", background: isActive ? step.color : "transparent", boxShadow: isActive ? `0 0 8px ${step.color}` : "none", transition: "all 0.3s", flexShrink: 0 }} className={isActive ? "vr-dot-pulse" : ""} />
                        </div>
                        <AnimatePresence>
                          {isActive && (
                            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              style={{ fontSize: 11.5, color: "var(--muted)", lineHeight: 1.75, overflow: "hidden" }}>
                              {step.desc}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Progress bar */}
              <div style={{ marginTop: 20, height: 2, borderRadius: 2, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                <motion.div
                  style={{ height: "100%", background: `linear-gradient(to right, var(--accent-dark), var(--accent))`, borderRadius: 2 }}
                  animate={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                <p style={{ fontSize: 10, color: "var(--muted)" }}>Step {activeStep + 1} of {steps.length}</p>
                <div style={{ display: "flex", gap: 6 }}>
                  {steps.map((_, i) => (
                    <button key={i} onClick={() => { setActiveStep(i); setIsPlaying(false); }}
                      style={{ width: activeStep === i ? 20 : 6, height: 6, borderRadius: 3, border: "none", cursor: "pointer", transition: "all 0.3s",
                        background: activeStep === i ? "var(--accent)" : i < activeStep ? "rgba(194,164,255,0.4)" : "rgba(255,255,255,0.1)" }} />
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT — Screenshot preview */}
            <div>
              <p style={{ fontSize: 10, letterSpacing: 4, color: "var(--muted)", textTransform: "uppercase", marginBottom: 16 }}>
                Live Preview
              </p>
              <AnimatePresence mode="wait">
                <motion.div key={`${activeTrack}-${activeStep}`}
                  initial={{ opacity: 0, y: 16, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.97 }}
                  transition={{ duration: 0.35 }}
                  style={{ borderRadius: 14, overflow: "hidden", border: `1px solid ${current.color}30`, boxShadow: `0 0 40px ${current.color}18`, position: "relative" }}>
                  {/* Corner brackets */}
                  {[["top:8px;left:8px", "top right"], ["top:8px;right:8px", "top left"], ["bottom:8px;left:8px", "bottom right"], ["bottom:8px;right:8px", "bottom left"]].map(([s, b], idx) => (
                    <div key={idx} style={{
                      position: "absolute", width: 16, height: 16, zIndex: 2, pointerEvents: "none",
                      ...(Object.fromEntries(s.split(";").map(p => [p.split(":")[0], p.split(":")[1]]))),
                      borderTop: b.includes("top") ? `1px solid ${current.color}90` : "none",
                      borderBottom: b.includes("bottom") ? `1px solid ${current.color}90` : "none",
                      borderLeft: b.includes("left") ? `1px solid ${current.color}90` : "none",
                      borderRight: b.includes("right") ? `1px solid ${current.color}90` : "none",
                    }} />
                  ))}

                  {current.screen ? (
                    <img
                      src={current.screen}
                      alt={current.screenLabel || ""}
                      style={{ width: "100%", display: "block", aspectRatio: "16/10", objectFit: "cover" }}
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; (e.currentTarget.nextSibling as HTMLElement).style.display = "flex"; }}
                    />
                  ) : null}

                  {/* Fallback / AI processing visual */}
                  <div style={{
                    display: current.screen ? "none" : "flex",
                    aspectRatio: "16/10",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    background: `linear-gradient(135deg, rgba(11,8,12,0.95), ${current.color}08)`,
                    gap: 12,
                  }}>
                    <div style={{ fontSize: 40 }}>{current.icon}</div>
                    <p style={{ fontSize: 13, color: current.color, letterSpacing: 2, fontWeight: 600 }}>{current.label}</p>
                    {/* Animated data flow lines */}
                    <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                      {[...Array(5)].map((_, i) => (
                        <div key={i} style={{ width: 3, background: current.color, borderRadius: 2, opacity: 0.7 }}
                          className={`vr-bar-${i}`} />
                      ))}
                    </div>
                    <p style={{ fontSize: 10, color: "var(--muted)", letterSpacing: 1.5 }}>PROCESSING...</p>
                  </div>

                  {/* Bottom label bar */}
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "10px 14px", background: "linear-gradient(to top, rgba(11,8,12,0.92), transparent)", display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)" }} className="vr-dot-pulse" />
                    <p style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", letterSpacing: 2, textTransform: "uppercase" }}>
                      {current.screenLabel || current.label}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

            </div>
          </div>
        </motion.div>


      </div>

      <style>{`
        @keyframes vrParticleFloat {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.4; }
          50% { transform: translateY(-18px) translateX(6px); opacity: 0.8; }
        }
        @keyframes vrDotPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.7); }
        }
        @keyframes vrBarGrow {
          0%, 100% { height: 8px; }
          50% { height: 28px; }
        }
        .vr-particle { animation: vrParticleFloat 6s ease-in-out infinite; }
        .vr-dot-pulse { animation: vrDotPulse 1.2s ease-in-out infinite; }
        .vr-bar-0 { animation: vrBarGrow 0.8s ease-in-out infinite; animation-delay: 0s; }
        .vr-bar-1 { animation: vrBarGrow 0.8s ease-in-out infinite; animation-delay: 0.15s; }
        .vr-bar-2 { animation: vrBarGrow 0.8s ease-in-out infinite; animation-delay: 0.3s; }
        .vr-bar-3 { animation: vrBarGrow 0.8s ease-in-out infinite; animation-delay: 0.45s; }
        .vr-bar-4 { animation: vrBarGrow 0.8s ease-in-out infinite; animation-delay: 0.6s; }
        @media (max-width: 767px) {
          .vr-workflow-grid { grid-template-columns: 1fr !important; }
          .vr-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  );
}

export default function ProjectsSection() {
  return (
    <>
      <MedicalBodyModel />
      <VRTherapySection />
      <AutonomousCarSection />
      <OtherProjectsMarquee />
    </>
  );
}
