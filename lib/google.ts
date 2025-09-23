const BASE_URL = 'https://script.google.com/macros/s/AKfycbw3lRuHcSr28TmPGIqmEJykTdIyAwVyObirtdgepJ5H55ufOcDZxUrLwFmwyEsB1dwpqQ/exec';

export type GalleryItem = {
  id: string;
  img: string;
  imgThumb: string;
};

export type GalleryGroup = {
  year: string;
  items: GalleryItem[];
};

export type Project = {
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

export type ProjectListResponse = {
  project: Project[];
  projectTitle: ProjectTitle[];
};

export type ProjectDetail = {
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

export async function fetchIllustrationGroups(): Promise<GalleryGroup[]> {
  const res = await fetch(`${BASE_URL}?page=illustration`, {
    next: { revalidate: 3600 }
  });

  if (!res.ok) {
    throw new Error('Failed to load illustration data');
  }

  return res.json() as Promise<GalleryGroup[]>;
}

export async function fetchProjects(): Promise<ProjectListResponse> {
  const res = await fetch(`${BASE_URL}?page=project`, {
    next: { revalidate: 3600 }
  });

  if (!res.ok) {
    throw new Error('Failed to load project data');
  }

  return res.json() as Promise<ProjectListResponse>;
}

export async function fetchProjectDetail(id: string): Promise<ProjectDetail> {
  const res = await fetch(`${BASE_URL}?page=project-detail&id=${id}`, {
    next: { revalidate: 3600 }
  });

  if (!res.ok) {
    throw new Error('Failed to load project detail');
  }

  return res.json() as Promise<ProjectDetail>;
}
