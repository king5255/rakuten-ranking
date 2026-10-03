import { NextResponse } from 'next/server';

export async function GET() {
  const appId = (process.env.NEXT_PUBLIC_RAKUTEN_APP_ID || '6633c218-2b98-49f7-90f2-b92b3a5cebc9').trim();
  const accessKey = (process.env.NEXT_PUBLIC_RAKUTEN_ACCESS_KEY || 'pk_1oJBMGwDHMuQ77kuDC11obpf4uQ84INKFM5N14tx75c').trim();

  // 1. 最新官方 OpenAPI Endpoint (需要 accessKey 传参或 Header 鉴权)
  const openApiUrl = `https://openapi.rakuten.co.jp/ichibaranking/api/IchibaItem/Ranking/20220601?format=json&applicationId=${appId}&accessKey=${accessKey}`;
  
  // 2. 经典 Endpoint (无需 accessKey)
  const legacyUrl = `https://app.rakuten.co.jp/services/api/IchibaItem/Ranking/20220601?format=json&applicationId=${appId}`;

  try {
    // 方案 A：尝试请求最新 OpenAPI，携带 Bearer Authorization 标头
    let res = await fetch(openApiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessKey}`,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
      },
      next: { revalidate: 300 }
    });

    // 方案 B：如果 OpenAPI 返回 403 / 401 等错误，退回请求经典接口
    if (!res.ok) {
      console.warn(`OpenAPI 返回状态码 ${res.status}，尝试切换至经典 Endpoint...`);
      res = await fetch(legacyUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json',
        },
        next: { revalidate: 300 }
      });
    }

    const data = await res.json();

    if (!res.ok || data.error) {
      const errMsg = data.error_description || data.error || `HTTP 错误 ${res.status}`;
      return NextResponse.json(
        { error: `乐天 API 提示: ${errMsg}` },
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
