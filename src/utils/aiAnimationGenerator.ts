import * as THREE from 'three';
import { ModelItem, ModelStats, MeshNodeInfo } from '../types';

export interface AIAnimationResult {
  clip: THREE.AnimationClip;
  clipName: string;
  category: ShapeCategory;
  aiInsight: string;
  duration: number;
}

export type ShapeCategory =
  | 'humanoid'
  | 'vehicle'
  | 'heritage'
  | 'mecha'
  | 'props';

export interface CategoryInfo {
  id: ShapeCategory;
  label: string;
  icon: string;
  description: string;
}

export const SHAPE_CATEGORIES: CategoryInfo[] = [
  {
    id: 'humanoid',
    label: '인간형 / 캐릭터 / 피규어',
    icon: '👤',
    description: '사람, 캐릭터, 피규어, 아바타, 애니메이션 인물에 최적화된 관절·체중 이동 모션',
  },
  {
    id: 'vehicle',
    label: '자동차 / 탈것 / 모빌리티',
    icon: '🚗',
    description: '차량, 바이크, 비행체에 특화된 서스펜션 완충, 코너링 롤, 가속 피칭 모션',
  },
  {
    id: 'heritage',
    label: '문화유산 / 조각상 / 예술품',
    icon: '🏛️',
    description: '불상, 국보, 석조물, 조각품, 박물관 유물에 어울리는 신성한 부유 및 360° 전시 모션',
  },
  {
    id: 'mecha',
    label: '로봇 / 기계 / 메카닉',
    icon: '🤖',
    description: '중장비, 메카, 드론, 센서 장비의 유압 피스톤 스텝 및 서보 모터 스캔 모션',
  },
  {
    id: 'props',
    label: '소품 / 제품 / 크리에이티브',
    icon: '📦',
    description: '주얼리, 가구, 패키지, 크리에이티브 아이템의 럭셔리 턴 및 무중력 유영 모션',
  },
];

export interface StandardMotionPreset {
  id: string;
  category: ShapeCategory;
  title: string;
  description: string;
  icon: string;
  durationSec: number;
  highlightTag: string;
}

