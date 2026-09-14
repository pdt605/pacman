import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Direction,
  GameSettings,
  GameStats,
  GameStatus,
  GhostState,
  ProfessorPacman,
  ProfessorSkin,
  StudentGhost,
  FloatingScore,
  AcademicItem,
} from './types';
import { DEFAULT_MAZE, GRID_COLS, GRID_ROWS, TILE_SIZE, ACADEMIC_BONUSES } from './game/mapData';
import { createInitialProfessor } from './game/pacmanLogic';
import { createInitialGhosts } from './game/ghostLogic';
import { ScoreBoard } from './components/ScoreBoard';
import { ControlsOverlay } from './components/ControlsOverlay';
import { GameCanvas } from './components/GameCanvas';
import { CharacterGuideModal } from './components/CharacterGuideModal';
import { SettingsModal } from './components/SettingsModal';
import { sound } from './utils/audio';
import { RotateCcw, Trophy, Sparkles, BookOpen, AlertCircle } from 'lucide-react';

function cloneMaze(maze: number[][]): number[][] {
  return maze.map((row) => [...row]);
}

function countPellets(maze: number[][]): number {
  let count = 0;
  for (let r = 0; r < maze.length; r++) {
    for (let c = 0; c < maze[r].length; c++) {
      if (maze[r][c] === 2 || maze[r][c] === 3) {
        count++;
      }
    }
  }
  return count;
}

