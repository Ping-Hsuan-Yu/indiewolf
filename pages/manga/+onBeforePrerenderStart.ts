export { onBeforePrerenderStart };

async function onBeforePrerenderStart() {
  const years = ["2023", "2019", "2018"];
  const mangaPageURLs = years.map((year) => `/manga/${year}`);
  return mangaPageURLs;
}
