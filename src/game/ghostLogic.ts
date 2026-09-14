import { Direction, GhostState, GridCoord, Position, StudentGhost, StudentType } from '../types';
import { GRID_COLS, GRID_ROWS, TILE_SIZE } from './mapData';

// Helper to check if tile is passable for ghosts
export function isGhostPassable(
  col: number,
  row: number,
  map: number[][],
  state: GhostState,
  isGatePassable: boolean = false
): boolean {
  // Wrap-around tunnel
  if (row === 14 && (col < 0 || col >= GRID_COLS)) {
    return true;
  }
  if (row < 0 || row >= GRID_ROWS || col < 0 || col >= GRID_COLS) {
    return false;
  }
  const tile = map[row][col];
  if (tile === 1) return false; // Wall
  if (tile === 5) {
    // Gate
    return isGatePassable || state === GhostState.EATEN || state === GhostState.IN_HOUSE;
  }
  return true;
}

export function getOppositeDirection(dir: Direction): Direction {
  switch (dir) {
    case Direction.UP: return Direction.DOWN;
    case Direction.DOWN: return Direction.UP;
    case Direction.LEFT: return Direction.RIGHT;
    case Direction.RIGHT: return Direction.LEFT;
    default: return Direction.NONE;
  }
}

export function getDirectionVector(dir: Direction): { dx: number; dy: number } {
  switch (dir) {
    case Direction.UP: return { dx: 0, dy: -1 };
    case Direction.DOWN: return { dx: 0, dy: 1 };
    case Direction.LEFT: return { dx: -1, dy: 0 };
    case Direction.RIGHT: return { dx: 1, dy: 0 };
    default: return { dx: 0, dy: 0 };
  }
}

export function createInitialGhosts(): StudentGhost[] {
  return [
    {
      id: StudentType.SAM,
      name: 'Slacker Sam',
      major: 'Undeclared Freshman',
      color: '#ef4444', // Red (Blinky)
      frightenedColor: '#38bdf8',
      x: 13.5 * TILE_SIZE,
      y: 11 * TILE_SIZE, // Starts outside house ready to hunt
      dir: Direction.LEFT,
      nextDir: Direction.LEFT,
      state: GhostState.SCATTER,
      speed: 1.8,
      scatterTarget: { col: 25, row: 0 }, // Top Right corner
      homeHousePos: { x: 13.5 * TILE_SIZE, y: 14 * TILE_SIZE },
      frightenedTimer: 0,
      frightenedFlash: false,
      eatenScore: 200,
      animationFrame: 0,
    },
    {
      id: StudentType.PETE,
      name: 'Procrastinator Pete',
      major: 'Philosophy & Memes',
      color: '#f472b6', // Pink (Pinky)
      frightenedColor: '#38bdf8',
      x: 13.5 * TILE_SIZE,
      y: 14 * TILE_SIZE, // Inside house center
      dir: Direction.UP,
      nextDir: Direction.UP,
      state: GhostState.IN_HOUSE,
      speed: 1.75,
      scatterTarget: { col: 2, row: 0 }, // Top Left corner
      homeHousePos: { x: 13.5 * TILE_SIZE, y: 14 * TILE_SIZE },
      frightenedTimer: 0,
      frightenedFlash: false,
      eatenScore: 200,
      animationFrame: 0,
    },
    {
      id: StudentType.OLIVIA,
      name: 'Overachiever Olivia',
      major: 'Double Honors Bio/CS',
      color: '#22d3ee', // Cyan (Inky)
      frightenedColor: '#38bdf8',
      x: 11.5 * TILE_SIZE,
      y: 14 * TILE_SIZE, // Inside house left
      dir: Direction.UP,
      nextDir: Direction.UP,
      state: GhostState.IN_HOUSE,
      speed: 1.75,
      scatterTarget: { col: 27, row: 30 }, // Bottom Right corner
      homeHousePos: { x: 11.5 * TILE_SIZE, y: 14 * TILE_SIZE },
      frightenedTimer: 0,
      frightenedFlash: false,
      eatenScore: 200,
      animationFrame: 0,
    },
    {
      id: StudentType.CARL,
      name: 'Confused Carl',
      major: 'Lost in the Hallway',
      color: '#fb923c', // Orange (Clyde)
      frightenedColor: '#38bdf8',
      x: 15.5 * TILE_SIZE,
      y: 14 * TILE_SIZE, // Inside house right
      dir: Direction.UP,
      nextDir: Direction.UP,
      state: GhostState.IN_HOUSE,
      speed: 1.7,
      scatterTarget: { col: 0, row: 30 }, // Bottom Left corner
      homeHousePos: { x: 15.5 * TILE_SIZE, y: 14 * TILE_SIZE },
      frightenedTimer: 0,
      frightenedFlash: false,
      eatenScore: 200,
      animationFrame: 0,
    },
  ];
}

