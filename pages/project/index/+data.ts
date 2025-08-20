export { data };
export type Data = Awaited<ReturnType<typeof data>>;

type Project = {
  id: string;
  title_cn: string;
  subtitle_cn: string;
  title_en: string;
  subtitle_en: string;
  url: string;
};

export type ProjectTitle = {
  title_cn: string;
  url: string;
};

type ProjectData = {
  project:Project[]
  projectTitle:ProjectTitle[]
}

async function data() {
  const res = await fetch(
    "https://script.google.com/macros/s/AKfycbw3lRuHcSr28TmPGIqmEJykTdIyAwVyObirtdgepJ5H55ufOcDZxUrLwFmwyEsB1dwpqQ/exec?page=project"
  );
  const data = (await res.json()) as ProjectData;
  return data;
}
