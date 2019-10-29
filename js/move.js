'use strict';

(function () {
  var locationYOptions = {
    MIN: 130,
    MAX: 630
  };

  var mapWigth = getComputedStyle(window.utils.mapElement).width;

  window.move = function (evt) {
    evt.preventDefault();

    var mainPinWidth = parseFloat(getComputedStyle(window.utils.mainPinElement).width);
    var mainPinHeight = parseFloat(getComputedStyle(window.utils.mainPinElement).height);
    var pointerHeight = parseFloat(getComputedStyle(window.utils.mainPinElement, ':after').height);
    var mainPinActiveHeight = mainPinHeight + pointerHeight;

    var critLocationX = {
      MIN: 0,
      max: parseFloat(mapWigth) - mainPinWidth
    };

    // Нужно заменить на  конструктор
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var mouseMoveHandler = function (moveEvt) {
      moveEvt.preventDefault();

      var pointTopPosition = window.utils.mainPinElement.offsetTop + mainPinActiveHeight;

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      window.utils.mainPinElement
          .style.left = (window.utils.mainPinElement.offsetLeft - shift.x) + 'px';

      window.utils.mainPinElement
          .style.top = (window.utils.mainPinElement.offsetTop - shift.y) + 'px';

      // Выход за границы карты
      if (pointTopPosition < locationYOptions.MIN) {
        window.utils.mainPinElement
            .style.top = (locationYOptions.MIN - mainPinActiveHeight) + 'px';
      }

      if (pointTopPosition > locationYOptions.MAX) {
        window.utils.mainPinElement
            .style.top = (locationYOptions.MAX - mainPinActiveHeight) + 'px';
      }

      if (window.utils.mainPinElement.offsetLeft < critLocationX.MIN) {
        window.utils.mainPinElement.style.left = critLocationX.MIN;
      }

      if (window.utils.mainPinElement.offsetLeft > critLocationX.max) {
        window.utils.mainPinElement.style.left = critLocationX.max + 'px';
      }

      window.form.addMainPinLocation();
    };

    var mouseUpHandler = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  };
})();
