'use client'

import { useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, ChevronDown } from 'lucide-react'

import ToEn from '@/public/assets/toEn.svg'
import ToZh from '@/public/assets/toZh.svg'
import { DEFAULT_APP_LOCALE, isAppLocale } from '@/lib/i18n/config'
import type { NavItem as NavItemType } from '@/app/_actions/public/nav'

import HeaderTitle from './HeaderTitle'

type NavbarProps = {
  navItems: NavItemType[]
}

export default function Navbar({ navItems }: NavbarProps) {
  const t = useTranslations('navbar')
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  const locale = useMemo(() => {
    const [, maybeLocale] = pathname.split('/')
    if (maybeLocale && isAppLocale(maybeLocale)) {
      return maybeLocale
    }
    return DEFAULT_APP_LOCALE
  }, [pathname])

  const withLocale = (href: string) => {
    if (href === '/' || href === '') {
      return `/${locale}`
    }
    return `/${locale}${href}`.replace('//', '/')
  }

  const isExternal = (href?: string) => !!href && /^https?:\/\//.test(href)

  const isActive = (href?: string) => {
    if (!href) return false
    const target = withLocale(href)
    if (target === `/${locale}`) {
      return pathname === target
    }
    return pathname.startsWith(target)
  }

  const getLabel = (item: NavItemType) => {
    // Use the key to lookup translation
    const translated = t(item.key, { default: item.key })
    return translated
  }

  const switchLocale = () => {
    const newLocale = locale === 'zh' ? 'en' : 'zh'
    const pathWithoutLocale = pathname.replace(`/${locale}`, '')
    return `/${newLocale}${pathWithoutLocale}`
  }

  return (
    <header className="font-abhaya-extended sticky top-0 z-50 bg-white opacity-80 md:-top-10">
      <nav className="pt-4 md:pt-16 md:pb-6">
        <div className="flex items-center justify-between">
          <HeaderTitle />

          <ul className="hidden items-center gap-4 md:flex">
            {navItems.map((item) => (
              <li key={item.key} className="group relative">
                {item.href && isExternal(item.href) ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative text-xl text-nowrap uppercase after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:rounded-full after:bg-black after:transition-transform after:duration-300 hover:after:scale-x-100"
                  >
                    {getLabel(item)}
                  </a>
                ) : item.href ? (
                  <Link
                    href={withLocale(item.href)}
                    className={`relative text-xl text-nowrap uppercase after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:rounded-full after:bg-black after:transition-transform after:duration-300 hover:after:scale-x-100 ${
                      isActive(item.href) ? 'after:scale-x-100' : ''
                    }`}
                    aria-haspopup={item.children ? 'menu' : undefined}
                  >
                    {getLabel(item)}
                  </Link>
                ) : (
                  <span className="relative text-xl text-nowrap uppercase after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:rounded-full after:bg-black after:transition-transform after:duration-300 group-hover:after:scale-x-100">
                    {getLabel(item)}
                  </span>
                )}

                {item.children && (
                  <div
                    role="menu"
                    className="pointer-events-none absolute top-full opacity-0 transition duration-150 ease-out group-hover:pointer-events-auto group-hover:opacity-100"
                  >
                    <div className="relative -ms-4 mt-2 min-w-max bg-white ps-4 pe-4 pb-4">
                      <ul className="grid grid-cols-1 gap-2">
                        {item.children.map((child) => (
                          <li key={child.key}>
                            <Link
                              role="menuitem"
                              href={child.href ? withLocale(child.href) : '#'}
                              className="block"
                            >
                              <span className="relative inline-block whitespace-nowrap after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:rounded-full after:bg-black after:transition-transform after:duration-300 hover:after:scale-x-100">
                                {getLabel(child)}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </li>
            ))}
            <li>
              <a
                href={switchLocale()}
                className="flex cursor-pointer items-center transition-opacity hover:opacity-70"
                aria-label={
                  locale === 'zh' ? 'Switch to English' : '切換到中文'
                }
              >
                <Image
                  src={locale === 'zh' ? ToEn : ToZh}
                  alt={locale === 'zh' ? 'Switch to English' : '切換到中文'}
                  className="h-6 w-6"
                />
              </a>
            </li>
          </ul>

          <button
            type="button"
            className="inline-flex items-center justify-center p-2 md:hidden"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((s) => !s)}
          >
            {mobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        <div
          className={`overflow-hidden transition-[grid-template-rows] duration-200 md:hidden ${
            mobileOpen ? 'grid grid-rows-[1fr]' : 'grid grid-rows-[0fr]'
          }`}
          aria-hidden={!mobileOpen}
        >
          <div className="min-h-0 py-2">
            <ul className="flex flex-col">
              {navItems.map((item, idx) => {
                const hasChildren = !!item.children?.length
                const expanded = openIdx === idx
                return (
                  <li key={item.key}>
                    <div className="flex items-center">
                      {item.href && isExternal(item.href) ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 px-3 py-2"
                          onClick={() => setMobileOpen(false)}
                        >
                          <span className="relative text-xl text-nowrap uppercase after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:rounded-full after:bg-black after:transition-transform after:duration-300 hover:after:scale-x-100">
                            {getLabel(item)}
                          </span>
                        </a>
                      ) : item.href ? (
                        <Link
                          href={withLocale(item.href)}
                          className="flex-1 px-3 py-2"
                          onClick={() => setMobileOpen(false)}
                        >
                          <span
                            className={`relative text-xl text-nowrap uppercase after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:rounded-full after:bg-black after:transition-transform after:duration-300 hover:after:scale-x-100 ${
                              isActive(item.href) ? 'after:scale-x-100' : ''
                            }`}
                          >
                            {getLabel(item)}
                          </span>
                        </Link>
                      ) : (
                        <button
                          type="button"
                          className="flex-1 px-3 py-2 text-left"
                          onClick={() => setOpenIdx(expanded ? null : idx)}
                        >
                          <span className="relative text-xl text-nowrap uppercase after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:rounded-full after:bg-black after:transition-transform after:duration-300 hover:after:scale-x-100">
                            {getLabel(item)}
                          </span>
                        </button>
                      )}
                      {hasChildren && (
                        <button
                          type="button"
                          className="mx-2 inline-grid h-8 w-8 place-items-center rounded-lg"
                          aria-expanded={expanded}
                          onClick={() => setOpenIdx(expanded ? null : idx)}
                        >
                          <ChevronDown
                            className={`h-5 w-5 transition-transform duration-200 ${
                              expanded ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                      )}
                    </div>

                    {hasChildren && (
                      <div
                        className={`overflow-hidden transition-all duration-200 ${
                          expanded
                            ? 'grid grid-rows-[1fr]'
                            : 'grid grid-rows-[0fr]'
                        }`}
                      >
                        <ul
                          className={`min-h-0 space-y-1 px-3 pt-0 ${expanded ? 'pb-2' : 'pb-0'}`}
                        >
                          {item.children!.map((child) => (
                            <li key={child.key}>
                              <Link
                                href={child.href ? withLocale(child.href) : '#'}
                                className="block px-3 py-2"
                                onClick={() => {
                                  setMobileOpen(false)
                                  setOpenIdx(null)
                                }}
                              >
                                <span className="relative inline-block after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:rounded-full after:bg-black after:transition-transform after:duration-300 hover:after:scale-x-100">
                                  {getLabel(child)}
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                )
              })}
              <li className="px-3 py-2">
                <a
                  href={switchLocale()}
                  className="inline-flex cursor-pointer items-center gap-2 text-2xl transition-opacity hover:opacity-70"
                  aria-label={
                    locale === 'zh' ? 'Switch to English' : '切換到中文'
                  }
                  onClick={() => setMobileOpen(false)}
                >
                  <Image
                    src={locale === 'zh' ? ToEn : ToZh}
                    alt={locale === 'zh' ? 'Switch to English' : '切換到中文'}
                    className="h-6 w-6"
                  />
                  <span className="text-base">
                    {locale === 'zh' ? 'English' : '中文'}
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  )
}
