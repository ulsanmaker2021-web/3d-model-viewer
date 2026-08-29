import React from 'react';
import { X, ExternalLink, Download, Sparkles, BookOpen, Layers, Globe, ShieldCheck, Box, Compass } from 'lucide-react';

interface HeritageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HeritageModal: React.FC<HeritageModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center border border-cyan-500/40 shadow-inner">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>3D 파일 안내 및 AI 생성 가이드</span>
              </h3>
              <p className="text-xs text-cyan-200/80">무료 3D 에셋 다운로드 플랫폼 & Image/Text-to-3D AI 제작 가이드</p>
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
        <div className="p-6 space-y-5 overflow-y-auto text-slate-200 text-xs leading-relaxed custom-scrollbar">
          {/* Section 1: Official & Free 3D Download Platforms */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-sm font-bold text-cyan-300">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>1. 실제 무료 다운로드가 가능한 공식 및 오픈 3D 플랫폼</span>
            </div>
            <p className="text-slate-300 text-xs">
              다양한 분야(캐릭터, 기계, 유물, 건축, 부품 등)의 <strong>3D 파일(GLB, STL, OBJ, 3MF)을 무료로 다운로드</strong>할 수 있는 대표적인 플랫폼입니다:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <a
                href="https://makerworld.com/ko"
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-slate-950/80 hover:bg-slate-800/90 border border-slate-800 hover:border-emerald-500/50 rounded-2xl transition-all flex flex-col justify-between group"
              >
                <div className="flex items-start justify-between">
                  <span className="font-bold text-white group-hover:text-emerald-300">MakerWorld (Bambu Lab)</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Bambu Lab의 공식 3D 모델 커뮤니티로, 고품질 3D 모델 및 실용 에셋을 무료로 다운로드할 수 있습니다.
                </p>
                <span className="text-[10px] text-emerald-400 font-medium mt-2">MakerWorld 바로가기 →</span>
              </a>

              <a
                href="https://www.thingiverse.com"
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-slate-950/80 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-500/50 rounded-2xl transition-all flex flex-col justify-between group"
              >
                <div className="flex items-start justify-between">
                  <span className="font-bold text-white group-hover:text-cyan-300">Thingiverse (글로벌 3D 포털)</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  세계 최대 규모의 무료 3D 오픈소스 아카이브로, 수백만 개의 STL/OBJ/GLB 모델을 1초 만에 다운로드 가능합니다.
                </p>
                <span className="text-[10px] text-cyan-400 font-medium mt-2">Thingiverse 모델 탐색 →</span>
              </a>

              <a
                href="https://www.printables.com"
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-slate-950/80 hover:bg-slate-800/90 border border-slate-800 hover:border-orange-500/50 rounded-2xl transition-all flex flex-col justify-between group"
              >
                <div className="flex items-start justify-between">
                  <span className="font-bold text-white group-hover:text-orange-300">Printables (Prusa)</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-orange-400" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  검증된 고품질 디자인, 피규어, 정밀 부품 및 유물 3D 에셋을 체계적으로 배포하는 글로벌 저장소입니다.
                </p>
                <span className="text-[10px] text-orange-400 font-medium mt-2">Printables 모델 둘러보기 →</span>
              </a>

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
                  국가유산청 공식 포털로 반가사유상, 석굴암 등 국보급 문화유산의 공공누리 제1유형 고정밀 3D 에셋을 무료 제공합니다.
                </p>
                <span className="text-[10px] text-amber-400 font-medium mt-2">공식 포털 바로가기 →</span>
              </a>
            </div>
          </div>

          {/* Section 2: AI 3D Generation Tools */}
          <div className="space-y-2.5 pt-2 border-t border-slate-800">
            <div className="flex items-center gap-2 text-sm font-bold text-indigo-300">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>2. 3D GLB 파일 직접 AI 생성 방법 (Image/Text-to-3D)</span>
            </div>
            <p className="text-slate-300 text-xs">
              사진 1장이나 간단한 텍스트 프롬프트만으로 단 10~30초 만에 고품질 `.glb` 3D 모델을 생성해 다운로드할 수 있는 최신 AI 도구들입니다:
            </p>

            <div className="space-y-2">
              <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-start gap-2.5">
                <div className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold font-mono text-[11px] shrink-0">
                  Tripo3D
                </div>
                <div>
                  <strong className="text-slate-100">Tripo AI (tripo3d.ai):</strong>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    원하는 사물/캐릭터 사진을 업로드하거나 프롬프트를 입력하면 15초 내에 텍스처와 메시가 포함된 최적화된 GLB를 무료 생성합니다.
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
                    고해상도 PBR 재질(메탈릭, 러프니스 등)과 디테일한 지오메트리 메쉬까지 지원하는 3D GLB/OBJ 생성 AI입니다.
                  </p>
                </div>
              </div>

              <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-start gap-2.5">
                <div className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold font-mono text-[11px] shrink-0">
                  CSM / Rodin
                </div>
                <div>
                  <strong className="text-slate-100">Common Sense Machines & HyperHuman Rodin:</strong>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    다각도 사진 및 고정밀 3D 스캔 수준의 하이폴리곤/로우폴리곤 토폴로지 메싱을 생성해 줍니다.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: How to view & animate in our studio */}
          <div className="p-3 bg-gradient-to-br from-cyan-950/30 via-indigo-950/30 to-slate-900/40 rounded-2xl border border-cyan-500/30 flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="font-bold text-cyan-300 text-xs">다운로드 또는 AI 생성한 GLB 파일을 바로 불러오세요!</span>
              <p className="text-[11px] text-slate-300">
                파일을 다운로드한 후 <strong>[내 GLB 업로드]</strong> 버튼으로 추가하면, PBR 질감 감상, 파트별 와이어프레임 분석은 물론 <strong>✨ AI 자동 3D 모션 생성</strong>까지 완벽하게 즐길 수 있습니다.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-md shadow-cyan-500/20 active:scale-95"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

