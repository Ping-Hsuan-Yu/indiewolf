'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-thumbnail.css';

type MangaEntry = {
  id: string;
  title: string;
  description?: string | null;
  primaryImage?: string | null;
  gallery: Array<{
    src: string;
    alt?: string | null;
  }>;
};

type MangaGalleryProps = {
  entries: MangaEntry[];
  locale: string;
};

export default function MangaGallery({ entries, locale }: MangaGalleryProps) {
  const lightboxRootRef = useRef<HTMLDivElement | null>(null);
  const instanceRef = useRef<any>(null);

  const openEntryGallery = useCallback(
    async (entryId: string) => {
      const entry = entries.find((item) => item.id === entryId);
      if (!entry || entry.gallery.length === 0) return;
      if (!lightboxRootRef.current) return;

      const [{ default: lightGallery }] = await Promise.all([import('lightgallery')]);
      instanceRef.current?.destroy(true);
      instanceRef.current = lightGallery(lightboxRootRef.current, {
        dynamic: true,
        dynamicEl: entry.gallery.map((item) => ({
          src: item.src,
          subHtml: item.alt ?? '',
        })),
        download: false,
      });
      instanceRef.current.openGallery(0);
    },
    [entries],
  );

  useEffect(() => {
    return () => {
      instanceRef.current?.destroy(true);
    };
  }, []);

  if (entries.length === 0) {
    return <p className="text-center text-sm text-gray-500">漫畫內容整理中。</p>;
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {entries.map((item) => (
          <div key={item.id} className="flex flex-col gap-4 md:flex-row md:items-end">
            <button
              type="button"
              className="basis-1/2 cursor-pointer overflow-hidden rounded shadow focus:outline-none"
              onClick={() => openEntryGallery(item.id)}
            >
              {item.primaryImage ? (
                <img src={item.primaryImage} alt={item.title} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full min-h-[280px] w-full items-center justify-center bg-gray-100 text-gray-400">
                  圖片準備中
                </div>
              )}
            </button>
            <div className="basis-1/2">
              <p className={`text-center md:text-start font-bold${locale === 'zh' ? ' text-sm' : ''}`}>
                {item.title}
              </p>
              {item.description && <p className="text-sm">{item.description}</p>}
            </div>
          </div>
        ))}
      </div>
      <div ref={lightboxRootRef} className="hidden" aria-hidden />
    </>
  );
}
