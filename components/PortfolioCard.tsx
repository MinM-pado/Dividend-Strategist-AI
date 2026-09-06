import React, { useState } from 'react';
import { Portfolio } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { Shield, Scale, TrendingUp, Info, ExternalLink, MousePointerClick, RefreshCw } from 'lucide-react';
import RebalanceModal from './RebalanceModal';

interface Props {
  portfolio: Portfolio;
}

const COLORS = ['#0ea5e9', '#22c55e', '#eab308', '#f97316', '#8b5cf6', '#ec4899'];

const PortfolioCard: React.FC<Props> = ({ portfolio }) => {
  const [isRebalanceOpen, setIsRebalanceOpen] = useState(false);
  const isType = (keyword: string) => portfolio.name.includes(keyword) || portfolio.id.toLowerCase().includes(keyword);

  const getIcon = () => {
    if (isType('Conservative') || isType('보수')) return <Shield className="text-blue-500" />;
    if (isType('Balanced') || isType('균형')) return <Scale className="text-emerald-500" />;
    if (isType('Aggressive') || isType('공격')) return <TrendingUp className="text-orange-500" />;
    return <Scale />;
  };

  const getBorderColor = () => {
    if (isType('Conservative') || isType('보수')) return 'border-t-blue-500';
    if (isType('Balanced') || isType('균형')) return 'border-t-emerald-500';
    if (isType('Aggressive') || isType('공격')) return 'border-t-orange-500';
    return 'border-t-slate-500';
  }

  const getRiskLabel = (risk: string) => {
    switch(risk) {
        case 'Low': return '안전 지향';
        case 'Moderate': return '중위험 중수익';
        case 'High': return '고위험 고수익';
        default: return risk;
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden flex flex-col h-full border-t-4 ${getBorderColor()}`}>
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
                <div className="p-2 bg-slate-50 rounded-lg">{getIcon()}</div>
                <h3 className="text-xl font-bold text-slate-800 break-keep">{portfolio.name}</h3>
            </div>
            <div className="text-right whitespace-nowrap ml-2">
                <div className="text-2xl font-bold text-slate-800">{portfolio.targetYield}</div>
                <div className="text-xs text-slate-500 uppercase tracking-wide">목표 배당률</div>
            </div>
        </div>
        <p className="text-sm text-slate-600 mt-2 break-keep">{portfolio.description}</p>
      </div>

      <div className="p-6 flex-grow flex flex-col">
        {/* Chart Section */}
        <div className="h-56 w-full mb-6">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={portfolio.holdings}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="weight"
                    >
                        {portfolio.holdings.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <RechartsTooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(value: number) => [`${value}%`, '비중']}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>

        {/* Holdings Table */}
        <div className="flex-grow">
            <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center justify-between">
                <span className="flex items-center gap-1"><Info size={14}/> 자산 배분 전략</span>
            </h4>
            <div className="space-y-3">
                {portfolio.holdings.map((holding, idx) => (
                    <a 
                        key={idx} 
                        href={`https://www.google.com/search?q=${holding.ticker}+stock+ETF`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-stretch justify-between p-3 bg-slate-50 rounded-lg border border-slate-100 hover:bg-blue-50 hover:border-blue-100 transition-all cursor-pointer"
                        title={`${holding.name} 검색하기`}
                    >
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div 
                                className="w-1.5 self-stretch rounded-full flex-shrink-0" 
                                style={{ backgroundColor: COLORS[idx % COLORS.length] }} 
                            />
                            <div className="min-w-0 py-0.5">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-slate-800 group-hover:text-blue-700 transition-colors underline decoration-dotted decoration-slate-300 underline-offset-2">{holding.ticker}</span>
                                    <span className="text-[10px] text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200 whitespace-nowrap group-hover:border-blue-200">{holding.type}</span>
                                </div>
                                <div className="text-xs text-slate-500 truncate group-hover:text-blue-600 transition-colors">{holding.name}</div>
                            </div>
                        </div>
                        <div className="text-right pl-2 flex-shrink-0 flex items-center gap-3">
                            <span className="font-bold text-slate-700 group-hover:text-blue-700">{holding.weight}%</span>
                            <ExternalLink size={14} className="text-slate-300 group-hover:text-blue-400 transition-colors" />
                        </div>
                    </a>
                ))}
            </div>
            
            <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                <MousePointerClick size={12} />
                <span>종목을 클릭하면 상세 정보를 확인할 수 있습니다.</span>
            </div>
        </div>
      </div>
      
      <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 space-y-3">
        <div className="flex items-center justify-center gap-2">
          <span className="text-xs font-medium text-slate-500 uppercase">리스크 성향: </span>
          <span className={`text-xs font-bold px-2 py-1 rounded whitespace-nowrap ${
              portfolio.totalRisk === 'Low' ? 'text-green-700 bg-green-100' : 
              portfolio.totalRisk === 'Moderate' ? 'text-yellow-700 bg-yellow-100' : 
              'text-red-700 bg-red-100'
          }`}>
              {getRiskLabel(portfolio.totalRisk)}
          </span>
        </div>
        
        <button 
          onClick={() => setIsRebalanceOpen(true)}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm"
        >
          <RefreshCw size={16} />
          AI 리밸런싱 제안 받기
        </button>
      </div>

      <RebalanceModal 
        portfolio={portfolio} 
        isOpen={isRebalanceOpen} 
        onClose={() => setIsRebalanceOpen(false)} 
      />
    </div>
  );
};

export default PortfolioCard;