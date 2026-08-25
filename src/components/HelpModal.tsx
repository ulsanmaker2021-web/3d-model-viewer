import React from 'react';
import { X, MousePointer, Hand, ZoomIn, Box, Sparkles, CheckCircle2 } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">3D 갤러리 이용 가이드</h3>
              <p className="text-xs text-slate-400">뷰어 조작법 및 지원 기능 안내</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs text-slate-300 overflow-y-auto max-h-[70vh]">
          {/* Controls list */}
          <div className="space-y-2">
            <span className="font-bold text-slate-100 text-sm">기본 3D 뷰어 조작법</span>
            
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2.5">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-cyan-400 shrink-0">
                  <MousePointer className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-slate-200">360도 궤도 회전 (Orbit)</span>
                  <p className="text-[11px] text-slate-400">마우스 좌클릭 드래그 / 모바일 한 손가락 터치 드래그</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-cyan-400 shrink-0">
                  <Hand className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-slate-200">화면 이동 (Pan)</span>
                  <p className="text-[11px] text-slate-400">마우스 우클릭 드래그 또는 Shift + 좌클릭 / 두 손가락 드래그</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-cyan-400 shrink-0">
                  <ZoomIn className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-slate-200">확대 / 축소 (Zoom)</span>
                  <p className="text-[11px] text-slate-400">마우스 휠 스크롤 / 핀치 줌 제스처</p>
                </div>
              </div>
            </div>
          </div>

          {/* Features list */}
          <div className="space-y-2">
            <span className="font-bold text-slate-100 text-sm">주요 기능</span>
            
            <ul className="space-y-1.5 text-[11px] text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span><strong>GLB 직접 업로드:</strong> 브라우저 로컬 저장소(IndexedDB)에 안전하게 저장되어 재방문 시에도 유지됩니다.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span><strong>다양한 렌더 모드:</strong> PBR 텍스처, 와이어프레임, 노멀 맵, 조각 클레이, 엑스레이 쉐이딩 모드를 지원합니다.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span><strong>애니메이션 타임라인:</strong> 캐릭터 및 사물의 모션을 재생/일시정지하고 재생 속도와 시점을 자유롭게 탐색할 수 있습니다.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span><strong>부품 계층 구조:</strong> 3D 모델의 개별 노드/메시 파츠를 켜고 끌 수 있습니다.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span><strong>스크린샷 캡처:</strong> 현재 바라보고 있는 각도에서 고화질 PNG 이미지를 바로 다운로드할 수 있습니다.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold rounded-xl transition-colors"
          >
            확인 및 시작하기
          </button>
        </div>
      </div>
    </div>
  );
};
