"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// ── ONLY 2 REAL JOBS ──────────────────────────────────────────────────────────
const JOBS = [
  {
    title: "Machine Learning Intern",
    company: "TechVentures ISB",
    period: "2024  ·  3 Months",
    tag: "INTERNSHIP",
    bullets: [
      "Trained CV models for object detection & classification",
      "Built data preprocessing & augmentation pipelines",
      "Implemented YOLOv8 for real-time inference",
      "Worked with OpenCV, Python, Scikit-learn",
    ],
    color: 0x44ffaa,
    hex: "#44ffaa",
    yPos: 1.6,
  },
  {
    title: "AI Engineer",
    company: "Neural Lines",
    period: "Jul 2025  ·  Present",
    tag: "CURRENT",
    bullets: [
      "Building LangChain RAG & LLM pipelines",
      "NLP: NER models, sentiment analysis, text classification",
      "Automated data workflows & Power BI visualizations",
      "Production AI deployments & model fine-tuning",
    ],
    color: 0xfb8dff,
    hex: "#c2a4ff",
    yPos: -1.6,
  },
];

export default function WorkTimeline3D() {
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
    }, { threshold: 0.05 });
    observer.observe(mount);
    return () => { observer.disconnect(); cleanupFn?.(); };
  }, []);

  return <div ref={mountRef} style={{ width: "100%", height: "100%" }} />;
}

// ── CARD CANVAS ──────────────────────────────────────────────────────────────
function makeCard(job: typeof JOBS[0]): THREE.Sprite {
  const CW = 640, CH = 320;
  const canvas = document.createElement("canvas");
  canvas.width = CW; canvas.height = CH;
  const ctx = canvas.getContext("2d")!;

  const r = (job.color >> 16) & 255;
  const g = (job.color >> 8) & 255;
  const b = job.color & 255;

  // ── glass background ──
  ctx.fillStyle = "rgba(8, 4, 20, 0.94)";
  ctx.strokeStyle = `rgba(${r},${g},${b},0.45)`;
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.roundRect(3, 3, CW - 6, CH - 6, 18);
  ctx.fill();
  ctx.stroke();

  // ── top glow bar ──
  const grad = ctx.createLinearGradient(0, 0, CW, 0);
  grad.addColorStop(0, `rgba(${r},${g},${b},0.7)`);
  grad.addColorStop(1, `rgba(${r},${g},${b},0.0)`);
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.roundRect(3, 3, CW - 6, 4, [18, 18, 0, 0]);
  ctx.fill();

  // ── corner brackets ──
  const bSize = 18;
  ctx.strokeStyle = `rgba(${r},${g},${b},0.8)`;
  ctx.lineWidth = 2;
  // TL
  ctx.beginPath(); ctx.moveTo(3, 3 + bSize); ctx.lineTo(3, 3); ctx.lineTo(3 + bSize, 3); ctx.stroke();
  // TR
  ctx.beginPath(); ctx.moveTo(CW - 3 - bSize, 3); ctx.lineTo(CW - 3, 3); ctx.lineTo(CW - 3, 3 + bSize); ctx.stroke();
  // BL
  ctx.beginPath(); ctx.moveTo(3, CH - 3 - bSize); ctx.lineTo(3, CH - 3); ctx.lineTo(3 + bSize, CH - 3); ctx.stroke();
  // BR
  ctx.beginPath(); ctx.moveTo(CW - 3 - bSize, CH - 3); ctx.lineTo(CW - 3, CH - 3); ctx.lineTo(CW - 3, CH - 3 - bSize); ctx.stroke();

  // ── tag badge ──
  const tagW = ctx.measureText(job.tag).width + 36;
  ctx.font = "bold 16px Arial";
  ctx.fillStyle = `rgba(${r},${g},${b},0.15)`;
  ctx.strokeStyle = `rgba(${r},${g},${b},0.5)`;
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.roundRect(22, 18, tagW, 28, 5); ctx.fill(); ctx.stroke();
  ctx.fillStyle = `rgb(${r},${g},${b})`;
  ctx.textAlign = "left"; ctx.textBaseline = "middle";
  ctx.fillText(job.tag, 40, 32);

  // ── title ──
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 36px Arial";
  ctx.fillText(job.title, 22, 72);

  // ── company + period ──
  ctx.fillStyle = `rgb(${r},${g},${b})`;
  ctx.font = "500 22px Arial";
  ctx.fillText(job.company, 22, 108);
  ctx.fillStyle = "rgba(180,170,200,0.6)";
  ctx.font = "300 18px Arial";
  ctx.fillText(job.period, 22, 132);

  // ── divider ──
  ctx.strokeStyle = `rgba(${r},${g},${b},0.2)`;
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(22, 148); ctx.lineTo(CW - 22, 148); ctx.stroke();

  // ── bullet points ──
  ctx.font = "300 17px Arial";
  job.bullets.forEach((bullet, bi) => {
    const by = 165 + bi * 36;
    if (by > CH - 18) return;
    // dot
    ctx.fillStyle = `rgba(${r},${g},${b},0.8)`;
    ctx.beginPath(); ctx.arc(32, by + 9, 3, 0, Math.PI * 2); ctx.fill();
    // text
    ctx.fillStyle = "rgba(210,200,230,0.8)";
    ctx.fillText(bullet, 46, by);
  });

  const tex = new THREE.CanvasTexture(canvas);
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(5.5, 2.75, 1);
  return sprite;
}

