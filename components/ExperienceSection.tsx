"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

const JOBS = [
  {
    id: "intern",
    tag: "INTERNSHIP",
    role: "Machine Learning Intern",
    company: "TechVentures ISB",
    period: "2024  ·  3 Months",
    location: "Islamabad, Pakistan",
    color: "#44ffaa",
    colorDim: "rgba(68,255,170,",
    hex: 0x44ffaa,
    bullets: [
      "Trained CV models for object detection & image classification tasks",
      "Built end-to-end data preprocessing & augmentation pipelines",
      "Implemented YOLOv8 for real-time inference on custom datasets",
      "Worked with Python, OpenCV, Scikit-learn & PyTorch",
    ],
    skills: ["Python", "OpenCV", "YOLOv8", "PyTorch", "Scikit-learn", "Computer Vision"],
  },
  {
    id: "neural",
    tag: "CURRENT",
    role: "AI Engineer",
    company: "Neural Lines",
    period: "Jul 2025  ·  Present",
    location: "Islamabad, Pakistan",
    color: "#c2a4ff",
    colorDim: "rgba(194,164,255,",
    hex: 0xfb8dff,
    bullets: [
      "Building production LangChain RAG pipelines & LLM applications",
      "Developing NLP systems: NER models, sentiment analysis, text classification",
      "Automated data workflows & interactive Power BI visualizations",
      "Fine-tuning LLMs and deploying AI models to production",
    ],
    skills: ["LangChain", "LLMs", "NER", "RAG", "NLP", "Power BI", "Fine-tuning", "FastAPI"],
  },
];

