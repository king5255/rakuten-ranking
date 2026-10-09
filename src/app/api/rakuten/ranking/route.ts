import { NextResponse } from 'next/server';

export async function GET() {
  // 最新のアプリケーションクレデンシャル
  const appId = 'f4758851-e1cf-4872-a996-cd5f7046b19b';
  const accessKey = 'pk_iXQR2KJxHLiv8jXTo5I136cEJzxxo0bVhnr4MQslRU';

  // 楽天 Open API ランキング API エンドポイント
  const targetUrl = `https://openapi.rakuten.co.jp/ichibaranking/api/IchibaItem/Ranking/20220601?format=json&applicationId=${appId}&accessKey=${accessKey}`;

  try {
    const res = await fetch(targetUrl, {
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
      const errMsg = data.error_description || data.error || `HTTP ${res.status}`;
      return NextResponse.json(
        { error: `楽天 API エラー: ${errMsg}` },
        { status: res.status || 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: `サーバーリクエスト例外: ${error.message || '不明なエラー'}` },
      { status: 500 }
    );
  }
}
