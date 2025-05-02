import { usePageContext } from "vike-react/usePageContext";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import LightGallery from "lightgallery/react";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-thumbnail.css";
import { InitDetail } from "lightgallery/lg-events";
import { GalleryItem } from "lightgallery/lg-utils";

import YaCover from "../../../assets/manga/2023/the-curious-notebook-of-ya/the-curious-notebook-of-ya-00-768.webp";
import CanyonCover from "../../../assets/manga/2019/grand-canyon/grand-canyon-1-768.webp";
import WasteCover from "../../../assets/manga/2018/human-waste/human-waste-1-768.webp";
import SlasherCover from "../../../assets/manga/2018/midlife-slasher/midlife-slasher-1-768.webp";
import EvilCover from "../../../assets/manga/2018/the-innocence-of-evil/the-innocence-of-evil-1-768.webp";
import {
  canyonGalleryItems,
  evilGalleryItems,
  slasherGalleryItems,
  wasteGalleryItems,
  yaGalleryItems,
} from "./data";

const manga = [
  {
    year: "2023",
    comics: [
      {
        img: YaCover,
        titleCN: "《鴉的奇形筆記》",
        titleEN: "<The Curious Notebook of Yā>",
        descriptionCN:
          "關於鴉這個角色，一些生活上的瑣事。透過這些小故事，希望讀者能夠了解鴉所在的世界。",
        descriptionEN:
          "A series of everyday fragments about the character Yā. Through these small stories, I hope readers can glimpse the world Yā inhabits.",
        galleryItems: yaGalleryItems,
      },
    ],
  },
  {
    year: "2019",
    comics: [
      {
        img: CanyonCover,
        titleCN: "《大峽谷》",
        titleEN: "<Grand Canyon>",
        descriptionCN:
          "每個人都是一顆星球。這是我在很難過的時候想到的一個故事。",
        descriptionEN:
          "Each person is like a planet. This story came to me during a difficult time.",
        galleryItems: canyonGalleryItems,
      },
    ],
  },
  {
    year: "2018",
    comics: [
      {
        img: WasteCover,
        titleCN: "《人類廢料》",
        titleEN: "<Human Waste>",
        descriptionCN: "廢料處理員領的都是最低薪資。",
        descriptionEN: "Waste management workers are paid minimum wage.",
        galleryItems: wasteGalleryItems,
      },
      {
        img: EvilCover,
        titleCN: "《純真的惡》",
        titleEN: "<The Innocence of Evil>",
        descriptionCN: "我最認真畫的是錢的那一格。我一點都不純真。",
        descriptionEN:
          "The panel where I drew the money — that’s where I was most serious. I am not innocent at all.",
        galleryItems: evilGalleryItems,
      },
      {
        img: SlasherCover,
        titleCN: "《斜槓中年》",
        titleEN: "<Midlife Slasher>",
        descriptionCN: "狙擊槍的型號是：AWP麥格農狙擊槍，有效射程一千公尺。",
        descriptionEN:
          "The sniper rifle featured is an AWP Magnum, with an effective range of 1,000 meters.",
        galleryItems: slasherGalleryItems,
      },
    ],
  },
];

const years = ["2023", "2019", "2018"];

export default function Page() {
  const pageContext = usePageContext();
  const routeParams = pageContext.routeParams.id;
  const currentPage = useMemo(
    () => manga.find((item) => item.year === routeParams),
    [routeParams]
  );

  const lightGallery = useRef<any>(null);
  const onInit = useCallback((detail: InitDetail) => {
    if (detail) {
      lightGallery.current = detail.instance;
    }
  }, []);

  const [currentComic, setCurrentComic] = useState<string>("");
  const [pendingOpen, setPendingOpen] = useState<boolean>(false);
  const galleryItems = useMemo<GalleryItem[]>(
    () =>
      currentPage?.comics.find((item) => item.titleEN === currentComic)
        ?.galleryItems ?? [{ src: "" }],
    [currentComic]
  );
  useEffect(() => {
    if (pendingOpen && galleryItems[0].src !== "") {
      lightGallery.current?.openGallery();
    }
  }, [galleryItems, pendingOpen]);
  return (
    <main id="page-content" className="flex flex-col gap-4">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentPage?.comics.map((item) => (
          <div
            key={item.titleEN}
            className="flex flex-col md:flex-row gap-4 md:items-end"
          >
            <div
              className="cursor-pointer shadow basis-1/2"
              onClick={() => {
                setCurrentComic(item.titleEN);
                setPendingOpen(true);
              }}
            >
              <img src={item.img} />
            </div>
            <div className="basis-1/2">
              <p className="text-sm text-center md:text-start font-bold">
                {item.titleCN}
              </p>
              <p className="text-sm">{item.descriptionCN}</p>
              <p className="text-center md:text-start font-bold">
                {item.titleEN}
              </p>
              <p>{item.descriptionEN}</p>
            </div>
          </div>
        ))}
      </div>
      <LightGallery
        download={false}
        onInit={onInit}
        dynamic
        dynamicEl={galleryItems}
        onAfterClose={() => {
          setPendingOpen(false);
        }}
      />
    </main>
  );
}
