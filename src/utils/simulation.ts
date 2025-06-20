
import { CreatureType, FoodType } from '@/components/EvolutionSimulator';

export const generateFood = (id: string, worldWidth: number, worldHeight: number): FoodType => {
  return {
    id,
    x: Math.random() * (worldWidth - 20) + 10,
    y: Math.random() * (worldHeight - 20) + 10,
    energy: 20 + Math.random() * 30, // 20 to 50 energy
    size: 4 + Math.random() * 4, // 4 to 8 size
  };
};

export const updateCreaturePosition = (
  creature: CreatureType,
  worldWidth: number,
  worldHeight: number
): CreatureType => {
  let { x, y, vx, vy } = creature;

  // Simple random movement with some persistence
  const randomFactor = 0.1;
  vx += (Math.random() - 0.5) * randomFactor;
  vy += (Math.random() - 0.5) * randomFactor;

  // Limit velocity to creature's speed
  const velocity = Math.sqrt(vx * vx + vy * vy);
  if (velocity > creature.speed) {
    vx = (vx / velocity) * creature.speed;
    vy = (vy / velocity) * creature.speed;
  }

  // Update position
  x += vx;
  y += vy;

  // Bounce off walls
  if (x <= creature.size || x >= worldWidth - creature.size) {
    vx = -vx;
    x = Math.max(creature.size, Math.min(worldWidth - creature.size, x));
  }
  if (y <= creature.size || y >= worldHeight - creature.size) {
    vy = -vy;
    y = Math.max(creature.size, Math.min(worldHeight - creature.size, y));
  }

  return {
    ...creature,
    x,
    y,
    vx,
    vy,
  };
};
