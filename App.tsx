import React, { useState, useEffect, useRef } from 'react';
import { fetchDividendStrategy } from './services/geminiService';
import AnalysisTable from './components/AnalysisTable';
import PortfolioCard from './components/PortfolioCard';
import PortfolioComparison from './components/PortfolioComparison';
import { AnalysisResponse } from './types';
import { PieChart, Loader2, BookOpen, Layers, Info, ArrowRightLeft, RefreshCw, ChevronDown, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [data, setData] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const analysisRef = useRef<HTMLElement>(null);
  const portfolioRef = useRef<HTMLElement>(null);
  const comparisonRef = useRef<HTMLElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const loadStrategy = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchDividendStrategy();
      setData(result);
      setLastUpdated(new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }));
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStrategy();
  }, []);

  if (loading && !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white text-slate-600 gap-6 p-4 text-center">
        <div className="relative">
            <div className="absolute inset-0 bg-blue-100 rounded-full blur-2xl animate-pulse"></div>
            <Loader2 className="animate-spin w-16 h-16 text-blue-600 relative z-10" />
        </div>
        <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">포트폴리오 엔진 가동 중</h2>
            <p className="text-slate-500 max-w-xs mx-auto">Gemini AI가 실시간 시장 동향과 배당 데이터를 분석하여 최적의 조합을 찾고 있습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-[60]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="bg-blue-600 p-1.5 rounded-lg shadow-lg shadow-blue-200">
                <PieChart className="w-5 h-5 text-white" />
            </div>
            <div>
                <h1 className="text-lg font-black text-slate-900 tracking-tight leading-none">Dividend<span className="text-blue-600">Strategist</span></h1>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">AI Investment Intelligence</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-1 font-semibold text-sm">
            <button 
              onClick={() => scrollToSection(analysisRef)}
              className="px-4 py-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all flex items-center gap-2"
            >
              <BookOpen size={16}/> 투자 대상 분석
            </button>
            <button 
              onClick={() => scrollToSection(portfolioRef)}
              className="px-4 py-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all flex items-center gap-2"
            >
              <Layers size={16}/> 추천 포트폴리오
            </button>
            <div className="w-px h-4 bg-slate-200 mx-2"></div>
            <button 
              onClick={loadStrategy}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16}/>}
              전략 갱신
            </button>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-white border-b border-slate-200 pt-16 pb-24 md:pt-24 md:pb-32 px-4">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full pointer-events-none">
                <div className="absolute top-10 left-10 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-30"></div>
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-100 rounded-full blur-3xl opacity-30"></div>
            </div>

            <div className="max-w-4xl mx-auto text-center relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold mb-6 animate-bounce">
                    <Sparkles size={14} /> AI 기반 실시간 배당 분석 활성화됨
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-8 tracking-tight break-keep leading-tight">
                    배당으로 완성하는 <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-600">완벽한 현금 흐름 솔루션</span>
                </h2>
                <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto break-keep leading-relaxed">
                    복잡한 ETF와 개별주 분석은 AI에게 맡기세요. <br className="hidden md:block"/>
                    당신의 투자 성향에 맞춘 정교한 포트폴리오를 단 몇 초 만에 생성합니다.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button 
                        onClick={() => scrollToSection(portfolioRef)}
                        className="w-full sm:w-auto px-10 py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                    >
                        추천 포트폴리오 보기 <ChevronDown size={20} />
                    </button>
                    <button 
                        onClick={loadStrategy}
                        className="w-full sm:w-auto px-10 py-4 bg-white text-slate-700 font-bold border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                    >
                        최신 데이터로 분석하기 <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
                
                {lastUpdated && (
                    <div className="mt-8 text-xs font-bold text-slate-400 flex items-center justify-center gap-1.5 uppercase tracking-widest">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        최종 업데이트: {lastUpdated}
                    </div>
                )}
            </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
          
          {/* Market Analysis Section */}
          <section id="analysis-section" ref={analysisRef} className="scroll-mt-24">
            <div className="flex items-center justify-between mb-8">
              <div className="space-y-1">
                <h2 className="text-3xl font-black text-slate-900 flex items-center gap-2">
                   <BookOpen className="text-blue-600" /> 
                   배당 자산 집중 분석
                </h2>
                <p className="text-slate-500 font-medium">현재 시장에서 가장 유망한 6가지 배당 카테고리를 심층 해부합니다.</p>
              </div>
            </div>
            {data && <AnalysisTable data={data.analysis} />}
          </section>

          {/* Portfolios Cards Section */}
          <section id="portfolio-section" ref={portfolioRef} className="scroll-mt-24">
            <div className="flex items-center justify-between mb-8">
               <div className="space-y-1">
                <h2 className="text-3xl font-black text-slate-900 flex items-center gap-2">
                    <Layers className="text-emerald-600" />
                    성향별 최적 포트폴리오
                </h2>
                <p className="text-slate-500 font-medium">당신의 리스크 수용 범위에 맞춘 정교한 자산 배분 전략입니다.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data && data.portfolios.map((portfolio) => (
                <PortfolioCard key={portfolio.id} portfolio={portfolio} />
              ))}
            </div>
          </section>

          {/* Portfolio Comparison Section */}
          <section id="comparison-section" ref={comparisonRef} className="scroll-mt-24">
            <div className="flex items-center justify-between mb-8">
              <div className="space-y-1">
                <h2 className="text-3xl font-black text-slate-900 flex items-center gap-2">
                    <ArrowRightLeft className="text-purple-600" />
                    포트폴리오 상세 비교
                </h2>
                <p className="text-slate-500 font-medium">핵심 지표와 수익성을 한눈에 비교하여 최종 결정을 내리세요.</p>
              </div>
            </div>
            {data && <PortfolioComparison portfolios={data.portfolios} />}
          </section>

          {/* Disclaimer */}
          <footer className="bg-slate-900 rounded-3xl p-8 md:p-12 text-slate-400 mt-24">
              <div className="flex items-center gap-2 text-white mb-6">
                <Info size={20} className="text-blue-400" />
                <h4 className="text-lg font-bold">배당 투자를 위한 전문가 제언 및 유의사항</h4>
              </div>
              <div className="grid md:grid-cols-2 gap-8 text-sm leading-relaxed">
                  <p className="break-keep">
                      Dividend Strategist는 최신 AI 기술을 활용하여 방대한 금융 데이터를 실시간으로 정제합니다. 
                      하지만 모든 투자의 최종 책임은 본인에게 있으며, 시장의 변동성은 과거의 성과를 보장하지 않습니다. 
                      특히 고배당 ETF의 경우 주가 하락 위험과 배당 삭감 가능성을 항상 염두에 두어야 합니다.
                  </p>
                  <p className="break-keep border-l border-slate-700 pl-8">
                      본 서비스에서 제공하는 리밸런싱 제안과 포트폴리오 구성은 일반적인 통계와 예측 모델에 근거한 것이며, 
                      개인의 특수한 재무 상황이나 세금 부담을 완벽히 반영하지 못할 수 있습니다. 
                      실제 매수/매도 전 반드시 금융 전문가와의 상담을 권장합니다.
                  </p>
              </div>
              <div className="mt-12 pt-8 border-t border-slate-800 text-center text-xs opacity-50">
                  © 2024 Dividend Strategist AI. All Rights Reserved. Powered by Gemini 3.0 Flash.
              </div>
          </footer>

        </div>
      </main>

      {/* Mobile Sticky Refresh (Optional) */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
         <button 
           onClick={loadStrategy}
           className="w-14 h-14 bg-slate-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
         >
           <RefreshCw className={loading ? 'animate-spin' : ''} size={24} />
         </button>
      </div>

      {/* Error handling modal */}
      {error && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md text-center border border-red-100 animate-in zoom-in duration-200">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
               <Info className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">분석 오류</h2>
            <p className="text-slate-600 mb-6">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="w-full bg-slate-900 text-white py-3 rounded-2xl hover:bg-slate-800 transition-colors font-bold"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;