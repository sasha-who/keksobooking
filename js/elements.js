'use strict';

(function () {
  var mainElement = document.querySelector('main');
  var mapElement = mainElement.querySelector('.map');
  var mainPinElement = mapElement.querySelector('.map__pin--main');
  var mapfiltersElement = mapElement.querySelector('.map__filters');

  window.elements = {
    mainElement: mainElement,
    mapElement: mapElement,
    mainPinElement: mainPinElement,
    mapfiltersElement: mapfiltersElement
  };
})();
