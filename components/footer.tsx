"use client";

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        padding: "40px 0",
      }}
    >
      <div
        className="max-w-[1300px] mx-auto px-8 flex items-center justify-between flex-wrap gap-4"
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
