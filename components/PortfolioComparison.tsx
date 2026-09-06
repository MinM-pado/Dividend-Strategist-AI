import React from 'react';
import { Portfolio } from '../types';
import { Shield, Scale, TrendingUp } from 'lucide-react';

interface Props {
  portfolios: Portfolio[];
}

const PortfolioComparison: React.FC<Props> = ({ portfolios }) => {
  // Helper to get top 3 holdings sorted by weight
  const getTopHoldings = (portfolio: Portfolio) => {
    return [...portfolio.holdings]
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 3);
  };

  const getIcon = (name: string) => {
     if (name.includes('보수') || name.includes('Conservative')) return <Shield className="w-5 h-5 text-blue-500" />;
     if (name.includes('균형') || name.includes('Balanced')) return <Scale className="w-5 h-5 text-emerald-500" />;
     if (name.includes('공격') || name.includes('Aggressive')) return <TrendingUp className="w-5 h-5 text-orange-500" />;
     return <Scale className="w-5 h-5" />;
  };

  const getThemeColor = (name: string) => {
     if (name.includes('보수') || name.includes('Conservative')) return 'bg-blue-50 text-blue-700 border-blue-100';
     if (name.includes('균형') || name.includes('Balanced')) return 'bg-emerald-50 text-emerald-700 border-emerald-100';
     if (name.includes('공격') || name.includes('Aggressive')) return 'bg-orange-50 text-orange-700 border-orange-100';
     return 'bg-slate-50 text-slate-700 border-slate-100';
  };

  const getRiskLabel = (risk: string) => {
      switch(risk) {
          case 'Low': return '안전 지향 (Low)';
          case 'Moderate': return '중위험 중수익 (Mod)';
          case 'High': return '고수익 추구 (High)';
          default: return risk;
      }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <h3 className="text-xl font-bold text-slate-800">포트폴리오 핵심 비교</h3>
        <p className="text-sm text-slate-500 mt-1">세 가지 전략의 주요 지표를 비교하여 나에게 가장 적합한 투자안을 선택하세요.</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200">
              <th className="p-4 w-1/5 text-xs font-bold text-slate-500 uppercase tracking-wider">구분</th>
              {portfolios.map((p) => (
                <th key={p.id} className="p-4 w-[26%]">
                  <div className="flex items-center gap-2">
                    {getIcon(p.name)}
                    <span className="font-bold text-slate-800 text-lg break-keep">{p.name.split('(')[0]}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {/* Target Yield */}
            <tr className="hover:bg-slate-50/50 transition-colors">
              <td className="p-4 font-semibold text-slate-700">목표 배당률</td>
              {portfolios.map((p) => (
                <td key={p.id} className="p-4">
                  <span className={`text-xl font-extrabold ${
                    p.name.includes('공격') ? 'text-orange-600' : 
                    p.name.includes('균형') ? 'text-emerald-600' : 'text-blue-600'
                  }`}>
                    {p.targetYield}
                  </span>
                </td>
              ))}
            </tr>

            {/* Risk Level */}
             <tr className="hover:bg-slate-50/50 transition-colors">
              <td className="p-4 font-semibold text-slate-700">리스크 레벨</td>
              {portfolios.map((p) => (
                <td key={p.id} className="p-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                     p.totalRisk === 'Low' ? 'bg-green-100 text-green-700' :
                     p.totalRisk === 'Moderate' ? 'bg-yellow-100 text-yellow-700' :
                     'bg-red-100 text-red-700'
                  }`}>
                    {getRiskLabel(p.totalRisk)}
                  </span>
                </td>
              ))}
            </tr>

            {/* Top Holdings */}
            <tr className="hover:bg-slate-50/50 transition-colors">
              <td className="p-4 font-semibold text-slate-700 align-top py-5">
                TOP 3 비중<br/>
                <span className="text-xs font-normal text-slate-400">포트폴리오 핵심 종목</span>
              </td>
              {portfolios.map((p) => (
                <td key={p.id} className="p-4 align-top py-5">
                  <div className="space-y-2">
                    {getTopHoldings(p).map((h, i) => (
                      <div key={i} className="flex items-center justify-between text-sm bg-slate-50 p-2 rounded border border-slate-100">
                        <span className="font-bold text-slate-700">{h.ticker}</span>
                        <span className="text-slate-500 font-medium">{h.weight}%</span>
                      </div>
                    ))}
                  </div>
                </td>
              ))}
            </tr>

            {/* Strategy Description */}
            <tr className="hover:bg-slate-50/50 transition-colors">
               <td className="p-4 font-semibold text-slate-700 align-top">전략 요약</td>
               {portfolios.map((p) => (
                 <td key={p.id} className="p-4 align-top text-sm text-slate-600 leading-relaxed break-keep">
                   {p.description}
                 </td>
               ))}
            </tr>

             {/* Recommendation Box */}
            <tr className="bg-slate-50/30">
               <td className="p-4 font-semibold text-slate-700 align-middle">추천 투자자</td>
               {portfolios.map((p) => (
                 <td key={p.id} className="p-4">
                    <div className={`text-xs p-3 rounded-lg border font-medium leading-relaxed ${getThemeColor(p.name)}`}>
                        {p.name.includes('보수') && "은퇴 자금 보호 및 잃지 않는 투자를 최우선으로 하는 분"}
                        {p.name.includes('균형') && "적절한 주가 상승과 배당 수익 두 마리 토끼를 잡고 싶은 분"}
                        {p.name.includes('공격') && "단기적인 주가 변동을 감내하며 배당 현금 흐름을 극대화할 분"}
                    </div>
                 </td>
               ))}
            </tr>

          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PortfolioComparison;