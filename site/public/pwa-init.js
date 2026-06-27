(function () {
  var host = location.hostname.toLowerCase();
  var isNjgo = host === 'njgo.org' || host === 'www.njgo.org';
  var isBluebridge =
    host === 'bluebridge.skelterjohn.me' || host === 'www.bluebridge.skelterjohn.me';
  if (!isNjgo && !isBluebridge) return;

  var manifest = document.querySelector('link[rel="manifest"]');
  if (manifest) {
    manifest.href = isNjgo ? '/njgo-manifest.webmanifest' : '/bluebridge-manifest.webmanifest';
  }

  var favicon = document.querySelector('link[rel="icon"]');
  var appleTouch = document.querySelector('link[rel="apple-touch-icon"]');
  var themeColor = document.querySelector('meta[name="theme-color"]');

  if (isNjgo) {
    if (favicon) {
      favicon.href = '/njgo-favicon.png';
      favicon.type = 'image/png';
    }
    if (appleTouch) appleTouch.href = '/njgo-apple-touch-icon.png';
    if (themeColor) themeColor.content = '#000000';
  } else if (isBluebridge) {
    if (favicon) {
      favicon.href = '/bluebridge-favicon.png';
      favicon.type = 'image/png';
    }
    if (appleTouch) appleTouch.href = '/bluebridge-apple-touch-icon.png';
    if (themeColor) themeColor.content = '#f1f5f9';
  }
})();
