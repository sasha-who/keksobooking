'use strict';

(function () {
  var SUCCESS_CODE = 200;
  var TIMEOUT = 10000;

  var errorTemplate = document.querySelector('#error').content.querySelector('.error');

  window.backend = {
    load: function (url, successHandler, errorHandler, cb) {
      var xhr = new XMLHttpRequest();

      xhr.responseType = 'json';

      xhr.open('GET', url);

      xhr.timeout = TIMEOUT;

      xhr.addEventListener('load', function () {
        if (xhr.status === SUCCESS_CODE) {
          successHandler(xhr.response);
          cb();
        } else {
          errorHandler('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
        }
      });

      xhr.addEventListener('error', function () {
        errorHandler('Произошла ошибка соединения');
      });

      xhr.addEventListener('timeout', function () {
        errorHandler('Слишком долгий ответ сервера');
      });

      xhr.send();
    },

    send: function (url, data, successHandler, errorHandler) {
      var xhr = new XMLHttpRequest();

      xhr.responseType = 'json';

      xhr.open('POST', url);

      xhr.timeout = TIMEOUT;

      xhr.addEventListener('load', function () {
        if (xhr.status === SUCCESS_CODE) {
          successHandler(xhr.response);
        } else {
          errorHandler('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
        }
      });

      xhr.addEventListener('error', function () {
        errorHandler('Произошла ошибка соединения');
      });

      xhr.addEventListener('timeout', function () {
        errorHandler('Слишком долгий ответ сервера');
      });

      xhr.send(data);
    },

    errorHandler: function (errorMessage) {
      var getErrorOverlay = function () {
        return window.utils.mainElement.querySelector('.error');
      };

      if (!getErrorOverlay()) {
        var errorElement = errorTemplate.cloneNode(true);

        errorElement.querySelector('.error__message').textContent = errorMessage;
        window.utils.mainElement.appendChild(errorElement);

        var errorOverlay = getErrorOverlay();
        var errorButton = errorOverlay.querySelector('.error__button');

        var removeOverlay = function () {
          errorOverlay.remove();
        };

        var overlayClickHandler = function () {
          removeOverlay();
        };

        var overlayKeydownHandler = function (evt) {
          if (evt.key === window.utils.keys.ESCAPE) {
            removeOverlay();
            document.removeEventListener('keydown', overlayKeydownHandler);
          }
        };

        errorOverlay.addEventListener('click', overlayClickHandler);
        errorButton.addEventListener('click', overlayClickHandler);
        document.addEventListener('keydown', overlayKeydownHandler);
      }
    }
  };
})();
