import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResponse, Portfolio, RebalanceResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchDividendStrategy = async (): Promise<AnalysisResponse> => {
  const prompt = `
    당신은 세계적인 수준의 배당 투자 전문가입니다. 
    다음 6가지 배당 투자 카테고리를 심층 분석하고, 리스크 프로필에 따른 3가지 최적의 포트폴리오(보수형, 균형형, 공격형)를 제안해 주세요.
    
    모든 응답은 **한국어**로 작성되어야 합니다.

    **분석해야 할 6가지 카테고리:**
    1. 전통 배당 성장 ETF (예: VYM, SCHD, HDV)
    2. 고배당 ETF (예: SPHD, DVY)
    3. 커버드콜 ETF (예: JEPI, JEPQ, QYLD)
    4. 섹터별 배당 ETF (리츠/REITs, 유틸리티, 에너지 등)
    5. 우량 개별 배당주 (배당왕, 배당귀족 등)
    6. 고수익 특수구조 (BDC, MLP, 개별 리츠 등)

    **제안할 3가지 포트폴리오:**
    보수형, 균형형, 공격형 포트폴리오를 구성하고 각 구성 종목의 공식 풀네임을 제공하세요.

    Return ONLY JSON data fitting the schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysis: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  examples: { type: Type.ARRAY, items: { type: Type.STRING } },
                  currentYield: { type: Type.STRING },
                  paymentFrequency: { type: Type.STRING },
                  growthRate5Y: { type: Type.STRING },
                  pros: { type: Type.ARRAY, items: { type: Type.STRING } },
                  cons: { type: Type.ARRAY, items: { type: Type.STRING } },
                  riskLevel: { type: Type.STRING, enum: ['Low', 'Moderate', 'High'] },
                  marketSuitability: { type: Type.STRING },
                  taxEfficiency: { type: Type.STRING },
                  beginnerSuitability: { type: Type.STRING },
                }
              }
            },
            portfolios: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  targetYield: { type: Type.STRING },
                  description: { type: Type.STRING },
                  totalRisk: { type: Type.STRING, enum: ['Low', 'Moderate', 'High'] },
                  holdings: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        ticker: { type: Type.STRING },
                        name: { type: Type.STRING },
                        weight: { type: Type.NUMBER },
                        type: { type: Type.STRING }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    let text = response.text || "";
    if (text.startsWith('```')) {
      text = text.replace(/^```(json)?\s*/, "").replace(/\s*```$/, "");
    }
    return JSON.parse(text) as AnalysisResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("투자 분석 데이터를 생성하는 중 오류가 발생했습니다.");
  }
};

export const fetchRebalanceSuggestion = async (portfolio: Portfolio, targetDate: string): Promise<RebalanceResult> => {
  const prompt = `
    당신은 전문 포트폴리오 매니저입니다. 
    다음 포트폴리오를 분석하고, 지정된 날짜(${targetDate})의 예상 시장 상황을 고려하여 리밸런싱 제안을 해주세요.
    
    포트폴리오 명: ${portfolio.name}
    현재 목표 배당률: ${portfolio.targetYield}
    현재 구성: ${JSON.stringify(portfolio.holdings)}

    **목표:**
    1. 원래의 투자 전략과 목표 배당률을 유지할 것.
    2. 시장 변동성에 대응하여 비중을 조정할 것.
    3. 각 종목에 대해 'Buy', 'Sell', 'Hold' 중 하나의 액션을 제안할 것.
    
    응답은 반드시 **한국어**로 작성하며, JSON 형식으로만 반환하세요.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "리밸런싱 전략 요약" },
            projectedYield: { type: Type.STRING, description: "조정 후 예상 배당률" },
            suggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  ticker: { type: Type.STRING },
                  currentWeight: { type: Type.NUMBER },
                  suggestedWeight: { type: Type.NUMBER },
                  action: { type: Type.STRING, enum: ['Buy', 'Sell', 'Hold'] },
                  reason: { type: Type.STRING, description: "비중 조정 이유 (한국어)" }
                }
              }
            }
          }
        }
      }
    });

    let text = response.text || "";
    if (text.startsWith('```')) {
      text = text.replace(/^```(json)?\s*/, "").replace(/\s*```$/, "");
    }
    return JSON.parse(text) as RebalanceResult;
  } catch (error) {
    console.error("Rebalance API Error:", error);
    throw new Error("리밸런싱 분석 중 오류가 발생했습니다.");
  }
};