"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import Header from "./header";
import Footer from "./footer";
import SocialIcons from "./SocialIcons";

const Cursor = dynamic(() => import("./Cursor"), { ssr: false });
const Loading = dynamic(() => import("./Loading"), { ssr: false });

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const orig = console.warn.bind(console);
    console.warn = (...args: unknown[]) => {
      if (typeof args[0] === "string" && args[0].includes("non-static position")) return;
      orig(...args);
    };
    return () => { console.warn = orig; };
  }, []);

  return (
    <>
      <Cursor />
      <AnimatePresence>
        {!loaded && <Loading onComplete={() => setLoaded(true)} />}
      </AnimatePresence>
      <AnimatePresence>
        {loaded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Header />
            <SocialIcons />
            <main>{children}</main>
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
