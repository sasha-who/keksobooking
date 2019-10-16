'use strict';

(function () {
  var mapElement = document.querySelector('.map');
  var mainPinElement = mapElement.querySelector('.map__pin--main');

  window.utils = {
    mapElement: mapElement,
    mainPinElement: mainPinElement,
    keys: {
      ENTER: 'Enter',
      ESCAPE: 'Escape'
    },
    errors: {
      ROOMS_GUESTS_MISMATCH: 'Несоответствие количества комнат и гостей'
    }
  };
})();
