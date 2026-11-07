/**
 * Swarm rebuild — an in-page "watch the site build itself" effect.
 *
 * How it works
 * ------------
 * 1. The page is covered, scrolled top to bottom once (so lazy sections mount
 *    and scroll reveals fire), and scrolled back.
 * 2. The live DOM is walked and every piece that paints something (boxes,
 *    text, images, SVGs, 3D canvases) becomes a task. Each task's element is
 *    hidden with `data-swarm-hide`, so the *real* page is what gets rebuilt —
 *    nothing is cloned, nothing is approximated.
 * 3. A crew of multiplayer-style cursors picks tasks top-down, drags out a
 *    selection box with a size badge, then reveals the element: boxes grow out
 *    of the selection, text is typed line by line behind an I-beam, media is
 *    wiped in, and 3D canvases are assembled piece by piece (see
 *    build-progress.ts) while other cursors gather around to help.
 * 4. The page scrolls itself to follow the work. "Go live" hands control back.
 *
 * Everything the engine adds lives in one shadow-DOM host on <html>, so the
 * site's CSS can't touch it and React never sees it.
 */
import { clearBuildProgress, setBuildProgress } from "./build-progress";

// ───────────────────────────────────────────────────────────── constants

const NAMES = [
  "Ada", "Linus", "Grace", "Alan", "Margaret", "Ken", "Barbara", "Dennis", "Radia", "Guido",
  "Frances", "Bjarne", "Hedy", "Tim", "Katherine", "Edsger", "Joan", "Donald", "Sophie", "Niklaus",
];
const COLORS = [
  "#c2a4ff", "#fb8dff", "#0d99ff", "#14ae5c", "#ffc700", "#ff8a00",
  "#f24822", "#00b5ce", "#e8467c", "#9747ff", "#0acf83", "#7f9cff",
];
const AGENTS = 18;
const MAX_ASSIST = 4;
const BG = "#0b080c";
const HIDE_ATTR = "data-swarm-hide";
const TASK_ATTR = "data-swarm-task";
const IGNORE_ATTR = "data-swarm-ignore";
const SKIP_TAGS = new Set([
  "SCRIPT", "STYLE", "LINK", "META", "NOSCRIPT", "TEMPLATE", "HEAD", "TITLE", "BR", "WBR", "DEFS",
]);
const REPLACED = new Set(["IMG", "VIDEO", "PICTURE", "IFRAME", "OBJECT", "EMBED"]);
const FORM_TAGS = new Set(["INPUT", "TEXTAREA", "SELECT"]);

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const nextFrame = () => new Promise<void>((r) => requestAnimationFrame(() => r()));
const px = (n: number) => `${Math.round(n * 10) / 10}px`;

// ───────────────────────────────────────────────────────────── types

type Kind = "box" | "text" | "media" | "canvas" | "ambient" | "quick";

interface Task {
  id: number;
  el: HTMLElement;
  kind: Kind;
  order: number;
  docTop: number;
  w: number;
  h: number;
  fixed: boolean;
  /** off to the side / clipped: revealed without a cursor */
  instant: boolean;
  parent: Task | null;
  state: "wait" | "busy" | "done";
  prevClip: string;
  clipTouched: boolean;
  startedAt: number;
}

interface Pt {
  x: number;
  y: number;
}
interface Line {
  l: number;
  r: number;
  t: number;
  b: number;
}

type Phase = "idle" | "travel" | "draw" | "build" | "out" | "assist";
type Shape = "arrow" | "cross" | "ibeam";

interface Agent {
  id: number;
  name: string;
  color: string;
  pos: Pt;
  phase: Phase;
  t: number;
  dur: number;
  from: Pt;
  ctrl: Pt;
  task: Task | null;
  shape: Shape;
  cursorEl: HTMLDivElement;
  boxEl: HTMLDivElement;
  badgeEl: HTMLDivElement;
  shapeBox: SVGSVGElement;
  shapeNow: Shape | "";
  // build state
  lines: Line[] | null;
  lineOffsets: Line[] | null;
  totalW: number;
  buildDur: number;
  assistFor: Task | null;
  assistT: number;
  assistTarget: Pt;
  idleT: number;
}

// ───────────────────────────────────────────────────────────── styles

