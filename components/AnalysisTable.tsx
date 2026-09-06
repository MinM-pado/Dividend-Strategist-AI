import React from 'react';
import { InvestmentAnalysisItem } from '../types';
import { AlertCircle, CheckCircle, TrendingUp, DollarSign, Activity } from 'lucide-react';

interface Props {
  data: InvestmentAnalysisItem[];
}

const AnalysisTable: React.FC<Props> = ({ data }) => {
  const getRiskLabel = (risk: string) => {
    switch(risk) {
        case 'Low': return '안전';
        case 'Moderate': return '보통';
        case 'High': return '위험';
        default: return risk;
    }
  };

  return (
    <div className="overflow-x-auto pb-6">
      <div className="min-w-[1000px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((item, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center gap-2">
                        <h3 className="font-bold text-lg text-slate-800 break-keep leading-tight">{item.category}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap flex-shrink-0 ${
                            item.riskLevel === 'Low' ? 'bg-green-100 text-green-700' :
                            item.riskLevel === 'Moderate' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                        }`}>
                            위험도: {getRiskLabel(item.riskLevel)}
                        </span>
                    </div>
                    <div className="p-5 space-y-4">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500 flex items-center gap-1"><DollarSign size={14}/> 배당률</span>
                            <span className="font-semibold text-emerald-600">{item.currentYield}</span>
                        </div>
                         <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500 flex items-center gap-1"><Activity size={14}/> 지급 주기</span>
                            <span className="font-medium text-slate-700">{item.paymentFrequency}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500 flex items-center gap-1"><TrendingUp size={14}/> 5년 성장성</span>
                            <span className="font-medium text-slate-700">{item.growthRate5Y}</span>
                        </div>
                        
                        <div className="pt-2">
                             <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">대표 종목 (예시)</p>
                             <div className="flex flex-wrap gap-1">
                                {item.examples.map((ex, i) => (
                                    <span key={i} className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs border border-slate-200">
                                        {ex}
                                    </span>
                                ))}
                             </div>
                        </div>

                        <div className="pt-2 border-t border-slate-100">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs font-semibold text-green-600 mb-1 flex items-center gap-1"><CheckCircle size={12}/> 장점</p>
                                    <ul className="text-xs text-slate-600 list-disc list-inside space-y-1">
                                        {item.pros.slice(0, 2).map((pro, i) => <li key={i} className="break-keep">{pro}</li>)}
                                    </ul>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-red-600 mb-1 flex items-center gap-1"><AlertCircle size={12}/> 단점</p>
                                    <ul className="text-xs text-slate-600 list-disc list-inside space-y-1">
                                        {item.cons.slice(0, 2).map((con, i) => <li key={i} className="break-keep">{con}</li>)}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-blue-50 p-3 rounded-lg mt-2 space-y-2">
                            <p className="text-xs text-blue-800"><span className="font-semibold">시장 특성:</span> {item.marketSuitability}</p>
                            <p className="text-xs text-blue-700"><span className="font-semibold">세금 효율:</span> {item.taxEfficiency}</p>
                            <p className="text-xs text-blue-900"><span className="font-semibold">초보자 적합도:</span> {item.beginnerSuitability}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default AnalysisTable;