import React from 'react';

export const metadata = {
  title: 'Rakuten Ranking AI',
  description: '乐天排行榜 AI 选品分析系统',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>{children}</body>
    </html>
  );
}
