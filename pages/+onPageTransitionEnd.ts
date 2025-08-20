import type { OnPageTransitionEndAsync } from "vike/types";

export const onPageTransitionEnd: OnPageTransitionEndAsync = async () => {
  console.log("Page transition end");
  document.querySelector("#loading-indicator")?.classList.add("hidden");
  document.querySelector("#loading-bg")?.classList.add("hidden");
};
