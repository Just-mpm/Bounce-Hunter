
import React from 'react';
import { GameMode } from '../types';
import { useI18n } from '../i18n';
import { useGameContext } from '../context/GameContext';

const HeartIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="m11.645 20.91-1.106-1.007C5.373 15.247 2 12.261 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.761-3.373 6.747-8.539 11.403L11.645 20.91Z" />
    </svg>
);

const Scoreboard: React.FC = () => {
  const { state } = useGameContext();
  const { level, score, gameMode, arcadeLives } = state;
  const { t } = useI18n();

  return (
    <div className="w-full max-w-4xl flex justify-between items-center mb-2 sm:mb-4 px-2 sm:px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700">
      <div className="text-base sm:text-xl font-semibold">
        {t('scoreboard.level')}: <span className="text-cyan-400 font-bold">{level}</span>
      </div>
      <div className="text-base sm:text-xl font-semibold">
        {t('scoreboard.score')}: <span className="text-cyan-400 font-bold">{score}</span>
      </div>
      {gameMode === GameMode.Arcade && (
        <div className="flex items-center gap-2">
            <span className="text-base sm:text-xl font-semibold hidden sm:inline">{t('scoreboard.lives')}:</span>
             <div className="flex items-center gap-1">
                {[...Array(3)].map((_, i) => (
                    <HeartIcon key={i} className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors ${i < arcadeLives ? 'text-red-500' : 'text-slate-600'}`} />
                ))}
            </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(Scoreboard);