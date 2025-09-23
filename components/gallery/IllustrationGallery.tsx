'use client';

import LightGallery from 'lightgallery/react';
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-thumbnail.css';

import type { GalleryGroup } from '@/lib/google';

type IllustrationGalleryProps = {
  group: GalleryGroup;
};

export default function IllustrationGallery({ group }: IllustrationGalleryProps) {
  return (
    <LightGallery
      download={false}
      elementClassNames="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4"
      selector=".gallery-item"
    >
      {group.items.map((item) => (
        <div
          key={item.id}
          className="gallery-item shadow flex items-center justify-center"
          data-src={`https://drive.google.com/thumbnail?id=${item.id}&sz=w2000-h2000`}
        >
          <img
            className="img-responsive"
            src={`https://drive.google.com/thumbnail?id=${item.id}&sz=w768-h768`}
            alt={group.year}
          />
        </div>
      ))}
    </LightGallery>
  );
}
