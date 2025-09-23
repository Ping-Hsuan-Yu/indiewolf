import LinkWithTransition from '@/components/LinkWithTransition';
import { fetchProjects } from '@/lib/google';

export const revalidate = 3600;

export default async function ProjectListPage() {
  const data = await fetchProjects();

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {data.project.map((project) => (
        <div key={project.id} className="flex flex-col gap-4 md:flex-row">
          <LinkWithTransition
            href={`/project/${project.url}`}
            className="basis-1/2"
          >
            <img
              src={`https://drive.google.com/thumbnail?id=${project.id}&sz=w768-h768`}
              alt={project.title_en}
            />
          </LinkWithTransition>
          <div className="basis-1/2">
            <p className="font-bold">{project.title_cn}</p>
            <p className="text-sm whitespace-pre-line">{project.subtitle_cn}</p>
            <p className="font-bold">{project.title_en}</p>
            <p className="text-sm whitespace-pre-line">{project.subtitle_en}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
