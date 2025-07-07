
import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import { GameState, GameMode, type Ball, type AppState, type Action, type LifeSystem } from '../types';
import { BALL_RADIUS, PREDICTION_MARKER_RADIUS, PREDICTION_TIME_MS, WIN_THRESHOLD, OBSTACLES_BY_LEVEL, STORAGE_KEYS, BALL_TRAIL_LENGTH } from '../constants';
import useLifeSystem from '../hooks/useLifeSystem';
import { useI18n } from '../i18n';

// --- Helper Functions ---

const getBallSpeedForLevel = (level: number): number => {
  // Speed is defined in pixels per second.
  // The speed at level 1. The user likes that it starts slow.
  const baseSpeed = 150;
  // How much the speed increases for each subsequent level.
  const perLevelIncrement = 7;
  return baseSpeed + ((level - 1) * perLevelIncrement);
};

const getInitialBallState = (width: number, height: number, level: number): Ball => {
  const speed = getBallSpeedForLevel(level);

  if (level === 1) {
    return { position: { x: width / 2, y: height * 0.2 }, velocity: { x: 0, y: speed }, radius: BALL_RADIUS };
  }
  if (level === 2) {
    return { position: { x: width * 0.2, y: height / 2 }, velocity: { x: speed, y: 0 }, radius: BALL_RADIUS };
  }

  const angle = Math.random() * 2 * Math.PI;
  return { position: { x: width * 0.2, y: height * 0.2 }, velocity: { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed }, radius: BALL_RADIUS };
};

const getSavedStoryLevel = (): number => {
    try {
        const savedLevel = localStorage.getItem(STORAGE_KEYS.STORY_LEVEL);
        return savedLevel ? parseInt(savedLevel, 10) : 1;
    } catch {
        return 1;
    }
};

const saveStoryLevel = (levelToSave: number) => {
    try {
        localStorage.setItem(STORAGE_KEYS.STORY_LEVEL, levelToSave.toString());
    } catch (e) {
        console.error("Could not save story level", e);
    }
};

// --- Reducer and Initial State ---

const initialState: AppState = {
  gameState: GameState.SplashScreen,
  gameMode: null,
  level: 1,
  score: 0,
  arcadeLives: 3,
  ball: { position: { x: 0, y: 0 }, velocity: { x: 0, y: 0 }, radius: BALL_RADIUS },
  obstacles: [],
  prediction: null,
  futureBallPosition: null,
  ballTrailPoints: [],
  isShaking: false,
  settings: { showTrail: true, screenShake: true },
  showSettings: false,
  isWatchingAd: false,
  adRewardMessage: null,
  isGameComplete: false,
  gameAreaSize: null,
  predictionTimer: null,
  justLostLife: false,
};

function gameReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'START_GAME': {
        const { mode } = action.payload;
        const initialLevel = mode === GameMode.Story ? getSavedStoryLevel() : 1;
        return {
            ...initialState,
            settings: state.settings,
            gameState: GameState.Playing,
            gameMode: mode,
            level: initialLevel,
            arcadeLives: mode === GameMode.Arcade ? 3 : state.arcadeLives,
        };
    }
    case 'SETUP_GEOMETRY': {
        const { width, height } = action.payload;
        const newBall = getInitialBallState(width, height, state.level);
        const newObstacles = (OBSTACLES_BY_LEVEL[state.level] || []).map(o => ({
            ...o, x: width * o.x - o.width / 2, y: height * o.y - o.height / 2,
        }));
        return { ...state, ball: newBall, obstacles: newObstacles, gameAreaSize: { width, height } };
    }
    case 'PAUSE_GAME':
        return { ...state, gameState: GameState.Paused };
    case 'RESUME_GAME':
        return state.isWatchingAd ? state : { ...state, gameState: GameState.Playing };
    case 'GO_TO_MAIN_MENU':
        return { ...initialState, settings: state.settings };
    case 'MAKE_PREDICTION': {
      return { 
          ...state, 
          gameState: GameState.Predicting, 
          prediction: { position: action.payload.position, isCorrect: null },
          predictionTimer: PREDICTION_TIME_MS,
        };
    }
    case 'SET_GAME_OVER':
      return { ...state, gameState: GameState.GameOver };
    case 'NEXT_LEVEL': {
        if (!state.gameAreaSize) return state; // Guard
        const { width, height } = state.gameAreaSize;
        const nextLevelNum = state.level + 1;
        if (state.gameMode === GameMode.Story) {
            saveStoryLevel(nextLevelNum);
        }
        if (!OBSTACLES_BY_LEVEL[nextLevelNum]) {
            return { ...state, level: nextLevelNum, gameState: GameState.Result, isGameComplete: true };
        }
        const newBall = getInitialBallState(width, height, nextLevelNum);
        const newObstacles = (OBSTACLES_BY_LEVEL[nextLevelNum] || []).map(o => ({
            ...o, x: width * o.x - o.width / 2, y: height * o.y - o.height / 2,
        }));
        return { 
            ...state, 
            level: nextLevelNum, 
            gameState: GameState.Playing, 
            prediction: null, 
            futureBallPosition: null, 
            ballTrailPoints: [],
            ball: newBall,
            obstacles: newObstacles,
        };
    }
    case 'RESTART_LEVEL': {
        if (!state.gameAreaSize) return state; // Guard against no size
        const { width, height } = state.gameAreaSize;
        const newBall = getInitialBallState(width, height, state.level);
        const newObstacles = (OBSTACLES_BY_LEVEL[state.level] || []).map(o => ({
            ...o, x: width * o.x - o.width / 2, y: height * o.y - o.height / 2,
        }));
        return { 
            ...state,
            gameState: GameState.Playing,
            ball: newBall,
            obstacles: newObstacles,
            prediction: null,
            futureBallPosition: null,
            ballTrailPoints: [],
            isWatchingAd: false,
        };
    }
    case 'RESET_ON_RESIZE': {
        if (!state.gameAreaSize) return state;
        const { width, height } = action.payload;
        const newBall = getInitialBallState(width, height, state.level);
        const newObstacles = (OBSTACLES_BY_LEVEL[state.level] || []).map(o => ({
            ...o, x: width * o.x - o.width / 2, y: height * o.y - o.height / 2,
        }));
        return { 
            ...state, 
            ball: newBall, 
            obstacles: newObstacles, 
            gameAreaSize: { width, height },
            prediction: null, 
            futureBallPosition: null, 
            ballTrailPoints: [] 
        };
    }
    case 'TRIGGER_SHAKE':
        return { ...state, isShaking: true };
    case 'STOP_SHAKE':
        return { ...state, isShaking: false };
    case 'RESET_VISUALS':
        return { ...state, prediction: null, futureBallPosition: null, ballTrailPoints: [] };
    case 'UPDATE_FRAME': {
      if (!state.gameAreaSize) return state; // Guard clause
      const { deltaTime } = action.payload;
      const dt = deltaTime / 1000; // Convert ms to seconds
      
      const { width, height } = state.gameAreaSize;
      const { ball, obstacles, settings, ballTrailPoints } = state;

      let newVx = ball.velocity.x;
      let newVy = ball.velocity.y;
      
      let xFlipped = false;
      let yFlipped = false;

      const nextPos = { x: ball.position.x + newVx * dt, y: ball.position.y + newVy * dt };
      
      if ((nextPos.x + ball.radius >= width && newVx > 0) || (nextPos.x - ball.radius <= 0 && newVx < 0)) {
        newVx = -newVx;
        xFlipped = true;
      }
      if ((nextPos.y + ball.radius >= height && newVy > 0) || (nextPos.y - ball.radius <= 0 && newVy < 0)) {
        newVy = -newVy;
        yFlipped = true;
      }

      obstacles.forEach(obstacle => {
        if (nextPos.x + ball.radius > obstacle.x && nextPos.x - ball.radius < obstacle.x + obstacle.width && nextPos.y + ball.radius > obstacle.y && nextPos.y - ball.radius < obstacle.y + obstacle.height) {
          if (!xFlipped && ((ball.position.x + ball.radius <= obstacle.x && nextPos.x + ball.radius > obstacle.x) || (ball.position.x - ball.radius >= obstacle.x + obstacle.width && nextPos.x - ball.radius < obstacle.x + obstacle.width))) {
            newVx = -ball.velocity.x;
            xFlipped = true;
          }
          if (!yFlipped && ((ball.position.y + ball.radius <= obstacle.y && nextPos.y + ball.radius > obstacle.y) || (ball.position.y - ball.radius >= obstacle.y + obstacle.height && nextPos.y - ball.radius < obstacle.y + obstacle.height))) {
            newVy = -ball.velocity.y;
            yFlipped = true;
          }
        }
      });
      const newVelocity = { x: newVx, y: newVy };
      const newPosition = { x: ball.position.x + newVelocity.x * dt, y: ball.position.y + newVelocity.y * dt };
      const newTrail = settings.showTrail ? [...ballTrailPoints.slice(-BALL_TRAIL_LENGTH), newPosition] : [];
      
      let nextState = { ...state, ball: { ...ball, position: newPosition, velocity: newVelocity }, ballTrailPoints: newTrail };

      // Integrated Prediction Timer Logic
      if (nextState.gameState === GameState.Predicting && nextState.predictionTimer !== null) {
          const newTimer = nextState.predictionTimer - deltaTime;
          if (newTimer <= 0) {
              const clickPosition = nextState.prediction!.position;
              const currentBall = nextState.ball;
              const distance = Math.hypot(currentBall.position.x - clickPosition.x, currentBall.position.y - clickPosition.y);
              // Para acertar, a bola deve tocar o círculo: distância entre centros ≤ soma dos raios
              const isWin = distance <= WIN_THRESHOLD;

              let justLostLife = false;
              if (!isWin) {
                  justLostLife = true;
              }

              nextState = {
                  ...nextState,
                  gameState: GameState.Result,
                  predictionTimer: null,
                  prediction: { ...nextState.prediction!, isCorrect: isWin },
                  futureBallPosition: { ...currentBall.position },
                  score: isWin ? nextState.score + 100 * nextState.level : nextState.score,
                  arcadeLives: (!isWin && nextState.gameMode === GameMode.Arcade) ? nextState.arcadeLives - 1 : nextState.arcadeLives,
                  justLostLife: justLostLife,
              };
          } else {
              nextState.predictionTimer = newTimer;
          }
      }

      return nextState;
    }
    case 'TOGGLE_SETTINGS':
        if(state.gameState === GameState.Playing && !state.showSettings) {
            return {...state, showSettings: !state.showSettings, gameState: GameState.Paused }
        }
        return {...state, showSettings: !state.showSettings };
    case 'SET_AD_WATCHING':
        return {...state, isWatchingAd: action.payload };
    case 'SET_AD_REWARD_MESSAGE':
        return {...state, adRewardMessage: action.payload };
    case 'UPDATE_SETTINGS':
        const newSettings = { ...state.settings, ...action.payload };
        const newTrail = newSettings.showTrail ? state.ballTrailPoints : [];
        return { ...state, settings: newSettings, ballTrailPoints: newTrail };
    case 'CLEAR_JUST_LOST_LIFE_FLAG':
        return { ...state, justLostLife: false };
    default:
      return state;
  }
}

