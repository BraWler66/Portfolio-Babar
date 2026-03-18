"use client";

import { motion } from "framer-motion";

const categories = [
  {
    title: "ML / DL / CV",
    items: ["PyTorch", "TensorFlow", "Scikit-learn", "YOLOv8", "OpenCV", "Keras", "ResNet", "U-Net", "Transfer Learning"],
  },
  {
    title: "LLM & RAG",
    items: ["HuggingFace", "LangChain", "Prompt Engineering", "Fine-tuning", "FAISS", "ChromaDB", "RAG Pipelines"],
  },
  {
    title: "Data",
    items: ["Pandas", "NumPy", "Matplotlib", "Seaborn", "Tableau", "Power BI", "Excel"],
  },
  {
    title: "Tools",
    items: ["Python", "Git", "Streamlit", "Gradio", "Flask", "Docker", "Jupyter", "VS Code"],
  },
];

export default function TechStackSection() {
  return (
    <section id="tech-stack" className="py-32" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="max-w-[1300px] mx-auto px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-16 flex-wrap gap-6">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ fontSize: 12, letterSpacing: 4, color: "var(--muted)", textTransform: "uppercase" }}
          >
            Technical Skills
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ fontSize: "clamp(28px, 5vw, 60px)", fontWeight: 400, letterSpacing: 2 }}
          >
            Tech Stack
          </motion.h2>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px" style={{ borderTop: "1px solid var(--border)", borderLeft: "1px solid var(--border)" }}>
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="group"
              style={{
                borderRight: "1px solid var(--border)",
                borderBottom: "1px solid var(--border)",
                padding: "32px 28px",
                transition: "background 0.3s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = "rgba(194,164,255,0.03)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = "transparent";
              }}
            >
              <h3
                style={{
                  fontSize: 11,
                  letterSpacing: 4,
                  color: "var(--accent)",
                  textTransform: "uppercase",
                  marginBottom: 20,
                  fontWeight: 500,
                }}
              >
                {cat.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {cat.items.map((item) => (
                  <motion.span
                    key={item}
                    whileHover={{ scale: 1.05 }}
                    className="tag"
                    style={{ fontSize: 12 }}
                  >
                    {item}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
