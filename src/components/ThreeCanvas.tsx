import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { AlertTriangle, XCircle, RotateCcw, HelpCircle, CheckCircle2 } from 'lucide-react';
import { ModelItem, ModelStats, MeshNodeInfo, ViewerSettings } from '../types';

interface ThreeCanvasProps {
  model: ModelItem | null;
  settings: ViewerSettings;
  activeAnimationIndex: number;
  isPlayingAnimation: boolean;
  animationSpeed: number;
  animationTime: number; // For scrubber
  isScrubbing: boolean;
  customClips?: THREE.AnimationClip[];
  onAnimationTimeUpdate?: (currentTime: number, duration: number) => void;
  onStatsLoaded?: (stats: ModelStats, hierarchy: MeshNodeInfo[]) => void;
  onThumbnailGenerated?: (dataUrl: string) => void;
  hiddenMeshIds?: Set<string>;
  cameraSnapSignal?: 'front' | 'top' | 'side' | 'isometric' | 'reset' | null;
  resetTransformSignal?: number;
  onScreenshotRequested?: (dataUrl: string) => void;
  shouldTakeScreenshot?: boolean;
  onScreenshotDone?: () => void;
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({
  model,
  settings,
  activeAnimationIndex,
  isPlayingAnimation,
  animationSpeed,
  animationTime,
  isScrubbing,
  customClips = [],
  onAnimationTimeUpdate,
  onStatsLoaded,
  onThumbnailGenerated,
  hiddenMeshIds,
  cameraSnapSignal,
  resetTransformSignal,
  shouldTakeScreenshot,
  onScreenshotDone,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Three.js internal references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  
  // Model & animation hierarchy refs
  const currentModelGroupRef = useRef<THREE.Group | null>(null); // Anchor Group (normalized scale & world position)
  const motionWrapperRef = useRef<THREE.Group | null>(null); // Motion Wrapper (holds local position/rotation/scale for AI motions)
  const loadedRootRef = useRef<THREE.Object3D | null>(null); // Inner loaded root mesh hierarchy
  const originalMaterialsRef = useRef<Map<THREE.Mesh, THREE.Material | THREE.Material[]>>(new Map());
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const actionRef = useRef<THREE.AnimationAction | null>(null);
  const nativeClipsRef = useRef<THREE.AnimationClip[]>([]);
  const clipsRef = useRef<THREE.AnimationClip[]>([]);
  const clockRef = useRef<THREE.Clock>(new THREE.Clock());
  const defaultCameraDistanceRef = useRef<number>(5);
  const defaultCameraTargetRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 1.5, 0));

  // Dynamic props synchronization refs (prevents stale closures in requestAnimationFrame loop)
  const isPlayingAnimationRef = useRef(isPlayingAnimation);
  isPlayingAnimationRef.current = isPlayingAnimation;

  const animationSpeedRef = useRef(animationSpeed);
  animationSpeedRef.current = animationSpeed;

  const isScrubbingRef = useRef(isScrubbing);
  isScrubbingRef.current = isScrubbing;

  const onAnimationTimeUpdateRef = useRef(onAnimationTimeUpdate);
  onAnimationTimeUpdateRef.current = onAnimationTimeUpdate;

  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  const lastTimeUpdateRef = useRef<number>(0);

