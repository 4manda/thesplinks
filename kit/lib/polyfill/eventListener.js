if (!document.addEventListener) {
  if (document.attachEvent) {
    document.addEventListener = function (event, callback, useCapture) {
      return document.attachEvent(`on ${event}`, callback, useCapture);
    };
  } else {
    document.addEventListener = function () {
      return {};
    };
  }
}

if (!document.removeEventListener) {
  if (document.detachEvent) {
    document.removeEventListener = function (event, callback) {
      return document.detachEvent(`on ${event}`, callback);
    };
  } else {
    document.removeEventListener = function () {
      return {};
    };
  }
}
