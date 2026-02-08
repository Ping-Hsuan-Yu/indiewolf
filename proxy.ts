import { NextResponse } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { updateSession } from '@/utils/supabase/middleware'

// 目前沒有登入需求：移除 auth 依賴，僅處理 i18n 路由
const PUBLIC_LOCALE_PATHS = ['/admin', '/profile', '/auth', '/api']

const handleI18nRouting = createIntlMiddleware({
  locales: ['zh', 'en'],
  defaultLocale: 'zh',
  localePrefix: 'always'
})

export default async function proxy(req: Request & { nextUrl: URL }) {
  // 1. 初始化 response
  let response = NextResponse.next()
  const pathname = (req as any).nextUrl.pathname as string
  const shouldHandleLocale = !PUBLIC_LOCALE_PATHS.some(route => pathname.startsWith(route))

  if (shouldHandleLocale) {
    response = handleI18nRouting(req as any)
  }

  // 2. 更新 Supabase Session (這會處理 Token 刷新)
  // 注意：我們必須傳入 response，讓 Supabase 能在上面寫入 cookies
  const user = await updateSession(req as any, response)

  // 3. 保護 Admin 路由
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|assets/).*)']
}
