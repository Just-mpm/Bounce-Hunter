

import React from 'react';
import { type Vector } from '../types';

interface PredictionMarkerProps {
  position: Vector;
  isCorrect: boolean | null;
}

const PredictionMarker: React.FC<PredictionMarkerProps> = ({ position, isCorrect }) => {
  const color = isCorrect === null 
    ? 'border-yellow-400' 
    : isCorrect 
    ? 'border-green-400' 
    : 'border-red-500';

  return (
    <div
      className={`absolute rounded-full border-4 ${color} transition-colors duration-500`}
      style={{
        left: position.x - 25,
        top: position.y - 25,
        width: 50,
        height: 50,
        animation: isCorrect === null ? 'pulse 2s infinite' : 'none',
      }}
    >
        <style>{`
            @keyframes pulse {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.7; transform: scale(0.95); }
            }
        `}</style>
    </div>
  );
};

export default React.memo(PredictionMarker);