// Compute ghost target tile based on individual student personality AI
export function getGhostTarget(
  ghost: StudentGhost,
  pacmanPos: Position,
  pacmanDir: Direction,
  samGhost: StudentGhost,
  globalMode: GhostState
): GridCoord {
  // If Frightened, target is arbitrary (handled by random selection)
  if (ghost.state === GhostState.FRIGHTENED) {
    return { col: Math.floor(Math.random() * GRID_COLS), row: Math.floor(Math.random() * GRID_ROWS) };
  }

  // If Eaten, target is the Dorm Room door / inside
  if (ghost.state === GhostState.EATEN) {
    return { col: 13, row: 11 };
  }

  // If in Scatter mode, return individual corner
  if (ghost.state === GhostState.SCATTER || globalMode === GhostState.SCATTER) {
    return ghost.scatterTarget;
  }

  const pacCol = Math.floor(pacmanPos.x / TILE_SIZE);
  const pacRow = Math.floor(pacmanPos.y / TILE_SIZE);

  switch (ghost.id) {
    case StudentType.SAM:
      // Slacker Sam (Blinky): Direct Chase
      return { col: pacCol, row: pacRow };

    case StudentType.PETE: {
      // Procrastinator Pete (Pinky): 4 tiles ahead of Professor
      const v = getDirectionVector(pacmanDir);
      return { col: pacCol + v.dx * 4, row: pacRow + v.dy * 4 };
    }

    case StudentType.OLIVIA: {
      // Overachiever Olivia (Inky): Vector flanking
      const v = getDirectionVector(pacmanDir);
      const intermediateCol = pacCol + v.dx * 2;
      const intermediateRow = pacRow + v.dy * 2;
      const samCol = Math.floor(samGhost.x / TILE_SIZE);
      const samRow = Math.floor(samGhost.y / TILE_SIZE);
      const vectorX = intermediateCol - samCol;
      const vectorY = intermediateRow - samRow;
      return { col: samCol + vectorX * 2, row: samRow + vectorY * 2 };
    }

    case StudentType.CARL: {
      // Confused Carl (Clyde): Distance check (>8 tiles = chase, <=8 = retreat)
      const carlCol = Math.floor(ghost.x / TILE_SIZE);
      const carlRow = Math.floor(ghost.y / TILE_SIZE);
      const distSq = (carlCol - pacCol) ** 2 + (carlRow - pacRow) ** 2;
      if (distSq > 64) {
        return { col: pacCol, row: pacRow };
      }
      return ghost.scatterTarget;
    }
  }
}

