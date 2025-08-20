import { useData } from "vike-react/useData";
import { Data } from "./+data";

export default function Page() {
  const data = useData<Data>();
  return (
    <>
      <div key={data.id} className="flex flex-col md:flex-row gap-4">
        <div className="cursor-pointer basis-1/3">
          <img
            src={`https://drive.google.com/thumbnail?id=${data.id}&sz=w768-h768`}
          />
        </div>
        <div className="basis-2/3">
          <p className="font-bold">{data.title_cn}</p>
          <p className="text-sm whitespace-pre-line">{data.subtitle_cn}</p>
          <br />
          <p className="text-sm whitespace-pre-line">{data.desc_cn}</p>
          <br />
          <p className="font-bold">{data.title_en}</p>
          <p className="text-sm whitespace-pre-line">{data.subtitle_en}</p>
          <br />
          <p className="text-sm whitespace-pre-line">{data.desc_en}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {data.images.map(
          (img) =>
            data.id !== img && (
              <img
                key={img}
                src={`https://drive.google.com/thumbnail?id=${img}&sz=w768-h768`}
              />
            )
        )}
      </div>
    </>
  );
}
