export interface InvestmentAnalysisItem {
  category: string;
  examples: string[];
  currentYield: string;
  paymentFrequency: string;
  growthRate5Y: string;
  pros: string[];
  cons: string[];
  riskLevel: 'Low' | 'Moderate' | 'High';
  marketSuitability: string;
  taxEfficiency: string;
  beginnerSuitability: string;
}

export interface PortfolioHolding {
  ticker: string;
  name: string;
  weight: number;
  type: string;
}

export interface Portfolio {
  id: string;
  name: string;
  targetYield: string;
  description: string;
  holdings: PortfolioHolding[];
  totalRisk: 'Low' | 'Moderate' | 'High';
}

export interface AnalysisResponse {
  analysis: InvestmentAnalysisItem[];
  portfolios: Portfolio[];
}

export interface RebalanceSuggestion {
  ticker: string;
  currentWeight: number;
  suggestedWeight: number;
  action: 'Buy' | 'Sell' | 'Hold';
  reason: string;
}

export interface RebalanceResult {
  summary: string;
  suggestions: RebalanceSuggestion[];
  projectedYield: string;
}