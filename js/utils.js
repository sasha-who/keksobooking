'use strict';

(function () {
  var mainElement = document.querySelector('main');
  var mapElement = document.querySelector('.map');
  var mainPinElement = mapElement.querySelector('.map__pin--main');

  window.utils = {
    mainElement: mainElement,
    mapElement: mapElement,
    mainPinElement: mainPinElement,
    isRender: false,
    keys: {
      ENTER: 'Enter',
      ESCAPE: 'Escape'
    },
    errors: {
      ROOMS_GUESTS_MISMATCH: 'Несоответствие количества комнат и гостей'
    }
  };
})();
