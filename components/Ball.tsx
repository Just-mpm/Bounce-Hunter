

import React from 'react';
import { type Ball } from '../types';

interface BallProps {
  ball: Ball;
}

const BallComponent: React.FC<BallProps> = ({ ball }) => {
  return (
    <div
      className="absolute bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50"
      style={{
        left: ball.position.x - ball.radius,
        top: ball.position.y - ball.radius,
        width: ball.radius * 2,
        height: ball.radius * 2,
      }}
    />
  );
};

export default React.memo(BallComponent);