  // Lights & helpers refs
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);
  const pointLightRef = useRef<THREE.PointLight | null>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight | null>(null);
  const gridHelperRef = useRef<THREE.GridHelper | null>(null);
  const shadowPlaneRef = useRef<THREE.Mesh | null>(null);

  const [loadingProgress, setLoadingProgress] = useState<number | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Initialize Scene, Camera, Renderer, Controls
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 800;
    const height = containerRef.current.clientHeight || 600;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(settings.cameraFov || 45, width / height, 0.1, 1000);
    camera.position.set(3, 2.5, 4);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      preserveDrawingBuffer: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;

    // 4. Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxDistance = 100;
    controls.minDistance = 0.3;
    controls.target.set(0, 0.8, 0);
    controlsRef.current = controls;

    // 5. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, settings.ambientLightIntensity);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const dirLight = new THREE.DirectionalLight(0xffffff, settings.directionalLightIntensity);
    dirLight.position.set(5, 10, 7);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 25;
    dirLight.shadow.camera.left = -5;
    dirLight.shadow.camera.right = 5;
    dirLight.shadow.camera.top = 5;
    dirLight.shadow.camera.bottom = -5;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);
    dirLightRef.current = dirLight;

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);
    hemiLightRef.current = hemiLight;

    const pointLight = new THREE.PointLight(0x60a5fa, settings.pointLightIntensity, 20);
    pointLight.position.set(-4, 3, -3);
    scene.add(pointLight);
    pointLightRef.current = pointLight;

    // 6. Grid and Shadow receiver floor
    const grid = new THREE.GridHelper(16, 32, 0x94a3b8, 0xe2e8f0);
    grid.position.y = -0.001;
    scene.add(grid);
    gridHelperRef.current = grid;

    const shadowPlaneGeo = new THREE.PlaneGeometry(30, 30);
    const shadowPlaneMat = new THREE.ShadowMaterial({ opacity: 0.25 });
    const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -0.002;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);
    shadowPlaneRef.current = shadowPlane;

    // Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w > 0 && h > 0 && cameraRef.current && rendererRef.current) {
          cameraRef.current.aspect = w / h;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(w, h, false);
        }
      }
    });
    resizeObserver.observe(containerRef.current);

    // 7. Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      let delta = clockRef.current.getDelta();
      // Cap delta to 0.05s to prevent massive jumps on browser lag, wake-up, or frame drops
      if (delta > 0.05) delta = 0.05;

      // Update animation mixer smoothly according to active clip's effective timeScale
      if (mixerRef.current && isPlayingAnimationRef.current && !isScrubbingRef.current) {
        mixerRef.current.update(delta);
        if (actionRef.current && onAnimationTimeUpdateRef.current) {
          const clip = actionRef.current.getClip();
          const curTime = actionRef.current.time % clip.duration;
          
          // Throttle timeline UI update to ~25fps (every 40ms) to ensure butter-smooth WebGL rendering without React lag
          const now = performance.now();
          if (now - lastTimeUpdateRef.current > 40) {
            lastTimeUpdateRef.current = now;
            onAnimationTimeUpdateRef.current(curTime, clip.duration);
          }
        }
      }

      // Auto rotation with latest settings
      if (controlsRef.current) {
        controlsRef.current.autoRotate = settingsRef.current.autoRotate;
        controlsRef.current.autoRotateSpeed = settingsRef.current.autoRotateSpeed;
        controlsRef.current.update();
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      renderer.dispose();
    };
  }, []);

  // Update Environment & Background Theme
  useEffect(() => {
    if (!sceneRef.current || !rendererRef.current) return;
    const scene = sceneRef.current;

    // Apply lighting & background based on environment preset
    switch (settings.environment) {
      case 'studio':
        scene.background = new THREE.Color(settings.backgroundColor || 0x0f172a);
        if (ambientLightRef.current) ambientLightRef.current.color.setHex(0xffffff);
        if (dirLightRef.current) {
          dirLightRef.current.color.setHex(0xffffff);
          dirLightRef.current.position.set(5, 8, 5);
        }
        if (pointLightRef.current) pointLightRef.current.color.setHex(0x38bdf8);
        break;
      case 'sunset':
        scene.background = new THREE.Color(0x1a0f1d);
        if (ambientLightRef.current) ambientLightRef.current.color.setHex(0x818cf8);
        if (dirLightRef.current) {
          dirLightRef.current.color.setHex(0xfb923c);
          dirLightRef.current.position.set(6, 4, 3);
        }
        if (pointLightRef.current) pointLightRef.current.color.setHex(0xf43f5e);
        break;
      case 'dawn':
        scene.background = new THREE.Color(0x0f1b29);
        if (ambientLightRef.current) ambientLightRef.current.color.setHex(0x93c5fd);
        if (dirLightRef.current) {
          dirLightRef.current.color.setHex(0xfef08a);
          dirLightRef.current.position.set(-5, 6, 4);
        }
        if (pointLightRef.current) pointLightRef.current.color.setHex(0xa78bfa);
        break;
      case 'night':
        scene.background = new THREE.Color(0x05070d);
        if (ambientLightRef.current) ambientLightRef.current.color.setHex(0x1e293b);
        if (dirLightRef.current) {
          dirLightRef.current.color.setHex(0x06b6d4);
          dirLightRef.current.position.set(3, 6, 2);
        }
        if (pointLightRef.current) pointLightRef.current.color.setHex(0xf43f5e);
        break;
      case 'pure_white':
        scene.background = new THREE.Color(0xf8fafc);
        if (ambientLightRef.current) ambientLightRef.current.color.setHex(0xffffff);
        if (dirLightRef.current) {
          dirLightRef.current.color.setHex(0xffffff);
          dirLightRef.current.position.set(4, 9, 4);
        }
        if (pointLightRef.current) pointLightRef.current.color.setHex(0xe2e8f0);
        break;
      case 'dark_room':
        scene.background = new THREE.Color(0x020617);
        if (ambientLightRef.current) ambientLightRef.current.color.setHex(0x334155);
        if (dirLightRef.current) {
          dirLightRef.current.color.setHex(0xffffff);
          dirLightRef.current.position.set(0, 10, 0);
        }
        if (pointLightRef.current) pointLightRef.current.color.setHex(0x6366f1);
        break;
      case 'neutral':
      default:
        scene.background = new THREE.Color(settings.backgroundColor || 0x1e293b);
        if (ambientLightRef.current) ambientLightRef.current.color.setHex(0xffffff);
        if (dirLightRef.current) dirLightRef.current.color.setHex(0xffffff);
        if (pointLightRef.current) pointLightRef.current.color.setHex(0x94a3b8);
        break;
    }

    // Grid color adjustments based on environment
    if (gridHelperRef.current) {
      gridHelperRef.current.visible = settings.showGrid;
      if (settings.environment === 'pure_white') {
        gridHelperRef.current.material = new THREE.LineBasicMaterial({ color: 0xcfd8dc, transparent: true, opacity: 0.6 });
      } else {
        gridHelperRef.current.material = new THREE.LineBasicMaterial({ color: 0x334155, transparent: true, opacity: 0.4 });
      }
    }

    if (shadowPlaneRef.current) {
      shadowPlaneRef.current.visible = settings.showShadows;
    }

    if (ambientLightRef.current) {
      ambientLightRef.current.intensity = settings.ambientLightIntensity;
    }
    if (dirLightRef.current) {
      dirLightRef.current.intensity = settings.directionalLightIntensity;
    }
    if (pointLightRef.current) {
      pointLightRef.current.intensity = settings.pointLightIntensity;
    }
  }, [settings]);

  // Load 3D Model
  useEffect(() => {
    if (!sceneRef.current || !model?.url) return;

    const scene = sceneRef.current;

    // Clean previous model
    if (currentModelGroupRef.current) {
      scene.remove(currentModelGroupRef.current);
      currentModelGroupRef.current.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.geometry.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m) => m.dispose());
          } else if (mesh.material) {
            mesh.material.dispose();
          }
        }
      });
      currentModelGroupRef.current = null;
    }

    // Stop and clear animations
    if (mixerRef.current) {
      mixerRef.current.stopAllAction();
      mixerRef.current = null;
    }
    actionRef.current = null;
    clipsRef.current = [];
    originalMaterialsRef.current.clear();

    let isCompleted = false;
    setLoadingProgress(0);
    setLoadError(null);

    // Setup Loading Timeout Watchdog (15 seconds) with interactive stop
    const timeoutTimer = setTimeout(() => {
      if (isCompleted) return;
      console.warn('Model loading timed out after 15s.');
      setLoadError(
        '모델 로딩 시간 초과: 파일 용량이 과도하게 크거나(High-poly 수백만 폴리곤), 누락된 외부 텍스처 참조 또는 브라우저 메모리 한계로 인해 중단되었습니다.'
      );
      setLoadingProgress(null);
    }, 15000);

    // Common processor for any loaded 3D Object3D / Group
    const processLoadedObject = (root: THREE.Object3D, animations: THREE.AnimationClip[] = []) => {
      if (isCompleted) return;
      isCompleted = true;
      clearTimeout(timeoutTimer);
      setLoadingProgress(null);
      setLoadError(null);
      currentModelGroupRef.current = root as THREE.Group;

      // Compute Bounding Box & Normalize model position/scale
      const box = new THREE.Box3().setFromObject(root);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());

      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = maxDim > 0 ? 3.0 / maxDim : 1; // Normalize to standard ~3 viewport units

      // Double-Group Isolation Architecture:
      // 1. anchorGroup: root in Three.js scene, holds the normalized scale (3.0/maxDim) and world position
      // 2. motionWrapper: holds identity transform (pos=0,0,0, rot=0,0,0, scale=1,1,1) for AI & procedural tracks
      // 3. root: raw geometry with local offset to align model base at Y=0 and center on X/Z
      const anchorGroup = new THREE.Group();
      anchorGroup.name = 'AnchorGroup_Normalization';

      const motionWrapper = new THREE.Group();
      motionWrapper.name = 'MotionWrapper_AI_Kinematics';

      anchorGroup.add(motionWrapper);
      motionWrapper.add(root);

      // Pivot geometry centering on loaded raw root
      root.position.set(-center.x, -box.min.y, -center.z);

      // Normalized scale applied strictly to anchorGroup
      anchorGroup.scale.setScalar(scale);
      anchorGroup.position.set(0, 0, 0);

      // motionWrapper stays at clean identity
      motionWrapper.position.set(0, 0, 0);
      motionWrapper.rotation.set(0, 0, 0);
      motionWrapper.scale.set(1, 1, 1);

      currentModelGroupRef.current = anchorGroup;
      motionWrapperRef.current = motionWrapper;
      loadedRootRef.current = root;

      // Calculate statistics & hierarchy
      let triangleCount = 0;
      let vertexCount = 0;
      let meshCount = 0;
      const materialsSet = new Set<string>();

      const buildHierarchy = (object: THREE.Object3D): MeshNodeInfo => {
        let nodeTris = 0;
        if ((object as THREE.Mesh).isMesh) {
          meshCount++;
          const mesh = object as THREE.Mesh;
          mesh.castShadow = true;
          mesh.receiveShadow = true;

          // If mesh has no material or default, ensure it has a high-quality standard material
          if (!mesh.material) {
            mesh.material = new THREE.MeshStandardMaterial({
              color: 0xc9a96e, // Antique Gold / Bronze PBR
              roughness: 0.35,
              metalness: 0.55,
            });
          }

          // Store original material
          originalMaterialsRef.current.set(mesh, mesh.material);

          const geometry = mesh.geometry;
          if (geometry) {
            // Ensure normals exist for smooth rendering
            if (!geometry.attributes.normal) {
              geometry.computeVertexNormals();
            }

            const posAttr = geometry.attributes.position;
            if (posAttr) {
              vertexCount += posAttr.count;
            }
            if (geometry.index) {
              const count = geometry.index.count / 3;
              triangleCount += count;
              nodeTris = count;
            } else if (posAttr) {
              const count = posAttr.count / 3;
              triangleCount += count;
              nodeTris = count;
            }
          }

          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m) => {
              materialsSet.add(m.uuid);
            });
          } else if (mesh.material) {
            materialsSet.add(mesh.material.uuid);
          }
        }

        return {
          id: object.uuid,
          name: object.name || (object.type + ' ' + object.id),
          type: object.type,
          visible: object.visible,
          triangleCount: Math.round(nodeTris),
          children: object.children.map(buildHierarchy),
        };
      };

      const hierarchyRoot = buildHierarchy(root);

      // Compute normalized scaled dimensions in units
      const realBox = new THREE.Box3().setFromObject(anchorGroup);
      const realSize = realBox.getSize(new THREE.Vector3());

      const animationNames = animations.map((a, i) => a.name || `Animation ${i + 1}`);
      const stats: ModelStats = {
        triangleCount: Math.round(triangleCount),
        vertexCount: Math.round(vertexCount),
        meshCount,
        materialCount: materialsSet.size || 1,
        animationCount: animations.length,
        animations: animationNames,
        dimensions: {
          x: parseFloat(realSize.x.toFixed(2)),
          y: parseFloat(realSize.y.toFixed(2)),
          z: parseFloat(realSize.z.toFixed(2)),
        },
      };

      scene.add(anchorGroup);

      // Adjust Camera to frame model
      if (cameraRef.current && controlsRef.current) {
        const targetY = realSize.y / 2;
        defaultCameraTargetRef.current.set(0, targetY, 0);
        controlsRef.current.target.set(0, targetY, 0);

        const distance = Math.max(realSize.x, realSize.y, realSize.z) * 2.2;
        defaultCameraDistanceRef.current = Math.max(distance, 3);
        cameraRef.current.position.set(distance * 0.9, targetY + distance * 0.5, distance * 1.1);
        controlsRef.current.update();
      }

      // Setup Animations (Mixer unconditionally initialized on motionWrapper)
      const mixer = new THREE.AnimationMixer(motionWrapper);
      mixerRef.current = mixer;

      nativeClipsRef.current = animations || [];
      const combinedClips = [...nativeClipsRef.current, ...(customClips || [])];
      clipsRef.current = combinedClips;

      if (combinedClips.length > 0) {
        const clipToPlay = combinedClips[activeAnimationIndex] || combinedClips[0];
        const action = mixer.clipAction(clipToPlay);
        action.setEffectiveTimeScale(animationSpeedRef.current);
        action.reset().play();
        if (!isPlayingAnimationRef.current) {
          action.paused = true;
        }
        actionRef.current = action;

        if (onAnimationTimeUpdate) {
          onAnimationTimeUpdate(0, clipToPlay.duration);
        }
      }

      // Apply Render Mode
      applyRenderMode(settings.renderMode, settings.wireframeColor);

      // Notify parent
      if (onStatsLoaded) {
        onStatsLoaded(stats, [hierarchyRoot]);
      }

      // Generate thumbnail preview if none exists
      setTimeout(() => {
        if (rendererRef.current && sceneRef.current && cameraRef.current) {
          rendererRef.current.render(sceneRef.current, cameraRef.current);
          const thumbUrl = rendererRef.current.domElement.toDataURL('image/jpeg', 0.85);
          if (onThumbnailGenerated) {
            onThumbnailGenerated(thumbUrl);
          }
        }
      }, 300);

      setLoadingProgress(null);
    };

    // Create a resilient LoadingManager so missing external textures (e.g. from single FBX/OBJ files) don't crash loading
    const manager = new THREE.LoadingManager();
    manager.onProgress = (item, loaded, total) => {
      if (isCompleted) return;
      if (total > 0) {
        setLoadingProgress(Math.round((loaded / total) * 100));
      }
    };
    manager.onError = (url) => {
      console.warn('Non-fatal asset loading warning (missing external texture/resource):', url);
    };

    const onProgress = (xhr: ProgressEvent) => {
      if (isCompleted) return;
      if (xhr.lengthComputable && xhr.total > 0) {
        const percent = Math.round((xhr.loaded / xhr.total) * 100);
        setLoadingProgress(percent);
      } else {
        setLoadingProgress((prev) => (prev !== null && prev < 90 ? prev + 10 : 50));
      }
    };

    const onError = (error: unknown) => {
      clearTimeout(timeoutTimer);
      console.error('Error loading 3D model:', error);
      let msg = '3D 모델을 불러오지 못했습니다.';
      if (rawFormat === 'fbx') {
        msg = 'FBX 모델 로드 실패: 파일 용량이 너무 크거나(High-poly 수백만 폴리곤 메모리 초과), 분리된 외부 텍스처 참조 또는 지원되지 않는 FBX 버전일 수 있습니다. Mid/Low 버전이나 .GLB 형식으로 변환 후 업로드를 권장합니다.';
      } else {
        msg = `${rawFormat.toUpperCase()} 모델을 불러오지 못했습니다. 파일 손상 또는 브라우저 메모리 한계를 확인해주세요.`;
      }
      setLoadError(msg);
      setLoadingProgress(null);
    };

    // Detect format from model or url/filename
    const rawFormat = (model.format || (() => {
      const lower = (model.name + ' ' + model.url).toLowerCase();
      if (lower.includes('.stl')) return 'stl';
      if (lower.includes('.obj')) return 'obj';
      if (lower.includes('.ply')) return 'ply';
      if (lower.includes('.fbx')) return 'fbx';
      return 'glb';
    })()).toLowerCase();

    // 1. STL Loader (Stereolithography - Thingiverse, 3D Scans, 반가사유상 STL)
    if (rawFormat === 'stl') {
      const stlLoader = new STLLoader(manager);
      stlLoader.load(
        model.url,
        (geometry) => {
          geometry.computeVertexNormals();
          const material = new THREE.MeshStandardMaterial({
            color: 0xd4af37, // 금동/브론즈 PBR 골드
            roughness: 0.35,
            metalness: 0.65,
          });
          const mesh = new THREE.Mesh(geometry, material);
          mesh.name = model.name || 'STL Mesh';
          const group = new THREE.Group();
          group.name = model.name || 'STL Model';
          group.add(mesh);
          processLoadedObject(group, []);
        },
        onProgress,
        onError
      );
      return;
    }

    // 2. OBJ Loader (Wavefront OBJ)
    if (rawFormat === 'obj') {
      const objLoader = new OBJLoader(manager);
      objLoader.load(
        model.url,
        (obj) => {
          obj.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const m = child as THREE.Mesh;
              if (!m.material || (Array.isArray(m.material) && m.material.length === 0)) {
                m.material = new THREE.MeshStandardMaterial({
                  color: 0xc9a96e,
                  roughness: 0.35,
                  metalness: 0.55,
                });
              }
            }
          });
          processLoadedObject(obj, []);
        },
        onProgress,
        onError
      );
      return;
    }

    // 3. PLY Loader (Polygon / 3D Scans)
    if (rawFormat === 'ply') {
      const plyLoader = new PLYLoader(manager);
      plyLoader.load(
        model.url,
        (geometry) => {
          geometry.computeVertexNormals();
          const material = new THREE.MeshStandardMaterial({
            color: 0xa8a29e,
            roughness: 0.4,
            metalness: 0.35,
          });
          const mesh = new THREE.Mesh(geometry, material);
          mesh.name = model.name || 'PLY Mesh';
          const group = new THREE.Group();
          group.name = model.name || 'PLY Model';
          group.add(mesh);
          processLoadedObject(group, []);
        },
        onProgress,
        onError
      );
      return;
    }

    // 4. FBX Loader (FilmBox) - Uses direct ArrayBuffer fetching and isolated parsing
    if (rawFormat === 'fbx') {
      const fileLoader = new THREE.FileLoader(manager);
      fileLoader.setResponseType('arraybuffer');
      fileLoader.load(
        model.url,
        (buffer) => {
          try {
            const quietManager = new THREE.LoadingManager();
            quietManager.onError = () => {};
            quietManager.onProgress = () => {};
            const fbxLoader = new FBXLoader(quietManager);
            // Parse binary arraybuffer without blocking on missing relative textures
            const fbx = fbxLoader.parse(buffer as ArrayBuffer, '');
            fbx.traverse((child) => {
              if ((child as THREE.Mesh).isMesh) {
                const m = child as THREE.Mesh;
                if (!m.material) {
                  m.material = new THREE.MeshStandardMaterial({
                    color: 0xc9a96e,
                    roughness: 0.35,
                    metalness: 0.55,
                  });
                }
              }
            });
            processLoadedObject(fbx, fbx.animations || []);
          } catch (parseErr) {
            console.error('FBX parse error:', parseErr);
            onError(parseErr);
          }
        },
        onProgress,
        onError
      );
      return;
    }

    // 5. Default: GLTF / GLB Loader with DRACO
    const dracoLoader = new DRACOLoader(manager);
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');

    const loader = new GLTFLoader(manager);
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      model.url,
      (gltf) => {
        processLoadedObject(gltf.scene, gltf.animations || []);
      },
      onProgress,
      onError
    );

    return () => {
      dracoLoader.dispose();
    };
  }, [model?.url]);

  // Apply Render Mode / Material Override
  const applyRenderMode = useCallback((mode: string, wireframeColor: string) => {
    if (!currentModelGroupRef.current) return;

    currentModelGroupRef.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const original = originalMaterialsRef.current.get(mesh);

        if (mode === 'default') {
          if (original) {
            mesh.material = original;
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach((m) => {
                if ('wireframe' in m) (m as any).wireframe = false;
              });
            } else if ('wireframe' in mesh.material) {
              (mesh.material as any).wireframe = false;
            }
          }
        } else if (mode === 'wireframe') {
          mesh.material = new THREE.MeshBasicMaterial({
            color: new THREE.Color(wireframeColor || '#38bdf8'),
            wireframe: true,
          });
        } else if (mode === 'normals') {
          mesh.material = new THREE.MeshNormalMaterial({
            wireframe: false,
          });
        } else if (mode === 'clay') {
          mesh.material = new THREE.MeshStandardMaterial({
            color: 0xded8cc,
            roughness: 0.85,
            metalness: 0.05,
          });
        } else if (mode === 'xray') {
          mesh.material = new THREE.MeshPhysicalMaterial({
            color: 0x38bdf8,
            transmission: 0.85,
            opacity: 0.45,
            transparent: true,
            roughness: 0.15,
            ior: 1.5,
            depthWrite: false,
          });
        }
      }
    });
  }, []);

  useEffect(() => {
    applyRenderMode(settings.renderMode, settings.wireframeColor);
  }, [settings.renderMode, settings.wireframeColor, applyRenderMode]);

  // Handle hidden meshes (visibility toggling via Hierarchy tree)
  useEffect(() => {
    if (!currentModelGroupRef.current || !hiddenMeshIds) return;

    currentModelGroupRef.current.traverse((child) => {
      if (hiddenMeshIds.has(child.uuid)) {
        child.visible = false;
      } else {
        child.visible = true;
      }
    });
  }, [hiddenMeshIds]);

  // Handle customClips and activeAnimationIndex updates dynamically
  useEffect(() => {
    clipsRef.current = [...nativeClipsRef.current, ...(customClips || [])];
    if (!mixerRef.current && motionWrapperRef.current) {
      mixerRef.current = new THREE.AnimationMixer(motionWrapperRef.current);
    }
    if (!mixerRef.current || clipsRef.current.length === 0) return;

    const clip = clipsRef.current[activeAnimationIndex] || clipsRef.current[0];
    if (!clip) return;

    if (actionRef.current) {
      actionRef.current.stop();
    }

    const newAction = mixerRef.current.clipAction(clip);
    newAction.setEffectiveTimeScale(animationSpeedRef.current);
    newAction.reset().play();
    newAction.paused = !isPlayingAnimationRef.current;
    actionRef.current = newAction;

    if (onAnimationTimeUpdateRef.current) {
      onAnimationTimeUpdateRef.current(0, clip.duration);
    }
  }, [activeAnimationIndex, customClips]);

  // Handle Play/Pause toggle
  useEffect(() => {
    if (actionRef.current) {
      actionRef.current.paused = !isPlayingAnimation;
    }
    // Flush delta from clock upon unpausing so first active frame doesn't jump forward
    if (isPlayingAnimation && clockRef.current) {
      clockRef.current.getDelta();
    }
  }, [isPlayingAnimation]);

  // Handle Speed change (0.25x, 0.5x, 1x, 1.5x, 2x)
  useEffect(() => {
    if (actionRef.current) {
      actionRef.current.setEffectiveTimeScale(animationSpeed);
    }
  }, [animationSpeed]);

  // Handle manual scrubbing and seeking of animation
  useEffect(() => {
    if (actionRef.current && mixerRef.current) {
      if (isScrubbing || !isPlayingAnimation) {
        actionRef.current.time = animationTime;
        mixerRef.current.update(0);
      }
    }
  }, [animationTime, isScrubbing, isPlayingAnimation]);

  // Reset Model Scale, Pose & Camera Framing to pristine state
  const resetModelTransform = useCallback(() => {
    if (motionWrapperRef.current) {
      motionWrapperRef.current.position.set(0, 0, 0);
      motionWrapperRef.current.rotation.set(0, 0, 0);
      motionWrapperRef.current.quaternion.set(0, 0, 0, 1);
      motionWrapperRef.current.scale.set(1, 1, 1);
    }
    if (mixerRef.current) {
      mixerRef.current.setTime(0);
      if (actionRef.current) {
        actionRef.current.time = 0;
      }
      mixerRef.current.update(0);
    }
    if (cameraRef.current && controlsRef.current) {
      const dist = defaultCameraDistanceRef.current;
      const target = defaultCameraTargetRef.current;
      controlsRef.current.target.copy(target);
      cameraRef.current.position.set(dist * 0.9, target.y + dist * 0.5, dist * 1.1);
      controlsRef.current.update();
    }
    if (onAnimationTimeUpdateRef.current && actionRef.current) {
      onAnimationTimeUpdateRef.current(0, actionRef.current.getClip().duration);
    }
  }, []);

  // Handle explicit resetTransformSignal
  useEffect(() => {
    if (resetTransformSignal !== undefined && resetTransformSignal > 0) {
      resetModelTransform();
    }
  }, [resetTransformSignal, resetModelTransform]);

  // Handle Camera Snap Signal
  useEffect(() => {
    if (!cameraSnapSignal || !cameraRef.current || !controlsRef.current) return;

    const camera = cameraRef.current;
    const controls = controlsRef.current;
    const dist = defaultCameraDistanceRef.current;
    const target = controls.target;

    switch (cameraSnapSignal) {
      case 'front':
        camera.position.set(target.x, target.y, target.z + dist);
        break;
      case 'top':
        camera.position.set(target.x, target.y + dist, target.z + 0.001);
        break;
      case 'side':
        camera.position.set(target.x + dist, target.y, target.z);
        break;
      case 'isometric':
        camera.position.set(target.x + dist * 0.7, target.y + dist * 0.7, target.z + dist * 0.7);
        break;
      case 'reset':
        resetModelTransform();
        break;
    }
    controls.update();
  }, [cameraSnapSignal, resetModelTransform]);

  // Handle Screenshot
  useEffect(() => {
    if (shouldTakeScreenshot && rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      const dataUrl = rendererRef.current.domElement.toDataURL('image/png');
      
      // Trigger download
      const link = document.createElement('a');
      link.download = `${model?.name || '3d-model'}-screenshot.png`;
      link.href = dataUrl;
      link.click();

      if (onScreenshotDone) {
        onScreenshotDone();
      }
    }
  }, [shouldTakeScreenshot, model?.name, onScreenshotDone]);

  return (
    <div
      ref={containerRef}
      id="three-canvas-container"
      className="relative w-full h-full select-none overflow-hidden bg-slate-950 flex items-center justify-center"
    >
      <canvas ref={canvasRef} id="three-webgl-canvas" className="w-full h-full block touch-none cursor-grab active:cursor-grabbing" />

      {/* Loading Overlay with Interactive Stop */}
      {loadingProgress !== null && (
        <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center z-20 text-white px-6 text-center animate-in fade-in duration-200">
          <div className="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin mb-4" />
          <p className="text-base font-semibold text-slate-100 mb-1">3D 모델 로딩 및 파싱 중...</p>
          <p className="text-xs text-slate-400 mb-4 max-w-xs truncate">{model?.name || '3D 파일'}</p>
          
          <div className="w-64 max-w-full bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-700">
            <div
              className="bg-cyan-500 h-2.5 rounded-full transition-all duration-200 shadow-sm shadow-cyan-500/50"
              style={{ width: `${Math.max(5, loadingProgress)}%` }}
            />
          </div>
          <span className="text-xs text-slate-400 mt-2 font-mono">{loadingProgress}%</span>

          <button
            type="button"
            onClick={() => {
              setLoadError('사용자에 의해 로딩이 취소되었습니다. 대용량 파일은 브라우저 메모리 부담이 적은 Mid/Low 버전이나 .GLB 포맷 변환 후 시도해주세요.');
              setLoadingProgress(null);
            }}
            className="mt-6 px-3.5 py-1.5 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-xl text-xs font-medium text-slate-300 transition-colors flex items-center gap-1.5"
          >
            <XCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>로딩 중단하기</span>
          </button>
        </div>
      )}

      {/* Structured Actionable Error Modal */}
      {loadError && (
        <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center z-20 text-white p-6 overflow-y-auto">
          <div className="max-w-md w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl text-left space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">3D 모델 로딩 중단</h3>
                <p className="text-xs text-rose-300/90 font-medium">응답 시간 초과 또는 파싱 불가</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
              {loadError}
            </p>

            {/* Recommended Troubleshooting Action Steps */}
            <div className="space-y-2 pt-1">
              <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>권장 조치사항 (해결 방법)</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-1.5 pl-1">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Mid / Low 버전 사용</strong>: High-poly(수백만 폴리곤) 대신 게임/웹용 최적화 모델을 선택해 주세요.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>.GLB 포맷 변환</strong>: Blender 등에서 GLB로 내보내면 텍스처와 메시가 하나의 압축 바이너리로 패키징되어 가장 원활히 실행됩니다.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>STL / OBJ 활용</strong>: 단일 지오메트리 파일은 즉시 PBR 질감으로 자동 렌더링됩니다.</span>
                </li>
              </ul>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setLoadError(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-all"
              >
                닫기
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoadError(null);
                  if (model) {
                    // Re-trigger load by brief state reset
                    setLoadingProgress(0);
                  }
                }}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>다시 시도</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
