

import React from 'react';
import { type Vector } from '../types';
import { BALL_RADIUS } from '../constants';

interface FutureBallProps {
  position: Vector;
}

const FutureBall: React.FC<FutureBallProps> = ({ position }) => {
  return (
    <div
      className="absolute bg-cyan-400 rounded-full opacity-50 border-2 border-white"
      style={{
        left: position.x - BALL_RADIUS,
        top: position.y - BALL_RADIUS,
        width: BALL_RADIUS * 2,
        height: BALL_RADIUS * 2,
      }}
    />
  );
};

export default React.memo(FutureBall);