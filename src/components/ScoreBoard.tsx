import React from 'react';
import { GameStats, ProfessorSkin } from '../types';
import { ACADEMIC_BONUSES } from '../game/mapData';
import { Volume2, VolumeX, Sparkles, BookOpen, Settings, HelpCircle, Trophy, GraduationCap, RotateCcw, Pause, Play } from 'lucide-react';

interface ScoreBoardProps {
  stats: GameStats;
  empoweredTimeLeft: number;
  empoweredTotalTime: number;
  isPaused: boolean;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onTogglePause: () => void;
  onRestart: () => void;
  onOpenGuide: () => void;
  onOpenSettings: () => void;
  skin: ProfessorSkin;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  stats,
  empoweredTimeLeft,
  empoweredTotalTime,
  isPaused,
  soundEnabled,
  onToggleSound,
  onTogglePause,
  onRestart,
  onOpenGuide,
  onOpenSettings,
}) => {
  const semesterNames = [
    'Freshman Orientation',
    'Midterm Exam Week',
    'Finals All-Nighter',
    'Master Thesis Defense',
    'Doctoral Dissertation',
    'Tenure Review Board',
    'Dean of Academic Affairs',
  ];

  const currentTerm = semesterNames[(stats.level - 1) % semesterNames.length];
  const powerProgress = empoweredTotalTime > 0 ? (empoweredTimeLeft / empoweredTotalTime) * 100 : 0;

  return (
    <header className="w-full max-w-4xl mx-auto mb-2 px-3 sm:px-4 py-2.5 bg-indigo-950/85 backdrop-blur-md border-2 border-indigo-500/40 rounded-2xl shadow-[0_8px_32px_rgba(79,70,229,0.25)] flex flex-col gap-2.5">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-indigo-800/60 pb-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-amber-400/20 border-2 border-amber-400/50 rounded-xl text-amber-300 shadow-sm shadow-amber-500/20">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm md:text-base font-arcade font-bold tracking-tight text-amber-300 flex items-center gap-1.5 drop-shadow-[0_2px_8px_rgba(251,191,36,0.35)]">
              PROFESSOR PAC-MAN
            </h1>
            <p className="text-xs text-indigo-200 font-mono">
              Term {stats.level}: <span className="text-emerald-300 font-bold">{currentTerm}</span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onToggleSound}
            className="p-2 rounded-xl bg-indigo-900/80 hover:bg-indigo-800 text-slate-200 hover:text-white border border-indigo-700/80 transition shadow-sm active:scale-95"
            title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
          </button>
          <button
            onClick={onTogglePause}
            className="p-2 rounded-xl bg-indigo-900/80 hover:bg-indigo-800 text-slate-200 hover:text-white border border-indigo-700/80 transition shadow-sm active:scale-95"
            title={isPaused ? 'Resume Game' : 'Pause Game'}
          >
            {isPaused ? <Play className="w-4 h-4 text-amber-300" /> : <Pause className="w-4 h-4 text-indigo-200" />}
          </button>
          <button
            onClick={onRestart}
            className="p-2 rounded-xl bg-indigo-900/80 hover:bg-indigo-800 text-slate-200 hover:text-white border border-indigo-700/80 transition shadow-sm active:scale-95"
            title="Restart Game"
          >
            <RotateCcw className="w-4 h-4 text-indigo-200" />
          </button>
          <button
            onClick={onOpenGuide}
            className="p-2 rounded-xl bg-indigo-900/80 hover:bg-indigo-800 text-slate-200 hover:text-white border border-indigo-700/80 transition shadow-sm active:scale-95"
            title="Faculty & Student Directory"
          >
            <BookOpen className="w-4 h-4 text-cyan-300" />
          </button>
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-indigo-900/80 hover:bg-indigo-800 text-slate-200 hover:text-white border border-indigo-700/80 transition shadow-sm active:scale-95"
            title="Game Settings & Themes"
          >
            <Settings className="w-4 h-4 text-indigo-200" />
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-arcade text-xs">
        {/* Current Score */}
        <div className="bg-indigo-900/50 p-2 sm:p-2.5 rounded-xl border border-indigo-700/60 shadow-sm">
          <div className="text-[10px] text-indigo-300 uppercase tracking-wider mb-1 font-mono font-medium">Papers Graded</div>
          <div className="text-sm sm:text-base text-yellow-300 font-bold tracking-wider drop-shadow-[0_0_8px_rgba(253,224,71,0.4)]">
            {stats.score.toLocaleString()}
          </div>
        </div>

        {/* High Score */}
        <div className="bg-indigo-900/50 p-2 sm:p-2.5 rounded-xl border border-indigo-700/60 shadow-sm">
          <div className="text-[10px] text-indigo-300 uppercase tracking-wider mb-1 font-mono font-medium flex items-center justify-center gap-1">
            <Trophy className="w-3 h-3 text-amber-300" /> Dean's List
          </div>
          <div className="text-sm sm:text-base text-amber-300 font-bold tracking-wider drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]">
            {stats.highScore.toLocaleString()}
          </div>
        </div>

        {/* Lives / Tenure Credits */}
        <div className="bg-indigo-900/50 p-2 sm:p-2.5 rounded-xl border border-indigo-700/60 shadow-sm flex flex-col items-center justify-center">
          <div className="text-[10px] text-indigo-300 uppercase tracking-wider mb-1 font-mono font-medium">Tenure Lives</div>
          <div className="flex items-center gap-1.5">
            {Array.from({ length: Math.max(0, stats.lives) }).map((_, i) => (
              <span key={i} className="text-base" title="Professor Life">
                🎓
              </span>
            ))}
            {stats.lives === 0 && <span className="text-xs text-rose-400 font-bold">Final Chance!</span>}
          </div>
        </div>

        {/* Homework Progress */}
        <div className="bg-indigo-900/50 p-2 sm:p-2.5 rounded-xl border border-indigo-700/60 shadow-sm">
          <div className="text-[10px] text-indigo-300 uppercase tracking-wider mb-1 font-mono font-medium">Assignments Left</div>
          <div className="text-sm sm:text-base text-cyan-300 font-bold drop-shadow-[0_0_8px_rgba(103,232,249,0.35)]">
            {stats.pelletsRemaining} <span className="text-indigo-400 text-xs font-normal">/ {stats.totalPellets}</span>
          </div>
        </div>
      </div>

      {/* Pop Quiz Panic Mode Active Bar */}
      {empoweredTimeLeft > 0 && (
        <div className="w-full bg-gradient-to-r from-rose-950/80 via-purple-950/80 to-rose-950/80 border-2 border-rose-500/50 rounded-xl p-2 flex flex-col gap-1.5 animate-pulse shadow-md shadow-rose-950/50">
          <div className="flex items-center justify-between text-[10px] font-arcade text-rose-200 px-1">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" /> POP QUIZ ACTIVE! (Students Panicking)
            </span>
            <span className="font-bold text-yellow-300">{Math.ceil(empoweredTimeLeft / 1000)}s</span>
          </div>
          <div className="w-full bg-indigo-950/80 h-2 rounded-full overflow-hidden p-0.5 border border-rose-500/30">
            <div
              className="bg-gradient-to-r from-yellow-400 via-amber-400 to-rose-500 h-full rounded-full transition-all duration-100 shadow-[0_0_8px_rgba(251,191,36,0.6)]"
              style={{ width: `${powerProgress}%` }}
            />
          </div>
        </div>
      )}
    </header>
  );
};
