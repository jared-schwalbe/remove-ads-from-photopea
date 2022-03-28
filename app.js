function hideAds() {
  const app = document.querySelector('.app');
  if (app && app.childElementCount === 2) {
    app.children[1].style.visibility = 'hidden';
  }
}

function updateWidth(width) {
  window.innerWidth = document.documentElement.clientWidth + width;
}

function resizeWindow(e, adsWidth) {
  if (e.doNothing) {
    return;
  }

  // run our custom event to modify the window.innerWidth
  const injection = "("+updateWidth+")("+adsWidth+")";
  document.documentElement.setAttribute('onreset', injection);
  document.documentElement.dispatchEvent(new CustomEvent('reset'));
  document.documentElement.removeAttribute('onreset');

  // manually trigger the resize event to update listeners with the new window.innerWidth
  const resizeEvent = new Event('resize');
  resizeEvent.doNothing = true;
  window.dispatchEvent(resizeEvent);
};

window.onload = function() {
  setTimeout(function() {
    // run our custom event to hide the ads
    const injection = "("+hideAds+")()";
    document.documentElement.setAttribute('onreset', injection);
    document.documentElement.dispatchEvent(new CustomEvent('reset'));
    document.documentElement.removeAttribute('onreset');

    // calculate the width of the ads
    const app = document.querySelector('.app');
    const content = app && app.childElementCount ? app.children[0] : null;
    const adsWidth = window.innerWidth - content.offsetWidth;

    // slight delay helps with exceeding call stack size
    let resizeTimeout;
    window.onresize = function(e) {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => resizeWindow(e, adsWidth), 100);
    };

    // begin by triggering a resize event
    window.dispatchEvent(new Event('resize'));
  }, 100);
};
