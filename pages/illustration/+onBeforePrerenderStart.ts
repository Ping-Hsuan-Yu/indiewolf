export { onBeforePrerenderStart };

async function onBeforePrerenderStart() {
  const years = ["2025","2024","2023","2022","2021","2020", "2019", "2018","2017"];
  const illustrationPageURLs = years.map((year) => `/illustration/${year}`);
  return illustrationPageURLs;
}
