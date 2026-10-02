'use client';

import React, { useState } from 'react';
import { 
  BarChart3, TrendingUp, Sparkles, ShoppingBag, 
  ExternalLink, Filter, LayoutDashboard
} from 'lucide-react';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('全体');
  const [analyzing, setAnalyzing] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);

  // 模拟乐天排行榜数据
  const rankingData = [
    { rank: 1, title: '【公式】楽天1位獲得！超軽便モバイルバッテリー 10000mAh', category: '家電・スマホ', price: '￥2,980', store: 'Gadget Store', rankDiff: '+2', salesEst: '1,200/日' },
    { rank: 2, title: '【総合1位】冷感マスク 50枚入り 不織布', category: '日用品・雑貨', price: '￥1,280', store: 'Healthcare Direct', rankDiff: '0', salesEst: '980/日' },
    { rank: 3, title: 'オーガニック ナッツ 1kg 贅沢4種ミックス', category: '食品・スイーツ', price: '￥1,980', store: 'Food Town', rankDiff: '+5', salesEst: '850/日' },
    { rank: 4, title: '【予約販売】2026年新作 秋物スウェット Oversized Fit', category: 'レディースファッション', price: '￥3,480', store: 'Fashion Hub', rankDiff: '急上昇', salesEst: '720/日' },
  ];

  const handleAiAnalysis = async () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAiReport(`
### 🤖 Gemini AI 乐天排行榜深度洞察

1. **爆款类目趋势**：【家電・スマホ】与【秋物ファッション】在过去 24 小时内展现出极强的上升势头。
2. **定价策略分析**：TOP 5 爆款商品的主流价格带集中在 **￥2,000 - ￥3,500**，且大部分附带“楽天1位”或“公式”关键词标题。
3. **选品建议**：建议关注“急上昇”标签的秋冬服装及季节性数码配件，提前进行库存调配。
      `);
      setAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans">
      {/* 侧边栏 */}
      <div className="w-64 bg-slate-900 text-white p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 text-xl font-bold text-red-500 mb-8">
            <ShoppingBag className="w-7 h-7" />
            <span>樂天 Ranking AI</span>
          </div>
          <nav className="space-y-2">
            <button className="flex items-center gap-3 w-full px-4 py-3 bg-red-600 text-white rounded-lg font-medium">
              <LayoutDashboard className="w-5 h-5" /> 实时榜单监测
            </button>
            <button className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:bg-slate-800 rounded-lg">
              <TrendingUp className="w-5 h-5" /> 飙升品类追踪
            </button>
            <button className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:bg-slate-800 rounded-lg">
              <Sparkles className="w-5 h-5" /> AI 选品建议
            </button>
          </nav>
        </div>
        <div className="text-xs text-slate-500 border-t border-slate-800 pt-4">
          Rakuten AI Studio v1.0
        </div>
      </div>

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            乐天市场 TOP1000 榜单监测
          </h1>
          <button 
            onClick={handleAiAnalysis}
            disabled={analyzing}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-md transition-all"
          >
            <Sparkles className="w-5 h-5" />
            {analyzing ? 'AI 正在分析榜单...' : '生成 Gemini AI 洞察报告'}
          </button>
        </header>

        <main className="p-8 space-y-6">
          {aiReport && (
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-6 shadow-sm">
              <div className="prose max-w-none text-slate-800 whitespace-pre-line">
                {aiReport}
              </div>
            </div>
          )}

          <div className="grid grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-sm text-slate-500">今日监测总商品数</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">1,000 点</div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-sm text-slate-500">新晋榜单商品</span>
              <div className="text-2xl font-bold text-emerald-600 mt-1">+42 点</div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-sm text-slate-500">平均爆款价格</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">￥2,450</div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-sm text-slate-500">榜单更新频率</span>
              <div className="text-2xl font-bold text-indigo-600 mt-1">每 30 分钟</div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <h2 className="font-bold text-slate-900 text-lg">实时排行榜单</h2>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <select 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm"
                >
                  <option value="全体">全体类目</option>
                  <option value="家電・スマホ">家電・スマホ</option>
                  <option value="日用品・雑貨">日用品・雑貨</option>
                  <option value="食品・スイーツ">食品・スイーツ</option>
                  <option value="レディースファッション">レディースファッション</option>
                </select>
              </div>
            </div>

            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase font-medium border-b border-slate-200">
                  <th className="py-3 px-6">排名</th>
                  <th className="py-3 px-6">商品名称</th>
                  <th className="py-3 px-6">类目</th>
                  <th className="py-3 px-6">销售单价</th>
                  <th className="py-3 px-6">排名变动</th>
                  <th className="py-3 px-6">估算日销量</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {rankingData.map((item) => (
                  <tr key={item.rank} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900">#{item.rank}</td>
                    <td className="py-4 px-6 font-medium text-slate-800 flex items-center gap-2">
                      {item.title}
                      <ExternalLink className="w-4 h-4 text-slate-400 hover:text-red-500 cursor-pointer" />
                    </td>
                    <td className="py-4 px-6 text-slate-600">{item.category}</td>
                    <td className="py-4 px-6 font-bold text-slate-900">{item.price}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        item.rankDiff.includes('+') || item.rankDiff === '急上昇' 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {item.rankDiff}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-600">{item.salesEst}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
