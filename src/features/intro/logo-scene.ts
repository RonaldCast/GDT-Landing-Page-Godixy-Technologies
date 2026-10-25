import {
  Color,
  DirectionalLight,
  Group,
  HemisphereLight,
  MathUtils,
  Mesh,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  WebGLRenderer,
} from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { logoBlocks, type BlockTone } from '@/features/hero/blocks';

interface SceneOptions {
  container: HTMLElement;
  canvas: HTMLCanvasElement;
  onAssembled: () => void;
  onComplete: () => void;
}

interface Animated {
  mesh: Mesh;
  home: { x: number; y: number; z: number };
  start: { x: number; y: number; z: number; rx: number; ry: number };
  mid: { x: number; y: number; z: number };
  delay: number;
  duration: number;
}

const FRAME_MS = 1480;
const ACCENT_MS = 1180;
const LAST_START_MS = 420;
const ASSEMBLED_AT = LAST_START_MS + ACCENT_MS;
const SETTLE_MS = 420;
const HOLD_MS = 380;
const easeOutQuint = (t: number) => 1 - (1 - t) ** 5;

function bezier(a: number, b: number, c: number, t: number) {
  const u = 1 - t;
  return u * u * a + 2 * u * t * b + t * t * c;
}

/** Navy ink vanishes on the overlay, so the frame is light; teal keeps brand color. */
const introTone: Record<BlockTone, string> = {
  navy: '#F4F7FA',
  teal: '#4EACC4',
  soft: '#BFE6EE',
};

/** Each piece flies in on an arc: frame first, teal inner mark last. */
const approaches = [
  { x: 0.08, y: 2.6, z: 2.0, rx: 0.4, ry: 0.12, mx: 0.45, my: 1.55, mz: 0.9, delay: 0, duration: FRAME_MS },
  { x: -2.5, y: 0.1, z: 1.8, rx: 0.15, ry: -0.55, mx: -1.55, my: 0.6, mz: 0.85, delay: 90, duration: FRAME_MS },
  { x: 0.12, y: 0.4, z: 4.2, rx: 0.6, ry: 0.25, mx: 0.25, my: 0.85, mz: 2.0, delay: 340, duration: ACCENT_MS },
  { x: 2.55, y: -0.1, z: 2.1, rx: -0.18, ry: 0.55, mx: 1.6, my: 0.4, mz: 1.1, delay: 420, duration: ACCENT_MS },
  { x: -0.04, y: -2.55, z: 1.7, rx: -0.35, ry: 0.1, mx: -0.4, my: -1.5, mz: 0.85, delay: 180, duration: FRAME_MS },
];

export function createLogoScene({ container, canvas, onAssembled, onComplete }: SceneOptions): () => void {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMappingExposure = 1.15;

  const scene = new Scene();
  const camera = new PerspectiveCamera(30, 1, 0.1, 100);

  scene.add(new HemisphereLight(new Color('#e8f4f7'), new Color('#101E38'), 0.85));
  const key = new DirectionalLight(new Color('#ffffff'), 2.05);
  key.position.set(3.2, 5.4, 7.5);
  scene.add(key);
  const fill = new DirectionalLight(new Color('#d7e8ee'), 0.55);
  fill.position.set(-4, 1.2, 5);
  scene.add(fill);
  const rim = new DirectionalLight(new Color('#4EACC4'), 1.65);
  rim.position.set(-5.5, -1.2, -3.4);
  scene.add(rim);
  const glow = new PointLight(new Color('#4EACC4'), 0, 12, 2);
  glow.position.set(0.2, 0, 1.2);
  scene.add(glow);

  const materials: Record<BlockTone, MeshPhysicalMaterial> = {
    navy: new MeshPhysicalMaterial({
      color: introTone.navy,
      roughness: 0.22,
      metalness: 0.16,
      clearcoat: 0.55,
      clearcoatRoughness: 0.18,
    }),
    teal: new MeshPhysicalMaterial({
      color: introTone.teal,
      roughness: 0.18,
      metalness: 0.12,
      clearcoat: 0.7,
      clearcoatRoughness: 0.12,
      emissive: new Color('#4EACC4'),
      emissiveIntensity: 0.08,
    }),
    soft: new MeshPhysicalMaterial({
      color: introTone.soft,
      roughness: 0.28,
      metalness: 0.08,
      clearcoat: 0.4,
    }),
  };

  const group = new Group();
  group.scale.setScalar(0.72);
  scene.add(group);
  const geometries: RoundedBoxGeometry[] = [];
  const animated: Animated[] = [];

  logoBlocks.forEach((b, index) => {
    const radius = Math.min(b.w, b.h, b.d) * 0.28;
    const geometry = new RoundedBoxGeometry(b.w, b.h, b.d, 5, radius);
    geometries.push(geometry);
    const mesh = new Mesh(geometry, materials[b.tone]);
    mesh.scale.setScalar(0.72);
    group.add(mesh);
    const path = approaches[index] ?? approaches[0];
    animated.push({
      mesh,
      home: { x: b.x, y: b.y, z: b.z },
      start: { x: path.x, y: path.y, z: path.z, rx: path.rx, ry: path.ry },
      mid: { x: path.mx, y: path.my, z: path.mz },
      delay: path.delay,
      duration: path.duration,
    });
  });

  const resize = () => {
    const { width, height } = container.getBoundingClientRect();
    if (width === 0 || height === 0) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);
  resize();

  const startedAt = performance.now();
  let frame = 0;
  let assembled = false;
  let completed = false;
  let stopped = false;

  const render = (now: number) => {
    frame = 0;
    if (stopped) return;
    const elapsed = now - startedAt;
    const camT = easeOutQuint(MathUtils.clamp(elapsed / ASSEMBLED_AT, 0, 1));
    camera.position.set(0, 0.08, MathUtils.lerp(16.2, 12.6, camT));
    camera.lookAt(0, 0, 0);

    group.rotation.set(
      MathUtils.lerp(0.52, 0.13, camT),
      MathUtils.lerp(-1.05, -0.3, camT),
      MathUtils.lerp(0.08, 0, camT),
    );

    for (const a of animated) {
      const t = easeOutQuint(MathUtils.clamp((elapsed - a.delay) / a.duration, 0, 1));
      a.mesh.position.set(
        bezier(a.start.x, a.mid.x, a.home.x, t),
        bezier(a.start.y, a.mid.y, a.home.y, t),
        bezier(a.start.z, a.mid.z, a.home.z, t),
      );
      a.mesh.rotation.set(MathUtils.lerp(a.start.rx, 0, t), MathUtils.lerp(a.start.ry, 0, t), 0);
      a.mesh.scale.setScalar(MathUtils.lerp(0.72, 1, t));
    }

    glow.intensity = MathUtils.lerp(0, 3.2, camT);
    materials.teal.emissiveIntensity = MathUtils.lerp(0.06, 0.28, camT);

    if (elapsed > ASSEMBLED_AT) {
      const settle = easeOutQuint(MathUtils.clamp((elapsed - ASSEMBLED_AT) / SETTLE_MS, 0, 1));
      const pulse = 0.72 + Math.sin(settle * Math.PI) * 0.025;
      group.scale.setScalar(pulse);
    }

    renderer.render(scene, camera);

    if (!assembled && elapsed >= ASSEMBLED_AT) {
      assembled = true;
      onAssembled();
    }
    if (!completed && elapsed >= ASSEMBLED_AT + SETTLE_MS + HOLD_MS) {
      completed = true;
      onComplete();
      return;
    }
    schedule();
  };

  function schedule() {
    if (!stopped && frame === 0 && !document.hidden) frame = requestAnimationFrame(render);
  }
  schedule();

  const onVisibility = () => {
    if (!document.hidden) schedule();
  };
  document.addEventListener('visibilitychange', onVisibility);

  return () => {
    stopped = true;
    if (frame) cancelAnimationFrame(frame);
    document.removeEventListener('visibilitychange', onVisibility);
    resizeObserver.disconnect();
    geometries.forEach((g) => g.dispose());
    Object.values(materials).forEach((m) => m.dispose());
    renderer.dispose();
  };
}
