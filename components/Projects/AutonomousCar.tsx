"use client"
import React from 'react'
import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRightIcon, ExternalLinkIcon, GithubIcon } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { projects } from "@/data/projects"
import { ArrowRight } from "lucide-react"

const AutonomousCar = () => {
  const skills = [
    "Reinforcement Learning",
    "CARLA Simulator",
    "Deep Q-Network (DQN)",
    "Computer Vision",
    "Python",
    "OpenAI Gym",
    "TensorBoard",
    "Real-Time Simulation"
  ]
  
  return (
    <div className="py-10">
      <div className="flex flex-col lg:flex-row gap-8 ">
        {/* Left side - Project details */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-accent/30 rounded-xl p-6 border border-border/50 lg:w-1/2 backdrop-blur transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(0,0,0,0.1)]"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <ArrowRight className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">🚗 Autonomous-Driving-using-Reinforcement-Learning</h3>
          </div>
          <p className="text-muted-foreground text-sm mb-6">
            Built a self-driving car in CARLA using Deep Q-Learning. The agent learns to drive safely by interacting with its environment. Used custom rewards and visualized training performance with TensorBoard.
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            {skills.map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className={cn(
                  "px-3 py-1 text-xs font-medium rounded-full transition-all duration-300 hover:scale-105",
                  skill === "Ai" && "bg-chart-1/20 text-chart-1 hover:bg-chart-1/30",
                  skill === "Frontend" && "bg-chart-1/20 text-chart-1 hover:bg-chart-1/30",
                  skill === "Machine Learning" && "bg-chart-2/20 text-chart-2 hover:bg-chart-2/30",
                  skill === "Viz" && "bg-chart-2/20 text-chart-2 hover:bg-chart-2/30",
                  skill === "Data Analysist" && "bg-chart-3/20 text-chart-3 hover:bg-chart-3/30",
                  skill === "LLM" && "bg-chart-4/20 text-chart-4 hover:bg-chart-4/30",
                  skill === "Automation" && "bg-chart-4/20 text-chart-4 hover:bg-chart-4/30",
                )}
              >
                {skill}
              </Badge>
            ))}
          </div>

          <CardFooter className="flex gap-3 p-0">
            <Link href="https://github.com/BraWler66/Autonomous-Driving-using-Reinforcement-Learning" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="sm" className="gap-1">
                <GithubIcon className="h-4 w-4" />
                <span>Github</span>
              </Button>
            </Link>
            
          </CardFooter>
        </motion.div>

        {/* Right side - GIF */}
        <div className="lg:w-1/2 flex items-center justify-center">
          <div className="rounded-xl overflow-hidden border border-border/50 backdrop-blur transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(0,0,0,0.1)] hover:scale-[1.02]">
            <img 
              src="car2.gif" 
              alt="Autonomous car simulation" 
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AutonomousCar