const STYLE = `
:host{all:initial}
*{box-sizing:border-box}
.root{position:fixed;inset:0;pointer-events:none;font:500 12px/1 Inter,'Geist',system-ui,-apple-system,'Segoe UI',sans-serif;color:#fff}
.cover{position:absolute;inset:0;background:${BG};opacity:0;transition:opacity .45s ease}
.cover.on{opacity:1}
.cursor{position:absolute;left:0;top:0;will-change:transform;opacity:0;transition:opacity .25s ease}
.cursor.on{opacity:1}
.cursor svg{display:block;overflow:visible;filter:drop-shadow(0 1px 2px rgba(0,0,0,.45))}
.tag{position:absolute;left:14px;top:18px;padding:3px 7px;border-radius:5px;white-space:nowrap;font-size:11px;font-weight:600;color:#0b080c;box-shadow:0 2px 8px rgba(0,0,0,.35)}
.box{position:absolute;left:0;top:0;border:1px solid;opacity:0;will-change:transform,width,height;transition:opacity .18s ease}
.box.on{opacity:1}
.box i{position:absolute;width:7px;height:7px;background:#fff;border:1px solid;margin:-4px 0 0 -4px}
.box i:nth-child(1){left:0;top:0}.box i:nth-child(2){left:100%;top:0}
.box i:nth-child(3){left:0;top:100%}.box i:nth-child(4){left:100%;top:100%}
.badge{position:absolute;left:0;top:0;padding:3px 7px;border-radius:4px;font-size:11px;font-weight:600;color:#fff;white-space:nowrap;opacity:0;transition:opacity .18s ease;will-change:transform}
.badge.on{opacity:1}
.hud{position:absolute;left:50%;bottom:22px;transform:translate(-50%,18px);opacity:0;display:flex;align-items:center;gap:12px;padding:7px 7px 7px 14px;border-radius:14px;background:rgba(17,13,20,.92);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);box-shadow:0 12px 34px rgba(0,0,0,.45),inset 0 0 0 1px rgba(194,164,255,.18);pointer-events:auto;white-space:nowrap;user-select:none;transition:opacity .4s ease,transform .4s cubic-bezier(.2,.8,.2,1)}
.hud.on{opacity:1;transform:translate(-50%,0)}
.dots{display:flex}
.dots i{width:18px;height:18px;border-radius:50%;margin-left:-5px;display:grid;place-items:center;font:700 9px/1 inherit;font-style:normal;color:#0b080c;box-shadow:0 0 0 2px #110d14}
.dots i:first-child{margin-left:0}
.status{min-width:150px;color:#eae5ec}
.status b{color:#c2a4ff}
.bar{width:90px;height:4px;border-radius:2px;background:rgba(194,164,255,.18);overflow:hidden}
.bar u{display:block;height:100%;width:0;background:linear-gradient(90deg,#7f40ff,#fb8dff);transition:width .2s linear}
.hud button{all:unset;cursor:pointer;padding:8px 11px;border-radius:9px;font:600 12px/1 inherit;color:#eae5ec;background:rgba(255,255,255,.06);transition:background .15s}
.hud button:hover{background:rgba(255,255,255,.13)}
.hud button.pri{background:#c2a4ff;color:#0b080c}
.hud button.pri:hover{background:#d4bcff}
.hud button[hidden]{display:none}
.hud .x{padding:8px 10px;color:#9a8fa6}
`;

const ARROW =
  "M4.6 3.9 C4.2 3.1 4.9 2.4 5.7 2.8 L20.6 9.4 C21.5 9.8 21.4 11.1 20.4 11.3 L13.9 12.9 C13.4 13 13 13.4 12.9 13.9 L11.3 20.4 C11.1 21.4 9.8 21.5 9.4 20.6 Z";

const HOT: Record<Shape, Pt> = { arrow: { x: 5, y: 3.5 }, cross: { x: 12, y: 12 }, ibeam: { x: 12, y: 12 } };

function shapeSVG(shape: Shape, c: string): { html: string; hot: Pt } {
  switch (shape) {
    case "cross":
      return {
        hot: { x: 12, y: 12 },
        html: `<g stroke-linecap="round"><path d="M12 5V19M5 12H19" stroke="#fff" stroke-width="3.4"/><path d="M12 5V19M5 12H19" stroke="${c}" stroke-width="1.4"/></g>`,
      };
    case "ibeam":
      return {
        hot: { x: 12, y: 12 },
        html: `<g stroke-linecap="round"><path d="M8.5 4.5H15.5M12 4.5V19.5M8.5 19.5H15.5" stroke="#fff" stroke-width="3.6"/><path d="M8.5 4.5H15.5M12 4.5V19.5M8.5 19.5H15.5" stroke="${c}" stroke-width="1.5"/></g>`,
      };
    default:
      return {
        hot: { x: 5, y: 3.5 },
        html: `<path d="${ARROW}" fill="${c}" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/>`,
      };
  }
}

// ───────────────────────────────────────────────────────────── engine

export interface SwarmHandle {
  stop: () => void;
}

/** The run currently on screen. Replay swaps this for a fresh instance. */
let active: Swarm | null = null;

export function startSwarm(onExit?: () => void): SwarmHandle {
  active = new Swarm(onExit);
  void active.run();
  return { stop: () => active?.exit() };
}

class Swarm {
  private onExit?: () => void;
  private host!: HTMLElement;
  private cover!: HTMLDivElement;
  private cursorsEl!: HTMLDivElement;
  private boxesEl!: HTMLDivElement;
  private hud!: HTMLDivElement;
  private statusEl!: HTMLSpanElement;
  private dotsEl!: HTMLDivElement;
  private barEl!: HTMLElement;
  private btnSpeed!: HTMLButtonElement;
  private btnLive!: HTMLButtonElement;
  private btnReplay!: HTMLButtonElement;
  private hideStyle!: HTMLStyleElement;

