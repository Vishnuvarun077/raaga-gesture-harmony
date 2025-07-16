// Carnatic Music Data Structures

export interface Swarasthana {
  ratio: number;
}

export interface Raga {
  name: string;
  swaras: string[];
  description?: string;
}

export interface Tala {
  beats: number;
  pattern: number[];
  name: string;
}

// Swarasthanas for frequency calculation
export const swarasthanas: Record<string, Swarasthana> = {
  "Sa": { ratio: 1 },
  "Ri1": { ratio: 16/15 },
  "Ri2": { ratio: 9/8 },
  "Ri3": { ratio: 6/5 },
  "Ga1": { ratio: 9/8 },
  "Ga2": { ratio: 6/5 },
  "Ga3": { ratio: 5/4 },
  "Ma1": { ratio: 4/3 },
  "Ma2": { ratio: 45/32 },
  "Pa": { ratio: 3/2 },
  "Da1": { ratio: 8/5 },
  "Da2": { ratio: 5/3 },
  "Da3": { ratio: 9/5 },
  "Ni1": { ratio: 5/3 },
  "Ni2": { ratio: 9/5 },
  "Ni3": { ratio: 15/8 }
};

// Ragas with their precise swaras
export const ragas: Record<string, Raga> = {
  mayamalavagowla: {
    name: "Mayamalavagowla",
    swaras: ["Sa", "Ri1", "Ga3", "Ma1", "Pa", "Da1", "Ni3"],
    description: "The first melakarta raga, foundational in Carnatic music"
  },
  shankarabharanam: {
    name: "Shankarabharanam",
    swaras: ["Sa", "Ri2", "Ga3", "Ma1", "Pa", "Da2", "Ni3"],
    description: "Equivalent to the major scale in Western music"
  },
  kalyani: {
    name: "Kalyani",
    swaras: ["Sa", "Ri2", "Ga3", "Ma2", "Pa", "Da2", "Ni3"],
    description: "A bright, uplifting raga often used in devotional music"
  },
  kharaharapriya: {
    name: "Kharaharapriya",
    swaras: ["Sa", "Ri2", "Ga2", "Ma1", "Pa", "Da2", "Ni2"],
    description: "Equivalent to the natural minor scale"
  },
  mohanam: {
    name: "Mohanam",
    swaras: ["Sa", "Ri2", "Ga3", "Pa", "Da2"],
    description: "A pentatonic raga, simple yet beautiful"
  },
  hindolam: {
    name: "Hindolam",
    swaras: ["Sa", "Ga2", "Ma1", "Da1", "Ni2"],
    description: "An evening raga with a mysterious, contemplative mood"
  }
};

// Talas (rhythm patterns)
export const talas: Record<string, Tala> = {
  adi: {
    name: "Adi Tala",
    beats: 8,
    pattern: [1, 0, 1, 0, 1, 1, 0, 1]
  },
  rupaka: {
    name: "Rupaka Tala",
    beats: 6,
    pattern: [1, 0, 1, 1, 0, 1]
  },
  triputa: {
    name: "Triputa Tala",
    beats: 7,
    pattern: [1, 0, 0, 1, 0, 1, 0]
  },
  dhruva: {
    name: "Dhruva Tala",
    beats: 14,
    pattern: [1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1]
  }
};

// Base swaras for UI display
export const allBaseSwaras = ["Sa", "Ri", "Ga", "Ma", "Pa", "Da", "Ni"];

// All swaras with variants for checking presence
export const allSwarasWithVariants = [
  "Sa", "Ri1", "Ri2", "Ri3", "Ga1", "Ga2", "Ga3", 
  "Ma1", "Ma2", "Pa", "Da1", "Da2", "Da3", "Ni1", "Ni2", "Ni3"
];

// Helper function to get raga-specific swara variant
export function getRagaSpecificSwara(baseSwara: string, ragaSwaras: string[]): string {
  const variantChecks: Record<string, string[]> = {
    "Ri": ["Ri1", "Ri2", "Ri3"],
    "Ga": ["Ga1", "Ga2", "Ga3"],
    "Ma": ["Ma1", "Ma2"],
    "Da": ["Da1", "Da2", "Da3"],
    "Ni": ["Ni1", "Ni2", "Ni3"]
  };

  const baseKey = baseSwara.slice(0, 2);
  if (variantChecks[baseKey]) {
    for (const variant of variantChecks[baseKey]) {
      if (ragaSwaras.includes(variant)) {
        return variant;
      }
    }
  }
  return baseSwara;
}