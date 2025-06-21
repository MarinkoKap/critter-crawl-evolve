
import { CreatureType } from '@/components/EvolutionSimulator';

// Generate random color based on traits
const generateCreatureColor = (speed: number, size: number, efficiency: number): string => {
  const r = Math.floor(100 + speed * 50);
  const g = Math.floor(150 + efficiency * 100);
  const b = Math.floor(200 - size * 5);
  return `rgb(${Math.min(255, r)}, ${Math.min(255, g)}, ${Math.min(255, b)})`;
};

export const generateRandomCreature = (
  id: string, 
  worldWidth: number, 
  worldHeight: number, 
  generation: number
): CreatureType => {
  const speed = 1.0 + Math.random() * 2.5; // Increased from 0.5-2.5 to 1.0-3.5
  const size = 8 + Math.random() * 12; // Keep same size range
  const visionRange = 30 + Math.random() * 40; // Increased from 20-50 to 30-70
  const efficiency = 0.6 + Math.random() * 0.4; // Increased from 0.3-1.0 to 0.6-1.0
  const maxEnergy = 120 + Math.random() * 80; // Increased from 80-120 to 120-200
  const maxAge = 1200 + Math.random() * 800; // Increased from 800-1200 to 1200-2000

  return {
    id,
    x: Math.random() * (worldWidth - 40) + 20,
    y: Math.random() * (worldHeight - 40) + 20,
    vx: (Math.random() - 0.5) * speed,
    vy: (Math.random() - 0.5) * speed,
    energy: maxEnergy * 0.8, // Start with more energy (80% instead of 70%)
    maxEnergy,
    speed,
    size,
    visionRange,
    efficiency,
    age: 0,
    maxAge,
    generation,
    color: generateCreatureColor(speed, size, efficiency),
  };
};

export const reproduceCreatures = (
  parent1: CreatureType,
  parent2: CreatureType,
  worldWidth: number,
  worldHeight: number
): CreatureType => {
  const mutationRate = 0.08; // Slightly reduced mutation rate for stability
  const mutationStrength = 0.15; // Slightly reduced mutation strength

  const mutate = (value: number, min: number, max: number): number => {
    if (Math.random() < mutationRate) {
      const mutation = (Math.random() - 0.5) * mutationStrength * value;
      return Math.max(min, Math.min(max, value + mutation));
    }
    return value;
  };

  // Average parent traits with potential mutations - improved base ranges
  const speed = mutate((parent1.speed + parent2.speed) / 2, 0.5, 5); // Increased max speed
  const size = mutate((parent1.size + parent2.size) / 2, 5, 25);
  const visionRange = mutate((parent1.visionRange + parent2.visionRange) / 2, 20, 100); // Increased max vision
  const efficiency = mutate((parent1.efficiency + parent2.efficiency) / 2, 0.3, 1.5); // Increased max efficiency
  const maxEnergy = mutate((parent1.maxEnergy + parent2.maxEnergy) / 2, 80, 250); // Increased max energy
  const maxAge = mutate((parent1.maxAge + parent2.maxAge) / 2, 800, 2500); // Increased max age

  const generation = Math.max(parent1.generation, parent2.generation) + 1;

  return {
    id: `creature_${Date.now()}_${Math.random()}`,
    x: (parent1.x + parent2.x) / 2 + (Math.random() - 0.5) * 50,
    y: (parent1.y + parent2.y) / 2 + (Math.random() - 0.5) * 50,
    vx: (Math.random() - 0.5) * speed,
    vy: (Math.random() - 0.5) * speed,
    energy: maxEnergy * 0.7, // Start offspring with good energy
    maxEnergy,
    speed,
    size,
    visionRange,
    efficiency,
    age: 0,
    maxAge,
    generation,
    color: generateCreatureColor(speed, size, efficiency),
  };
};
