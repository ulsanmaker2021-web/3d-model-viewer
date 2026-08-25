import React from 'react';
import { X, ExternalLink, Download, Sparkles, BookOpen, Layers, Globe, ShieldCheck } from 'lucide-react';

interface HeritageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HeritageModal: React.FC<HeritageModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-500/40 shadow-inner">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>반가사유상 3D 파일 안내 및 AI 생성 가이드</span>
              </h3>
              <p className="text-xs text-amber-200/80">금동미륵보살반가사유상(국보 제78호·83호) 디지털 에셋</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto text-slate-200 text-xs leading-relaxed">
          {/* Section 1: Official Sources */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-sm font-bold text-amber-300">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>1. 실제 무료 다운로드가 가능한 공식 및 오픈 소스</span>
            </div>
            <p className="text-slate-300 text-xs">
              Sketchfab의 일부 국가유산청 계정 모델은 전시 전용(다운로드 비활성)으로 설정되어 있는 경우가 많습니다. 
              <strong>실제 3D 파일(GLB, STL, OBJ)을 무료 다운로드할 수 있는 공식 경로</strong>는 다음과 같습니다:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <a
                href="https://digital.khs.go.kr"
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-slate-950/80 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-500/50 rounded-2xl transition-all flex flex-col justify-between group"
              >
                <div className="flex items-start justify-between">
                  <span className="font-bold text-white group-hover:text-amber-300">국가유산 디지털 서비스 (공식)</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  국가유산청 공식 포털(digital.khs.go.kr)에서 '반가사유상' 검색 시 공공누리 제1유형 고정밀 3D 에셋 무료 다운로드 제공.
                </p>
                <span className="text-[10px] text-amber-400 font-medium mt-2">공식 포털 바로가기 →</span>
              </a>

              <a
                href="https://www.thingiverse.com/search?q=Pensive+Bodhisattva&page=1"
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-slate-950/80 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-500/50 rounded-2xl transition-all flex flex-col justify-between group"
              >
                <div className="flex items-start justify-between">
                  <span className="font-bold text-white group-hover:text-cyan-300">Thingiverse (즉시 다운로드)</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  로그인 없이 'Pensive Bodhisattva' 실물 스캔 3D 모델(STL/OBJ)을 1초 만에 무료 즉시 다운로드할 수 있습니다.
                </p>
                <span className="text-[10px] text-cyan-400 font-medium mt-2">무료 3D 파일 즉시 받기 →</span>
              </a>

              <a
                href="https://www.emuseum.go.kr"
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-slate-950/80 hover:bg-slate-800/90 border border-slate-800 hover:border-emerald-500/50 rounded-2xl transition-all flex flex-col justify-between group"
              >
                <div className="flex items-start justify-between">
                  <span className="font-bold text-white group-hover:text-emerald-300">e뮤지엄 (국립중앙박물관)</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  국보 제78호, 제83호 반가사유상 유물 3D 스캔 데이터 및 멀티미디어 자료를 무료 제공합니다.
                </p>
                <span className="text-[10px] text-emerald-400 font-medium mt-2">e뮤지엄 소장품 검색 →</span>
              </a>

              <a
                href="https://www.printables.com/search/models?q=korea+national+treasure"
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-slate-950/80 hover:bg-slate-800/90 border border-slate-800 hover:border-orange-500/50 rounded-2xl transition-all flex flex-col justify-between group"
              >
                <div className="flex items-start justify-between">
                  <span className="font-bold text-white group-hover:text-orange-300">Printables 3D 포털</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-orange-400" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  국보 유물 3D 스캔 및 재현 데이터를 무료로 배포하는 글로벌 3D 저장소입니다.
                </p>
                <span className="text-[10px] text-orange-400 font-medium mt-2">오픈 모델 둘러보기 →</span>
              </a>
            </div>
          </div>

          {/* Section 2: AI 3D Generation Tools */}
          <div className="space-y-2.5 pt-2 border-t border-slate-800">
            <div className="flex items-center gap-2 text-sm font-bold text-cyan-300">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>2. 3D GLB 파일 직접 AI 생성 방법 (Image/Text-to-3D)</span>
            </div>
            <p className="text-slate-300 text-xs">
              반가사유상 사진 1장이나 텍스트 프롬프트만으로 단 10~30초 만에 완벽한 `.glb` 3D 모델을 생성해 다운로드할 수 있는 최신 AI 도구들입니다:
            </p>

            <div className="space-y-2">
              <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-start gap-2.5">
                <div className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold font-mono text-[11px] shrink-0">
                  Tripo3D
                </div>
                <div>
                  <strong className="text-slate-100">Tripo AI (tripo3d.ai):</strong>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    반가사유상 사진을 업로드하거나 "Maitreya Gilt-bronze Meditating Bodhisattva"를 입력하면 15초 내에 텍스처와 메시가 포함된 GLB를 무료 생성합니다.
                  </p>
                </div>
              </div>

              <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-start gap-2.5">
                <div className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold font-mono text-[11px] shrink-0">
                  Meshy
                </div>
                <div>
                  <strong className="text-slate-100">Meshy AI (meshy.ai):</strong>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    고해상도 PBR 재질(금동/청동 텍스처)과 디테일한 법의 주름까지 3D GLB 파일로 변환해 줍니다.
                  </p>
                </div>
              </div>

              <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-start gap-2.5">
                <div className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold font-mono text-[11px] shrink-0">
                  CSM
                </div>
                <div>
                  <strong className="text-slate-100">Common Sense Machines (3d.csm.ai):</strong>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    다각도 사진을 바탕으로 정밀 신경망 3D 재구성(NeRF/Gaussian Splatting 기반 메싱)을 제공합니다.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: How to view in our gallery */}
          <div className="p-3 bg-gradient-to-br from-cyan-950/30 to-blue-950/30 rounded-2xl border border-cyan-500/30 flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="font-bold text-cyan-300 text-xs">다운로드 받은 GLB 파일을 바로 갤러리에 추가하세요</span>
              <p className="text-[11px] text-slate-300">
                다운로드한 `.glb` 파일을 본 갤러리의 <strong>[내 GLB 업로드]</strong> 버튼을 통해 넣으면 PBR 광택, 와이어프레임 분석, 360도 회전 감상이 가능합니다.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold rounded-xl transition-colors"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};
