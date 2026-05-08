import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const urlParam = searchParams.get('url');

  const host = "alizedanang.net";
  const key = "alize-indexnow-key";
  const keyLocation = "https://alizedanang.net/alize-indexnow-key.txt";

  let urlList = [`https://alizedanang.net/vi/blog`, `https://alizedanang.net/vi/shop`];
  
  if (urlParam) {
    urlList = [urlParam];
  }

  const payload = {
    host,
    key,
    keyLocation,
    urlList
  };

  try {
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload)
    });

    if (response.ok || response.status === 202) {
      return NextResponse.json({ success: true, message: 'Successfully submitted to IndexNow', urlList });
    } else {
      const errorText = await response.text();
      return NextResponse.json({ success: false, message: 'IndexNow submission failed', status: response.status, errorText }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
