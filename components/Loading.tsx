"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  onComplete: () => void;
}

export default function Loading({ onComplete }: Props) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [expanding, setExpanding] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const touch = window.matchMedia("(pointer: coarse)").matches;
    setIsMobile(touch);
    if (touch) {
      // On mobile: dismiss immediately — no waiting for assets
      onComplete();
      return;
    }
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + Math.random() * 8;
      });
    }, 80);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      setTimeout(() => setDone(true), 400);
    }
  }, [progress]);

  const handleClick = () => {
    setExpanding(true);
    setTimeout(onComplete, 800);
  };

  // On mobile: onComplete() fires immediately in useEffect, render nothing
  if (isMobile === null || isMobile) return null;

  return (
    <AnimatePresence>
      {!expanding && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9998] flex flex-col items-center justify-center overflow-hidden"
          style={{ backgroundColor: "#eae5ec" }}
        >
          {/* Marquee */}
          <div className="absolute top-0 left-0 right-0 py-3 overflow-hidden border-b border-black/10">
            <div className="marquee-track" style={{ color: "#0b080c", fontSize: 13, letterSpacing: 2 }}>
              {Array(8).fill("A CREATIVE AI ENGINEER  ·  ").map((t, i) => (
                <span key={i} className="mr-8">{t}</span>
              ))}
            </div>
          </div>

          {/* Progress */}
          <div className="text-center mb-12" style={{ color: "#0b080c" }}>
            <div style={{ fontSize: 80, fontWeight: 200, letterSpacing: -2, lineHeight: 1 }}>
              {Math.min(Math.floor(progress), 100)}
            </div>
            <div style={{ fontSize: 13, letterSpacing: 3, opacity: 0.5, marginTop: 8 }}>LOADING</div>
          </div>

          {/* Progress bar */}
          <div
            className="relative overflow-hidden"
            style={{ width: 200, height: 1, backgroundColor: "rgba(0,0,0,0.15)" }}
          >
            <motion.div
              style={{ height: "100%", backgroundColor: "#0b080c", originX: 0 }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: Math.min(progress, 100) / 100 }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Enter button */}
          <AnimatePresence>
            {done && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                onClick={handleClick}
                className="mt-16 px-10 py-4 rounded-full font-medium tracking-widest uppercase text-sm transition-all duration-300"
                style={{
                  backgroundColor: "#0b080c",
                  color: "#eae5ec",
                  letterSpacing: 3,
                  fontSize: 12,
                  border: "1px solid #0b080c",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color = "#0b080c";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#0b080c";
                  (e.currentTarget as HTMLButtonElement).style.color = "#eae5ec";
                }}
              >
                Enter
              </motion.button>
            )}
          </AnimatePresence>

          {/* Bottom marquee */}
          <div className="absolute bottom-0 left-0 right-0 py-3 overflow-hidden border-t border-black/10">
            <div className="marquee-track" style={{ color: "#0b080c", fontSize: 13, letterSpacing: 2, animationDirection: "reverse" }}>
              {Array(8).fill("BABAR ALI  ·  AI / ML ENGINEER  ·  ").map((t, i) => (
                <span key={i} className="mr-8">{t}</span>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
