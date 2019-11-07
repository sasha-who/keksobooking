'use strict';

(function () {
  var locationYOption = {
    MIN: 130,
    MAX: 630
  };

  var Coordinate = function (x, y) {
    this.x = x;
    this.y = y;
  };

  var mapWigth = getComputedStyle(window.elements.mapElement).width;

  window.move = function (evt) {
    evt.preventDefault();

    var mainPinWidth = parseFloat(getComputedStyle(window.elements.mainPinElement).width);
    var mainPinHeight = parseFloat(getComputedStyle(window.elements.mainPinElement).height);
    var pointerHeight = parseFloat(getComputedStyle(window.elements.mainPinElement, ':after').height);
    var mainPinActiveHeight = mainPinHeight + pointerHeight;

    var critLocationX = {
      min: 0,
      max: parseFloat(mapWigth) - mainPinWidth / 2
    };

    var startCoords = new Coordinate(evt.clientX, evt.clientY);

    var mouseMoveHandler = function (moveEvt) {
      moveEvt.preventDefault();

      var pointTopPosition = window.elements.mainPinElement.offsetTop + mainPinActiveHeight;

      var shift = new Coordinate(startCoords.x - moveEvt.clientX, startCoords.y - moveEvt.clientY);

      startCoords.x = moveEvt.clientX;
      startCoords.y = moveEvt.clientY;

      window.elements.mainPinElement
          .style.left = (window.elements.mainPinElement.offsetLeft - shift.x) + 'px';

      window.elements.mainPinElement
          .style.top = (window.elements.mainPinElement.offsetTop - shift.y) + 'px';

      // Выход за границы карты
      if (pointTopPosition < locationYOption.MIN) {
        window.elements.mainPinElement
            .style.top = (locationYOption.MIN - mainPinActiveHeight) + 'px';
      }

      if (pointTopPosition > locationYOption.MAX) {
        window.elements.mainPinElement
            .style.top = (locationYOption.MAX - mainPinActiveHeight) + 'px';
      }

      if (window.elements.mainPinElement.offsetLeft < critLocationX.min) {
        window.elements.mainPinElement.style.left = (critLocationX.min - mainPinWidth / 2) + 'px';
      }

      if (window.elements.mainPinElement.offsetLeft > critLocationX.max) {
        window.elements.mainPinElement.style.left = critLocationX.max + 'px';
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
