import { Chocolate_Classical_Sans, Noto_Sans } from 'next/font/google'

// ponytail: admin-only fonts live in their own module so importing them does NOT
// pull their @font-face CSS into the public bundle (PERF-5 / L3-L4 leak fix).

export const chocolateClassicalSans = Chocolate_Classical_Sans({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-chocolate',
  display: 'swap',
})

export const notoSans = Noto_Sans({
  subsets: ['latin'],
  weight: 'variable',
  variable: '--font-noto-sans',
  display: 'swap',
})
