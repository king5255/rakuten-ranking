import { NextResponse } from 'next/server';

export async function GET() {
  const appId = (process.env.NEXT_PUBLIC_RAKUTEN_APP_ID || '6633c218-2b98-49f7-90f2-b92b3a5cebc9').trim();
  const accessKey = (process.env.NEXT_PUBLIC_RAKUTEN_ACCESS_KEY || 'pk_1oJBMGwDHMuQ77kuDC11obpf4uQ84INKFM5N14tx75c').trim();

  // 乐天排行榜官方 API 最新地址
  const targetUrl = `https://openapi.rakuten.co.jp/ichibaranking/api/IchibaItem/Ranking/20220601?format=json&applicationId=${appId}&accessKey=${accessKey}`;

  try {
    const res = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
      // 避免 Next.js 缓存过久
      next: { revalidate: 300 }
    });

    const data = await res.json();

    if (!res.ok || data.error) {
      return NextResponse.json(
        { error: data.error_description || data.error || '乐天 API 请求失败' },
        { status: res.status || 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || '服务器连接失败' },
      { status: 500 }
    );
  }
}
