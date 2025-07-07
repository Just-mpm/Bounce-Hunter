import React, { useCallback } from 'react';
import { GameMode } from '../types';
import { useI18n } from '../i18n';
import LanguageSelector from './LanguageSelector';
import { useGameContext } from '../context/GameContext';

const SplashScreen: React.FC = () => {
  const { dispatch, lifeSystem } = useGameContext();
  const { t } = useI18n();

  const handleStart = useCallback((mode: GameMode) => {
    if (mode === GameMode.Story && lifeSystem.lives <= 0) return;
    dispatch({
      type: 'START_GAME',
      payload: { mode, initialLevel: 1 }
    });
  }, [lifeSystem.lives, dispatch]);
  
  return (
    <div className="relative h-screen w-screen flex flex-col items-center justify-center bg-slate-900 font-sans text-center p-4 md:p-8 animate-fade-in">
       <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-in-out; }
      `}</style>

      <h1 className="text-4xl sm:text-5xl font-bold text-cyan-400 mb-4 tracking-wider">{t('title')}</h1>
      <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">{t('splash.welcome')}</h2>
      <p 
        className="max-w-xl text-base md:text-lg text-slate-300 mb-8"
        dangerouslySetInnerHTML={{ __html: t('splash.goal') }}
      />
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex flex-col items-center gap-2">
            <button
                onClick={() => handleStart(GameMode.Story)}
                disabled={!lifeSystem.lives}
                className="w-full max-w-xs sm:w-56 px-6 py-4 bg-cyan-500 text-slate-900 font-bold text-xl md:text-2xl rounded-lg shadow-lg hover:bg-cyan-400 transform hover:scale-105 active:scale-95 transition-all duration-300 disabled:bg-slate-600 disabled:text-slate-400 disabled:scale-100 disabled:cursor-not-allowed"
            >
                {t('splash.story.title')}
            </button>
            <p className="mt-1 text-slate-400 max-w-xs text-sm md:text-base">{t('splash.story.description')}</p>
        </div>
        <div className="flex flex-col items-center">
            <button
                onClick={() => handleStart(GameMode.Arcade)}
                className="w-full max-w-xs sm:w-56 px-8 py-4 bg-indigo-500 text-white font-bold text-xl md:text-2xl rounded-lg shadow-lg hover:bg-indigo-400 transform hover:scale-105 active:scale-95 transition-all duration-300"
            >
                {t('splash.arcade.title')}
            </button>
            <p className="mt-3 text-slate-400 max-w-xs text-sm md:text-base">{t('splash.arcade.description')}</p>
        </div>
      </div>
      <div className="mt-12">
        <LanguageSelector />
      </div>
    </div>
  );
};

export default SplashScreen;