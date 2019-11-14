'use strict';

(function () {
  var ERROR_MISMATCH = 'Несоответствие количества комнат и гостей';
  var PRICE_MAX_VALUE = 1000000;

  var Extreme = {
    ROOM: 100,
    CAPACITY: 0
  };

  var TitleLength = {
    MIN: 30,
    MAX: 100
  };

  var ApartmentTypeMinValue = {
    PALACE: 10000,
    FLAT: 1000,
    HOUSE: 5000,
    BUNGALO: 0
  };

  var PinInitialCoord = {
    TOP: '375px',
    LEFT: '570px'
  };

  var Attribute = {
    MIN: 'min',
    MAX: 'max',
    PLACEHOLDER: 'placeholder',
    REQUIRED: 'required',
    MIN_LENGTH: 'minLength',
    MAX_LENGTH: 'maxLength',
    READ_ONLY: 'readOnly'
  };

  var adFormElement = document.querySelector('.ad-form');
  var adFormHeaderElement = adFormElement.querySelector('.ad-form-header');
  var adFormElements = adFormElement.querySelectorAll('.ad-form__element');
  var resetElement = adFormElement.querySelector('.ad-form__reset');
  var mapFiltersElement = window.elements.mapElement.querySelector('.map__filters');
  var mapFeaturesElement = mapFiltersElement.querySelector('.map__features');
  var mapFiltersElements = mapFiltersElement.querySelectorAll('.map__filter');
  var capacityElement = adFormElement.querySelector('#capacity');
  var roomElement = adFormElement.querySelector('#room_number');
  var titleElement = adFormElement.querySelector('#title');
  var priceElement = adFormElement.querySelector('#price');
  var typeElement = adFormElement.querySelector('#type');
  var timeinElement = adFormElement.querySelector('#timein');
  var timeoutElement = adFormElement.querySelector('#timeout');
  var formAddressElement = adFormElement.querySelector('#address');
  var successTemplate = document.querySelector('#success').content.querySelector('.success');

  var getPinLocationX = function (pin) {
    return parseInt(pin.getLeft() + pin.width / 2, 10);
  };

  var getPinLocationY = function (pin) {
    return parseInt(pin.getTop() + pin.height, 10);
  };

  var getPinActivelocationY = function (pin) {
    return pin.getTop() + pin.height + pin.pointerHeight;
  };

  var getAddress = function (x, y) {
    return x + ', ' + y;
  };

  var addMainPinLocation = function (isInactive) {
    var mainPin = {
      width: parseFloat(getComputedStyle(window.elements.mainPinElement).width),
      height: parseFloat(getComputedStyle(window.elements.mainPinElement).height),
      pointerHeight: parseFloat(getComputedStyle(window.elements.mainPinElement, ':after').height),
      getLeft: function () {
        return parseFloat(window.elements.mainPinElement.style.left);
      },
      getTop: function () {
        return parseFloat(window.elements.mainPinElement.style.top);
      }
    };

    // Флаг для задания координат в неактивном состоянии
    if (isInactive) {
      formAddressElement.value = getAddress(getPinLocationX(mainPin), getPinLocationY(mainPin));
      return;
    }

    formAddressElement.value = getAddress(getPinLocationX(mainPin), getPinActivelocationY(mainPin));
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
    mapFeaturesElement.disabled = true;
    setActiveStatus(mapFiltersElements, true);
    addMainPinLocation(true);
  };

  deactivateForm();

  // Валидация
  var removeCard = function () {
    var cardElement = window.elements.mapElement.querySelector('.map__card');
    var mapPinActive = window.elements.mapElement.querySelector('.map__pin--active');

    if (cardElement) {
      cardElement.remove();
    }

    if (mapPinActive) {
      mapPinActive.classList.remove('map__pin--active');
    }
  };

  var clearMap = function () {
    var pinElements = window.elements.mapElement.querySelectorAll('.map__pin:not(.map__pin--main)');

    Array.from(pinElements).forEach(function (item) {
      item.remove();
    });
  };

  var returnToInactive = function () {
    clearMap();
    removeCard();
    window.elements.mainPinElement.style.top = PinInitialCoord.TOP;
    window.elements.mainPinElement.style.left = PinInitialCoord.LEFT;
    window.elements.mapElement.classList.add('map--faded');
    adFormElement.reset();
    window.photos();
    deactivateForm();
    window.elements.mapfiltersElement.reset();
    window.utils.isRender = false;
  };

  var getSuccessOverlay = function () {
    return window.elements.mainElement.querySelector('.success');
  };

  var getSuccessMessage = function () {
    return window.elements.mainElement.querySelector('.success__message');
  };

  var overlayClickHandler = function (evt) {
    if (evt.target !== getSuccessMessage()) {
      getSuccessOverlay().remove();
    }
  };

  var overlayKeydownHandler = function (evt) {
    if (evt.key === window.utils.key.ESCAPE) {
      getSuccessOverlay().remove();
      document.removeEventListener('keydown', overlayKeydownHandler);
    }
  };

  var successHandler = function () {
    returnToInactive();

    if (!getSuccessOverlay()) {
      var successElement = successTemplate.cloneNode(true);
      window.elements.mainElement.appendChild(successElement);

      getSuccessOverlay().addEventListener('click', overlayClickHandler);
      document.addEventListener('keydown', overlayKeydownHandler);
    }
  };

  adFormElement.addEventListener('submit', function (evt) {
    evt.preventDefault();
    var roomNumber = parseInt(roomElement.value, 10);
    var capacityNumber = parseInt(capacityElement.value, 10);
    var roomCrit = (roomNumber === Extreme.ROOM);
    var capacityCrit = (capacityNumber === Extreme.CAPACITY);
    var roomsFewer = (roomNumber < capacityNumber);

    if (roomsFewer || roomCrit && !capacityCrit || !roomCrit && capacityCrit) {
      capacityElement.setCustomValidity(ERROR_MISMATCH);
    } else {
      capacityElement.setCustomValidity('');
    }

    capacityElement.addEventListener('change', function () {
      capacityElement.setCustomValidity('');
    });

    if (adFormElement.reportValidity()) {
      window.backend.send(new FormData(adFormElement), successHandler, window.error);
    }
  });

  var changeAttribute = function (element, attribute, value) {
    element[attribute] = value;
  };

  var getTypeValue = function () {
    return ApartmentTypeMinValue[typeElement.value.toUpperCase()];
  };

  var changePriceMin = function () {
    changeAttribute(priceElement, Attribute.MIN, getTypeValue());
  };

  var typeChangeHandler = function () {
    changePriceMin();
    changeAttribute(priceElement, Attribute.PLACEHOLDER, getTypeValue());
  };

  var setPriceMin = function () {
    changePriceMin();
    typeElement.addEventListener('change', typeChangeHandler);
  };

  var syncTimeFields = function () {
    timeinElement.addEventListener('change', function () {
      timeoutElement.value = timeinElement.value;
    });

    timeoutElement.addEventListener('change', function () {
      timeinElement.value = timeoutElement.value;
    });
  };

  changeAttribute(titleElement, Attribute.REQUIRED, true);
  changeAttribute(titleElement, Attribute.MIN_LENGTH, TitleLength.MIN);
  changeAttribute(titleElement, Attribute.MAX_LENGTH, TitleLength.MAX);
  changeAttribute(priceElement, Attribute.REQUIRED, true);
  changeAttribute(priceElement, Attribute.MAX, PRICE_MAX_VALUE);
  changeAttribute(formAddressElement, Attribute.READ_ONLY, true);
  setPriceMin();
  syncTimeFields();

  var resetClickHadler = function () {
    returnToInactive();
  };

  var resetKeydownHandler = function (evt) {
    if (evt.key === window.utils.key.ENTER) {
      returnToInactive();
    }
  };

  resetElement.addEventListener('click', resetClickHadler);
  resetElement.addEventListener('keydown', resetKeydownHandler);

  window.form = {
    activateForm: function () {
      adFormElement.classList.remove('ad-form--disabled');
      adFormHeaderElement.disabled = false;
      setActiveStatus(adFormElements, false);
      mapFeaturesElement.disabled = false;
      setActiveStatus(mapFiltersElements, false);
      addMainPinLocation();
    },
    addMainPinLocation: addMainPinLocation,
    clearMap: clearMap,
    removeCard: removeCard
  };
})();
