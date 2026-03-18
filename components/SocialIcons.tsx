"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, MessageCircle } from "lucide-react";

const socials = [
  { icon: Github,        href: "https://github.com/BraWler66",                label: "GitHub" },
  { icon: Linkedin,      href: "https://www.linkedin.com/in/babar1438",        label: "LinkedIn" },
  { icon: MessageCircle, href: "https://wa.link/2xw5zy",                       label: "WhatsApp" },
];

export default function SocialIcons() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.5, duration: 0.6 }}
      className="hidden md:flex"
      style={{
        position: "fixed",
        left: 24,
        bottom: 32,
        zIndex: 40,
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
      }}
    >
      {socials.map(({ icon: Icon, href, label }, i) => (
        <motion.a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          title={label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 + i * 0.1 }}
          style={{
            color: "var(--muted)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "1px solid var(--border)",
            background: "rgba(15,8,28,0.6)",
            backdropFilter: "blur(8px)",
            transition: "color 0.25s, border-color 0.25s, box-shadow 0.25s",
            textDecoration: "none",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.color = "var(--accent)";
            el.style.borderColor = "var(--accent)";
            el.style.boxShadow = "0 0 12px rgba(194,164,255,0.4)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.color = "var(--muted)";
            el.style.borderColor = "var(--border)";
            el.style.boxShadow = "none";
          }}
        >
          <Icon size={15} />
        </motion.a>
      ))}

      {/* Vertical line */}
      <div style={{ width: 1, height: 56, background: "linear-gradient(to bottom, var(--border), transparent)" }} />

      {/* Resume */}
      <a
        href="/babar-ali-resume.pdf"
        download
        title="Download Resume"
        style={{
          writingMode: "vertical-rl",
          transform: "rotate(180deg)",
          fontSize: 10,
          letterSpacing: 3,
          color: "var(--muted)",
          textTransform: "uppercase",
          transition: "color 0.25s",
          textDecoration: "none",
          fontWeight: 400,
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--accent)")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--muted)")}
      >
        Resume
      </a>
    </motion.div>
  );
}
