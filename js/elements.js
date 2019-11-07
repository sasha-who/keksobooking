'use strict';

var mainElement = document.querySelector('main');
var mapElement = mainElement.querySelector('.map');
var mainPinElement = mapElement.querySelector('.map__pin--main');

(function () {
  window.elements = {
    mainElement: mainElement,
    mapElement: mapElement,
    mainPinElement: mainPinElement
  };
})();
