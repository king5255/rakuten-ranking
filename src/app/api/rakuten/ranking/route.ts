import { NextResponse } from 'next/server';

export async function GET() {
  // 使用您最新的 OpenAPI 凭证
  const appId = 'f4758851-e1cf-4872-a996-cd5f7046b19b';
  const accessKey = 'pk_iXQR2KJxHLiv8jXTo5I136cEJzxxo0bVhnr4MQslRU';

  // 1. 对应 OpenAPI UUID 格式的正确域名
  const openApiUrl = `https://openapi.rakuten.co.jp/ichibaranking/api/IchibaItem/Ranking/20220601?format=json&applicationId=${appId}&accessKey=${accessKey}`;

  try {
    const res = await fetch(openApiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessKey}`,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
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
