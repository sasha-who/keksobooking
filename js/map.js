'use strict';

(function () {
  var ADVERTISEMENTS_COUNT = 5;
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

  var offers = window.utils.mapElement.querySelector('.map__pins');
  var offerTemplate = document.querySelector('#pin')
      .content.querySelector('.map__pin');
  var mapFiltersContainer = document.querySelector('.map__filters-container');
  var cardPopupTemplate = document.querySelector('#card').content.querySelector('.map__card');
  var cardPopupPhotoTemplate = cardPopupTemplate.querySelector('.popup__photo');

  var advertisementsList = [];

  // Объявления
  var renderAdvertisement = function (advertisement) {
    var advertisementElement = offerTemplate.cloneNode(true);

    advertisementElement.style.left = (advertisement.location.x - MAP_PIN_WIDTH / 2) + 'px';
    advertisementElement.style.top = (advertisement.location.y - MAP_PIN_HEIGHT) + 'px';
    advertisementElement.querySelector('img').src = advertisement.author.avatar;
    advertisementElement.querySelector('img').alt = advertisement.offer.title;

    return advertisementElement;
  };

  var renderAdvertisementsNearbyList = function (advertisements) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < ADVERTISEMENTS_COUNT; i++) {
      if (advertisements[i]) {
        fragment.appendChild(renderAdvertisement(advertisements[i]));
      }
    }

    offers.appendChild(fragment);
  };

  // Карточки
  var generateCards = function (advertisements) {
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

    return advertisements.map(function (item) {
      return createCard(item);
    });
  };

  var renderCard = function (advertisements) {
    var mapPinElements = offers.querySelectorAll('.map__pin');

    var getMapCardElement = function () {
      return window.utils.mapElement.querySelector('.map__card');
    };

    var removeCard = function () {
      getMapCardElement().remove();
    };

    var popupEscPressHandler = function (evt) {
      if (evt.key === window.utils.keys.ESCAPE) {
        removeCard();
      }
    };

    var popupCloseClickHandler = function () {
      removeCard();
    };

    var cards = generateCards(advertisements);

    Array.from(mapPinElements).forEach(function (item, index) {
      var pinClickHandler = function () {
        if (getMapCardElement()) {
          removeCard();
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
  var successHandler = function (advertisements) {
    advertisementsList = advertisements.slice();
  };

  var activateMap = function () {
    window.utils.mapElement.classList.remove('map--faded');

    if (!window.utils.isRender) {
      renderAdvertisementsNearbyList(advertisementsList);
      window.utils.isRender = true;
    }
  };

  var activateAll = function () {
    activateMap();
    window.form.activateForm();
    renderCard(advertisementsList);
  };

  var happenByClick = function (evt) {
    window.backend.load(successHandler, window.backend.errorHandler, activateAll);
    window.move(evt);
  };

  var mainPinMouseDownHandler = function (evt) {
    happenByClick(evt);
  };

  var mainPinKeyDownHandler = function (evt) {
    if (evt.key === window.utils.keys.ENTER) {
      happenByClick(evt);
    }
  };

  window.utils.mainPinElement.addEventListener('mousedown', mainPinMouseDownHandler);
  window.utils.mainPinElement.addEventListener('keydown', mainPinKeyDownHandler);

  window.map = {
    getAdvertisementsList: function () {
      return advertisementsList;
    },
    renderAdvertisementsNearbyList: renderAdvertisementsNearbyList,
    renderCard: renderCard
  };
})();
