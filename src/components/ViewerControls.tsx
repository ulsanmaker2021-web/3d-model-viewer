import React, { useState } from 'react';
import {
  Sun,
  Eye,
  Camera,
  RotateCw,
  Grid,
  Sparkles,
  Maximize2,
  Minimize2,
  Info,
  Layers,
  Palette,
  Sliders,
  Compass,
  Download,
  Box,
} from 'lucide-react';
import { ViewerSettings, RenderMode, EnvironmentPreset } from '../types';

interface ViewerControlsProps {
  settings: ViewerSettings;
  onUpdateSettings: (newSettings: Partial<ViewerSettings>) => void;
  onCameraSnap: (view: 'front' | 'top' | 'side' | 'isometric' | 'reset') => void;
  onTakeScreenshot: () => void;
  onOpenModelInfo: () => void;
  onOpenHierarchy: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const ViewerControls: React.FC<ViewerControlsProps> = ({
  settings,
  onUpdateSettings,
  onCameraSnap,
  onTakeScreenshot,
  onOpenModelInfo,
  onOpenHierarchy,
  isFullscreen,
  onToggleFullscreen,
}) => {
  const [activeTab, setActiveTab] = useState<'render' | 'env' | 'lights' | 'camera' | null>(null);

  const renderModes: { id: RenderMode; label: string; icon: string }[] = [
    { id: 'default', label: '텍스처 (PBR)', icon: '🎨' },
    { id: 'wireframe', label: '와이어프레임', icon: '🕸️' },
    { id: 'normals', label: '노멀 맵', icon: '🌈' },
    { id: 'clay', label: '클레이 (조각)', icon: '🗿' },
    { id: 'xray', label: '엑스레이', icon: '🩻' },
  ];

  const envPresets: { id: EnvironmentPreset; label: string; color: string }[] = [
    { id: 'studio', label: '스튜디오 (기본)', color: '#0f172a' },
    { id: 'sunset', label: '노을 (Sunset)', color: '#1a0f1d' },
    { id: 'dawn', label: '새벽 (Dawn)', color: '#0f1b29' },
    { id: 'night', label: '사이버펑크 야경', color: '#05070d' },
    { id: 'pure_white', label: '퓨어 화이트', color: '#f8fafc' },
    { id: 'dark_room', label: '다크 룸', color: '#020617' },
  ];

  const toggleTab = (tab: 'render' | 'env' | 'lights' | 'camera') => {
    setActiveTab((prev) => (prev === tab ? null : tab));
  };

  return (
    <div className="absolute top-4 left-4 right-4 flex flex-col items-start gap-2 pointer-events-none z-10">
      {/* Top Floating Control Bar */}
      <div className="flex flex-wrap items-center justify-between w-full gap-2">
        {/* Left Action Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-900/85 backdrop-blur-md border border-slate-700/70 rounded-2xl pointer-events-auto shadow-xl shadow-black/40">
          <button
            id="btn-ctrl-render-mode"
            onClick={() => toggleTab('render')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${
              activeTab === 'render'
                ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
            title="렌더 모드 (와이어프레임, 노멀 등)"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>렌더 모드</span>
          </button>

          <button
            id="btn-ctrl-env-preset"
            onClick={() => toggleTab('env')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${
              activeTab === 'env'
                ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
            title="배경 및 환경광 프리셋"
          >
            <Palette className="w-3.5 h-3.5" />
            <span>환경 / 배경</span>
          </button>

          <button
            id="btn-ctrl-lights"
            onClick={() => toggleTab('lights')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${
              activeTab === 'lights'
                ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
            title="조명 세부 조절"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>조명 조절</span>
          </button>

          <button
            id="btn-ctrl-camera"
            onClick={() => toggleTab('camera')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${
              activeTab === 'camera'
                ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
            title="카메라 시점 뷰 프리셋"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>카메라 뷰</span>
          </button>

          <div className="h-4 w-px bg-slate-700 mx-1" />

          {/* Auto Rotate Toggle */}
          <button
            id="btn-ctrl-auto-rotate"
            onClick={() => onUpdateSettings({ autoRotate: !settings.autoRotate })}
            className={`p-1.5 rounded-xl text-xs transition-all ${
              settings.autoRotate
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
            }`}
            title="자동 회전 (360° 회전 보기)"
          >
            <RotateCw className={`w-4 h-4 ${settings.autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
          </button>

          {/* Grid Toggle */}
          <button
            id="btn-ctrl-grid"
            onClick={() => onUpdateSettings({ showGrid: !settings.showGrid })}
            className={`p-1.5 rounded-xl text-xs transition-all ${
              settings.showGrid
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
            }`}
            title="바닥 격자선(그리드) 켜기/끄기"
          >
            <Grid className="w-4 h-4" />
          </button>
        </div>

        {/* Right Action Group */}
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-900/85 backdrop-blur-md border border-slate-700/70 rounded-2xl pointer-events-auto shadow-xl shadow-black/40">
          <button
            id="btn-ctrl-hierarchy"
            onClick={onOpenHierarchy}
            className="p-1.5 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all flex items-center gap-1.5 px-2.5"
            title="메시 계층 구조 (개별 파츠 숨김/표시)"
          >
            <Layers className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline font-medium">부품 계층</span>
          </button>

          <button
            id="btn-ctrl-info"
            onClick={onOpenModelInfo}
            className="p-1.5 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all flex items-center gap-1.5 px-2.5"
            title="모델 정보 및 폴리곤 통계"
          >
            <Info className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline font-medium">모델 정보</span>
          </button>

          <div className="h-4 w-px bg-slate-700 mx-1" />

          {/* Screenshot */}
          <button
            id="btn-ctrl-screenshot"
            onClick={onTakeScreenshot}
            className="p-1.5 rounded-xl text-xs text-slate-300 hover:text-cyan-300 hover:bg-slate-800/80 transition-all"
            title="고화질 스크린샷 캡처 및 다운로드"
          >
            <Camera className="w-4 h-4" />
          </button>

          {/* Fullscreen */}
          <button
            id="btn-ctrl-fullscreen"
            onClick={onToggleFullscreen}
            className="p-1.5 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all"
            title={isFullscreen ? '전체화면 종료' : '전체화면으로 보기'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Submenus */}
      {activeTab === 'render' && (
        <div className="p-3 bg-slate-900/95 backdrop-blur-lg border border-slate-700/80 rounded-2xl pointer-events-auto shadow-2xl shadow-black/60 flex flex-col gap-2 max-w-sm">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">렌더링 모드 선택</span>
          <div className="grid grid-cols-2 gap-1.5">
            {renderModes.map((mode) => (
              <button
                key={mode.id}
                id={`btn-render-${mode.id}`}
                onClick={() => onUpdateSettings({ renderMode: mode.id })}
                className={`px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2 border transition-all text-left ${
                  settings.renderMode === mode.id
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-semibold'
                    : 'bg-slate-800/60 border-slate-700/50 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span>{mode.icon}</span>
                <span>{mode.label}</span>
              </button>
            ))}
          </div>

          {settings.renderMode === 'wireframe' && (
            <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-300">와이어프레임 색상</span>
              <div className="flex items-center gap-1.5">
                {['#38bdf8', '#4ade80', '#f43f5e', '#fbbf24', '#ffffff'].map((color) => (
                  <button
                    key={color}
                    onClick={() => onUpdateSettings({ wireframeColor: color })}
                    className={`w-5 h-5 rounded-full border ${
                      settings.wireframeColor === color ? 'ring-2 ring-white scale-110' : 'border-slate-700'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'env' && (
        <div className="p-3 bg-slate-900/95 backdrop-blur-lg border border-slate-700/80 rounded-2xl pointer-events-auto shadow-2xl shadow-black/60 flex flex-col gap-2 max-w-sm">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">배경 및 환경광 프리셋</span>
          <div className="grid grid-cols-2 gap-1.5">
            {envPresets.map((env) => (
              <button
                key={env.id}
                id={`btn-env-${env.id}`}
                onClick={() => onUpdateSettings({ environment: env.id, backgroundColor: env.color })}
                className={`px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2 border transition-all text-left ${
                  settings.environment === env.id
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-semibold'
                    : 'bg-slate-800/60 border-slate-700/50 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="w-3.5 h-3.5 rounded-full border border-slate-600 shrink-0" style={{ backgroundColor: env.color }} />
                <span className="truncate">{env.label}</span>
              </button>
            ))}
          </div>

          <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-300">바닥 그림자 효과</span>
            <button
              onClick={() => onUpdateSettings({ showShadows: !settings.showShadows })}
              className={`px-2 py-1 rounded-lg font-medium text-[11px] ${
                settings.showShadows ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {settings.showShadows ? '그림자 켜짐' : '그림자 꺼짐'}
            </button>
          </div>
        </div>
      )}

      {activeTab === 'lights' && (
        <div className="p-3 bg-slate-900/95 backdrop-blur-lg border border-slate-700/80 rounded-2xl pointer-events-auto shadow-2xl shadow-black/60 flex flex-col gap-3 min-w-[280px]">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">조명 강도 조절</span>
          
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-xs text-slate-300">
              <span>환경광 (Ambient)</span>
              <span className="font-mono text-cyan-400">{settings.ambientLightIntensity.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="2.5"
              step="0.1"
              value={settings.ambientLightIntensity}
              onChange={(e) => onUpdateSettings({ ambientLightIntensity: parseFloat(e.target.value) })}
              className="accent-cyan-400 w-full h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-xs text-slate-300">
              <span>주 조명 (Directional Sun)</span>
              <span className="font-mono text-cyan-400">{settings.directionalLightIntensity.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="3.0"
              step="0.1"
              value={settings.directionalLightIntensity}
              onChange={(e) => onUpdateSettings({ directionalLightIntensity: parseFloat(e.target.value) })}
              className="accent-cyan-400 w-full h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-xs text-slate-300">
              <span>포인트/림 조명 (Rim Light)</span>
              <span className="font-mono text-cyan-400">{settings.pointLightIntensity.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="3.0"
              step="0.1"
              value={settings.pointLightIntensity}
              onChange={(e) => onUpdateSettings({ pointLightIntensity: parseFloat(e.target.value) })}
              className="accent-cyan-400 w-full h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      )}

      {activeTab === 'camera' && (
        <div className="p-3 bg-slate-900/95 backdrop-blur-lg border border-slate-700/80 rounded-2xl pointer-events-auto shadow-2xl shadow-black/60 flex flex-col gap-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">카메라 시점 뷰 스냅</span>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={() => onCameraSnap('front')}
              className="px-2.5 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium text-center transition-all"
            >
              정면 (Front)
            </button>
            <button
              onClick={() => onCameraSnap('top')}
              className="px-2.5 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium text-center transition-all"
            >
              상단 (Top)
            </button>
            <button
              onClick={() => onCameraSnap('side')}
              className="px-2.5 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium text-center transition-all"
            >
              측면 (Side)
            </button>
            <button
              onClick={() => onCameraSnap('isometric')}
              className="px-2.5 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium text-center transition-all"
            >
              아이소메트릭 (Iso)
            </button>
            <button
              onClick={() => onCameraSnap('reset')}
              className="col-span-2 px-2.5 py-1.5 bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30 rounded-xl text-xs font-semibold text-center transition-all"
            >
              초기 뷰 리셋
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
