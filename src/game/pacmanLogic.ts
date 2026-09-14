import { Direction, Position, ProfessorPacman, ProfessorSkin, StudentGhost, GhostState } from '../types';
import { GRID_COLS, GRID_ROWS, TILE_SIZE } from './mapData';
import { getDirectionVector, getOppositeDirection } from './ghostLogic';

export function isPacmanPassable(col: number, row: number, map: number[][]): boolean {
  // Wrap-around tunnel
  if (row === 14 && (col < 0 || col >= GRID_COLS)) {
    return true;
  }
  if (row < 0 || row >= GRID_ROWS || col < 0 || col >= GRID_COLS) {
    return false;
  }
  const tile = map[row][col];
  // 1 = Wall, 4 = Ghost House, 5 = Ghost Gate -> Professor cannot enter dorm or walls!
  if (tile === 1 || tile === 4 || tile === 5) {
    return false;
  }
  return true;
}

export function createInitialProfessor(skin: ProfessorSkin = ProfessorSkin.CLASSIC_TWEED): ProfessorPacman {
  return {
    x: 13.5 * TILE_SIZE,
    y: 23 * TILE_SIZE, // Standard starting position below the ghost house
    dir: Direction.LEFT,
    nextDir: Direction.LEFT,
    speed: 2.0,
    mouthAngle: 0.25,
    mouthClosing: true,
    skin,
    isEmpowered: false,
    empoweredTimer: 0,
  };
}

export function updateProfessor(
  prof: ProfessorPacman,
  map: number[][],
  speedMultiplier: number
): { atePellet: boolean; atePowerPellet: boolean; pelletPos?: { col: number; row: number } } {
  let atePellet = false;
  let atePowerPellet = false;
  let pelletPos: { col: number; row: number } | undefined;

  const currentSpeed = prof.speed * speedMultiplier;

  // Decrease dialogue timer if active
  if (prof.dialogueTimer && prof.dialogueTimer > 0) {
    prof.dialogueTimer -= 1;
    if (prof.dialogueTimer <= 0) {
      prof.dialogue = undefined;
    }
  }

  const curRow = Math.floor(prof.y / TILE_SIZE);
  const curCol = Math.floor(prof.x / TILE_SIZE);

  // Check if player wants to reverse direction immediately
  if (prof.nextDir !== prof.dir && prof.nextDir === getOppositeDirection(prof.dir)) {
    prof.dir = prof.nextDir;
  }

  // Calculate alignment to tile center
  const tileCenterX = (curCol + 0.5) * TILE_SIZE;
  const tileCenterY = (curRow + 0.5) * TILE_SIZE;
  const distToCenterX = Math.abs(prof.x - tileCenterX);
  const distToCenterY = Math.abs(prof.y - tileCenterY);

  // Try turning into queued nextDir when near intersection
  if (prof.nextDir !== prof.dir && prof.nextDir !== Direction.NONE) {
    const nextVec = getDirectionVector(prof.nextDir);
    const targetCol = curCol + nextVec.dx;
    const targetRow = curRow + nextVec.dy;

    // For perpendicular turns, ensure we are aligned with tile center
    const isPerpendicular = (
      (prof.dir === Direction.LEFT || prof.dir === Direction.RIGHT) &&
      (prof.nextDir === Direction.UP || prof.nextDir === Direction.DOWN)
    ) || (
      (prof.dir === Direction.UP || prof.dir === Direction.DOWN) &&
      (prof.nextDir === Direction.LEFT || prof.nextDir === Direction.RIGHT)
    );

    if (isPerpendicular) {
      if (distToCenterX <= currentSpeed * 1.5 && distToCenterY <= currentSpeed * 1.5) {
        if (isPacmanPassable(targetCol, targetRow, map)) {
          prof.x = tileCenterX;
          prof.y = tileCenterY;
          prof.dir = prof.nextDir;
        }
      }
    } else {
      if (isPacmanPassable(targetCol, targetRow, map)) {
        prof.dir = prof.nextDir;
      }
    }
  }

  // Check if moving forward is blocked by a wall
  const curVec = getDirectionVector(prof.dir);
  const nextForwardCol = curCol + curVec.dx;
  const nextForwardRow = curRow + curVec.dy;

  let canMoveForward = true;
  if (!isPacmanPassable(nextForwardCol, nextForwardRow, map)) {
    // If moving into a wall, stop at tile center
    if (prof.dir === Direction.RIGHT && prof.x >= tileCenterX) {
      prof.x = tileCenterX;
      canMoveForward = false;
    } else if (prof.dir === Direction.LEFT && prof.x <= tileCenterX) {
      prof.x = tileCenterX;
      canMoveForward = false;
    } else if (prof.dir === Direction.DOWN && prof.y >= tileCenterY) {
      prof.y = tileCenterY;
      canMoveForward = false;
    } else if (prof.dir === Direction.UP && prof.y <= tileCenterY) {
      prof.y = tileCenterY;
      canMoveForward = false;
    }
  }

  if (canMoveForward && prof.dir !== Direction.NONE) {
    prof.x += curVec.dx * currentSpeed;
    prof.y += curVec.dy * currentSpeed;

    // Animate mouth chomping
    if (prof.mouthClosing) {
      prof.mouthAngle -= 0.04 * speedMultiplier;
      if (prof.mouthAngle <= 0.03) {
        prof.mouthClosing = false;
      }
    } else {
      prof.mouthAngle += 0.04 * speedMultiplier;
      if (prof.mouthAngle >= 0.28) {
        prof.mouthClosing = true;
      }
    }
  }

  // Tunnel wrapping at row 14
  if (curRow === 14) {
    if (prof.x < -TILE_SIZE / 2) {
      prof.x = (GRID_COLS - 0.5) * TILE_SIZE;
    } else if (prof.x > (GRID_COLS - 0.5) * TILE_SIZE) {
      prof.x = -TILE_SIZE / 2;
    }
  }

  // Check pellet eating when close to tile center
  if (
    curRow >= 0 &&
    curRow < GRID_ROWS &&
    curCol >= 0 &&
    curCol < GRID_COLS &&
    Math.hypot(prof.x - tileCenterX, prof.y - tileCenterY) < TILE_SIZE * 0.45
  ) {
    const tile = map[curRow][curCol];
    if (tile === 2) {
      // Regular pellet (Homework paper)
      map[curRow][curCol] = 0;
      atePellet = true;
      pelletPos = { col: curCol, row: curRow };
    } else if (tile === 3) {
      // Power pellet (Pop Exam)
      map[curRow][curCol] = 0;
      atePowerPellet = true;
      atePellet = true;
      pelletPos = { col: curCol, row: curRow };
    }
  }

  return { atePellet, atePowerPellet, pelletPos };
}

// Check collision between Professor and a student ghost
export function checkGhostCollision(prof: ProfessorPacman, ghost: StudentGhost): 'none' | 'eat_ghost' | 'kill_prof' {
  if (ghost.state === GhostState.EATEN || ghost.state === GhostState.IN_HOUSE) {
    return 'none';
  }

  const dist = Math.hypot(prof.x - ghost.x, prof.y - ghost.y);
  if (dist < TILE_SIZE * 0.8) {
    if (ghost.state === GhostState.FRIGHTENED) {
      return 'eat_ghost';
    } else {
      return 'kill_prof';
    }
  }
  return 'none';
}
