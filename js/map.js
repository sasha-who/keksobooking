'use strict';

(function () {
  var ADVERTISEMENTS_COUNT = 5;

  var PinSize = {
    WIDTH: 50,
    HEIGHT: 70
  };

  var description = {
    ROOMS: ' комнаты для ',
    GUESTS: ' гостей',
    CHECKIN: 'Заезд после ',
    CHECKOUT: ', выезд до ',
    PRICE: '₽/ночь'
  };

  var ApartmentTypeMap = {
    'PALACE': 'Дворец',
    'FLAT': 'Квартира',
    'HOUSE': 'Дом',
    'BUNGALO': 'Бунгало'
  };

  var offersElement = window.elements.mapElement.querySelector('.map__pins');
  var offerTemplate = document.querySelector('#pin')
      .content.querySelector('.map__pin');
  var mapFiltersElement = document.querySelector('.map__filters-container');
  var cardPopupTemplate = document.querySelector('#card').content.querySelector('.map__card');
  var cardPopupPhotoTemplate = cardPopupTemplate.querySelector('.popup__photo');

  var advertisements = [];
  var filteredAdvertisements = [];

  // Объявления
  var renderAdvertisement = function (element) {
    var advertisementElement = offerTemplate.cloneNode(true);

    advertisementElement.style.left = (element.location.x - PinSize.WIDTH / 2) + 'px';
    advertisementElement.style.top = (element.location.y - PinSize.HEIGHT) + 'px';
    advertisementElement.querySelector('img').src = element.author.avatar;
    advertisementElement.querySelector('img').alt = element.offer.title;

    return advertisementElement;
  };

  var renderAdvertisementsNearbyList = function (elements) {
    var fragment = document.createDocumentFragment();

    elements.forEach(function (item) {
      fragment.appendChild(renderAdvertisement(item));
    });

    offersElement.appendChild(fragment);
  };

  // Карточки
  var createCard = function (element) {
    var roomsCount = element.offer.rooms + description.ROOMS;
    var guestsCount = element.offer.guests + description.GUESTS;
    var checkinDescription = description.CHECKIN + element.offer.checkin;
    var checkoutDescription = description.CHECKOUT + element.offer.checkout;
    var photos = element.offer.photos;
    var cardElement = cardPopupTemplate.cloneNode(true);
    var fragment = document.createDocumentFragment();

    cardElement.querySelector('.popup__photo').remove();
    photos.forEach(function () {
      var cardPhotoElement = cardPopupPhotoTemplate.cloneNode();

      fragment.appendChild(cardPhotoElement);
    });
    cardElement.querySelector('.popup__photos').appendChild(fragment);

    var photoElements = cardElement.querySelectorAll('.popup__photo');

    photoElements.forEach(function (item, index) {
      item.src = element.offer.photos[index];
    });

    cardElement.querySelector('.popup__title').textContent = element.offer.title;
    cardElement.querySelector('.popup__text--address').textContent = element.offer.address;
    cardElement.querySelector('.popup__text--price')
        .textContent = element.offer.price + description.PRICE;
    cardElement.querySelector('.popup__type').textContent = ApartmentTypeMap[element.offer.type];
    cardElement.querySelector('.popup__text--capacity').textContent = roomsCount + guestsCount;
    cardElement.querySelector('.popup__text--time')
        .textContent = checkinDescription + checkoutDescription;
    cardElement.querySelector('.popup__features')
        .textContent = element.offer.features.join(', ');
    cardElement.querySelector('.popup__description').textContent = element.offer.description;
    cardElement.querySelector('.popup__avatar').src = element.author.avatar;

    return cardElement;
  };

  var generateCards = function (elements) {
    return elements.map(function (item) {
      return createCard(item);
    });
  };

  var renderCard = function (elements) {
    var mapPinElements = offersElement.querySelectorAll('.map__pin:not(.map__pin--main)');

    var getMapCardElement = function () {
      return window.elements.mapElement.querySelector('.map__card');
    };

    var popupEscPressHandler = function (evt) {
      if (evt.key === window.utils.key.ESCAPE) {
        window.form.removeCard();
        document.removeEventListener('keydown', popupEscPressHandler);
      }
    };

    var popupCloseClickHandler = function () {
      window.form.removeCard();
    };

    var cards = generateCards(elements);

    Array.from(mapPinElements).forEach(function (item, index) {
      var pinClickHandler = function () {
        window.form.removeCard();

        window.elements.mapElement.insertBefore(cards[index], mapFiltersElement);
        item.classList.add('map__pin--active');

        getMapCardElement().querySelector('.popup__close')
            .addEventListener('click', popupCloseClickHandler);
        document.addEventListener('keydown', popupEscPressHandler);
      };

      item.addEventListener('click', pinClickHandler);
    });
  };

  // Активация карты и формы
  var checkAdvertisements = function (item) {
    return item.offer;
  };

  var getFinalCount = function (elements) {
    return elements.slice(0, ADVERTISEMENTS_COUNT);
  };

  var activateMap = function () {
    window.elements.mapElement.classList.remove('map--faded');

    if (!window.utils.isRender) {
      renderAdvertisementsNearbyList(filteredAdvertisements);
      window.utils.isRender = true;
    }
  };

  var successHandler = function (elements) {
    advertisements = elements.slice().filter(checkAdvertisements);
    filteredAdvertisements = getFinalCount(advertisements);
    activateMap();
    window.form.activateForm();
    renderCard(filteredAdvertisements);
  };

  var happenByClick = function (evt) {
    window.backend.load(successHandler, window.error);
    window.move(evt);
  };

  var mainPinMouseDownHandler = function (evt) {
    happenByClick(evt);
  };

  var mainPinKeyDownHandler = function (evt) {
    if (evt.key === window.utils.key.ENTER) {
      happenByClick(evt);
    }
  };

  window.elements.mainPinElement.addEventListener('mousedown', mainPinMouseDownHandler);
  window.elements.mainPinElement.addEventListener('keydown', mainPinKeyDownHandler);

  window.map = {
    getAdvertisementsList: function () {
      return advertisements;
    },
    renderAdvertisementsNearbyList: renderAdvertisementsNearbyList,
    renderCard: renderCard,
    getFinalCount: getFinalCount
  };
})();
