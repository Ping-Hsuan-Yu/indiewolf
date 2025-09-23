import { notFound } from 'next/navigation';
import IllustrationGallery from '@/components/gallery/IllustrationGallery';
import { fetchIllustrationGroups } from '@/lib/google';

export const dynamicParams = false;

const YEARS = ['2025', '2023-2024', '2020-2022', '2017-2019'];

export function generateStaticParams() {
  return YEARS.map((year) => ({ year }));
}

export default async function IllustrationYearPage({
  params
}: {
  params: { year: string };
}) {
  const groups = await fetchIllustrationGroups();
  const group = groups.find((item) => item.year === params.year);

  if (!group) {
    notFound();
  }

  return (
    <section className="flex flex-col gap-4">
      <IllustrationGallery group={group} />
    </section>
  );
}
