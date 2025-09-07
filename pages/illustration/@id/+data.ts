export { data };
export type Data = Awaited<ReturnType<typeof data>>;

import type { PageContextServer } from "vike/types";

type GalleryItem = {
  id: string;
  img: string;
  imgThumb: string;
};

export type GalleryGroup = {
  year: string;
  items: GalleryItem[];
};

async function data(pageContext: PageContextServer) {
  const res = await fetch(
    "https://script.google.com/macros/s/AKfycbw3lRuHcSr28TmPGIqmEJykTdIyAwVyObirtdgepJ5H55ufOcDZxUrLwFmwyEsB1dwpqQ/exec?page=illustration"
  );
  const data = (await res.json()) as GalleryGroup[];
  return data;
}
