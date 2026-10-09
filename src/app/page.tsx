'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  ExternalLink, 
  ShoppingBag, 
  RefreshCw, 
  Layers,
  Armchair,
  Shirt,
  Tv,
  Utensils
} from 'lucide-react';

interface RankingItem {
  rank: number;
  itemName: string;
  itemPrice: number;
  itemUrl: string;
  shopName: string;
  imageUrl: string;
}

const CATEGORIES = [
  { id: '0', name: '全站综合榜', icon: TrendingUp },
  { id: '100804', name: '家居 / 寝具 / 收纳', icon: Armchair },
  { id: '100371', name: '女装 / 时尚服饰', icon: Shirt },
  { id: '562637', name: '家电 / 数码 3C', icon: Tv },
  { id: '100227', name: '食品 / 饮料特产', icon: Utensils },
];

export default function RankingDashboard() {
  const [selectedGenre, setSelectedGenre] = useState('0');
  const [items, setItems] = useState<RankingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFallback, setIsFallback] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [analyzing, setAnalyzing] = useState(false);

  const fetchRanking = async (genreId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/rakuten/ranking?genreId=${genreId}`);
      const data = await res.json();

      setIsFallback(!!data.isFallback);

      if (data.Items && Array.isArray(data.Items)) {
        const formattedItems: RankingItem[] = data.Items.map((entry: any) => {
          const item = entry.Item;
          return {
            rank: item.rank,
            itemName: item.itemName,
            itemPrice: item.itemPrice,
            itemUrl: item.itemUrl,
            shopName: item.shopName || '乐天精选店铺',
            imageUrl: item.imageUrl || item.mediumImageUrls?.[0]?.imageUrl || '',
          };
        });
        setItems(formattedItems);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRanking(selectedGenre);
  }, [selectedGenre]);

  // Gemini AI 深度选品分析
  const handleAiAnalyze = async () => {
    if (items.length === 0) return;
    setAnalyzing(true);
    setAiAnalysis('');

    const currentCategory = CATEGORIES.find(c => c.id === selectedGenre)?.name;
    const topData = items.slice(0, 5).map(i => `${i.rank}. ${i.itemName} | 价格: ¥${i.itemPrice}`).join('\n');

    const prompt = `你是一名资深的日本乐天(Rakuten)跨境电商选品专家。针对【${currentCategory}】分类下的最新爆款榜单数据：\n\n${topData}\n\n请进行详细爆品分析：\n1. 【品类卖点与痛点总结】\n2. 【核心定价策略分析】\n3. 【给中国卖家的选品与改进建议】`;

    try {
      const response = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const resData = await response.json();
      setAiAnalysis(resData.text || '分析完成。');
    } catch (err: any) {
      setAiAnalysis('Gemini AI 分析时遇到问题，请重试。');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex">
      {/* 侧边导航栏：分类选择 */}
      <aside className="w-64 bg-slate-950 border-r border-slate-800 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center font-black text-xl text-white shadow-lg">
              R
            </div>
            <div>
              <h1 className="font-bold text-lg text-white">Ranking AI</h1>
              <p className="text-xs text-slate-400">乐天选品分析系统</p>
            </div>
          </div>

          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">
            榜单类目导航
          </div>

          <nav className="space-y-1">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedGenre === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedGenre(cat.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition ${
                    isActive
                      ? 'bg-red-600/10 text-red-500 border border-red-500/20'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <Icon size={18} /> {cat.name}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="text-xs text-slate-500 border-t border-slate-800 pt-4">
          Rakuten AI Studio v2.0
        </div>
      </aside>

      {/* 主体区域 */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* 顶栏 */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">
              {CATEGORIES.find(c => c.id === selectedGenre)?.name} TOP 实时榜单
            </h2>
            <p className="text-xs text-slate-400 flex items-center gap-2">
              数据源: 日本乐天官方 API 实时分类数据
              {isFallback && <span className="text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded text-[10px]">已开启代理容错加速</span>}
            </p>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={() => fetchRanking(selectedGenre)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm border border-slate-700 transition"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> 刷新
            </button>
            <button 
              onClick={handleAiAnalyze}
              disabled={analyzing || loading}
              className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg text-sm font-medium shadow-lg transition disabled:opacity-50"
            >
              <Sparkles size={16} /> {analyzing ? '分析中...' : 'Gemini AI 智能选品分析'}
            </button>
          </div>
        </div>

        {/* AI 分析面板 */}
        {aiAnalysis && (
          <div className="mb-8 p-6 bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border border-purple-500/30 rounded-2xl shadow-xl">
            <h3 className="text-lg font-bold text-purple-300 mb-3 flex items-center gap-2">
              <Sparkles size={20} /> Gemini 深度选品建议
            </h3>
            <div className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
              {aiAnalysis}
            </div>
          </div>
        )}

        {/* 商品表格 */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <RefreshCw size={32} className="animate-spin mb-4 text-red-500" />
            <p className="text-sm">正在加载选品数据...</p>
          </div>
        ) : (
          <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 uppercase text-xs border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">排名</th>
                  <th className="px-6 py-4">商品图片</th>
                  <th className="px-6 py-4">商品名称</th>
                  <th className="px-6 py-4">价格 (円)</th>
                  <th className="px-6 py-4">店铺</th>
                  <th className="px-6 py-4 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {items.map((item) => (
                  <tr key={item.rank} className="hover:bg-slate-900/50 transition">
                    <td className="px-6 py-4 font-bold text-base text-red-400">
                      #{item.rank}
                    </td>
                    <td className="px-6 py-4">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.itemName} className="w-12 h-12 object-cover rounded-lg border border-slate-700" />
                      ) : (
                        <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center text-slate-500">
                          <ShoppingBag size={20} />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate font-medium text-slate-200" title={item.itemName}>
                      {item.itemName}
                    </td>
                    <td className="px-6 py-4 font-semibold text-emerald-400">
                      ¥{item.itemPrice.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-slate-400 max-w-[150px] truncate">
                      {item.shopName}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <a
                        href={item.itemUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-300 font-medium"
                      >
                        乐天链接 <ExternalLink size={12} />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
