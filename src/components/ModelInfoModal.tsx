import React from 'react';
import { X, Info, Activity, Box, Maximize, FileText, CheckCircle2, ShieldCheck } from 'lucide-react';
import { ModelItem, ModelStats } from '../types';

interface ModelInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  model: ModelItem | null;
  stats: ModelStats | null;
}

export const ModelInfoModal: React.FC<ModelInfoModalProps> = ({
  isOpen,
  onClose,
  model,
  stats,
}) => {
  if (!isOpen || !model) return null;

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '외부 CDN 스트리밍';
    const mb = bytes / (1024 * 1024);
    if (mb >= 1) return `${mb.toFixed(2)} MB`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-semibold text-white">3D 모델 분석 정보</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto max-h-[70vh]">
          {/* Model Title & Description */}
          <div>
            <h4 className="text-base font-bold text-white mb-1">{model.name}</h4>
            {model.description && <p className="text-xs text-slate-300 leading-relaxed">{model.description}</p>}
          </div>

          {/* Key Metric Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/50">
              <span className="text-[11px] text-slate-400 font-medium">삼각형 (폴리곤) 수</span>
              <div className="text-lg font-bold text-cyan-300 font-mono mt-0.5">
                {stats ? stats.triangleCount.toLocaleString() : '-'}
              </div>
            </div>

            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/50">
              <span className="text-[11px] text-slate-400 font-medium">정점 (Vertices) 수</span>
              <div className="text-lg font-bold text-cyan-300 font-mono mt-0.5">
                {stats ? stats.vertexCount.toLocaleString() : '-'}
              </div>
            </div>

            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/50">
              <span className="text-[11px] text-slate-400 font-medium">메시 (Mesh) 개수</span>
              <div className="text-lg font-bold text-indigo-300 font-mono mt-0.5">
                {stats ? stats.meshCount : '-'}
              </div>
            </div>

            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/50">
              <span className="text-[11px] text-slate-400 font-medium">재질 (Material) 개수</span>
              <div className="text-lg font-bold text-indigo-300 font-mono mt-0.5">
                {stats ? stats.materialCount : '-'}
              </div>
            </div>
          </div>

          {/* Dimensions */}
          {stats && (
            <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/40 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                <Maximize className="w-3.5 h-3.5 text-emerald-400" />
                <span>바운딩 박스 크기 (Bounding Dimensions)</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-slate-200">
                <span>가로 (X): {stats.dimensions.x}</span>
                <span>세로 (Y): {stats.dimensions.y}</span>
                <span>깊이 (Z): {stats.dimensions.z}</span>
              </div>
            </div>
          )}

          {/* Animations list */}
          {stats && stats.animations.length > 0 && (
            <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/40 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                <Activity className="w-3.5 h-3.5 text-amber-400" />
                <span>포함된 애니메이션 ({stats.animations.length}개)</span>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pt-1">
                {stats.animations.map((name, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-slate-800 text-[11px] text-slate-300 border border-slate-700/60"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* File details */}
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs space-y-1 text-slate-400">
            <div className="flex justify-between">
              <span>파일 형식</span>
              <span className="text-slate-200 font-mono font-medium">glTF 2.0 Binary (.glb)</span>
            </div>
            <div className="flex justify-between">
              <span>파일 크기</span>
              <span className="text-slate-200 font-mono font-medium">{formatFileSize(model.sizeBytes)}</span>
            </div>
            <div className="flex justify-between">
              <span>출처</span>
              <span className="text-slate-200 font-medium">
                {model.isCustomUpload ? '사용자 직접 업로드' : '공식 샘플 리포지토리'}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold rounded-xl transition-colors"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};
