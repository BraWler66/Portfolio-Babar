"use client";

import { useState } from "react";
import "./styles/WhatIDo.css";
import dynamic from "next/dynamic";

const Developer3D = dynamic(() => import("./Developer3D"), { ssr: false });

export default function WhatIDo() {
  const [active, setActive] = useState<number | null>(null);

  const toggle = (i: number) => setActive(prev => prev === i ? null : i);

  const cardClass = (i: number) => {
    if (active === i) return "what-content what-content-active";
    if (active !== null) return "what-content what-sibling";
    return "what-content";
  };

  return (
    <section id="what" style={{ borderTop: "1px solid var(--border)", position: "relative" }}>
      {/* 3D character — absolute on desktop */}
      <div className="what-3d-bg what-3d-desktop" style={{
        position: "absolute", left: 0, top: 0, width: "50%", height: "100%",
        zIndex: 0, pointerEvents: "none",
      }}>
        <Developer3D />
        <div style={{
          position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none",
          background: "linear-gradient(to right, transparent 70%, var(--bg))",
        }} />
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 120,
          zIndex: 3, pointerEvents: "none",
          background: "linear-gradient(to top, var(--bg), transparent)",
        }} />
      </div>

      <div className="whatIDO">
        {/* LEFT — desktop: spacer. Mobile: 3D inline */}
        <div className="what-box what-box-left">
          <div className="what-3d-mobile">
            <Developer3D />
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0, height: 80,
              zIndex: 3, pointerEvents: "none",
              background: "linear-gradient(to top, var(--bg), transparent)",
            }} />
          </div>
        </div>

        {/* RIGHT — Cards */}
        <div className="what-box">
          <div className="what-box-in">
            <div className="what-border2">
              <svg width="100%">
                <line x1="0" y1="0" x2="0" y2="100%" stroke="white" strokeWidth="2" strokeDasharray="7,7" />
                <line x1="100%" y1="0" x2="100%" y2="100%" stroke="white" strokeWidth="2" strokeDasharray="7,7" />
              </svg>
            </div>

            {/* Card 1 — DEVELOP */}
            <div className={cardClass(0)} onClick={() => toggle(0)} style={{ cursor: "pointer" }}>
              <div className="what-border1">
                <svg height="100%">
                  <line x1="0" y1="0" x2="100%" y2="0" stroke="white" strokeWidth="2" strokeDasharray="6,6" />
                  <line x1="0" y1="100%" x2="100%" y2="100%" stroke="white" strokeWidth="2" strokeDasharray="6,6" />
                </svg>
              </div>
              <div className="what-corner" />
              <div className="what-content-in">
                <h3>DEVELOP</h3>
                <h4>AI / ML Engineering</h4>
                <p>
                  I engineer production-ready AI/ML systems — from training deep learning models
                  to deploying intelligent pipelines. Computer Vision, NLP, or RL — I build end-to-end.
                </p>
                <h5>Skillset &amp; tools</h5>
                <div className="what-content-flex">
                  <div className="what-tags">PyTorch</div>
                  <div className="what-tags">TensorFlow</div>
                  <div className="what-tags">YOLOv8</div>
                  <div className="what-tags">OpenCV</div>
                  <div className="what-tags">LangChain</div>
                  <div className="what-tags">HuggingFace</div>
                  <div className="what-tags">Python</div>
                  <div className="what-tags">FastAPI</div>
                </div>
                <div className="what-arrow" />
              </div>
            </div>

            {/* Card 2 — RESEARCH */}
            <div className={cardClass(1)} onClick={() => toggle(1)} style={{ cursor: "pointer" }}>
              <div className="what-border1">
                <svg height="100%">
                  <line x1="0" y1="100%" x2="100%" y2="100%" stroke="white" strokeWidth="2" strokeDasharray="6,6" />
                </svg>
              </div>
              <div className="what-corner" />
              <div className="what-content-in">
                <h3>RESEARCH</h3>
                <h4>Frontier AI</h4>
                <p>
                  I bridge the gap between research and production. SOTA architectures,
                  fine-tuned LLMs, RAG pipelines — I stay at the frontier and ship it.
                </p>
                <h5>Skillset &amp; tools</h5>
                <div className="what-content-flex">
                  <div className="what-tags">Computer Vision</div>
                  <div className="what-tags">Reinforcement Learning</div>
                  <div className="what-tags">NLP</div>
                  <div className="what-tags">Medical Imaging</div>
                  <div className="what-tags">RAG</div>
                  <div className="what-tags">Fine-tuning</div>
                </div>
                <div className="what-arrow" />
              </div>
            </div>

            {/* Card 3 — DEPLOY */}
            <div className={cardClass(2)} onClick={() => toggle(2)} style={{ cursor: "pointer" }}>
              <div className="what-border1">
                <svg height="100%">
                  <line x1="0" y1="100%" x2="100%" y2="100%" stroke="white" strokeWidth="2" strokeDasharray="6,6" />
                </svg>
              </div>
              <div className="what-corner" />
              <div className="what-content-in">
                <h3>DEPLOY</h3>
                <h4>MLOps &amp; Serving</h4>
                <p>
                  From model training to production inference — I containerize, serve, and monitor
                  AI systems. FastAPI, Docker, cloud deployments, and MLOps workflows.
                </p>
                <h5>Skillset &amp; tools</h5>
                <div className="what-content-flex">
                  <div className="what-tags">FastAPI</div>
                  <div className="what-tags">Docker</div>
                  <div className="what-tags">Gradio</div>
                  <div className="what-tags">Streamlit</div>
                  <div className="what-tags">REST APIs</div>
                  <div className="what-tags">MLOps</div>
                  <div className="what-tags">CARLA</div>
                </div>
                <div className="what-arrow" />
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
