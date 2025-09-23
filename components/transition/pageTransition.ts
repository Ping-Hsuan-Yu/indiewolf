let transitionCount = 0;

const indicatorSelector = '#loading-indicator';
const backgroundSelector = '#loading-bg';

function showElements() {
  const indicator = document.querySelector(indicatorSelector);
  const background = document.querySelector(backgroundSelector);
  indicator?.classList.remove('hidden');
  background?.classList.remove('hidden');
}

function hideElements() {
  const indicator = document.querySelector(indicatorSelector);
  const background = document.querySelector(backgroundSelector);
  indicator?.classList.add('hidden');
  background?.classList.add('hidden');
}

export function startPageTransition() {
  if (typeof document === 'undefined') return;
  transitionCount += 1;
  document.body.classList.add('page-is-transitioning');
  showElements();
}

export function endPageTransition() {
  if (typeof document === 'undefined') return;
  transitionCount = Math.max(transitionCount - 1, 0);
  if (transitionCount === 0) {
    document.body.classList.remove('page-is-transitioning');
    hideElements();
  }
}

export function resetPageTransition() {
  if (typeof document === 'undefined') return;
  transitionCount = 0;
  document.body.classList.remove('page-is-transitioning');
  hideElements();
}
