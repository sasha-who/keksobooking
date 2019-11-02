'use strict';

(function () {
  var ROOM_VALUE_CRIT = 100;
  var CAPACITY_VALUE_CRIT = 0;
  var TITLE_MIN_LENGTH = 30;
  var TITLE_MAX_LENGTH = 100;
  var PRICE_MAX_VALUE = 1000000;

  var ApartmentTypeMinValue = {
    PALACE: 10000,
    FLAT: 1000,
    HOUSE: 5000,
    BUNGALO: 0
  };

  var pinInitialCoords = {
    TOP: '375px',
    LEFT: '570px'
  };

  var adFormElement = document.querySelector('.ad-form');
  var adFormHeaderElement = adFormElement.querySelector('.ad-form-header');
  var adFormElements = adFormElement.querySelectorAll('.ad-form__element');
  var mapFiltersElement = window.utils.mapElement.querySelector('.map__filters');
  var mapFeatures = mapFiltersElement.querySelectorAll('.map__features');
  var mapFilters = mapFiltersElement.querySelectorAll('.map__filter');
  var capacityField = adFormElement.querySelector('#capacity');
  var roomField = adFormElement.querySelector('#room_number');
  var titleField = adFormElement.querySelector('#title');
  var priceField = adFormElement.querySelector('#price');
  var typeField = adFormElement.querySelector('#type');
  var timeinField = adFormElement.querySelector('#timein');
  var timeoutField = adFormElement.querySelector('#timeout');
  var formAddressField = adFormElement.querySelector('#address');
  var successTemplate = document.querySelector('#success').content.querySelector('.success');

  var addMainPinLocation = function (isInactive) {
    var mainPin = {
      width: parseFloat(getComputedStyle(window.utils.mainPinElement).width),
      height: parseFloat(getComputedStyle(window.utils.mainPinElement).height),
      pointerHeight: parseFloat(getComputedStyle(window.utils.mainPinElement, ':after').height),
      getLeft: function () {
        return parseFloat(window.utils.mainPinElement.style.left);
      },
      getTop: function () {
        return parseFloat(window.utils.mainPinElement.style.top);
      }
    };

    var getPinLocationX = function () {
      return mainPin.getLeft() + mainPin.width / 2;
    };

    var getPinLocationY = function () {
      return mainPin.getTop() + mainPin.height;
    };

    var getPinActivelocationY = function () {
      return mainPin.getTop() + mainPin.height + mainPin.pointerHeight;
    };

    // Флаг для задания координат в неактивном состоянии
    if (isInactive) {
      formAddressField.value = getPinLocationX() + ', ' + getPinLocationY();
      return;
    }

    formAddressField.value = getPinLocationX() + ', ' + getPinActivelocationY();
  };

  var setActiveStatus = function (elements, status) {
    Array.from(elements).forEach(function (item) {
      item.disabled = status;
    });
  };

  // Изначальное состояние — форма деактивирована
  var deactivateForm = function () {
    adFormElement.classList.add('ad-form--disabled');
    adFormHeaderElement.disabled = true;
    setActiveStatus(adFormElements, true);
    mapFeatures.disabled = true;
    setActiveStatus(mapFilters, true);
    addMainPinLocation(true);
  };

  deactivateForm();

  // Валидация
  var cleanMap = function () {
    var pins = window.utils.mapElement.querySelectorAll('.map__pin');
    var card = window.utils.mapElement.querySelector('.map__card');

    for (var i = 1; i < pins.length; i++) {
      pins[i].remove();
    }

    if (card) {
      card.remove();
    }
  };

  var successHandler = function () {
    // Возвращает в неактивное состояние после отправки данных
    cleanMap();
    window.utils.mainPinElement.style.top = pinInitialCoords.TOP;
    window.utils.mainPinElement.style.left = pinInitialCoords.LEFT;

    window.utils.mapElement.classList.add('map--faded');
    adFormElement.reset();
    deactivateForm();
    window.utils.isRender = false;

    var getSuccessOverlay = function () {
      return window.utils.mainElement.querySelector('.success');
    };

    if (!getSuccessOverlay()) {
      var successElement = successTemplate.cloneNode(true);

      window.utils.mainElement.appendChild(successElement);

      var successOverlay = getSuccessOverlay();

      var removeOverlay = function () {
        successOverlay.remove();
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

      successOverlay.addEventListener('click', overlayClickHandler);
      document.addEventListener('keydown', overlayKeydownHandler);
    }
  };

  adFormElement.addEventListener('submit', function (evt) {
    var roomNumber = parseInt(roomField.value, 10);
    var capacityNumber = parseInt(capacityField.value, 10);
    var roomCrit = (roomNumber === ROOM_VALUE_CRIT);
    var capacityCrit = (capacityNumber === CAPACITY_VALUE_CRIT);
    var roomsFewer = (roomNumber < capacityNumber);

    if (roomsFewer || roomCrit && !capacityCrit || !roomCrit && capacityCrit) {
      capacityField.setCustomValidity(window.utils.errors.ROOMS_GUESTS_MISMATCH);
    } else {
      capacityField.setCustomValidity('');
    }

    window.backend.send(new FormData(adFormElement), successHandler, window.backend.errorHandler);
    evt.preventDefault();
  });

  var changeAttribute = function (element, attribute, value) {
    element.setAttribute(attribute, value);
  };

  // var changeAttribute = function (element, attribute, value) {
  //   element[attribute] = value;
  // };

  var setPriceMin = function () {
    var getTypeValue = function () {
      return ApartmentTypeMinValue[typeField.value.toUpperCase()];
    };

    var changePriceMin = function () {
      changeAttribute(priceField, 'min', getTypeValue());
    };

    var typeChangeHandler = function () {
      changePriceMin();
      changeAttribute(priceField, 'placeholder', getTypeValue());
    };

    changePriceMin();
    typeField.addEventListener('change', typeChangeHandler);
  };

  var syncTimeFields = function () {
    timeinField.addEventListener('change', function () {
      timeoutField.value = timeinField.value;
    });

    timeoutField.addEventListener('change', function () {
      timeinField.value = timeoutField.value;
    });
  };

  changeAttribute(titleField, 'required', true);
  changeAttribute(titleField, 'minlength', TITLE_MIN_LENGTH);
  changeAttribute(titleField, 'maxlength', TITLE_MAX_LENGTH);
  changeAttribute(priceField, 'required', true);
  changeAttribute(priceField, 'max', PRICE_MAX_VALUE);
  changeAttribute(formAddressField, 'readonly', true);
  setPriceMin();
  syncTimeFields();

  window.form = {
    activateForm: function () {
      adFormElement.classList.remove('ad-form--disabled');
      adFormHeaderElement.disabled = false;
      setActiveStatus(adFormElements, false);
      mapFeatures.disabled = false;
      setActiveStatus(mapFilters, false);
      addMainPinLocation();
    },
    addMainPinLocation: addMainPinLocation,
    cleanMap: cleanMap
  };
})();
