import React, { useRef, useEffect } from 'react';
import {
  Direction,
  GameSettings,
  GameStats,
  GameStatus,
  GhostState,
  ProfessorPacman,
  StudentGhost,
  StudentType,
  FloatingScore,
  AcademicItem,
} from '../types';
import { GRID_COLS, GRID_ROWS, TILE_SIZE, MAZE_THEMES, ACADEMIC_BONUSES, STUDENT_QUOTES, PROFESSOR_QUOTES } from '../game/mapData';
import { renderMaze, renderProfessor, renderStudentGhost, renderAcademicBonus, renderFloatingScores } from '../game/renderer';
import { updateGhost } from '../game/ghostLogic';
import { updateProfessor, checkGhostCollision, createInitialProfessor } from '../game/pacmanLogic';
import { sound } from '../utils/audio';

interface GameCanvasProps {
  map: number[][];
  prof: ProfessorPacman;
  ghosts: StudentGhost[];
  status: GameStatus;
  stats: GameStats;
  themeKey: string;
  settings: GameSettings;
  academicBonus: AcademicItem;
  floatingScores: FloatingScore[];
  onUpdateStats: (updater: (prev: GameStats) => GameStats) => void;
  onStatusChange: (status: GameStatus) => void;
  onTriggerPowerPellet: () => void;
  onEmpoweredEnd: () => void;
  onRestart: () => void;
  onNextLevel: () => void;
  onAddFloatingScore: (score: FloatingScore) => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  map,
  prof,
  ghosts,
  status,
  stats,
  themeKey,
  settings,
  academicBonus,
  floatingScores,
  onUpdateStats,
  onStatusChange,
  onTriggerPowerPellet,
  onEmpoweredEnd,
  onRestart,
  onNextLevel,
  onAddFloatingScore,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Ghost House Exit counters and mode timers
  const globalModeRef = useRef<GhostState>(GhostState.SCATTER);
  const modeTimerRef = useRef<number>(0);
  const deathTimerRef = useRef<number>(0);
  const readyTimerRef = useRef<number>(0);
  const levelClearTimerRef = useRef<number>(0);
  const quoteTimerRef = useRef<number>(0);

  const theme = MAZE_THEMES[themeKey] || MAZE_THEMES.blackboard;
  const width = GRID_COLS * TILE_SIZE;
  const height = GRID_ROWS * TILE_SIZE;

