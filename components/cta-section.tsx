"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, MessageCircle } from "lucide-react";

export default function CTASection() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("https://formspree.io/f/mvgreeod", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setStatus(res.ok ? "success" : "error");
      if (res.ok) {
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => setStatus("idle"), 5000);
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="py-32" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="max-w-[1300px] mx-auto px-8">
        {/* Big CTA headline */}
        <div className="mb-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ fontSize: 12, letterSpacing: 4, color: "var(--muted)", textTransform: "uppercase", marginBottom: 20 }}
          >
            Get In Touch
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            style={{
              fontSize: "clamp(40px, 8vw, 100px)",
              fontWeight: 300,
              letterSpacing: -1,
              lineHeight: 1,
              color: "var(--text)",
            }}
          >
            Let&apos;s Build
            <br />
            <span className="gradient-text">Something Great</span>
          </motion.h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-20">
          {/* Left: contact info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-10"
          >
            <div>
              <p style={{ fontSize: 11, letterSpacing: 4, color: "var(--muted)", textTransform: "uppercase", marginBottom: 12 }}>Email</p>
              <a
                href="mailto:babar.ali63101@gmail.com"
                className="hover-link"
                style={{ fontSize: "clamp(16px, 2vw, 22px)", fontWeight: 300 }}
              >
                <span>babar.ali63101@gmail.com</span>
                <span>babar.ali63101@gmail.com</span>
              </a>
            </div>

            <div>
              <p style={{ fontSize: 11, letterSpacing: 4, color: "var(--muted)", textTransform: "uppercase", marginBottom: 16 }}>Socials</p>
              <div className="flex gap-6">
                {[
                  { icon: Github, href: "https://github.com/BraWler66", label: "GitHub" },
                  { icon: Linkedin, href: "https://www.linkedin.com/in/babar1438", label: "LinkedIn" },
                  { icon: MessageCircle, href: "https://wa.link/2xw5zy", label: "WhatsApp" },
                ].map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover-link"
                    style={{ fontSize: 13, letterSpacing: 2 }}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: 8 }}><Icon size={16} />{label}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 8 }}><Icon size={16} />{label}</span>
                  </a>
                ))}
              </div>
            </div>

            <div style={{ paddingTop: 20 }}>
              <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.8, fontWeight: 300, maxWidth: 380 }}>
                Open for AI/ML roles, freelance projects, and research collaborations. Whether you have a project in mind or just want to connect — my inbox is always open.
              </p>
            </div>
          </motion.div>

          {/* Right: form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {[
              { name: "name", label: "Name", type: "text", placeholder: "Your name" },
              { name: "email", label: "Email", type: "email", placeholder: "your@email.com" },
            ].map((field) => (
              <div key={field.name}>
                <label style={{ fontSize: 11, letterSpacing: 3, color: "var(--muted)", textTransform: "uppercase", display: "block", marginBottom: 8 }}>
                  {field.label}
                </label>
                <input
                  type={field.type}
                  required
                  value={(formData as Record<string, string>)[field.name]}
                  onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                  placeholder={field.placeholder}
                  style={{
                    width: "100%",
                    background: "transparent",
                    border: "none",
                    borderBottom: "1px solid var(--border)",
                    color: "var(--text)",
                    fontSize: 16,
                    fontFamily: "inherit",
                    padding: "12px 0",
                    outline: "none",
                    fontWeight: 300,
                    transition: "border-color 0.3s",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderBottomColor = "var(--accent)")}
                  onBlur={(e) => (e.currentTarget.style.borderBottomColor = "var(--border)")}
                />
              </div>
            ))}

            <div>
              <label style={{ fontSize: 11, letterSpacing: 3, color: "var(--muted)", textTransform: "uppercase", display: "block", marginBottom: 8 }}>
                Message
              </label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell me about your project..."
                style={{
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  borderBottom: "1px solid var(--border)",
                  color: "var(--text)",
                  fontSize: 16,
                  fontFamily: "inherit",
                  padding: "12px 0",
                  outline: "none",
                  fontWeight: 300,
                  resize: "none",
                  transition: "border-color 0.3s",
                }}
                onFocus={(e) => (e.currentTarget.style.borderBottomColor = "var(--accent)")}
                onBlur={(e) => (e.currentTarget.style.borderBottomColor = "var(--border)")}
              />
            </div>

            <button
              type="submit"
              disabled={status === "loading" || status === "success"}
              style={{
                background: "transparent",
                border: "1px solid var(--border)",
                color: "var(--text)",
                padding: "14px 40px",
                borderRadius: 50,
                fontSize: 12,
                letterSpacing: 3,
                textTransform: "uppercase",
                fontFamily: "inherit",
                transition: "all 0.3s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--accent)";
                (e.currentTarget as HTMLButtonElement).style.color = "var(--accent)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
                (e.currentTarget as HTMLButtonElement).style.color = "var(--text)";
              }}
            >
              {status === "loading" ? "Sending..." : status === "success" ? "Sent ✓" : "Send Message"}
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
