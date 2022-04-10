// immediately hide the ads from the user
const style = document.createElement('style');
style.textContent = '.app > div:not(:first-child) { visibility: hidden; }';
document.head.appendChild(style);

// push the ads off the page by expanding window.innerWidth to exceed the actual window width
function addResizeCanvasEvent() {
  document.addEventListener('resizecanvas', (e) => {
    window.innerWidth = document.documentElement.clientWidth + e.detail.adsWidth;
  });
}

// inject our custom event listener into the "main world"
document.documentElement.setAttribute('onreset', `(${addResizeCanvasEvent})()`);
document.documentElement.dispatchEvent(new CustomEvent('reset'));
document.documentElement.removeAttribute('onreset');

function resizeWindow(e, adsWidth) {
  if (!e.skip) {
    // expand window.innerWidth through our custom event
    document.dispatchEvent(new CustomEvent('resizecanvas', { detail: { adsWidth } }));

    // trigger another resize event to update any listeners with the new window.innerWidth
    const resizeEvent = new Event('resize');
    resizeEvent.skip = true;
    window.dispatchEvent(resizeEvent);
  }
};

// wait for the ads container to load into the DOM
const initialResize = setInterval(() => {
  const app = document.querySelector('.app');
  const content = app && app.childElementCount ? app.children[0] : {};
  const adsWidth = window.innerWidth - content.offsetWidth;

  if (adsWidth) {
    clearInterval(initialResize);

    // a slight delay helps with exceeding call stack size
    let resizeTimeout;
    window.onresize = (e) => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => resizeWindow(e, adsWidth), 100);
    };

    // begin by triggering a resize event
    window.dispatchEvent(new CustomEvent('resize'));
  }
}, 200);
