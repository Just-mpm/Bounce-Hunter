import React from 'react';
import ReactDOM from 'react-dom/client';
import './src/index.css';
import App from './App';
import { I18nProvider } from './i18n';
import { GameProvider } from './context/GameContext';

console.log('index.tsx loaded');

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("Could not find root element to mount to");
  throw new Error("Could not find root element to mount to");
}

console.log('Root element found, creating React root...');

try {
  const root = ReactDOM.createRoot(rootElement);
  console.log('React root created, rendering app...');
  
  root.render(
    <React.StrictMode>
      <I18nProvider>
        <GameProvider>
          <App />
        </GameProvider>
      </I18nProvider>
    </React.StrictMode>
  );
  
  console.log('App rendered successfully');
} catch (error) {
  console.error('Error during app initialization:', error);
  
  // Fallback: show a simple message
  const fallbackContent = document.createElement('div');
  fallbackContent.style.cssText = `
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #0f172a;
    color: white;
    font-family: Arial, sans-serif;
    text-align: center;
    padding: 20px;
  `;
  fallbackContent.innerHTML = `
    <div>
      <h1>Bounce Hunter</h1>
      <p>Erro ao carregar o aplicativo. Tente novamente.</p>
      <p>Error: ${error.message}</p>
    </div>
  `;
  
  rootElement.appendChild(fallbackContent);
}