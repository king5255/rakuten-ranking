import { NextResponse } from 'next/server';

export async function GET() {
  // 强制确保拿到非空的 AppId
  const appId = (process.env.NEXT_PUBLIC_RAKUTEN_APP_ID || '').trim() || '6633c218-2b98-49f7-90f2-b92b3a5cebc9';

  const targetUrl = `https://app.rakuten.co.jp/services/api/IchibaItem/Ranking/20220601?format=json&applicationId=${encodeURIComponent(appId)}`;

  try {
    const res = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
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
