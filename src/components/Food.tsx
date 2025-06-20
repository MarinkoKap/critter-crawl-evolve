
import React from 'react';
import { FoodType } from './EvolutionSimulator';

interface FoodProps {
  food: FoodType;
}

const Food: React.FC<FoodProps> = ({ food }) => {
  return (
    <div
      className="absolute animate-pulse"
      style={{
        left: food.x - food.size,
        top: food.y - food.size,
        width: food.size * 2,
        height: food.size * 2,
      }}
    >
      <div
        className="w-full h-full rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-lg"
        style={{
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        }}
      />
    </div>
  );
};

export default Food;
