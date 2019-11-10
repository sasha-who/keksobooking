'use strict';

(function () {
  var errorTemplate = document.querySelector('#error').content.querySelector('.error');

  window.error.errorHandler = function (errorMessage) {
    var getErrorOverlay = function () {
      return window.elements.mainElement.querySelector('.error');
    };

    if (!getErrorOverlay()) {
      var errorElement = errorTemplate.cloneNode(true);

      errorElement.querySelector('.error__message').textContent = errorMessage;
      window.elements.mainElement.appendChild(errorElement);

      var errorOverlayElement = getErrorOverlay();
      var errorButtonElement = errorOverlayElement.querySelector('.error__button');

      var overlayClickHandler = function () {
        errorOverlayElement.remove();
      };

      var overlayKeydownHandler = function (evt) {
        if (evt.key === window.utils.key.ESCAPE) {
          errorOverlayElement.remove();
          document.removeEventListener('keydown', overlayKeydownHandler);
        }
      };

      errorOverlayElement.addEventListener('click', overlayClickHandler);
      errorButtonElement.addEventListener('click', overlayClickHandler);
      document.addEventListener('keydown', overlayKeydownHandler);
    }
  };
})();
