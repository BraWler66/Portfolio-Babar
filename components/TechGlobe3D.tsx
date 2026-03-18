"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const TECHS = [
  "Python","PyTorch","TensorFlow","YOLOv8","OpenCV",
  "LangChain","HuggingFace","CARLA","FastAPI","Gradio",
  "Pandas","NumPy","Scikit-learn","ResNet","U-Net","FAISS",
  "ChromaDB","DQN","Streamlit","Docker",
  "Keras","Flask","Git","Jupyter","VS Code",
  "Transformers","BERT","GPT","RAG","NLP",
  "Matplotlib","Seaborn","Power BI","SQL","Linux",
  "Reinforcement Learning","Computer Vision","Fine-tuning","Prompt Eng","Medical AI",
];

export default function TechGlobe3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let started = false;
    let cleanupFn: (() => void) | null = null;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) {
        started = true;
        observer.disconnect();
        cleanupFn = initScene(mount);
      }
    }, { threshold: 0.1 });
    observer.observe(mount);

    return () => {
      observer.disconnect();
      cleanupFn?.();
    };
  }, []);

  return <div ref={mountRef} style={{ width: "100%", height: "100%" }} />;
}

function initScene(mount: HTMLDivElement): () => void {
  const W = mount.clientWidth || 500;
  const H = mount.clientHeight || 500;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W, H);
  mount.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 100);
  camera.position.z = 5;

  // Lights
  scene.add(new THREE.AmbientLight(0x1a0a2e, 5));
  const pL = new THREE.PointLight(0xfb8dff, 15, 10);
  pL.position.set(3, 2, 3);
  scene.add(pL);
  const pL2 = new THREE.PointLight(0x7f40ff, 10, 10);
  pL2.position.set(-3, -2, -2);
  scene.add(pL2);

  // Wireframe globe
  const globeGeo = new THREE.SphereGeometry(2, 24, 24);
  const globeMat = new THREE.MeshBasicMaterial({
    color: 0xc2a4ff, wireframe: true, transparent: true, opacity: 0.07,
  });
  const globe = new THREE.Mesh(globeGeo, globeMat);
  scene.add(globe);

  // Equator ring
  const ringGeo = new THREE.TorusGeometry(2, 0.006, 8, 100);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0xfb8dff, transparent: true, opacity: 0.3 });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 2;
  scene.add(ring);

  // Create text labels as sprites on the globe surface
  const labels: THREE.Sprite[] = [];
  TECHS.forEach((tech, i) => {
    // Fibonacci sphere distribution
    const phi = Math.acos(1 - 2 * (i + 0.5) / TECHS.length);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    const r = 2.05;
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.cos(phi);
    const z = r * Math.sin(phi) * Math.sin(theta);

    // Canvas sprite for text
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 80;
    const ctx = canvas.getContext("2d")!;

    // Background pill
    ctx.fillStyle = "rgba(194,164,255,0.12)";
    ctx.strokeStyle = "rgba(194,164,255,0.4)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(4, 4, 248, 72, 20);
    ctx.fill();
    ctx.stroke();

    // Text
    ctx.fillStyle = "#eae5ec";
    ctx.font = "bold 28px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(tech, 128, 40);

    const tex = new THREE.CanvasTexture(canvas);
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0.9 });
    const sprite = new THREE.Sprite(mat);
    sprite.position.set(x, y, z);
    sprite.scale.set(0.9, 0.28, 1);
    scene.add(sprite);
    labels.push(sprite);
  });

  // Node dots on globe
  for (let i = 0; i < 60; i++) {
    const phi = Math.random() * Math.PI;
    const theta = Math.random() * Math.PI * 2;
    const r = 2;
    const dot = new THREE.Mesh(
      new THREE.SphereGeometry(0.02, 6, 6),
      new THREE.MeshStandardMaterial({
        color: Math.random() > 0.5 ? 0xfb8dff : 0xc2a4ff,
        emissive: 0x7f40ff, emissiveIntensity: 1,
      })
    );
    dot.position.set(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.cos(phi),
      r * Math.sin(phi) * Math.sin(theta)
    );
    scene.add(dot);
  }

  // Mouse
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;
  const onMouse = (e: MouseEvent) => {
    const rect = mount.getBoundingClientRect();
    mouseX = ((e.clientX - rect.left) / W - 0.5) * 2;
    mouseY = -((e.clientY - rect.top) / H - 0.5) * 2;
  };
  mount.addEventListener("mousemove", onMouse);

  let animId: number;
  const timer = new THREE.Timer();

  const animate = () => {
    animId = requestAnimationFrame(animate);
    timer.update();
    const t = timer.getElapsed();

    targetX += (mouseX * 0.3 - targetX) * 0.04;
    targetY += (mouseY * 0.15 - targetY) * 0.04;

    scene.rotation.y = t * 0.12 + targetX;
    scene.rotation.x = targetY * 0.5;

    // Labels always face camera
    labels.forEach((l) => l.lookAt(camera.position));

    // Ring pulse
    ring.scale.setScalar(1 + Math.sin(t * 0.8) * 0.01);
    pL.intensity = 12 + Math.sin(t * 1.5) * 4;

    renderer.render(scene, camera);
  };
  animate();

  const onResize = () => {
    const w = mount.clientWidth || W;
    const h = mount.clientHeight || H;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };
  window.addEventListener("resize", onResize);

  return () => {
    cancelAnimationFrame(animId);
    mount.removeEventListener("mousemove", onMouse);
    window.removeEventListener("resize", onResize);
    renderer.dispose();
    if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
  };
}
