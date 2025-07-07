
import React, { useRef, useCallback, useEffect } from 'react';
import { GameState } from '../types';
import BallComponent from './Ball';
import ObstacleComponent from './Obstacle';
import PredictionMarker from './PredictionMarker';
import FutureBall from './FutureBall';
import Scoreboard from './Scoreboard';
import ResultScreen from './ResultScreen';
import PauseMenu from './PauseMenu';
import BallTrail from './BallTrail';
import AdPlayer from './AdPlayer';
import { useI18n } from '../i18n';
import { useGameContext } from '../context/GameContext';

const GameScreen: React.FC = () => {
  const { state, dispatch } = useGameContext();
  const {
    gameState,
    ball,
    obstacles,
    prediction,
    futureBallPosition,
    ballTrailPoints,
    isShaking,
    isWatchingAd,
    adRewardMessage,
    showSettings,
    gameAreaSize
  } = state;

  const gameAreaRef = useRef<HTMLDivElement>(null);
  const { t } = useI18n();

  useEffect(() => {
    const element = gameAreaRef.current;
    if (element && gameState === GameState.Playing && !gameAreaSize) {
        let frameId: number;
        const measureAndDispatch = () => {
            const { clientWidth: width, clientHeight: height } = element;
            if (width > 0 && height > 0) {
                dispatch({ type: 'SETUP_GEOMETRY', payload: { width, height } });
            } else {
                frameId = requestAnimationFrame(measureAndDispatch);
            }
        };
        measureAndDispatch();

        return () => {
            if (frameId) cancelAnimationFrame(frameId);
        };
    }
  }, [gameState, dispatch]); // Removed gameAreaSize to prevent re-running


  const handleMousePrediction = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!gameAreaRef.current || gameState !== GameState.Playing) return;
    const rect = gameAreaRef.current.getBoundingClientRect();
    dispatch({
      type: 'MAKE_PREDICTION',
      payload: { position: { x: e.clientX - rect.left, y: e.clientY - rect.top } }
    });
  }, [dispatch, gameState]);

  const handleKeyboardPrediction = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!gameAreaRef.current || gameState !== GameState.Playing) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      // Use the center of the game area for keyboard predictions for accessibility
      const { clientWidth, clientHeight } = gameAreaRef.current;
      dispatch({
        type: 'MAKE_PREDICTION',
        payload: { position: { x: clientWidth / 2, y: clientHeight / 2 } }
      });
    }
  }, [dispatch, gameState]);

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-900 font-sans p-2 sm:p-4">
      <style>{`
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
        .animate-shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
      `}</style>
      
      <div className="w-full max-w-4xl pt-12 sm:pt-16">
        <Scoreboard />
      </div>
      
      <div 
        ref={gameAreaRef}
        className={`relative w-full max-w-4xl aspect-[4/5] sm:aspect-video bg-slate-800 border-2 border-cyan-500 rounded-lg shadow-2xl shadow-cyan-500/20 overflow-hidden cursor-crosshair focus:outline-none focus:ring-4 focus:ring-cyan-400/50 ${isShaking ? 'animate-shake' : ''}`}
        onClick={handleMousePrediction}
        onKeyDown={handleKeyboardPrediction}
        role="button"
        tabIndex={gameState === GameState.Playing ? 0 : -1}
        aria-label={t('game.instruction')}
      >
        {isWatchingAd && <AdPlayer />}
        
        {!!gameAreaSize && gameAreaSize.width > 0 && gameState !== GameState.Paused && !isWatchingAd && (
            <>
                <BallTrail points={ballTrailPoints} />
                <BallComponent ball={ball} />
                {obstacles.map((obs, i) => <ObstacleComponent key={i} obstacle={obs} />)}
                {prediction && <PredictionMarker position={prediction.position} isCorrect={prediction.isCorrect} />}
                {futureBallPosition && <FutureBall position={futureBallPosition} />}
            </>
        )}
        
        {gameState === GameState.Paused && !showSettings && (
            <PauseMenu />
        )}
        
        {(gameState === GameState.Result || gameState === GameState.GameOver) && prediction && (
            <ResultScreen />
        )}
      </div>

      <div className="text-center mt-4 h-12 sm:h-6 flex items-center justify-center px-2">
        {adRewardMessage && <span className="text-green-400 font-bold animate-pulse">{adRewardMessage}</span>}
        {!adRewardMessage && gameState === GameState.Playing && <span className="text-slate-400">{t('game.instruction')}</span>}
        {!adRewardMessage && gameState === GameState.Predicting && <span className="text-slate-400">{t('game.wait')}</span>}
        {!adRewardMessage && gameState === GameState.Result && prediction?.isCorrect && <span className="text-slate-300">{t('game.win_message')}</span>}
        {!adRewardMessage && gameState === GameState.Result && !prediction?.isCorrect && <span className="text-slate-300">{t('game.lose_message')}</span>}
      </div>
    </div>
  );
};

export default GameScreen;
