import LightGallery from "lightgallery/react";

import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-thumbnail.css";

import Zine2017 from "../../assets/zine/2017/zine_2017_son-of-seal.webp";
import Zine2017Thumb from "../../assets/zine/2017/zine_2017_son-of-seal-768.webp";

export default function Page() {
  return (
    <main id="page-content" className="flex flex-col gap-8">
      <LightGallery
        download={false}
        elementClassNames="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4"
        selector=".gallery-item"
      >
        <p className="text-lg col-span-full -mb-4" data-lg-ignore="true">
          2017
        </p>
        <div
          className="gallery-item"
          data-src={Zine2017}
          data-sub-html="<p>這是第一本長篇漫畫。那時候很著迷跟海有關的事情。主角是一隻海豹人。</p>
                    <p>This was my first full-length comic. At the time, I was fascinated by the sea. The protagonist is a seal-human hybrid.</p>"
        >
          <div className="shadow">
            <img className="img-responsive" src={Zine2017Thumb} />
          </div>
          <p
            data-lg-ignore="true"
            className="mt-1 flex flex-col gap-px items-center font-bold"
          >
            <span className="text-sm">《席爾之子》</span>
            <span>{"<Child of Seer>"}</span>
          </p>
        </div>
      </LightGallery>
    </main>
  );
}
