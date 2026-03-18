"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Reduced node count for perf
    const nodeCount = 35;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: "low-power" });
    renderer.setPixelRatio(1); // always 1 — no need for retina on bg
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 10;

    const nodePositions = new Float32Array(nodeCount * 3);
    const nodes: THREE.Vector3[] = [];
    for (let i = 0; i < nodeCount; i++) {
      const x = (Math.random() - 0.5) * 22;
      const y = (Math.random() - 0.5) * 14;
      const z = (Math.random() - 0.5) * 6;
      nodePositions[i * 3] = x;
      nodePositions[i * 3 + 1] = y;
      nodePositions[i * 3 + 2] = z;
      nodes.push(new THREE.Vector3(x, y, z));
    }

    const pointsGeo = new THREE.BufferGeometry();
    pointsGeo.setAttribute("position", new THREE.BufferAttribute(nodePositions, 3));
    const pointsMat = new THREE.PointsMaterial({ size: 0.05, color: "#c2a4ff", transparent: true, opacity: 0.5 });
    scene.add(new THREE.Points(pointsGeo, pointsMat));

    const lineVerts: number[] = [];
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        if (nodes[i].distanceTo(nodes[j]) < 4) {
          lineVerts.push(nodes[i].x, nodes[i].y, nodes[i].z);
          lineVerts.push(nodes[j].x, nodes[j].y, nodes[j].z);
        }
      }
    }
    const linesGeo = new THREE.BufferGeometry();
    linesGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(lineVerts), 3));
    const lines = new THREE.LineSegments(linesGeo,
      new THREE.LineBasicMaterial({ color: "#7f40ff", transparent: true, opacity: 0.07 })
    );
    scene.add(lines);

    let animId: number;
    let lastTime = 0;
    const FPS = 30; // cap background at 30fps — saves CPU
    const interval = 1000 / FPS;

    const animate = (now: number) => {
      animId = requestAnimationFrame(animate);
      if (now - lastTime < interval) return;
      lastTime = now;
      const t = now / 1000;
      lines.rotation.y = t * 0.025;
      lines.rotation.x = Math.sin(t * 0.015) * 0.06;
      renderer.render(scene, camera);
    };
    animId = requestAnimationFrame(animate);

    // Pause when tab hidden
    const onVisibility = () => {
      if (document.hidden) cancelAnimationFrame(animId);
      else animId = requestAnimationFrame(animate);
    };
    document.addEventListener("visibilitychange", onVisibility);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      pointsGeo.dispose();
      linesGeo.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ width: "100vw", height: "100vh", opacity: 0.5 }}
    />
  );
}
