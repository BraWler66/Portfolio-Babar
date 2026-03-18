import type { Metadata, Viewport } from "next";
import "./globals.css";
import ClientWrapper from "@/components/ClientWrapper";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#0b080c",
};

export const metadata: Metadata = {
  title: "Babar Ali — AI/ML Engineer",
  description: "AI/ML Engineer specializing in Computer Vision, Deep Learning, LLMs, and Autonomous Systems.",
  keywords: ["AI Engineer", "ML Engineer", "Computer Vision", "Deep Learning", "LLMs"],
  authors: [{ name: "Babar Ali" }],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning style={{ backgroundColor: "#0b080c", color: "#eae5ec" }}>
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
