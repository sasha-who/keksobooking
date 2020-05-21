'use strict';

(function () {
  var URL_LOAD = 'https://javascript.pages.academy/keksobooking/data';
  var URL_SEND = 'https://javascript.pages.academy/keksobooking';
  var TIMEOUT = 10000;
  var STATUS_DESCRIPTION = 'Статус ответа: ';

  var HttpMethod = {
    GET: 'GET',
    POST: 'POST'
  };

  var HttpCode = {
    SUCCESS: 200,
    BAD_REQUEST: 400,
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

  var setupXHR = function (url, method, successHandler, errorHandler) {
    var xhr = new XMLHttpRequest();

    xhr.responseType = 'json';

    xhr.open(method, url);

    xhr.timeout = TIMEOUT;

    xhr.addEventListener('load', function () {
      var error;

      var getRequestStatus = function () {
        return STATUS_DESCRIPTION + xhr.status + ' ' + xhr.statusText;
      };

      switch (xhr.status) {
        case HttpCode.SUCCESS:
          successHandler(xhr.response);
          break;

        case HttpCode.BAD_REQUEST:
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
          error = getRequestStatus();
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
    load: function (successHandler, errorHandler) {
      var xhr = setupXHR(URL_LOAD, HttpMethod.GET, successHandler, errorHandler);
      xhr.send();
    },

    send: function (data, successHandler, errorHandler) {
      var xhr = setupXHR(URL_SEND, HttpMethod.POST, successHandler, errorHandler);
      xhr.send(data);
    }
  };
})();