// --- Context and Provider ---

const GameContext = createContext<{ state: AppState; dispatch: React.Dispatch<Action>; lifeSystem: LifeSystem } | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(gameReducer, initialState);
    const lifeSystem = useLifeSystem();
    const { t, locale } = useI18n();

    const lastFrameTime = useRef<number>(Date.now());

    useEffect(() => {
        document.documentElement.lang = locale;
        document.title = t('title');
    }, [locale, t]);

    // Game Loop
    useEffect(() => {
        const isAnimating = (state.gameState === GameState.Playing || state.gameState === GameState.Predicting) && !!state.gameAreaSize;
        if (!isAnimating) return;

        let frameId: number;
        const loop = () => {
            const now = Date.now();
            const deltaTime = now - lastFrameTime.current;
            lastFrameTime.current = now;
            
            dispatch({ type: 'UPDATE_FRAME', payload: { deltaTime } });
            frameId = requestAnimationFrame(loop);
        };

        lastFrameTime.current = Date.now(); // Reset timer when loop starts
        frameId = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(frameId);
    }, [state.gameState, state.gameAreaSize]);

    // Side effects after losing a life
    useEffect(() => {
        if (state.justLostLife) {
            if (state.settings.screenShake) {
                dispatch({ type: 'TRIGGER_SHAKE' });
                setTimeout(() => dispatch({ type: 'STOP_SHAKE' }), 500);
            }
            if (state.gameMode === GameMode.Story) {
                lifeSystem.useLife();
            }
            // Reset the flag immediately
            dispatch({ type: 'CLEAR_JUST_LOST_LIFE_FLAG' });
        }
    }, [state.justLostLife, state.settings.screenShake, state.gameMode, lifeSystem, dispatch]);

    // Game Over check
    useEffect(() => {
      if (state.gameState !== GameState.Result) return;
      
      const checkGameOver = () => {
        if (state.gameMode === GameMode.Story && lifeSystem.lives <= 0) {
          dispatch({ type: 'SET_GAME_OVER' });
        }
        if (state.gameMode === GameMode.Arcade && state.arcadeLives <= 0) {
          dispatch({ type: 'SET_GAME_OVER' });
        }
      };
      
      // Delay check slightly to allow UI to update with latest life count
      const timer = setTimeout(checkGameOver, 10);
      return () => clearTimeout(timer);

    }, [state.gameState, lifeSystem.lives, state.arcadeLives, state.gameMode]);
    
    // Ad Reward Message Timer
    useEffect(() => {
      if (!state.adRewardMessage) return;
      const timer = setTimeout(() => {
        dispatch({ type: 'SET_AD_REWARD_MESSAGE', payload: null });
      }, 3000);
      return () => clearTimeout(timer);
    }, [state.adRewardMessage]);

    // Resize Handler
    useEffect(() => {
        const handleResize = () => {
            if (state.gameState !== GameState.SplashScreen && state.gameAreaSize) {
                // This logic needs a ref to the game area, which is in GameScreen.
                // A better approach would be to dispatch an action that GameScreen listens to.
                // For now, let's keep it simple. It's best handled inside GameScreen.
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [state.gameState, state.gameAreaSize]);


    const value = { state, dispatch, lifeSystem };
    return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export const useGameContext = () => {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error('useGameContext must be used within a GameProvider');
    }
    return context;
}