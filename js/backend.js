'use strict';

(function () {
  var URL_LOAD = 'https://js.dump.academy/keksobooking/data';
  var URL_SEND = 'https://js.dump.academy/keksobooking';
  var TIMEOUT = 10000;

  var HttpCode = {
    SUCCESS: 200,
    INVALID: 400,
    NOT_AUTHORIZED: 401,
    NOT_FOUND: 404,
    SERVER: 500
  };

  var Error = {
    INVALID: 'Неверный запрос',
    NOT_AUTHORIZED: 'Пользователь не авторизован',
    NOT_FOUND: 'Ничего не найдено',
    SERVER: 'Ошибка сервера',
    CONNECTION: 'Произошла ошибка соединения',
    LONG_ANSWER: 'Слишком долгий ответ сервера'
  };

  var errorTemplate = document.querySelector('#error').content.querySelector('.error');

  var setupXHR = function (url, successHandler, errorHandler, cb) {
    var xhr = new XMLHttpRequest();

    xhr.responseType = 'json';

    xhr.open('GET', url);

    xhr.timeout = TIMEOUT;

    xhr.addEventListener('load', function () {
      var error;

      switch (xhr.status) {
        case HttpCode.SUCCESS:
          successHandler(xhr.response);
          if (cb) {
            cb();
          }
          break;

        case HttpCode.INVALID:
          error = Error.INVALID;
          break;

        case HttpCode.NOT_AUTHORIZED:
          error = Error.NOT_AUTHORIZED;
          break;

        case HttpCode.NOT_FOUND:
          error = Error.NOT_FOUND;
          break;

        case HttpCode.SERVER:
          error = Error.SERVER;
          break;

        default:
          error = 'Статус ответа: ' + xhr.status + ' ' + xhr.statusText;
      }

      if (error) {
        errorHandler(error);
      }
    });

    xhr.addEventListener('error', function () {
      errorHandler(Error.CONNECTION);
    });

    xhr.addEventListener('timeout', function () {
      errorHandler(Error.LONG_ANSWER);
    });

    return xhr;
  };

  window.backend = {
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
    },

    load: function (successHandler, errorHandler, cb) {
      var xhr = setupXHR(URL_LOAD, successHandler, errorHandler, cb);
      xhr.send();
    },

    send: function (data, successHandler, errorHandler, cb) {
      var xhr = setupXHR(URL_SEND, successHandler, errorHandler, cb);
      xhr.send(data);
    }
  };
})();
