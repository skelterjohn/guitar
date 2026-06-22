(function () {
  var host = location.hostname.toLowerCase();
  if (host !== 'njgo.org' && host !== 'www.njgo.org') return;

  var manifest = document.querySelector('link[rel="manifest"]');
  if (manifest) manifest.href = '/njgo-manifest.webmanifest';

  var favicon = document.querySelector('link[rel="icon"]');
  if (favicon) {
    favicon.href = '/njgo-favicon.png';
    favicon.type = 'image/png';
  }

  var appleTouch = document.querySelector('link[rel="apple-touch-icon"]');
  if (appleTouch) appleTouch.href = '/njgo-apple-touch-icon.png';

  var themeColor = document.querySelector('meta[name="theme-color"]');
  if (themeColor) themeColor.content = '#000000';
})();
