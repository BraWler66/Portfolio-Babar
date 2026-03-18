"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HeroModel3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = mount.clientWidth || 700;
    const H = mount.clientHeight || 900;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 200);
    camera.position.set(0, 0, 7);

    // ── LIGHTS ──────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0x05000f, 4));

    const pinkLight = new THREE.PointLight(0xfb8dff, 40, 20);
    pinkLight.position.set(4, 6, 5);
    scene.add(pinkLight);

    const purpleLight = new THREE.PointLight(0x7f40ff, 30, 18);
    purpleLight.position.set(-5, -3, 3);
    scene.add(purpleLight);

    const cyanLight = new THREE.PointLight(0x44ccff, 20, 14);
    cyanLight.position.set(2, -4, 2);
    scene.add(cyanLight);

    const rimLight = new THREE.DirectionalLight(0xc2a4ff, 1.5);
    rimLight.position.set(-3, 5, -4);
    scene.add(rimLight);

    const root = new THREE.Group();
    scene.add(root);

    // ═══════════════════════════════════════════════════════════
    // 1. CENTRAL AI BRAIN — large glowing core + shells
    // ═══════════════════════════════════════════════════════════
    const brainGroup = new THREE.Group();
    root.add(brainGroup);

    // Outer glass sphere
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x1a0a3a,
      transparent: true,
      opacity: 0.25,
      roughness: 0,
      metalness: 0.1,
      transmission: 0.6,
      thickness: 1.5,
      clearcoat: 1,
      side: THREE.DoubleSide,
    });
    brainGroup.add(new THREE.Mesh(new THREE.SphereGeometry(1.8, 64, 64), glassMat));

    // Core glowing sphere
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x6020cc,
      emissive: 0x4010aa,
      emissiveIntensity: 1.2,
      roughness: 0.0,
      metalness: 0.2,
      clearcoat: 1,
      transparent: true,
      opacity: 0.95,
    });
    const core = new THREE.Mesh(new THREE.SphereGeometry(0.9, 64, 64), coreMat);
    brainGroup.add(core);

    // Inner hot glow
    const innerMat = new THREE.MeshBasicMaterial({ color: 0xc2a4ff, transparent: true, opacity: 0.18 });
    const innerGlow = new THREE.Mesh(new THREE.SphereGeometry(0.7, 32, 32), innerMat);
    brainGroup.add(innerGlow);

    // Hottest core center
    const hotCore = new THREE.Mesh(
      new THREE.SphereGeometry(0.35, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.25 })
    );
    brainGroup.add(hotCore);

    // ═══════════════════════════════════════════════════════════
    // 2. MULTI-LAYER ICOSAHEDRON WIREFRAME SHELLS
    // ═══════════════════════════════════════════════════════════
    const shells: THREE.Mesh[] = [];
    [
      { r: 1.15, detail: 1, color: 0xc2a4ff, op: 0.18 },
      { r: 1.42, detail: 2, color: 0x9966ff, op: 0.10 },
      { r: 1.72, detail: 1, color: 0xfb8dff, op: 0.07 },
    ].forEach(({ r, detail, color, op }) => {
      const s = new THREE.Mesh(
        new THREE.IcosahedronGeometry(r, detail),
        new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: op })
      );
      brainGroup.add(s);
      shells.push(s);
    });

    // ═══════════════════════════════════════════════════════════
    // 3. ORBITAL RINGS — 5 rings at various angles
    // ═══════════════════════════════════════════════════════════
    type RingObj = { mesh: THREE.Mesh; speed: number; axis: THREE.Vector3 };
    const rings: RingObj[] = [];
    [
      { r: 2.1,  tube: 0.008, color: 0xc2a4ff, op: 0.55, rx: Math.PI/2.5, ry: 0,          speed: 0.22 },
      { r: 2.35, tube: 0.006, color: 0xfb8dff, op: 0.35, rx: Math.PI/4,   ry: Math.PI/5,  speed: -0.16 },
      { r: 1.95, tube: 0.007, color: 0x7f40ff, op: 0.45, rx: 0,           ry: Math.PI/3,  speed: 0.19 },
      { r: 2.55, tube: 0.004, color: 0x44ccff, op: 0.20, rx: Math.PI/6,   ry: Math.PI/4,  speed: -0.12 },
      { r: 2.2,  tube: 0.005, color: 0xc2a4ff, op: 0.25, rx: Math.PI/1.8, ry: Math.PI/7,  speed: 0.14 },
    ].forEach(({ r, tube, color, op, rx, ry, speed }) => {
      const mesh = new THREE.Mesh(
        new THREE.TorusGeometry(r, tube, 8, 160),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: op })
      );
      mesh.rotation.x = rx;
      mesh.rotation.y = ry;
      brainGroup.add(mesh);
      rings.push({ mesh, speed, axis: new THREE.Vector3(0, 0, 1) });
    });

    // ═══════════════════════════════════════════════════════════
    // 4. NEURON NODES — dense glowing particles on surface
    // ═══════════════════════════════════════════════════════════
    const nodeCount = 120;
    const nodeMeshes: THREE.Mesh[] = [];
    const nodePositions: THREE.Vector3[] = [];
    const nodePhases: number[] = [];

    for (let i = 0; i < nodeCount; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      const r = 1.0 + Math.random() * 0.85;
      const pos = new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );
      nodePositions.push(pos);
      nodePhases.push(Math.random() * Math.PI * 2);

      const brightness = Math.random();
      const color = brightness > 0.65 ? 0xfb8dff : brightness > 0.35 ? 0xc2a4ff : 0x7f40ff;
      const nodeMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.012 + Math.random() * 0.022, 8, 8),
        new THREE.MeshStandardMaterial({
          color,
          emissive: color,
          emissiveIntensity: 1.2 + Math.random() * 0.8,
          roughness: 0.1,
        })
      );
      nodeMesh.position.copy(pos);
      brainGroup.add(nodeMesh);
      nodeMeshes.push(nodeMesh);
    }

    // ═══════════════════════════════════════════════════════════
    // 5. SYNAPTIC CONNECTIONS
    // ═══════════════════════════════════════════════════════════
    const linePts: number[] = [];
    const lineColors: number[] = [];
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const d = nodePositions[i].distanceTo(nodePositions[j]);
        if (d < 0.75 && Math.random() > 0.35) {
          linePts.push(...nodePositions[i].toArray(), ...nodePositions[j].toArray());
          const t = d / 0.75;
          lineColors.push(0.97, 0.54 + t * 0.1, 1.0, 0.5 + t * 0.3, 0.25, 1.0);
        }
      }
    }
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(linePts, 3));
    lineGeo.setAttribute("color", new THREE.Float32BufferAttribute(lineColors, 3));
    brainGroup.add(new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({
      vertexColors: true, transparent: true, opacity: 0.22
    })));

    // ═══════════════════════════════════════════════════════════
    // 6. ORBITING SATELLITES — 7 glowing spheres
    // ═══════════════════════════════════════════════════════════
    type Satellite = { mesh: THREE.Mesh; angle: number; speed: number; radius: number; yOff: number; tilt: number };
    const satellites: Satellite[] = [];
    const satColors = [0xfb8dff, 0xc2a4ff, 0x7f40ff, 0x44ccff, 0xfb8dff, 0xffffff, 0xc2a4ff];
    const satSizes  = [0.09, 0.06, 0.08, 0.05, 0.07, 0.04, 0.06];

    for (let i = 0; i < 7; i++) {
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(satSizes[i], 16, 16),
        new THREE.MeshStandardMaterial({
          color: satColors[i],
          emissive: satColors[i],
          emissiveIntensity: 2.0,
          roughness: 0.05,
        })
      );
      const radius = 2.15 + Math.random() * 0.7;
      const angle  = (i / 7) * Math.PI * 2;
      const yOff   = (Math.random() - 0.5) * 1.8;
      const tilt   = Math.random() * Math.PI;
      mesh.position.set(Math.cos(angle) * radius, yOff, Math.sin(angle) * radius);
      brainGroup.add(mesh);
      satellites.push({ mesh, angle, speed: 0.25 + Math.random() * 0.5, radius, yOff, tilt });
    }

    // ═══════════════════════════════════════════════════════════
    // 7. DATA DISC RINGS (flat equatorial rings)
    // ═══════════════════════════════════════════════════════════
    [
      { r: 2.7, color: 0xfb8dff, op: 0.07, rx: Math.PI / 2.3 },
      { r: 3.1, color: 0xc2a4ff, op: 0.05, rx: Math.PI / 3.2 },
    ].forEach(({ r, color, op, rx }) => {
      const disc = new THREE.Mesh(
        new THREE.RingGeometry(r - 0.06, r + 0.06, 128),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: op, side: THREE.DoubleSide })
      );
      disc.rotation.x = rx;
      brainGroup.add(disc);
    });

    // ═══════════════════════════════════════════════════════════
    // 8. FLOATING DATA PARTICLES (outer field)
    // ═══════════════════════════════════════════════════════════
    const pCount = 500;
    const pPos   = new Float32Array(pCount * 3);
    const pSpeeds = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      const r   = 3.2 + Math.random() * 3.0;
      const phi = Math.acos(2 * Math.random() - 1);
      const th  = Math.random() * Math.PI * 2;
      pPos[i*3]   = r * Math.sin(phi) * Math.cos(th);
      pPos[i*3+1] = r * Math.sin(phi) * Math.sin(th);
      pPos[i*3+2] = r * Math.cos(phi);
      pSpeeds[i*3]   = (Math.random() - 0.5) * 0.0015;
      pSpeeds[i*3+1] = (Math.random() - 0.5) * 0.0015;
      pSpeeds[i*3+2] = (Math.random() - 0.5) * 0.0015;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({
      size: 0.022, color: 0xc2a4ff, transparent: true, opacity: 0.55, sizeAttenuation: true
    }));
    scene.add(dust);

    // ═══════════════════════════════════════════════════════════
    // 9. ENERGY BEAMS — thin cylinders shooting from core
    // ═══════════════════════════════════════════════════════════
    const beams: THREE.Mesh[] = [];
    for (let i = 0; i < 8; i++) {
      const phi   = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      const dir   = new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta),
        Math.sin(phi) * Math.sin(theta),
        Math.cos(phi)
      );
      const len  = 1.0 + Math.random() * 0.8;
      const beam = new THREE.Mesh(
        new THREE.CylinderGeometry(0.003, 0.001, len, 4),
        new THREE.MeshBasicMaterial({
          color: Math.random() > 0.5 ? 0xfb8dff : 0xc2a4ff,
          transparent: true,
          opacity: 0.35 + Math.random() * 0.3,
        })
      );
      // align cylinder along direction
      beam.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
      beam.position.copy(dir.clone().multiplyScalar(0.9 + len / 2));
      brainGroup.add(beam);
      beams.push(beam);
    }

    // ═══════════════════════════════════════════════════════════
    // MOUSE
    // ═══════════════════════════════════════════════════════════
    let mouseX = 0, mouseY = 0;
    const onMouse = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouse);

    // ═══════════════════════════════════════════════════════════
    // ANIMATE
    // ═══════════════════════════════════════════════════════════
    let animId: number;
    const timer = new THREE.Timer();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      timer.update();
      const t = timer.getElapsed();

      // Mouse tilt + slow auto-rotate
      root.rotation.y += (mouseX * 0.35 - root.rotation.y) * 0.04 + 0.004;
      root.rotation.x += (mouseY * 0.18 - root.rotation.x) * 0.04;

      // Core pulse
      const pulse = 1 + Math.sin(t * 1.3) * 0.025;
      core.scale.setScalar(pulse);
      innerGlow.scale.setScalar(pulse * 1.08);
      hotCore.scale.setScalar(pulse * 1.15);
      coreMat.emissiveIntensity = 0.9 + Math.sin(t * 1.6) * 0.4;

      // Shell counter-rotations
      shells[0].rotation.x = t * 0.09;
      shells[0].rotation.y = t * 0.13;
      shells[1].rotation.x = -t * 0.07;
      shells[1].rotation.z = t * 0.10;
      shells[2].rotation.y = -t * 0.05;
      shells[2].rotation.x = t * 0.06;

      // Ring orbits
      rings.forEach(({ mesh, speed }, i) => {
        mesh.rotation.z = t * speed;
        mesh.rotation.x += Math.sin(t * 0.3 + i) * 0.0005;
      });

      // Satellites
      satellites.forEach((sat, i) => {
        sat.angle += sat.speed * 0.008;
        const r = sat.radius;
        const cosT = Math.cos(sat.tilt);
        const sinT = Math.sin(sat.tilt);
        const cx   = Math.cos(sat.angle) * r;
        const cz   = Math.sin(sat.angle) * r;
        sat.mesh.position.set(cx, sat.yOff + Math.sin(t * 0.6 + i) * 0.2, cz * cosT);
        const mat = sat.mesh.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = 1.6 + Math.sin(t * 2.5 + i * 1.1) * 0.7;
      });

      // Neuron flicker
      nodeMeshes.forEach((n, i) => {
        const mat = n.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = 0.7 + Math.sin(t * 2.8 + nodePhases[i]) * 0.8;
      });

      // Pulse lights
      pinkLight.intensity   = 32 + Math.sin(t * 1.4) * 10;
      purpleLight.intensity = 24 + Math.cos(t * 1.1) * 8;
      cyanLight.intensity   = 16 + Math.sin(t * 0.9 + 1) * 6;

      // Dust drift + gentle float
      dust.rotation.y = t * 0.012;
      dust.rotation.x = t * 0.006;

      // Beam flicker
      beams.forEach((b, i) => {
        const mat = b.material as THREE.MeshBasicMaterial;
        mat.opacity = 0.1 + Math.abs(Math.sin(t * 3 + i * 0.7)) * 0.5;
      });

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
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{ width: "100%", height: "100%", position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1 }}
    />
  );
}