  // Main animation frame loop
  useEffect(() => {
    let animationId: number;
    let lastTime = performance.now();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const loop = (currentTime: number) => {
      const delta = currentTime - lastTime;
      lastTime = currentTime;

      // Clear Canvas
      ctx.clearRect(0, 0, width, height);

      // 1. Render Base Maze & Pellets
      renderMaze(ctx, map, theme, currentTime);

      // 2. Render Academic Bonus Item if active
      renderAcademicBonus(ctx, academicBonus, currentTime);

      // 3. Handle Game Logic based on GameStatus
      if (status === GameStatus.READY) {
        readyTimerRef.current += delta;
        if (readyTimerRef.current > 2000) {
          onStatusChange(GameStatus.PLAYING);
          readyTimerRef.current = 0;
        }

        // Render entities stationary
        renderProfessor(ctx, prof, 0, currentTime);
        ghosts.forEach((g) => renderStudentGhost(ctx, g, currentTime));

        // Draw "READY! TERM BEGINS" Overlay
        ctx.save();
        ctx.fillStyle = '#fbbf24';
        ctx.font = "bold 14px 'Press Start 2P', monospace";
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = '#fbbf24';
        ctx.shadowBlur = 10;
        ctx.fillText('TERM COMMENCING!', width / 2, (17.5 * TILE_SIZE));
        ctx.fillStyle = '#38bdf8';
        ctx.font = "10px 'Press Start 2P', monospace";
        ctx.fillText('GRADE ALL HOMEWORK!', width / 2, (19.5 * TILE_SIZE));
        ctx.restore();

      } else if (status === GameStatus.PLAYING) {
        // --- A. Mode Switching (Scatter <-> Chase Waves) ---
        modeTimerRef.current += delta;
        const cycleTime = (modeTimerRef.current / 1000) % 27; // 7s scatter + 20s chase
        if (cycleTime < 7) {
          globalModeRef.current = GhostState.SCATTER;
        } else {
          globalModeRef.current = GhostState.CHASE;
        }

        // --- B. Empowered Timer Management ---
        if (prof.isEmpowered) {
          prof.empoweredTimer -= delta;
          if (prof.empoweredTimer <= 0) {
            prof.isEmpowered = false;
            prof.empoweredTimer = 0;
            ghosts.forEach((g) => {
              if (g.state === GhostState.FRIGHTENED) {
                g.state = GhostState.CHASE;
                g.frightenedFlash = false;
              }
            });
            sound.stopSiren();
            onEmpoweredEnd();
          } else {
            // Flash ghosts in the last 2 seconds
            const flash = prof.empoweredTimer < 2200;
            ghosts.forEach((g) => {
              if (g.state === GhostState.FRIGHTENED) {
                g.frightenedFlash = flash;
              }
            });
          }
        }

        // --- C. Release Ghosts from Dormitory gradually ---
        // Slacker Sam is already out
        // Pete exits when 10 pellets eaten
        if (ghosts[1] && ghosts[1].state === GhostState.IN_HOUSE && stats.totalPellets - stats.pelletsRemaining > 10) {
          ghosts[1].state = GhostState.CHASE;
          ghosts[1].x = 13.5 * TILE_SIZE;
          ghosts[1].y = 11 * TILE_SIZE;
        }
        // Olivia exits when 30 pellets eaten
        if (ghosts[2] && ghosts[2].state === GhostState.IN_HOUSE && stats.totalPellets - stats.pelletsRemaining > 30) {
          ghosts[2].state = GhostState.CHASE;
          ghosts[2].x = 13.5 * TILE_SIZE;
          ghosts[2].y = 11 * TILE_SIZE;
        }
        // Carl exits when 60 pellets eaten
        if (ghosts[3] && ghosts[3].state === GhostState.IN_HOUSE && stats.totalPellets - stats.pelletsRemaining > 60) {
          ghosts[3].state = GhostState.CHASE;
          ghosts[3].x = 13.5 * TILE_SIZE;
          ghosts[3].y = 11 * TILE_SIZE;
        }

        // --- D. Update Professor Movement & Eating ---
        const { atePellet, atePowerPellet, pelletPos } = updateProfessor(prof, map, settings.gameSpeed);

        if (atePellet) {
          sound.playChomp();
          onUpdateStats((prev) => {
            const newScore = prev.score + (atePowerPellet ? 50 : 10);
            const newPelletsLeft = prev.pelletsRemaining - 1;
            const newHigh = Math.max(prev.highScore, newScore);
            return {
              ...prev,
              score: newScore,
              highScore: newHigh,
              pelletsRemaining: newPelletsLeft,
            };
          });

          // If ate Power Exam
          if (atePowerPellet) {
            sound.playPowerPellet();
            sound.startSiren();
            prof.isEmpowered = true;
            prof.empoweredTimer = 7000;
            ghosts.forEach((g) => {
              if (g.state !== GhostState.EATEN && g.state !== GhostState.IN_HOUSE) {
                g.state = GhostState.FRIGHTENED;
                g.frightenedFlash = false;
                // Reverse direction when scared
                g.dir = g.dir === Direction.UP ? Direction.DOWN : g.dir === Direction.DOWN ? Direction.UP : g.dir === Direction.LEFT ? Direction.RIGHT : Direction.LEFT;
              }
            });
            onTriggerPowerPellet();

            // Spawn floating "+50"
            if (pelletPos) {
              onAddFloatingScore({
                id: Date.now() + Math.random(),
                text: 'EXAM! +50',
                x: pelletPos.col * TILE_SIZE + TILE_SIZE / 2,
                y: pelletPos.row * TILE_SIZE,
                color: '#38bdf8',
                opacity: 1,
                vy: -0.8,
                life: 60,
              });
            }

            // Professor speech
            prof.dialogue = "POP QUIZ TIME!";
            prof.dialogueTimer = 100;
          }

          // Check Level Cleared (all pellets eaten)
          if (stats.pelletsRemaining <= 1) {
            onStatusChange(GameStatus.LEVEL_CLEARED);
            sound.playVictory();
            sound.stopSiren();
            levelClearTimerRef.current = 0;
          }
        }

        // --- E. Check Bonus Item Collision ---
        if (academicBonus.active) {
          const bonusX = academicBonus.col * TILE_SIZE + TILE_SIZE / 2;
          const bonusY = academicBonus.row * TILE_SIZE + TILE_SIZE / 2;
          if (Math.hypot(prof.x - bonusX, prof.y - bonusY) < TILE_SIZE * 0.8) {
            academicBonus.active = false;
            sound.playEatFruit();
            onUpdateStats((prev) => ({
              ...prev,
              score: prev.score + academicBonus.points,
              highScore: Math.max(prev.highScore, prev.score + academicBonus.points),
              academicItemsCollected: prev.academicItemsCollected + 1,
            }));

            onAddFloatingScore({
              id: Date.now(),
              text: `+${academicBonus.points}`,
              x: bonusX,
              y: bonusY - 8,
              color: '#fbbf24',
              opacity: 1,
              vy: -1.0,
              life: 80,
            });

            prof.dialogue = "RESEARCH GRANT!";
            prof.dialogueTimer = 80;
          }
        }

        // --- F. Update Student Ghosts & Check Collisions ---
        const samGhost = ghosts[0];
        let profDied = false;

        ghosts.forEach((ghost) => {
          updateGhost(ghost, map, { x: prof.x, y: prof.y }, prof.dir, samGhost, globalModeRef.current, settings.gameSpeed);

          const colResult = checkGhostCollision(prof, ghost);
          if (colResult === 'eat_ghost') {
            // Professor grades the panicked student!
            ghost.state = GhostState.EATEN;
            const streak = stats.ghostsEatenStreak + 1;
            const pointsAwarded = Math.min(1600, 200 * Math.pow(2, streak - 1));

            sound.playEatGhost(streak);

            onUpdateStats((prev) => {
              const newScore = prev.score + pointsAwarded;
              return {
                ...prev,
                score: newScore,
                highScore: Math.max(prev.highScore, newScore),
                ghostsEatenStreak: streak,
                studentsGraded: prev.studentsGraded + 1,
              };
            });

            onAddFloatingScore({
              id: Date.now() + Math.random(),
              text: `+${pointsAwarded}`,
              x: ghost.x,
              y: ghost.y - 8,
              color: '#34d399',
              opacity: 1,
              vy: -1.0,
              life: 70,
            });

            ghost.dialogue = "FAILED!";
            ghost.dialogueTimer = 60;
            prof.dialogue = "GRADED: F!";
            prof.dialogueTimer = 60;

          } else if (colResult === 'kill_prof') {
            profDied = true;
          }
        });

        // Trigger Death if caught by student ghost
        if (profDied) {
          sound.playDeath();
          sound.stopSiren();
          deathTimerRef.current = 0;
          onStatusChange(GameStatus.PACMAN_DYING);
        }

        // --- G. Random Comic Quotes between Faculty & Students ---
        quoteTimerRef.current += delta;
        if (quoteTimerRef.current > 6000) {
          quoteTimerRef.current = 0;
          const randomGhost = ghosts[Math.floor(Math.random() * ghosts.length)];
          if (randomGhost && randomGhost.state !== GhostState.EATEN && !randomGhost.dialogue) {
            const pool = prof.isEmpowered ? STUDENT_QUOTES.frightened : STUDENT_QUOTES.normal;
            randomGhost.dialogue = pool[Math.floor(Math.random() * pool.length)];
            randomGhost.dialogueTimer = 120;
          }
        }

        // Render Entities
        renderProfessor(ctx, prof, 0, currentTime);
        ghosts.forEach((g) => renderStudentGhost(ctx, g, currentTime));

      } else if (status === GameStatus.PACMAN_DYING) {
        deathTimerRef.current += delta;
        const deathProgress = Math.min(1, deathTimerRef.current / 1200);

        renderProfessor(ctx, prof, deathProgress, currentTime);

        if (deathProgress >= 1) {
          if (stats.lives > 1) {
            onUpdateStats((prev) => ({
              ...prev,
              lives: prev.lives - 1,
              ghostsEatenStreak: 0,
            }));
            // Reset positions
            prof.x = 13.5 * TILE_SIZE;
            prof.y = 23 * TILE_SIZE;
            prof.dir = Direction.LEFT;
            prof.nextDir = Direction.LEFT;
            prof.isEmpowered = false;
            ghosts[0].x = 13.5 * TILE_SIZE; ghosts[0].y = 11 * TILE_SIZE; ghosts[0].state = GhostState.SCATTER; ghosts[0].dir = Direction.LEFT;
            ghosts[1].x = 13.5 * TILE_SIZE; ghosts[1].y = 14 * TILE_SIZE; ghosts[1].state = GhostState.IN_HOUSE;
            ghosts[2].x = 11.5 * TILE_SIZE; ghosts[2].y = 14 * TILE_SIZE; ghosts[2].state = GhostState.IN_HOUSE;
            ghosts[3].x = 15.5 * TILE_SIZE; ghosts[3].y = 14 * TILE_SIZE; ghosts[3].state = GhostState.IN_HOUSE;

            onStatusChange(GameStatus.READY);
          } else {
            onUpdateStats((prev) => ({ ...prev, lives: 0 }));
            onStatusChange(GameStatus.GAME_OVER);
          }
        }

      } else if (status === GameStatus.LEVEL_CLEARED) {
        levelClearTimerRef.current += delta;
        renderProfessor(ctx, prof, 0, currentTime);

        // Flash screen with academic honors banner
        ctx.save();
        ctx.fillStyle = Math.floor(currentTime / 200) % 2 === 0 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(59, 130, 246, 0.3)';
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = '#fbbf24';
        ctx.font = "bold 15px 'Press Start 2P', monospace";
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('SEMESTER PASSED!', width / 2, 16 * TILE_SIZE);
        ctx.fillStyle = '#ffffff';
        ctx.font = "9px 'Press Start 2P', monospace";
        ctx.fillText('ALL PAPERS GRADED!', width / 2, 18 * TILE_SIZE);
        ctx.restore();

        if (levelClearTimerRef.current > 3000) {
          onNextLevel();
          levelClearTimerRef.current = 0;
        }

      } else if (status === GameStatus.PAUSED) {
        renderProfessor(ctx, prof, 0, currentTime);
        ghosts.forEach((g) => renderStudentGhost(ctx, g, currentTime));

        // Dark dim backdrop
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = '#fbbf24';
        ctx.font = "bold 16px 'Press Start 2P', monospace";
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('OFFICE HOURS PAUSED', width / 2, 15 * TILE_SIZE);

        ctx.fillStyle = '#94a3b8';
        ctx.font = "10px 'Press Start 2P', monospace";
        ctx.fillText('PRESS SPACE OR P TO RESUME', width / 2, 18 * TILE_SIZE);

      } else if (status === GameStatus.GAME_OVER) {
        renderProfessor(ctx, prof, 1, currentTime);

        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = '#f43f5e';
        ctx.font = "bold 16px 'Press Start 2P', monospace";
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('ACADEMIC PROBATION', width / 2, 13 * TILE_SIZE);

        ctx.fillStyle = '#ffffff';
        ctx.font = "11px 'Press Start 2P', monospace";
        ctx.fillText(`FINAL PAPERS: ${stats.score}`, width / 2, 16 * TILE_SIZE);

        ctx.fillStyle = '#fbbf24';
        ctx.font = "10px 'Press Start 2P', monospace";
        ctx.fillText(`HIGH SCORE: ${stats.highScore}`, width / 2, 18 * TILE_SIZE);
      }

      // --- Render Floating Scores & Floating Labels ---
      for (let i = floatingScores.length - 1; i >= 0; i--) {
        const s = floatingScores[i];
        s.y += s.vy;
        s.life -= 1;
        s.opacity = s.life / 60;
        if (s.life <= 0) {
          floatingScores.splice(i, 1);
        }
      }
      renderFloatingScores(ctx, floatingScores);

      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [map, prof, ghosts, status, stats, themeKey, settings, academicBonus, floatingScores, onUpdateStats, onStatusChange, onTriggerPowerPellet, onEmpoweredEnd, onNextLevel, onAddFloatingScore]);

  return (
    <div className={`relative flex items-center justify-center p-2 sm:p-3 rounded-2xl bg-indigo-950/90 border-2 border-indigo-500/40 shadow-[0_0_35px_rgba(99,102,241,0.25)] overflow-hidden ${settings.crtFilter ? 'crt-effect' : ''}`}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full max-w-[504px] h-auto aspect-[28/31] bg-[#070a1e] rounded-xl shadow-inner select-none block"
      />
    </div>
  );
};
