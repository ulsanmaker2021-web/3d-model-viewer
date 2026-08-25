import React from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';
import { ModelItem } from '../types';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  model: ModelItem | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  model,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !model) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden p-6 text-slate-100 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <h3 className="text-base font-bold text-white">3D 모델 삭제</h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            아래 모델을 갤러리 및 로컬 저장소(IndexedDB)에서 영구 삭제하시겠습니까?
          </p>
        </div>

        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 text-cyan-400 text-xs font-mono font-bold">
            {(model.format || '3D').toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-slate-200 truncate">{model.name}</h4>
            <p className="text-[11px] text-slate-500 truncate">{model.description || '사용자 업로드 3D 파일'}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-lg shadow-rose-600/30 flex items-center gap-1.5 active:scale-95"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>삭제하기</span>
          </button>
        </div>
      </div>
    </div>
  );
};
