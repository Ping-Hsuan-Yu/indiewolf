import { useMemo } from "react";
import { usePageContext } from "vike-react/usePageContext";

import { useData } from "vike-react/useData";
import { Data } from "./+data";

import Main from "../../../components/Main";

import LightGallery from "lightgallery/react";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-thumbnail.css";

export default function Page() {
  const pageContext = usePageContext();
  const routeParams = pageContext.routeParams.id;
  const data = useData<Data>();

  const currentGroup = useMemo(() => {
    return data.find((group) => group.year === routeParams);
  }, [data, routeParams]);

  // const years = useMemo(
  //   () => data.map((group) => String(group.year)),
  //   [data]
  // );

  return (
    <Main className="flex flex-col gap-4">
      <>
        {/* <ul className="text-lg flex gap-4">
          {years.map((year) => (
            <li key={year}>
              <a
                className={`${routeParams === year ? "border-b" : ""}`}
                href={`/illustration/${year}`}
              >
                {year}
              </a>
            </li>
          ))}
        </ul> */}
        <LightGallery
          download={false}
          elementClassNames="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4"
          selector=".gallery-item"
        >
          {currentGroup?.items.map((item) => (
            <div
              key={item.id}
              className="gallery-item shadow flex items-center justify-center"
              data-src={`https://drive.google.com/thumbnail?id=${item.id}&sz=w2000-h2000`}
            >
              <img className="img-responsive" src={`https://drive.google.com/thumbnail?id=${item.id}&sz=w768-h768`} />
            </div>
          ))}
        </LightGallery>
      </>
    </Main>
  );
}
