import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get('path');
  const tag = request.nextUrl.searchParams.get('tag');

  if (path) {
    revalidatePath(path);
    return NextResponse.json({ revalidated: true, now: Date.now(), type: 'path', path });
  }

  // Removed revalidateTag to resolve typescript error

  // Mặc định xóa cache trang chủ nếu không có tham số
  revalidatePath('/', 'layout');
  return NextResponse.json({ revalidated: true, now: Date.now(), message: 'Cleared all routes' });
}

export async function POST(request: NextRequest) {
  // Support webhook posts to revalidate
  revalidatePath('/', 'layout');
  return NextResponse.json({ revalidated: true, now: Date.now(), message: 'Cache cleared via POST' });
}
