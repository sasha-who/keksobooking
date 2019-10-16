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

  var adFormElement = document.querySelector('.ad-form');
  var adFormHeaderElement = adFormElement.querySelector('.ad-form-header');
  var adFormElements = adFormElement.querySelectorAll('.ad-form__element');
  var mapFiltersElement = window.utils.mapElement.querySelector('.map__filters');
  var mapFeatures = mapFiltersElement.querySelectorAll('.map__features');
  var mapFilters = mapFiltersElement.querySelectorAll('.map__filter');
  var capacityField = adFormElement.querySelector('#capacity');
  var roomField = adFormElement.querySelector('#room_number');
  var submitButton = adFormElement.querySelector('.ad-form__submit');
  var titleField = adFormElement.querySelector('#title');
  var priceField = adFormElement.querySelector('#price');
  var typeField = adFormElement.querySelector('#type');
  var timeinField = adFormElement.querySelector('#timein');
  var timeoutField = adFormElement.querySelector('#timeout');
  var formAddressField = adFormElement.querySelector('#address');

  var mainPin = {
    width: parseFloat(getComputedStyle(window.utils.mainPinElement).width),
    height: parseFloat(getComputedStyle(window.utils.mainPinElement).height),
    pointerHeight: parseFloat(getComputedStyle(window.utils.mainPinElement, ':after').height),
    left: parseFloat(window.utils.mainPinElement.style.left),
    top: parseFloat(window.utils.mainPinElement.style.top)
  };

  var getPinLocationX = function () {
    return mainPin.left + mainPin.width / 2;
  };

  var getPinLocationY = function () {
    return mainPin.top + mainPin.height;
  };

  var getPinActivelocationY = function () {
    return mainPin.top + mainPin.height + mainPin.pointerHeight;
  };

  var addMainPinLocation = function () {
    formAddressField.value = getPinLocationX() + ', ' + getPinActivelocationY();
  };

  var setActiveStatus = function (elements, status) {
    Array.from(elements).forEach(function (item) {
      item.disabled = status;
    });
  };

  // Форма в неактивном состоянии
  adFormHeaderElement.disabled = true;
  setActiveStatus(adFormElements, true);
  mapFeatures.disabled = true;
  setActiveStatus(mapFilters, true);
  formAddressField.value = getPinLocationX() + ', ' + getPinLocationY();

  // Валидация
  submitButton.addEventListener('click', function () {
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
  });

  // var changeAttribute = function (element, attribute, value) {
  //   element.attribute = value;
  // };

  var changeAttribute = function (element, attribute, value) {
    element.setAttribute(attribute, value);
  };

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
    }
  };
})();
