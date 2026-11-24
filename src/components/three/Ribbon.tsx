"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Flowing iridescent silk ribbons rendered with Three.js. Each ribbon is a long strip
 * whose centre line and twist are animated in the vertex shader; the fragment shader
 * shades it like liquid glass (fresnel edge + plum / rose / peach / lilac sheen).
 * The pointer gently bends the flow and scrolling past it winds it tighter.
 */

const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uSeed;
  uniform float uTwist;
  uniform float uLift;
  uniform vec2 uPointer;
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec2 vUv;

  vec3 centre(float x, float t) {
    float y = uLift + sin(x * 0.55 + t * 0.45 + uSeed) * 0.9 + sin(x * 0.21 - t * 0.31 + uSeed * 2.0) * 0.7;
    float z = cos(x * 0.38 + t * 0.36 + uSeed) * 1.1;
    y += uPointer.y * 0.6 * exp(-pow(x - uPointer.x * 4.0, 2.0) * 0.08);
    return vec3(x, y, z);
  }

  vec3 surface(vec2 uv, float t) {
    float x = (uv.x - 0.5) * 16.0;
    vec3 c = centre(x, t);
    float a = x * (0.32 + uTwist) + t * 0.5 + uSeed * 3.0;
    float w = (uv.y - 0.5) * (1.1 + 0.45 * sin(x * 0.4 + t + uSeed));
    return c + vec3(0.0, cos(a) * w, sin(a) * w);
  }

  void main() {
    float t = uTime;
    vec3 p = surface(uv, t);
    vec3 px = surface(uv + vec2(0.002, 0.0), t);
    vec3 py = surface(uv + vec2(0.0, 0.01), t);
    vec3 n = normalize(cross(px - p, py - p));
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vNormal = normalize(normalMatrix * n);
    vView = normalize(-mv.xyz);
    vUv = uv;
    gl_Position = projectionMatrix * mv;
  }
`;

const fragment = /* glsl */ `
  uniform float uTime;
  uniform float uSeed;
  uniform float uDay;
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec2 vUv;

  // plum -> rose -> peach -> lilac
  vec3 palette(float t) {
    vec3 a = vec3(0.72, 0.52, 0.58);
    vec3 b = vec3(0.28, 0.24, 0.22);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.02, 0.18, 0.32);
    return a + b * cos(6.28318 * (c * t + d));
  }

  void main() {
    vec3 n = normalize(vNormal);
    if (!gl_FrontFacing) n = -n;
    float facing = abs(dot(n, vView));
    float fres = pow(1.0 - facing, 2.2);
    float hue = vUv.x * 1.4 + n.y * 0.35 + fres * 0.6 + uTime * 0.04 + uSeed;
    vec3 col = palette(hue);
    col = mix(mix(vec3(0.23, 0.11, 0.25), vec3(0.97, 0.78, 0.82), uDay), col, 0.35 + 0.65 * facing);
    vec3 h = normalize(vView + normalize(vec3(0.4, 0.8, 0.6)));
    float spec = pow(max(dot(n, h), 0.0), 48.0);
    col += spec * vec3(1.0, 0.9, 0.86) * 0.9 + fres * vec3(0.95, 0.72, 0.76) * 0.55;
    float ends = smoothstep(0.0, 0.14, vUv.x) * smoothstep(1.0, 0.86, vUv.x);
    float edges = smoothstep(0.0, 0.06, vUv.y) * smoothstep(1.0, 0.94, vUv.y);
    gl_FragColor = vec4(col, (0.55 + fres * 0.45) * ends * edges);
  }
