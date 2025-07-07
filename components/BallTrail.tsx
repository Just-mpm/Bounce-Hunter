
import React from 'react';
import { type Vector } from '../types';

interface BallTrailProps {
  points: Vector[];
}

const BallTrail: React.FC<BallTrailProps> = ({ points }) => {
  return (
    <React.Fragment>
      {points.map((p, i) => {
        const sizeRatio = i / points.length;
        const size = sizeRatio * 16;
        return (
            <div
              key={i}
              className="absolute bg-cyan-400 rounded-full pointer-events-none"
              style={{
                left: p.x - size / 2,
                top: p.y - size / 2,
                width: size,
                height: size,
                opacity: sizeRatio * 0.3,
              }}
            />
        )
        })}
    </React.Fragment>
  );
};

export default React.memo(BallTrail);