import React, { useState } from 'react';
import {
  Box,
  Upload,
  Search,
  Trash2,
  Download,
  Sparkles,
  Activity,
  Tag,
  Layers,
  Clock,
  Filter,
} from 'lucide-react';
import { ModelItem } from '../types';

interface GalleryGridProps {
  models: ModelItem[];
  activeModelId: string | null;
  onSelectModel: (model: ModelItem) => void;
  onOpenUpload: () => void;
  onDeleteModel: (model: ModelItem, e: React.MouseEvent) => void;
}

export const GalleryGrid: React.FC<GalleryGridProps> = ({
  models,
  activeModelId,
  onSelectModel,
  onOpenUpload,
  onDeleteModel,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const categories = [
    { id: 'all', label: '전체 모델' },
    { id: 'uploaded', label: '내 업로드 모델' },
    { id: 'animated', label: '애니메이션' },
    { id: 'prop', label: '소품/아이템' },
    { id: 'character', label: '캐릭터' },
    { id: 'vehicle', label: '차량' },
  ];

  const filteredModels = models.filter((model) => {
    const matchesSearch =
      model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (model.description && model.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (model.tags && model.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

    if (!matchesSearch) return false;

    if (categoryFilter === 'all') return true;
    if (categoryFilter === 'uploaded') return model.isCustomUpload;
    return model.category === categoryFilter;
  });

  const handleDownloadModel = (model: ModelItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const ext = model.format || (model.url.toLowerCase().endsWith('.stl') ? 'stl' : model.url.toLowerCase().endsWith('.obj') ? 'obj' : model.url.toLowerCase().endsWith('.ply') ? 'ply' : model.url.toLowerCase().endsWith('.fbx') ? 'fbx' : 'glb');
    const link = document.createElement('a');
    link.href = model.url;
    link.download = `${model.name.replace(/\s+/g, '_')}.${ext}`;
    link.click();
  };

  return (
    <div className="w-full flex flex-col h-full bg-slate-950/80 border-r border-slate-800/80">
      {/* Top Header & Search */}
      <div className="p-4 border-b border-slate-800/80 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-md shadow-cyan-500/20">
              <Box className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">3D GLB 갤러리</h2>
              <span className="text-[11px] text-slate-400">총 {models.length}개의 3D 모델</span>
            </div>
          </div>

          <button
            id="btn-gallery-upload"
            onClick={onOpenUpload}
            className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20 active:scale-95"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>GLB 업로드</span>
          </button>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="모델 이름 또는 태그 검색..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all ${
                categoryFilter === cat.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Model Cards List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {filteredModels.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto mb-3 text-slate-600">
              <Box className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-300">검색된 3D 모델이 없습니다</p>
            <p className="text-xs text-slate-500 mt-1 mb-4">새로운 GLB 파일을 업로드하거나 검색어를 변경해보세요.</p>
            <button
              onClick={onOpenUpload}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold rounded-xl border border-slate-700 transition-all inline-flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>내 3D 파일 업로드</span>
            </button>
          </div>
        ) : (
          filteredModels.map((item) => {
            const isSelected = item.id === activeModelId;
            return (
              <div
                key={item.id}
                id={`model-card-${item.id}`}
                onClick={() => onSelectModel(item)}
                className={`group relative p-3 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2 ${
                  isSelected
                    ? 'bg-slate-900/90 border-cyan-500/80 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/30'
                    : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-900/70 hover:border-slate-700'
                }`}
              >
                {/* Top Row: Thumbnail + Info */}
                <div className="flex items-start gap-3">
                  {/* Thumbnail */}
                  <div className="w-14 h-14 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 overflow-hidden relative group-hover:border-slate-700">
                    {item.thumbnail ? (
                      <img src={item.thumbnail} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-slate-600 flex flex-col items-center">
                        <Box className="w-6 h-6" />
                      </div>
                    )}
                    {item.category === 'animated' && (
                      <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    )}
                  </div>

                  {/* Title & Desc */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 justify-between">
                      <h4 className="text-xs font-bold text-slate-100 truncate group-hover:text-cyan-300 transition-colors">
                        {item.name}
                      </h4>
                      {item.isCustomUpload && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-medium shrink-0">
                          업로드됨
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                      {item.description || '3D GLB 오브젝트'}
                    </p>
                  </div>
                </div>

                {/* Bottom Row: Tags & Actions */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[10px] text-slate-500">
                  <div className="flex items-center gap-1.5 truncate pr-2">
                    <span className="font-mono text-cyan-400 font-bold px-1.5 py-0.2 rounded bg-cyan-500/10 border border-cyan-500/20 text-[9px]">
                      {(item.format || (item.url.toLowerCase().endsWith('.stl') ? 'stl' : item.url.toLowerCase().endsWith('.obj') ? 'obj' : item.url.toLowerCase().endsWith('.ply') ? 'ply' : item.url.toLowerCase().endsWith('.fbx') ? 'fbx' : 'glb')).toUpperCase()}
                    </span>

                    {item.stats ? (
                      <span className="font-mono text-slate-400">
                        {item.stats.triangleCount > 0 ? `${(item.stats.triangleCount / 1000).toFixed(1)}k tris` : '3D'}
                      </span>
                    ) : (
                      <span className="text-slate-400">3D</span>
                    )}

                    {item.category === 'animated' && (
                      <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 font-medium border border-amber-500/20 flex items-center gap-1">
                        <Activity className="w-2.5 h-2.5" />
                        <span>애니메이션</span>
                      </span>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => handleDownloadModel(item, e)}
                      className="p-1 text-slate-400 hover:text-cyan-300 rounded hover:bg-slate-800 transition-colors"
                      title="GLB 파일 다운로드"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    {item.isCustomUpload && (
                      <button
                        onClick={(e) => onDeleteModel(item, e)}
                        className="p-1 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800 transition-colors"
                        title="갤러리에서 삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
