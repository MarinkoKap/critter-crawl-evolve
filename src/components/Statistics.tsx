
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreatureType } from './EvolutionSimulator';

interface StatisticsProps {
  creatures: CreatureType[];
  generation: number;
  totalBorn: number;
  totalDied: number;
  foodCount: number;
}

const Statistics: React.FC<StatisticsProps> = ({
  creatures,
  generation,
  totalBorn,
  totalDied,
  foodCount,
}) => {
  // Calculate averages
  const avgSpeed = creatures.length > 0 
    ? creatures.reduce((sum, c) => sum + c.speed, 0) / creatures.length 
    : 0;
    
  const avgSize = creatures.length > 0 
    ? creatures.reduce((sum, c) => sum + c.size, 0) / creatures.length 
    : 0;
    
  const avgVision = creatures.length > 0 
    ? creatures.reduce((sum, c) => sum + c.visionRange, 0) / creatures.length 
    : 0;
    
  const avgEfficiency = creatures.length > 0 
    ? creatures.reduce((sum, c) => sum + c.efficiency, 0) / creatures.length 
    : 0;

  const avgAge = creatures.length > 0 
    ? creatures.reduce((sum, c) => sum + c.age, 0) / creatures.length 
    : 0;

  const avgEnergy = creatures.length > 0 
    ? creatures.reduce((sum, c) => sum + (c.energy / c.maxEnergy) * 100, 0) / creatures.length 
    : 0;

  return (
    <div className="space-y-4">
      {/* Population Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-emerald-700">Population</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Alive:</span>
            <span className="font-semibold">{creatures.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Generation:</span>
            <span className="font-semibold">{generation}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Total Born:</span>
            <span className="font-semibold text-green-600">{totalBorn}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Total Died:</span>
            <span className="font-semibold text-red-600">{totalDied}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Food Available:</span>
            <span className="font-semibold text-emerald-600">{foodCount}</span>
          </div>
        </CardContent>
      </Card>

      {/* Evolution Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-emerald-700">Evolution Traits</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Avg Speed:</span>
              <span className="font-semibold">{avgSpeed.toFixed(2)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (avgSpeed / 3) * 100)}%` }}
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Avg Size:</span>
              <span className="font-semibold">{avgSize.toFixed(1)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div 
                className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (avgSize / 20) * 100)}%` }}
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Avg Vision:</span>
              <span className="font-semibold">{avgVision.toFixed(1)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div 
                className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (avgVision / 50) * 100)}%` }}
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Avg Efficiency:</span>
              <span className="font-semibold">{avgEfficiency.toFixed(2)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, avgEfficiency * 100)}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-emerald-700">Health</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Avg Energy:</span>
              <span className="font-semibold">{avgEnergy.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div 
                className="bg-red-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${avgEnergy}%` }}
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Avg Age:</span>
              <span className="font-semibold">{avgAge.toFixed(0)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div 
                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (avgAge / 1000) * 100)}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Statistics;
