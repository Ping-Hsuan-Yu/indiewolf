import { Noto_Serif_TC, Abhaya_Libre } from 'next/font/google'
import localFont from 'next/font/local'

// ponytail: public-site fonts only. Admin fonts moved to app/admin/font.ts so their
// @font-face CSS no longer leaks into public pages (PERF-5).

export const notoSerifTC = Noto_Serif_TC({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '900'],
  variable: '--font-noto-serif-tc',
  display: 'swap',
})

export const abhayaLibre = Abhaya_Libre({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-abhaya',
  display: 'swap',
})

export const gambetta = localFont({
  src: [
    {
      path: '../public/fonts/Gambetta/Gambetta-Variable.woff2',
      weight: '300 700',
      style: 'normal',
    },
    {
      path: '../public/fonts/Gambetta/Gambetta-VariableItalic.woff2',
      weight: '300 700',
      style: 'italic',
    },
  ],
  variable: '--font-gambetta',
  display: 'swap',
})

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
