import { TileType } from '../types';

export const GRID_COLS = 28;
export const GRID_ROWS = 31;
export const TILE_SIZE = 18; // base tile size for canvas calculation

// 28 cols x 31 rows standard arcade maze
// 1 = Wall, 2 = Pellet (Homework), 3 = Power Pellet (Pop Exam), 4 = Ghost House, 5 = Ghost Gate, 0 = Empty/Path
export const DEFAULT_MAZE: number[][] = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
  [1,3,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,3,1],
  [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,2,1],
  [1,2,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,2,1],
  [1,2,2,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,2,2,1],
  [1,1,1,1,1,1,2,1,1,1,1,1,0,1,1,0,1,1,1,1,1,2,1,1,1,1,1,1],
  [0,0,0,0,0,1,2,1,1,1,1,1,0,1,1,0,1,1,1,1,1,2,1,0,0,0,0,0],
  [0,0,0,0,0,1,2,1,1,0,0,0,0,0,0,0,0,0,0,1,1,2,1,0,0,0,0,0],
  [0,0,0,0,0,1,2,1,1,0,1,1,1,5,5,1,1,1,0,1,1,2,1,0,0,0,0,0],
  [1,1,1,1,1,1,2,1,1,0,1,4,4,4,4,4,4,1,0,1,1,2,1,1,1,1,1,1],
  [0,0,0,0,0,0,2,0,0,0,1,4,4,4,4,4,4,1,0,0,0,2,0,0,0,0,0,0], // Tunnel row at y=14
  [1,1,1,1,1,1,2,1,1,0,1,4,4,4,4,4,4,1,0,1,1,2,1,1,1,1,1,1],
  [0,0,0,0,0,1,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,2,1,0,0,0,0,0],
  [0,0,0,0,0,1,2,1,1,0,0,0,0,0,0,0,0,0,0,1,1,2,1,0,0,0,0,0],
  [0,0,0,0,0,1,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,2,1,0,0,0,0,0],
  [1,1,1,1,1,1,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,2,1,1,1,1,1,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
  [1,3,2,2,1,1,2,2,2,2,2,2,2,0,0,2,2,2,2,2,2,2,1,1,2,2,3,1],
  [1,1,1,2,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,2,1,1,1],
  [1,1,1,2,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,2,1,1,1],
  [1,2,2,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,2,2,1],
  [1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1],
  [1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

export interface MazeTheme {
  name: string;
  wallColor: string;
  wallBorder: string;
  wallFill: string;
  floorColor: string;
  gateColor: string;
  pelletColor: string;
  powerColor: string;
  accentGlow: string;
}

export const MAZE_THEMES: Record<string, MazeTheme> = {
  blackboard: {
    name: 'Lecture Chalkboard',
    wallColor: '#10b981', // vibrant emerald chalk
    wallBorder: '#34d399',
    wallFill: '#064e3b',
    floorColor: '#07271e',
    gateColor: '#fbbf24',
    pelletColor: '#fef08a',
    powerColor: '#38bdf8',
    accentGlow: 'rgba(52, 211, 153, 0.45)',
  },
  vibrant: {
    name: 'Vibrant Neon Quad',
    wallColor: '#6366f1', // electric indigo
    wallBorder: '#a5b4fc',
    wallFill: '#1e1b4b',
    floorColor: '#0b0f28',
    gateColor: '#fbbf24',
    pelletColor: '#fef08a',
    powerColor: '#f43f5e',
    accentGlow: 'rgba(99, 102, 241, 0.5)',
  },
  midnight: {
    name: 'Midnight Campus',
    wallColor: '#3b82f6', // electric cobalt blue
    wallBorder: '#93c5fd',
    wallFill: '#1e293b',
    floorColor: '#0a1020',
    gateColor: '#f43f5e',
    pelletColor: '#fed7aa',
    powerColor: '#fbbf24',
    accentGlow: 'rgba(59, 130, 246, 0.5)',
  },
  cyberLab: {
    name: 'Cybernetics Lab',
    wallColor: '#a855f7', // vivid neon purple
    wallBorder: '#e9d5ff',
    wallFill: '#3b0764',
    floorColor: '#140b2e',
    gateColor: '#22d3ee',
    pelletColor: '#67e8f9',
    powerColor: '#f43f5e',
    accentGlow: 'rgba(168, 85, 247, 0.5)',
  },
  library: {
    name: 'Old Faculty Library',
    wallColor: '#d97706', // rich amber gold
    wallBorder: '#fde68a',
    wallFill: '#451a03',
    floorColor: '#1a0f05',
    gateColor: '#10b981',
    pelletColor: '#fef3c7',
    powerColor: '#ec4899',
    accentGlow: 'rgba(217, 119, 6, 0.5)',
  },
};

export const ACADEMIC_BONUSES = [
  { name: 'Espresso Shot', points: 100, icon: '☕', levelRequired: 1 },
  { name: 'Red Grading Pen', points: 300, icon: '🖋️', levelRequired: 1 },
  { name: 'Heavy Textbook', points: 500, icon: '📚', levelRequired: 2 },
  { name: 'Apple for Teacher', points: 700, icon: '🍎', levelRequired: 3 },
  { name: 'Research Grant', points: 1000, icon: '📜', levelRequired: 4 },
  { name: 'Master Diploma', points: 2000, icon: '🎓', levelRequired: 5 },
  { name: 'Tenured Trophy', points: 5000, icon: '🏆', levelRequired: 6 },
];

export const STUDENT_QUOTES = {
  normal: [
    "Professor, will this be on the final?!",
    "Can I get a 24-hour extension?",
    "Is attendance mandatory today?",
    "Did you post the lecture slides yet?",
    "I was sick, can you re-explain the whole semester?",
    "Can you round my 54% to an A?",
    "Is the textbook required?",
  ],
  frightened: [
    "DROP THE CLASS!",
    "I DIDN'T STUDY!",
    "POP QUIZ PANIC!",
    "THE EXAM IS TODAY?!",
    "PRAYING FOR A CURVE!",
    "UNPREPARED!",
  ],
  graded: [
    "F on the Midterm!",
    "Academic Probation!",
    "Needs more citations!",
    "Syllabus violation!",
    "Office hours ended!",
  ],
};

export const PROFESSOR_QUOTES = [
  "It's on page 42 of the syllabus!",
  "Grading papers with no mercy!",
  "Pop quiz time!",
  "Office hours are officially over!",
  "Zero partial credit!",
  "Peer review approved!",
  "Published in Nature!",
];
