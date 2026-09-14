import {
  Direction,
  GhostState,
  ProfessorPacman,
  ProfessorSkin,
  StudentGhost,
  StudentType,
  FloatingScore,
  AcademicItem,
} from '../types';
import { GRID_COLS, GRID_ROWS, TILE_SIZE, MazeTheme } from './mapData';

export function renderMaze(
  ctx: CanvasRenderingContext2D,
  map: number[][],
  theme: MazeTheme,
  time: number
): void {
  // Background
  ctx.fillStyle = theme.floorColor;
  ctx.fillRect(0, 0, GRID_COLS * TILE_SIZE, GRID_ROWS * TILE_SIZE);

  // Draw grid paths & walls
  for (let r = 0; r < GRID_ROWS; r++) {
    for (let c = 0; c < GRID_COLS; c++) {
      const tile = map[r][c];
      const x = c * TILE_SIZE;
      const y = r * TILE_SIZE;

      if (tile === 1) {
        // Wall
        ctx.fillStyle = theme.wallFill;
        ctx.strokeStyle = theme.wallBorder;
        ctx.lineWidth = 2;
        ctx.shadowColor = theme.accentGlow;
        ctx.shadowBlur = 4;

        // Rounded brick tile style
        ctx.beginPath();
        ctx.roundRect(x + 1, y + 1, TILE_SIZE - 2, TILE_SIZE - 2, 3);
        ctx.fill();
        ctx.stroke();

        ctx.shadowBlur = 0;
      } else if (tile === 5) {
        // Dorm Door / Gate
        ctx.fillStyle = theme.gateColor;
        ctx.shadowColor = theme.gateColor;
        ctx.shadowBlur = 6;
        ctx.fillRect(x, y + TILE_SIZE / 2 - 2, TILE_SIZE, 4);
        ctx.shadowBlur = 0;
      } else if (tile === 2) {
        // Regular Pellet: Mini Homework Assignment Paper
        const pulse = Math.sin(time * 0.005 + (r + c)) * 0.5 + 1;
        const pw = 6 * pulse;
        const ph = 7 * pulse;
        const px = x + (TILE_SIZE - pw) / 2;
        const py = y + (TILE_SIZE - ph) / 2;

        ctx.fillStyle = theme.pelletColor;
        ctx.shadowColor = theme.pelletColor;
        ctx.shadowBlur = 3;

        // Small lined paper sheet
        ctx.beginPath();
        ctx.roundRect(px, py, pw, ph, 1);
        ctx.fill();

        // Tiny red pen checkmark on paper
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(px + 1, py + 2, pw - 2, 1);

        ctx.shadowBlur = 0;
      } else if (tile === 3) {
        // Power Pellet: Pop Quiz / Exam Paper (Pulsing Big Paper with A+)
        const pulse = Math.sin(time * 0.008) * 0.3 + 1.1;
        const pw = 12 * pulse;
        const ph = 14 * pulse;
        const px = x + (TILE_SIZE - pw) / 2;
        const py = y + (TILE_SIZE - ph) / 2;

        ctx.shadowColor = theme.powerColor;
        ctx.shadowBlur = 10;
        ctx.fillStyle = '#ffffff';

        ctx.beginPath();
        ctx.roundRect(px, py, pw, ph, 2);
        ctx.fill();

        ctx.strokeStyle = theme.powerColor;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Draw "A+" on exam paper
        ctx.fillStyle = '#dc2626';
        ctx.font = `bold ${Math.floor(7 * pulse)}px 'Press Start 2P', monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('A+', x + TILE_SIZE / 2, y + TILE_SIZE / 2);

        ctx.shadowBlur = 0;
      }
    }
  }
}

export function renderProfessor(
  ctx: CanvasRenderingContext2D,
  prof: ProfessorPacman,
  deathProgress: number = 0,
  time: number = 0
): void {
  ctx.save();
  ctx.translate(prof.x, prof.y);

  if (deathProgress > 0) {
    // Comical academic defeat: Professor spins, graduation cap pops off
    const spinAngle = deathProgress * Math.PI * 4;
    const scale = Math.max(0, 1 - deathProgress);
    ctx.rotate(spinAngle);
    ctx.scale(scale, scale);

    // Flying loose syllabus papers
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2 + deathProgress * 5;
      const dist = deathProgress * 30;
      ctx.fillRect(Math.cos(angle) * dist, Math.sin(angle) * dist, 6, 8);
    }
  }

  const radius = TILE_SIZE * 0.55;

  // Determine rotation based on direction
  let rotation = 0;
  switch (prof.dir) {
    case Direction.RIGHT: rotation = 0; break;
    case Direction.DOWN: rotation = Math.PI / 2; break;
    case Direction.LEFT: rotation = Math.PI; break;
    case Direction.UP: rotation = -Math.PI / 2; break;
  }

  // Draw Professor Pacman Body with Chomping Mouth
  ctx.save();
  ctx.rotate(rotation);

  const startAngle = prof.mouthAngle * Math.PI;
  const endAngle = (2 - prof.mouthAngle) * Math.PI;

  let bodyColor = '#facc15'; // Classic Golden Yellow
  let capColor = '#0f172a';  // Academic Black Cap
  let tasselColor = '#fbbf24';

  if (prof.skin === ProfessorSkin.LAB_SCIENTIST) {
    bodyColor = '#38bdf8';
    capColor = '#f8fafc';
    tasselColor = '#10b981';
  } else if (prof.skin === ProfessorSkin.MATH_WIZARD) {
    bodyColor = '#c084fc';
    capColor = '#4c1d95';
    tasselColor = '#fbbf24';
  } else if (prof.skin === ProfessorSkin.CS_HACKER) {
    bodyColor = '#4ade80';
    capColor = '#1e293b';
    tasselColor = '#22d3ee';
  }

  // Aura when empowered by Pop Quiz
  if (prof.isEmpowered) {
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 12;
  }

  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.arc(0, 0, radius, startAngle, endAngle);
  ctx.closePath();
  ctx.fill();

  ctx.restore(); // Restore orientation for scholarly accessories

  // 1. Draw Academic Spectacles / Glasses
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1.8;
  const eyeOffsetX = (prof.dir === Direction.LEFT ? -4 : prof.dir === Direction.RIGHT ? 4 : 0);
  const eyeOffsetY = (prof.dir === Direction.UP ? -4 : prof.dir === Direction.DOWN ? 4 : 0);

  // Left Lens
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.beginPath();
  ctx.arc(-3 + eyeOffsetX, -2 + eyeOffsetY, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Right Lens
  ctx.beginPath();
  ctx.arc(4 + eyeOffsetX, -2 + eyeOffsetY, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Bridge
  ctx.beginPath();
  ctx.moveTo(0 + eyeOffsetX, -2 + eyeOffsetY);
  ctx.lineTo(1 + eyeOffsetX, -2 + eyeOffsetY);
  ctx.stroke();

  // Eyes (Pupils)
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(-3 + eyeOffsetX + (prof.dir === Direction.LEFT ? -1 : 1), -2 + eyeOffsetY, 1.2, 0, Math.PI * 2);
  ctx.arc(4 + eyeOffsetX + (prof.dir === Direction.LEFT ? -1 : 1), -2 + eyeOffsetY, 1.2, 0, Math.PI * 2);
  ctx.fill();

  // 2. Distinguished Professor Gray Mustache / Bowtie
  ctx.fillStyle = '#64748b';
  ctx.beginPath();
  ctx.ellipse(eyeOffsetX, 4 + eyeOffsetY, 4.5, 2, 0, 0, Math.PI);
  ctx.fill();

  // 3. Academic Graduation Mortarboard Cap
  ctx.fillStyle = capColor;
  ctx.beginPath();
  // Diamond top
  ctx.moveTo(0, -radius - 4);
  ctx.lineTo(radius + 2, -radius - 1);
  ctx.lineTo(0, -radius + 2);
  ctx.lineTo(-radius - 2, -radius - 1);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Cap skullcap base
  ctx.fillRect(-4, -radius + 1, 8, 3);

  // Cap Tassel (Swings when moving)
  const tasselSway = Math.sin(time * 0.01) * 3;
  ctx.strokeStyle = tasselColor;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, -radius - 1);
  ctx.lineTo(radius * 0.8 + tasselSway, -radius + 6);
  ctx.stroke();

  // Little button at cap center
  ctx.fillStyle = tasselColor;
  ctx.beginPath();
  ctx.arc(0, -radius - 1, 1.5, 0, Math.PI * 2);
  ctx.fill();

  // 4. Red Grading Pen (when empowered)
  if (prof.isEmpowered) {
    ctx.save();
    ctx.translate(radius * 0.7, radius * 0.4);
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(-2, -8, 4, 12);
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.moveTo(-2, 4);
    ctx.lineTo(2, 4);
    ctx.lineTo(0, 8);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Dialogue bubble
  if (prof.dialogue) {
    renderDialogueBubble(ctx, prof.dialogue, 0, -radius - 12, '#3b82f6', '#ffffff');
  }

  ctx.restore();
}

export function renderStudentGhost(
  ctx: CanvasRenderingContext2D,
  ghost: StudentGhost,
  time: number
): void {
  ctx.save();
  ctx.translate(ghost.x, ghost.y);

  const radius = TILE_SIZE * 0.55;
  const isFrightened = ghost.state === GhostState.FRIGHTENED;
  const isEaten = ghost.state === GhostState.EATEN;

  if (isEaten) {
    // Eaten: Pair of floating student eyes + nerd glasses rushing back to dorm
    renderStudentEyes(ctx, ghost.dir, true);
  } else {
    // Ghost student body
    let bodyColor = ghost.color;

    if (isFrightened) {
      if (ghost.frightenedFlash) {
        bodyColor = Math.floor(time / 150) % 2 === 0 ? '#f8fafc' : '#2563eb';
      } else {
        bodyColor = '#1d4ed8'; // Deep panic blue
      }
    }

    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    // Head dome
    ctx.arc(0, -2, radius, Math.PI, 0, false);
    // Body sides
    ctx.lineTo(radius, radius * 0.8);

    // Animated wavy skirt feet (walking animation)
    const waveOffset = Math.sin(time * 0.015 + ghost.animationFrame) * 2;
    const feetCount = 3;
    const step = (radius * 2) / feetCount;
    for (let i = 0; i < feetCount; i++) {
      const startX = radius - i * step;
      const midX = startX - step / 2;
      const endX = startX - step;
      ctx.quadraticCurveTo(midX, radius * 0.8 + (i % 2 === 0 ? 3 + waveOffset : 1 - waveOffset), endX, radius * 0.8);
    }
    ctx.lineTo(-radius, -2);
    ctx.closePath();
    ctx.fill();

    // Student Clothing / Headwear Features
    if (!isFrightened) {
      renderStudentAccessories(ctx, ghost.id, radius);
    }

    if (isFrightened) {
      // Panicked mouth & sweat droplets
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      // Wavy zigzag panic mouth
      ctx.moveTo(-5, 4);
      ctx.lineTo(-3, 2);
      ctx.lineTo(-1, 5);
      ctx.lineTo(1, 2);
      ctx.lineTo(3, 5);
      ctx.lineTo(5, 3);
      ctx.stroke();

      // Panicked wide white dots eyes
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-5, -4, 3, 3);
      ctx.fillRect(2, -4, 3, 3);

      // Sweat drop
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(radius + 2, -6, 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Normal eyes looking in movement direction
      renderStudentEyes(ctx, ghost.dir, false);
    }
  }

  // Dialogue bubble
  if (ghost.dialogue) {
    renderDialogueBubble(
      ctx,
      ghost.dialogue,
      0,
      -radius - 12,
      isFrightened ? '#ef4444' : '#1e293b',
      '#ffffff'
    );
  }

  ctx.restore();
}

function renderStudentAccessories(ctx: CanvasRenderingContext2D, studentId: StudentType, radius: number) {
  switch (studentId) {
    case StudentType.SAM: {
      // Slacker Sam: Messy bedhead hair + over-ear DJ headphones
      ctx.fillStyle = '#1e1b4b'; // Messy black hair tufts
      ctx.beginPath();
      ctx.moveTo(-radius * 0.8, -radius);
      ctx.lineTo(-radius * 0.4, -radius - 4);
      ctx.lineTo(0, -radius - 1);
      ctx.lineTo(radius * 0.5, -radius - 5);
      ctx.lineTo(radius * 0.8, -radius);
      ctx.fill();

      // Headphones band & cups
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, -4, radius + 1, Math.PI * 0.9, Math.PI * 0.1, true);
      ctx.stroke();

      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(-radius - 3, -4, 3, 6);
      ctx.fillRect(radius, -4, 3, 6);
      break;
    }
    case StudentType.PETE: {
      // Procrastinator Pete: Slouchy Knit Beanie
      ctx.fillStyle = '#db2777';
      ctx.beginPath();
      ctx.arc(0, -radius * 0.6, radius * 0.85, Math.PI, 0);
      ctx.fill();
      // Beanie pom-pom
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, -radius * 1.3, 3, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case StudentType.OLIVIA: {
      // Overachiever Olivia: Big round studious glasses + pencil behind ear
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(-4, -2, 3.5, 0, Math.PI * 2);
      ctx.arc(4, -2, 3.5, 0, Math.PI * 2);
      ctx.stroke();

      // Yellow pencil
      ctx.fillStyle = '#facc15';
      ctx.fillRect(radius - 2, -radius * 0.8, 2, 7);
      break;
    }
    case StudentType.CARL: {
      // Confused Carl: Backwards Baseball Cap with question mark
      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.arc(0, -radius * 0.5, radius * 0.9, Math.PI, 0);
      ctx.fill();
      ctx.fillRect(-radius * 0.8, -radius * 0.5, radius * 1.6, 2);

      // Question mark floating above
      ctx.fillStyle = '#ffffff';
      ctx.font = "bold 9px 'Press Start 2P', monospace";
      ctx.textAlign = 'center';
      ctx.fillText('?', 0, -radius - 3);
      break;
    }
  }
}

function renderStudentEyes(ctx: CanvasRenderingContext2D, dir: Direction, isEaten: boolean) {
  let lookX = 0;
  let lookY = 0;
  switch (dir) {
    case Direction.LEFT: lookX = -2; break;
    case Direction.RIGHT: lookX = 2; break;
    case Direction.UP: lookY = -2; break;
    case Direction.DOWN: lookY = 2; break;
  }

  // White Eye Sclera
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(-4 + lookX * 0.5, -2 + lookY * 0.5, 3.5, 4.5, 0, 0, Math.PI * 2);
  ctx.ellipse(4 + lookX * 0.5, -2 + lookY * 0.5, 3.5, 4.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Pupil
  ctx.fillStyle = isEaten ? '#ef4444' : '#1e3a8a';
  ctx.beginPath();
  ctx.arc(-4 + lookX * 1.5, -2 + lookY * 1.5, 2, 0, Math.PI * 2);
  ctx.arc(4 + lookX * 1.5, -2 + lookY * 1.5, 2, 0, Math.PI * 2);
  ctx.fill();
}

export function renderAcademicBonus(
  ctx: CanvasRenderingContext2D,
  bonus: AcademicItem,
  time: number
): void {
  if (!bonus.active) return;
  const x = bonus.col * TILE_SIZE + TILE_SIZE / 2;
  const y = bonus.row * TILE_SIZE + TILE_SIZE / 2;

  const floatY = Math.sin(time * 0.008) * 3;

  ctx.save();
  ctx.translate(x, y + floatY);

  // Glowing background halo
  ctx.shadowColor = '#fbbf24';
  ctx.shadowBlur = 10;
  ctx.fillStyle = 'rgba(251, 191, 36, 0.2)';
  ctx.beginPath();
  ctx.arc(0, 0, TILE_SIZE * 0.8, 0, Math.PI * 2);
  ctx.fill();

  // Render emoji/icon
  ctx.font = `${TILE_SIZE * 0.9}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(bonus.icon, 0, 1);

  ctx.restore();
}

export function renderFloatingScores(
  ctx: CanvasRenderingContext2D,
  scores: FloatingScore[]
): void {
  scores.forEach((s) => {
    ctx.save();
    ctx.globalAlpha = Math.max(0, s.opacity);
    ctx.fillStyle = s.color;
    ctx.shadowColor = s.color;
    ctx.shadowBlur = 6;
    ctx.font = "bold 10px 'Press Start 2P', monospace";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(s.text, s.x, s.y);
    ctx.restore();
  });
}

function renderDialogueBubble(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  bgColor: string,
  textColor: string
) {
  ctx.save();
  ctx.font = "bold 8px 'Press Start 2P', monospace";
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const metrics = ctx.measureText(text);
  const paddingX = 6;
  const paddingY = 4;
  const bw = metrics.width + paddingX * 2;
  const bh = 14;

  const bx = x - bw / 2;
  const by = y - bh;

  // Bubble Box
  ctx.fillStyle = bgColor;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(bx, by, bw, bh, 4);
  ctx.fill();
  ctx.stroke();

  // Little arrow pointing down
  ctx.beginPath();
  ctx.moveTo(x - 3, y);
  ctx.lineTo(x + 3, y);
  ctx.lineTo(x, y + 4);
  ctx.closePath();
  ctx.fill();

  // Text
  ctx.fillStyle = textColor;
  ctx.fillText(text, x, by + bh / 2 + 1);

  ctx.restore();
}
