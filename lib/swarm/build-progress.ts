/**
 * 3D "build-up" support for the swarm rebuild effect.
 *
 * The swarm sets a 0..1 progress value on a <canvas>. Each three.js scene
 * calls `attachBuild(renderer, scene)` once and then `build()` every frame,
 * just before `renderer.render`. While progress < 1 the scene is assembled
 * piece by piece, from the centre outwards: every object fades in with a
 * stagger, and solid meshes pass through a wireframe stage first. Once
 * progress reaches 1 every material is restored exactly as the scene made it.
 *
 * A canvas that nobody has set a progress for is simply "fully built", so the
 * hook costs one WeakMap lookup per frame when the effect is not running.
 */
import * as THREE from "three";

const progress = new WeakMap<Element, number>();

export function setBuildProgress(canvas: Element, p: number) {
  if (p >= 1) progress.delete(canvas);
  else progress.set(canvas, Math.max(0, p));
}

export function clearBuildProgress(canvas: Element) {
  progress.delete(canvas);
}

export function getBuildProgress(canvas: Element): number {
  const p = progress.get(canvas);
  return p === undefined ? 1 : p;
}

interface MatState {
  mat: THREE.Material;
  opacity: number;
  transparent: boolean;
  depthWrite: boolean;
  wireframe: boolean | undefined;
}

interface Rec {
  obj: THREE.Object3D;
  baseVisible: boolean;
  isMesh: boolean;
  mats: MatState[];
  /** progress at which this object starts appearing (0..~0.55) */
  start: number;
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/** How much of the 0..1 range one object takes to fade in. */
const SPAN = 0.42;
/** Local progress below which a solid mesh is drawn as wireframe. */
const WIRE_UNTIL = 0.65;

function collect(scene: THREE.Scene): Rec[] {
  scene.updateMatrixWorld(true);
  const box = new THREE.Box3();
  const centre = new THREE.Vector3();
  const size = new THREE.Vector3();
  const raw: { rec: Rec; key: number }[] = [];
  let maxKey = 1e-6;

  scene.traverse((o) => {
    const any = o as THREE.Object3D & {
      isMesh?: boolean;
      isPoints?: boolean;
      isLine?: boolean;
      isSprite?: boolean;
      material?: THREE.Material | THREE.Material[];
    };
    if (!(any.isMesh || any.isPoints || any.isLine || any.isSprite) || !any.material) return;
    const materials = Array.isArray(any.material) ? any.material : [any.material];
    const mats: MatState[] = materials.map((mat) => {
      const m = mat as THREE.Material & { wireframe?: boolean };
      return {
        mat,
        opacity: mat.opacity,
        transparent: mat.transparent,
        depthWrite: mat.depthWrite,
        wireframe: "wireframe" in m ? m.wireframe : undefined,
      };
    });
    box.setFromObject(o);
    let key = 0;
    if (!box.isEmpty()) {
      box.getCenter(centre);
      box.getSize(size);
      key = centre.length() + 0.35 * size.length();
    }
    maxKey = Math.max(maxKey, key);
    raw.push({
      rec: { obj: o, baseVisible: o.visible, isMesh: !!any.isMesh, mats, start: 0 },
      key,
    });
  });

  return raw.map(({ rec, key }) => {
    rec.start = Math.pow(key / maxKey, 0.8) * 0.55;
    return rec;
  });
}

function restore(recs: Rec[]) {
  for (const r of recs) {
    r.obj.visible = r.baseVisible;
    for (const s of r.mats) {
      s.mat.opacity = s.opacity;
      s.mat.transparent = s.transparent;
      s.mat.depthWrite = s.depthWrite;
      if (s.wireframe !== undefined) (s.mat as THREE.Material & { wireframe: boolean }).wireframe = s.wireframe;
    }
  }
}

/**
 * Returns an `update` function to call once per frame, before rendering.
 */
export function attachBuild(renderer: THREE.WebGLRenderer, scene: THREE.Scene): () => void {
  const canvas = renderer.domElement;
  let recs: Rec[] | null = null;

  return function update() {
    const p = getBuildProgress(canvas);
    if (p >= 1) {
      if (recs) {
        restore(recs);
        recs = null;
      }
      return;
    }
    if (!recs) recs = collect(scene);

    for (const r of recs) {
      const t = clamp01((p - r.start) / SPAN);
      if (t <= 0) {
        r.obj.visible = false;
        continue;
      }
      r.obj.visible = r.baseVisible;
      const e = easeOutCubic(t);
      for (const s of r.mats) {
        s.mat.transparent = true;
        s.mat.depthWrite = t >= 1 ? s.depthWrite : false;
        s.mat.opacity = s.opacity * e;
        if (r.isMesh && s.wireframe === false) {
          (s.mat as THREE.Material & { wireframe: boolean }).wireframe = t < WIRE_UNTIL;
        }
      }
    }
  };
}
