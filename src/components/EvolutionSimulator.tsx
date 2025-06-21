import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, RotateCcw } from 'lucide-react';
import Creature from './Creature';
import Food from './Food';
import Statistics from './Statistics';
import { generateRandomCreature, reproduceCreatures } from '@/utils/genetics';
import { generateFood, updateCreaturePosition } from '@/utils/simulation';

export interface CreatureType {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  energy: number;
  maxEnergy: number;
  speed: number;
  size: number;
  visionRange: number;
  efficiency: number;
  age: number;
  maxAge: number;
  generation: number;
  color: string;
}

export interface FoodType {
  id: string;
  x: number;
  y: number;
  energy: number;
  size: number;
}

const WORLD_WIDTH = 800;
const WORLD_HEIGHT = 600;
const INITIAL_CREATURES = 25; // Increased from 20
const INITIAL_FOOD = 40; // Increased from 30
const FOOD_SPAWN_RATE = 0.4; // Increased from 0.3
const MAX_FOOD = 60; // Increased from 50

const EvolutionSimulator = () => {
  const [creatures, setCreatures] = useState<CreatureType[]>([]);
  const [food, setFood] = useState<FoodType[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [generation, setGeneration] = useState(1);
  const [totalBorn, setTotalBorn] = useState(0);
  const [totalDied, setTotalDied] = useState(0);
  const animationRef = useRef<number>();

  // Initialize simulation
  const initializeSimulation = useCallback(() => {
    const initialCreatures = Array.from({ length: INITIAL_CREATURES }, (_, i) =>
      generateRandomCreature(i.toString(), WORLD_WIDTH, WORLD_HEIGHT, 1)
    );
    const initialFood = Array.from({ length: INITIAL_FOOD }, (_, i) =>
      generateFood(i.toString(), WORLD_WIDTH, WORLD_HEIGHT)
    );
    
    setCreatures(initialCreatures);
    setFood(initialFood);
    setGeneration(1);
    setTotalBorn(INITIAL_CREATURES);
    setTotalDied(0);
  }, []);

  // Main simulation loop
  const updateSimulation = useCallback(() => {
    setCreatures(prevCreatures => {
      let newCreatures = [...prevCreatures];
      
      // Update creature positions and behaviors
      newCreatures = newCreatures.map(creature => {
        let updatedCreature = { ...creature };
        
        // Age the creature (slower aging)
        updatedCreature.age += 0.8; // Reduced from 1 to 0.8
        
        // Decrease energy over time (reduced metabolism)
        updatedCreature.energy -= 0.3 / updatedCreature.efficiency; // Reduced from 0.5
        
        // Update position
        updatedCreature = updateCreaturePosition(updatedCreature, WORLD_WIDTH, WORLD_HEIGHT);
        
        return updatedCreature;
      });

      // Check for food consumption
      setFood(prevFood => {
        let newFood = [...prevFood];
        
        newCreatures.forEach(creature => {
          newFood = newFood.filter(foodItem => {
            const distance = Math.sqrt(
              Math.pow(creature.x - foodItem.x, 2) + Math.pow(creature.y - foodItem.y, 2)
            );
            
            if (distance < creature.size + foodItem.size) {
              // Creature ate the food
              const creatureIndex = newCreatures.findIndex(c => c.id === creature.id);
              if (creatureIndex !== -1) {
                newCreatures[creatureIndex].energy = Math.min(
                  newCreatures[creatureIndex].maxEnergy,
                  newCreatures[creatureIndex].energy + foodItem.energy
                );
              }
              return false; // Remove food
            }
            return true; // Keep food
          });
        });
        
        return newFood;
      });

      // Handle reproduction and death
      let reproductions = 0;
      let deaths = 0;
      
      // Reproduction (easier conditions)
      const reproducingCreatures = newCreatures.filter(
        creature => creature.energy > creature.maxEnergy * 0.7 // Reduced from 0.8 to 0.7
      );
      
      if (reproducingCreatures.length >= 2) {
        for (let i = 0; i < reproducingCreatures.length - 1; i += 2) {
          const parent1 = reproducingCreatures[i];
          const parent2 = reproducingCreatures[i + 1];
          
          const offspring = reproduceCreatures(parent1, parent2, WORLD_WIDTH, WORLD_HEIGHT);
          newCreatures.push(offspring);
          
          // Reduce parent energy less drastically
          const parent1Index = newCreatures.findIndex(c => c.id === parent1.id);
          const parent2Index = newCreatures.findIndex(c => c.id === parent2.id);
          
          if (parent1Index !== -1) {
            newCreatures[parent1Index].energy *= 0.75; // Reduced from 0.6 to 0.75
          }
          if (parent2Index !== -1) {
            newCreatures[parent2Index].energy *= 0.75; // Reduced from 0.6 to 0.75
          }
          
          reproductions++;
        }
      }
      
      // Death from energy depletion or old age (more forgiving)
      newCreatures = newCreatures.filter(creature => {
        const dies = creature.energy <= -10 || creature.age > creature.maxAge * 1.2; // Allow negative energy buffer and extended age
        if (dies) deaths++;
        return !dies;
      });
      
      // Update generation if significant reproduction occurred
      if (reproductions > 0) {
        setGeneration(prev => prev + 1);
      }
      
      setTotalBorn(prev => prev + reproductions);
      setTotalDied(prev => prev + deaths);
      
      return newCreatures;
    });

    // Spawn new food
    setFood(prevFood => {
      if (prevFood.length < MAX_FOOD && Math.random() < FOOD_SPAWN_RATE) {
        const newFoodItem = generateFood(
          `food_${Date.now()}_${Math.random()}`,
          WORLD_WIDTH,
          WORLD_HEIGHT
        );
        return [...prevFood, newFoodItem];
      }
      return prevFood;
    });
  }, []);

  // Animation loop
  useEffect(() => {
    if (isRunning) {
      const animate = () => {
        updateSimulation();
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning, updateSimulation]);

  // Initialize on mount
  useEffect(() => {
    initializeSimulation();
  }, [initializeSimulation]);

  const toggleSimulation = () => {
    setIsRunning(!isRunning);
  };

  const resetSimulation = () => {
    setIsRunning(false);
    initializeSimulation();
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Main simulation area */}
        <div className="flex-1">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold text-emerald-700">
                  Evolution Simulator
                </CardTitle>
                <div className="flex gap-2">
                  <Button onClick={toggleSimulation} variant="outline">
                    {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {isRunning ? 'Pause' : 'Start'}
                  </Button>
                  <Button onClick={resetSimulation} variant="outline">
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div 
                className="relative border-2 border-emerald-200 rounded-lg overflow-hidden bg-gradient-to-br from-green-50 to-blue-50"
                style={{ width: WORLD_WIDTH, height: WORLD_HEIGHT }}
              >
                {/* Render food */}
                {food.map(foodItem => (
                  <Food key={foodItem.id} food={foodItem} />
                ))}
                
                {/* Render creatures */}
                {creatures.map(creature => (
                  <Creature key={creature.id} creature={creature} />
                ))}
                
                {/* Generation indicator */}
                <div className="absolute top-2 left-2 bg-white/80 px-3 py-1 rounded-full text-sm font-semibold text-emerald-700">
                  Generation {generation}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Statistics panel */}
        <div className="lg:w-80">
          <Statistics 
            creatures={creatures}
            generation={generation}
            totalBorn={totalBorn}
            totalDied={totalDied}
            foodCount={food.length}
          />
        </div>
      </div>
    </div>
  );
};

export default EvolutionSimulator;
