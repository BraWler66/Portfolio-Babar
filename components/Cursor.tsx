"use client";

import { useEffect, useRef, useState } from "react";

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Detect touch-primary devices (iPhones, iPads, Android)
    const touchDevice = window.matchMedia("(pointer: coarse)").matches;
    setIsTouch(touchDevice);
    if (touchDevice) return;

    const handleMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      current.current.x += (pos.current.x - current.current.x) * 0.12;
      current.current.y += (pos.current.y - current.current.y) * 0.12;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${current.current.x - 25}px, ${current.current.y - 25}px)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMove);
    rafRef.current = requestAnimationFrame(animate);

    const handleEnterLink = () => {
      if (cursorRef.current) {
        cursorRef.current.style.width = "70px";
        cursorRef.current.style.height = "70px";
        cursorRef.current.style.opacity = "0.6";
      }
    };
    const handleLeaveLink = () => {
      if (cursorRef.current) {
        cursorRef.current.style.width = "50px";
        cursorRef.current.style.height = "50px";
        cursorRef.current.style.opacity = "1";
      }
    };

    const links = document.querySelectorAll("a, button, [data-cursor]");
    links.forEach((el) => {
      el.addEventListener("mouseenter", handleEnterLink);
      el.addEventListener("mouseleave", handleLeaveLink);
    });

    return () => {
      window.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (isTouch) return null;

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 z-[9999] pointer-events-none"
      style={{
        width: 50,
        height: 50,
        borderRadius: "50%",
        backgroundColor: "#e6c3ff",
        mixBlendMode: "difference",
        transition: "width 0.3s ease, height 0.3s ease, opacity 0.3s ease",
        willChange: "transform",
      }}
    />
  );
}
