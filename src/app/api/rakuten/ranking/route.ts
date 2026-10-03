import { NextResponse } from 'next/server';

// 强制写死可用的官方 AppID，不读取环境变量，避免 Vercel 变量污染
const RAKUTEN_APP_ID = '6633c218-2b98-49f7-90f2-b92b3a5cebc9';

export async function GET() {
  const targetUrl = `https://app.rakuten.co.jp/services/api/IchibaItem/Ranking/20220601?format=json&applicationId=${RAKUTEN_APP_ID}`;

  try {
    const res = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
      // 禁用 fetch 缓存，确保每次拿到最新的数据
      cache: 'no-store'
    });

    const data = await res.json();

    if (!res.ok || data.error) {
      const errMsg = data.error_description || data.error || `HTTP 错误 ${res.status}`;
      return NextResponse.json(
        { error: `乐天 API 拒绝: ${errMsg}` },
        { status: res.status || 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: `服务器请求异常: ${error.message || '未知错误'}` },
      { status: 500 }
    );
  }
}
