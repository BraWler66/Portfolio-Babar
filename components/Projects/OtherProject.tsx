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

const OtherProject = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const displayedProjects = projects.slice(0, 6)

  return (
    <>
        <div className="flex justify-center items-center gap-10 mt-10 p-10">

          {displayedProjects.map((project, index) => (
              <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              >
              <Card className="h-full w-[500px] overflow-hidden border-border/50 bg-card/70 backdrop-blur transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(0,0,0,0.1)]">
                <div className="aspect-video w-full overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className={cn(
                        "h-full w-full object-cover transition-transform duration-500",
                        hoveredIndex === index && "scale-110"
                    )}
                    />
                </div>
                
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-bold">{project.title}</CardTitle>
                    {project.grant && (
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                        {project.grant}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-muted-foreground mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.badges.map((badge) => (
                        <Badge key={badge} variant="secondary">{badge}</Badge>
                    ))}
                  </div>
                </CardContent>
                
                <CardFooter className="flex gap-3">
                  <Link href={project.links.github} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="sm" className="gap-1">
                      <GithubIcon className="h-4 w-4" />
                      <span>Repo</span>
                    </Button>
                  </Link>
                  
                  {project.links.live && (
                      <Link href={project.links.live} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="sm" className="gap-1">
                        <ExternalLinkIcon className="h-4 w-4" />
                        <span>Live</span>
                      </Button>
                    </Link>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          ))}
          </div>

          </>
  )
}

export default OtherProject
