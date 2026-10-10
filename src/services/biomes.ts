import { BiomeConfig, BiomeType } from '../types/game';

export const BIOMES: BiomeConfig[] = [
  {
    type: 'VALLEY_SHADOWS',
    minDist: 0,
    maxDist: 50,
    nameFr: 'La Vallée des Ombres',
    nameEn: 'Valley of Shadows',
    subtitleFr: 'Terre battue et pins millénaires · Le poids initial du destin',
    subtitleEn: 'Compacted loam and ancient pines · The initial weight of fate',
    mistDensity: 0.15,
    lightFactor: 1.0,
    tintRgb: '18, 16, 14'
  },
  {
    type: 'WINDSWEPT_CRAG',
    minDist: 50,
    maxDist: 150,
    nameFr: 'La Crête des Vents',
    nameEn: 'Windswept Crag',
    subtitleFr: 'Bourrasques froides et roche nue · La solitude des hauteurs',
    subtitleEn: 'Cold gales and bare rock · The solitude of heights',
    mistDensity: 0.28,
    lightFactor: 0.88,
    tintRgb: '28, 24, 20'
  },
  {
    type: 'VERGLAS_WALL',
    minDist: 150,
    maxDist: 300,
    nameFr: 'La Paroi de Verglas',
    nameEn: 'Verglas Wall',
    subtitleFr: 'Givre tranchant et abîmes silencieux · L’effort sans témoin',
    subtitleEn: 'Sharp frost and silent abysses · The witnessless effort',
    mistDensity: 0.45,
    lightFactor: 0.76,
    tintRgb: '20, 24, 32'
  },
  {
    type: 'OLYMPUS_ETHER',
    minDist: 300,
    maxDist: Infinity,
    nameFr: 'L’Olympe Illusoire',
    nameEn: 'The Illusory Olympus',
    subtitleFr: 'Nuées d’or et silence divin · Le sommet qui n’existe pas',
    subtitleEn: 'Golden clouds and divine silence · The summit that does not exist',
    mistDensity: 0.60,
    lightFactor: 0.95,
    tintRgb: '36, 30, 20'
  }
];

export function getBiomeForDistance(distance: number): BiomeConfig {
  for (const b of BIOMES) {
    if (distance >= b.minDist && distance < b.maxDist) {
      return b;
    }
  }
  return BIOMES[BIOMES.length - 1];
}
