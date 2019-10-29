'use strict';

(function () {
  var URL = 'https://js.dump.academy/keksobooking/data';
  var ADVERTISEMENTS_COUNT = 8;
  var MAP_PIN_WIDTH = 50;
  var MAP_PIN_HEIGHT = 70;

  var descriptions = {
    ROOMS: ' комнаты для ',
    GUESTS: ' гостей',
    CHECKIN: 'Заезд после ',
    CHECKOUT: ', выезд до ',
    PRICE: '₽/ночь'
  };

  var ApartmentType = {
    'PALACE': 'Дворец',
    'FLAT': 'Квартира',
    'HOUSE': 'Дом',
    'BUNGALO': 'Бунгало'
  };

  var locationYOptions = {
    MIN: 130,
    MAX: 630
  };

  var offers = window.utils.mapElement.querySelector('.map__pins');
  var offerTemplate = document.querySelector('#pin')
      .content.querySelector('.map__pin');
  var mapFiltersContainer = document.querySelector('.map__filters-container');
  var cardPopupTemplate = document.querySelector('#card').content.querySelector('.map__card');
  var cardPopupPhotoTemplate = cardPopupTemplate.querySelector('.popup__photo');
  var errorTemplate = document.querySelector('#error').content.querySelector('.error');

  var mapWigth = getComputedStyle(window.utils.mapElement).width;

  var advertisementsList = [];

  var getReorderingArray = function (arrayElements) {
    for (var i = arrayElements.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = arrayElements[i];
      arrayElements[i] = arrayElements[j];
      arrayElements[j] = temp;
    }

    return arrayElements;
  };

  var renderAdvertisement = function (advertisement) {
    var advertisementElement = offerTemplate.cloneNode(true);

    advertisementElement.style.left = (advertisement.location.x - MAP_PIN_WIDTH / 2) + 'px';
    advertisementElement.style.top = (advertisement.location.y - MAP_PIN_HEIGHT) + 'px';
    advertisementElement.querySelector('img').src = advertisement.author.avatar;
    advertisementElement.querySelector('img').alt = advertisement.offer.title;

    return advertisementElement;
  };

  var renderAdvertisementsNearbyList = function () {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < advertisementsList.length; i++) {
      fragment.appendChild(renderAdvertisement(advertisementsList[i]));
    }

    offers.appendChild(fragment);
  };

  // Карточки
  var generateCards = function () {
    var createCard = function (advertisement) {
      var roomsCount = advertisement.offer.rooms + descriptions.ROOMS;
      var guestsCount = advertisement.offer.guests + descriptions.GUESTS;
      var checkinDescription = descriptions.CHECKIN + advertisement.offer.checkin;
      var checkoutDescription = descriptions.CHECKOUT + advertisement.offer.checkout;
      var photos = advertisement.offer.photos;
      var cardPopup = cardPopupTemplate.cloneNode(true);
      var fragment = document.createDocumentFragment();

      cardPopup.querySelector('.popup__photo').remove();
      photos.forEach(function () {
        var cardPopupPhoto = cardPopupPhotoTemplate.cloneNode();

        fragment.appendChild(cardPopupPhoto);
      });
      cardPopup.querySelector('.popup__photos').appendChild(fragment);

      var photosElements = cardPopup.querySelectorAll('.popup__photo');

      photosElements.forEach(function (item, index) {
        item.src = advertisement.offer.photos[index];
      });

      cardPopup.querySelector('.popup__title').textContent = advertisement.offer.title;
      cardPopup.querySelector('.popup__text--address').textContent = advertisement.offer.address;
      cardPopup.querySelector('.popup__text--price')
          .textContent = advertisement.offer.price + descriptions.PRICE;
      cardPopup.querySelector('.popup__type').textContent = ApartmentType[advertisement.offer.type];
      cardPopup.querySelector('.popup__text--capacity').textContent = roomsCount + guestsCount;
      cardPopup.querySelector('.popup__text--time')
          .textContent = checkinDescription + checkoutDescription;
      cardPopup.querySelector('.popup__features')
          .textContent = advertisement.offer.features.join(', ');
      cardPopup.querySelector('.popup__description').textContent = advertisement.offer.description;
      cardPopup.querySelector('.popup__avatar').src = advertisement.author.avatar;

      return cardPopup;
    };

    return advertisementsList.map(function (item) {
      return createCard(item);
    });
  };

  var renderCard = function () {
    var mapPinElements = offers.querySelectorAll('.map__pin');

    var getMapCardElement = function () {
      return window.utils.mapElement.querySelector('.map__card');
    };

    var removePopup = function () {
      getMapCardElement().remove();
    };

    var popupEscPressHandler = function (evt) {
      if (evt.key === window.utils.keys.ESCAPE) {
        removePopup();
      }
    };

    var popupCloseClickHandler = function () {
      removePopup();
    };

    var cards = generateCards();

    Array.from(mapPinElements).forEach(function (item, index) {
      var pinClickHandler = function () {
        if (getMapCardElement()) {
          removePopup();
        }

        // [index - 1] — сдвиг нужен из-за первого элемента в mapPinElements (главная метка)
        window.utils.mapElement.insertBefore(cards[index - 1], mapFiltersContainer);

        getMapCardElement().querySelector('.popup__close')
            .addEventListener('click', popupCloseClickHandler);
        document.addEventListener('keydown', popupEscPressHandler);
      };

      if (index > 0) {
        item.addEventListener('click', pinClickHandler);
      }
    });
  };

  // Активация карты и формы
  var isRender = false;

  var activateMap = function () {
    window.utils.mapElement.classList.remove('map--faded');

    if (!isRender) {
      renderAdvertisementsNearbyList();
      isRender = true;
    }
  };

  var movePin = function (evt) {
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

  var successHandler = function (advertisements) {
    var reorderedAdvertisements = getReorderingArray(advertisements);
    for (var i = 0; i < ADVERTISEMENTS_COUNT; i++) {
      advertisementsList.push(reorderedAdvertisements[i]);
    }
  };

  var errorHandler = function (errorMessage) {
    var errorElement = errorTemplate.cloneNode(true);

    errorElement.querySelector('.error__message').textContent = errorMessage;
    document.querySelector('main').appendChild(errorElement);
  };

  var activateAll = function () {
    activateMap();
    window.form.activateForm();
    renderCard();
  };

  var activateByClick = function (evt) {
    window.load(URL, successHandler, errorHandler, activateAll);
    movePin(evt);
  };

  var mainPinMouseDownHandler = function (evt) {
    activateByClick(evt);
  };

  var mainPinKeyDownHandler = function (evt) {
    if (evt.key === window.utils.keys.ENTER) {
      activateByClick(evt);
    }
  };

  window.utils.mainPinElement.addEventListener('mousedown', mainPinMouseDownHandler);
  window.utils.mainPinElement.addEventListener('keydown', mainPinKeyDownHandler);
})();
