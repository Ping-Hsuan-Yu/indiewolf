export { onBeforePrerenderStart };

async function onBeforePrerenderStart() {
  const urls = ["golden-pig", "a-spiritual-journey", "61-note"];
  const projectPageURLs = urls.map((url) => `/project/${url}`);
  return projectPageURLs;
}
