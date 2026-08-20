"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import HeroPortrait from "./HeroPortrait";

const roles = ["AI Engineer", "ML Researcher", "Computer Vision Expert", "LLM Developer"];

export default function HeroSection() {
  const [isMobile, setIsMobile] = useState(true);
  const [roleIndex, setRoleIndex] = useState(0);
  const [display, setDisplay] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setIsMobile(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  useEffect(() => {
    const role = roles[roleIndex];
    let t: NodeJS.Timeout;
    if (!deleting && display.length < role.length) {
      t = setTimeout(() => setDisplay(role.slice(0, display.length + 1)), 70);
    } else if (!deleting && display.length === role.length) {
      t = setTimeout(() => setDeleting(true), 2200);
    } else if (deleting && display.length > 0) {
      t = setTimeout(() => setDisplay(display.slice(0, -1)), 35);
    } else {
      setDeleting(false);
      setRoleIndex((i) => (i + 1) % roles.length);
    }
    return () => clearTimeout(t);
  }, [display, deleting, roleIndex]);

  const charVariants = {
    hidden: { opacity: 0, y: 80, filter: "blur(5px)" },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { delay: i * 0.025, duration: 1.2, ease: [0.33, 0, 0, 1] as const },
    }),
  };

  const name = "BABAR ALI".split("");

  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden grid grid-cols-1 md:grid-cols-2"
      style={{ alignItems: "center" }}
    >
      {/* ── Mobile-only CSS background (no JS/canvas) ── */}
      {isMobile && (
        <div className="mobile-bg-layer" aria-hidden="true">
          <div className="mob-orb mob-orb-1" />
          <div className="mob-orb mob-orb-2" />
          <div className="mob-orb mob-orb-3" />
          {/* grid lines */}
          <div className="mob-grid" />
        </div>
      )}
      {/* ── LEFT: Text content ─────────────────────────────────────── */}
      <div
        className="relative flex flex-col justify-center z-10"
        style={{ padding: "clamp(80px, 12vh, 120px) clamp(20px, 5vw, 40px) clamp(40px, 6vh, 80px) clamp(24px, 8vw, 130px)" }}
      >

        {/* Portrait — mobile only (desktop version lives in the right column) */}
        <div className="hero-portrait-mobile">
          <HeroPortrait size={200} />
        </div>

        {/* Hello label */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          style={{ fontSize: 13, color: "var(--accent)", letterSpacing: "0.3em", marginBottom: 16, fontWeight: 400, textTransform: "uppercase" }}
        >
          Hello! I&apos;m
        </motion.p>

        {/* Name */}
        <h1
          style={{
            fontSize: "clamp(38px, 7vw, 100px)",
            fontWeight: 500,
            letterSpacing: 2,
            lineHeight: 1,
            marginBottom: 16,
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          {name.map((char, i) => (
            <motion.span
              key={i}
              custom={i}
              variants={charVariants}
              initial="hidden"
              animate="visible"
              style={{ display: "inline-block", whiteSpace: "pre" }}
            >
              {char}
            </motion.span>
          ))}
        </h1>

        {/* Role typewriter */}
        <div
          style={{
            fontSize: "clamp(16px, 3vw, 40px)",
            fontWeight: 300,
            color: "var(--muted)",
            marginBottom: 32,
            minHeight: "1.2em",
          }}
        >
          <span style={{ color: "var(--accent)" }}>{display}</span>
          <span style={{ animation: "blink 1s step-end infinite", color: "var(--accent)" }}>|</span>
        </div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          style={{ fontSize: "clamp(14px, 1.4vw, 16px)", color: "var(--muted)", maxWidth: "min(420px, 90vw)", lineHeight: 1.9, fontWeight: 300, marginBottom: 48 }}
        >
          AI/ML Engineer specializing in agentic pipelines, LLM fine-tuning (LoRA/QLoRA),
          and multimodal systems — from multi-agent orchestration to real-time inference in production.
        </motion.p>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="flex items-center gap-3"
          style={{ color: "var(--muted)", fontSize: 11, letterSpacing: "0.28em", textTransform: "uppercase" }}
        >
          <div style={{ width: 40, height: 1, backgroundColor: "var(--border)" }} />
          SCROLL
          <div
            style={{
              width: 6, height: 6, borderRadius: "50%",
              backgroundColor: "var(--accent)",
              animation: "pulseGlow 2s ease-in-out infinite",
            }}
          />
        </motion.div>
      </div>

      {/* ── RIGHT: Portrait ──────────────────────────────────────── */}
      <div
        className="relative hero-portrait-desktop items-center justify-center"
        style={{ height: "100vh" }}
      >
        {/* Left edge fade so the portrait blends into the text side */}
        <div
          className="absolute inset-y-0 left-0 w-32 pointer-events-none"
          style={{
            background: "linear-gradient(to right, #0b080c, transparent)",
            zIndex: 3,
          }}
        />

        <HeroPortrait size={430} />
      </div>

    </section>
  );
}