export default function ExperienceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const lineH = useTransform(scrollYProgress, [0.1, 0.7], ["0%", "100%"]);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        position: "relative",
        borderTop: "1px solid var(--border)",
        padding: "clamp(60px, 10vw, 120px) 0 clamp(70px, 12vw, 140px)",
      }}
    >
      {/* ── SPACE BACKGROUND GLOWS ── */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none">
        <div style={{ position: "absolute", top: "20%", left: "5%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(68,255,170,0.05) 0%, transparent 65%)" }} />
        <div style={{ position: "absolute", bottom: "10%", right: "5%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(194,164,255,0.06) 0%, transparent 65%)" }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 800, height: 800, borderRadius: "50%", background: "radial-gradient(circle, rgba(127,64,255,0.04) 0%, transparent 60%)" }} />
      </motion.div>

      {/* ── STAR DOTS (static decoration) ── */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: i % 3 === 0 ? 2 : 1,
            height: i % 3 === 0 ? 2 : 1,
            borderRadius: "50%",
            backgroundColor: i % 4 === 0 ? "rgba(68,255,170,0.5)" : i % 4 === 1 ? "rgba(194,164,255,0.4)" : "rgba(194,164,255,0.3)",
            left: `${(i * 17 + 3) % 95}%`,
            top: `${(i * 23 + 7) % 90}%`,
            animation: `twinkle ${2 + (i % 3)}s ease-in-out infinite ${i * 0.3}s`,
            pointerEvents: "none",
          }}
        />
      ))}

      {/* ── SECTION LABEL ── */}
      <div
        className="relative"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 clamp(20px, 6vw, 80px)",
          zIndex: 2,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}
        >
          <div style={{ width: 40, height: 1, backgroundColor: "var(--accent)" }} />
          <p style={{ fontSize: 11, letterSpacing: 6, color: "var(--accent)", textTransform: "uppercase", fontWeight: 500 }}>
            Work Experience
          </p>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.33, 0, 0, 1] }}
          style={{
            fontSize: "clamp(32px, 5vw, 68px)",
            fontWeight: 300,
            lineHeight: 1.15,
            marginBottom: "clamp(40px, 7vw, 80px)",
            letterSpacing: -1,
          }}
        >
          Where I&apos;ve{" "}
          <span style={{ color: "var(--accent)", fontWeight: 700 }}>shipped</span>
          <br />real AI.
        </motion.h2>

        {/* ── TIMELINE ── */}
        <div className="relative">

          {/* Vertical spine — desktop center, hidden on mobile (each mobile card has its own spine) */}
          <div
            className="experience-spine"
            style={{
              position: "absolute",
              left: "50%",
              top: 0,
              bottom: 0,
              width: 1,
              backgroundColor: "rgba(127,64,255,0.15)",
              transform: "translateX(-50%)",
            }}
          >
            {/* Animated fill */}
            <motion.div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: lineH,
                background: "linear-gradient(to bottom, #44ffaa, #7c3aed, #fb8dff)",
              }}
            />
          </div>

          {JOBS.map((job, idx) => (
            <JobCard key={job.id} job={job} idx={idx} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
        @keyframes orbitSpin {
          to { transform: rotate(360deg); }
        }
        @keyframes floatCard {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @media (max-width: 767px) {
          .experience-desktop { display: none !important; }
          .experience-mobile { display: block !important; }
          .experience-spine { display: none !important; }
        }
      `}</style>
    </section>
  );
}

function JobCard({ job, idx }: { job: typeof JOBS[0]; idx: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-80px" });
  const isLeft = idx % 2 === 0;

  return (
    <div ref={cardRef}>
      {/* ── DESKTOP: 3-column grid ── */}
      <div
        className="experience-desktop"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 80px 1fr",
          alignItems: "center",
          marginBottom: idx < JOBS.length - 1 ? 80 : 0,
          position: "relative",
        }}
      >
        {/* ── LEFT SIDE ── */}
        <div style={{ display: "flex", justifyContent: "flex-end", paddingRight: 48 }}>
          {isLeft ? (
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.33, 0, 0, 1] }}
              style={{ width: "100%", maxWidth: 480 }}
            >
              <CardContent job={job} />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{ textAlign: "right" }}
            >
              <PeriodBlock job={job} align="right" />
            </motion.div>
          )}
        </div>

        {/* ── CENTER NODE ── */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", position: "relative", zIndex: 2 }}>
          <TimelineNode job={job} isInView={isInView} />
        </div>

        {/* ── RIGHT SIDE ── */}
        <div style={{ paddingLeft: 48 }}>
          {!isLeft ? (
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.33, 0, 0, 1] }}
              style={{ maxWidth: 480 }}
            >
              <CardContent job={job} />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <PeriodBlock job={job} align="left" />
            </motion.div>
          )}
        </div>
      </div>

      {/* ── MOBILE: vertical stacked layout ── */}
      <div
        className="experience-mobile"
        style={{
          display: "none",
          marginBottom: idx < JOBS.length - 1 ? 48 : 0,
          position: "relative",
        }}
      >
        {/* Left spine line */}
        <div style={{
          position: "absolute",
          left: 20,
          top: 0,
          bottom: 0,
          width: 1,
          backgroundColor: `${job.color}25`,
        }} />

        {/* Node + header row */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20, position: "relative", zIndex: 2 }}>
          {/* Node */}
          <div style={{ flexShrink: 0 }}>
            <TimelineNode job={job} isInView={isInView} />
          </div>

          {/* Tag + period */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {/* Tag */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "3px 10px",
              border: `1px solid ${job.color}40`,
              borderRadius: 4,
              marginBottom: 6,
              backgroundColor: `${job.color}08`,
            }}>
              {job.id === "neural" && (
                <div style={{
                  width: 5, height: 5, borderRadius: "50%",
                  backgroundColor: job.color,
                  boxShadow: `0 0 8px ${job.color}`,
                  animation: "twinkle 1.5s ease-in-out infinite",
                }} />
              )}
              <span style={{ fontSize: 9, letterSpacing: 3, color: job.color, textTransform: "uppercase", fontWeight: 600 }}>
                {job.tag}
              </span>
            </div>
            {/* Period */}
            <div style={{ fontSize: 18, fontWeight: 300, color: "var(--text)", lineHeight: 1.2, marginBottom: 2 }}>
              {job.period}
            </div>
            <div style={{ fontSize: 10, letterSpacing: 2, color: "var(--muted)", textTransform: "uppercase" }}>
              {job.location}
            </div>
          </motion.div>
        </div>

        {/* Card — full width, offset from spine */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.33, 0, 0, 1], delay: 0.2 }}
          style={{ paddingLeft: 52 }}
        >
          <CardContent job={job} />
        </motion.div>
      </div>
    </div>
  );
}

function TimelineNode({ job, isInView }: { job: typeof JOBS[0]; isInView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: 0.3, type: "spring", stiffness: 200 }}
      style={{ position: "relative", width: 52, height: 52 }}
    >
      {/* outer spinning ring */}
      <div style={{
        position: "absolute", inset: -8,
        borderRadius: "50%",
        border: `1px solid ${job.color}40`,
        animation: "orbitSpin 8s linear infinite",
      }}>
        <div style={{
          position: "absolute", top: -3, left: "50%", transform: "translateX(-50%)",
          width: 5, height: 5, borderRadius: "50%",
          backgroundColor: job.color,
          boxShadow: `0 0 8px ${job.color}`,
        }} />
      </div>
      {/* middle ring */}
      <div style={{
        position: "absolute", inset: -2,
        borderRadius: "50%",
        border: `1px solid ${job.color}25`,
        animation: "orbitSpin 5s linear infinite reverse",
      }} />
      {/* core glow */}
      <div style={{
        width: "100%", height: "100%",
        borderRadius: "50%",
        background: `radial-gradient(circle, ${job.color}30 0%, ${job.color}08 60%, transparent 80%)`,
        border: `1.5px solid ${job.color}60`,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: `0 0 20px ${job.color}30, 0 0 40px ${job.color}10`,
      }}>
        <div style={{
          width: 14, height: 14, borderRadius: "50%",
          backgroundColor: job.color,
          boxShadow: `0 0 12px ${job.color}, 0 0 24px ${job.color}80`,
        }} />
      </div>
    </motion.div>
  );
}

function PeriodBlock({ job, align }: { job: typeof JOBS[0]; align: "left" | "right" }) {
  return (
    <div style={{ textAlign: align }}>
      {/* Tag */}
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "4px 12px",
        border: `1px solid ${job.color}40`,
        borderRadius: 4,
        marginBottom: 12,
        backgroundColor: `${job.color}08`,
      }}>
        {job.id === "neural" && (
          <div style={{
            width: 6, height: 6, borderRadius: "50%",
            backgroundColor: job.color,
            boxShadow: `0 0 8px ${job.color}`,
            animation: "twinkle 1.5s ease-in-out infinite",
          }} />
        )}
        <span style={{ fontSize: 10, letterSpacing: 3, color: job.color, textTransform: "uppercase", fontWeight: 600 }}>
          {job.tag}
        </span>
      </div>

      <div style={{ fontSize: 26, fontWeight: 300, color: "var(--text)", lineHeight: 1.2, marginBottom: 6 }}>
        {job.period}
      </div>
      <div style={{ fontSize: 12, letterSpacing: 2, color: "var(--muted)", textTransform: "uppercase" }}>
        {job.location}
      </div>
    </div>
  );
}

function CardContent({ job }: { job: typeof JOBS[0] }) {
  return (
    <div
      style={{
        position: "relative",
        background: "rgba(8, 4, 20, 0.85)",
        border: `1px solid ${job.color}30`,
        borderRadius: 16,
        padding: "clamp(20px, 4vw, 32px) clamp(18px, 4vw, 36px)",
        backdropFilter: "blur(12px)",
        animation: "floatCard 6s ease-in-out infinite",
        animationDelay: `${job.id === "neural" ? "3s" : "0s"}`,
        boxShadow: `0 0 0 1px ${job.color}10, 0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 ${job.color}15`,
      }}
    >
      {/* Top glow bar */}
      <div style={{
        position: "absolute", top: 0, left: 20, right: 20, height: 1,
        background: `linear-gradient(to right, transparent, ${job.color}60, transparent)`,
        borderRadius: 1,
      }} />

      {/* Corner brackets */}
      {[
        { top: -1, left: -1, borderTop: true, borderLeft: true },
        { top: -1, right: -1, borderTop: true, borderRight: true },
        { bottom: -1, left: -1, borderBottom: true, borderLeft: true },
        { bottom: -1, right: -1, borderBottom: true, borderRight: true },
      ].map((corner, ci) => (
        <div
          key={ci}
          style={{
            position: "absolute",
            width: 14, height: 14,
            top: "top" in corner ? corner.top : undefined,
            bottom: "bottom" in corner ? corner.bottom : undefined,
            left: "left" in corner ? corner.left : undefined,
            right: "right" in corner ? corner.right : undefined,
            borderTop: "borderTop" in corner ? `1.5px solid ${job.color}` : undefined,
            borderBottom: "borderBottom" in corner ? `1.5px solid ${job.color}` : undefined,
            borderLeft: "borderLeft" in corner ? `1.5px solid ${job.color}` : undefined,
            borderRight: "borderRight" in corner ? `1.5px solid ${job.color}` : undefined,
          }}
        />
      ))}

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h3 style={{
          fontSize: "clamp(18px, 2.2vw, 30px)",
          fontWeight: 700,
          color: "var(--text)",
          marginBottom: 6,
          letterSpacing: -0.5,
          lineHeight: 1.2,
        }}>
          {job.role}
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span style={{ fontSize: 15, color: job.color, fontWeight: 500 }}>
            {job.company}
          </span>
          <div style={{ width: 3, height: 3, borderRadius: "50%", backgroundColor: "var(--muted)" }} />
          <span style={{ fontSize: 12, color: "var(--muted)", letterSpacing: 1 }}>
            {job.location}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div style={{
        height: 1,
        background: `linear-gradient(to right, ${job.color}30, transparent)`,
        marginBottom: 20,
      }} />

      {/* Bullets */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
        {job.bullets.map((bullet, bi) => (
          <motion.div
            key={bi}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 + bi * 0.08 }}
            style={{ display: "flex", alignItems: "flex-start", gap: 10 }}
          >
            <div style={{
              width: 5, height: 5, borderRadius: "50%",
              backgroundColor: job.color,
              boxShadow: `0 0 6px ${job.color}80`,
              flexShrink: 0,
              marginTop: 7,
            }} />
            <span style={{ fontSize: 13.5, color: "var(--muted)", lineHeight: 1.7, fontWeight: 300 }}>
              {bullet}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Skill tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
        {job.skills.map((skill) => (
          <span
            key={skill}
            style={{
              fontSize: 11,
              color: job.color,
              border: `1px solid ${job.color}30`,
              backgroundColor: `${job.color}08`,
              padding: "3px 10px",
              borderRadius: 4,
              letterSpacing: 0.5,
              fontWeight: 400,
            }}
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