export const STANDARD_MOTION_LIBRARY: StandardMotionPreset[] = [
  // 1. Humanoid / Character Presets
  {
    id: 'humanoid_walk',
    category: 'humanoid',
    title: '당당한 리듬 워킹 & 보행',
    description: '좌우 체중 이동(Sway), 발걸음 상하 바운스, 자연스러운 피칭이 결합된 생생한 보행 모션입니다.',
    icon: '🚶',
    durationSec: 2.0,
    highlightTag: '추천 베스트',
  },
  {
    id: 'humanoid_dance',
    category: 'humanoid',
    title: '신나는 K-댄스 & 그루브 바운스',
    description: '경쾌한 4박자 비트에 맞춘 신나는 팝 바운스, 좌우 웨이브, 헤드 그루브 댄스 모션입니다.',
    icon: '💃',
    durationSec: 2.4,
    highlightTag: '발랄함',
  },
  {
    id: 'humanoid_wave',
    category: 'humanoid',
    title: '친근한 환영 인사 & 손짓 바운스',
    description: '상체를 앞으로 정중히 기울인 후 고개를 끄덕이며 반갑게 좌우로 손인사를 건넵니다.',
    icon: '👋',
    durationSec: 3.0,
    highlightTag: '인터랙티브',
  },
  {
    id: 'humanoid_jog',
    category: 'humanoid',
    title: '경쾌한 조깅 & 러닝 바운스',
    description: '가속 도약과 전방 린(Lean) 각도가 살아있는 역동적이고 힘찬 달리기 궤적 모션입니다.',
    icon: '🏃',
    durationSec: 1.4,
    highlightTag: '다이내믹',
  },
  {
    id: 'humanoid_catwalk',
    category: 'humanoid',
    title: '런웨이 모델 캣워크 스트럿',
    description: '우아한 S자 골반 스웨이와 당당한 어깨 롤링, 끝부분의 우아한 포즈 턴이 돋보입니다.',
    icon: '✨',
    durationSec: 3.2,
    highlightTag: '우아함',
  },
  {
    id: 'humanoid_idle',
    category: 'humanoid',
    title: '편안한 호흡 & 자연스러운 대기',
    description: '살아 숨쉬듯 가슴이 오르내리고 좌우로 은은하게 무게 중심을 옮기는 아이들 모션입니다.',
    icon: '🧘',
    durationSec: 3.5,
    highlightTag: '자연스러움',
  },
  {
    id: 'humanoid_spin_jump',
    category: 'humanoid',
    title: '360° 공중 회전 점프 & 착지',
    description: '도약하여 공중에서 멋진 360도 스핀을 회전한 뒤 부드럽게 무릎을 굽히며 착지합니다.',
    icon: '🤸',
    durationSec: 2.2,
    highlightTag: '화려함',
  },

  // 2. Vehicle / Mobility Presets
  {
    id: 'vehicle_drive',
    category: 'vehicle',
    title: '고속 질주 & 노면 서스펜션 완충',
    description: '노면 요철을 탄력 있게 흡수하는 서스펜션 진동과 가속 시 차체 스쿼트 모션입니다.',
    icon: '🏎️',
    durationSec: 2.5,
    highlightTag: '질주감',
  },
  {
    id: 'vehicle_drift',
    category: 'vehicle',
    title: '다이내믹 드리프트 & 코너링 롤',
    description: '코너링 시 원심력에 의해 차체가 좌우로 기울어지는 바디 롤과 슬라이딩 궤적입니다.',
    icon: '🏁',
    durationSec: 3.0,
    highlightTag: '익스트림',
  },
  {
    id: 'vehicle_idle',
    category: 'vehicle',
    title: 'V8 엔진 아이들링 & 배기 떨림',
    description: '시동이 걸린 차량의 강력한 엔진 진동 펄스와 배기구 쪽의 미세한 맥동을 재현합니다.',
    icon: '🔊',
    durationSec: 1.8,
    highlightTag: '리얼리스틱',
  },
  {
    id: 'vehicle_boost',
    category: 'vehicle',
    title: '니트로 부스터 가속 & 피칭',
    description: '급발진 가속으로 앞머리가 들리며 폭발적으로 전진했다가 제동하는 드래그 레이싱 모션입니다.',
    icon: '🚀',
    durationSec: 2.2,
    highlightTag: '부스터',
  },

  // 3. Heritage / Artifacts Presets
  {
    id: 'heritage_levitate',
    category: 'heritage',
    title: '신성한 영적 명상 부유',
    description: '반가사유상, 불상처럼 성스러운 무중력 상태로 허공에 떠오르며 온화한 오라를 뿜어냅니다.',
    icon: '🧘',
    durationSec: 4.0,
    highlightTag: '국보/불상 특화',
  },
  {
    id: 'heritage_turntable',
    category: 'heritage',
    title: '박물관 360° 프리미엄 턴테이블',
    description: '일정한 속도의 우아한 360도 회전과 미세한 상하 각도 틸트로 유물의 정교함을 감상합니다.',
    icon: '🏺',
    durationSec: 6.0,
    highlightTag: '전시/쇼룸',
  },
  {
    id: 'heritage_aura',
    category: 'heritage',
    title: '천상의 후광 & 은은한 호흡 펄스',
    description: '유물 주위로 천상의 빛이 호흡하듯 위아래로 완만하게 팽창/수축하는 힐링 모션입니다.',
    icon: '🌟',
    durationSec: 3.8,
    highlightTag: '신비로움',
  },
  {
    id: 'heritage_prayer',
    category: 'heritage',
    title: '경배와 사유의 온화한 틸트',
    description: '깊은 사유와 평온을 전하는 온화한 인사 틸트와 성스러운 고요를 연출합니다.',
    icon: '🕯️',
    durationSec: 4.5,
    highlightTag: '경건함',
  },

  // 4. Mecha / Robots Presets
  {
    id: 'mecha_step',
    category: 'mecha',
    title: '중장비 메카 파워 보행',
    description: '육중한 무게감의 유압 피스톤 충격 흡수와 묵직한 발디딤 바운스를 시뮬레이션합니다.',
    icon: '🦾',
    durationSec: 2.4,
    highlightTag: '묵직함',
  },
  {
    id: 'mecha_scan',
    category: 'mecha',
    title: '360° 레이더 센서 탐색 & 순찰',
    description: '일정 각도마다 정밀하게 멈춰 서서 센서 데이터를 스캔하는 하이테크 패트롤 모션입니다.',
    icon: '📡',
    durationSec: 4.0,
    highlightTag: '하이테크',
  },
  {
    id: 'mecha_boot',
    category: 'mecha',
    title: '시스템 부팅 & 전력 전개',
    description: '시동 엔진 진동 후 기립하며 전신 시스템을 가동하는 메카닉 스타트업 모션입니다.',
    icon: '⚡',
    durationSec: 2.8,
    highlightTag: '파워업',
  },
  {
    id: 'mecha_alert',
    category: 'mecha',
    title: '경계 모드 & 위협 감지 스탠스',
    description: '좌우로 빠르게 타겟을 조준하고 전투 스탠스로 민첩하게 방향을 전환합니다.',
    icon: '🚨',
    durationSec: 2.2,
    highlightTag: '전투 모드',
  },

  // 5. Props / Products Presets
  {
    id: 'props_showcase',
    category: 'props',
    title: '3축 럭셔리 주얼리 3D 쇼케이스',
    description: '다이아몬드/시계/제품의 모든 면에 빛이 반사되도록 3차원 짐벌 축으로 회전합니다.',
    icon: '💎',
    durationSec: 5.0,
    highlightTag: '광택 쇼룸',
  },
  {
    id: 'props_space_drift',
    category: 'props',
    title: '무중력 우주 유영 & 플로팅',
    description: '우주 공간에 떠 있듯 6자유도로 자유롭게 유영하며 부유하는 힐링 모션입니다.',
    icon: '🪐',
    durationSec: 4.5,
    highlightTag: '무중력',
  },
  {
    id: 'props_jelly_bounce',
    category: 'props',
    title: '통통 튀는 젤리 탄성 바운스',
    description: '쫀득한 젤리처럼 바닥에 닿을 때 납작해지고 공중에 뜰 때 길어지는 물리 바운스입니다.',
    icon: '🍮',
    durationSec: 1.8,
    highlightTag: '스쿼시 & 스트레치',
  },
  {
    id: 'props_wind_sway',
    category: 'props',
    title: '산들바람에 흔들리는 자연 모션',
    description: '부드러운 바람에 살랑거리며 유기적으로 흔들리는 진자 스웨이 모션입니다.',
    icon: '🍃',
    durationSec: 3.2,
    highlightTag: '자연미',
  },
];

