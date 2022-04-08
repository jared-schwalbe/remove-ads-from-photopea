function addResizeCanvasEvent() {
  document.addEventListener('resizecanvas', (e) => {
    window.innerWidth = document.documentElement.clientWidth + e.detail.adsWidth;
  });
}

function resizeWindow(e, adsWidth) {
  if (e.skip) {
    return;
  }

  // run our custom event to modify the window.innerWidth
  document.dispatchEvent(new CustomEvent('resizecanvas', {
    detail: { adsWidth },
  }))

  // manually trigger the resize event to update listeners with the new window.innerWidth
  const resizeEvent = new Event('resize');
  resizeEvent.skip = true;
  window.dispatchEvent(resizeEvent);
};

setTimeout(() => {
  // set up custom resize event to interact with the "main world"
  document.documentElement.setAttribute('onreset', `(${addResizeCanvasEvent})()`);
  document.documentElement.dispatchEvent(new CustomEvent('reset'));
  document.documentElement.removeAttribute('onreset');

  // hide the ads from the user
  const style = document.createElement('style');
  style.textContent = '.app > div:not(:first-child) { visibility: hidden; }';
  document.head.appendChild(style);

  // calculate the width of the ads
  const app = document.querySelector('.app');
  const content = app && app.childElementCount ? app.children[0] : {};
  const adsWidth = window.innerWidth - content.offsetWidth;

  // slight delay helps with exceeding call stack size
  let resizeTimeout;
  window.onresize = (e) => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => resizeWindow(e, adsWidth), 100);
  };

  // begin by triggering a resize event
  window.dispatchEvent(new CustomEvent('resize'));
}, 100);
