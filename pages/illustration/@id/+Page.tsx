import { usePageContext } from "vike-react/usePageContext";
import { useMemo, useEffect, useState, use } from "react";
import LightGallery from "lightgallery/react";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-thumbnail.css";

type GalleryItem = {
  id: string;
  img: string;
  imgThumb: string;
};

type GalleryGroup = {
  year: number;
  items: GalleryItem[];
};

export default function Page() {
  const pageContext = usePageContext();
  const routeParams = pageContext.routeParams.id;
  const [data, setData] = useState<GalleryGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(
      "https://script.google.com/macros/s/AKfycbw3lRuHcSr28TmPGIqmEJykTdIyAwVyObirtdgepJ5H55ufOcDZxUrLwFmwyEsB1dwpqQ/exec"
    )
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  const currentGroup = useMemo(() => {
    return data.find((group) => String(group.year) === routeParams);
  }, [data, routeParams]);

  useEffect(() => {
    console.log(data)
  },[data])

  const years = useMemo(() => data.map((group) => String(group.year)), [data]);

  return (
    <main id="page-content" className="flex flex-col gap-4">
      {isLoading ? (
        <>
         <div className="animate-pulse bg-gray-200 w-40 h-4 rounded"></div>
         <div className="animate-pulse bg-gray-200 w-full h-screen rounded"></div>
        </>
      ) : (
        <>
          <ul className="text-lg flex gap-4">
            {years.map((year) => (
              <li key={year}>
                <a
                  className={`${routeParams === year ? "border-b" : ""}`}
                  href={`${pageContext.urlOriginal
                    .split("/")
                    .slice(0, -1)
                    .join("/")}/${year}`}
                >
                  {year}
                </a>
              </li>
            ))}
          </ul>
          <LightGallery
            download={false}
            elementClassNames="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4"
            selector=".gallery-item"
          >
            {currentGroup?.items.map((item) => (
              <div
                key={item.id}
                className="gallery-item shadow flex items-center justify-center"
                data-src={item.img}
              >
                <img className="img-responsive" src={item.imgThumb} />
              </div>
            ))}
          </LightGallery>
        </>
      )}
    </main>
  );
}
