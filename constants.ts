export const BALL_RADIUS = 15;
export const PREDICTION_MARKER_RADIUS = 25; // Raio do círculo de previsão
export const PREDICTION_TIME_MS = 1000;
export const WIN_THRESHOLD = BALL_RADIUS + PREDICTION_MARKER_RADIUS; // Bola deve tocar o círculo
export const BALL_TRAIL_LENGTH = 15;

export const MAX_LIVES = 5;
export const LIFE_REGEN_MINUTES = 10;

export const STORAGE_KEYS = {
  LOCALE: 'locale',
  LIVES: 'lives',
  LAST_USED_TIMESTAMP: 'lastUsedTimestamp',
  STORY_LEVEL: 'classicLevel', // Keep old name for backward compatibility
};

// All obstacle coordinates are relative (0 to 1) and centered.
// The App will convert them to absolute pixel values.
export const OBSTACLES_BY_LEVEL: { [key: number]: any[] } = {
  // --- Block 1: The Basics (Levels 1-5) ---
  1: [], // Level 1: Vertical movement only, no obstacles
  2: [], // Level 2: Horizontal movement only, no obstacles
  3: [], // Level 3: Free movement, no obstacles
  4: [{ x: 0.5, y: 0.5, width: 150, height: 20 }], // Level 4: First single horizontal obstacle
  5: [{ x: 0.5, y: 0.5, width: 20, height: 150 }], // Level 5: First single vertical obstacle

  // --- Block 2: First Combinations (Levels 6-10) ---
  6: [{ x: 0.5, y: 0.3, width: 120, height: 20 }, { x: 0.5, y: 0.7, width: 120, height: 20 }], // Two horizontal bars
  7: [{ x: 0.3, y: 0.5, width: 20, height: 120 }, { x: 0.7, y: 0.5, width: 20, height: 120 }], // Two vertical bars
  8: [{ x: 0.35, y: 0.65, width: 100, height: 20 }, { x: 0.65, y: 0.35, width: 100, height: 20 }], // Offset steps
  9: [{ x: 0.25, y: 0.25, width: 20, height: 100 }, { x: 0.75, y: 0.75, width: 20, height: 100 }], // Diagonal pair
  10: [{ x: 0.5, y: 0.5, width: 80, height: 80 }], // Central box

  // --- Block 3: Corridors & Funnels (Levels 11-15) ---
  11: [{ x: 0.5, y: 0.2, width: 250, height: 20 }, { x: 0.5, y: 0.8, width: 250, height: 20 }], // Wide horizontal corridor
  12: [{ x: 0.2, y: 0.5, width: 20, height: 250 }, { x: 0.8, y: 0.5, width: 20, height: 250 }], // Wide vertical corridor
  13: [{ x: 0.3, y: 0.3, width: 150, height: 20 }, { x: 0.7, y: 0.7, width: 150, height: 20 }], // Slanted corridor
  14: [{ x: 0.5, y: 0.5, width: 200, height: 20 }, { x: 0.5, y: 0.5, width: 20, height: 200 }], // Central cross
  15: [{ x: 0.25, y: 0.5, width: 20, height: 200 }, { x: 0.75, y: 0.5, width: 20, height: 200 }], // Pillar corridor

  // --- Block 4: Asymmetry & Patterns (Levels 16-20) ---
  16: [{ x: 0.25, y: 0.4, width: 100, height: 20 }, { x: 0.75, y: 0.6, width: 100, height: 20 }], // Offset horizontal
  17: [{ x: 0.3, y: 0.5, width: 20, height: 120 }, { x: 0.7, y: 0.3, width: 20, height: 80 }], // Asymmetric vertical
  18: [{ x: 0.7, y: 0.5, width: 200, height: 200 }], // Large corner block
  19: [{ x: 0.5, y: 0.25, width: 20, height: 100 }, { x: 0.5, y: 0.75, width: 20, height: 100 }], // Vertical divider with gap
  20: [
    { x: 0.25, y: 0.25, width: 20, height: 20 }, { x: 0.75, y: 0.25, width: 20, height: 20 },
    { x: 0.25, y: 0.75, width: 20, height: 20 }, { x: 0.75, y: 0.75, width: 20, height: 20 },
  ], // Four corners

  // --- Block 5: Precision & Mazes (Levels 21-25) ---
  21: [
    { x: 0.5, y: 0.2, width: 20, height: 80 }, { x: 0.2, y: 0.5, width: 80, height: 20 },
    { x: 0.8, y: 0.5, width: 80, height: 20 }, { x: 0.5, y: 0.8, width: 20, height: 80 }
  ], // Plus sign maze
  22: [{ x: 0.15, y: 0.5, width: 20, height: 250 }, { x: 0.85, y: 0.5, width: 20, height: 250 }], // The Needle
  23: [
    { x: 0.3, y: 0.5, width: 20, height: 180 }, { x: 0.7, y: 0.5, width: 20, height: 180 },
    { x: 0.5, y: 0.2, width: 180, height: 20 }
  ], // The "U" shape
  24: [
    { x: 0.2, y: 0.3, width: 20, height: 150 }, { x: 0.5, y: 0.6, width: 20, height: 150 },
    { x: 0.8, y: 0.3, width: 20, height: 150 }
  ], // Forest of pillars
  25: [
    { x: 0.2, y: 0.2, width: 100, height: 20 }, { x: 0.8, y: 0.2, width: 100, height: 20 },
    { x: 0.2, y: 0.8, width: 100, height: 20 }, { x: 0.8, y: 0.8, width: 100, height: 20 }
  ], // Bouncy box

  // --- Block 6: The Gauntlet (Levels 26-30) ---
  26: [
    { x: 0.5, y: 0.5, width: 20, height: 20 }, { x: 0.2, y: 0.2, width: 20, height: 20 },
    { x: 0.8, y: 0.8, width: 20, height: 20 }, { x: 0.2, y: 0.8, width: 20, height: 20 },
    { x: 0.8, y: 0.2, width: 20, height: 20 },
  ], // Five scattered blocks
  27: [
    { x: 0.5, y: 0.15, width: 150, height: 20 }, { x: 0.5, y: 0.85, width: 150, height: 20 },
    { x: 0.15, y: 0.5, width: 20, height: 150 }, { x: 0.85, y: 0.5, width: 20, height: 150 }
  ], // Outer frame
  28: [
    { x: 0.5, y: 0.5, width: 180, height: 20 }, { x: 0.5, y: 0.2, width: 20, height: 100 },
    { x: 0.5, y: 0.8, width: 20, height: 100 }
  ], // The "I" shape
  29: [
    { x: 0.25, y: 0.75, width: 200, height: 20 }, { x: 0.75, y: 0.25, width: 200, height: 20 },
    { x: 0.5, y: 0.5, width: 20, height: 200 }
  ], // Complex diagonal block
  30: [
    { x: 0.5, y: 0.5, width: 100, height: 100 }, { x: 0.1, y: 0.1, width: 50, height: 50 },
    { x: 0.9, y: 0.9, width: 50, height: 50 }, { x: 0.1, y: 0.9, width: 50, height: 50 },
    { x: 0.9, y: 0.1, width: 50, height: 50 }
  ], // Final Boss
};
