import React, { useState } from 'react';
import { Portfolio, RebalanceResult } from '../types';
import { fetchRebalanceSuggestion } from '../services/geminiService';
import { X, Calendar, Loader2, ArrowRight, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Props {
  portfolio: Portfolio;
  isOpen: boolean;
  onClose: () => void;
}

const RebalanceModal: React.FC<Props> = ({ portfolio, isOpen, onClose }) => {
  const [targetDate, setTargetDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RebalanceResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRebalance = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRebalanceSuggestion(portfolio, targetDate);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '분석에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-xl font-bold text-slate-900">포트폴리오 리밸런싱 분석</h3>
            <p className="text-sm text-slate-500">{portfolio.name} 기반 전략 조정</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-grow">
          {!result && !loading && (
            <div className="space-y-6 py-4 text-center">
              <div className="bg-blue-50 p-4 rounded-xl inline-block mb-4">
                <Calendar size={48} className="text-blue-500 mx-auto" />
              </div>
              <div>
                <h4 className="font-bold text-lg text-slate-800">분석 기준일을 선택하세요</h4>
                <p className="text-slate-500 text-sm mt-1">해당 날짜의 거시 경제 상황을 고려하여 최적의 비중을 제안합니다.</p>
              </div>
              <input 
                type="date" 
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="block w-full max-w-xs mx-auto p-3 border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-700"
              />
              <button 
                onClick={handleRebalance}
                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
              >
                AI 리밸런싱 분석 시작
              </button>
            </div>
          )}

          {loading && (
            <div className="py-20 text-center space-y-4">
              <Loader2 className="animate-spin w-12 h-12 text-blue-600 mx-auto" />
              <p className="text-slate-600 font-medium">Gemini AI가 시장 데이터를 분석하며<br/>최적의 배당 비율을 계산하고 있습니다...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-start gap-3 text-red-700">
              <AlertCircle className="flex-shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-6">
              <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl">
                <div className="flex items-center gap-2 text-emerald-800 font-bold mb-1">
                  <TrendingUp size={18} />
                  전략적 요약
                </div>
                <p className="text-sm text-emerald-900 leading-relaxed">{result.summary}</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">조정 후 예상 배당률:</span>
                  <span className="text-lg font-black text-emerald-600">{result.projectedYield}</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-blue-500" />
                  상세 조정 제안
                </h4>
                {result.suggestions.map((item, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="font-black text-slate-900 text-lg">{item.ticker}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          item.action === 'Buy' ? 'bg-green-100 text-green-700' :
                          item.action === 'Sell' ? 'bg-red-100 text-red-700' :
                          'bg-slate-200 text-slate-600'
                        }`}>
                          {item.action === 'Buy' ? '매수 추천' : item.action === 'Sell' ? '비중 축소' : '보유 유지'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 font-bold text-sm">
                        <span className="text-slate-400">{item.currentWeight}%</span>
                        <ArrowRight size={14} className="text-slate-300" />
                        <span className="text-blue-600">{item.suggestedWeight}%</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.reason}</p>
                  </div>
                ))}
              </div>
              
              <button 
                onClick={() => setResult(null)}
                className="w-full py-3 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition-colors"
              >
                다른 날짜로 재분석
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RebalanceModal;