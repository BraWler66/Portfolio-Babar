"use client"

import React from 'react'
import { motion } from "framer-motion"
import Link from "next/link"
import { GithubIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ProjectCardProps {
  title: string;
  description: string;
  github: string;
  live: string;
  skills: string[];
}

const ProjectCard: React.FC<ProjectCardProps> = ({ title, description, github, live, skills }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-accent/30 rounded-xl p-6 border border-border/50 w-full max-w-[450px] h-auto backdrop-blur transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(0,0,0,0.1)] relative"
    >
      <div className="flex items-center gap-3 mb-3">
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className="text-muted-foreground text-sm">{description}</p>
      <div className="flex flex-wrap gap-2 justify-center md:justify-start py-5">
        {skills.map((skill) => (
          <Badge
            key={skill}
            variant="secondary"
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-full transition-all duration-300 hover:scale-105"
            )}
          >
            {skill}
          </Badge>
        ))}
      </div>
      <div className="absolute right-4 bottom-4 flex flex-col gap-2">
        {github && (
          <Link href={github} target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="sm" className="gap-1 rounded-full w-10 h-10 p-0">
              <GithubIcon className="h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>
    </motion.div>
  )
}

const HumanBody: React.FC = () => {
  const breastCancerSkills = ["Deep Learning", "YOLOv8", "Medical Image Segmentation", "Data Preprocessing"];
  const wbbcSkills = ["Deep Learning", "TensorFlow", "Data Preprocessing", "Image Augmentation"];
  const kidneyStoneSkills = ["YOLOv8", "Object Detection", "Data Augmentation", "Custom Dataset Training"];
  const autonomousSkills = ["Deep Learning", "Computer Vision", "Advanced Data Visualization", "Transfer Learning"];
  const roboticArmSkills = ["Deep Learning", "YOLOv8", "Computer Vision", "Transfer Learning"];

  return (
    <div className="container mx-auto relative my-10 px-4 overflow-x-hidden">
      {/* Desktop Layout */}
      <div className="relative py-10 hidden md:block">
        <img className="max-w-2xl mx-auto" src="./Human-body2.png" alt="Human Body" />

        {/* Breast Cancer Tumor Segmentation */}
        <div className="absolute top-[17%] left-[52%]">
          <img className="w-36 h-36 z-40 rotate-4" src="./arrow.png" alt="arrow" />
        </div>
        <div className="absolute top-[5%] left-[65%]">
          <ProjectCard
            title="Breast Cancer Tumor Segmentation"
            description="Tumor segmentation in mammogram images using advanced deep learning segmentation models."
            github="https://github.com/BraWler66/YOLOv8_Medical_Imaging"
            live=""
            skills={breastCancerSkills}
          />
        </div>

        {/* Kidney Abnormalities */}
        <div className="absolute top-[40%] left-[50%]">
          <img className="w-36 h-36" src="./arrow.png" alt="arrow" />
        </div>
        <div className="absolute top-[36%] left-[65%]">
          <ProjectCard
            title="Deep Learning-Based Detection of Kidney Abnormalities from CT Scans"
            description="AI-powered CT scan analysis for early kidney abnormality detection."
            github="https://github.com/BraWler66/Deep-Learning-Based-Detection-of-Kidney-Abnormalities-from-CT-Scans"
            live=""
            skills={wbbcSkills}
          />
        </div>

        {/* RBC & WBC */}
        <div className="absolute top-[15%] left-[34%]">
          <img className="w-36 h-36 rotate-[180deg]" src="./arrow.png" alt="arrow" />
        </div>
        <div className="absolute top-[36%] right-[70%]">
          <ProjectCard
            title="RBC & WBC Detection in Microscopic Blood Images"
            description="Accurate detection and classification of red and white blood cells using object detection."
            github="https://github.com/BraWler66/YOLOv8_Medical_Imaging"
            live=""
            skills={kidneyStoneSkills}
          />
        </div>

        {/* Osteoarthritis Detection */}
        <div className="absolute top-[45%] rotate-[180deg] left-[30%]">
          <img className="w-36 h-36" src="./arrow.png" alt="arrow" />
        </div>
        <div className="absolute top-[69%] left-[65%]">
          <ProjectCard
            title="Knee Osteoarthritis Grading Using X-ray Images"
            description="Automated knee osteoarthritis grading via X-ray using ResNet."
            github="https://github.com/BraWler66/Knee-Osteoarthritis-Grading-Using-X-ray-Images-ResNet-"
            live=""
            skills={autonomousSkills}
          />
        </div>

        {/* COVID-19 Detection */}
        <div className="absolute top-[65%] left-[55%]">
          <img className="w-36 h-36 rotate-12" src="./arrow.png" alt="arrow" />
        </div>
        <div className="absolute top-[5%] right-[70%]">
          <ProjectCard
            title="AI-Based COVID-19 Detection from Chest X-rays"
            description="Real-time COVID-19 detection from X-ray images using YOLOv8."
            github="https://github.com/BraWler66/YOLOv8_Medical_Imaging"
            live=""
            skills={roboticArmSkills}
          />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="flex flex-col items-center gap-8 md:hidden">
        <img className="w-full max-w-xs" src="./Human-body2.png" alt="Human Body" />

        <ProjectCard
          title="Breast Cancer Tumor Segmentation"
          description="Tumor segmentation in mammogram images using advanced deep learning segmentation models."
          github="https://github.com/BraWler66/YOLOv8_Medical_Imaging"
          live=""
          skills={breastCancerSkills}
        />
        <ProjectCard
          title="Kidney Abnormality Detection from CT Scans"
          description="AI-powered CT scan analysis for early kidney abnormality detection."
          github="https://github.com/BraWler66/Deep-Learning-Based-Detection-of-Kidney-Abnormalities-from-CT-Scans"
          live=""
          skills={wbbcSkills}
        />
        <ProjectCard
          title="RBC & WBC Detection in Microscopic Blood Images"
          description="Accurate detection and classification of red and white blood cells using object detection."
          github="https://github.com/BraWler66/YOLOv8_Medical_Imaging"
          live=""
          skills={kidneyStoneSkills}
        />
        <ProjectCard
          title="Knee Osteoarthritis Grading Using X-ray Images"
          description="Automated knee osteoarthritis grading via X-ray using ResNet."
          github="https://github.com/BraWler66/Knee-Osteoarthritis-Grading-Using-X-ray-Images-ResNet-"
          live=""
          skills={autonomousSkills}
        />
        <ProjectCard
          title="AI-Based COVID-19 Detection from Chest X-rays"
          description="Real-time COVID-19 detection from X-ray images using YOLOv8."
          github="https://github.com/BraWler66/YOLOv8_Medical_Imaging"
          live=""
          skills={roboticArmSkills}
        />
      </div>
    </div>
  )
}

export default HumanBody
