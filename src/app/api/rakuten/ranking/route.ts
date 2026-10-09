import { NextResponse } from 'next/server';

// 乐天市场核心分类 ID 映射表
const CATEGORY_MOCK: Record<string, any[]> = {
  // 综合榜 (Top Overall)
  '0': [
    { rank: 1, itemName: "【楽天市場最安値に挑戦】天然水 500ml 48本 飲料水", itemPrice: 2180, shopName: "楽天24", itemUrl: "https://item.rakuten.co.jp/", imageUrl: "https://thumbnail.image.rakuten.co.jp/@0_mall/rakuten24/cabinet/z821/4901085618210.jpg" },
    { rank: 2, itemName: "低反発 姿勢補正クッション 背もたれ 椅子用 腰痛対策", itemPrice: 3980, shopName: "Home Comfort Store", itemUrl: "https://item.rakuten.co.jp/", imageUrl: "https://thumbnail.image.rakuten.co.jp/@0_mall/home/cabinet/cushion.jpg" },
    { rank: 3, itemName: "日傘 完全遮光 100% 軽量 折りたたみ傘 UVカット", itemPrice: 2980, shopName: "Style Shop", itemUrl: "https://item.rakuten.co.jp/", imageUrl: "https://thumbnail.image.rakuten.co.jp/@0_mall/style/cabinet/umbrella.jpg" }
  ],
  // インテリア・寝具・収納 (家居/寝具/收纳 - 100804)
  '100804': [
    { rank: 1, itemName: "人間工学 背もたれクッション 骨盤矯正 チェアクッション", itemPrice: 4280, shopName: "Rakuten Interior", itemUrl: "https://item.rakuten.co.jp/", imageUrl: "https://thumbnail.image.rakuten.co.jp/@0_mall/interior/cabinet/backrest.jpg" },
    { rank: 2, itemName: "高反発マットレス シングル 10cm 三つ折り 折りたたみ", itemPrice: 8980, shopName: "Sleep Labo", itemUrl: "https://item.rakuten.co.jp/", imageUrl: "https://thumbnail.image.rakuten.co.jp/@0_mall/sleep/cabinet/mat.jpg" },
    { rank: 3, itemName: "遮光カーテン 1級 2枚組 形状記憶加工 洗える", itemPrice: 4580, shopName: "Curtain Shop", itemUrl: "https://item.rakuten.co.jp/", imageUrl: "https://thumbnail.image.rakuten.co.jp/@0_mall/curtain/cabinet/1.jpg" }
  ],
  // レディースファッション (女装 - 100371)
  '100371': [
    { rank: 1, itemName: "リネン混 ワンピース レディース ロング丈 体型カバー", itemPrice: 3480, shopName: "Fashion Zone", itemUrl: "https://item.rakuten.co.jp/", imageUrl: "https://thumbnail.image.rakuten.co.jp/@0_mall/fashion/cabinet/dress.jpg" },
    { rank: 2, itemName: "UVカット カーディガン レディース 薄手 サマーニット", itemPrice: 1980, shopName: "Lady Style", itemUrl: "https://item.rakuten.co.jp/", imageUrl: "https://thumbnail.image.rakuten.co.jp/@0_mall/lady/cabinet/cardigan.jpg" }
  ],
  // 家電 (家电 - 562637)
  '562637': [
    { rank: 1, itemName: "サーキュレーター 静音 首振り 省エネ 扇風機", itemPrice: 4980, shopName: "E-Kaden", itemUrl: "https://item.rakuten.co.jp/", imageUrl: "https://thumbnail.image.rakuten.co.jp/@0_mall/kaden/cabinet/fan.jpg" },
    { rank: 2, itemName: "ドライヤー 大風量 マイナスイオン 速乾 1200W", itemPrice: 5980, shopName: "Beauty Tech", itemUrl: "https://item.rakuten.co.jp/", imageUrl: "https://thumbnail.image.rakuten.co.jp/@0_mall/tech/cabinet/dryer.jpg" }
  ]
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const genreId = searchParams.get('genreId') || '0';

  const appId = 'f4758851-e1cf-4872-a996-cd5f7046b19b';
  const accessKey = 'pk_iXQR2KJxHLiv8jXTo5I136cEJzxxo0bVhnr4MQslRU';

  // 构建带类目的请求 URL
  const genreParam = genreId !== '0' ? `&genreId=${genreId}` : '';
  const targetUrl = `https://openapi.rakuten.co.jp/ichibaranking/api/IchibaItem/Ranking/20220601?format=json&applicationId=${appId}&accessKey=${accessKey}${genreParam}`;

  try {
    const res = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessKey}`,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      cache: 'no-store'
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }

    // 遇到 403 / 500 等被拦截时，平滑降级提供可交互的类目数据，保证系统可用
    console.warn(`乐天 API 返回 ${res.status}，已启用备用选品节点 (Genre: ${genreId})`);
    const fallbackItems = CATEGORY_MOCK[genreId] || CATEGORY_MOCK['0'];
    
    return NextResponse.json({
      Items: fallbackItems.map(item => ({ Item: item })),
      isFallback: true
    });

  } catch (error: any) {
    const fallbackItems = CATEGORY_MOCK[genreId] || CATEGORY_MOCK['0'];
    return NextResponse.json({
      Items: fallbackItems.map(item => ({ Item: item })),
      isFallback: true
    });
  }
}
