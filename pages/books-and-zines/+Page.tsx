import LightGallery from "lightgallery/react";

import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-thumbnail.css";

import SonOfSeal from "../../assets/zine/2017/zine_2017_son-of-seal.webp";
import SonOfSealThumb from "../../assets/zine/2017/zine_2017_son-of-seal-768.webp";
import Ya from "../../assets/manga/2023/the-curious-notebook-of-ya/the-curious-notebook-of-ya-00.webp";
import YaThumb from "../../assets/manga/2023/the-curious-notebook-of-ya/the-curious-notebook-of-ya-00-768.webp";
import Main from "../../components/Main";


export default function Page() {
  return (
    <Main className="flex flex-col gap-8">
      <LightGallery
        download={false}
        elementClassNames="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4"
        selector=".gallery-item"
      >
        <p className="text-lg col-span-full -mb-4" data-lg-ignore="true">
          2023
        </p>
        <GalleryItem
        src={Ya}
        thumb={YaThumb}
        titleCN="《鴉的奇形筆記》"
        titleEN="<The Curious Notebook of Yā>"
        subHtml="<p>關於鴉這個角色，一些生活上的瑣事。透過這些小故事，希望讀者能夠了解鴉所在的世界。</p>
                    <p>A series of everyday fragments about the character Yā. Through these small stories, I hope readers can glimpse the world Yā inhabits.</p>"
        />
        <p className="text-lg col-span-full -mb-4" data-lg-ignore="true">
          2017
        </p>
        <GalleryItem
          src={SonOfSeal}
          thumb={SonOfSealThumb}
          titleCN="《席爾之子》"
          titleEN="<Child of Seer>"
          subHtml="<p>這是第一本長篇漫畫。那時候很著迷跟海有關的事情。主角是一隻海豹人。</p>
                    <p>This was my first full-length comic. At the time, I was fascinated by the sea. The protagonist is a seal-human hybrid.</p>"
        />
      </LightGallery>
    </Main>
  );
}

function GalleryItem({
  src,
  thumb,
  titleCN,
  titleEN,
  subHtml,
}: {
  src: string;
  thumb: string;
  titleCN: string;
  titleEN: string;
  subHtml: string;
}) {
  return (
    <div className="gallery-item" data-src={src} data-sub-html={subHtml}>
      <div className="shadow">
        <img className="img-responsive" src={thumb} />
      </div>
      <p
        data-lg-ignore="true"
        className="mt-1 flex flex-col gap-px items-center font-bold"
      >
        <span className="text-sm">{titleCN}</span>
        <span>{titleEN}</span>
      </p>
    </div>
  );
}
