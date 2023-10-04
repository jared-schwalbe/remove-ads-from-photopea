const style = document.createElement('style');
style.textContent = '.app > div:not(:first-child) { visibility: hidden; }';
document.head.appendChild(style);

function addCustomEvent() {
  const ADS_WIDTH = window.screen.width < 1180 ? 180 : 320;
  document.addEventListener('resizecanvas', () => {
    // push the ads container outside of the viewport
    window.innerWidth = document.documentElement.clientWidth + ADS_WIDTH;
  });
}

// inject our custom event listener into the "main world"
document.documentElement.setAttribute('onreset', `(${addCustomEvent})()`);
document.documentElement.dispatchEvent(new CustomEvent('reset'));
document.documentElement.removeAttribute('onreset');

function resize(event = {}) {
  if (!event.skip) {
    document.dispatchEvent(new CustomEvent('resizecanvas'));

    // trigger another resize event to update any listeners with the new window.innerWidth
    const resizeEvent = new Event('resize');
    resizeEvent.skip = true;
    window.dispatchEvent(resizeEvent);
  }
}

let debounce;
window.addEventListener('resize', event => {
  clearTimeout(debounce);
  debounce = setTimeout(() => resize(event), 100);
});

resize();
