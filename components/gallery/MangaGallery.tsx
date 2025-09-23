'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import LightGallery from 'lightgallery/react';
import type { GalleryItem, Comic } from '@/app/manga/data';
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-thumbnail.css';
import type { InitDetail } from 'lightgallery/lg-events';

export default function MangaGallery({ comics }: { comics: Comic[] }) {
  const lightGallery = useRef<any>(null);
  const onInit = useCallback((detail: InitDetail) => {
    if (detail) {
      lightGallery.current = detail.instance;
    }
  }, []);

  const [currentComic, setCurrentComic] = useState<string>('');
  const [pendingOpen, setPendingOpen] = useState<boolean>(false);

  const galleryItems = useMemo<GalleryItem[]>(() => {
    if (!currentComic) return [];
    return (
      comics.find((item) => item.titleEN === currentComic)?.galleryItems ?? []
    );
  }, [comics, currentComic]);

  useEffect(() => {
    if (pendingOpen && galleryItems.length > 0) {
      lightGallery.current?.openGallery();
    }
  }, [galleryItems, pendingOpen]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {comics.map((item) => (
          <div
            key={item.titleEN}
            className="flex flex-col md:flex-row gap-4 md:items-end"
          >
            <button
              type="button"
              className="basis-1/2 cursor-pointer shadow focus:outline-none"
              onClick={() => {
                setCurrentComic(item.titleEN);
                setPendingOpen(true);
              }}
            >
              <img src={item.img} alt={item.titleEN} className="w-full" />
            </button>
            <div className="basis-1/2 text-left">
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
        dynamicEl={galleryItems.map((galleryItem) => ({ src: galleryItem.src }))}
        onAfterClose={() => {
          setPendingOpen(false);
          setCurrentComic('');
        }}
      />
    </>
  );
}
