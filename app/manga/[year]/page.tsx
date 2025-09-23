import { notFound } from 'next/navigation';
import MangaGallery from '@/components/gallery/MangaGallery';
import { MANGA_YEARS } from '@/app/manga/data';

export const dynamicParams = false;

const YEARS = MANGA_YEARS.map((entry) => entry.year);

export function generateStaticParams() {
  return YEARS.map((year) => ({ year }));
}

export default function MangaYearPage({ params }: { params: { year: string } }) {
  const yearData = MANGA_YEARS.find((item) => item.year === params.year);

  if (!yearData) {
    notFound();
  }

  return <MangaGallery comics={yearData.comics} />;
}
