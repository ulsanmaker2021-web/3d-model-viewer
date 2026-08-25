export interface ModelItem {
  id: string;
  name: string;
  description?: string;
  url: string; // Blob URL or remote CDN URL
  blob?: Blob; // For IndexedDB persistence
  isCustomUpload: boolean;
  format?: 'glb' | 'gltf' | 'obj' | 'stl' | 'ply' | 'fbx' | 'other';
  sizeBytes?: number;
  uploadedAt?: number;
  thumbnail?: string; // Data URL thumbnail
  category?: 'character' | 'vehicle' | 'prop' | 'architecture' | 'animated' | 'custom';
  tags?: string[];
  stats?: ModelStats;
}

export interface ModelStats {
  triangleCount: number;
  vertexCount: number;
  meshCount: number;
  materialCount: number;
  animationCount: number;
  animations: string[];
  dimensions: {
    x: number;
    y: number;
    z: number;
  };
}

export interface MeshNodeInfo {
  id: string;
  name: string;
  type: string;
  visible: boolean;
  triangleCount: number;
  children: MeshNodeInfo[];
}

export type RenderMode = 'default' | 'wireframe' | 'normals' | 'clay' | 'xray' | 'points';

export type EnvironmentPreset = 'studio' | 'sunset' | 'dawn' | 'night' | 'neutral' | 'pure_white' | 'dark_room';

export interface ViewerSettings {
  renderMode: RenderMode;
  environment: EnvironmentPreset;
  backgroundColor: string;
  showGrid: boolean;
  showShadows: boolean;
  autoRotate: boolean;
  autoRotateSpeed: number;
  wireframeColor: string;
  ambientLightIntensity: number;
  directionalLightIntensity: number;
  pointLightIntensity: number;
  lightColor: string;
  cameraFov: number;
}