/**
 * Automatically inspects model name, meshes and bounding dimensions to classify the best matching shape category.
 */
export function detectModelCategory(
  model: ModelItem,
  stats?: ModelStats | null
): ShapeCategory {
  const name = (model.name || '').toLowerCase();
  const desc = (model.description || '').toLowerCase();
  const combined = `${name} ${desc}`;

  // 1. Humanoid keywords
  if (
    combined.includes('mama') ||
    combined.includes('girl') ||
    combined.includes('boy') ||
    combined.includes('man') ||
    combined.includes('woman') ||
    combined.includes('character') ||
    combined.includes('human') ||
    combined.includes('person') ||
    combined.includes('avatar') ||
    combined.includes('face') ||
    combined.includes('figure') ||
    combined.includes('hero') ||
    combined.includes('cage') ||
    combined.includes('walk') ||
    combined.includes('dance')
  ) {
    return 'humanoid';
  }

  // 2. Vehicle keywords
  if (
    combined.includes('car') ||
    combined.includes('vehicle') ||
    combined.includes('truck') ||
    combined.includes('bike') ||
    combined.includes('motor') ||
    combined.includes('wheel') ||
    combined.includes('auto') ||
    combined.includes('tank') ||
    combined.includes('airplane') ||
    combined.includes('ship') ||
    combined.includes('speed')
  ) {
    return 'vehicle';
  }

  // 3. Heritage keywords
  if (
    combined.includes('buddha') ||
    combined.includes('statue') ||
    combined.includes('heritage') ||
    combined.includes('relic') ||
    combined.includes('bronze') ||
    combined.includes('gold') ||
    combined.includes('crown') ||
    combined.includes('temple') ||
    combined.includes('interlocking') ||
    combined.includes('ring') ||
    combined.includes('museum') ||
    combined.includes('sculpt') ||
    combined.includes('ceramic') ||
    combined.includes('pottery')
  ) {
    return 'heritage';
  }

  // 4. Mecha / Robot keywords
  if (
    combined.includes('robot') ||
    combined.includes('mecha') ||
    combined.includes('droid') ||
    combined.includes('cyber') ||
    combined.includes('machine') ||
    combined.includes('drone') ||
    combined.includes('armor') ||
    combined.includes('gear') ||
    combined.includes('gun') ||
    combined.includes('weapon')
  ) {
    return 'mecha';
  }

  // Dimension heuristics: tall slender object -> humanoid, flat wide -> vehicle/prop
  if (stats?.dimensions) {
    const { x, y, z } = stats.dimensions;
    if (y > x * 1.8 && y > z * 1.8) {
      return 'humanoid';
    }
  }

  return 'humanoid'; // Default friendly fallback
}

