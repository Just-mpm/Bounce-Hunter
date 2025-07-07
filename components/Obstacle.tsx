
import React from 'react';
import { type Obstacle } from '../types';

interface ObstacleProps {
  obstacle: Obstacle;
}

const ObstacleComponent: React.FC<ObstacleProps> = ({ obstacle }) => {
  return (
    <div
      className="absolute bg-indigo-500 rounded"
      style={{
        left: obstacle.x,
        top: obstacle.y,
        width: obstacle.width,
        height: obstacle.height,
      }}
    />
  );
};

export default React.memo(ObstacleComponent);
