import React, { useState, useRef } from 'react';
import { X, Upload, FileUp, CheckCircle, AlertCircle, Sparkles, Box } from 'lucide-react';
import { ModelItem } from '../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (model: ModelItem) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [detectedFormat, setDetectedFormat] = useState<'glb' | 'gltf' | 'obj' | 'stl' | 'ply' | 'fbx'>('glb');
  const [modelName, setModelName] = useState('');
  const [category, setCategory] = useState<'character' | 'vehicle' | 'prop' | 'architecture' | 'animated' | 'custom'>('custom');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateAndSetFile = (file: File) => {
    setError(null);
    const fileName = file.name.toLowerCase();
    let fmt: 'glb' | 'gltf' | 'obj' | 'stl' | 'ply' | 'fbx' | null = null;

    if (fileName.endsWith('.glb')) fmt = 'glb';
    else if (fileName.endsWith('.gltf')) fmt = 'gltf';
    else if (fileName.endsWith('.stl')) fmt = 'stl';
    else if (fileName.endsWith('.obj')) fmt = 'obj';
    else if (fileName.endsWith('.ply')) fmt = 'ply';
    else if (fileName.endsWith('.fbx')) fmt = 'fbx';

    if (!fmt) {
      setError('지원되는 3D 형식: .glb, .gltf, .stl, .obj, .ply, .fbx');
      return;
    }

    setDetectedFormat(fmt);
    setSelectedFile(file);
    // Auto populate clean name without extension
    const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    setModelName(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('업로드할 3D 파일을 선택해주세요.');
      return;
    }

    setIsProcessing(true);
    try {
      const id = 'custom-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
      const blobUrl = URL.createObjectURL(selectedFile);

      const newModel: ModelItem = {
        id,
        name: modelName.trim() || selectedFile.name,
        description: description.trim() || `사용자 업로드 3D 모델 (${detectedFormat.toUpperCase()})`,
        url: blobUrl,
        blob: selectedFile,
        isCustomUpload: true,
        format: detectedFormat,
        sizeBytes: selectedFile.size,
        uploadedAt: Date.now(),
        category,
        tags: ['업로드', detectedFormat.toUpperCase(), category],
      };

      onUploadSuccess(newModel);
      onClose();
      // Reset state
      setSelectedFile(null);
      setModelName('');
      setDescription('');
    } catch (err) {
      console.error('Failed to process upload:', err);
      setError('파일을 처리하는 중 문제가 발생했습니다.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <FileUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">3D 모델 파일 업로드</h3>
              <p className="text-xs text-slate-400">GLB, STL, OBJ, PLY, FBX, GLTF 3D 모델을 추가합니다.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Supported Format Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-slate-400 font-medium mr-1">지원 포맷:</span>
            {['GLB', 'STL', 'OBJ', 'PLY', 'FBX', 'GLTF'].map((fmt) => (
              <span
                key={fmt}
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${
                  selectedFile && detectedFormat.toUpperCase() === fmt
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-sm'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700'
                }`}
              >
                .{fmt.toLowerCase()}
              </span>
            ))}
          </div>

          {/* Drag & Drop Area */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
              dragActive
                ? 'border-cyan-400 bg-cyan-500/10 scale-[0.99]'
                : selectedFile
                ? 'border-emerald-500/60 bg-emerald-500/5'
                : 'border-slate-700 hover:border-slate-600 bg-slate-950/40 hover:bg-slate-950/70'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".glb,.gltf,.stl,.obj,.ply,.fbx"
              onChange={handleFileChange}
              className="hidden"
            />

            {selectedFile ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-[11px] font-mono font-bold bg-cyan-500/20 text-cyan-300 rounded border border-cyan-500/30">
                    {detectedFormat.toUpperCase()}
                  </span>
                  <div className="font-semibold text-slate-200 text-sm max-w-[260px] truncate">{selectedFile.name}</div>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • 클릭하여 다른 파일 선택
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 text-cyan-400 flex items-center justify-center border border-slate-700">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="text-sm font-semibold text-slate-200">
                  3D 파일을 여기로 드래그하거나 클릭하여 선택
                </div>
                <p className="text-xs text-slate-400">
                  .glb, .stl, .obj, .ply, .fbx, .gltf 파일 지원
                </p>
              </div>
            )}
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Model Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">모델 이름</label>
            <input
              type="text"
              required
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              placeholder="예: 내 사이버네틱 아머"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">카테고리</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
            >
              <option value="custom">기타 / 커스텀</option>
              <option value="character">캐릭터 / 생물</option>
              <option value="vehicle">차량 / 탈것</option>
              <option value="prop">소품 / 아이템</option>
              <option value="architecture">건축 / 환경</option>
              <option value="animated">애니메이션 모델</option>
            </select>
          </div>

          {/* Optional Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">설명 (선택 사항)</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="모델에 대한 간단한 설명을 입력하세요"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!selectedFile || isProcessing}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isProcessing ? '업로드 저장 중...' : '갤러리에 추가 & 열기'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
