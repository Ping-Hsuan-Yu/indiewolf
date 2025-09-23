export type GalleryItem = {
  src: string;
};

export type Comic = {
  img: string;
  titleCN: string;
  titleEN: string;
  descriptionCN: string;
  descriptionEN: string;
  galleryItems: GalleryItem[];
};

export type MangaYear = {
  year: string;
  comics: Comic[];
};

const yaGalleryItems: GalleryItem[] = [
  { src: '/assets/manga/2023/the-curious-notebook-of-ya/the-curious-notebook-of-ya-00.webp' },
  ...Array.from({ length: 62 }, (_, index) => ({
    src: `/assets/manga/2023/the-curious-notebook-of-ya/the-curious-notebook-of-ya-${index + 1}.webp`
  }))
];

const canyonGalleryItems: GalleryItem[] = Array.from({ length: 13 }, (_, index) => ({
  src: `/assets/manga/2019/grand-canyon/grand-canyon-${index + 1}.webp`
}));

const wasteGalleryItems: GalleryItem[] = Array.from({ length: 8 }, (_, index) => ({
  src: `/assets/manga/2018/human-waste/human-waste-${index + 1}.webp`
}));

const slasherGalleryItems: GalleryItem[] = Array.from({ length: 8 }, (_, index) => ({
  src: `/assets/manga/2018/midlife-slasher/midlife-slasher-${index + 1}.webp`
}));

const evilGalleryItems: GalleryItem[] = Array.from({ length: 5 }, (_, index) => ({
  src: `/assets/manga/2018/the-innocence-of-evil/the-innocence-of-evil-${index + 1}.webp`
}));

export const MANGA_YEARS: MangaYear[] = [
  {
    year: '2023',
    comics: [
      {
        img: '/assets/manga/2023/the-curious-notebook-of-ya/the-curious-notebook-of-ya-00-768.webp',
        titleCN: '《鴉的奇形筆記》',
        titleEN: '<The Curious Notebook of Yā>',
        descriptionCN:
          '關於鴉這個角色，一些生活上的瑣事。透過這些小故事，希望讀者能夠了解鴉所在的世界。',
        descriptionEN:
          'A series of everyday fragments about the character Yā. Through these small stories, I hope readers can glimpse the world Yā inhabits.',
        galleryItems: yaGalleryItems
      }
    ]
  },
  {
    year: '2019',
    comics: [
      {
        img: '/assets/manga/2019/grand-canyon/grand-canyon-1-768.webp',
        titleCN: '《大峽谷》',
        titleEN: '<Grand Canyon>',
        descriptionCN: '每個人都是一顆星球。這是我在很難過的時候想到的一個故事。',
        descriptionEN: 'Each person is like a planet. This story came to me during a difficult time.',
        galleryItems: canyonGalleryItems
      }
    ]
  },
  {
    year: '2018',
    comics: [
      {
        img: '/assets/manga/2018/human-waste/human-waste-1-768.webp',
        titleCN: '《人類廢料》',
        titleEN: '<Human Waste>',
        descriptionCN: '廢料處理員領的都是最低薪資。',
        descriptionEN: 'Waste management workers are paid minimum wage.',
        galleryItems: wasteGalleryItems
      },
      {
        img: '/assets/manga/2018/the-innocence-of-evil/the-innocence-of-evil-1-768.webp',
        titleCN: '《純真的惡》',
        titleEN: '<The Innocence of Evil>',
        descriptionCN: '我最認真畫的是錢的那一格。我一點都不純真。',
        descriptionEN:
          'The panel where I drew the money — that’s where I was most serious. I am not innocent at all.',
        galleryItems: evilGalleryItems
      },
      {
        img: '/assets/manga/2018/midlife-slasher/midlife-slasher-1-768.webp',
        titleCN: '《斜槓中年》',
        titleEN: '<Midlife Slasher>',
        descriptionCN: '狙擊槍的型號是：AWP麥格農狙擊槍，有效射程一千公尺。',
        descriptionEN:
          'The sniper rifle featured is an AWP Magnum, with an effective range of 1,000 meters.',
        galleryItems: slasherGalleryItems
      }
    ]
  }
];
