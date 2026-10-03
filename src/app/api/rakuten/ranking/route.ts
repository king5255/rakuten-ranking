import { NextResponse } from 'next/server';

export async function GET() {
  const appId = (process.env.NEXT_PUBLIC_RAKUTEN_APP_ID || '6633c218-2b98-49f7-90f2-b92b3a5cebc9').trim();
  const accessKey = (process.env.NEXT_PUBLIC_RAKUTEN_ACCESS_KEY || 'pk_1oJBMGwDHMuQ77kuDC11obpf4uQ84INKFM5N14tx75c').trim();

  // 尝试乐天标准 endpoint (推荐使用 app.rakuten.co.jp 稳定兼容版)
  const legacyUrl = `https://app.rakuten.co.jp/services/api/IchibaItem/Ranking/20220601?format=json&applicationId=${appId}`;
  
  // 乐天 OpenAPI 端点
  const openApiUrl = `https://openapi.rakuten.co.jp/ichibaranking/api/IchibaItem/Ranking/20220601?format=json&applicationId=${appId}&accessKey=${accessKey}`;

  try {
    // 先尝试调用经典 Endpoint
    let res = await fetch(legacyUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      next: { revalidate: 300 }
    });

    // 如果经典 Endpoint 不可用，尝试 OpenAPI
    if (!res.ok) {
      res = await fetch(openApiUrl, {
        method: 'GET',
        headers: { 
          'User-Agent': 'Mozilla/5.0',
          'Authorization': `Bearer ${accessKey}`
        },
        next: { revalidate: 300 }
      });
    }

    const rawText = await res.text();
    let data;
    try {
      data = JSON.parse(rawText);
    } catch {
      return NextResponse.json(
        { error: `乐天返回了非 JSON 内容: ${rawText.slice(0, 100)}` },
        { status: 500 }
      );
    }

    if (!res.ok || data.error || data.error_description) {
      const errMsg = data.error_description || data.error || data.message || `HTTP状态码 ${res.status}`;
      return NextResponse.json(
        { error: `乐天接口拒绝: ${errMsg}` },
        { status: res.status || 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: `服务器请求失败: ${error.message || '未知错误'}` },
      { status: 500 }
    );
  }
}
