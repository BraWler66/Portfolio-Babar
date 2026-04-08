"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { label: "ABOUT", href: "#about" },
  { label: "WORK", href: "#experience" },
  { label: "CONTACT", href: "#contact" },
];

function scrollTo(href: string) {
  const el = document.getElementById(href.replace("#", ""));
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function HoverLink({ href, children, onClick }: { href: string; children: string; onClick?: () => void }) {
  return (
    <a
      href={href}
      onClick={(e) => { e.preventDefault(); scrollTo(href); onClick?.(); }}
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
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      setVisible(current < lastScroll || current < 100);
      setLastScroll(current);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: visible ? 0 : -80, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between"
        style={{
          padding: "12px 20px",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          background: "rgba(11,8,12,0.6)",
          color: "var(--text)",
        }}
      >
        {/* Logo */}
        <a href="#home" onClick={(e) => { e.preventDefault(); scrollTo("#home"); setMenuOpen(false); }} className="flex items-center gap-2 group" style={{ textDecoration: "none" }}>
          <div style={{ width: 32, height: 32, flexShrink: 0, transition: "filter 0.3s" }}>
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
          <div className="hidden sm:flex" style={{ flexDirection: "column", lineHeight: 1 }}>
            <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: 3, color: "var(--text)" }}>BABAR ALI</span>
            <span style={{ fontSize: 9, letterSpacing: 4, color: "var(--accent)", fontWeight: 400, marginTop: 2 }}>AI ENGINEER</span>
          </div>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <HoverLink key={item.href} href={item.href}>{item.label}</HoverLink>
          ))}
          <a
            href="/babar-ali-resume.pdf"
            download
            style={{
              fontSize: 11,
              letterSpacing: 2,
              fontWeight: 400,
              padding: "6px 16px",
              border: "1px solid var(--accent)",
              borderRadius: 50,
              color: "var(--accent)",
              textDecoration: "none",
              transition: "background 0.25s, color 0.25s",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "var(--accent)"; (e.currentTarget as HTMLAnchorElement).style.color = "#0b080c"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; (e.currentTarget as HTMLAnchorElement).style.color = "var(--accent)"; }}
          >
            RÉSUMÉ
          </a>
        </nav>

        {/* Mobile: hamburger */}
        <button
          className="md:hidden flex flex-col justify-center items-center gap-[5px]"
          onClick={() => setMenuOpen((o) => !o)}
          style={{ width: 36, height: 36, background: "none", border: "none", cursor: "pointer", padding: 0 }}
          aria-label="Toggle menu"
        >
          <motion.span
            animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 7 : 0 }}
            transition={{ duration: 0.25 }}
            style={{ display: "block", width: 22, height: 1.5, backgroundColor: "var(--text)", borderRadius: 2, transformOrigin: "center" }}
          />
          <motion.span
            animate={{ opacity: menuOpen ? 0 : 1, scaleX: menuOpen ? 0 : 1 }}
            transition={{ duration: 0.2 }}
            style={{ display: "block", width: 22, height: 1.5, backgroundColor: "var(--text)", borderRadius: 2 }}
          />
          <motion.span
            animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -7 : 0 }}
            transition={{ duration: 0.25 }}
            style={{ display: "block", width: 22, height: 1.5, backgroundColor: "var(--text)", borderRadius: 2, transformOrigin: "center" }}
          />
        </button>
      </motion.header>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.33, 0, 0, 1] }}
            className="md:hidden fixed inset-0 z-40 flex flex-col justify-center items-center gap-10"
            style={{ background: "rgba(11,8,12,0.97)", backdropFilter: "blur(20px)" }}
          >
            {navItems.map((item, i) => (
              <motion.a
                key={item.href}
                href={item.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + i * 0.07 }}
                onClick={(e) => { e.preventDefault(); scrollTo(item.href); setMenuOpen(false); }}
                style={{
                  fontSize: 32,
                  fontWeight: 300,
                  letterSpacing: 6,
                  color: "var(--text)",
                  textDecoration: "none",
                  textTransform: "uppercase",
                }}
              >
                {item.label}
              </motion.a>
            ))}

            {/* Resume download in menu */}
            <motion.a
              href="/babar-ali-resume.pdf"
              download
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + navItems.length * 0.07 }}
              onClick={() => setMenuOpen(false)}
              style={{
                marginTop: 8,
                fontSize: 13,
                letterSpacing: 4,
                fontWeight: 400,
                padding: "12px 32px",
                border: "1px solid var(--accent)",
                borderRadius: 50,
                color: "var(--accent)",
                textDecoration: "none",
                textTransform: "uppercase",
              }}
            >
              Download Résumé
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
