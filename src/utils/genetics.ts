
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
  const speed = 0.5 + Math.random() * 2; // 0.5 to 2.5
  const size = 8 + Math.random() * 12; // 8 to 20
  const visionRange = 20 + Math.random() * 30; // 20 to 50
  const efficiency = 0.3 + Math.random() * 0.7; // 0.3 to 1.0
  const maxEnergy = 80 + Math.random() * 40; // 80 to 120
  const maxAge = 800 + Math.random() * 400; // 800 to 1200

  return {
    id,
    x: Math.random() * (worldWidth - 40) + 20,
    y: Math.random() * (worldHeight - 40) + 20,
    vx: (Math.random() - 0.5) * speed,
    vy: (Math.random() - 0.5) * speed,
    energy: maxEnergy * 0.7,
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
  const mutationRate = 0.1;
  const mutationStrength = 0.2;

  const mutate = (value: number, min: number, max: number): number => {
    if (Math.random() < mutationRate) {
      const mutation = (Math.random() - 0.5) * mutationStrength * value;
      return Math.max(min, Math.min(max, value + mutation));
    }
    return value;
  };

  // Average parent traits with potential mutations
  const speed = mutate((parent1.speed + parent2.speed) / 2, 0.1, 4);
  const size = mutate((parent1.size + parent2.size) / 2, 5, 25);
  const visionRange = mutate((parent1.visionRange + parent2.visionRange) / 2, 10, 80);
  const efficiency = mutate((parent1.efficiency + parent2.efficiency) / 2, 0.1, 1.2);
  const maxEnergy = mutate((parent1.maxEnergy + parent2.maxEnergy) / 2, 50, 150);
  const maxAge = mutate((parent1.maxAge + parent2.maxAge) / 2, 500, 1500);

  const generation = Math.max(parent1.generation, parent2.generation) + 1;

  return {
    id: `creature_${Date.now()}_${Math.random()}`,
    x: (parent1.x + parent2.x) / 2 + (Math.random() - 0.5) * 50,
    y: (parent1.y + parent2.y) / 2 + (Math.random() - 0.5) * 50,
    vx: (Math.random() - 0.5) * speed,
    vy: (Math.random() - 0.5) * speed,
    energy: maxEnergy * 0.6,
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
