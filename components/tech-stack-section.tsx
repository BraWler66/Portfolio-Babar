"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Particles from "./Particles-BG"

type TechCategory =
  | "ml_dl_cv"
  | "data_manipulation"
  | "visualization"
  | "llm"
  | "rag"
  | "automation"
  | "frontend"

type TechItem = {
  name: string
  level: "exploring" | "familiar" | "proficient" | "expert"
  category: TechCategory
}

const techStack: TechItem[] = [
  // Data Manipulation
  { name: "Pandas", level: "expert", category: "data_manipulation" },
  { name: "NumPy", level: "expert", category: "data_manipulation" },
  { name: "Excel", level: "expert", category: "data_manipulation" },

  // ML/DL/CV
  { name: "Scikit-learn", level: "expert", category: "ml_dl_cv" },
  { name: "XGBoost", level: "proficient", category: "ml_dl_cv" },
  { name: "CatBoost", level: "familiar", category: "ml_dl_cv" },
  { name: "Feature Engineering", level: "expert", category: "ml_dl_cv" },
  { name: "TensorFlow", level: "proficient", category: "ml_dl_cv" },
  { name: "PyTorch", level: "expert", category: "ml_dl_cv" },
  { name: "Keras", level: "proficient", category: "ml_dl_cv" },
  { name: "Neural Networks", level: "expert", category: "ml_dl_cv" },
  { name: "Transformers", level: "proficient", category: "ml_dl_cv" },
  { name: "OpenCV", level: "proficient", category: "ml_dl_cv" },
  { name: "YOLO", level: "proficient", category: "ml_dl_cv" },
  { name: "Image Augmentation", level: "proficient", category: "ml_dl_cv" },
  { name: "CNN Architectures", level: "proficient", category: "ml_dl_cv" },

  // Visualization
  { name: "Matplotlib", level: "expert", category: "visualization" },
  { name: "Seaborn", level: "expert", category: "visualization" },
  { name: "Pandas Profiling", level: "proficient", category: "visualization" },
  { name: "TensorBoard", level: "proficient", category: "visualization" },
  { name: "Tableau", level: "proficient", category: "visualization" },
  { name: "Power BI", level: "familiar", category: "visualization" },

  // LLM
  { name: "Hugging Face", level: "proficient", category: "llm" },
  { name: "LangChain", level: "proficient", category: "llm" },
  { name: "LLAMA Index", level: "familiar", category: "llm" },
  { name: "Transformer Models", level: "proficient", category: "llm" },
  { name: "Prompt Engineering", level: "expert", category: "llm" },
  { name: "Fine-tuning", level: "proficient", category: "llm" },

  // RAG
  { name: "Vector Databases", level: "proficient", category: "rag" },
  { name: "FAISS", level: "familiar", category: "rag" },
  { name: "ChromaDB", level: "familiar", category: "rag" },
  { name: "Embedding Models", level: "proficient", category: "rag" },

  // Automation
  { name: "AirTable", level: "proficient", category: "automation" },
  { name: "Make.com", level: "familiar", category: "automation" },
  { name: "N8N", level: "expert", category: "automation" },

  // Frontend
  { name: "StreamLit", level: "expert", category: "frontend" },
  { name: "Tkinter", level: "expert", category: "frontend" },
  { name: "Flask", level: "familiar", category: "frontend" },
]

export default function TechStackSection() {
  const [activeTab, setActiveTab] = useState<TechCategory>("ml_dl_cv")

  const filterTechByCategory = (category: TechCategory) => {
    return techStack.filter((tech) => tech.category === category)
  }

  const levelOrder = {
    expert: 4,
    proficient: 3,
    familiar: 2,
    exploring: 1,
  }

  const sortByLevel = (a: TechItem, b: TechItem) =>
    levelOrder[b.level] - levelOrder[a.level]

  const getLevelColor = (level: string) => {
    switch (level) {
      case "expert":
        return "hsl(var(--chart-1))"
      case "proficient":
        return "hsl(var(--chart-2))"
      case "familiar":
        return "hsl(var(--chart-3))"
      default:
        return "hsl(var(--chart-4))"
    }
  }

  return (
    <section id="tech-stack" className="py-20 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Particles
          particleColors={["#ffffff", "#ffffff"]}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>

      <div className="container flex justify-center max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-4">
            <span className="font-mono text-primary">#</span> Tech Stack
          </h2>
          <p className="text-muted-foreground max-w-2xl mb-10">
            My evolving skillset across data science, machine learning, automation,
            LLMs, and more.
          </p>

          <div className="flex justify-center lg:flex-row">
            <div className="lg:w-1/1 flex items-center">
              <Tabs
                defaultValue="ml_dl_cv"
                value={activeTab}
                onValueChange={(value) => setActiveTab(value as TechCategory)}
              >
                {/* ✅ Responsive scrollable TabsList */}
                <TabsList
                  className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3 text-sm overflow-x-auto px-2 sm:px-0 mb-6"
                  style={{ WebkitOverflowScrolling: "touch" }}
                >
                  <TabsTrigger value="ml_dl_cv">ML/DL</TabsTrigger>
                  <TabsTrigger value="data_manipulation">Data</TabsTrigger>
                  <TabsTrigger value="visualization">Viz</TabsTrigger>
                  <TabsTrigger value="llm">LLM</TabsTrigger>
                  <TabsTrigger value="rag">RAG</TabsTrigger>
                  <TabsTrigger value="automation">Automation</TabsTrigger>
                  <TabsTrigger value="frontend">Frontend</TabsTrigger>
                </TabsList>

                {(
                  [
                    "ml_dl_cv",
                    "data_manipulation",
                    "visualization",
                    "llm",
                    "rag",
                    "automation",
                    "frontend",
                  ] as TechCategory[]
                ).map((category) => (
                  <TabsContent key={category} value={category} className="mt-0">
                    <div className="bg-accent/30 rounded-lg p-4 sm:p-6">
                      {/* ✅ Responsive Grid for mobile */}
                      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {filterTechByCategory(category)
                          .sort(sortByLevel)
                          .map((tech) => (
                            <div
                              key={tech.name}
                              className="bg-card border border-border/50 rounded-md p-4 relative overflow-hidden"
                            >
                              <div
                                className="absolute bottom-0 left-0 h-1"
                                style={{
                                  width:
                                    tech.level === "expert"
                                      ? "100%"
                                      : tech.level === "proficient"
                                      ? "75%"
                                      : tech.level === "familiar"
                                      ? "50%"
                                      : "25%",
                                  background: getLevelColor(tech.level),
                                }}
                              />
                              <h3 className="font-medium mb-1">{tech.name}</h3>
                              <p className="text-xs text-muted-foreground capitalize">
                                {tech.level}
                              </p>
                            </div>
                          ))}
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