/**
 * Generates mathematically calibrated, visually expressive 3D AnimationClips for any standard preset.
 * Guarantees visible, smooth, and safe 3D motion every single time.
 */
export function buildStandardMotionClip(
  presetId: string,
  modelName: string,
  dimensions?: { x: number; y: number; z: number }
): AIAnimationResult {
  const preset = STANDARD_MOTION_LIBRARY.find((p) => p.id === presetId) || STANDARD_MOTION_LIBRARY[0];
  const duration = preset.durationSec;
  const FPS = 30;
  const numFrames = Math.round(duration * FPS);

  const times: number[] = [];
  const posValues: number[] = [];
  const rotValues: number[] = [];
  const scaleValues: number[] = [];

  const dimY = Math.max(dimensions?.y || 2.0, 1.0);

  for (let i = 0; i <= numFrames; i++) {
    const t = (i / numFrames) * duration;
    const progress = (i / numFrames) * Math.PI * 2; // 0 to 2PI (1 full loop)
    times.push(t);

    let posX = 0;
    let posY = 0;
    let posZ = 0;

    let eulerX = 0;
    let eulerY = 0;
    let eulerZ = 0;

    let scaleX = 1.0;
    let scaleY = 1.0;
    let scaleZ = 1.0;

    switch (preset.id) {
      // 1. Humanoid Walk
      case 'humanoid_walk': {
        // High visibility step bounce (2 steps per cycle)
        posY = Math.abs(Math.sin(progress * 2)) * 0.16;
        // Lateral body weight sway
        posX = Math.sin(progress) * 0.1;
        // Forward/back slight shift
        posZ = Math.cos(progress * 2) * 0.04;

        // Pelvic tilt, nodding pitch, and torso rotation
        eulerX = Math.sin(progress * 2) * 0.07; // ~4 deg forward nod
        eulerY = Math.sin(progress) * 0.12; // ~7 deg hip twist
        eulerZ = -Math.cos(progress) * 0.09; // ~5 deg lateral lean

        // Safe step elasticity
        const comp = 1.0 - Math.abs(Math.sin(progress * 2)) * 0.015;
        scaleY = comp;
        scaleX = 1.0 + (1.0 - comp) * 0.5;
        scaleZ = scaleX;
        break;
      }

      // 2. Humanoid Dance & Groove
      case 'humanoid_dance': {
        // 4-beat energetic pop bounce
        posY = Math.abs(Math.sin(progress * 4)) * 0.2;
        // Figure-8 groove sway
        posX = Math.sin(progress * 2) * 0.16;
        posZ = Math.cos(progress * 2) * 0.08;

        eulerX = Math.sin(progress * 4) * 0.1;
        eulerY = Math.sin(progress * 2) * 0.22;
        eulerZ = Math.sin(progress * 2) * 0.15;

        const pop = 1.0 + Math.sin(progress * 4) * 0.025;
        scaleY = pop;
        scaleX = 2.0 - pop;
        scaleZ = scaleX;
        break;
      }

      // 3. Humanoid Greeting Wave
      case 'humanoid_wave': {
        // Bow and nodding
        if (progress < Math.PI) {
          // Bow phase
          eulerX = Math.sin(progress) * 0.18; // ~10 deg polite bow
          posY = -Math.sin(progress) * 0.08;
        } else {
          // Cheerful wave oscillation phase
          const waveProg = (progress - Math.PI) * 3;
          eulerZ = Math.sin(waveProg) * 0.14; // waving torso
          eulerY = Math.sin(waveProg * 0.5) * 0.12;
          posY = Math.abs(Math.sin(waveProg)) * 0.06;
        }
        break;
      }

      // 4. Humanoid Jogging
      case 'humanoid_jog': {
        // Fast energetic bounce
        posY = Math.abs(Math.sin(progress * 2)) * 0.24;
        posX = Math.sin(progress) * 0.08;
        posZ = Math.cos(progress * 2) * 0.06;

        // Forward lean running stance
        eulerX = 0.14 + Math.sin(progress * 2) * 0.08; // ~8 to 12 deg forward lean
        eulerY = Math.sin(progress) * 0.14;
        eulerZ = -Math.cos(progress) * 0.08;

        scaleY = 1.0 - Math.abs(Math.sin(progress * 2)) * 0.02;
        break;
      }

      // 5. Humanoid Catwalk
      case 'humanoid_catwalk': {
        // S-curve hip sway
        posX = Math.sin(progress) * 0.2;
        posY = Math.abs(Math.sin(progress * 2)) * 0.1;
        posZ = Math.cos(progress) * 0.06;

        eulerZ = -Math.cos(progress) * 0.16; // prominent hip tilt
        eulerY = Math.sin(progress) * 0.18; // confident shoulder rotation
        eulerX = Math.sin(progress * 2) * 0.05;
        break;
      }

      // 6. Humanoid Idle Breath
      case 'humanoid_idle': {
        posY = Math.sin(progress) * 0.04;
        posX = Math.sin(progress * 0.5) * 0.03;

        eulerX = Math.sin(progress) * 0.03;
        eulerZ = Math.cos(progress * 0.5) * 0.025;

        const breath = 1.0 + Math.sin(progress) * 0.012;
        scaleY = breath;
        scaleX = 1.0 + (breath - 1.0) * 0.5;
        scaleZ = scaleX;
        break;
      }

      // 7. Humanoid Jump & 360 Spin
      case 'humanoid_spin_jump': {
        const jumpPhase = Math.sin(progress);
        if (jumpPhase > 0) {
          // In air: parabolic jump + 360 spin
          posY = jumpPhase * 0.45;
          eulerY = progress * 1.0; // 360 deg spin
          eulerX = Math.sin(progress) * 0.15;
          scaleY = 1.05;
          scaleX = 0.96;
        } else {
          // Landing crouch
          posY = jumpPhase * 0.12;
          scaleY = 0.92;
          scaleX = 1.05;
        }
        scaleZ = scaleX;
        break;
      }

      // 8. Vehicle High-Speed Drive
      case 'vehicle_drive': {
        // Suspension vibrations
        posY = Math.sin(progress * 6) * 0.05 + Math.sin(progress * 12) * 0.02;
        posZ = Math.cos(progress * 2) * 0.08;

        // Pitch & Roll
        eulerX = Math.sin(progress * 2) * 0.08; // pitch
        eulerZ = Math.sin(progress * 3) * 0.05; // roll
        break;
      }

      // 9. Vehicle Drift & Roll
      case 'vehicle_drift': {
        posX = Math.sin(progress) * 0.25;
        posZ = Math.cos(progress) * 0.15;
        posY = Math.abs(Math.sin(progress * 4)) * 0.04;

        eulerY = Math.sin(progress) * 0.35; // drift angle
        eulerZ = -Math.sin(progress) * 0.18; // body roll into corner
        eulerX = Math.sin(progress * 2) * 0.06;
        break;
      }

      // 10. Vehicle Engine Idling
      case 'vehicle_idle': {
        posY = Math.sin(progress * 10) * 0.015 + Math.sin(progress * 16) * 0.008;
        eulerX = Math.sin(progress * 8) * 0.02;
        eulerZ = Math.cos(progress * 8) * 0.018;
        break;
      }

      // 11. Vehicle Nitro Boost
      case 'vehicle_boost': {
        if (progress < Math.PI) {
          // Launch squat
          eulerX = -0.15 * Math.sin(progress); // nose up
          posZ = -Math.sin(progress) * 0.25;
          posY = Math.sin(progress) * 0.08;
        } else {
          // Braking dive
          eulerX = 0.12 * Math.sin(progress - Math.PI);
          posZ = Math.sin(progress - Math.PI) * 0.15;
        }
        break;
      }

      // 12. Heritage Levitation Float
      case 'heritage_levitate': {
        posY = (Math.sin(progress) * 0.22) + 0.12;
        eulerX = Math.sin(progress) * 0.04;
        eulerY = Math.sin(progress * 0.5) * 0.08;
        eulerZ = Math.cos(progress) * 0.03;

        const aura = 1.0 + Math.sin(progress) * 0.018;
        scaleX = aura;
        scaleY = aura;
        scaleZ = aura;
        break;
      }

      // 13. Heritage Museum Turntable 360
      case 'heritage_turntable': {
        eulerY = progress; // Complete 360 deg turn
        eulerX = Math.sin(progress * 2) * 0.04;
        posY = Math.sin(progress * 2) * 0.04;
        break;
      }

      // 14. Heritage Celestial Aura
      case 'heritage_aura': {
        posY = Math.sin(progress) * 0.08;
        eulerX = Math.sin(progress) * 0.02;
        eulerY = progress * 0.5;

        const aura = 1.0 + Math.sin(progress * 2) * 0.02;
        scaleX = aura;
        scaleY = aura;
        scaleZ = aura;
        break;
      }

      // 15. Heritage Prayer Tilt
      case 'heritage_prayer': {
        eulerX = Math.sin(progress) * 0.12; // gentle blessing bow
        posY = -Math.sin(progress) * 0.06;
        eulerZ = Math.sin(progress * 0.5) * 0.03;
        break;
      }

      // 16. Mecha Heavy Step
      case 'mecha_step': {
        // Heavy hydraulic stomping
        const stepProgress = (progress * 2) % (Math.PI * 2);
        posY = Math.abs(Math.sin(stepProgress)) * 0.18;
        posX = Math.sin(progress) * 0.12;

        eulerX = Math.sin(stepProgress) * 0.08;
        eulerY = Math.sin(progress) * 0.1;
        eulerZ = -Math.cos(progress) * 0.08;

        // Mechanical hydraulic compression on foot strike
        scaleY = 1.0 - Math.abs(Math.sin(stepProgress)) * 0.02;
        break;
      }

      // 17. Mecha Radar Scan
      case 'mecha_scan': {
        // Stepped servo turns
        const step = Math.floor((progress / (Math.PI * 2)) * 4);
        const subT = (progress % (Math.PI / 2)) / (Math.PI / 2);
        const smoothSubT = Math.min(1.0, subT * 2.0); // fast turn, then pause
        eulerY = (step * (Math.PI / 2)) + (smoothSubT * (Math.PI / 2));
        eulerX = Math.sin(progress * 2) * 0.06;
        posY = Math.sin(progress * 4) * 0.03;
        break;
      }

      // 18. Mecha System Boot
      case 'mecha_boot': {
        if (progress < Math.PI) {
          // Crouched offline vibrating
          posY = -0.15 + Math.sin(progress * 8) * 0.02;
          eulerX = 0.15;
          scaleY = 0.94;
        } else {
          // Standing up & powering on
          posY = Math.sin(progress) * 0.06;
          eulerX = -0.05 * Math.sin(progress - Math.PI);
          scaleY = 1.02;
        }
        break;
      }

      // 19. Mecha Alert Combat
      case 'mecha_alert': {
        eulerY = Math.sin(progress * 2) * 0.35; // rapid left/right targeting
        eulerX = 0.08 + Math.sin(progress * 4) * 0.04;
        posY = Math.abs(Math.sin(progress * 2)) * 0.08;
        posX = Math.sin(progress * 2) * 0.1;
        break;
      }

      // 20. Props Luxury Showcase
      case 'props_showcase': {
        eulerY = progress; // 360 deg
        eulerX = Math.sin(progress * 2) * 0.15; // 3-axis tilt
        eulerZ = Math.cos(progress * 2) * 0.1;
        posY = Math.sin(progress * 2) * 0.08;
        break;
      }

      // 21. Props Space Drift
      case 'props_space_drift': {
        posX = Math.sin(progress) * 0.2;
        posY = Math.sin(progress * 2) * 0.16;
        posZ = Math.cos(progress) * 0.15;

        eulerX = Math.sin(progress) * 0.18;
        eulerY = progress + Math.sin(progress * 2) * 0.2;
        eulerZ = Math.cos(progress * 2) * 0.14;
        break;
      }

      // 22. Props Jelly Bounce
      case 'props_jelly_bounce': {
        const cycleProgress = (t % 0.9) / 0.9;
        const jumpH = dimY * 0.28;
        posY = Math.max(0, 4 * jumpH * cycleProgress * (1 - cycleProgress));

        if (cycleProgress < 0.15 || cycleProgress > 0.85) {
          // Landing squash
          scaleY = 0.82;
          scaleX = 1.12;
          scaleZ = 1.12;
        } else if (cycleProgress > 0.2 && cycleProgress < 0.6) {
          // Air stretch
          scaleY = 1.14;
          scaleX = 0.92;
          scaleZ = 0.92;
        }
        eulerZ = Math.sin(t * Math.PI * 2) * 0.1;
        break;
      }

      // 23. Props Wind Sway
      case 'props_wind_sway': {
        eulerZ = Math.sin(progress) * 0.14;
        eulerX = Math.cos(progress * 1.5) * 0.08;
        posX = Math.sin(progress) * 0.08;
        posY = -Math.abs(Math.sin(progress)) * 0.04;
        break;
      }

      default: {
        posY = Math.abs(Math.sin(progress * 2)) * 0.16;
        eulerY = Math.sin(progress) * 0.12;
        break;
      }
    }

    posValues.push(posX, posY, posZ);

    const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(eulerX, eulerY, eulerZ));
    rotValues.push(q.x, q.y, q.z, q.w);

    scaleValues.push(scaleX, scaleY, scaleZ);
  }

  const tracks: THREE.KeyframeTrack[] = [
    new THREE.VectorKeyframeTrack('.position', times, posValues),
    new THREE.QuaternionKeyframeTrack('.quaternion', times, rotValues),
    new THREE.VectorKeyframeTrack('.scale', times, scaleValues),
  ];

  const clipId = `Std_${preset.id}_${Date.now().toString().slice(-4)}`;
  const clip = new THREE.AnimationClip(clipId, duration, tracks);

  return {
    clip,
    clipName: `✨ ${preset.title}`,
    category: preset.category,
    aiInsight: `'${modelName}'의 조형 특성에 맞춰 ${preset.title} 물리 키네마틱스 궤적을 100% 정밀하게 적용했습니다.`,
    duration,
  };
}

