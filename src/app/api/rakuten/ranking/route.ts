import { NextResponse } from 'next/server';

export async function GET() {
  // 从环境变量获取 appId，若未配置则使用默认的 appId
  const appId = (process.env.NEXT_PUBLIC_RAKUTEN_APP_ID || '6633c218-2b98-49f7-90f2-b92b3a5cebc9').trim();

  // 乐天官方经典稳定版排行榜 API (无需 accessKey)
  const targetUrl = `https://app.rakuten.co.jp/services/api/IchibaItem/Ranking/20220601?format=json&applicationId=${appId}`;

  try {
    const res = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      // 缓存 5 分钟，降低乐天 API 频率限制风险
      next: { revalidate: 300 }
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
