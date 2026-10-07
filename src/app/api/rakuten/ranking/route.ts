import { NextResponse } from 'next/server';

export async function GET() {
  // 替换为您乐天后台对应的实际值
  const appId = '6633c218-2b98-49f7-90f2-b92b3a5cebc9';
  const accessKey = 'pk_1oJBMGwDHMuQ77kuDC11obpf4uQ84INKFM5N14tx75c';

  // 新版 OpenAPI 正确要求的 URL（必须带有 accessKey）
  const targetUrl = `https://openapi.rakuten.co.jp/ichibaranking/api/IchibaItem/Ranking/20220601?format=json&applicationId=${appId}&accessKey=${accessKey}`;

  try {
    const res = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessKey}`,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      },
      cache: 'no-store'
    });

    const data = await res.json();

    // 如果接口返回了错误，把完整的错误详情透传出来，方便调试
    if (!res.ok || data.error) {
      return NextResponse.json(
        { error: JSON.stringify(data) },
        { status: res.status || 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: `服务器请求异常: ${error.message}` },
      { status: 500 }
    );
  }
}
