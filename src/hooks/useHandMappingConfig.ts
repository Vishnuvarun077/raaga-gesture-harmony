import { useState, useCallback } from 'react';

export type HandMappingDirection = 'left-to-right' | 'right-to-left' | 'cyclic';

export interface HandMappingConfig {
  direction: HandMappingDirection;
  leftHandSwaras: string[];
  rightHandSwaras: string[];
}

const DEFAULT_SWARAS = ['Sa', 'Ri', 'Ga', 'Ma', 'Pa', 'Da', 'Ni'];

export const useHandMappingConfig = () => {
  const [config, setConfig] = useState<HandMappingConfig>({
    direction: 'left-to-right',
    leftHandSwaras: ['Sa', 'Ri', 'Ga', 'Ma'],
    rightHandSwaras: ['Pa', 'Da', 'Ni', '']
  });

  const updateDirection = useCallback((direction: HandMappingDirection) => {
    let leftHandSwaras: string[];
    let rightHandSwaras: string[];

    switch (direction) {
      case 'left-to-right':
        leftHandSwaras = ['Sa', 'Ri', 'Ga', 'Ma'];
        rightHandSwaras = ['Pa', 'Da', 'Ni', ''];
        break;
      case 'right-to-left':
        leftHandSwaras = ['', 'Ni', 'Da', 'Pa'];
        rightHandSwaras = ['Ma', 'Ga', 'Ri', 'Sa'];
        break;
      case 'cyclic':
        leftHandSwaras = ['Sa', 'Ri', 'Ga', ''];
        rightHandSwaras = ['Ma', 'Pa', 'Da', 'Ni'];
        break;
      default:
        leftHandSwaras = ['Sa', 'Ri', 'Ga', 'Ma'];
        rightHandSwaras = ['Pa', 'Da', 'Ni', ''];
    }

    setConfig({
      direction,
      leftHandSwaras,
      rightHandSwaras
    });
  }, []);

  const getSwaraForFinger = useCallback((hand: 'left' | 'right', fingerIndex: number): string => {
    const swaras = hand === 'left' ? config.leftHandSwaras : config.rightHandSwaras;
    return swaras[fingerIndex] || '';
  }, [config]);

  return {
    config,
    updateDirection,
    getSwaraForFinger
  };
};