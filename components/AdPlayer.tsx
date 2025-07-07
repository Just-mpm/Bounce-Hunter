import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useI18n } from '../i18n';
import useFocusTrap from '../hooks/useFocusTrap';
import { useGameContext } from '../context/GameContext';

const AdPlayer: React.FC = () => {
  const { dispatch, lifeSystem } = useGameContext();
  const [countdown, setCountdown] = useState(5);
  const { t } = useI18n();
  const adRef = useRef<HTMLDivElement>(null);
  useFocusTrap(adRef);

  const handleComplete = useCallback(() => {
    lifeSystem.refillLives();
    dispatch({ type: 'SET_AD_WATCHING', payload: false });
    dispatch({ type: 'SET_AD_REWARD_MESSAGE', payload: t('ad.rewardMessage') });
    dispatch({ type: 'RESTART_LEVEL' });
  }, [dispatch, lifeSystem, t]);

  useEffect(() => {
    if (countdown <= 0) {
      handleComplete();
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, handleComplete]);

  return (
    <div ref={adRef} className="absolute inset-0 bg-slate-900/95 flex flex-col items-center justify-center text-center p-8 z-50 backdrop-blur-md animate-fade-in">
       <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-in-out; }
      `}</style>
      <h2 className="text-3xl font-bold text-white mb-4">{t('ad.watching')}</h2>
      <div className="w-16 h-16 border-4 border-cyan-400 rounded-full flex items-center justify-center">
        <span className="text-3xl font-mono font-bold text-white">{countdown}</span>
      </div>
      <p className="text-slate-400 mt-4">{t('ad.resumeMessage')}</p>
    </div>
  );
};

export default AdPlayer;