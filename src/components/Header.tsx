import React from 'react';
import { Box, Upload, PanelLeft, Sparkles, HelpCircle, Eye, BookOpen } from 'lucide-react';
import { ModelItem } from '../types';

interface HeaderProps {
  currentModel: ModelItem | null;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  onOpenUpload: () => void;
  onOpenHelp: () => void;
  onOpenHeritage: () => void;
  onOpenAIAnimation: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentModel,
  isSidebarOpen,
  onToggleSidebar,
  onOpenUpload,
  onOpenHelp,
  onOpenHeritage,
  onOpenAIAnimation,
}) => {
  return (
    <header className="h-14 border-b border-slate-800 bg-slate-950 px-4 flex items-center justify-between select-none z-30 shrink-0">
      {/* Left brand & sidebar toggle */}
      <div className="flex items-center gap-3">
        <button
          id="btn-toggle-sidebar"
          onClick={onToggleSidebar}
          className={`p-2 rounded-xl border transition-all ${
            isSidebarOpen
              ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
          }`}
          title={isSidebarOpen ? '갤러리 사이드바 접기' : '갤러리 사이드바 열기'}
        >
          <PanelLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
            <Box className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <span>GLB 3D Gallery</span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full">
                Interactive Viewer
              </span>
            </h1>
          </div>
        </div>
      </div>

      {/* Center active model title */}
      {currentModel && (
        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-slate-900/80 border border-slate-800 rounded-full max-w-sm truncate">
          <Eye className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="text-xs font-semibold text-slate-200 truncate">
            {currentModel.name}
          </span>
        </div>
      )}

      {/* Right Action buttons */}
      <div className="flex items-center gap-2">
        <button
          id="btn-header-ai-motion"
          onClick={onOpenAIAnimation}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500/20 via-cyan-500/20 to-teal-500/20 hover:from-indigo-500/30 hover:to-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-bold transition-all shadow-sm shadow-cyan-500/10 active:scale-95"
          title="AI 3D 애니메이션 & 모션 자동 생성"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>✨ AI 모션 생성</span>
        </button>

        <button
          id="btn-header-heritage"
          onClick={onOpenHeritage}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/40 text-slate-200 hover:text-cyan-300 text-xs font-semibold transition-all shadow-sm active:scale-95"
          title="무료 3D 모델 다운로드 및 Image/Text-to-3D AI 가이드"
        >
          <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
          <span>3D 에셋 & AI 가이드</span>
        </button>

        <button
          id="btn-header-help"
          onClick={onOpenHelp}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-all"
          title="조작 방법 및 단축키 안내"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        <button
          id="btn-header-upload"
          onClick={onOpenUpload}
          className="px-3.5 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20 active:scale-95"
          title="GLB, STL, OBJ, PLY, FBX 등 3D 모델 업로드"
        >
          <Upload className="w-3.5 h-3.5 text-slate-950" />
          <span>3D 파일 업로드</span>
        </button>
      </div>
    </header>
  );
};
