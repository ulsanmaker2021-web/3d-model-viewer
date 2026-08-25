import React from 'react';
import { X, Eye, EyeOff, Layers, Box, Cpu } from 'lucide-react';
import { MeshNodeInfo } from '../types';

interface HierarchyTreeModalProps {
  isOpen: boolean;
  onClose: () => void;
  hierarchy: MeshNodeInfo[];
  hiddenMeshIds: Set<string>;
  onToggleMeshVisibility: (id: string) => void;
  onShowAllMeshes: () => void;
}

export const HierarchyTreeModal: React.FC<HierarchyTreeModalProps> = ({
  isOpen,
  onClose,
  hierarchy,
  hiddenMeshIds,
  onToggleMeshVisibility,
  onShowAllMeshes,
}) => {
  if (!isOpen) return null;

  const renderNode = (node: MeshNodeInfo, depth = 0) => {
    const isHidden = hiddenMeshIds.has(node.id);
    const isMesh = node.type === 'Mesh' || node.type === 'SkinnedMesh';

    return (
      <div key={node.id} className="flex flex-col">
        <div
          className={`flex items-center justify-between py-1.5 px-2 rounded-lg text-xs transition-colors hover:bg-slate-800/80 ${
            isHidden ? 'opacity-50 text-slate-500' : 'text-slate-200'
          }`}
          style={{ paddingLeft: `${Math.max(8, depth * 16 + 8)}px` }}
        >
          <div className="flex items-center gap-2 truncate pr-2">
            {isMesh ? (
              <Box className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            ) : (
              <Cpu className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            )}
            <span className="font-mono truncate">{node.name}</span>
            {node.triangleCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono shrink-0">
                {node.triangleCount.toLocaleString()} tris
              </span>
            )}
          </div>

          <button
            onClick={() => onToggleMeshVisibility(node.id)}
            className={`p-1 rounded-md transition-colors ${
              isHidden
                ? 'text-slate-500 hover:text-slate-300 hover:bg-slate-700'
                : 'text-cyan-400 hover:text-white hover:bg-slate-700'
            }`}
            title={isHidden ? '파트 표시하기' : '파트 숨기기'}
          >
            {isHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
        </div>

        {node.children && node.children.length > 0 && (
          <div className="flex flex-col">
            {node.children.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-semibold text-white">3D 모델 부품 계층 구조</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action bar */}
        <div className="px-5 py-2.5 bg-slate-950/50 border-b border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400">각 부품의 눈 아이콘을 클릭하여 숨기거나 표시할 수 있습니다.</span>
          {hiddenMeshIds.size > 0 && (
            <button
              onClick={onShowAllMeshes}
              className="px-2.5 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-lg hover:bg-indigo-500/30 transition-colors font-medium shrink-0"
            >
              모든 부품 표시 ({hiddenMeshIds.size}개 숨김)
            </button>
          )}
        </div>

        {/* Tree Body */}
        <div className="p-4 overflow-y-auto max-h-[55vh] space-y-1">
          {hierarchy.length > 0 ? (
            hierarchy.map((rootNode) => renderNode(rootNode))
          ) : (
            <div className="text-center py-8 text-slate-500 text-sm">계층 구조 정보가 없습니다.</div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