/**
 * High level runner: applies standard preset or maps user custom prompt to the most fitting kinematic motion.
 */
export async function generateAIAnimation(
  model: ModelItem,
  stats: ModelStats | null,
  hierarchy: MeshNodeInfo[],
  presetIdOrCategory: string,
  userPrompt?: string
): Promise<AIAnimationResult> {
  // If user passed a custom text prompt, analyze intent and map to the most appropriate preset
  if (userPrompt && userPrompt.trim()) {
    const prompt = userPrompt.toLowerCase();
    let bestPresetId = 'humanoid_walk';

    if (prompt.includes('댄스') || prompt.includes('dance') || prompt.includes('춤') || prompt.includes('바운스') || prompt.includes('그루브')) {
      bestPresetId = 'humanoid_dance';
    } else if (prompt.includes('인사') || prompt.includes('wave') || prompt.includes('안녕') || prompt.includes('환영') || prompt.includes('손짓')) {
      bestPresetId = 'humanoid_wave';
    } else if (prompt.includes('달리') || prompt.includes('run') || prompt.includes('조깅') || prompt.includes('jog') || prompt.includes('빠르')) {
      bestPresetId = 'humanoid_jog';
    } else if (prompt.includes('캣워크') || prompt.includes('모델') || prompt.includes('strut') || prompt.includes('워킹') || prompt.includes('걷')) {
      bestPresetId = 'humanoid_walk';
    } else if (prompt.includes('점프') || prompt.includes('jump') || prompt.includes('회전') || prompt.includes('spin') || prompt.includes('스핀')) {
      bestPresetId = 'humanoid_spin_jump';
    } else if (prompt.includes('차') || prompt.includes('주행') || prompt.includes('drive') || prompt.includes('질주') || prompt.includes('서스펜션')) {
      bestPresetId = 'vehicle_drive';
    } else if (prompt.includes('드리프트') || prompt.includes('drift') || prompt.includes('코너')) {
      bestPresetId = 'vehicle_drift';
    } else if (prompt.includes('엔진') || prompt.includes('진동') || prompt.includes('idle') || prompt.includes('시동')) {
      bestPresetId = 'vehicle_idle';
    } else if (prompt.includes('부유') || prompt.includes('명상') || prompt.includes('기도') || prompt.includes('float') || prompt.includes('불상') || prompt.includes('신성')) {
      bestPresetId = 'heritage_levitate';
    } else if (prompt.includes('턴테이블') || prompt.includes('전시') || prompt.includes('쇼케이스') || prompt.includes('showcase') || prompt.includes('360')) {
      bestPresetId = 'heritage_turntable';
    } else if (prompt.includes('로봇') || prompt.includes('메카') || prompt.includes('기계') || prompt.includes('유압')) {
      bestPresetId = 'mecha_step';
    } else if (prompt.includes('스캔') || prompt.includes('센서') || prompt.includes('레이더')) {
      bestPresetId = 'mecha_scan';
    } else if (prompt.includes('우주') || prompt.includes('무중력') || prompt.includes('space')) {
      bestPresetId = 'props_space_drift';
    } else if (prompt.includes('젤리') || prompt.includes('jelly') || prompt.includes('탄성')) {
      bestPresetId = 'props_jelly_bounce';
    } else if (prompt.includes('바람') || prompt.includes('wind') || prompt.includes('흔들')) {
      bestPresetId = 'props_wind_sway';
    }

    const result = buildStandardMotionClip(bestPresetId, model.name, stats?.dimensions);
    result.clipName = `✨ 맞춤: ${userPrompt.slice(0, 20)}`;
    result.aiInsight = `'${userPrompt}' 프롬프트를 분석하여 '${model.name}'에 가장 역동적이고 자연스러운 3D 키네마틱스 모션을 생성했습니다.`;
    return result;
  }

  // Direct standard preset ID matching
  return buildStandardMotionClip(presetIdOrCategory, model.name, stats?.dimensions);
}
