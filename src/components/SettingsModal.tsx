import React from 'react';
import { X, Sliders, Palette, Zap, Monitor, Volume2, GraduationCap } from 'lucide-react';
import { GameSettings, ProfessorSkin } from '../types';
import { MAZE_THEMES } from '../game/mapData';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  currentThemeKey: string;
  onSelectTheme: (themeKey: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  currentThemeKey,
  onSelectTheme,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-indigo-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0B0F28] border-2 border-indigo-500/50 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] p-4 sm:p-6 text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-indigo-800/80 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-amber-400/20 border border-amber-400/50 rounded-lg text-amber-300">
              <Sliders className="w-5 h-5" />
            </div>
            <h2 className="text-sm sm:text-base font-arcade text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]">
              ACADEMIC SETTINGS
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-indigo-900/80 hover:bg-indigo-800 text-indigo-300 hover:text-white border border-indigo-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          {/* Professor Skin Selector */}
          <div>
            <label className="font-arcade text-[11px] text-indigo-300 mb-2 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-amber-400" /> PROFESSOR ATTIRE & DISCIPLINE
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: ProfessorSkin.CLASSIC_TWEED, name: 'Classic Tweed', icon: '👨‍🏫', desc: 'Distinguished Dean' },
                { id: ProfessorSkin.LAB_SCIENTIST, name: 'Lab Scientist', icon: '🥼', desc: 'Lab Goggles' },
                { id: ProfessorSkin.MATH_WIZARD, name: 'Math Wizard', icon: '🧙‍♂️', desc: 'Calculus & Pi Spells' },
                { id: ProfessorSkin.CS_HACKER, name: 'CS Hacker', icon: '💻', desc: 'Binary Matrix' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => onUpdateSettings({ skin: s.id })}
                  className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition active:scale-95 ${
                    settings.skin === s.id
                      ? 'bg-amber-400/20 border-2 border-amber-400 text-amber-300 shadow-md shadow-amber-500/20'
                      : 'bg-indigo-900/50 border border-indigo-700/60 hover:border-indigo-500 text-slate-200'
                  }`}
                >
                  <span className="text-xl">{s.icon}</span>
                  <div>
                    <div className="font-arcade text-[10px]">{s.name}</div>
                    <div className="text-[10px] text-indigo-300 font-mono">{s.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Campus Maze Theme */}
          <div>
            <label className="font-arcade text-[11px] text-indigo-300 mb-2 flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-cyan-400" /> CAMPUS MAZE THEME
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.entries(MAZE_THEMES).map(([key, t]) => (
                <button
                  key={key}
                  onClick={() => onSelectTheme(key)}
                  className={`p-2 rounded-xl border text-left flex items-center gap-2 transition active:scale-95 ${
                    currentThemeKey === key
                      ? 'bg-cyan-400/20 border-2 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/20'
                      : 'bg-indigo-900/50 border border-indigo-700/60 hover:border-indigo-500 text-slate-200'
                  }`}
                >
                  <div
                    className="w-4 h-4 rounded-full border border-white/40 shrink-0 shadow-sm"
                    style={{ backgroundColor: t.wallBorder }}
                  />
                  <span className="font-mono text-xs truncate">{t.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Game Speed */}
          <div>
            <label className="font-arcade text-[11px] text-indigo-300 mb-2 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-yellow-400" /> SEMESTER PACING (SPEED)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { speed: 1.0, label: 'Normal Pace' },
                { speed: 1.25, label: 'Fast (Midterms)' },
                { speed: 1.5, label: 'Turbo (Finals)' },
              ].map((sp) => (
                <button
                  key={sp.speed}
                  onClick={() => onUpdateSettings({ gameSpeed: sp.speed })}
                  className={`p-2.5 rounded-xl border text-center font-mono text-xs transition active:scale-95 ${
                    settings.gameSpeed === sp.speed
                      ? 'bg-yellow-400/20 border-2 border-yellow-400 text-yellow-300 shadow-md shadow-yellow-500/20 font-bold'
                      : 'bg-indigo-900/50 border border-indigo-700/60 hover:border-indigo-500 text-slate-200'
                  }`}
                >
                  {sp.label}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles (Sound & CRT) */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-indigo-800/80">
            <button
              onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
              className={`p-2.5 rounded-xl border flex items-center justify-between transition active:scale-95 ${
                settings.soundEnabled
                  ? 'bg-emerald-950/60 border-2 border-emerald-400/70 text-emerald-300 shadow-sm'
                  : 'bg-indigo-900/50 border border-indigo-700/60 text-indigo-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4" />
                <span className="font-mono">8-Bit Audio</span>
              </div>
              <span className="font-arcade text-[10px] font-bold">{settings.soundEnabled ? 'ON' : 'OFF'}</span>
            </button>

            <button
              onClick={() => onUpdateSettings({ crtFilter: !settings.crtFilter })}
              className={`p-2.5 rounded-xl border flex items-center justify-between transition active:scale-95 ${
                settings.crtFilter
                  ? 'bg-purple-950/60 border-2 border-purple-400/70 text-purple-300 shadow-sm'
                  : 'bg-indigo-900/50 border border-indigo-700/60 text-indigo-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4" />
                <span className="font-mono">CRT Scanlines</span>
              </div>
              <span className="font-arcade text-[10px] font-bold">{settings.crtFilter ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-indigo-800/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-indigo-950 font-arcade text-xs font-bold transition shadow-[0_4px_14px_rgba(251,191,36,0.35)] active:scale-95"
          >
            SAVE & CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
