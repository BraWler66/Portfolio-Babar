"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Brain3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Only init when visible in viewport
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
    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 100);
    camera.position.set(0, 0, 5);

    // ── Lights ──
    scene.add(new THREE.AmbientLight(0x1a0a2e, 4));
    const pinkLight = new THREE.PointLight(0xfb8dff, 12, 8);
    pinkLight.position.set(2, 2, 2);
    scene.add(pinkLight);
    const purpleLight = new THREE.PointLight(0x7f40ff, 10, 8);
    purpleLight.position.set(-2, -1, 1);
    scene.add(purpleLight);
    const cyanLight = new THREE.PointLight(0xc2a4ff, 6, 6);
    cyanLight.position.set(0, 3, -2);
    scene.add(cyanLight);

    // ── Build a neural-network-style brain ──
    // Core sphere (translucent)
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x7f40ff,
      transparent: true,
      opacity: 0.08,
      roughness: 0.1,
      metalness: 0.2,
      side: THREE.DoubleSide,
    });
    const core = new THREE.Mesh(new THREE.SphereGeometry(1.4, 32, 32), coreMat);
    scene.add(core);

    // ── Neuron nodes scattered in a brain-like ellipsoid ──
    const nodeCount = 120;
    const nodes: THREE.Vector3[] = [];
    const nodeMeshes: THREE.Mesh[] = [];

    // Brain-shape: flatten Y slightly, push into frontal/back lobes
    for (let i = 0; i < nodeCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 0.4 + Math.random() * 1.0;
      const x = r * Math.sin(phi) * Math.cos(theta) * 1.3;
      const y = r * Math.sin(phi) * Math.sin(theta) * 0.9;
      const z = r * Math.cos(phi) * 1.1;
      const pos = new THREE.Vector3(x, y, z);
      nodes.push(pos);

      const size = 0.018 + Math.random() * 0.025;
      const brightness = Math.random();
      const nodeMat = new THREE.MeshStandardMaterial({
        color: brightness > 0.6 ? 0xfb8dff : brightness > 0.3 ? 0xc2a4ff : 0x7f40ff,
        emissive: brightness > 0.6 ? 0xfb8dff : 0x7f40ff,
        emissiveIntensity: 0.8 + Math.random() * 0.6,
        roughness: 0.2,
      });
      const nodeMesh = new THREE.Mesh(new THREE.SphereGeometry(size, 8, 8), nodeMat);
      nodeMesh.position.copy(pos);
      scene.add(nodeMesh);
      nodeMeshes.push(nodeMesh);
    }

    // ── Synaptic connections ──
    const connectionGeo = new THREE.BufferGeometry();
    const linePositions: number[] = [];
    const lineColors: number[] = [];

    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dist = nodes[i].distanceTo(nodes[j]);
        if (dist < 0.85 && Math.random() > 0.3) {
          linePositions.push(nodes[i].x, nodes[i].y, nodes[i].z);
          linePositions.push(nodes[j].x, nodes[j].y, nodes[j].z);
          const t = dist / 0.85;
          // pink → purple gradient along connection
          lineColors.push(0.98, 0.55 + t * 0.1, 1.0);
          lineColors.push(0.5 + t * 0.3, 0.25, 1.0);
        }
      }
    }

    connectionGeo.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
    connectionGeo.setAttribute("color", new THREE.Float32BufferAttribute(lineColors, 3));
    const connectionMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.25,
    });
    scene.add(new THREE.LineSegments(connectionGeo, connectionMat));

    // ── Outer wireframe shell ──
    const shellGeo = new THREE.IcosahedronGeometry(1.55, 2);
    const shellMat = new THREE.MeshBasicMaterial({
      color: 0xc2a4ff,
      wireframe: true,
      transparent: true,
      opacity: 0.06,
    });
    const shell = new THREE.Mesh(shellGeo, shellMat);
    scene.add(shell);

    // ── Orbiting ring ──
    const ringGeo = new THREE.TorusGeometry(1.8, 0.008, 8, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xc2a4ff, transparent: true, opacity: 0.3 });
    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    ring1.rotation.x = Math.PI / 3;
    scene.add(ring1);

    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(1.65, 0.006, 8, 100),
      new THREE.MeshBasicMaterial({ color: 0xfb8dff, transparent: true, opacity: 0.2 })
    );
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.z = Math.PI / 5;
    scene.add(ring2);

    // ── Floating particle dust ──
    const dustCount = 200;
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3]     = (Math.random() - 0.5) * 6;
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * 6;
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({ size: 0.02, color: 0xc2a4ff, transparent: true, opacity: 0.5 });
    scene.add(new THREE.Points(dustGeo, dustMat));

    // ── Mouse interaction ──
    let mouseX = 0, mouseY = 0;
    const onMouse = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / W - 0.5) * 2;
      mouseY = -((e.clientY - rect.top) / H - 0.5) * 2;
    };
    mount.addEventListener("mousemove", onMouse);

    // ── Animate ──
    let animId: number;
    const timer = new THREE.Timer();
    // per-node flicker phases
    const phases = nodeMeshes.map(() => Math.random() * Math.PI * 2);

    const animate = () => {
      animId = requestAnimationFrame(animate);
      timer.update();
      const t = timer.getElapsed();

      // slow auto-rotation + mouse tilt
      scene.rotation.y += (mouseX * 0.4 - scene.rotation.y) * 0.03 + 0.003;
      scene.rotation.x += (mouseY * 0.2 - scene.rotation.x) * 0.03;

      // shell pulse
      const s = 1 + Math.sin(t * 0.6) * 0.015;
      shell.scale.setScalar(s);

      // ring orbits
      ring1.rotation.z = t * 0.25;
      ring2.rotation.y = t * 0.18;

      // neuron flicker
      nodeMeshes.forEach((n, i) => {
        const mat = n.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = 0.5 + Math.sin(t * 2 + phases[i]) * 0.5;
      });

      // pulsing lights
      pinkLight.intensity = 10 + Math.sin(t * 1.5) * 3;
      purpleLight.intensity = 8 + Math.cos(t * 1.2) * 2;

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
