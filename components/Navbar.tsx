/**
 * NavbarHoverDropdown
 * - Tailwind-only hover/focus second-level menus on desktop
 * - Click-to-expand on mobile
 * - Accessible-ish (aria-expanded, focus-within keeps menus open)
 * - Edit NAV data to customize
 */

import { useState } from "react";
import HeaderTitle from "./HeaderTitle";

type ChildItem = {
  label: string;
  href: string;
};

type NavItem = {
  label: string;
  href?: string;
  children?: ChildItem[];
};

const NAV: NavItem[] = [
  {
    label: "illustration",
    children: [
      { label: "2025", href: "/illustration/2025" },
      { label: "2024", href: "/illustration/2024" },
      { label: "2023", href: "/illustration/2023" },
    ],
  },
  { label: "books & zines", href: "/books-and-zines" },
  {
    label: "manga",
    children: [
      { label: "2023", href: "/manga/2023" },
      { label: "2019", href: "/manga/2019" },
      { label: "2018", href: "/manga/2018" },
    ],
  },
  { label: "project", href: "/project" },
  { label: "about", href: "/about" },
];

export default function NavbarHoverDropdown() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openIdx, setOpenIdx] = useState<number | null>(null); // mobile section expand

  return (
    <header className="sticky -top-10 z-50 bg-white opacity-80">
      <nav className="pt-4 md:pt-16 pb-6">
        <div className="flex items-center justify-between">
          {/* Brand */}
          <HeaderTitle />

          {/* Desktop: primary */}
          <ul className="hidden items-center gap-4 md:flex">
            {NAV.map((item, idx) => (
              <li key={item.label} className="group relative">
                <a
                  href={item.href ?? "#"}
                  aria-haspopup={item.children ? "menu" : undefined}
                  aria-expanded={undefined}
                >
                  <span className="relative uppercase text-nowrap text-xl after:absolute after:left-0 after:bottom-0 after:h-0.25 after:w-full after:origin-left after:scale-x-0 after:rounded-full after:bg-black after:transition-transform after:duration-300 hover:after:scale-x-100 group-hover:after:scale-x-100">
                    {item.label}
                  </span>
                </a>

                {/* Dropdown (desktop) */}
                {item.children && (
                  <div
                    role="menu"
                    className="pointer-events-none absolute top-full opacity-0 transition duration-150 ease-out group-hover:pointer-events-auto group-hover:opacity-100"
                  >
                    <div className="relative bg-white mt-2 ps-4 pb-4 pe-4 -ms-4">

                      <ul className="grid grid-cols-1 gap-2">
                        {item.children.map((c) => (
                          <li key={c.label}>
                            <a
                              role="menuitem"
                              href={c.href}
                              className="block text-lg"
                            >
                              <span
                                className="relative inline-block after:absolute after:left-0 after:-bottom-0.5 after:h-0.25 after:w-full after:origin-left after:scale-x-0 after:rounded-full after:bg-black after:transition-transform after:duration-300 hover:after:scale-x-100"
                              >
                                {c.label}
                              </span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>

          {/* Mobile: menu button */}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/10 md:hidden"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((s) => !s)}
          >
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              {mobileOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile: drawer */}
        <div className={"md:hidden " + (mobileOpen ? "block" : "hidden")}>
          <div className="border-t border-black/5 py-2">
            <ul className="flex flex-col">
              {NAV.map((item, idx) => {
                const hasKids = !!item.children?.length;
                const expanded = openIdx === idx;
                return (
                  <li key={item.label} className="">
                    <div className="flex items-center justify-between">
                      <a
                        href={item.href ?? "#"}
                        className="flex-1 px-3 py-3 rounded-xl"
                        onClick={(e) => {
                          if (hasKids) e.preventDefault();
                        }}
                      >
                        <span
                          className="relative uppercase text-nowrap text-xl text-gray-800 after:absolute after:left-0 after:bottom-0 after:h-0.25 after:w-full after:origin-left after:scale-x-0 after:rounded-full after:bg-black after:transition-transform after:duration-300 hover:after:scale-x-100"
                        >
                          {item.label}
                        </span>
                      </a>
                      {hasKids && (
                        <button
                          className="mx-2 inline-grid h-8 w-8 place-items-center rounded-lg"
                          aria-expanded={expanded}
                          onClick={() => setOpenIdx(expanded ? null : idx)}
                        >
                          <svg
                            className={
                              "h-4 w-4 transition " +
                              (expanded ? "rotate-180" : "")
                            }
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08z" />
                          </svg>
                        </button>
                      )}
                    </div>

                    {hasKids && (
                      <div
                        className={
                          "overflow-hidden transition-[grid-template-rows] duration-200 " +
                          (expanded
                            ? "grid grid-rows-[1fr]"
                            : "grid grid-rows-[0fr]")
                        }
                      >
                        <ul className="min-h-0 space-y-1 px-3 pb-2 pt-0">
                          {item.children!.map((c) => (
                            <li key={c.label}>
                              <a
                                href={c.href}
                                className="block rounded-xl px-3 py-2 text-sm"
                              >
                                <span
                                  className="relative inline-block text-lg after:absolute after:left-0 after:-bottom-0.5 after:h-0.25 after:w-full after:origin-left after:scale-x-0 after:rounded-full after:bg-black after:transition-transform after:duration-300 hover:after:scale-x-100"
                                >
                                  {c.label}
                                </span>
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
