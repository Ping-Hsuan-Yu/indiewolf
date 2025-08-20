import type { OnPageTransitionStartAsync } from "vike/types";

export const onPageTransitionStart: OnPageTransitionStartAsync = async () => {
  console.log("Page transition start");
  document.querySelector("#loading-indicator")?.classList.remove("hidden");
  document.querySelector("#loading-bg")?.classList.remove("hidden");
};
