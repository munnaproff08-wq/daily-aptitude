import React from 'react';
import { FireIcon } from './Icons';

interface StreakCounterProps {
  streak: number;
}

const StreakCounter: React.FC<StreakCounterProps> = ({ streak }) => {
  return (
    <div className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-white/60 backdrop-blur-sm rounded-full p-2 shadow-lg">
      <div className="flex items-center space-x-2">
        <FireIcon className="w-8 h-8 text-orange-500" />
        <span className="text-2xl font-bold text-slate-800 pr-2">{streak}</span>
      </div>
    </div>
  );
};

export default StreakCounter;