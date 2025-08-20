export { data };
export type Data = Awaited<ReturnType<typeof data>>;

import type { PageContextServer } from "vike/types";
import type { ProjectTitle } from "../index/+data";

type Project = {
  id: string;
  title_cn: string;
  subtitle_cn: string;
  desc_cn: string;
  title_en: string;
  subtitle_en: string;
  desc_en: string;
  images: string[];
  projectTitle: ProjectTitle;
};

async function data(pageContext: PageContextServer) {
  const res = await fetch(
    `https://script.google.com/macros/s/AKfycbw3lRuHcSr28TmPGIqmEJykTdIyAwVyObirtdgepJ5H55ufOcDZxUrLwFmwyEsB1dwpqQ/exec?page=project-detail&id=${pageContext.routeParams.id}`
  );
  const data = (await res.json()) as Project;
  return data;
}
