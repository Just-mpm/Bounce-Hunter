
export enum GameMode {
  Story,
  Arcade,
}

export enum GameState {
  SplashScreen,
  Playing,
  Predicting,
  Result,
  GameOver,
  Paused,
}

export interface Vector {
  x: number;
  y: number;
}

export interface Ball {
  position: Vector;
  velocity: Vector;
  radius: number;
}

export interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Prediction {
  position: Vector;
  isCorrect: boolean | null;
}

export interface Settings {
  showTrail: boolean;
  screenShake: boolean;
}

export interface LifeSystem {
  lives: number;
  maxLives: number;
  isMaxLives: boolean;
  timeToNextLife: number; // in seconds
  isRegenerating: boolean;
  useLife: () => void;
  addLife: (amount?: number) => void;
  refillLives: () => void;
}

// --- Reducer Types ---

export interface AppState {
  gameState: GameState;
  gameMode: GameMode | null;
  level: number;
  score: number;
  arcadeLives: number;
  ball: Ball;
  obstacles: Obstacle[];
  prediction: Prediction | null;
  futureBallPosition: Vector | null;
  ballTrailPoints: Vector[];
  isShaking: boolean;
  settings: Settings;
  showSettings: boolean;
  isWatchingAd: boolean;
  adRewardMessage: string | null;
  isGameComplete: boolean;
  gameAreaSize: { width: number; height: number; } | null;
  predictionTimer: number | null;
  justLostLife: boolean;
}

export type Action =
  | { type: 'START_GAME'; payload: { mode: GameMode; initialLevel: number; } }
  | { type: 'SETUP_GEOMETRY'; payload: { width: number; height: number; } }
  | { type: 'PAUSE_GAME' }
  | { type: 'RESUME_GAME' }
  | { type: 'GO_TO_MAIN_MENU' }
  | { type: 'MAKE_PREDICTION'; payload: { position: Vector; } }
  | { type: 'SET_GAME_OVER' }
  | { type: 'NEXT_LEVEL' }
  | { type: 'RESTART_LEVEL' }
  | { type: 'RESET_ON_RESIZE'; payload: { width: number; height: number; } }
  | { type: 'TRIGGER_SHAKE' }
  | { type: 'STOP_SHAKE' }
  | { type: 'RESET_VISUALS' }
  | { type: 'UPDATE_FRAME', payload: { deltaTime: number } }
  | { type: 'TOGGLE_SETTINGS' }
  | { type: 'SET_AD_WATCHING'; payload: boolean }
  | { type: 'SET_AD_REWARD_MESSAGE'; payload: string | null }
  | { type: 'UPDATE_SETTINGS', payload: Partial<Settings> }
  | { type: 'CLEAR_JUST_LOST_LIFE_FLAG' };
