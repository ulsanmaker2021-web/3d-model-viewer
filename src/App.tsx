import React, { useState, useEffect, useCallback, useRef } from 'react';
import { DEFAULT_MODELS } from './data/defaultModels';
import { ModelItem, ModelStats, MeshNodeInfo, ViewerSettings } from './types';
import {
  saveModelToDB,
  getAllCustomModelsFromDB,
  deleteModelFromDB,
  updateModelInDB,
} from './utils/indexedDB';
import { ThreeCanvas } from './components/ThreeCanvas';
import { GalleryGrid } from './components/GalleryGrid';
import { ViewerControls } from './components/ViewerControls';
import { AnimationBar } from './components/AnimationBar';
import { UploadModal } from './components/UploadModal';
import { ModelInfoModal } from './components/ModelInfoModal';
import { HierarchyTreeModal } from './components/HierarchyTreeModal';
import { HelpModal } from './components/HelpModal';
import { HeritageModal } from './components/HeritageModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { AIAnimationModal } from './components/AIAnimationModal';
import { Header } from './components/Header';
import { AIAnimationResult } from './utils/aiAnimationGenerator';
import * as THREE from 'three';
import { Sparkles } from 'lucide-react';

export default function App() {
  const [models, setModels] = useState<ModelItem[]>(DEFAULT_MODELS);
  const [activeModel, setActiveModel] = useState<ModelItem>(DEFAULT_MODELS[0]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Viewer Configuration Settings
  const [settings, setSettings] = useState<ViewerSettings>({
    renderMode: 'default',
    environment: 'studio',
    backgroundColor: '#0f172a',
    showGrid: true,
    showShadows: true,
    autoRotate: false,
    autoRotateSpeed: 2.0,
    wireframeColor: '#38bdf8',
    ambientLightIntensity: 1.0,
    directionalLightIntensity: 1.5,
    pointLightIntensity: 1.0,
    lightColor: '#ffffff',
    cameraFov: 45,
  });

  // Animation States
  const [activeAnimationIndex, setActiveAnimationIndex] = useState<number>(0);
  const [isPlayingAnimation, setIsPlayingAnimation] = useState<boolean>(true);
  const [animationSpeed, setAnimationSpeed] = useState<number>(1.0);
  const [animationTime, setAnimationTime] = useState<number>(0);
  const [animationDuration, setAnimationDuration] = useState<number>(1);
  const [isScrubbing, setIsScrubbing] = useState<boolean>(false);
  const [customClips, setCustomClips] = useState<THREE.AnimationClip[]>([]);

  // Model Metadata & Hierarchy States
  const [currentStats, setCurrentStats] = useState<ModelStats | null>(null);
  const [hierarchy, setHierarchy] = useState<MeshNodeInfo[]>([]);
  const [hiddenMeshIds, setHiddenMeshIds] = useState<Set<string>>(new Set());

  // Interactive Signals
  const [cameraSnapSignal, setCameraSnapSignal] = useState<'front' | 'top' | 'side' | 'isometric' | 'reset' | null>(null);
  const [resetTransformSignal, setResetTransformSignal] = useState<number>(0);
  const [shouldTakeScreenshot, setShouldTakeScreenshot] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Modals
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [isModelInfoOpen, setIsModelInfoOpen] = useState<boolean>(false);
  const [isHierarchyOpen, setIsHierarchyOpen] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [isHeritageOpen, setIsHeritageOpen] = useState<boolean>(false);
  const [isAIAnimationOpen, setIsAIAnimationOpen] = useState<boolean>(false);
  const [modelToDelete, setModelToDelete] = useState<ModelItem | null>(null);

  const mainContainerRef = useRef<HTMLDivElement>(null);

  // Load custom models from IndexedDB on initial mount
  useEffect(() => {
    async function loadSavedModels() {
      try {
        const saved = await getAllCustomModelsFromDB();
        if (saved && saved.length > 0) {
          setModels([...saved, ...DEFAULT_MODELS]);
        }
      } catch (err) {
        console.error('Error loading stored models:', err);
      }
    }
    loadSavedModels();
  }, []);

  // Update settings handler
  const handleUpdateSettings = useCallback((newSettings: Partial<ViewerSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  // Switch Active Model
  const handleSelectModel = useCallback((model: ModelItem) => {
    setActiveModel(model);
    setActiveAnimationIndex(0);
    setIsPlayingAnimation(true);
    setAnimationTime(0);
    setHiddenMeshIds(new Set());
    setCustomClips([]);
  }, []);

  // Handle Model Stats Loaded from Three.js
  const handleStatsLoaded = useCallback((stats: ModelStats, nodeTree: MeshNodeInfo[]) => {
    setCurrentStats(stats);
    setHierarchy(nodeTree);
    if (stats.animations && stats.animations.length > 0) {
      setActiveAnimationIndex(0);
    }
  }, []);

  // Handle AI / Standard Motion Applied
  const handleApplyAIAnimation = useCallback((result: AIAnimationResult) => {
    setCustomClips((prev) => {
      const nextClips = [...prev, result.clip];
      // Target index is native clips count + new clip index in customClips
      setCurrentStats((latest) => {
        const existing = latest?.animations || [];
        const updated = [...existing, result.clipName];
        const newIndex = updated.length - 1;
        setActiveAnimationIndex(newIndex);
        return latest
          ? {
              ...latest,
              animationCount: updated.length,
              animations: updated,
            }
          : latest;
      });
      return nextClips;
    });

    setIsPlayingAnimation(true);
    setAnimationTime(0);
  }, []);

  // Handle Thumbnail Generation
  const handleThumbnailGenerated = useCallback((dataUrl: string) => {
    if (!activeModel) return;

    setModels((prev) =>
      prev.map((m) => {
        if (m.id === activeModel.id && !m.thumbnail) {
          return { ...m, thumbnail: dataUrl };
        }
        return m;
      })
    );

    // If custom model, update thumbnail in IndexedDB
    if (activeModel.isCustomUpload) {
      updateModelInDB(activeModel.id, { thumbnail: dataUrl }).catch(console.error);
    }
  }, [activeModel]);

  // Handle New Upload Success
  const handleUploadSuccess = useCallback(async (newModel: ModelItem) => {
    try {
      await saveModelToDB(newModel);
      setModels((prev) => [newModel, ...prev]);
      setActiveModel(newModel);
      setActiveAnimationIndex(0);
      setIsPlayingAnimation(true);
      setHiddenMeshIds(new Set());
    } catch (err) {
      console.error('Failed to save uploaded model to DB:', err);
      setModels((prev) => [newModel, ...prev]);
      setActiveModel(newModel);
    }
  }, []);

  // Handle Model Delete Initiation
  const handleDeleteModel = useCallback((model: ModelItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setModelToDelete(model);
  }, []);

  // Confirm Model Delete Execution
  const handleConfirmDelete = useCallback(async () => {
    if (!modelToDelete) return;
    const targetId = modelToDelete.id;

    try {
      await deleteModelFromDB(targetId);
      setModels((prev) => {
        const next = prev.filter((m) => m.id !== targetId);
        if (activeModel.id === targetId) {
          setActiveModel(next[0] || DEFAULT_MODELS[0]);
        }
        return next;
      });
      setModelToDelete(null);
    } catch (err) {
      console.error('Failed to delete model from DB:', err);
      // Fallback state update even if DB fails
      setModels((prev) => {
        const next = prev.filter((m) => m.id !== targetId);
        if (activeModel.id === targetId) {
          setActiveModel(next[0] || DEFAULT_MODELS[0]);
        }
        return next;
      });
      setModelToDelete(null);
    }
  }, [modelToDelete, activeModel.id]);

  // Mesh Visibility Toggles
  const handleToggleMeshVisibility = useCallback((id: string) => {
    setHiddenMeshIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleShowAllMeshes = useCallback(() => {
    setHiddenMeshIds(new Set());
  }, []);

  // Camera view snap
  const handleCameraSnap = useCallback((view: 'front' | 'top' | 'side' | 'isometric' | 'reset') => {
    setCameraSnapSignal(view);
    setTimeout(() => setCameraSnapSignal(null), 100);
  }, []);

  // Reset Model Scale, Pose and Camera to pristine normalized state
  const handleResetModelTransform = useCallback(() => {
    setResetTransformSignal((prev) => prev + 1);
    setCameraSnapSignal('reset');
    setTimeout(() => setCameraSnapSignal(null), 100);
  }, []);

  // Screenshot
  const handleTakeScreenshot = useCallback(() => {
    setShouldTakeScreenshot(true);
  }, []);

  const handleScreenshotDone = useCallback(() => {
    setShouldTakeScreenshot(false);
  }, []);

  // Fullscreen toggle
  const handleToggleFullscreen = useCallback(() => {
    if (!mainContainerRef.current) return;
    if (!document.fullscreenElement) {
      mainContainerRef.current.requestFullscreen().catch(console.error);
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(console.error);
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div
      ref={mainContainerRef}
      className="flex flex-col w-screen h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans select-none"
    >
      {/* Top Header */}
      <Header
        currentModel={activeModel}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        onOpenUpload={() => setIsUploadModalOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenHeritage={() => setIsHeritageOpen(true)}
        onOpenAIAnimation={() => setIsAIAnimationOpen(true)}
      />

      {/* Main Workspace: Sidebar + 3D Viewport */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Gallery Sidebar */}
        <div
          className={`transition-all duration-300 ease-in-out shrink-0 h-full z-20 ${
            isSidebarOpen
              ? 'w-80 md:w-88'
              : 'w-0 -translate-x-full overflow-hidden opacity-0 pointer-events-none'
          }`}
        >
          <GalleryGrid
            models={models}
            activeModelId={activeModel?.id || null}
            onSelectModel={handleSelectModel}
            onOpenUpload={() => setIsUploadModalOpen(true)}
            onDeleteModel={handleDeleteModel}
          />
        </div>

        {/* 3D Canvas Stage */}
        <div className="flex-1 relative h-full bg-slate-950 overflow-hidden">
          {/* Floating Toolbar Controls */}
          <ViewerControls
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onCameraSnap={handleCameraSnap}
            onResetModelTransform={handleResetModelTransform}
            onTakeScreenshot={handleTakeScreenshot}
            onOpenModelInfo={() => setIsModelInfoOpen(true)}
            onOpenHierarchy={() => setIsHierarchyOpen(true)}
            onOpenAIAnimation={() => setIsAIAnimationOpen(true)}
            isFullscreen={isFullscreen}
            onToggleFullscreen={handleToggleFullscreen}
          />

          {/* Three.js Core WebGL Canvas */}
          <ThreeCanvas
            model={activeModel}
            settings={settings}
            activeAnimationIndex={activeAnimationIndex}
            isPlayingAnimation={isPlayingAnimation}
            animationSpeed={animationSpeed}
            animationTime={animationTime}
            isScrubbing={isScrubbing}
            customClips={customClips}
            onAnimationTimeUpdate={(curTime, dur) => {
              setAnimationTime(curTime);
              setAnimationDuration(dur);
            }}
            onStatsLoaded={handleStatsLoaded}
            onThumbnailGenerated={handleThumbnailGenerated}
            hiddenMeshIds={hiddenMeshIds}
            cameraSnapSignal={cameraSnapSignal}
            resetTransformSignal={resetTransformSignal}
            shouldTakeScreenshot={shouldTakeScreenshot}
            onScreenshotDone={handleScreenshotDone}
          />

          {/* No Animation Suggestion Banner for Static 3D Models */}
          {currentStats && (!currentStats.animations || currentStats.animations.length === 0) && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md border border-cyan-500/40 rounded-2xl px-4 py-2.5 shadow-2xl shadow-black/70 z-10 flex flex-wrap items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span className="text-xs text-slate-200 font-medium">
                  현재 정적(Static) 3D 모델입니다.
                </span>
              </div>
              <button
                id="btn-trigger-ai-motion-banner"
                onClick={() => setIsAIAnimationOpen(true)}
                className="px-3 py-1.5 bg-gradient-to-r from-indigo-500 via-cyan-500 to-teal-500 hover:from-indigo-400 hover:to-cyan-400 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20 active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                <span>✨ AI 모션 생성하기</span>
              </button>
            </div>
          )}

          {/* Bottom Animation Controller */}
          {currentStats && currentStats.animations && currentStats.animations.length > 0 && (
            <AnimationBar
              animations={currentStats.animations}
              activeAnimationIndex={activeAnimationIndex}
              onSelectAnimation={(idx) => setActiveAnimationIndex(idx)}
              isPlaying={isPlayingAnimation}
              onTogglePlay={() => setIsPlayingAnimation((prev) => !prev)}
              onResetPose={handleResetModelTransform}
              currentTime={animationTime}
              duration={animationDuration}
              onSeek={(t) => setAnimationTime(t)}
              onStartScrubbing={() => setIsScrubbing(true)}
              onEndScrubbing={() => setIsScrubbing(false)}
              speed={animationSpeed}
              onChangeSpeed={(s) => setAnimationSpeed(s)}
            />
          )}
        </div>
      </div>

      {/* AI 3D Animation Generator Modal */}
      <AIAnimationModal
        isOpen={isAIAnimationOpen}
        onClose={() => setIsAIAnimationOpen(false)}
        model={activeModel}
        stats={currentStats}
        hierarchy={hierarchy}
        onApplyAnimation={handleApplyAIAnimation}
        onResetPose={handleResetModelTransform}
      />

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />

      {/* Model Info & Stats Modal */}
      <ModelInfoModal
        isOpen={isModelInfoOpen}
        onClose={() => setIsModelInfoOpen(false)}
        model={activeModel}
        stats={currentStats}
      />

      {/* Hierarchy Parts Modal */}
      <HierarchyTreeModal
        isOpen={isHierarchyOpen}
        onClose={() => setIsHierarchyOpen(false)}
        hierarchy={hierarchy}
        hiddenMeshIds={hiddenMeshIds}
        onToggleMeshVisibility={handleToggleMeshVisibility}
        onShowAllMeshes={handleShowAllMeshes}
      />

      {/* Help & Controls Guide Modal */}
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      {/* Heritage & AI Generation Modal */}
      <HeritageModal
        isOpen={isHeritageOpen}
        onClose={() => setIsHeritageOpen(false)}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!modelToDelete}
        model={modelToDelete}
        onClose={() => setModelToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
