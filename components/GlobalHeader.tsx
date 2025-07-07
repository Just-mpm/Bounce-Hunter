
import React, { useCallback } from 'react';
import { GameState } from '../types';
import { useI18n } from '../i18n';
import { useGameContext } from '../context/GameContext';

const HeartIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="m11.645 20.91-1.106-1.007C5.373 15.247 2 12.261 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.761-3.373 6.747-8.539 11.403L11.645 20.91Z" />
    </svg>
);

const SettingsIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.946 1.55l-.26 1.039a6.002 6.002 0 0 0-3.486 3.486l-1.04.26c-.886.247-1.55.9-1.55 1.798v1.858c0 .898.664 1.65 1.55 1.798l1.039.26c.796 2.034 2.39 3.628 4.425 4.425l.26 1.04c.247.886.9 1.55 1.798 1.55h1.858c.898 0 1.65-.664 1.798-1.55l.26-1.04a6.002 6.002 0 0 0 3.486-3.486l1.04-.26c.886-.247 1.55-.9 1.55-1.798v-1.858c0-.898-.664-1.65-1.55-1.798l-1.039-.26a6.002 6.002 0 0 0-3.486-3.486l-.26-1.04c-.247-.886-.9-1.55-1.798-1.55h-1.858ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" clipRule="evenodd" />
  </svg>
);

const ResetIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
    </svg>
);

const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
};


const GlobalHeader: React.FC = () => {
    const { state, dispatch, lifeSystem } = useGameContext();
    const { gameState } = state;
    const { t } = useI18n();

    const onSettingsClick = useCallback(() => dispatch({ type: 'TOGGLE_SETTINGS' }), [dispatch]);
    const onMenuClick = useCallback(() => dispatch({ type: 'PAUSE_GAME' }), [dispatch]);
    const onResetBall = useCallback(() => dispatch({ type: 'RESTART_LEVEL' }), [dispatch]);
    const onWatchAd = useCallback(() => dispatch({ type: 'SET_AD_WATCHING', payload: true }), [dispatch]);

    const showMenuButton = gameState === GameState.Playing || gameState === GameState.Paused;
    const showResetButton = gameState === GameState.Playing || gameState === GameState.Paused;
    
    // The header should be visible on Splash, Playing, and Paused states.
    const isHeaderVisible = gameState === GameState.SplashScreen || gameState === GameState.Playing || gameState === GameState.Paused;

    if (!isHeaderVisible) {
        return null;
    }

    return (
        <div className="absolute top-0 left-0 right-0 p-2 sm:p-4 flex justify-between items-center z-50 pointer-events-none animate-fade-in-down">
             <style>{`
                @keyframes fade-in-down {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-down { animation: fade-in-down 0.5s ease-in-out; }
            `}</style>

            {/* Left Controls */}
            <div className="flex-shrink-0 flex items-center gap-2 bg-slate-800/70 backdrop-blur-sm p-2 rounded-full border border-slate-700 shadow-lg pointer-events-auto">
                <button 
                  onClick={onSettingsClick} 
                  className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
                  aria-label={t('pause.settings')}
                >
                    <SettingsIcon className="w-6 h-6" />
                </button>

                {showMenuButton && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); onMenuClick(); }} 
                      className="px-3 h-10 rounded-full flex items-center justify-center text-white bg-slate-700/80 hover:bg-slate-700 transition-colors active:scale-95"
                      aria-label={t('menu.button')}
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        <span className="font-bold text-sm">{t('menu.button')}</span>
                    </button>
                )}
            </div>

            {/* Right Controls */}
            <div className="flex-shrink-0 flex items-center gap-2 bg-slate-800/70 backdrop-blur-sm p-2 rounded-full border border-slate-700 shadow-lg pointer-events-auto">
                {showResetButton && (
                     <>
                        <button
                            onClick={(e) => { e.stopPropagation(); onResetBall(); }}
                            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
                            aria-label={t('game.resetBall')}
                        >
                            <ResetIcon className="w-6 h-6" />
                        </button>
                        <div className="h-6 w-px bg-slate-700"></div>
                    </>
                )}
                
                <div className="flex items-center gap-3 pr-2">
                    <div className="flex items-center gap-2">
                        <HeartIcon className="w-6 h-6 text-red-500"/>
                        <span className="font-bold text-xl text-white">{lifeSystem.lives}</span>
                    </div>
                    {!lifeSystem.isMaxLives && (
                        lifeSystem.isRegenerating && lifeSystem.lives > 0 ? (
                            <div className="text-sm text-cyan-400 font-mono bg-slate-900/50 px-3 py-1 rounded-full">
                                <span>{formatTime(lifeSystem.timeToNextLife)}</span>
                            </div>
                        ) : lifeSystem.lives === 0 ? (
                            <button onClick={onWatchAd} className="whitespace-nowrap px-3 py-1 bg-green-500 text-white text-sm font-bold rounded-full hover:bg-green-400 transition-all active:scale-95">
                                {t('splash.story.watchAd')}
                            </button>
                        ) : null
                    )}
                </div>
            </div>
        </div>
    )
}

export default GlobalHeader;
