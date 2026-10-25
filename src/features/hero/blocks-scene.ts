import {
  Color,
  DirectionalLight,
  Group,
  HemisphereLight,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { logoBlocks, satelliteBlocks, toneColor, type Block, type BlockTone } from './blocks';

interface SceneOptions {
  container: HTMLElement;
  canvas: HTMLCanvasElement;
  onReady: () => void;
}

interface Animated {
  mesh: Mesh;
  home: { x: number; y: number; z: number };
  start: { x: number; y: number; z: number; rx: number; ry: number };
  delay: number;
  phase: number;
  float: number;
}

const ASSEMBLE_MS = 1600;
const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

/** Builds the hero WebGL scene and returns a disposer. */
export function createBlocksScene({ container, canvas, onReady }: SceneOptions): () => void {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new Scene();
  const camera = new PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 0, 10.5);

  scene.add(new HemisphereLight(new Color('#ffffff'), new Color('#E2F4F6'), 1.6));
  const key = new DirectionalLight(new Color('#ffffff'), 2.2);
  key.position.set(4, 6, 8);
  scene.add(key);
  const rim = new DirectionalLight(new Color('#4EACC4'), 1.2);
  rim.position.set(-6, -2, -4);
  scene.add(rim);

  const materials: Record<BlockTone, MeshStandardMaterial> = {
    navy: new MeshStandardMaterial({ color: toneColor.navy, roughness: 0.38, metalness: 0.15 }),
    teal: new MeshStandardMaterial({ color: toneColor.teal, roughness: 0.3, metalness: 0.1 }),
    soft: new MeshStandardMaterial({ color: toneColor.soft, roughness: 0.45, metalness: 0.05 }),
  };

  const group = new Group();
  scene.add(group);
  const geometries: RoundedBoxGeometry[] = [];
  const animated: Animated[] = [];

  const addBlock = (b: Block, index: number, satellite: boolean) => {
    const radius = Math.min(b.w, b.h, b.d) * 0.22;
    const geometry = new RoundedBoxGeometry(b.w, b.h, b.d, 4, radius);
    geometries.push(geometry);
    const mesh = new Mesh(geometry, materials[b.tone]);
    group.add(mesh);
    const spread = satellite ? 3.5 : 2.5;
    animated.push({
      mesh,
      home: { x: b.x, y: b.y, z: b.z },
      start: {
        x: b.x + MathUtils.randFloatSpread(spread),
        y: b.y + MathUtils.randFloatSpread(spread),
        z: b.z + MathUtils.randFloat(2, 5),
        rx: MathUtils.randFloatSpread(Math.PI),
        ry: MathUtils.randFloatSpread(Math.PI),
      },
      delay: index * 90,
      phase: Math.random() * Math.PI * 2,
      float: satellite ? 0.14 : 0.04,
    });
  };

  logoBlocks.forEach((b, i) => addBlock(b, i, false));
  satelliteBlocks.forEach((b, i) => addBlock(b, logoBlocks.length + i, true));

  const pointer = { x: 0, y: 0 };
  const onPointerMove = (event: PointerEvent) => {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
  };
  window.addEventListener('pointermove', onPointerMove, { passive: true });

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

  let visible = true;
  const intersection = new IntersectionObserver(([entry]) => {
    visible = entry?.isIntersecting ?? true;
    if (visible) schedule();
  });
  intersection.observe(container);
  const onVisibility = () => {
    if (!document.hidden) schedule();
  };
  document.addEventListener('visibilitychange', onVisibility);

  const startedAt = performance.now();
  let frame = 0;
  let readyFired = false;

  const render = (now: number) => {
    frame = 0;
    const elapsed = now - startedAt;
    const time = now / 1000;

    for (const a of animated) {
      const t = easeOutCubic(MathUtils.clamp((elapsed - a.delay) / ASSEMBLE_MS, 0, 1));
      const bob = Math.sin(time * 0.9 + a.phase) * a.float;
      a.mesh.position.set(
        MathUtils.lerp(a.start.x, a.home.x, t),
        MathUtils.lerp(a.start.y, a.home.y, t) + bob,
        MathUtils.lerp(a.start.z, a.home.z, t),
      );
      a.mesh.rotation.set(MathUtils.lerp(a.start.rx, 0, t), MathUtils.lerp(a.start.ry, 0, t), 0);
    }

    group.rotation.y = MathUtils.lerp(group.rotation.y, -0.45 + pointer.x * 0.35, 0.05);
    group.rotation.x = MathUtils.lerp(group.rotation.x, 0.18 + pointer.y * 0.2, 0.05);

    renderer.render(scene, camera);
    if (!readyFired) {
      readyFired = true;
      onReady();
    }
    schedule();
  };

  function schedule() {
    if (frame === 0 && visible && !document.hidden) frame = requestAnimationFrame(render);
  }
  schedule();

  return () => {
    if (frame) cancelAnimationFrame(frame);
    window.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('visibilitychange', onVisibility);
    resizeObserver.disconnect();
    intersection.disconnect();
    geometries.forEach((g) => g.dispose());
    Object.values(materials).forEach((m) => m.dispose());
    renderer.dispose();
  };
}
