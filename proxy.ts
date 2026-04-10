import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['vi', 'en'];
const defaultLocale = 'vi';

export default function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Kiểm tra xem pathname có chứa locale trong list không 
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Mặc định bỏ qua các file công cộng hoặc API, _next 
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Redirect nếu thiếu locale
  if (pathnameIsMissingLocale) {
    return NextResponse.redirect(
      new URL(`/${defaultLocale}${pathname === '/' ? '' : pathname}`, request.url)
    );
  }
}

export const config = {
  matcher: [
    // Bỏ qua toàn bộ thư mục internal Next.js và thư mục static
    '/((?!api|_next/static|_next/image|images|favicon.ico).*)',
  ],
};
