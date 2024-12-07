import React from 'react';
import { cn } from '../../lib/utils';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex justify-between mb-8">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={index}
          className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center transition-colors',
            currentStep >= index + 1
              ? 'bg-purple-600 text-white'
              : 'bg-gray-200 text-gray-600'
          )}
        >
          {index + 1}
        </div>
      ))}
    </div>
  );
}