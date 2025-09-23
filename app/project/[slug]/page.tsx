import { notFound } from 'next/navigation';
import { fetchProjectDetail, fetchProjects } from '@/lib/google';

export const revalidate = 3600;

export async function generateStaticParams() {
  const data = await fetchProjects();
  return data.project.map((project) => ({ slug: project.url }));
}

export default async function ProjectDetailPage({
  params
}: {
  params: { slug: string };
}) {
  let project;

  try {
    project = await fetchProjectDetail(params.slug);
  } catch (error) {
    notFound();
  }

  if (!project) {
    notFound();
  }

  const additionalImages = project.images.filter((img) => img !== project.id);

  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="basis-1/3">
          <img
            src={`https://drive.google.com/thumbnail?id=${project.id}&sz=w768-h768`}
            alt={project.title_en}
          />
        </div>
        <div className="basis-2/3">
          <p className="font-bold">{project.title_cn}</p>
          <p className="text-sm whitespace-pre-line">{project.subtitle_cn}</p>
          <br />
          <p className="text-sm whitespace-pre-line">{project.desc_cn}</p>
          <br />
          <p className="font-bold">{project.title_en}</p>
          <p className="text-sm whitespace-pre-line">{project.subtitle_en}</p>
          <br />
          <p className="text-sm whitespace-pre-line">{project.desc_en}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {additionalImages.map((img) => (
          <img
            key={img}
            src={`https://drive.google.com/thumbnail?id=${img}&sz=w768-h768`}
            alt={project.title_en}
          />
        ))}
      </div>
    </>
  );
}
