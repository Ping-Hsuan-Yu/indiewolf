import { NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';

// 目前沒有登入需求：移除 auth 依賴，僅處理 i18n 路由
const PUBLIC_LOCALE_PATHS = ['/admin', '/profile', '/auth', '/api'];

const handleI18nRouting = createIntlMiddleware({
  locales: ['zh', 'en'],
  defaultLocale: 'zh',
  localePrefix: 'always',
});

export default function middleware(req: Request & { nextUrl: URL }) {
  // 僅處理 i18n，其他直接放行
  const pathname = (req as any).nextUrl.pathname as string;
  const shouldHandleLocale = !PUBLIC_LOCALE_PATHS.some((route) => pathname.startsWith(route));
  if (shouldHandleLocale) {
    return handleI18nRouting(req as any);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|assets/).*)'],
};