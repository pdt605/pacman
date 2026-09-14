import React from 'react';
import { Direction } from '../types';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Keyboard } from 'lucide-react';

interface ControlsOverlayProps {
  onDirectionChange: (dir: Direction) => void;
  currentDir: Direction;
}

export const ControlsOverlay: React.FC<ControlsOverlayProps> = ({
  onDirectionChange,
  currentDir,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto mt-2 px-3 py-2 flex flex-col md:flex-row items-center justify-between gap-3 text-indigo-200">
      {/* Keyboard Controls Legend */}
      <div className="hidden sm:flex items-center gap-2 bg-indigo-950/80 px-3.5 py-2 rounded-xl border border-indigo-800/80 text-xs font-mono shadow-sm">
        <Keyboard className="w-4 h-4 text-amber-400" />
        <span>Controls:</span>
        <span className="bg-indigo-900 text-yellow-300 px-2 py-0.5 rounded-lg border border-indigo-700 font-bold shadow-sm">Arrow Keys</span>
        <span>or</span>
        <span className="bg-indigo-900 text-yellow-300 px-2 py-0.5 rounded-lg border border-indigo-700 font-bold shadow-sm">W A S D</span>
        <span className="text-indigo-500">|</span>
        <span className="bg-indigo-900 text-yellow-300 px-2 py-0.5 rounded-lg border border-indigo-700 font-bold shadow-sm">Space / P</span>
        <span>to Pause</span>
      </div>

      {/* Mobile Touch Virtual D-Pad */}
      <div className="flex md:hidden items-center justify-center gap-1 bg-indigo-950/90 p-2.5 rounded-2xl border-2 border-indigo-600/60 shadow-2xl mx-auto">
        <div className="grid grid-cols-3 gap-1.5 w-36 h-36">
          <div />
          <button
            onTouchStart={(e) => { e.preventDefault(); onDirectionChange(Direction.UP); }}
            onClick={() => onDirectionChange(Direction.UP)}
            className={`flex items-center justify-center rounded-xl border-2 transition active:scale-95 ${
              currentDir === Direction.UP
                ? 'bg-amber-400 text-indigo-950 border-amber-300 shadow-[0_0_14px_rgba(251,191,36,0.5)]'
                : 'bg-indigo-900 hover:bg-indigo-800 text-slate-100 border-indigo-700/80'
            }`}
            aria-label="Up"
          >
            <ChevronUp className="w-6 h-6" />
          </button>
          <div />

          <button
            onTouchStart={(e) => { e.preventDefault(); onDirectionChange(Direction.LEFT); }}
            onClick={() => onDirectionChange(Direction.LEFT)}
            className={`flex items-center justify-center rounded-xl border-2 transition active:scale-95 ${
              currentDir === Direction.LEFT
                ? 'bg-amber-400 text-indigo-950 border-amber-300 shadow-[0_0_14px_rgba(251,191,36,0.5)]'
                : 'bg-indigo-900 hover:bg-indigo-800 text-slate-100 border-indigo-700/80'
            }`}
            aria-label="Left"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center justify-center text-[9px] font-arcade text-indigo-400 font-bold">
            D-PAD
          </div>
          <button
            onTouchStart={(e) => { e.preventDefault(); onDirectionChange(Direction.RIGHT); }}
            onClick={() => onDirectionChange(Direction.RIGHT)}
            className={`flex items-center justify-center rounded-xl border-2 transition active:scale-95 ${
              currentDir === Direction.RIGHT
                ? 'bg-amber-400 text-indigo-950 border-amber-300 shadow-[0_0_14px_rgba(251,191,36,0.5)]'
                : 'bg-indigo-900 hover:bg-indigo-800 text-slate-100 border-indigo-700/80'
            }`}
            aria-label="Right"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div />
          <button
            onTouchStart={(e) => { e.preventDefault(); onDirectionChange(Direction.DOWN); }}
            onClick={() => onDirectionChange(Direction.DOWN)}
            className={`flex items-center justify-center rounded-xl border-2 transition active:scale-95 ${
              currentDir === Direction.DOWN
                ? 'bg-amber-400 text-indigo-950 border-amber-300 shadow-[0_0_14px_rgba(251,191,36,0.5)]'
                : 'bg-indigo-900 hover:bg-indigo-800 text-slate-100 border-indigo-700/80'
            }`}
            aria-label="Down"
          >
            <ChevronDown className="w-6 h-6" />
          </button>
          <div />
        </div>
      </div>
    </div>
  );
};
