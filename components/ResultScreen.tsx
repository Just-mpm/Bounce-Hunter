import React, { useRef, useCallback } from 'react';
import { GameMode, GameState } from '../types';
import { useI18n } from '../i18n';
import useFocusTrap from '../hooks/useFocusTrap';
import { useGameContext } from '../context/GameContext';

const ResultScreen: React.FC = () => {
  const { state, dispatch } = useGameContext();
  const { gameState, gameMode, isGameComplete, prediction } = state;
  const { t } = useI18n();

  const onNextLevel = useCallback(() => dispatch({ type: 'NEXT_LEVEL' }), [dispatch]);
  const onRestartLevel = useCallback(() => dispatch({ type: 'RESTART_LEVEL' }), [dispatch]);
  const onGoToMainMenu = useCallback(() => dispatch({ type: 'GO_TO_MAIN_MENU' }), [dispatch]);
  const onPlayAgainArcade = useCallback(() => dispatch({ type: 'START_GAME', payload: { mode: GameMode.Arcade, initialLevel: 1 } }), [dispatch]);
  const onWatchAd = useCallback(() => dispatch({ type: 'SET_AD_WATCHING', payload: true }), [dispatch]);

  const resultRef = useRef<HTMLDivElement>(null);
  useFocusTrap(resultRef, { onDeactivate: onGoToMainMenu });

  const containerClasses = "absolute inset-0 bg-slate-900/80 flex flex-col items-center justify-center text-center p-4 md:p-8 z-20 backdrop-blur-sm animate-fade-in";

  const isWin = prediction?.isCorrect === true;
  const isGameOver = gameState === GameState.GameOver;

  if (isGameComplete) {
      return (
          <div className={containerClasses} ref={resultRef}>
             <style>{`
              @keyframes fade-in {
                from { opacity: 0; transform: scale(0.95); }
                to { opacity: 1; transform: scale(1); }
              }
              .animate-fade-in { animation: fade-in 0.2s ease-in-out; }
            `}</style>
            <h2 className="text-5xl md:text-6xl font-extrabold mb-4 text-cyan-400">{t('result.gameComplete')}</h2>
            <p className="text-lg md:text-xl text-slate-200 mb-8 max-w-md">{t('result.gameCompleteMessage')}</p>
            <button
              onClick={onGoToMainMenu}
              className="px-6 py-3 bg-cyan-500 text-slate-900 font-bold text-xl rounded-lg shadow-lg hover:bg-cyan-400 transform hover:scale-105 active:scale-95 transition-all duration-300"
            >
              {t('result.mainMenu')}
            </button>
        </div>
      )
  }

  const titleKey = isGameOver ? "result.gameOver" : isWin ? "result.success" : "result.almost";
  const title = t(titleKey);
  const titleColor = isGameOver ? "text-red-500" : isWin ? "text-green-400" : "text-yellow-500";

  const messageKey = isGameOver ? "result.gameOverMessage" : isWin ? "result.successMessage" : "result.almostMessage";
  const message = t(messageKey);

  return (
    <div className={containerClasses} ref={resultRef}>
       <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fade-in 0.2s ease-in-out; }
      `}</style>
      <h2 className={`text-5xl md:text-6xl font-extrabold mb-4 ${titleColor}`}>{title}</h2>
      <p className="text-lg md:text-xl text-slate-200 mb-8 max-w-md">{message}</p>
      <div className="flex flex-col sm:flex-row gap-4">
        {isWin && !isGameOver && (
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onNextLevel}
              className="px-6 py-3 bg-green-500 text-white font-bold text-xl rounded-lg shadow-lg hover:bg-green-400 transform hover:scale-105 active:scale-95 transition-all duration-300"
            >
              {t('result.nextLevel')}
            </button>
            <button
                onClick={onGoToMainMenu}
                className="px-6 py-3 bg-slate-600 text-white font-bold text-xl rounded-lg shadow-lg hover:bg-slate-500 transform hover:scale-105 active:scale-95 transition-all duration-300"
            >
                {t('result.mainMenu')}
            </button>
          </div>
        )}
        {!isWin && !isGameOver && (
             <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={onRestartLevel}
                    className="px-6 py-3 bg-yellow-500 text-white font-bold text-xl rounded-lg shadow-lg hover:bg-yellow-400 transform hover:scale-105 active:scale-95 transition-all duration-300"
                >
                    {t('result.tryAgain')}
                </button>
                 <button
                    onClick={onGoToMainMenu}
                    className="px-6 py-3 bg-slate-600 text-white font-bold text-xl rounded-lg shadow-lg hover:bg-slate-500 transform hover:scale-105 active:scale-95 transition-all duration-300"
                >
                    {t('result.mainMenu')}
                </button>
            </div>
        )}
         {isGameOver && !isGameComplete && (
          <div className="flex flex-col gap-4 items-center">
             {gameMode === GameMode.Story && (
                <>
                    <button
                        onClick={onWatchAd}
                        className="px-6 py-3 bg-green-500 text-white font-bold text-xl rounded-lg shadow-lg hover:bg-green-400 transform hover:scale-105 active:scale-95 transition-all duration-300"
                    >
                        {t('result.watchAd')}
                    </button>
                     <button
                        onClick={onGoToMainMenu}
                        className="px-6 py-3 bg-slate-600 text-white font-bold text-xl rounded-lg shadow-lg hover:bg-slate-500 transform hover:scale-105 active:scale-95 transition-all duration-300"
                    >
                        {t('result.mainMenu')}
                    </button>
                </>
            )}
            {gameMode === GameMode.Arcade && (
                <>
                    <button
                        onClick={onPlayAgainArcade}
                        className="px-6 py-3 bg-cyan-500 text-slate-900 font-bold text-xl rounded-lg shadow-lg hover:bg-cyan-400 transform hover:scale-105 active:scale-95 transition-all duration-300"
                    >
                        {t('result.playAgain')}
                    </button>
                    <button
                        onClick={onGoToMainMenu}
                        className="px-6 py-3 bg-slate-600 text-white font-bold text-xl rounded-lg shadow-lg hover:bg-slate-500 transform hover:scale-105 active:scale-95 transition-all duration-300"
                    >
                        {t('result.mainMenu')}
                    </button>
                </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultScreen;