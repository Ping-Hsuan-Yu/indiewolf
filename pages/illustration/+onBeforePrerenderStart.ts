export { onBeforePrerenderStart };

async function onBeforePrerenderStart() {
  const years = ["2025", "2019", "2018"];
  const illustrationPageURLs = years.map((year) => `/illustration/${year}`);
  return illustrationPageURLs;
}
