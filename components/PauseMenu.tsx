import React, { useRef, useCallback } from 'react';
import { useI18n } from '../i18n';
import useFocusTrap from '../hooks/useFocusTrap';
import { useGameContext } from '../context/GameContext';

const PauseMenu: React.FC = () => {
  const { dispatch } = useGameContext();
  const { t } = useI18n();

  const onResume = useCallback(() => dispatch({ type: 'RESUME_GAME' }), [dispatch]);
  const onSettings = useCallback(() => dispatch({ type: 'TOGGLE_SETTINGS' }), [dispatch]);
  const onMainMenu = useCallback(() => dispatch({ type: 'GO_TO_MAIN_MENU' }), [dispatch]);
  
  const menuRef = useRef<HTMLDivElement>(null);
  useFocusTrap(menuRef, { onDeactivate: onResume });
  
  return (
    <div ref={menuRef} className="absolute inset-0 bg-slate-900/80 flex flex-col items-center justify-center text-center p-8 z-30 backdrop-blur-sm animate-fade-in">
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fade-in 0.2s ease-in-out; }
      `}</style>
      <h2 className="text-5xl font-extrabold mb-8 text-white">{t('pause.title')}</h2>
      <div className="flex flex-col items-center gap-5 w-full max-w-xs">
        <button
          onClick={onResume}
          className="px-8 py-4 w-full sm:w-64 bg-cyan-500 text-slate-900 font-bold text-2xl rounded-lg shadow-lg hover:bg-cyan-400 transform hover:scale-105 active:scale-95 transition-all duration-300"
        >
          {t('pause.resume')}
        </button>
        <button
          onClick={onSettings}
          className="px-8 py-4 w-full sm:w-64 bg-indigo-500 text-white font-bold text-2xl rounded-lg shadow-lg hover:bg-indigo-400 transform hover:scale-105 active:scale-95 transition-all duration-300"
        >
          {t('pause.settings')}
        </button>
        <button
          onClick={onMainMenu}
          className="px-8 py-4 w-full sm:w-64 bg-slate-600 text-white font-bold text-2xl rounded-lg shadow-lg hover:bg-slate-500 transform hover:scale-105 active:scale-95 transition-all duration-300"
        >
          {t('pause.mainMenu')}
        </button>
      </div>
    </div>
  );
};

export default PauseMenu;