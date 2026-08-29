import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  X,
  Play,
  RotateCw,
  RotateCcw,
  Zap,
  Layers,
  Wand2,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Compass,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { ModelItem, ModelStats, MeshNodeInfo } from '../types';
import {
  SHAPE_CATEGORIES,
  ShapeCategory,
  STANDARD_MOTION_LIBRARY,
  StandardMotionPreset,
  detectModelCategory,
  buildStandardMotionClip,
  generateAIAnimation,
  AIAnimationResult,
} from '../utils/aiAnimationGenerator';

interface AIAnimationModalProps {
  isOpen: boolean;
  onClose: () => void;
  model: ModelItem | null;
  stats: ModelStats | null;
  hierarchy: MeshNodeInfo[];
  onApplyAnimation: (result: AIAnimationResult) => void;
  onResetPose?: () => void;
}

export const AIAnimationModal: React.FC<AIAnimationModalProps> = ({
  isOpen,
  onClose,
  model,
  stats,
  hierarchy,
  onApplyAnimation,
  onResetPose,
}) => {
  // Automatically detect the best initial category for the active model
  const detectedCategory = useMemo<ShapeCategory>(() => {
    if (!model) return 'humanoid';
    return detectModelCategory(model, stats);
  }, [model, stats]);

  const [activeCategory, setActiveCategory] = useState<ShapeCategory>(detectedCategory);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('humanoid_walk');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isApplying, setIsApplying] = useState<boolean>(false);
  const [lastGenerated, setLastGenerated] = useState<AIAnimationResult | null>(null);

  // Sync activeCategory when model changes
  React.useEffect(() => {
    setActiveCategory(detectedCategory);
  }, [detectedCategory]);

  if (!isOpen || !model) return null;

  const currentCategoryPresets = STANDARD_MOTION_LIBRARY.filter(
    (p) => p.category === activeCategory
  );

  const handleApplyPreset = (preset: StandardMotionPreset) => {
    setSelectedPresetId(preset.id);
    setIsApplying(true);

    try {
      const result = buildStandardMotionClip(preset.id, model.name, stats?.dimensions);
      setLastGenerated(result);
      onApplyAnimation(result);
    } catch (err) {
      console.error('Error applying standard 3D motion:', err);
    } finally {
      setTimeout(() => setIsApplying(false), 250);
    }
  };

  const handleCustomPromptSubmit = async () => {
    if (!customPrompt.trim()) return;
    setIsApplying(true);

    try {
      const result = await generateAIAnimation(
        model,
        stats,
        hierarchy,
        'custom',
        customPrompt
      );
      setLastGenerated(result);
      onApplyAnimation(result);
    } catch (err) {
      console.error('Error in custom motion mapping:', err);
    } finally {
      setTimeout(() => setIsApplying(false), 250);
    }
  };

  const promptSuggestions = [
    '리듬감 있는 걷기와 좌우 스웨이 보행',
    '신나는 댄스와 그루브 바운스',
    '반갑게 인사하며 고개 끄덕임',
    '공중에 부드럽게 떠오르는 영적 명상 부유',
    '360도 프리미엄 박물관 턴테이블 쇼케이스',
    '노면 요철을 완충하는 고속 주행 서스펜션',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-4xl max-h-[92vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl shadow-black/90 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>3D 형상 분류 표준 모션 스튜디오</span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-full">
                  100% 확실한 검증 모션
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                예측 불가능한 오동작을 배제하고, 모델 형상에 최적화된 고품질 3D 표준 키네마틱스 모션을 적용합니다.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
            title="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 custom-scrollbar">
          {/* Target Model Banner & Auto-Classification */}
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 flex items-center justify-center font-bold text-cyan-300 text-sm">
                3D
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-100">{model.name}</h4>
                  <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-md">
                    {model.format?.toUpperCase() || '3D'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                  <span>크기: {stats?.dimensions ? `${stats.dimensions.x} × ${stats.dimensions.y} × ${stats.dimensions.z}` : '3.0 Units'}</span>
                  <span>•</span>
                  <span>메쉬: {stats?.meshCount || 1}개</span>
                  <span>•</span>
                  <span>삼각형: {stats?.triangleCount?.toLocaleString() || 0}개</span>
                </div>
              </div>
            </div>

            {/* AI Auto Detected Badge */}
            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-xs flex items-center gap-1.5">
                <span className="text-cyan-400 font-semibold">자동 감지 추천:</span>
                <span className="text-white font-bold">
                  {SHAPE_CATEGORIES.find((c) => c.id === detectedCategory)?.icon}{' '}
                  {SHAPE_CATEGORIES.find((c) => c.id === detectedCategory)?.label.split('/')[0].trim()}
                </span>
              </div>
            </div>
          </div>

          {/* Last Applied Banner */}
          {lastGenerated && (
            <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 flex items-center justify-between animate-in fade-in">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <h5 className="text-xs font-bold text-emerald-300">
                    성공적으로 적용 및 재생 중: {lastGenerated.clipName}
                  </h5>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    {lastGenerated.aiInsight}
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20 shrink-0 ml-2">
                {lastGenerated.duration}초 루프
              </span>
            </div>
          )}

          {/* Category Tabs */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>3D 형상 카테고리 선택</span>
              </label>
              <span className="text-[11px] text-slate-400">
                총 {STANDARD_MOTION_LIBRARY.length}개의 정밀 3D 표준 모션 지원
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {SHAPE_CATEGORIES.map((category) => {
                const count = STANDARD_MOTION_LIBRARY.filter((p) => p.category === category.id).length;
                const isSelected = activeCategory === category.id;
                const isRecommended = detectedCategory === category.id;

                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`p-3 rounded-xl border transition-all text-left flex flex-col justify-between cursor-pointer relative ${
                      isSelected
                        ? 'bg-gradient-to-b from-cyan-950/60 to-slate-900 border-cyan-500 text-white shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/50'
                        : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                    }`}
                  >
                    {isRecommended && (
                      <span className="absolute -top-2 right-2 px-1.5 py-0.2 bg-cyan-500 text-slate-950 font-extrabold text-[9px] rounded-full shadow-sm">
                        추천
                      </span>
                    )}
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xl">{category.icon}</span>
                      <span className="text-xs font-bold truncate">{category.label.split('/')[0]}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="truncate">{category.label.split('/')[1] || ''}</span>
                      <span className="font-mono text-cyan-400 text-[10px] px-1.5 py-0.5 bg-slate-800 rounded">
                        {count}개
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Motion Presets Grid for Active Category */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>
                  {SHAPE_CATEGORIES.find((c) => c.id === activeCategory)?.label} 표준 모션 라이브러리
                </span>
              </label>
              <span className="text-[11px] text-cyan-400 font-medium">
                클릭 시 3D 뷰어에 즉시 적용 및 무한 루프 재생
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentCategoryPresets.map((preset) => {
                const isSelected = selectedPresetId === preset.id;

                return (
                  <div
                    key={preset.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col justify-between group ${
                      isSelected
                        ? 'bg-gradient-to-r from-cyan-950/50 via-slate-900 to-indigo-950/50 border-cyan-500 text-white shadow-md shadow-cyan-500/10 ring-1 ring-cyan-500/40'
                        : 'bg-slate-800/50 border-slate-700/70 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl p-1.5 rounded-lg bg-slate-800 border border-slate-700/60 group-hover:scale-110 transition-transform">
                            {preset.icon}
                          </span>
                          <div>
                            <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                              {preset.title}
                            </h4>
                            <span className="text-[10px] font-mono text-cyan-400/80">
                              {preset.durationSec}초 시퀀스 루프
                            </span>
                          </div>
                        </div>

                        <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-800 text-cyan-300 border border-cyan-500/30 rounded-md">
                          {preset.highlightTag}
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 leading-relaxed mt-1">
                        {preset.description}
                      </p>
                    </div>

                    <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>왜곡 없는 정규화 스케일</span>
                      </span>

                      <button
                        onClick={() => handleApplyPreset(preset)}
                        disabled={isApplying}
                        className="px-3.5 py-1.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20 active:scale-95 cursor-pointer disabled:opacity-50"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>즉시 적용 & 재생</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Natural Language Prompt Fallback / Assistant */}
          <div className="space-y-2.5 pt-3 border-t border-slate-800">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Wand2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>자연어 키워드로 모션 검색 & 매핑</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="예: 리듬감 있는 걷기, 신나는 댄스, 고속 주행, 불상 부유 등..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCustomPromptSubmit();
                }}
                disabled={isApplying}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all"
              />
              <button
                onClick={handleCustomPromptSubmit}
                disabled={isApplying || !customPrompt.trim()}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/25 disabled:opacity-50 cursor-pointer shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>스마트 매핑 적용</span>
              </button>
            </div>

            {/* Suggestions */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {promptSuggestions.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCustomPrompt(s);
                  }}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 text-slate-400 hover:text-slate-200 transition-all text-left cursor-pointer"
                >
                  "{s}"
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/80 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>안전 스케일 가드 활성 (0.92~1.08x 보호)</span>
            </div>
            <span className="hidden sm:inline text-[11px] text-slate-500">•</span>
            <span className="hidden sm:inline text-[11px]">하단 타임라인에서 0.25x~2x 배속 제어 및 일시정지가 가능합니다.</span>
          </div>

          <div className="flex items-center gap-2">
            {onResetPose && (
              <button
                type="button"
                onClick={onResetPose}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                title="오브젝트 원래 크기 및 기본 포즈 복원"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>스케일/포즈 리셋</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all cursor-pointer"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