// ── SCENE ────────────────────────────────────────────────────────────────────
function initScene(mount: HTMLDivElement): () => void {
  const W = mount.clientWidth || 600;
  const H = mount.clientHeight || 700;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W, H);
  mount.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(52, W / H, 0.1, 100);
  camera.position.set(0, 0, 11);

  // ── lights ──
  scene.add(new THREE.AmbientLight(0x080010, 6));
  const pL1 = new THREE.PointLight(0xfb8dff, 25, 18);
  pL1.position.set(5, 3, 5);
  scene.add(pL1);
  const pL2 = new THREE.PointLight(0x44ffaa, 20, 14);
  pL2.position.set(-5, -3, 3);
  scene.add(pL2);
  const pL3 = new THREE.PointLight(0x7f40ff, 15, 12);
  pL3.position.set(0, 5, -2);
  scene.add(pL3);

  const root = new THREE.Group();
  scene.add(root);

  // ── NEURAL BACKGROUND (same style as Brain3D) ────────────────────────────
  const bgNodeCount = 60;
  const bgNodes: THREE.Vector3[] = [];
  for (let i = 0; i < bgNodeCount; i++) {
    const x = (Math.random() - 0.5) * 14;
    const y = (Math.random() - 0.5) * 10;
    const z = (Math.random() - 0.5) * 6 - 2;
    bgNodes.push(new THREE.Vector3(x, y, z));
    const dot = new THREE.Mesh(
      new THREE.SphereGeometry(0.02 + Math.random() * 0.025, 6, 6),
      new THREE.MeshBasicMaterial({
        color: Math.random() > 0.5 ? 0xc2a4ff : Math.random() > 0.5 ? 0xfb8dff : 0x44ffaa,
        transparent: true,
        opacity: 0.25 + Math.random() * 0.3,
      })
    );
    dot.position.copy(bgNodes[i]);
    root.add(dot);
  }
  // synaptic lines
  const synPts: number[] = [], synCols: number[] = [];
  for (let i = 0; i < bgNodeCount; i++) {
    for (let j = i + 1; j < bgNodeCount; j++) {
      const d = bgNodes[i].distanceTo(bgNodes[j]);
      if (d < 2.2 && Math.random() > 0.5) {
        synPts.push(...bgNodes[i].toArray(), ...bgNodes[j].toArray());
        const t = d / 2.2;
        synCols.push(0.76, 0.64, 1.0, 0.27 + t * 0.2, 1.0, 0.67);
      }
    }
  }
  const synGeo = new THREE.BufferGeometry();
  synGeo.setAttribute("position", new THREE.Float32BufferAttribute(synPts, 3));
  synGeo.setAttribute("color", new THREE.Float32BufferAttribute(synCols, 3));
  root.add(new THREE.LineSegments(synGeo, new THREE.LineBasicMaterial({
    vertexColors: true, transparent: true, opacity: 0.08
  })));

  // ── CENTRAL ENERGY CORE (between the two cards) ──────────────────────────
  const coreMat = new THREE.MeshPhysicalMaterial({
    color: 0x7f40ff,
    emissive: 0x5020cc,
    emissiveIntensity: 0.7,
    roughness: 0.05,
    metalness: 0.1,
    transparent: true,
    opacity: 0.88,
    clearcoat: 1,
    clearcoatRoughness: 0,
  });
  const core = new THREE.Mesh(new THREE.SphereGeometry(0.22, 32, 32), coreMat);
  core.position.set(0, 0, 0);
  root.add(core);

  // inner glow
  const innerGlow = new THREE.Mesh(
    new THREE.SphereGeometry(0.16, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xc2a4ff, transparent: true, opacity: 0.2 })
  );
  root.add(innerGlow);

  // icosahedron shell around core
  const icoShell = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.42, 1),
    new THREE.MeshBasicMaterial({ color: 0xc2a4ff, wireframe: true, transparent: true, opacity: 0.15 })
  );
  root.add(icoShell);

  // ── SPINE LINE connecting both job nodes ──────────────────────────────────
  const spinePts = [new THREE.Vector3(0, JOBS[0].yPos, 0), new THREE.Vector3(0, JOBS[1].yPos, 0)];
  const spineGeo = new THREE.BufferGeometry().setFromPoints(spinePts);
  root.add(new THREE.Line(spineGeo, new THREE.LineBasicMaterial({
    color: 0x3a1a5e, transparent: true, opacity: 0.6
  })));

  // dashes on spine
  const totalY = JOBS[0].yPos - JOBS[1].yPos;
  for (let s = 0; s < 16; s++) {
    if (s % 2 === 0) {
      const y0 = JOBS[1].yPos + totalY * (s / 16);
      const y1 = JOBS[1].yPos + totalY * ((s + 0.5) / 16);
      const dg = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, y0, 0), new THREE.Vector3(0, y1, 0)
      ]);
      root.add(new THREE.Line(dg, new THREE.LineBasicMaterial({
        color: 0x7f40ff, transparent: true, opacity: 0.35
      })));
    }
  }

  // ── JOB NODES + CARDS ────────────────────────────────────────────────────
  const cardSprites: THREE.Sprite[] = [];
  const jobGroups: THREE.Group[] = [];
  const jobNodeMeshes: THREE.Mesh[] = [];
  const jobRings: THREE.Mesh[][] = [];

  JOBS.forEach((job) => {
    const grp = new THREE.Group();
    grp.position.set(0, job.yPos, 0);
    root.add(grp);
    jobGroups.push(grp);

    // node sphere
    const nm = new THREE.MeshPhysicalMaterial({
      color: job.color,
      emissive: job.color,
      emissiveIntensity: 1.0,
      roughness: 0.05,
      metalness: 0.2,
      transparent: true,
      opacity: 0.95,
      clearcoat: 1,
    });
    const nodeSphere = new THREE.Mesh(new THREE.SphereGeometry(0.28, 32, 32), nm);
    grp.add(nodeSphere);
    jobNodeMeshes.push(nodeSphere);

    // glow halo
    grp.add(new THREE.Mesh(
      new THREE.SphereGeometry(0.38, 16, 16),
      new THREE.MeshBasicMaterial({ color: job.color, transparent: true, opacity: 0.08, side: THREE.BackSide })
    ));

    // orbiting rings
    const rings: THREE.Mesh[] = [];
    [
      { r: 0.55, tube: 0.012, op: 0.45, tiltX: Math.PI / 3, tiltZ: 0 },
      { r: 0.75, tube: 0.008, op: 0.25, tiltX: Math.PI / 5, tiltZ: Math.PI / 4 },
      { r: 0.95, tube: 0.005, op: 0.12, tiltX: Math.PI / 2.2, tiltZ: Math.PI / 6 },
    ].forEach(({ r, tube, op, tiltX, tiltZ }) => {
      const rm = new THREE.Mesh(
        new THREE.TorusGeometry(r, tube, 8, 80),
        new THREE.MeshBasicMaterial({ color: job.color, transparent: true, opacity: op })
      );
      rm.rotation.x = tiltX;
      rm.rotation.z = tiltZ;
      grp.add(rm);
      rings.push(rm);
    });
    jobRings.push(rings);

    // connector line: node → card
    const cardX = job.yPos > 0 ? -3.0 : 3.0; // top card left, bottom card right
    grp.add(new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(job.yPos > 0 ? -0.32 : 0.32, 0, 0),
        new THREE.Vector3(cardX * 0.5, 0, 0),
      ]),
      new THREE.LineBasicMaterial({ color: job.color, transparent: true, opacity: 0.6 })
    ));

    // card sprite — left for top job, right for bottom job
    const card = makeCard(job);
    card.position.set(cardX, 0, 0);
    grp.add(card);
    cardSprites.push(card);

    // orbital small dots
    for (let od = 0; od < 6; od++) {
      const angle = (od / 6) * Math.PI * 2;
      const orb = new THREE.Mesh(
        new THREE.SphereGeometry(0.03 + Math.random() * 0.02, 6, 6),
        new THREE.MeshBasicMaterial({ color: job.color, transparent: true, opacity: 0.5 + Math.random() * 0.3 })
      );
      orb.position.set(Math.cos(angle) * 0.7, Math.sin(angle) * 0.2, Math.sin(angle) * 0.7);
      grp.add(orb);
    }

    // data stream dots (connection to core)
    for (let ds = 0; ds < 5; ds++) {
      const t2 = ds / 5;
      const sy = job.yPos * (1 - t2);
      const streamDot = new THREE.Mesh(
        new THREE.SphereGeometry(0.025, 6, 6),
        new THREE.MeshBasicMaterial({ color: job.color, transparent: true, opacity: 0.4 - t2 * 0.3 })
      );
      streamDot.position.set(0, sy - job.yPos, 0);
      grp.add(streamDot);
    }
  });

  // ── DUST PARTICLES ───────────────────────────────────────────────────────
  const dustCount = 200;
  const dp = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i++) {
    dp[i * 3]     = (Math.random() - 0.5) * 16;
    dp[i * 3 + 1] = (Math.random() - 0.5) * 12;
    dp[i * 3 + 2] = (Math.random() - 0.5) * 8;
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute("position", new THREE.BufferAttribute(dp, 3));
  scene.add(new THREE.Points(dustGeo, new THREE.PointsMaterial({
    size: 0.018, color: 0xc2a4ff, transparent: true, opacity: 0.35
  })));

  // ── MOUSE ────────────────────────────────────────────────────────────────
  let mx = 0, my = 0;
  const onMouse = (e: MouseEvent) => {
    const rect = mount.getBoundingClientRect();
    mx = ((e.clientX - rect.left) / W - 0.5) * 2;
    my = -((e.clientY - rect.top) / H - 0.5) * 2;
  };
  mount.addEventListener("mousemove", onMouse);

  // ── ANIMATE ──────────────────────────────────────────────────────────────
  let animId: number;
  const timer = new THREE.Timer();
  const phases = JOBS.map((_, i) => i * Math.PI);

  // data stream travel
  const streamSpeed = [0, 0];

  const animate = () => {
    animId = requestAnimationFrame(animate);
    timer.update();
    const t = timer.getElapsed();

    // slow mouse tilt
    root.rotation.y += (mx * 0.18 - root.rotation.y) * 0.035;
    root.rotation.x += (my * 0.08 - root.rotation.x) * 0.035;

    // core pulse
    const cp = 1 + Math.sin(t * 1.4) * 0.06;
    core.scale.setScalar(cp);
    innerGlow.scale.setScalar(cp * 1.1);
    coreMat.emissiveIntensity = 0.5 + Math.sin(t * 1.6) * 0.35;
    icoShell.rotation.x = t * 0.12;
    icoShell.rotation.y = t * 0.18;

    // job nodes
    jobGroups.forEach((grp, i) => {
      const pulse = 1 + Math.sin(t * 1.8 + phases[i]) * 0.07;
      jobNodeMeshes[i].scale.setScalar(pulse);
      const nm = jobNodeMeshes[i].material as THREE.MeshPhysicalMaterial;
      nm.emissiveIntensity = 0.7 + Math.sin(t * 2.2 + phases[i]) * 0.5;

      // ring spin
      jobRings[i][0].rotation.z = t * (0.5 + i * 0.15);
      jobRings[i][0].rotation.y = t * 0.2;
      jobRings[i][1].rotation.z = -t * (0.38 + i * 0.1);
      jobRings[i][1].rotation.x = Math.PI / 5 + t * 0.08;
      jobRings[i][2].rotation.y = t * 0.25;
      jobRings[i][2].rotation.z = t * 0.12;

      // data stream dots travel toward core
      streamSpeed[i] = (streamSpeed[i] + 0.012) % 1;
      const streamChildren = grp.children.slice(-5);
      streamChildren.forEach((child, si) => {
        if (child instanceof THREE.Mesh) {
          const frac = ((si / 5) + streamSpeed[i]) % 1;
          const sy = JOBS[i].yPos * (1 - frac) - JOBS[i].yPos;
          child.position.y = sy;
          (child.material as THREE.MeshBasicMaterial).opacity = 0.5 * (1 - frac);
        }
      });
    });

    // cards face camera
    cardSprites.forEach(s => s.lookAt(camera.position));

    pL1.intensity = 20 + Math.sin(t * 1.2) * 6;
    pL2.intensity = 16 + Math.cos(t * 1.0) * 5;

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
