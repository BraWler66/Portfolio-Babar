"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Code2, Users, Rocket } from "lucide-react"

export default function AboutSection() {
  return (
    <section id="about" className="py-20 md:py-32 relative">
      <div className="container max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-6">
            <span className="font-mono text-primary">#</span> About Me
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            <div className="md:col-span-7">
              <p className="text-lg mb-8 text-muted-foreground leading-relaxed">
                I'm an AI enthusiast with a passion for building intelligent systems. I love creating machine learning models, analyzing complex datasets, and solving real-world problems through data-driven solutions. Currently exploring the intersection of AI, data science, and product development.


              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
                {/* 1 */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-accent/30 rounded-xl p-6 border border-border/50"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <ArrowRight className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold">Education</h3>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Bachelors in Artificial Intelligence from Bahria University Pakistan.
                  </p>
                </motion.div>
                {/* 2 */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-accent/30 rounded-xl p-6 border border-border/50"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <ArrowRight className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold">Programming Language</h3>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Proficient in Python for AI, machine learning, and data analysis, with expertise in libraries like TensorFlow, PyTorch, and Pandas.
                  </p>
                </motion.div>
                {/* 3 */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-accent/30 rounded-xl p-6 border border-border/50"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <ArrowRight className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold">Current Focus</h3>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Exploring AI technologies and contributing to open-source projects in the AI and machine learning space.
                  </p>
                </motion.div>
                {/* 4 */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-accent/30 rounded-xl p-6 border border-border/50"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <ArrowRight className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold">Open to Opportunities</h3>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Eager to collaborate on AI/ML projects, open-source contributions, or research roles where I can leverage my Python and machine learning expertise.
                  </p>
                </motion.div>

                {/* <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-accent/30 rounded-xl p-6 border border-border/50"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <ArrowRight className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold">Current Focus</h3>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Exploring AI + Blockchain integration and contributing to open-source projects in the Web3 space.
                  </p>
                </motion.div> */}
              </div>
            </div>

            <div className="md:col-span-5">
              <div className="bg-accent/50 rounded-xl p-6 space-y-6 border border-border/50">
                <div>
                  <h4 className="font-mono text-sm text-muted-foreground mb-3">
                    $ background
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 group hover:bg-accent/30 p-3 rounded-lg transition-all duration-300">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <span className="text-primary text-sm">→</span>
                      </div>
                      <div>
                        <p className="font-medium">Machine Learning</p>
                        <p className="text-sm text-muted-foreground">2+ years experience (academic)</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 group hover:bg-accent/30 p-3 rounded-lg transition-all duration-300">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <span className="text-primary text-sm">→</span>
                      </div>
                      <div>
                        <p className="font-medium">Data Analysist</p>
                        <p className="text-sm text-muted-foreground">1+ years experience (academic)</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-mono text-sm text-muted-foreground mb-3">
                    $ achievements
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 group hover:bg-accent/30 p-3 rounded-lg transition-all duration-300">
                       <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <span className="text-primary text-sm p-2">→</span>
                      </div>
                      <div>
                        <p className="font-medium mx-2">Developed Medical Imaging Models with YOLOv8</p>
                        <p className="text-sm text-muted-foreground"></p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 group hover:bg-accent/30 p-3 rounded-lg transition-all duration-300">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <span className="text-primary text-sm p-2">→</span>
                      </div>
                      <div>
                        <p className="font-medium mx-2">Created Autonomous Driving Agent in CARLA</p>
                        <p className="text-sm text-muted-foreground"></p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 group hover:bg-accent/30 p-3 rounded-lg transition-all duration-300">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <span className="text-primary text-sm p-2">→</span>
                      </div>
                      <div>
                        <p className="font-medium mx-2">Designed NLP Pipeline for Event Extraction</p>
                        <p className="text-sm text-muted-foreground"></p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-mono text-sm text-muted-foreground mb-3">
                    $ interests
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="hover:bg-primary/10 transition-colors">Ai Models</Badge>
                    <Badge variant="outline" className="hover:bg-primary/10 transition-colors">Machine Learning</Badge>
                    <Badge variant="outline" className="hover:bg-primary/10 transition-colors">Automation</Badge>
                    <Badge variant="outline" className="hover:bg-primary/10 transition-colors">Open Source</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}