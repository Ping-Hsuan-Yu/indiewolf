export { onBeforePrerenderStart };

async function onBeforePrerenderStart() {
  const urls = ["golden-pig", "a-spiritual-journey", "61-note"];
  const illustrationPageURLs = urls.map((url) => `/project/${url}`);
  return illustrationPageURLs;
}