export default function App() {
  const initialMap = cloneMaze(DEFAULT_MAZE);
  const initialPelletCount = countPellets(initialMap);

  // Settings State with LocalStorage persistence
  const [settings, setSettings] = useState<GameSettings>(() => {
    const saved = localStorage.getItem('prof_pacman_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return {
      soundEnabled: true,
      musicEnabled: true,
      crtFilter: false,
      gameSpeed: 1.0,
      skin: ProfessorSkin.CLASSIC_TWEED,
    };
  });

  const [themeKey, setThemeKey] = useState<string>('vibrant');

  // Game Stats
  const [stats, setStats] = useState<GameStats>(() => {
    const savedHigh = localStorage.getItem('prof_pacman_highscore');
    return {
      score: 0,
      highScore: savedHigh ? parseInt(savedHigh, 10) : 10000,
      level: 1,
      lives: 3,
      pelletsRemaining: initialPelletCount,
      totalPellets: initialPelletCount,
      ghostsEatenStreak: 0,
      academicItemsCollected: 0,
      studentsGraded: 0,
    };
  });

  const [status, setStatus] = useState<GameStatus>(GameStatus.READY);
  const [map, setMap] = useState<number[][]>(initialMap);
  const [prof, setProf] = useState<ProfessorPacman>(() => createInitialProfessor(settings.skin));
  const [ghosts, setGhosts] = useState<StudentGhost[]>(() => createInitialGhosts());

  // Academic Bonus Item in center hall
  const [academicBonus, setAcademicBonus] = useState<AcademicItem>({
    name: 'Espresso Shot',
    points: 100,
    icon: '☕',
    col: 13.5,
    row: 17,
    active: false,
    timer: 0,
  });

  const [floatingScores, setFloatingScores] = useState<FloatingScore[]>([]);

  // Modals
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Touch Swipe tracking
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Save Settings & HighScore to LocalStorage
  useEffect(() => {
    localStorage.setItem('prof_pacman_settings', JSON.stringify(settings));
    sound.setEnabled(settings.soundEnabled);
  }, [settings]);

  useEffect(() => {
    if (stats.highScore > 0) {
      localStorage.setItem('prof_pacman_highscore', stats.highScore.toString());
    }
  }, [stats.highScore]);

  // Sync skin change to Professor Pacman
  useEffect(() => {
    setProf((prev) => ({ ...prev, skin: settings.skin }));
  }, [settings.skin]);

  // Restart / Reset Game
  const handleRestart = useCallback(() => {
    const newMap = cloneMaze(DEFAULT_MAZE);
    const count = countPellets(newMap);
    setMap(newMap);
    setProf(createInitialProfessor(settings.skin));
    setGhosts(createInitialGhosts());
    setFloatingScores([]);
    setAcademicBonus({
      name: ACADEMIC_BONUSES[0].name,
      points: ACADEMIC_BONUSES[0].points,
      icon: ACADEMIC_BONUSES[0].icon,
      col: 13.5,
      row: 17,
      active: false,
      timer: 0,
    });
    setStats((prev) => ({
      ...prev,
      score: 0,
      level: 1,
      lives: 3,
      pelletsRemaining: count,
      totalPellets: count,
      ghostsEatenStreak: 0,
      studentsGraded: 0,
      academicItemsCollected: 0,
    }));
    setStatus(GameStatus.READY);
    sound.stopSiren();
    sound.playIntroTheme();
  }, [settings.skin]);

  // Advance to Next Academic Level
  const handleNextLevel = useCallback(() => {
    const newMap = cloneMaze(DEFAULT_MAZE);
    const count = countPellets(newMap);
    const nextLevel = stats.level + 1;
    const bonusIdx = Math.min(ACADEMIC_BONUSES.length - 1, nextLevel - 1);
    const nextBonus = ACADEMIC_BONUSES[bonusIdx];

    setMap(newMap);
    const newProf = createInitialProfessor(settings.skin);
    newProf.speed = Math.min(2.6, 2.0 + (nextLevel - 1) * 0.1);
    setProf(newProf);

    const newGhosts = createInitialGhosts().map((g) => ({
      ...g,
      speed: Math.min(2.5, g.speed + (nextLevel - 1) * 0.12),
    }));
    setGhosts(newGhosts);

    setFloatingScores([]);
    setAcademicBonus({
      name: nextBonus.name,
      points: nextBonus.points,
      icon: nextBonus.icon,
      col: 13.5,
      row: 17,
      active: false,
      timer: 0,
    });

    setStats((prev) => ({
      ...prev,
      level: nextLevel,
      pelletsRemaining: count,
      totalPellets: count,
      ghostsEatenStreak: 0,
    }));

    setStatus(GameStatus.READY);
    sound.stopSiren();
    sound.playIntroTheme();
  }, [stats.level, settings.skin]);

  // Toggle Pause
  const handleTogglePause = useCallback(() => {
    setStatus((prev) => {
      if (prev === GameStatus.PLAYING) {
        sound.stopSiren();
        return GameStatus.PAUSED;
      } else if (prev === GameStatus.PAUSED) {
        return GameStatus.PLAYING;
      }
      return prev;
    });
  }, []);

  // Keyboard handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Pause toggle
      if (e.code === 'Space' || e.code === 'KeyP') {
        e.preventDefault();
        handleTogglePause();
        return;
      }

      let newDir: Direction | null = null;
      switch (e.code) {
        case 'ArrowUp':
        case 'KeyW':
          newDir = Direction.UP;
          break;
        case 'ArrowDown':
        case 'KeyS':
          newDir = Direction.DOWN;
          break;
        case 'ArrowLeft':
        case 'KeyA':
          newDir = Direction.LEFT;
          break;
        case 'ArrowRight':
        case 'KeyD':
          newDir = Direction.RIGHT;
          break;
      }

      if (newDir) {
        e.preventDefault();
        setProf((prev) => ({ ...prev, nextDir: newDir! }));
        if (status === GameStatus.READY) {
          setStatus(GameStatus.PLAYING);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, handleTogglePause]);

  // Touch Swipe Handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || e.changedTouches.length === 0) return;
    const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
    const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    if (Math.max(absX, absY) > 20) {
      let newDir: Direction;
      if (absX > absY) {
        newDir = deltaX > 0 ? Direction.RIGHT : Direction.LEFT;
      } else {
        newDir = deltaY > 0 ? Direction.DOWN : Direction.UP;
      }
      setProf((prev) => ({ ...prev, nextDir: newDir }));
      if (status === GameStatus.READY) {
        setStatus(GameStatus.PLAYING);
      }
    }
    touchStartRef.current = null;
  };

  // Bonus Item Spawn Check based on pellets eaten
  useEffect(() => {
    const pelletsEaten = stats.totalPellets - stats.pelletsRemaining;
    if ((pelletsEaten === 70 || pelletsEaten === 170) && !academicBonus.active) {
      setAcademicBonus((prev) => ({ ...prev, active: true }));
      // Hide bonus after 10 seconds if not collected
      setTimeout(() => {
        setAcademicBonus((prev) => ({ ...prev, active: false }));
      }, 10000);
    }
  }, [stats.pelletsRemaining, stats.totalPellets, academicBonus.active]);

  const handleDirectionInput = (dir: Direction) => {
    setProf((prev) => ({ ...prev, nextDir: dir }));
    if (status === GameStatus.READY) {
      setStatus(GameStatus.PLAYING);
    }
  };

  return (
    <main
      className="min-h-screen bg-gradient-to-b from-[#0F143A] via-[#0B0F28] to-[#070A1E] text-slate-100 flex flex-col items-center justify-between p-2 sm:p-4 select-none touch-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Academic Header & Scoreboard */}
      <ScoreBoard
        stats={stats}
        empoweredTimeLeft={prof.empoweredTimer}
        empoweredTotalTime={7000}
        isPaused={status === GameStatus.PAUSED}
        soundEnabled={settings.soundEnabled}
        onToggleSound={() => setSettings((s) => ({ ...s, soundEnabled: !s.soundEnabled }))}
        onTogglePause={handleTogglePause}
        onRestart={handleRestart}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        skin={settings.skin}
      />

      {/* Main Game Screen Canvas */}
      <div className="relative flex flex-col items-center justify-center my-auto">
        <GameCanvas
          map={map}
          prof={prof}
          ghosts={ghosts}
          status={status}
          stats={stats}
          themeKey={themeKey}
          settings={settings}
          academicBonus={academicBonus}
          floatingScores={floatingScores}
          onUpdateStats={setStats}
          onStatusChange={setStatus}
          onTriggerPowerPellet={() => {
            setStats((s) => ({ ...s, ghostsEatenStreak: 0 }));
          }}
          onEmpoweredEnd={() => {
            setStats((s) => ({ ...s, ghostsEatenStreak: 0 }));
          }}
          onRestart={handleRestart}
          onNextLevel={handleNextLevel}
          onAddFloatingScore={(score) => setFloatingScores((prev) => [...prev, score])}
        />

        {/* Game Over Action Overlay */}
        {status === GameStatus.GAME_OVER && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-indigo-950/90 backdrop-blur-md rounded-2xl p-6 text-center animate-fadeIn border-2 border-rose-500/50 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border-2 border-rose-500/50 flex items-center justify-center text-3xl mb-3 shadow-lg shadow-rose-500/30">
              📋
            </div>
            <h2 className="font-arcade text-lg sm:text-xl text-rose-400 mb-1 drop-shadow-[0_0_10px_rgba(244,63,94,0.4)]">
              ACADEMIC PROBATION!
            </h2>
            <p className="text-xs text-indigo-200 font-mono mb-4 max-w-xs">
              The students cornered you for extra credit! Final Semester Score: <span className="text-yellow-300 font-bold">{stats.score}</span>
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleRestart}
                className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-indigo-950 font-arcade text-xs font-bold transition flex items-center gap-2 shadow-[0_4px_16px_rgba(251,191,36,0.4)] active:scale-95"
              >
                <RotateCcw className="w-4 h-4" /> RETAKE SEMESTER
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Virtual D-Pad & Controls Info */}
      <ControlsOverlay
        onDirectionChange={handleDirectionInput}
        currentDir={prof.dir}
      />

      {/* Character & Academic Mechanics Guide Modal */}
      <CharacterGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={(newS) => setSettings((prev) => ({ ...prev, ...newS }))}
        currentThemeKey={themeKey}
        onSelectTheme={setThemeKey}
      />
    </main>
  );
}
