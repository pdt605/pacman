import React from 'react';
import { X, GraduationCap, Sparkles, BookOpen, AlertTriangle } from 'lucide-react';
import { ACADEMIC_BONUSES } from '../game/mapData';

interface CharacterGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CharacterGuideModal: React.FC<CharacterGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-indigo-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0B0F28] border-2 border-indigo-500/50 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] p-4 sm:p-6 text-slate-100">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-indigo-800/80 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-amber-400/20 border border-amber-400/50 rounded-lg text-amber-300">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h2 className="text-sm sm:text-base font-arcade text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]">
              FACULTY & STUDENT DIRECTORY
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-indigo-900/80 hover:bg-indigo-800 text-indigo-300 hover:text-white border border-indigo-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* The Professor (Hero) */}
        <div className="mb-5 bg-amber-950/40 border-2 border-amber-400/50 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center gap-3.5 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border-2 border-amber-400/60 flex items-center justify-center text-2xl shrink-0 shadow-sm shadow-amber-500/30">
            👨‍🏫
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-arcade text-xs sm:text-sm text-yellow-300">PROFESSOR PAC-MAN</h3>
              <span className="text-[10px] font-mono bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/50 font-bold">
                Department Chair
              </span>
            </div>
            <p className="text-xs text-indigo-200 mt-1">
              Armed with a graduation mortarboard cap and grading red pen. Eats all homework assignments on campus while dodging desperate students seeking unearned extra credit.
            </p>
          </div>
        </div>

        {/* The 4 Student Ghosts */}
        <h3 className="font-arcade text-xs text-indigo-300 mb-2.5 flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> THE 4 STUDENT GHOSTS
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          {/* Slacker Sam (Blinky) */}
          <div className="bg-rose-950/30 border-2 border-rose-500/40 rounded-xl p-3 flex gap-3 items-start shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/50 flex items-center justify-center text-lg shrink-0">
              🎧
            </div>
            <div>
              <div className="text-xs font-arcade text-rose-400">SLACKER SAM (RED)</div>
              <div className="text-[10px] text-indigo-300 font-mono">Relentless Chaser</div>
              <p className="text-[11px] text-slate-200 mt-1 leading-tight">
                Directly tracks the Professor's exact position. Asks for grade bumps every 5 minutes.
              </p>
            </div>
          </div>

          {/* Procrastinator Pete (Pinky) */}
          <div className="bg-pink-950/30 border-2 border-pink-500/40 rounded-xl p-3 flex gap-3 items-start shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-500/50 flex items-center justify-center text-lg shrink-0">
              🎒
            </div>
            <div>
              <div className="text-xs font-arcade text-pink-400">PROCRASTINATOR PETE (PINK)</div>
              <div className="text-[10px] text-indigo-300 font-mono">Ambush Interceptor</div>
              <p className="text-[11px] text-slate-200 mt-1 leading-tight">
                Tries to cut you off 4 steps ahead in your path. Started the term paper 20 minutes ago.
              </p>
            </div>
          </div>

          {/* Overachiever Olivia (Inky) */}
          <div className="bg-cyan-950/30 border-2 border-cyan-500/40 rounded-xl p-3 flex gap-3 items-start shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-lg shrink-0">
              📚
            </div>
            <div>
              <div className="text-xs font-arcade text-cyan-300">OVERACHIEVER OLIVIA (CYAN)</div>
              <div className="text-[10px] text-indigo-300 font-mono">Tactical Flanker</div>
              <p className="text-[11px] text-slate-200 mt-1 leading-tight">
                Calculates complex vector intercepts between Sam and you. Asks if the syllabus has typos.
              </p>
            </div>
          </div>

          {/* Confused Carl (Clyde) */}
          <div className="bg-orange-950/30 border-2 border-orange-500/40 rounded-xl p-3 flex gap-3 items-start shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/50 flex items-center justify-center text-lg shrink-0">
              🧢
            </div>
            <div>
              <div className="text-xs font-arcade text-orange-400">CONFUSED CARL (ORANGE)</div>
              <div className="text-[10px] text-indigo-300 font-mono">Wanderer</div>
              <p className="text-[11px] text-slate-200 mt-1 leading-tight">
                Chases when far away, but panics and wanders to the student union when getting close.
              </p>
            </div>
          </div>
        </div>

        {/* Academic Items & Mechanics */}
        <h3 className="font-arcade text-xs text-indigo-300 mb-2.5 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" /> EXAM MECHANICS & BONUSES
        </h3>

        <div className="space-y-2 text-xs">
          <div className="bg-indigo-900/50 p-2.5 rounded-xl border border-indigo-700/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base">📝</span>
              <span><strong>Homework Assignment:</strong> Standard pellet (+10 pts)</span>
            </div>
            <span className="text-yellow-300 font-mono font-bold">+10</span>
          </div>

          <div className="bg-indigo-900/50 p-2.5 rounded-xl border border-indigo-700/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base">🅰️</span>
              <span><strong>Pop Quiz / Exam:</strong> Scares students into panic mode (+50 pts)</span>
            </div>
            <span className="text-yellow-300 font-mono font-bold">+50</span>
          </div>

          <div className="bg-indigo-900/50 p-2.5 rounded-xl border border-indigo-700/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base">😱</span>
              <span><strong>Grade Panicked Student:</strong> Consecutive chain grading</span>
            </div>
            <span className="text-cyan-300 font-mono font-bold">+200 / 400 / 800 / 1600</span>
          </div>

          <div className="bg-indigo-900/50 p-2.5 rounded-xl border border-indigo-700/60 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-base">☕</span>
              <span><strong>Academic Care Packages:</strong> Special bonus items in hallway</span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-300">
              {ACADEMIC_BONUSES.slice(0, 4).map((b) => (
                <span key={b.name} title={b.name} className="bg-indigo-950 px-1.5 py-0.5 rounded border border-indigo-800">
                  {b.icon} +{b.points}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-5 pt-3 border-t border-indigo-800/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-indigo-950 font-arcade text-xs font-bold transition shadow-[0_4px_14px_rgba(251,191,36,0.35)] active:scale-95"
          >
            LET'S GRADE SOME PAPERS!
          </button>
        </div>
      </div>
    </div>
  );
};
