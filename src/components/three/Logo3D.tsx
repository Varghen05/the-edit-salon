"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

type Group = "sr" | "word" | "salon" | "orn";

/** Which block of the lockup each shape in /logo.svg belongs to. The giant T and E are left out. */
function groupOf(id: string): Group | null {
  if (id === "R_Letter" || id === "S_Letter" || id === "Gold_Ribbon") return "sr";
  if (id.startsWith("THE_EDIT_Letter")) return "word";
  if (id.startsWith("UNISEX_SALON_Letter")) return "salon";
  if (id === "Line_Left" || id === "Line_Right" || id === "Star") return "orn";
  return null;
}

const GOLD_IDS = new Set(["Gold_Ribbon", "Line_Left", "Line_Right", "Star"]);

// Extrusion per block: depth, and bevel (kept small so thin letter strokes stay crisp)
const EXTRUDE: Record<Group, { depth: number; bevel: number }> = {
  sr: { depth: 34, bevel: 4.5 },
  word: { depth: 12, bevel: 1.4 },
  salon: { depth: 6, bevel: 0.7 },
  orn: { depth: 5, bevel: 0.5 },
};

type Part = { mesh: THREE.Mesh; group: Group; cx: number; cy: number; w: number; h: number };

/**
 * The THE EDIT logo as real 3D metal. Every letter of the supplied logo artwork is extruded
 * with a bevel and lit like polished silver and gold, then laid out in a clean, centred
 * lockup (SR monogram, THE EDIT, UNISEX SALON, ornament) with no overlapping lettering.
 * The pieces assemble on load, then the lockup sways, follows the pointer and catches
 * moving light. If WebGL is unavailable, the flat SVG logo is shown instead.
 */