  private tasks: Task[] = [];
  private agents: Agent[] = [];
  private canvasList: HTMLCanvasElement[] = [];
  private raf = 0;
  private last = 0;
  private dead = false;
  private running = false;
  private complete = false;
  private speed = 1;
  private doneCount = 0;
  private t0 = 0;
  private scrollV = 0;
  private scrollAcc = 0;
  private startScroll = 0;
  private prevSmooth = "";
  private onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") this.exit();
  };

  constructor(onExit?: () => void) {
    this.onExit = onExit;
  }

  // ─────────────────────────────────────────────────────────── lifecycle

  async run() {
    this.mount();
    this.startScroll = window.scrollY;
    // the html element is `scroll-behavior:smooth`; our own scrolling must be instant
    this.prevSmooth = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";

    await nextFrame();
    this.cover.classList.add("on");
    this.hud.classList.add("on");
    this.setStatus("Scanning page…");
    await sleep(500);
    if (this.dead) return;

    await this.prescroll();
    if (this.dead) return;

    this.scan();
    await nextFrame();
    this.setStatus("Getting the crew ready…");
    this.cover.classList.remove("on");
    await sleep(650);
    if (this.dead) return;

    this.t0 = performance.now();
    this.running = true;
    this.last = performance.now();
    this.raf = requestAnimationFrame((t) => this.frame(t));
  }

  exit(replay = false) {
    if (this.dead) return;
    this.dead = true;
    if (active === this) active = null;
    cancelAnimationFrame(this.raf);
    window.removeEventListener("keydown", this.onKey, true);
    // put every piece back exactly as the site made it
    for (const t of this.tasks) this.finishTask(t, true);
    for (const c of this.canvasList) clearBuildProgress(c);
    this.hideStyle?.remove();
    document.documentElement.style.scrollBehavior = this.prevSmooth;
    if (this.host) {
      this.host.style.transition = "opacity .3s ease";
      this.host.style.opacity = "0";
      setTimeout(() => this.host.remove(), 320);
    }
    if (!replay) this.onExit?.();
  }

  // ─────────────────────────────────────────────────────────── overlay

  private mount() {
    Array.from(document.querySelectorAll("swarm-rebuild")).forEach((old) => old.remove());
    this.host = document.createElement("swarm-rebuild");
    this.host.style.cssText =
      "all:initial !important;position:fixed !important;inset:0 !important;z-index:2147483000 !important;display:block !important;pointer-events:none !important;";
    const root = this.host.attachShadow({ mode: "open" });
    root.innerHTML = `<style>${STYLE}</style>
<div class="root">
  <div class="cover"></div>
  <div class="boxes"></div>
  <div class="cursors"></div>
  <div class="hud">
    <div class="dots"></div>
    <span class="status">Scanning page…</span>
    <div class="bar"><u></u></div>
    <button data-a="speed" title="Build speed">1×</button>
    <button data-a="live" class="pri" hidden>Go live</button>
    <button data-a="replay" hidden>Replay</button>
    <button data-a="close" class="x" title="Exit (Esc)">✕</button>
  </div>
</div>`;
    document.documentElement.appendChild(this.host);

    const q = <T extends Element>(s: string) => root.querySelector(s) as T;
    this.cover = q<HTMLDivElement>(".cover");
    this.boxesEl = q<HTMLDivElement>(".boxes");
    this.cursorsEl = q<HTMLDivElement>(".cursors");
    this.hud = q<HTMLDivElement>(".hud");
    this.statusEl = q<HTMLSpanElement>(".status");
    this.dotsEl = q<HTMLDivElement>(".dots");
    this.barEl = q<HTMLElement>(".bar u");
    this.btnSpeed = q<HTMLButtonElement>('[data-a="speed"]');
    this.btnLive = q<HTMLButtonElement>('[data-a="live"]');
    this.btnReplay = q<HTMLButtonElement>('[data-a="replay"]');

    this.hud.addEventListener("click", (e) => {
      const b = (e.target as HTMLElement).closest("button");
      if (!b) return;
      const a = b.dataset.a;
      if (a === "close" || a === "live") this.exit();
      else if (a === "replay") {
        const onExit = this.onExit;
        this.exit(true);
        window.scrollTo({ top: 0, behavior: "instant" });
        setTimeout(() => {
          active = new Swarm(onExit);
          void active.run();
        }, 380);
      } else if (a === "speed") {
        this.speed = this.speed === 1 ? 2 : this.speed === 2 ? 3 : 1;
        b.textContent = `${this.speed}×`;
      }
    });
    window.addEventListener("keydown", this.onKey, true);

    this.hideStyle = document.createElement("style");
    this.hideStyle.textContent = `[${HIDE_ATTR}]{visibility:hidden !important}`;
    document.head.appendChild(this.hideStyle);
  }

  private setStatus(html: string) {
    this.statusEl.innerHTML = html;
  }

  private makeAgent(i: number): Agent {
    const color = COLORS[i % COLORS.length];
    const name = NAMES[(i * 7 + 3) % NAMES.length];
    const cursorEl = document.createElement("div");
    cursorEl.className = "cursor";
    const shapeBox = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    shapeBox.setAttribute("width", "28");
    shapeBox.setAttribute("height", "28");
    shapeBox.setAttribute("viewBox", "0 0 24 24");
    const tag = document.createElement("div");
    tag.className = "tag";
    tag.style.background = color;
    tag.textContent = name;
    cursorEl.append(shapeBox, tag);

    const boxEl = document.createElement("div");
    boxEl.className = "box";
    boxEl.style.borderColor = color;
    boxEl.style.background = color + "14";
    boxEl.innerHTML = `<i style="border-color:${color}"></i><i style="border-color:${color}"></i><i style="border-color:${color}"></i><i style="border-color:${color}"></i>`;
    const badgeEl = document.createElement("div");
    badgeEl.className = "badge";
    badgeEl.style.background = color;
    badgeEl.style.color = "#0b080c";

    this.boxesEl.append(boxEl, badgeEl);
    this.cursorsEl.append(cursorEl);

    const start = { x: rand(0.2, 0.8) * innerWidth, y: rand(0.15, 0.7) * innerHeight };
    return {
      id: i, name, color, pos: start, phase: "idle", t: 0, dur: 1, from: start, ctrl: start,
      task: null, shape: "arrow", cursorEl, boxEl, badgeEl, shapeBox, shapeNow: "",
      lines: null, lineOffsets: null, totalW: 0, buildDur: 1,
      assistFor: null, assistT: 0, assistTarget: start, idleT: rand(0, 0.6),
    };
  }

  private setShape(a: Agent, s: Shape) {
    if (a.shapeNow === s) return;
    a.shapeNow = s;
    a.shape = s;
    a.shapeBox.innerHTML = shapeSVG(s, a.color).html;
  }

  private placeCursor(a: Agent) {
    const hot = HOT[a.shape];
    const sc = 28 / 24;
    a.cursorEl.style.transform = `translate(${px(a.pos.x - hot.x * sc)},${px(a.pos.y - hot.y * sc)})`;
  }

  // ─────────────────────────────────────────────────────────── scanning

  /** Scroll the whole page once under the cover so lazy content mounts and reveals fire. */
  private async prescroll() {
    const vh = innerHeight;
    const H = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
    const step = vh * 0.75;
    for (let y = step; y < H + step && !this.dead; y += step) {
      window.scrollTo({ top: y, behavior: "instant" });
      await nextFrame();
      await sleep(110);
    }
    window.scrollTo({ top: 0, behavior: "instant" });
    await nextFrame();
    // let framer-motion finish its fades before measuring opacity
    await sleep(1600);
    window.scrollTo({ top: 0, behavior: "instant" });
    await nextFrame();
  }

  private scan() {
    const vw = innerWidth;
    const sy = window.scrollY;
    let order = 0;
    let id = 0;

    const addTask = (el: HTMLElement, kind: Kind, r: DOMRect, fixed: boolean, parent: Task | null): Task => {
      const offX = r.right < 0 || r.left > vw;
      const micro = r.width * r.height < 40 && kind !== "canvas";
      const t: Task = {
        id: id++, el, kind, order: order++,
        docTop: fixed ? r.top : r.top + sy,
        w: r.width, h: r.height, fixed,
        instant: offX || micro,
        parent, state: "wait", prevClip: el.style.clipPath, clipTouched: false, startedAt: 0,
      };
      el.setAttribute(TASK_ATTR, String(t.id));
      this.tasks.push(t);
      return t;
    };

    const walk = (node: Element, fixed: boolean, inText: boolean, parent: Task | null) => {
      if (!(node instanceof HTMLElement) && !(node instanceof SVGElement)) return;
      if (SKIP_TAGS.has(node.tagName.toUpperCase())) return;
      if (node.hasAttribute(IGNORE_ATTR)) return;
      const cs = getComputedStyle(node);
      if (cs.display === "none") return;
      if (parseFloat(cs.opacity) < 0.03) return;
      const isFixed = fixed || cs.position === "fixed";
      const r = node.getBoundingClientRect();
      const sized = r.width >= 1 && r.height >= 1;
      const visible = cs.visibility === "visible";
      const tag = node.tagName.toUpperCase();

      // ── SVG / replaced / canvas / form controls: leaf items ──
      if (node instanceof SVGElement) {
        if (node.ownerSVGElement) return; // part of an outer <svg>
        if (sized && visible && node instanceof SVGSVGElement) addTask(node as unknown as HTMLElement, "media", r, isFixed, parent);
        return;
      }
      const html = node as HTMLElement;
      if (tag === "CANVAS") {
        if (!sized || !visible) return;
        const cv = html as HTMLCanvasElement;
        const ambient = isFixed && r.width >= innerWidth * 0.9 && r.height >= innerHeight * 0.9;
        const t = addTask(html, ambient ? "ambient" : "canvas", r, isFixed, parent);
        if (ambient) t.instant = true;
        this.canvasList.push(cv);
        return;
      }
      if (REPLACED.has(tag) || FORM_TAGS.has(tag)) {
        if (sized && visible) addTask(html, REPLACED.has(tag) ? "media" : "box", r, isFixed, parent);
        return;
      }

      // ── own paint? own text? ──
      let myTask: Task | null = null;
      if (sized && visible && !inText) {
        const hasText = Array.from(html.childNodes).some((n) => n.nodeType === 3 && (n.nodeValue || "").trim().length > 0);
        const bgA = alphaOf(cs.backgroundColor);
        const border =
          (parseFloat(cs.borderTopWidth) > 0 && cs.borderTopStyle !== "none" && alphaOf(cs.borderTopColor) > 0.02) ||
          (parseFloat(cs.borderBottomWidth) > 0 && cs.borderBottomStyle !== "none" && alphaOf(cs.borderBottomColor) > 0.02) ||
          (parseFloat(cs.borderLeftWidth) > 0 && cs.borderLeftStyle !== "none" && alphaOf(cs.borderLeftColor) > 0.02) ||
          (parseFloat(cs.borderRightWidth) > 0 && cs.borderRightStyle !== "none" && alphaOf(cs.borderRightColor) > 0.02);
        const paint =
          bgA > 0.02 || cs.backgroundImage !== "none" || border || (cs.boxShadow !== "none" && cs.boxShadow !== "");
        const isRoot = html === document.body || html === document.documentElement;
        if (hasText) {
          myTask = addTask(html, "text", r, isFixed, parent);
        } else if (paint && !isRoot) {
          const big = r.height > innerHeight * 1.6 || r.width > vw * 1.3;
          myTask = addTask(html, big ? "quick" : "box", r, isFixed, parent);
        }
      }

      // ── children ──
      const nextParent = myTask || parent;
      const textOwner = myTask?.kind === "text" || inText;
      for (const child of Array.from(html.children)) {
        if (textOwner && isInlineNonReplaced(child)) {
          // inline run inside a text item: part of the same typed text, no own task
          walkInline(child, isFixed, nextParent);
        } else {
          walk(child, isFixed, false, nextParent);
        }
      }
    };

    /** Inline children are covered by their text parent, but replaced / block descendants still get tasks. */
    const walkInline = (node: Element, fixed: boolean, parent: Task | null) => {
      if (node.hasAttribute(IGNORE_ATTR)) return;
      for (const child of Array.from(node.children)) {
        if (isInlineNonReplaced(child)) walkInline(child, fixed, parent);
        else walk(child, fixed, false, parent);
      }
    };

    // pointer-events:none fixed blobs like the custom cursor are ignored via data-swarm-ignore
    for (const child of Array.from(document.body.children)) walk(child, false, false, null);

    this.tasks.sort((a, b) => a.docTop - b.docTop || a.order - b.order);

    // Hide everything in one go so the page never flashes between scan and start.
    for (const t of this.tasks) t.el.setAttribute(HIDE_ATTR, "");
    for (const c of this.canvasList) setBuildProgress(c, 0);

    this.agents = Array.from({ length: AGENTS }, (_, i) => this.makeAgent(i));
    for (const a of this.agents) {
      this.setShape(a, "arrow");
      this.placeCursor(a);
      a.cursorEl.classList.add("on");
    }
    this.dotsEl.innerHTML = this.agents
      .slice(0, 5)
      .map((a) => `<i style="background:${a.color}" title="${a.name}">${a.name[0]}</i>`)
      .join("");
    this.updateHud();
  }

  // ─────────────────────────────────────────────────────────── main loop

  private frame(now: number) {
    if (this.dead) return;
    const dt = Math.min(0.05, (now - this.last) / 1000);
    this.last = now;
    try {
      this.step(dt, now);
    } catch (err) {
      console.error("[swarm]", err);
    }
    this.raf = requestAnimationFrame((t) => this.frame(t));
  }

  private inWindow(t: Task, sy: number, vh: number) {
    return t.fixed || (t.docTop < sy + vh + 120 && t.docTop + t.h > sy - 80);
  }

  private eligible(t: Task, sy: number, vh: number) {
    if (t.state !== "wait") return false;
    if (t.parent && t.parent.state === "wait") return false;
    return this.inWindow(t, sy, vh);
  }

  private step(dt: number, now: number) {
    const sy = window.scrollY;
    const vh = innerHeight;
    const sp = this.speed;

    // ambient / instant tasks need no cursor
    let n = 0;
    for (const t of this.tasks) {
      if (n > 40) break;
      if (!(t.instant || t.kind === "ambient")) continue;
      if (!this.eligible(t, sy, vh)) continue;
      t.state = "busy";
      this.revealInstant(t);
      n++;
    }

    // assign work to idle agents (top-most tasks first, nearest cursor wins)
    const cands: Task[] = [];
    for (const t of this.tasks) {
      if (t.instant || t.kind === "ambient") continue;
      if (this.eligible(t, sy, vh)) {
        cands.push(t);
        if (cands.length >= 14) break;
      }
    }
    let busy = 0;
    for (const a of this.agents) {
      if (a.phase !== "idle" && a.phase !== "assist") busy++;
    }
    for (const a of this.agents) {
      if (a.phase !== "idle" || !cands.length) continue;
      a.idleT -= dt;
      if (a.idleT > 0) continue;
      let best = -1;
      let bestScore = Infinity;
      for (let i = 0; i < cands.length; i++) {
        const t = cands[i];
        if (t.state !== "wait") continue;
        const r = this.liveRect(t);
        const s = Math.hypot(r.left - a.pos.x, r.top - a.pos.y) + i * 55;
        if (s < bestScore) {
          bestScore = s;
          best = i;
        }
      }
      if (best < 0) continue;
      const t = cands[best];
      this.assign(a, t);
      busy++;
    }

    // advance every agent
    for (const a of this.agents) this.stepAgent(a, dt * sp, now);

    // follow the work: scroll when nothing is left to do in view
    this.autoScroll(dt, sy, vh, busy);

    // idle wander + render
    for (const a of this.agents) {
      if (a.phase === "idle") this.wander(a, dt);
      this.placeCursor(a);
    }

    // completion
    if (!this.complete && this.doneCount >= this.tasks.length) this.onComplete();
    else if (!this.complete && this.agents.every((a) => a.phase === "idle" || a.phase === "assist")) {
      // safety net: anything stuck behind a parent that never started
      const stuck = this.tasks.find((t) => t.state === "wait" && !this.parentBlocked(t));
      if (!stuck && this.tasks.some((t) => t.state === "wait")) {
        for (const t of this.tasks) if (t.state === "wait") t.parent = null;
      }
    }
    if (((now / 200) | 0) !== (((now - dt * 1000) / 200) | 0)) this.updateHud();
  }

  private parentBlocked(t: Task) {
    return !!(t.parent && t.parent.state === "wait");
  }

  private autoScroll(dt: number, sy: number, vh: number, busy: number) {
    if (this.complete) return;
    let inView = false;
    let firstWait: Task | null = null;
    for (const t of this.tasks) {
      if (t.state !== "wait" || t.fixed) continue;
      if (!firstWait) firstWait = t;
      if (this.eligible(t, sy, vh) && !t.instant) {
        inView = true;
        break;
      }
    }
    const maxY = Math.max(0, document.documentElement.scrollHeight - vh);
    let target = sy;
    let wants = false;
    if (!inView && firstWait && busy <= 3) {
      target = clamp(firstWait.docTop - vh * 0.22, 0, maxY);
      wants = true;
    }
    const desired = wants ? clamp((target - sy) * 2.4, -1800, 1800) : 0;
    this.scrollV += (desired - this.scrollV) * Math.min(1, dt * 5);
    this.scrollAcc += this.scrollV * dt;
    if (Math.abs(this.scrollAcc) >= 1) {
      const d = Math.trunc(this.scrollAcc);
      this.scrollAcc -= d;
      window.scrollBy({ top: d, behavior: "instant" });
    }
  }

  // ─────────────────────────────────────────────────────────── agents

  private liveRect(t: Task): DOMRect {
    return t.el.getBoundingClientRect();
  }

  private assign(a: Agent, t: Task) {
    t.state = "busy";
    t.startedAt = performance.now();
    a.task = t;
    a.phase = "travel";
    a.t = 0;
    a.from = { ...a.pos };
    const r = this.liveRect(t);
    const target = this.cornerTL(r);
    const dist = Math.hypot(target.x - a.pos.x, target.y - a.pos.y);
    a.dur = clamp(0.1 + dist / 2600, 0.12, 0.5);
    const mid = { x: (a.pos.x + target.x) / 2, y: (a.pos.y + target.y) / 2 };
    const bend = rand(-0.18, 0.18) * dist;
    const nx = -(target.y - a.pos.y) / (dist || 1);
    const ny = (target.x - a.pos.x) / (dist || 1);
    a.ctrl = { x: mid.x + nx * bend, y: mid.y + ny * bend };
    this.setShape(a, "arrow");
  }

  private cornerTL(r: DOMRect): Pt {
    return { x: clamp(r.left, 6, innerWidth - 6), y: clamp(r.top, 6, innerHeight - 6) };
  }
  private cornerBR(r: DOMRect): Pt {
    return { x: clamp(r.right, 6, innerWidth - 6), y: clamp(r.bottom, 6, innerHeight - 6) };
  }

  private stepAgent(a: Agent, dt: number, now: number) {
    const t = a.task;
    switch (a.phase) {
      case "travel": {
        if (!t) {
          a.phase = "idle";
          break;
        }
        a.t += dt / a.dur;
        const e = easeInOut(clamp(a.t, 0, 1));
        const to = this.cornerTL(this.liveRect(t));
        const u = 1 - e;
        a.pos = {
          x: u * u * a.from.x + 2 * u * e * a.ctrl.x + e * e * to.x,
          y: u * u * a.from.y + 2 * u * e * a.ctrl.y + e * e * to.y,
        };
        if (a.t >= 1) this.beginDraw(a, t);
        break;
      }
      case "draw": {
        if (!t) break;
        a.t += dt / a.dur;
        const r = this.liveRect(t);
        const tl = this.cornerTL(r);
        const br = this.cornerBR(r);
        const e = easeOut(clamp(a.t, 0, 1));
        a.pos = { x: tl.x + (br.x - tl.x) * e, y: tl.y + (br.y - tl.y) * e };
        this.drawBox(a, tl, a.pos, r, e);
        if (a.t >= 1) this.beginBuild(a, t);
        break;
      }
      case "build": {
        if (!t) break;
        a.t += dt / a.buildDur;
        const p = clamp(a.t, 0, 1);
        this.applyBuild(a, t, p);
        if (a.t >= 1) this.endBuild(a, t);
        break;
      }
      case "out": {
        a.t += dt / 0.2;
        if (a.t >= 1) {
          a.boxEl.classList.remove("on");
          a.badgeEl.classList.remove("on");
          a.phase = "idle";
          a.idleT = rand(0, 0.12) / this.speed;
          this.setShape(a, "arrow");
        }
        break;
      }
      case "assist": {
        a.assistT -= dt;
        const f = a.assistFor;
        if (!f || f.state === "done") {
          a.phase = "idle";
          a.assistFor = null;
          a.idleT = rand(0, 0.3);
          this.setShape(a, "arrow");
          break;
        }
        // glide toward a point inside the 3D canvas, picking a new one every so often
        a.pos = {
          x: a.pos.x + (a.assistTarget.x - a.pos.x) * Math.min(1, dt * 5),
          y: a.pos.y + (a.assistTarget.y - a.pos.y) * Math.min(1, dt * 5),
        };
        if (a.assistT <= 0) {
          const r = this.liveRect(f);
          a.assistT = rand(0.35, 0.8);
          a.assistTarget = {
            x: clamp(r.left + rand(0.1, 0.9) * r.width, 10, innerWidth - 10),
            y: clamp(r.top + rand(0.1, 0.9) * r.height, 10, innerHeight - 10),
          };
        }
        break;
      }
      default:
        break;
    }
    void now;
  }

  private beginDraw(a: Agent, t: Task) {
    a.phase = "draw";
    a.t = 0;
    const r = this.liveRect(t);
    const small = r.width * r.height < 2600;
    if (t.kind === "quick" || small) {
      // not worth a drawn selection: go straight to building
      this.beginBuild(a, t);
      return;
    }
    a.dur = clamp(0.12 + (r.width + r.height) / 3400, 0.14, 0.45);
    this.setShape(a, "cross");
    a.boxEl.classList.add("on");
    a.badgeEl.classList.add("on");
  }

  private drawBox(a: Agent, tl: Pt, cur: Pt, r: DOMRect, e: number) {
    const w = Math.max(1, cur.x - tl.x);
    const h = Math.max(1, cur.y - tl.y);
    a.boxEl.style.transform = `translate(${px(tl.x)},${px(tl.y)})`;
    a.boxEl.style.width = px(w);
    a.boxEl.style.height = px(h);
    const rw = Math.round(r.width * e);
    const rh = Math.round(r.height * e);
    a.badgeEl.textContent = `${rw} × ${rh}`;
    a.badgeEl.style.transform = `translate(${px(cur.x - 20)},${px(cur.y + 12)})`;
  }

  private beginBuild(a: Agent, t: Task) {
    a.phase = "build";
    a.t = 0;
    const r = this.liveRect(t);
    const sp = this.speed;
    this.setShape(a, "arrow");
    const el = t.el;
    el.style.clipPath = this.initialClip(t.kind);
    t.clipTouched = true;
    el.removeAttribute(HIDE_ATTR);

    if (t.kind === "text") {
      const lines = lineBands(el);
      const base = el.getBoundingClientRect();
      a.lines = lines;
      a.lineOffsets = lines.map((l) => ({ l: l.l - base.left, r: l.r - base.left, t: l.t - base.top, b: l.b - base.top }));
      a.totalW = lines.reduce((s, l) => s + (l.r - l.l), 0) || 1;
      const chars = (el.textContent || "").trim().length;
      a.buildDur = clamp(chars / 150, 0.2, 1.5);
      this.setShape(a, "ibeam");
    } else if (t.kind === "canvas") {
      a.buildDur = 3.4;
      this.setShape(a, "arrow");
      this.recruit(a, t);
    } else if (t.kind === "media") {
      a.buildDur = clamp(0.2 + r.height / 1800, 0.22, 0.6);
    } else if (t.kind === "quick") {
      a.buildDur = 0.55;
    } else {
      a.buildDur = clamp(0.16 + (r.width + r.height) / 4200, 0.18, 0.4);
    }
    void sp;
  }

  private initialClip(kind: Kind) {
    switch (kind) {
      case "text":
        return "polygon(0 0,0 0,0 0)";
      case "box":
        return "inset(50%)";
      default:
        return "inset(0 0 100% 0)";
    }
  }

  private applyBuild(a: Agent, t: Task, p: number) {
    const el = t.el;
    const e = easeOut(p);
    switch (t.kind) {
      case "text": {
        const lines = a.lines!;
        const offs = a.lineOffsets!;
        const base = el.getBoundingClientRect();
        let remain = p * a.totalW;
        let k = 0;
        while (k < lines.length - 1 && remain > lines[k].r - lines[k].l) {
          remain -= lines[k].r - lines[k].l;
          k++;
        }
        const ln = lines[k];
        const o = offs[k];
        const lw = ln.r - ln.l;
        const x = o.l + Math.min(lw, remain);
        el.style.clipPath = staircase(offs, k, x, base.width, base.height);
        a.pos = { x: base.left + x + 1, y: base.top + (o.t + o.b) / 2 };
        a.pos = { x: clamp(a.pos.x, 4, innerWidth - 4), y: clamp(a.pos.y, 4, innerHeight - 4) };
        break;
      }
      case "box": {
        const k = (1 - e) * 50;
        el.style.clipPath = `inset(${k}% round 2px)`;
        break;
      }
      case "canvas": {
        // the 3D scene assembles itself (build-progress.ts); the element itself is just unclipped
        el.style.clipPath = "";
        setBuildProgress(el, easeInOut(p));
        break;
      }
      default:
        el.style.clipPath = `inset(0 0 ${(1 - e) * 100}% 0)`;
        break;
    }
  }

  private endBuild(a: Agent, t: Task) {
    this.finishTask(t, false);
    a.task = null;
    a.phase = "idle";
    a.idleT = rand(0, 0.08) / this.speed;
    a.boxEl.classList.remove("on");
    a.badgeEl.classList.remove("on");
    this.setShape(a, "arrow");
    a.lines = null;
    a.lineOffsets = null;
  }

  /** Other cursors gather on the canvas while a 3D scene assembles. */
  private recruit(owner: Agent, t: Task) {
    let n = 0;
    const r = this.liveRect(t);
    for (const a of this.agents) {
      if (n >= MAX_ASSIST) break;
      if (a === owner || a.phase !== "idle") continue;
      a.phase = "assist";
      a.assistFor = t;
      a.assistT = rand(0, 0.3);
      a.assistTarget = {
        x: clamp(r.left + rand(0.15, 0.85) * r.width, 10, innerWidth - 10),
        y: clamp(r.top + rand(0.15, 0.85) * r.height, 10, innerHeight - 10),
      };
      this.setShape(a, "cross");
      n++;
    }
  }

  private wander(a: Agent, dt: number) {
    a.pos = {
      x: clamp(a.pos.x + Math.sin(performance.now() / 900 + a.id) * 14 * dt, 8, innerWidth - 8),
      y: clamp(a.pos.y + Math.cos(performance.now() / 1100 + a.id * 2) * 14 * dt, 8, innerHeight - 8),
    };
  }

  // ─────────────────────────────────────────────────────────── reveals

  private revealInstant(t: Task) {
    const el = t.el;
    el.removeAttribute(HIDE_ATTR);
    if (t.kind === "ambient") {
      // fixed full-screen background scene: let it assemble on its own
      const start = performance.now();
      const dur = 3800;
      const tick = () => {
        if (this.dead) return;
        const p = clamp((performance.now() - start) / dur, 0, 1);
        setBuildProgress(el, easeInOut(p));
        if (p < 1) requestAnimationFrame(tick);
        else this.finishTask(t, false);
      };
      tick();
      return;
    }
    if (t.kind === "canvas") setBuildProgress(el, 1);
    this.finishTask(t, false);
  }

  private finishTask(t: Task, silent: boolean) {
    const wasDone = t.state === "done";
    t.el.removeAttribute(HIDE_ATTR);
    t.el.removeAttribute(TASK_ATTR);
    if (t.clipTouched) {
      t.el.style.clipPath = t.prevClip;
      t.clipTouched = false;
    }
    if (t.kind === "canvas" || t.kind === "ambient") clearBuildProgress(t.el);
    if (!wasDone) {
      t.state = "done";
      if (!silent) this.doneCount++;
    }
  }

  // ─────────────────────────────────────────────────────────── hud

  private updateHud() {
    if (this.complete) return;
    const total = this.tasks.length;
    const working = this.agents.filter((a) => a.phase !== "idle").length;
    this.setStatus(
      `<b>${working || this.agents.length}</b> agents · ${this.doneCount.toLocaleString()} / ${total.toLocaleString()} layers`
    );
    this.barEl.style.width = total ? `${(this.doneCount / total) * 100}%` : "0%";
  }

  private onComplete() {
    this.complete = true;
    const secs = ((performance.now() - this.t0) / 1000).toFixed(1);
    this.setStatus(`Rebuilt by <b>${this.agents.length}</b> agents in <b>${secs}s</b>`);
    this.barEl.style.width = "100%";
    this.btnLive.hidden = false;
    this.btnReplay.hidden = false;
    this.btnSpeed.hidden = true;
    // hand the page back at the top, then let the crew disperse
    window.scrollTo({ top: this.startScroll, behavior: "smooth" });
    setTimeout(() => {
      for (const a of this.agents) a.cursorEl.classList.remove("on");
    }, 1200);
  }
}

