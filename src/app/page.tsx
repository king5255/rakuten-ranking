'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  ExternalLink, 
  ShoppingBag, 
  RefreshCw, 
  Layers
} from 'lucide-react';

interface RankingItem {
  rank: number;
  itemName: string;
  itemPrice: number;
  itemUrl: string;
  shopName: string;
  imageUrl: string;
  reviewCount: number;
  reviewAverage: number;
}

export default function RankingDashboard() {
  const [items, setItems] = useState<RankingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [analyzing, setAnalyzing] = useState(false);

  // 获取环境变量并清洗空格
  const rawAppId = process.env.NEXT_PUBLIC_RAKUTEN_APP_ID || '6633c218-2b98-49f7-90f2-b92b3a5cebc9';
  const appId = rawAppId.trim();

  const rawAccessKey = process.env.NEXT_PUBLIC_RAKUTEN_ACCESS_KEY || 'pk_1oJBMGwDHMuQ77kuDC11obpf4uQ84INKFM5N14tx75c';
  const accessKey = rawAccessKey.trim();

  const geminiKey = (process.env.NEXT_PUBLIC_GEMINI_API_KEY || '').trim();

  // 获取乐天实时排行榜数据
  const fetchRanking = async () => {
    setLoading(true);
    setError('');
    try {
      // ✅ 同时传入 applicationId 和 accessKey
      const res = await fetch(
        `https://app.rakuten.co.jp/services/api/IchibaItem/Ranking/20220601?format=json&applicationId=${appId}&accessKey=${accessKey}`
      );
      const data = await res.json();

      if (data.error) {
        throw new Error(data.error_description || data.error || '获取排行榜失败');
      }

      if (data.Items) {
        const formattedItems: RankingItem[] = data.Items.map((entry: any) => {
          const item = entry.Item;
          return {
            rank: item.rank,
            itemName: item.itemName,
            itemPrice: item.itemPrice,
            itemUrl: item.itemUrl,
            shopName: item.shopName,
            imageUrl: item.mediumImageUrls?.[0]?.imageUrl || item.smallImageUrls?.[0]?.imageUrl || '',
            reviewCount: item.reviewCount || 0,
            reviewAverage: item.reviewAverage || 0,
          };
        });
        setItems(formattedItems);
      }
    } catch (err: any) {
      setError(err.message || '网络请求异常');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRanking();
  }, []);

  // 调用 Gemini AI 分析
  const handleAiAnalyze = async () => {
    if (!geminiKey) {
      alert('未配置 Gemini API Key，请在 Vercel 环境变量中设置 NEXT_PUBLIC_GEMINI_API_KEY');
      return;
    }
    if (items.length === 0) return;

    setAnalyzing(true);
    setAiAnalysis('');

    const top10Data = items.slice(0, 10).map(i => `${i.rank}. ${i.itemName} | 价格: ${i.itemPrice}日元 | 店铺: ${i.shopName}`).join('\n');

    const prompt = `你是一名资深的日本乐天(Rakuten)跨境电商选品专家。请根据以下乐天实时 TOP 10 榜单数据，进行爆品趋势分析和选品建议：\n\n${top10Data}\n\n请按以下结构输出简明扼要的中文报告：\n1. 【爆款品类与趋势特征】\n2. 【核心价格带分析】\n3. 【卖家选品与运营避坑建议】`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      );
      const resData = await response.json();
      const text = resData?.candidates?.[0]?.content?.parts?.[0]?.text || '分析结果生成失败，请重试。';
      setAiAnalysis(text);
    } catch (err: any) {
      setAiAnalysis('Gemini AI 分析失败：' + err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex">
      {/* 侧边导航栏 */}
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

          <nav className="space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-red-600/10 text-red-500 rounded-xl font-medium text-sm border border-red-500/20">
              <TrendingUp size={18} /> 实时排行榜
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-900 rounded-xl font-medium text-sm transition">
              <Layers size={18} /> 分类导航
            </button>
          </nav>
        </div>

        <div className="text-xs text-slate-500 border-t border-slate-800 pt-4">
          Rakuten AI Studio v1.0
        </div>
      </aside>

      {/* 主体区域 */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* 顶栏 */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">乐天市场 TOP 实时榜单</h2>
            <p className="text-xs text-slate-400">数据实时对接日本乐天官方 API 接口</p>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={fetchRanking}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm border border-slate-700 transition"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> 刷新榜单
            </button>
            <button 
              onClick={handleAiAnalyze}
              disabled={analyzing || loading}
              className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg text-sm font-medium shadow-lg transition disabled:opacity-50"
            >
              <Sparkles size={16} /> {analyzing ? 'AI 分析中...' : 'Gemini AI 智能选品分析'}
            </button>
          </div>
        </div>

        {/* AI 分析面板 */}
        {aiAnalysis && (
          <div className="mb-8 p-6 bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border border-purple-500/30 rounded-2xl shadow-xl">
            <h3 className="text-lg font-bold text-purple-300 mb-3 flex items-center gap-2">
              <Sparkles size={20} /> Gemini选品深度报告
            </h3>
            <div className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
              {aiAnalysis}
            </div>
          </div>
        )}

        {/* 数据列表 */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <RefreshCw size={32} className="animate-spin mb-4 text-red-500" />
            <p className="text-sm">正在拉取日本乐天实时排行榜数据...</p>
          </div>
        ) : error ? (
          <div className="p-6 bg-red-950/40 border border-red-800/50 rounded-xl text-red-400 text-sm">
            加载错误: {error}
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
                  <th className="px-6 py-4">评价</th>
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
                    <td className="px-6 py-4 text-slate-400">
                      ★ {item.reviewAverage} ({item.reviewCount})
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
