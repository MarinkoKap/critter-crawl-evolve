
import React from 'react';
import { CreatureType } from './EvolutionSimulator';

interface CreatureProps {
  creature: CreatureType;
}

const Creature: React.FC<CreatureProps> = ({ creature }) => {
  const energyPercentage = (creature.energy / creature.maxEnergy) * 100;
  const agePercentage = (creature.age / creature.maxAge) * 100;
  
  // Calculate opacity based on energy (dying creatures become more transparent)
  const opacity = Math.max(0.3, energyPercentage / 100);
  
  return (
    <div
      className="absolute transition-all duration-100 ease-linear"
      style={{
        left: creature.x - creature.size,
        top: creature.y - creature.size,
        width: creature.size * 2,
        height: creature.size * 2,
      }}
    >
      {/* Vision range (subtle) */}
      <div
        className="absolute rounded-full border border-gray-200/30"
        style={{
          left: creature.size - creature.visionRange,
          top: creature.size - creature.visionRange,
          width: creature.visionRange * 2,
          height: creature.visionRange * 2,
          opacity: 0.1,
        }}
      />
      
      {/* Creature body */}
      <div
        className="absolute rounded-full border-2 transition-all duration-200"
        style={{
          width: creature.size * 2,
          height: creature.size * 2,
          backgroundColor: creature.color,
          borderColor: energyPercentage > 50 ? '#10b981' : energyPercentage > 20 ? '#f59e0b' : '#ef4444',
          opacity: opacity,
          transform: `scale(${0.8 + (energyPercentage / 100) * 0.2})`,
        }}
      >
        {/* Energy indicator */}
        <div
          className="absolute bottom-0 left-0 bg-green-400 rounded-b-full transition-all duration-300"
          style={{
            width: '100%',
            height: `${energyPercentage}%`,
            opacity: 0.6,
          }}
        />
        
        {/* Age indicator (small dot) */}
        <div
          className="absolute top-1 right-1 rounded-full bg-white/70"
          style={{
            width: `${Math.max(2, agePercentage / 10)}px`,
            height: `${Math.max(2, agePercentage / 10)}px`,
          }}
        />
        
        {/* Generation badge */}
        {creature.generation > 1 && (
          <div className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
            {creature.generation}
          </div>
        )}
      </div>
    </div>
  );
};

export default Creature;
