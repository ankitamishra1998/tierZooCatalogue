export interface Build {
  id: string;
  mapId: string;
  containerId: string;
  countryCode: string;
  name: string;
  intelligence: number;
  power: number;
  defense: number;
  mobility: number;
  health: number;
  stealth: number;
  tier: string;
  location: string;
  facts: string[];
  image: string;
}
