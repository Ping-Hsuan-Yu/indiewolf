export { onBeforePrerenderStart };

async function onBeforePrerenderStart() {
  const years = ["2025","2023-2024","2020-2022","2017-2019"];
  const illustrationPageURLs = years.map((year) => `/illustration/${year}`);
  return illustrationPageURLs;
}
