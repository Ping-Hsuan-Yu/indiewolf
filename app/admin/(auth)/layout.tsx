import { notoSans, chocolateClassicalSans } from '@/app/font'

import '../globals.css'

export const metadata = {
  title: 'LinChaoYu 後台管理',
  description: 'LinChaoYu 後台管理',
  icons: {
    icon: '/assets/logo.svg'
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='zh-TW' className={`${notoSans.variable} ${chocolateClassicalSans.variable}`}>
      <body>{children}</body>
    </html>
  )
}
