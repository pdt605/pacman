export enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  NONE = 'NONE',
}

export enum TileType {
  EMPTY = 0,
  WALL = 1,
  PELLET = 2,          // Homework assignments (+10 pts)
  POWER_PELLET = 3,    // Pop Quiz / Pop Exam (+50 pts & scares students)
  GHOST_HOUSE = 4,     // Dorm / Student Lounge
  GHOST_GATE = 5,      // Dorm Door
  FRUIT_SPAWN = 6,     // Academic Bonus Item spawn point
}

export enum GhostState {
  CHASE = 'CHASE',
  SCATTER = 'SCATTER',
  FRIGHTENED = 'FRIGHTENED',
  EATEN = 'EATEN',
  IN_HOUSE = 'IN_HOUSE',
}

export enum StudentType {
  SAM = 'SAM',         // Red (Blinky) - Slacker Sam: Relentless Chaser ("Need extra credit!")
  PETE = 'PETE',       // Pink (Pinky) - Procrastinator Pete: Ambush / Interceptor ("Due tonight?!")
  OLIVIA = 'OLIVIA',   // Cyan (Inky) - Overachiever Olivia: Tactical Flanker ("Is this on the test?!")
  CARL = 'CARL',       // Orange (Clyde) - Confused Carl: Wanders around ("Wrong lecture hall!")
}

export enum GameStatus {
  READY = 'READY',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  PACMAN_DYING = 'PACMAN_DYING',
  LEVEL_CLEARED = 'LEVEL_CLEARED',
  GAME_OVER = 'GAME_OVER',
}

export enum ProfessorSkin {
  CLASSIC_TWEED = 'CLASSIC_TWEED',
  LAB_SCIENTIST = 'LAB_SCIENTIST',
  MATH_WIZARD = 'MATH_WIZARD',
  CS_HACKER = 'CS_HACKER',
}

export interface Position {
  x: number;
  y: number;
}

export interface GridCoord {
  col: number;
  row: number;
}

export interface StudentGhost {
  id: StudentType;
  name: string;
  major: string;
  color: string;
  frightenedColor: string;
  x: number;
  y: number;
  dir: Direction;
  nextDir: Direction;
  state: GhostState;
  speed: number;
  scatterTarget: GridCoord;
  homeHousePos: Position;
  frightenedTimer: number;
  frightenedFlash: boolean;
  eatenScore: number;
  animationFrame: number;
  dialogue?: string;
  dialogueTimer?: number;
}

export interface ProfessorPacman {
  x: number;
  y: number;
  dir: Direction;
  nextDir: Direction;
  speed: number;
  mouthAngle: number;
  mouthClosing: boolean;
  skin: ProfessorSkin;
  isEmpowered: boolean;
  empoweredTimer: number;
  dialogue?: string;
  dialogueTimer?: number;
}

export interface AcademicItem {
  name: string;
  points: number;
  icon: string;
  col: number;
  row: number;
  active: boolean;
  timer: number;
}

export interface FloatingScore {
  id: number;
  text: string;
  x: number;
  y: number;
  color: string;
  opacity: number;
  vy: number;
  life: number;
}

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  crtFilter: boolean;
  gameSpeed: number; // 1.0 = normal, 1.25 = fast, 1.5 = turbo
  skin: ProfessorSkin;
}

export interface GameStats {
  score: number;
  highScore: number;
  level: number;
  lives: number;
  pelletsRemaining: number;
  totalPellets: number;
  ghostsEatenStreak: number;
  academicItemsCollected: number;
  studentsGraded: number;
}
