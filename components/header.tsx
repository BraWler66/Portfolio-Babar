"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const navItems = [
  { label: "ABOUT", href: "#about" },
  { label: "WORK", href: "#experience" },
  { label: "CONTACT", href: "#contact" },
];

function HoverLink({ href, children }: { href: string; children: string }) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <a
      href={href}
      onClick={handleClick}
      className="hover-link"
      style={{ fontSize: "clamp(10px, 1.5vw, 13px)", letterSpacing: 2, fontWeight: 400 }}
    >
      <span>{children}</span>
      <span>{children}</span>
    </a>
  );
}

export default function Header() {
  const [visible, setVisible] = useState(true);
  const [lastScroll, setLastScroll] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      setVisible(current < lastScroll || current < 100);
      setLastScroll(current);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll]);

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: visible ? 0 : -80, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 sm:px-6 sm:py-5 md:px-8 md:py-6"
      style={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", background: "rgba(11,8,12,0.6)", color: "var(--text)" }}
    >
      {/* Logo */}
      <a href="#home" className="flex items-center gap-2 sm:gap-3 group" style={{ textDecoration: "none" }}>
        {/* SVG hexagon mark */}
        <div
          style={{ width: 32, height: 32, flexShrink: 0, transition: "filter 0.3s" }}
          onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.filter = "drop-shadow(0 0 8px #a78bfa)"}
          onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.filter = "none"}
        >
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
            <polygon points="24,2 44,13 44,35 24,46 4,35 4,13" stroke="#c2a4ff" strokeWidth="1.5" fill="none" opacity="0.5"/>
            <polygon points="24,8 38,16 38,32 24,40 10,32 10,16" stroke="#c2a4ff" strokeWidth="0.8" fill="none" opacity="0.2"/>
            <line x1="24" y1="2" x2="24" y2="8" stroke="#c2a4ff" strokeWidth="0.8" opacity="0.6"/>
            <line x1="44" y1="13" x2="38" y2="16" stroke="#c2a4ff" strokeWidth="0.8" opacity="0.6"/>
            <line x1="44" y1="35" x2="38" y2="32" stroke="#c2a4ff" strokeWidth="0.8" opacity="0.6"/>
            <line x1="24" y1="46" x2="24" y2="40" stroke="#c2a4ff" strokeWidth="0.8" opacity="0.6"/>
            <line x1="4" y1="35" x2="10" y2="32" stroke="#c2a4ff" strokeWidth="0.8" opacity="0.6"/>
            <line x1="4" y1="13" x2="10" y2="16" stroke="#c2a4ff" strokeWidth="0.8" opacity="0.6"/>
            <text x="24" y="31" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="18" fill="#c2a4ff" textAnchor="middle">B</text>
            <circle cx="24" cy="2" r="1.8" fill="#fb8dff"/>
            <circle cx="44" cy="13" r="1.8" fill="#c2a4ff"/>
            <circle cx="44" cy="35" r="1.8" fill="#7f40ff"/>
            <circle cx="24" cy="46" r="1.8" fill="#fb8dff"/>
            <circle cx="4" cy="35" r="1.8" fill="#c2a4ff"/>
            <circle cx="4" cy="13" r="1.8" fill="#7f40ff"/>
          </svg>
        </div>
        {/* Wordmark — hidden on mobile */}
        <div className="hidden sm:flex" style={{ flexDirection: "column", lineHeight: 1 }}>
          <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: 3, color: "var(--text)" }}>BABAR ALI</span>
          <span style={{ fontSize: 9, letterSpacing: 4, color: "var(--accent)", fontWeight: 400, marginTop: 2 }}>AI ENGINEER</span>
        </div>
      </a>

      {/* Center email — hidden on mobile and small tablets, shown md+ */}
      <a
        href="mailto:babar.ali63101@gmail.com"
        className="hidden md:block hover-link"
        style={{ fontSize: 12, letterSpacing: 1, color: "var(--muted)" }}
      >
        <span>babar.ali63101@gmail.com</span>
        <span>babar.ali63101@gmail.com</span>
      </a>

      {/* Nav links */}
      <nav className="flex items-center gap-4 sm:gap-6 md:gap-8">
        {navItems.map((item) => (
          <HoverLink key={item.href} href={item.href}>
            {item.label}
          </HoverLink>
        ))}
      </nav>
    </motion.header>
  );
}
