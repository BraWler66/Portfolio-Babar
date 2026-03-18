"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { HDRLoader } from "three/examples/jsm/loaders/HDRLoader.js";

export default function Developer3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = mount.clientWidth || 700;
    const H = mount.clientHeight || 900;

    // ── Renderer (matches original exactly) ──────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(W, H);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    // ── Scene ─────────────────────────────────────────────────────
    const scene = new THREE.Scene();

    // ── Camera ────────────────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(30, W / H, 0.1, 1000);
    camera.position.set(0, 1, 20);
    camera.updateProjectionMatrix();

    // ── Lighting (matches original lighting.ts) ───────────────────
    const dirLight = new THREE.DirectionalLight(0xc7a9ff, 1);
    dirLight.position.set(-0.47, -0.32, -1);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 50;
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0xc2a4ff, 0, 100, 3);
    pointLight.position.set(3, 12, 4);
    pointLight.castShadow = true;
    scene.add(pointLight);

    // ── HDR Environment ───────────────────────────────────────────
    const pmrem = new THREE.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();
    let envMap: THREE.Texture | null = null;
    new HDRLoader().load("/char_enviorment.hdr", (hdrTexture) => {
      envMap = pmrem.fromEquirectangular(hdrTexture).texture;
      scene.environment = envMap;
      scene.environmentIntensity = 0.64;
      hdrTexture.dispose();
      // do NOT dispose pmrem yet — materials still need it during rendering
    });

    // ── Load GLB ─────────────────────────────────────────────────
    let mixer: THREE.AnimationMixer | null = null;
    let headBone: THREE.Object3D | null = null;
    let modelRoot: THREE.Group | null = null;

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/");

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      "/character.glb",
      (gltf) => {
        const model = gltf.scene;
        modelRoot = model;

        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.frustumCulled = true;
          }
          const n = child.name.toLowerCase();
          if (n === "spine006" || n.includes("head")) headBone = child;
        });

        // Auto-fit: compute bounding box, center & scale model, then reframe camera
        const box = new THREE.Box3().setFromObject(model);
        const size = new THREE.Vector3();
        const center = new THREE.Vector3();
        box.getSize(size);
        box.getCenter(center);

        // Center model at origin
        model.position.sub(center);
        // Sit on ground
        model.position.y += size.y / 2;

        scene.add(model);

        // Fit camera to show full character centered
        const maxDim = Math.max(size.x, size.y, size.z);
        const fovRad = (camera.fov * Math.PI) / 180;
        const dist = (maxDim / 2) / Math.tan(fovRad / 2) * 1.3;
        // Center vertically on the whole model
        const lookAtY = size.y * 0.5;
        camera.position.set(0, lookAtY, dist);
        camera.lookAt(0, lookAtY, 0);
        camera.updateProjectionMatrix();

        if (gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(model);
          // Play typing/key animations if present, otherwise first clip
          const typingClip = gltf.animations.find(a => a.name.toLowerCase().includes("typ") || a.name.toLowerCase().includes("key"));
          mixer.clipAction(typingClip || gltf.animations[0]).play();
        }

        dracoLoader.dispose();
      },
      undefined,
      (err) => console.error("GLB load error:", err)
    );

    // ── Mouse tracking ────────────────────────────────────────────
    let mouse = { x: 0, y: 0 };
    const onMouse = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouse);

    // ── Animate ───────────────────────────────────────────────────
    const timer = new THREE.Timer();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      timer.update();
      const delta = timer.getDelta();

      if (mixer) mixer.update(delta);

      // Head follows mouse (matches original mouseUtils lerp)
      if (headBone) {
        headBone.rotation.y += (mouse.x * 0.35 - headBone.rotation.y) * 0.1;
        headBone.rotation.x += (-mouse.y * 0.15 - headBone.rotation.x) * 0.1;
      }

      renderer.render(scene, camera);
    };
    animate();

    // ── Resize ────────────────────────────────────────────────────
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
      if (envMap) envMap.dispose();
      pmrem.dispose();
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
