'use strict';

var mainElement = document.querySelector('main');
var mapElement = mainElement.querySelector('.map');
var mainPinElement = mapElement.querySelector('.map__pin--main');
var mapfiltersElement = mapElement.querySelector('.map__filters');

(function () {
  window.elements = {
    mainElement: mainElement,
    mapElement: mapElement,
    mainPinElement: mainPinElement,
    mapfiltersElement: mapfiltersElement
  };
})();
