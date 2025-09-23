'use client';

import LightGallery from 'lightgallery/react';
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-thumbnail.css';

import NavbarHoverDropdown from '@/components/Navbar';
import Footer from '@/components/Footer';
import Main from '@/components/Main';

const items = [
  {
    year: '2023',
    entries: [
      {
        src: '/assets/manga/2023/the-curious-notebook-of-ya/the-curious-notebook-of-ya-00.webp',
        thumb: '/assets/manga/2023/the-curious-notebook-of-ya/the-curious-notebook-of-ya-00-768.webp',
        titleCN: '《鴉的奇形筆記》',
        titleEN: '<The Curious Notebook of Yā>',
        description:
          '<p>關於鴉這個角色，一些生活上的瑣事。透過這些小故事，希望讀者能夠了解鴉所在的世界。</p>\n                    <p>A series of everyday fragments about the character Yā. Through these small stories, I hope readers can glimpse the world Yā inhabits.</p>'
      }
    ]
  },
  {
    year: '2017',
    entries: [
      {
        src: '/assets/zine/2017/zine_2017_son-of-seal.webp',
        thumb: '/assets/zine/2017/zine_2017_son-of-seal-768.webp',
        titleCN: '《席爾之子》',
        titleEN: '<Child of Seer>',
        description:
          '<p>這是第一本長篇漫畫。那時候很著迷跟海有關的事情。主角是一隻海豹人。</p>\n                    <p>This was my first full-length comic. At the time, I was fascinated by the sea. The protagonist is a seal-human hybrid.</p>'
      }
    ]
  }
];

export default function BooksAndZinesPage() {
  return (
    <div className="h-dvh flex flex-col gap-8">
      <NavbarHoverDropdown />
      <Main className="flex flex-col gap-8">
        <LightGallery
          download={false}
          elementClassNames="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4"
          selector=".gallery-item"
        >
          {items.map((group) => (
            <section key={group.year} className="contents">
              <p className="text-lg col-span-full -mb-4" data-lg-ignore="true">
                {group.year}
              </p>
              {group.entries.map((entry) => (
                <GalleryItem key={entry.src} {...entry} />
              ))}
            </section>
          ))}
        </LightGallery>
      </Main>
      <Footer />
    </div>
  );
}

type GalleryItemProps = {
  src: string;
  thumb: string;
  titleCN: string;
  titleEN: string;
  description: string;
};

function GalleryItem({ src, thumb, titleCN, titleEN, description }: GalleryItemProps) {
  return (
    <div className="gallery-item" data-src={src} data-sub-html={description}>
      <div className="shadow">
        <img className="img-responsive" src={thumb} alt={titleEN} />
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