// Update ghost movement and state for single frame
export function updateGhost(
  ghost: StudentGhost,
  map: number[][],
  pacmanPos: Position,
  pacmanDir: Direction,
  samGhost: StudentGhost,
  globalMode: GhostState,
  speedMultiplier: number
): void {
  ghost.animationFrame = (ghost.animationFrame + 0.1) % 100;

  // Decrease dialogue timer if present
  if (ghost.dialogueTimer && ghost.dialogueTimer > 0) {
    ghost.dialogueTimer -= 1;
    if (ghost.dialogueTimer <= 0) {
      ghost.dialogue = undefined;
    }
  }

  // Handle In-House behavior and release
  if (ghost.state === GhostState.IN_HOUSE) {
    // Bob up and down inside dorm
    ghost.y += Math.sin(ghost.animationFrame * 0.5) * 0.5;
    return;
  }

  // Determine current effective speed
  let currentSpeed = ghost.speed * speedMultiplier;
  if (ghost.state === GhostState.FRIGHTENED) {
    currentSpeed *= 0.6; // Students slow down when panicking about exam
  } else if (ghost.state === GhostState.EATEN) {
    currentSpeed *= 2.2; // Speedy eyes rush back to dorm
  }

  // Tunnel speed reduction
  const curRow = Math.floor(ghost.y / TILE_SIZE);
  const curCol = Math.floor(ghost.x / TILE_SIZE);
  if (curRow === 14 && (curCol <= 5 || curCol >= 22)) {
    currentSpeed *= 0.65;
  }

  // Check if Eaten ghost reached dorm
  if (ghost.state === GhostState.EATEN) {
    const doorX = 13.5 * TILE_SIZE;
    const doorY = 11 * TILE_SIZE;
    const houseY = 14 * TILE_SIZE;
    if (Math.hypot(ghost.x - doorX, ghost.y - doorY) < currentSpeed * 2) {
      ghost.x = doorX;
      ghost.y = houseY;
      ghost.state = GhostState.CHASE;
      ghost.dir = Direction.UP;
      return;
    }
  }

  // Check if ghost is near the center of a tile
  const tileCenterX = (curCol + 0.5) * TILE_SIZE;
  const tileCenterY = (curRow + 0.5) * TILE_SIZE;
  const distToCenter = Math.hypot(ghost.x - tileCenterX, ghost.y - tileCenterY);

  // When near center of tile, choose next direction
  if (distToCenter <= currentSpeed * 1.2) {
    // Snap to center to avoid drifting
    ghost.x = tileCenterX;
    ghost.y = tileCenterY;

    // Evaluate valid directions (Ghost cannot do an immediate 180 reverse)
    const opposite = getOppositeDirection(ghost.dir);
    const candidateDirs = [Direction.UP, Direction.LEFT, Direction.DOWN, Direction.RIGHT].filter(
      (d) => d !== opposite
    );

    const target = getGhostTarget(ghost, pacmanPos, pacmanDir, samGhost, globalMode);

    let bestDir = ghost.dir;
    let minDistance = Infinity;

    // If frightened, choose random valid direction
    if (ghost.state === GhostState.FRIGHTENED) {
      const validFrightenedDirs = candidateDirs.filter((d) => {
        const v = getDirectionVector(d);
        return isGhostPassable(curCol + v.dx, curRow + v.dy, map, ghost.state);
      });
      if (validFrightenedDirs.length > 0) {
        bestDir = validFrightenedDirs[Math.floor(Math.random() * validFrightenedDirs.length)];
      }
    } else {
      // Find candidate tile with minimum distance to target
      for (const candDir of candidateDirs) {
        const v = getDirectionVector(candDir);
        const nextCol = curCol + v.dx;
        const nextRow = curRow + v.dy;

        const isPassable = isGhostPassable(
          nextCol,
          nextRow,
          map,
          ghost.state,
          ghost.state === GhostState.EATEN
        );

        if (isPassable) {
          const dx = nextCol - target.col;
          const dy = nextRow - target.row;
          const dist = dx * dx + dy * dy;

          if (dist < minDistance) {
            minDistance = dist;
            bestDir = candDir;
          }
        }
      }
    }

    ghost.dir = bestDir;
  }

  // Move in current direction
  const moveVec = getDirectionVector(ghost.dir);
  ghost.x += moveVec.dx * currentSpeed;
  ghost.y += moveVec.dy * currentSpeed;

  // Wrap around side tunnels at row 14
  if (curRow === 14) {
    if (ghost.x < -TILE_SIZE / 2) {
      ghost.x = (GRID_COLS - 0.5) * TILE_SIZE;
    } else if (ghost.x > (GRID_COLS - 0.5) * TILE_SIZE) {
      ghost.x = -TILE_SIZE / 2;
    }
  }
}
