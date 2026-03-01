export interface Participant {
  id: string;
  name: string;
  age: number;
  gender: "boy" | "girl";
  image_url?: string;
  active: boolean;
}

export interface MatchProbability {
  partnerId: string;
  partnerName: string;
  probability: number;
}

export interface ProbabilityData {
  totalScenarios: number;
  calculationTime: string;
  boysView: Record<string, { name: string; matches: MatchProbability[] }>;
  girlsView: Record<string, { name: string; matches: MatchProbability[] }>;
}
