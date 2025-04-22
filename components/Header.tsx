import { useMemo, useState } from "react";
import { usePageContext } from "vike-react/usePageContext";

export default function Header() {
  const pageContext = usePageContext();
  const { urlPathname } = pageContext;
  const notIndex = useMemo(() => urlPathname.split("/")[1], [urlPathname]);
  const [menuOpen, setMenuOpen] = useState(true);
  return (
    <>
      <header className="pt-16 sticky -top-10 md:hidden">
        <IndieWolf />
      </header>
      <nav className="md:hidden">
        {(!notIndex || !menuOpen) &&
          <ul className={`flex flex-col-reverse gap-2 text-end fixed text-xl uppercase text-nowrap ${notIndex ? "right-8 bottom-20" : "right-4 bottom-32"}`}>
            <NavUl />
          </ul>
        }
        {notIndex &&
          <div
            className="fixed right-8 bottom-8 rounded-full bg-white opacity-80 w-9 h-9 flex justify-center items-center shadow-lg cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <span className="material-symbols-outlined">menu</span> :
              <span className="material-symbols-outlined">close</span>}
          </div>
        }
      </nav>
      {notIndex && <div className="uppercase text-xl text-end sticky top-7 md:hidden">{notIndex}</div>}
      <div className="hidden md:flex justify-between items-end pt-16 pb-8 sticky -top-10">
        <header>
          <IndieWolf />
        </header>
        <nav>
          <ul className="flex flex-row gap-4 text-end text-xl uppercase text-nowrap">
            <NavUl />
          </ul>
        </nav>
      </div>
    </>
  )
}

const NavUl = () => {
  const pageContext = usePageContext();
  const { urlPathname } = pageContext;

  const menuItems = [
    { href: "/illustration", label: "illustration" },
    { href: "/books-and-zines", label: "books & zines" },
    { href: "/manga", label: "manga" },
    { href: "/about", label: "about" },
  ];
  return (
    menuItems.map(({ href, label }) => {
      const isActive = href === "/" ? urlPathname === href : urlPathname.startsWith(href);
      return (
        <li key={href}>
          <a className={isActive ? `border-b` : ""} href={`/indiewolf${href}`}>{label}</a>
        </li>
      )
    })
  )

}

const IndieWolf = () => (
  <div className="uppercase text-2xl font-bold"><a href="/indiewolf">indiewolf</a></div>
)