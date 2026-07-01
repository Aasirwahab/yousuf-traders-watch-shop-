"use client";

import * as THREE from "three";
import { useEffect, useRef, useState } from "react";

export type SliderImage = { src: string; alt: string };

/* ──────────────────────────────────────────────────────────────────────────
   Curved slider — faithful WebGL port of the "mdw-curved-slider" technique.

   Flat planes sit in a straight row, all facing the camera. The vertex shader
   stretches each plane's Y by `1 + (curve/100) * distanceFromCenter²`, where
   distanceFromCenter is the vertex's world-X distance from the middle. Cards
   are short at the centre and flare taller toward the edges — that flare IS
   the curve in the reference. The fragment shader does a cover-fit crop so the
   photos fill each card without distortion.

   Driven here by autoplay drift + pointer drag + dot navigation (the original
   was scroll-driven), with seamless wrap.
   ────────────────────────────────────────────────────────────────────────── */

const FOV = 45; // narrow view → only a handful of large cards show
const CAM_Z = 1.3; // camera pulled in so cards nearly fill the band
const PLANE_W = 1.0; // card aspect (w); height is 1 — square like the reference
const PLANE_H = 1;
const GAP = 18; // wider spacing → fewer, larger cards (centre + 2 full + 1 half each side)
const CURVE = 6; // gentle flare toward the edges (plugin default was 15)
const RADIUS = 0.045; // card corner radius, in UV units
const BRIGHT = 1.12; // mild lift — the source photos are dark/cinematic
const SPEED = 0.26; // continuous auto-scroll speed, world units / second
const DIR = -1; // scroll direction

const VERTEX = `
  uniform float curve;
  varying vec2 vertexUV;
  void main(){
    vertexUV = uv;
    vec3 newPosition = position;
    float distanceFromCenter = abs(modelMatrix * vec4(position, 1.0)).x;
    newPosition.y *= 1.0 + (curve / 100.0) * pow(distanceFromCenter, 2.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

const FRAGMENT = `
  uniform sampler2D tex;
  uniform float uPlaneAspect;
  uniform float uImageAspect;
  uniform float uRadius;
  uniform float uBright;
  varying vec2 vertexUV;

  // signed distance to a rounded box centred at 0, half-size b, corner radius r
  float sdRoundBox(vec2 p, vec2 b, float r){
    vec2 q = abs(p) - b + r;
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
  }

  void main(){
    // cover-fit crop so the photo fills the card without distortion
    vec2 uv = vertexUV - 0.5;
    if (uImageAspect > uPlaneAspect) {
      uv.x *= uPlaneAspect / uImageAspect;
    } else {
      uv.y *= uImageAspect / uPlaneAspect;
    }
    uv += 0.5;
    vec3 col = texture2D(tex, uv).rgb * uBright;

    // rounded-corner mask + faint light border, computed in card space
    vec2 p = vertexUV - 0.5;
    float d = sdRoundBox(p, vec2(0.5), uRadius);
    float aa = fwidth(d) * 1.2;
    float alpha = 1.0 - smoothstep(0.0, aa, d);
    float border = smoothstep(-0.012 - aa, -0.012, d) * (1.0 - smoothstep(-aa, 0.0, d));
    col += border * 0.12;

    gl_FragColor = vec4(col, alpha);
  }
