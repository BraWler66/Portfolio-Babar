"use client";

export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--border)", padding: "clamp(24px,5vw,40px) 0" }}>
      <div
        className="max-w-[1300px] mx-auto flex flex-col items-center gap-2 text-center sm:flex-row sm:justify-between sm:text-left sm:gap-4"
        style={{ padding: "0 clamp(16px,5vw,32px)" }}
      >
        <p style={{ fontSize: 12, color: "var(--muted)", letterSpacing: 2 }}>
          © {new Date().getFullYear()} Babar Ali
        </p>
        <p style={{ fontSize: 12, color: "var(--muted)", letterSpacing: 1 }}>
          Designed &amp; Developed by Babar Ali
        </p>
        <p style={{ fontSize: 12, color: "var(--muted)", letterSpacing: 2 }}>
          AI / ML ENGINEER
        </p>
      </div>
    </footer>
  );
}
