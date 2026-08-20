"use client";

import Image from "next/image";
import { motion } from "framer-motion";

/**
 * Hero portrait — replaces the old WebGL model.
 * Pure CSS + a single optimized image, so it renders instantly on
 * first paint (no canvas warm-up) and works identically on mobile.
 */
export default function HeroPortrait({ size = 420 }: { size?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.1, ease: [0.33, 0, 0, 1], delay: 0.2 }}
      className="hero-portrait"
      style={{ width: size, height: size }}
    >
      {/* Ambient bloom behind the portrait */}
      <div className="hp-bloom hp-bloom-a" aria-hidden="true" />
      <div className="hp-bloom hp-bloom-b" aria-hidden="true" />

      {/* Slow counter-rotating orbit rings */}
      <div className="hp-ring hp-ring-1" aria-hidden="true">
        <span className="hp-dot" />
      </div>
      <div className="hp-ring hp-ring-2" aria-hidden="true">
        <span className="hp-dot hp-dot-pink" />
      </div>

      {/* Portrait disc */}
      <div className="hp-disc">
        <Image
          src="/babar-circle.png"
          alt="Babar Ali — AI/ML Engineer"
          width={980}
          height={980}
          priority
          sizes="(max-width: 767px) 260px, 420px"
          className="hp-img"
        />
        {/* Inner rim + subtle top sheen */}
        <div className="hp-rim" aria-hidden="true" />
        <div className="hp-sheen" aria-hidden="true" />
      </div>
    </motion.div>
  );
}
