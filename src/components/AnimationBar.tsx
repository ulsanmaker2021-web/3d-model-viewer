import React from 'react';
import { Play, Pause, FastForward, RotateCcw, Activity } from 'lucide-react';

interface AnimationBarProps {
  animations: string[];
  activeAnimationIndex: number;
  onSelectAnimation: (index: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  onStartScrubbing: () => void;
  onEndScrubbing: () => void;
  speed: number;
  onChangeSpeed: (speed: number) => void;
}

export const AnimationBar: React.FC<AnimationBarProps> = ({
  animations,
  activeAnimationIndex,
  onSelectAnimation,
  isPlaying,
  onTogglePlay,
  currentTime,
  duration,
  onSeek,
  onStartScrubbing,
  onEndScrubbing,
  speed,
  onChangeSpeed,
}) => {
  if (!animations || animations.length === 0) return null;

  const speeds = [0.25, 0.5, 1.0, 1.5, 2.0];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 10);
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms}`;
  };

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-11/12 max-w-2xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-2xl p-3 shadow-2xl shadow-black/60 z-10 flex flex-col gap-2.5">
      {/* Top Row: Clip Selector & Playback Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Left: Animation Clip Selector */}
        <div className="flex items-center gap-2 max-w-[280px] sm:max-w-xs">
          <Activity className="w-4 h-4 text-cyan-400 shrink-0" />
          <select
            id="select-animation-clip"
            value={activeAnimationIndex}
            onChange={(e) => onSelectAnimation(parseInt(e.target.value, 10))}
            className="w-full bg-slate-800 text-slate-100 text-xs font-medium rounded-xl px-2.5 py-1.5 border border-slate-700 focus:outline-none focus:border-cyan-500 truncate cursor-pointer"
          >
            {animations.map((name, idx) => (
              <option key={idx} value={idx}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* Right: Play / Speed Controls */}
        <div className="flex items-center gap-2">
          {/* Speed presets */}
          <div className="flex items-center bg-slate-800/80 rounded-xl p-0.5 border border-slate-700/50">
            {speeds.map((s) => (
              <button
                key={s}
                onClick={() => onChangeSpeed(s)}
                className={`px-2 py-1 text-[11px] rounded-lg font-medium transition-all ${
                  speed === s ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Play / Pause */}
          <button
            id="btn-animation-toggle-play"
            onClick={onTogglePlay}
            className="w-9 h-9 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center font-bold transition-all shadow-md shadow-cyan-500/20 active:scale-95"
            title={isPlaying ? '일시정지' : '재생'}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current translate-x-0.5" />}
          </button>
        </div>
      </div>

      {/* Bottom Row: Timeline Scrubber */}
      <div className="flex items-center gap-3">
        <span className="text-[11px] font-mono text-cyan-400 w-12 text-right">
          {formatTime(currentTime)}
        </span>

        <input
          type="range"
          min="0"
          max={duration || 1}
          step="0.01"
          value={currentTime}
          onMouseDown={onStartScrubbing}
          onTouchStart={onStartScrubbing}
          onChange={(e) => onSeek(parseFloat(e.target.value))}
          onMouseUp={onEndScrubbing}
          onTouchEnd={onEndScrubbing}
          className="accent-cyan-400 flex-1 h-1.5 bg-slate-800 rounded-lg cursor-pointer transition-all"
        />

        <span className="text-[11px] font-mono text-slate-400 w-12">
          {formatTime(duration)}
        </span>
      </div>
    </div>
  );
};
