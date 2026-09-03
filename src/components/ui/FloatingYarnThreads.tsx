// ============================================================================
// 3. components/ui/FloatingYarnThreads.tsx
// ============================================================================
import React from 'react';
import { FloatingYarnProps } from '@/types';

export const FloatingYarnThreads: React.FC<FloatingYarnProps> = ({ side, color }) => {
  return (
    <div 
      aria-hidden="true" 
      className={`fixed top-0 ${side === 'left' ? 'left-0' : 'right-0'} w-24 md:w-36 h-full pointer-events-none z-30 overflow-hidden select-none opacity-40 mix-blend-multiply`}
    >
      <svg 
        className="w-full h-[200vh] -translate-y-1/4 animate-pulse duration-[8000ms]" 
        viewBox="0 0 100 1000" 
        preserveAspectRatio="none"
      >
        <path 
          d={
            side === 'left'
              ? 'M 10,0 Q 80,250 15,500 T 70,750 T 20,1000'
              : 'M 90,0 Q 20,250 85,500 T 30,750 T 80,1000'
          } 
          fill="none" 
          stroke={color} 
          strokeWidth="3.5" 
          strokeDasharray="6 3"
          strokeLinecap="round"
          className="transition-all duration-1000"
        />
        <path 
          d={
            side === 'left'
              ? 'M 30,0 Q 95,200 40,450 T 90,700 T 10,1000'
              : 'M 70,0 Q 5,200 60,450 T 10,700 T 90,1000'
          } 
          fill="none" 
          stroke="#D4A373" 
          strokeWidth="1.5" 
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};