// ───────────────────────────────────────────────────────────── helpers

function alphaOf(c: string): number {
  if (!c || c === "transparent") return 0;
  const slash = c.match(/\/\s*([\d.]+%?)\s*\)/);
  if (slash) return slash[1].endsWith("%") ? parseFloat(slash[1]) / 100 : parseFloat(slash[1]);
  const m = c.match(/^rgba\(([^)]+)\)/);
  if (m) {
    const p = m[1].split(",");
    return p.length >= 4 ? parseFloat(p[3]) : 1;
  }
  return 1;
}

function isInlineNonReplaced(el: Element): boolean {
  const tag = el.tagName.toUpperCase();
  if (tag === "SVG" || tag === "CANVAS" || REPLACED.has(tag) || FORM_TAGS.has(tag) || tag === "BUTTON") return false;
  if (!(el instanceof HTMLElement)) return false;
  return getComputedStyle(el).display === "inline";
}

/** Merge the client rects of a text item's own text nodes into one band per visual line. */
function lineBands(el: HTMLElement): Line[] {
  const rects: DOMRect[] = [];
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
    acceptNode(n) {
      if (!(n.nodeValue || "").trim()) return NodeFilter.FILTER_REJECT;
      let p = n.parentElement;
      while (p && p !== el) {
        if (p.hasAttribute(TASK_ATTR)) return NodeFilter.FILTER_REJECT;
        p = p.parentElement;
      }
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  const range = document.createRange();
  let n: Node | null;
  while ((n = walker.nextNode())) {
    range.selectNodeContents(n);
    for (const r of Array.from(range.getClientRects())) {
      if (r.width > 0.5 && r.height > 0.5) rects.push(r);
    }
  }
  const b = el.getBoundingClientRect();
  if (!rects.length) return [{ l: b.left, r: b.right, t: b.top, b: b.bottom }];
  rects.sort((p, q) => p.top - q.top || p.left - q.left);
  const lines: Line[] = [];
  for (const r of rects) {
    const last = lines[lines.length - 1];
    const mid = (r.top + r.bottom) / 2;
    if (last && mid > last.t && mid < last.b) {
      last.l = Math.min(last.l, r.left);
      last.r = Math.max(last.r, r.right);
      last.t = Math.min(last.t, r.top);
      last.b = Math.max(last.b, r.bottom);
    } else {
      lines.push({ l: r.left, r: r.right, t: r.top, b: r.bottom });
    }
  }
  return lines;
}

/**
 * clip-path polygon that reveals lines 0..k-1 fully and line k up to x.
 * Coordinates are relative to the element's border box. The first and last
 * bands stretch to the element edges so backgrounds/padding are included.
 */
function staircase(lines: Line[], k: number, x: number, w: number, h: number): string {
  const P = 40;
  const top = Math.min(-P, lines[0].t - P);
  const bottomOf = (i: number) => (i >= lines.length - 1 ? Math.max(h + P, lines[i].b + P) : (lines[i].b + lines[i + 1].t) / 2);
  const bandTop = k === 0 ? top : bottomOf(k - 1);
  const bandBottom = bottomOf(k);
  const R = w + P;
  const pts: string[] = [];
  const add = (X: number, Y: number) => pts.push(`${px(X)} ${px(Y)}`);
  add(-P, top);
  if (k > 0) {
    add(R, top);
    add(R, bandTop);
  }
  add(x, bandTop);
  add(x, bandBottom);
  add(-P, bandBottom);
  return `polygon(${pts.join(",")})`;
}
