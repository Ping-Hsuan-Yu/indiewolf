import { useData } from "vike-react/useData";
import { Data } from "./+data";

export default function Page() {
  const data = useData<Data>();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {data.project.map((project) => (
        <div key={project.id} className="flex flex-col md:flex-row gap-4">
          <div className="cursor-pointer basis-1/2">
            <a href={`project/${project.url}`}>
              <img
                src={`https://drive.google.com/thumbnail?id=${project.id}&sz=w768-h768`}
              />
            </a>
          </div>
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