`;

function wrap(value: number, period: number) {
  const m = ((value % period) + period) % period;
  return m > period / 2 ? m - period : m;
}

const spacingWorld = PLANE_W * (1 + GAP / 100);

export default function CurvedSlider({ images }: { images: SliderImage[] }) {
  const distinct = images.length;
  const containerRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const targetRef = useRef<number | null>(null);
  const planeMetaRef = useRef<{ mesh: THREE.Mesh; img: number }[]>([]);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 20);
    camera.position.z = CAM_Z;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(PLANE_W, PLANE_H, 24, 24);
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");

    let planeCount = distinct * 3;
    let loopWorld = spacingWorld * planeCount;
    let disposed = false;
    let raf = 0;

    const sizeRenderer = () => {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || 1;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    const build = (textures: THREE.Texture[]) => {
      // Enough copies to fill even an ultra-wide viewport with cards to spare on
      // both sides, so the loop never shows a gap. Rounded to a multiple of
      // `distinct` so the image sequence stays continuous across the wrap, and
      // floored at 3× the set so there are always off-screen cards buffering
      // each edge.
      const worldH = 2 * Math.tan((FOV * Math.PI) / 180 / 2) * CAM_Z;
      const maxWorldW = worldH * 3.6; // covers up to ~32:9 ultra-wide
      const needed = Math.ceil(maxWorldW / spacingWorld) + 2 * distinct;
      planeCount = Math.max(distinct * 3, Math.ceil(needed / distinct) * distinct);
      loopWorld = spacingWorld * planeCount;

      const meta: { mesh: THREE.Mesh; img: number }[] = [];
      for (let i = 0; i < planeCount; i++) {
        const img = i % distinct;
        const texture = textures[img];
        const textureImage = texture.image as { width?: number; height?: number } | undefined;
        const imageAspect =
          textureImage?.width && textureImage.height
            ? textureImage.width / textureImage.height
            : 1;
        const material = new THREE.ShaderMaterial({
          uniforms: {
            tex: { value: texture },
            curve: { value: CURVE },
            uPlaneAspect: { value: PLANE_W / PLANE_H },
            uImageAspect: { value: imageAspect },
            uRadius: { value: RADIUS },
            uBright: { value: BRIGHT },
          },
          vertexShader: VERTEX,
          fragmentShader: FRAGMENT,
          transparent: true,
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.frustumCulled = false;
        scene.add(mesh);
        meta.push({ mesh, img });
      }
      planeMetaRef.current = meta;
    };

    const frame = (() => {
      let last = performance.now();
      return function loop(now: number) {
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;

        // A dot tap eases the chosen watch to centre; otherwise the carousel
        // marquees forever on its own. No drag, no wheel — pure auto-scroll.
        // Runs regardless of prefers-reduced-motion, matching this project's
        // convention for ambient/brand motion.
        if (targetRef.current !== null) {
          offsetRef.current += (targetRef.current - offsetRef.current) * Math.min(1, dt * 7);
          if (Math.abs(targetRef.current - offsetRef.current) < 0.0005) {
            offsetRef.current = targetRef.current;
            targetRef.current = null;
          }
        } else {
          offsetRef.current += DIR * SPEED * dt;
        }

        const meta = planeMetaRef.current;
        let best = Infinity;
        let bestImg = 0;
        for (let i = 0; i < meta.length; i++) {
          const x = wrap(i * spacingWorld + offsetRef.current, loopWorld);
          meta[i].mesh.position.x = x;
          if (Math.abs(x) < best) {
            best = Math.abs(x);
            bestImg = meta[i].img;
          }
        }
        if (bestImg !== activeRef.current) {
          activeRef.current = bestImg;
          setActive(bestImg);
        }

        renderer.render(scene, camera);
        if (!disposed) raf = requestAnimationFrame(loop);
      };
    })();

    sizeRenderer();
    Promise.all(images.map((im) => loader.loadAsync(im.src)))
      .then((textures) => {
        if (disposed) return;
        textures.forEach((t) => {
          t.colorSpace = THREE.SRGBColorSpace;
          t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
        });
        build(textures);
        raf = requestAnimationFrame(frame);
      })
      .catch(() => {});

    const ro = new ResizeObserver(sizeRenderer);
    ro.observe(container);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      planeMetaRef.current.forEach(({ mesh }) => {
        scene.remove(mesh);
        (mesh.material as THREE.ShaderMaterial).dispose();
      });
      planeMetaRef.current = [];
      geometry.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [images, distinct]);

  const goTo = (img: number) => {
    // ease the offset so the nearest plane carrying `img` lands at centre
    const meta = planeMetaRef.current;
    const period = distinct * spacingWorld;
    let bestDelta = 0;
    let best = Infinity;
    for (let i = 0; i < meta.length; i++) {
      if (meta[i].img !== img) continue;
      const x = meta[i].mesh.position.x;
      const delta = -wrap(x, period);
      if (Math.abs(delta) < best) {
        best = Math.abs(delta);
        bestDelta = delta;
      }
    }
    targetRef.current = offsetRef.current + bestDelta;
  };

  return (
    <div className="curved-slider">
      <div
        ref={containerRef}
        className="curved-slider__stage"
        role="group"
        aria-roledescription="carousel"
        aria-label="Featured watches"
      />
      <div className="curved-slider__dots" role="tablist" aria-label="Carousel pagination">
        {images.map((img, j) => (
          <button
            key={j}
            type="button"
            role="tab"
            aria-selected={active === j}
            aria-label={`Show ${img.alt}`}
            onClick={() => goTo(j)}
            className={`curved-slider__dot${active === j ? " is-active" : ""}`}
          />
        ))}
      </div>
    </div>
  );
}