export default function Logo3D({ className, fallbackSvg }: { className?: string; fallbackSvg: string }) {
  const host = useRef<HTMLDivElement>(null); // empty on purpose: only Three.js touches its children
  const fallback = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      if (fallback.current) fallback.current.style.opacity = "1"; // no WebGL: show the flat logo
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;
    renderer.domElement.style.cssText = "width:100%;height:100%;display:block;position:absolute;inset:0";
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;

    const camera = new THREE.PerspectiveCamera(24, 1, 1, 6000);
    const key = new THREE.DirectionalLight(0xffe2d2, 4.2);
    key.position.set(300, 500, 700);
    const rim = new THREE.DirectionalLight(0xc8b0ff, 2.4);
    rim.position.set(-500, -150, 400);
    scene.add(key, rim);

    const lockup = new THREE.Group();
    scene.add(lockup);

    const silver = new THREE.MeshPhysicalMaterial({
      color: 0xf6f3f6,
      metalness: 0.92,
      roughness: 0.13,
      clearcoat: 0.9,
      clearcoatRoughness: 0.12,
      envMapIntensity: 2.6,
      emissive: 0x2a2630,
      emissiveIntensity: 0.3,
      side: THREE.DoubleSide,
    });
    const gold = new THREE.MeshPhysicalMaterial({
      color: 0xffc766,
      metalness: 0.88,
      roughness: 0.18,
      clearcoat: 0.6,
      clearcoatRoughness: 0.12,
      envMapIntensity: 2.6,
      emissive: 0x6b3f0c,
      emissiveIntensity: 0.7,
      side: THREE.DoubleSide,
    });

    const extent = { w: 700, h: 650 };
    const fit = () => {
      const w = el.clientWidth || 1;
      const h = el.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      const t = Math.tan((camera.fov * Math.PI) / 360);
      const dh = (extent.h * 1.14) / 2 / t;
      const dw = (extent.w * 1.24) / 2 / (t * camera.aspect);
      camera.position.set(0, 0, Math.max(dh, dw));
      camera.updateProjectionMatrix();
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);

    const pointer = new THREE.Vector2();
    const target = new THREE.Vector2();
    const onMove = (e: PointerEvent) => target.set((e.clientX / innerWidth) * 2 - 1, -((e.clientY / innerHeight) * 2 - 1));
    window.addEventListener("pointermove", onMove);

    let visible = true;
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(el);

    const clock = new THREE.Clock();
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      const t = reduce ? 1 : clock.getElapsedTime();
      pointer.lerp(target, 0.05);
      lockup.rotation.y = Math.sin(t * 0.55) * 0.3 + pointer.x * 0.4;
      lockup.rotation.x = Math.sin(t * 0.4) * 0.04 - pointer.y * 0.14;
      lockup.position.y = Math.sin(t * 0.8) * 6;
      // moving light and a slowly turning reflection make the metal shimmer
      key.position.x = Math.sin(t * 0.7) * 600;
      scene.environmentRotation.y = t * 0.22;
      renderer.render(scene, camera);
    };
    tick();

    const geometries: THREE.BufferGeometry[] = [];
    let cancelled = false;

    (async () => {
      let text: string;
      try {
        text = await fetch("/logo.svg").then((r) => r.text());
      } catch {
        if (fallback.current) fallback.current.style.opacity = "1";
        return;
      }
      if (cancelled) return;
      const data = new SVGLoader().parse(text);
      const parts: Part[] = [];

      for (const path of data.paths) {
        const id = (path.userData?.node as Element | undefined)?.getAttribute("id") ?? "";
        const group = groupOf(id);
        if (!group) continue;
        const shapes = SVGLoader.createShapes(path);
        if (!shapes.length) continue;
        const { depth, bevel } = EXTRUDE[group];
        const geo = new THREE.ExtrudeGeometry(shapes, {
          depth,
          bevelEnabled: true,
          bevelThickness: bevel,
          bevelSize: bevel * 0.8,
          bevelSegments: 3,
          curveSegments: 10,
        });
        geo.scale(1, -1, 1); // SVG y points down
        geo.computeBoundingBox();
        const box = geo.boundingBox!;
        const c = box.getCenter(new THREE.Vector3());
        geo.translate(-c.x, -c.y, -c.z);
        geometries.push(geo);
        const mesh = new THREE.Mesh(geo, GOLD_IDS.has(id) ? gold : silver);
        parts.push({ mesh, group, cx: c.x, cy: c.y, w: box.max.x - box.min.x, h: box.max.y - box.min.y });
      }
      if (!parts.length || cancelled) return;

      // Lay the blocks out in a centred stack: SR, THE EDIT, UNISEX SALON, ornament
      const bounds = (g: Group) => {
        const ps = parts.filter((p) => p.group === g);
        const minX = Math.min(...ps.map((p) => p.cx - p.w / 2));
        const maxX = Math.max(...ps.map((p) => p.cx + p.w / 2));
        const minY = Math.min(...ps.map((p) => p.cy - p.h / 2));
        const maxY = Math.max(...ps.map((p) => p.cy + p.h / 2));
        return { ps, gcx: (minX + maxX) / 2, gcy: (minY + maxY) / 2, w: maxX - minX, h: maxY - minY };
      };
      const plan: { g: Group; width: number | null; scale: number; gap: number }[] = [
        { g: "sr", width: null, scale: 0.76, gap: 46 },
        { g: "word", width: 700, scale: 1, gap: 52 },
        { g: "salon", width: 470, scale: 1, gap: 34 },
        { g: "orn", width: 540, scale: 1, gap: 0 },
      ];
      let cursor = 0;
      let maxW = 0;
      const placed: { p: Part; k: number; x: number; y: number }[] = [];
      for (const step of plan) {
        const b = bounds(step.g);
        const k = step.width ? step.width / b.w : step.scale;
        const top = cursor;
        const centerY = top - (b.h * k) / 2;
        b.ps.forEach((p) => placed.push({ p, k, x: (p.cx - b.gcx) * k, y: (p.cy - b.gcy) * k + centerY }));
        cursor -= b.h * k + step.gap;
        maxW = Math.max(maxW, b.w * k);
      }
      const totalH = -cursor;
      extent.w = maxW;
      extent.h = totalH;
      fit();

      placed.forEach(({ p, k, x, y }) => {
        p.mesh.position.set(x, y + totalH / 2, 0);
        p.mesh.scale.setScalar(k);
        lockup.add(p.mesh);
      });


      if (reduce) return;
      // Assembly: the monogram spins in, THE EDIT drops in letter by letter, the rest rises
      const order: Record<Group, number> = { sr: 0, word: 0.7, salon: 1.5, orn: 2 };
      const counters: Record<Group, number> = { sr: 0, word: 0, salon: 0, orn: 0 };
      placed.forEach(({ p, k }) => {
        const i = counters[p.group]++;
        const m = p.mesh;
        const to = { x: m.position.x, y: m.position.y, z: 0 };
        const start = order[p.group] + (p.group === "word" ? i * 0.08 : p.group === "salon" ? i * 0.035 : i * 0.12);
        const fromY = p.group === "word" ? to.y + 260 : p.group === "salon" ? to.y - 120 : to.y;
        m.position.y = fromY;
        m.scale.setScalar(0.001);
        m.rotation.set(0, p.group === "sr" ? -Math.PI * 1.6 : gsap.utils.random(-1.2, 1.2), p.group === "word" ? gsap.utils.random(-0.9, 0.9) : 0);
        gsap.to(m.scale, { x: k, y: k, z: k, duration: 1.1, delay: start, ease: "back.out(1.5)" });
        gsap.to(m.position, { y: to.y, duration: 1.3, delay: start, ease: "expo.out" });
        gsap.to(m.rotation, { x: 0, y: 0, z: 0, duration: 1.5, delay: start, ease: "expo.out" });
      });
    })();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      lockup.children.forEach((c) => gsap.killTweensOf([c.scale, c.position, c.rotation]));
      geometries.forEach((g) => g.dispose());
      silver.dispose();
      gold.dispose();
      envRT.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div className={className} role="img" aria-label="THE EDIT Unisex Salon">
      {/* flat logo, shown only if WebGL or loading fails */}
      <div ref={fallback} className="absolute inset-0 opacity-0 transition-opacity duration-700" dangerouslySetInnerHTML={{ __html: fallbackSvg }} />
      <div ref={host} className="absolute inset-0" />
    </div>
  );
}
