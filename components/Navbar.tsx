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
      { label: "2023-2024", href: "/illustration/2023-2024" },
      { label: "2020-2022", href: "/illustration/2020-2022" },
      { label: "2017-2019", href: "/illustration/2017-2019" },
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
  {
    label: "project",
    href: "/project",
    children: [
      { label: "金豬", href: "/project/golden-pig" },
      { label: "《A Spiritual Journey》專輯封面", href: "/project/a-spiritual-journey" },
      { label: "61 NOTE 臺北中山商圈地圖", href: "/project/61-note" },
    ],
  },
  { label: "about", href: "/about" },
];

export default function NavbarHoverDropdown() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openIdx, setOpenIdx] = useState<number | null>(null); // mobile section expand

  return (
    <header className="sticky top-0 md:-top-10 z-50 bg-white opacity-80">
      <nav className="pt-4 md:pt-16 md:pb-6">
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
                              className="block"
                            >
                              <span className="text-nowrap relative inline-block after:absolute after:left-0 after:-bottom-0.25 after:h-0.25 after:w-full after:origin-left after:scale-x-0 after:rounded-full after:bg-black after:transition-transform after:duration-300 hover:after:scale-x-100">
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
            className="inline-flex items-center justify-center p-2 md:hidden"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((s) => !s)}
          >
            {mobileOpen ? (
              <span className="material-symbols-outlined">close</span>
            ) : (
              <span className="material-symbols-outlined">menu</span>
            )}
          </button>
        </div>

        {/* Mobile: drawer (animated like children menus) */}
        <div
          className={
            "md:hidden overflow-hidden transition-[grid-template-rows] duration-200 " +
            (mobileOpen ? "grid grid-rows-[1fr]" : "grid grid-rows-[0fr]")
          }
          aria-hidden={!mobileOpen}
        >
          <div className="min-h-0 py-2">
            <ul className="flex flex-col">
              {NAV.map((item, idx) => {
                const hasKids = !!item.children?.length;
                const expanded = openIdx === idx;
                return (
                  <li key={item.label} className="">
                    <div className="flex items-center">
                      <a
                        href={item.href ?? "#"}
                        className="flex-1 px-3 py-2"
                        onClick={(e) => {
                          if (hasKids) {
                            e.preventDefault();
                            if (!item.href) {
                              setOpenIdx(expanded ? null : idx);
                            }
                          }
                        }}
                      >
                        <span className="relative uppercase text-nowrap text-xl after:absolute after:left-0 after:bottom-0 after:h-0.25 after:w-full after:origin-left after:scale-x-0 after:rounded-full after:bg-black after:transition-transform after:duration-300 hover:after:scale-x-100">
                          {item.label}
                        </span>
                      </a>
                      {hasKids && (
                        <button
                          className="mx-2 inline-grid h-8 w-8 place-items-center rounded-lg cursor-pointer"
                          aria-expanded={expanded}
                          onClick={() => setOpenIdx(expanded ? null : idx)}
                        >
                          <span
                            className={
                              "material-symbols-outlined leading-none transition-transform duration-200 " +
                              (expanded ? "rotate-180" : "")
                            }
                          >
                            expand_more
                          </span>
                        </button>
                      )}
                    </div>

                    {hasKids && (
                      <div
                        className={
                          "overflow-hidden transition-all duration-200 " +
                          (expanded
                            ? "grid grid-rows-[1fr]"
                            : "grid grid-rows-[0fr]")
                        }
                      >
                        <ul
                          className={
                            "min-h-0 space-y-1 px-3 pt-0 " +
                            (expanded ? "pb-2" : "pb-0")
                          }
                        >
                          {item.children!.map((c) => (
                            <li key={c.label}>
                              <a href={c.href} className="block px-3 py-2">
                                <span className="relative inline-block after:absolute after:left-0 after:-bottom-0.25 after:h-0.25 after:w-full after:origin-left after:scale-x-0 after:rounded-full after:bg-black after:transition-transform after:duration-300 hover:after:scale-x-100">
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
