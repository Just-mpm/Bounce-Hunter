

import React from 'react';
import { GameState } from './types';
import SplashScreen from './components/SplashScreen';
import GameScreen from './components/GameScreen';
import GlobalHeader from './components/GlobalHeader';
import SettingsMenu from './components/SettingsMenu';
import { useGameContext } from './context/GameContext';

const App: React.FC = () => {
  const { state } = useGameContext();
  const { gameState, showSettings } = state;

  return (
    <>
      <GlobalHeader />
      {gameState === GameState.SplashScreen ? (
        <SplashScreen />
      ) : (
        <GameScreen />
      )}
      {showSettings && <SettingsMenu />}
    </>
  );
};

export default App;