`;

const dustVertex = /* glsl */ `
  attribute float aSeed;
  uniform float uTime;
  uniform float uPixel;
  varying float vSeed;
  varying float vTw;
  void main() {
    vec3 p = position;
    p.y += sin(uTime * 0.25 + aSeed * 6.2832) * 0.45;
    p.x += cos(uTime * 0.18 + aSeed * 12.566) * 0.35;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vSeed = aSeed;
    vTw = 0.35 + 0.65 * (0.5 + 0.5 * sin(uTime * (0.6 + aSeed) + aSeed * 40.0));
    gl_PointSize = (1.6 + aSeed * 4.4) * uPixel * (9.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const dustFragment = /* glsl */ `
  varying float vSeed;
  varying float vTw;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d) * vTw;
    vec3 col = mix(vec3(1.0, 0.84, 0.72), vec3(0.96, 0.72, 0.8), vSeed);
    gl_FragColor = vec4(col, a * 0.85);
  }
`;

export default function Ribbon({
  className,
  count = 3,
  lift = 0,
  dust = false,
}: {
  className?: string;
  count?: number;
  /** Moves the silk up (+) or down (-) so it can flow around the content instead of behind it */
  lift?: number;
  /** Adds drifting gold dust with depth */
  dust?: boolean;
}) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      return; // no WebGL: the section's gradient background stays as the fallback
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    el.appendChild(renderer.domElement);
    renderer.domElement.style.cssText = "width:100%;height:100%;display:block";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0, 11);

    const pointer = new THREE.Vector2(0, 0);
    const target = new THREE.Vector2(0, 0);
    const geometry = new THREE.PlaneGeometry(1, 1, 420, 24);
    // PlaneGeometry positions are ignored: the shader builds the surface from uv
    const materials: THREE.ShaderMaterial[] = [];
    for (let i = 0; i < count; i++) {
      const m = new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        uniforms: {
          uTime: { value: 0 },
          uSeed: { value: i * 1.7 },
          uTwist: { value: 0 },
          uLift: { value: lift },
          uDay: { value: 0 },
          uPointer: { value: pointer },
        },
      });
      const mesh = new THREE.Mesh(geometry, m);
      mesh.frustumCulled = false;
      mesh.position.set(0, (i - (count - 1) / 2) * 1.1, -i * 1.2);
      mesh.rotation.z = -0.18 + i * 0.14;
      mesh.scale.setScalar(1 - i * 0.12);
      scene.add(mesh);
      materials.push(m);
    }

    let dustMat: THREE.ShaderMaterial | null = null;
    let dustPoints: THREE.Points | null = null;
    let dayMix = document.documentElement.dataset.theme === "day" ? 1 : 0;
    let dustGeo: THREE.BufferGeometry | null = null;
    if (dust) {
      const n = 260;
      const pos = new Float32Array(n * 3);
      const seed = new Float32Array(n);
      for (let i = 0; i < n; i++) {
        pos[i * 3] = (Math.random() - 0.5) * 22;
        pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
        pos[i * 3 + 2] = -7 + Math.random() * 10;
        seed[i] = Math.random();
      }
      dustGeo = new THREE.BufferGeometry();
      dustGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      dustGeo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
      dustMat = new THREE.ShaderMaterial({
        vertexShader: dustVertex,
        fragmentShader: dustFragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uTime: { value: 0 }, uPixel: { value: renderer.getPixelRatio() } },
      });
      dustPoints = new THREE.Points(dustGeo, dustMat);
      dustPoints.frustumCulled = false;
      scene.add(dustPoints);
    }

    let baseZ = 11;
    const resize = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      // keep the ribbon filling narrow (phone) screens
      baseZ = w < h ? 16 : 11;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    const onMove = (e: PointerEvent) => {
      target.set((e.clientX / innerWidth) * 2 - 1, -((e.clientY / innerHeight) * 2 - 1));
    };
    window.addEventListener("pointermove", onMove);

    // Only animate while on screen
    let visible = true;
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(el);

    const clock = new THREE.Clock();
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      const t = reduce ? 4 : clock.getElapsedTime();
      // touch screens have no hovering pointer, so the camera drifts on its own instead
      if (coarse) target.set(Math.sin(t * 0.35) * 0.7, Math.cos(t * 0.27) * 0.5);
      pointer.lerp(target, 0.04);
      // how far the ribbon's box has scrolled past the top of the screen (0..1)
      const r = el.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height)));
      const day = document.documentElement.dataset.theme === "day";
      dayMix += ((day ? 1 : 0) - dayMix) * 0.06;
      if (dustPoints) dustPoints.visible = !day;
      materials.forEach((m) => {
        m.uniforms.uDay.value = dayMix;
        m.uniforms.uTime.value = t;
        m.uniforms.uTwist.value += (progress * 0.45 - m.uniforms.uTwist.value) * 0.06;
      });
      if (dustMat) dustMat.uniforms.uTime.value = t;
      // the camera drifts with the pointer and flies forward through the silk as you scroll
      camera.position.x = pointer.x * 0.9;
      camera.position.y = pointer.y * 0.45;
      camera.position.z = baseZ - progress * 4;
      camera.lookAt(0, 0, 0);
      scene.rotation.y = pointer.x * 0.08;
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      geometry.dispose();
      dustGeo?.dispose();
      dustMat?.dispose();
      materials.forEach((m) => m.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [count, lift, dust]);

  return <div ref={host} className={className} aria-hidden />;
}
