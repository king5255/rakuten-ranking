    'use client';

import React, { useState, useEffect } from 'react';

interface RankingItem {
  itemName: string;
  itemUrl: string;
  itemPrice: number;
  mediumImageUrls: { imageUrl: string }[];
  rank: number;
  catchcopy?: string;
  shopName?: string;
}

export default function Home() {
  const [items, setItems] = useState<RankingItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRanking = async () => {
    setLoading(true);
    setError(null);
    try {
      // 关键改进：直接请求我们自己后端的 API 代理路由，彻底避免跨域和 AppID 缺失问题
      const response = await fetch('/api/rakuten/ranking');
      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || '获取实时榜单失败');
      }

      if (data.Items && Array.isArray(data.Items)) {
        const parsedItems = data.Items.map((itemObj: any) => itemObj.Item);
        setItems(parsedItems);
      } else {
        setItems([]);
      }
    } catch (err: any) {
      setError(err.message || '网络请求错误');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRanking();
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white flex flex-col font-sans">
      {/* 顶栏 Header */}
      <header className="border-b border-gray-800 bg-[#0f172a] px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center font-bold text-xl shadow-lg shadow-red-900/30">
            R
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Ranking AI
            </h1>
            <p className="text-xs text-gray-400">乐天选品分析系统</p>
          </div>
        </div>
      </header>

      {/* 主体布局 Container */}
      <div className="flex flex-1 overflow-hidden">
        {/* 左侧导航栏 Sidebar */}
        <aside className="w-64 border-r border-gray-800/80 bg-[#0b0f19] p-4 flex flex-col justify-between hidden md:flex">
          <nav className="space-y-1">
            <button className="w-full text-left px-4 py-3 rounded-xl bg-gradient-to-r from-red-950/40 to-transparent border border-red-500/30 text-red-400 font-medium flex items-center gap-3 shadow-inner">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              实时排行榜
            </button>
          </nav>
        </aside>

        {/* 右侧主内容区 Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* 页头标题区 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-800">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  楽天市場 TOP 实时榜单
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  数据实时对接日本乐天官方 API 接口
                </p>
              </div>

              <button
                onClick={fetchRanking}
                disabled={loading}
                className="px-4 py-2.5 bg-gray-800/80 hover:bg-gray-700/80 text-gray-200 text-sm font-medium rounded-xl border border-gray-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {loading ? '更新中...' : '刷新榜单'}
              </button>
            </div>

            {/* 错误信息展示 */}
            {error && (
              <div className="p-4 bg-red-950/40 border border-red-800/60 rounded-xl text-red-300 text-sm flex items-center gap-3">
                <svg className="w-5 h-5 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>加载错误：{error}</span>
              </div>
            )}

            {/* 加载 Skeleton */}
            {loading && items.length === 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-gray-900/40 border border-gray-800 rounded-2xl p-4 animate-pulse space-y-3">
                    <div className="w-full h-48 bg-gray-800 rounded-xl" />
                    <div className="h-4 bg-gray-800 rounded w-3/4" />
                    <div className="h-4 bg-gray-800 rounded w-1/2" />
                  </div>
                ))}
              </div>
            )}

            {/* 商品列表 */}
            {!loading && items.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {items.map((item, index) => {
                  const rank = item.rank || index + 1;
                  const imgUrl = item.mediumImageUrls?.[0]?.imageUrl?.replace('?_ex=128x128', '?_ex=300x300') || '';

                  return (
                    <div
                      key={index}
                      className="group bg-gray-900/50 hover:bg-gray-800/60 border border-gray-800 hover:border-gray-700 rounded-2xl p-4 transition duration-200 flex flex-col justify-between relative overflow-hidden shadow-lg"
                    >
                      {/* 排名 Badge */}
                      <div className={`absolute top-3 left-3 z-10 w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center shadow-md ${
                        rank === 1 ? 'bg-amber-400 text-black' :
                        rank === 2 ? 'bg-gray-300 text-black' :
                        rank === 3 ? 'bg-amber-700 text-white' : 'bg-gray-800 text-gray-300 border border-gray-700'
                      }`}>
                        {rank}
                      </div>

                      <div>
                        {/* 图片 */}
                        <div className="w-full h-48 rounded-xl overflow-hidden bg-black/40 mb-3 flex items-center justify-center relative">
                          {imgUrl ? (
                            <img
                              src={imgUrl}
                              alt={item.itemName}
                              className="w-full h-full object-contain group-hover:scale-105 transition duration-300"
                            />
                          ) : (
                            <span className="text-xs text-gray-600">无图片</span>
                          )}
                        </div>

                        {/* 店铺 & 名称 */}
                        {item.shopName && (
                          <p className="text-xs text-gray-400 mb-1 line-clamp-1">{item.shopName}</p>
                        )}
                        <h3 className="text-sm font-medium text-gray-200 line-clamp-2 leading-snug group-hover:text-white transition">
                          {item.itemName}
                        </h3>
                      </div>

                      {/* 价格 & 链接 */}
                      <div className="mt-4 pt-3 border-t border-gray-800/80 flex items-center justify-between">
                        <div className="text-red-400 font-bold text-lg">
                          ¥{item.itemPrice?.toLocaleString()}
                        </div>
                        <a
                          href={item.itemUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs px-3 py-1.5 bg-gray-800 hover:bg-red-600 text-gray-300 hover:text-white rounded-lg transition"
                        >
                          购买链接
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {!loading && items.length === 0 && !error && (
              <div className="text-center py-12 text-gray-500">
                暂无排行榜数据
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
