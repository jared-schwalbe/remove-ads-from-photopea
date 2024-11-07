const style = document.createElement('style');
style.textContent = '.app > div:nth-child(2) { visibility: hidden; }';
document.head.appendChild(style);

function addResizeCanvasListener() {
  // listen for our custom event
  document.addEventListener('resizecanvas', () => {
    const app = document.querySelector('.app')?.firstElementChild;
    const appWidth = app?.offsetWidth ?? 0;
    const pageWidth = document.documentElement.clientWidth;
    const adsWidth = window.screen.width < 1500 ? 180 : 320;

    if (!app || pageWidth - appWidth === 0) {
      return;
    }

    // update window.innerWidth and window.visualViewport.width
    // essentially we want to push the adds out of the viewport
    window.innerWidth = pageWidth + adsWidth;
    Object.defineProperty(window, 'visualViewport', {
      configurable: true,
      value: new Proxy(window.visualViewport, {
        get(target, property) {
          if (property === 'width') {
            return pageWidth + adsWidth;
          }
          return target[property];
        }
      }),
    });
  });
}

// inject our custom event listener into the "main world"
// otherwise we won't have access to the window object
document.documentElement.setAttribute('onreset', `(${addResizeCanvasListener})()`);
document.documentElement.dispatchEvent(new CustomEvent('reset'));
document.documentElement.removeAttribute('onreset');

function resize(event = {}) {
  if (!event.skip) {
    // trigger our custom event to update the width
    document.dispatchEvent(new CustomEvent('resizecanvas'));

    // trigger another resize event to update any listeners with the new width
    const resizeEvent = new Event('resize');
    resizeEvent.skip = true;
    window.dispatchEvent(resizeEvent);
  }
}

// run when the window is resized
let debounce;
window.addEventListener('resize', event => {
  clearTimeout(debounce);
  debounce = setTimeout(() => resize(event), 100);
});

// run once when the DOM finishes loading
window.onload = () => {
  resize();
};

// run once if we see the app injected into the DOM
const observer = new MutationObserver((mutationsList, observer) => {
  for (const mutation of mutationsList) {
    for (const addedNode of mutation.addedNodes) {
      if (
        addedNode.nodeType === Node.ELEMENT_NODE &&
        addedNode.classList.contains('app')
      ) {
        console.log('app added');
        resize();
        observer.disconnect();
        break;
      }
    }
  }
});
observer.observe(document.body, { childList: true, subtree: true });
