import React, { useEffect, useState } from "react";

import Header from "../../components/Header";
import Main from "../../components/Main";
import Footer from "../../components/Footer";

import { usePageContext } from "vike-react/usePageContext";

import { Data } from "./index/+data";
import { useData } from "vike-react/useData";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { routeParams } = usePageContext();
  const url = routeParams.id;
  const data = useData<Data>();

  return (
    <>
      <Header />
      <Main className="flex flex-col gap-8">
        <ul className="flex flex-col md:flex-row gap-1 md:gap-3 transition-all duration-500 md:hover:gap-4 md:items-center group">
          {data.projectTitle.map((title, index) => (
            <React.Fragment key={title.url}>
              <li>
                <a
                  className={`${
                    url === title.url ? "border-b" : ""
                  } text-nowrap`}
                  href={`/project/${title.url}`}
                >
                  {title.title_cn}
                    <span className="md:hidden! text-sm! material-symbols-outlined">
                      arrow_outward
                  </span>
                </a>
              </li>
              {index < data.projectTitle.length - 1 && (
                <span className="h-0 border-s transition-all duration-300 md:group-hover:h-5"></span>
              )}
            </React.Fragment>
          ))}
        </ul>
        {children}
      </Main>
      <Footer />
    </>
  );
}
