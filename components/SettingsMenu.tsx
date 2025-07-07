import React, { useRef, useCallback } from 'react';
import { type Settings } from '../types';
import ToggleSwitch from './ToggleSwitch';
import { useI18n } from '../i18n';
import LanguageSelector from './LanguageSelector';
import useFocusTrap from '../hooks/useFocusTrap';
import { useGameContext } from '../context/GameContext';

const SettingsMenu: React.FC = () => {
  const { state, dispatch } = useGameContext();
  const { settings } = state;
  const { t } = useI18n();
  
  const onBack = useCallback(() => dispatch({ type: 'TOGGLE_SETTINGS' }), [dispatch]);
  const onUpdate = useCallback((newSettings: Partial<Settings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: newSettings });
  }, [dispatch]);

  const menuRef = useRef<HTMLDivElement>(null);
  useFocusTrap(menuRef, { onDeactivate: onBack });

  return (
    <div ref={menuRef} className="absolute inset-0 bg-slate-900/80 flex flex-col items-center justify-center text-center p-8 z-40 backdrop-blur-sm animate-fade-in">
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fade-in 0.2s ease-in-out; }
      `}</style>
      <h2 className="text-5xl font-extrabold mb-8 text-white">{t('settings.title')}</h2>
      <div className="flex flex-col gap-6 w-full max-w-sm">
        <div className="flex items-center justify-between bg-slate-800/50 p-4 rounded-lg">
          <span className="text-xl text-white font-semibold">{t('settings.ballTrail')}</span>
          <ToggleSwitch 
            checked={settings.showTrail} 
            onChange={e => onUpdate({ showTrail: e.target.checked })} 
          />
        </div>
        <div className="flex items-center justify-between bg-slate-800/50 p-4 rounded-lg">
          <span className="text-xl text-white font-semibold">{t('settings.screenShake')}</span>
          <ToggleSwitch 
            checked={settings.screenShake} 
            onChange={e => onUpdate({ screenShake: e.target.checked })} 
          />
        </div>
        <div className="flex items-center justify-between bg-slate-800/50 p-4 rounded-lg">
          <span className="text-xl text-white font-semibold">{t('settings.language')}</span>
          <LanguageSelector />
        </div>
      </div>
      <button
        onClick={onBack}
        className="mt-10 px-8 py-3 w-full max-w-xs sm:w-64 bg-slate-600 text-white font-bold text-2xl rounded-lg shadow-lg hover:bg-slate-500 transform hover:scale-105 active:scale-95 transition-all duration-300"
      >
        {t('settings.back')}
      </button>
    </div>
  );
};

export default SettingsMenu;