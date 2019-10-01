'use strict';

var ADVERTISEMENTS_COUNT = 8;
var TITLE_TEMPLATE = 'заголовок предложения';
var DESCRIPTION_TEMPLATE = 'описание';

var ADVERTISEMENT_TYPE_LIST = [
  'palace',
  'flat',
  'house',
  'bungalo'
];

var ADVERTISEMENT_CHECKIN_LIST = [
  '12:00',
  '13:00',
  '14:00'
];

var ADVERTISEMENT_CHECKOUT_LIST = [
  '12:00',
  '13:00',
  '14:00'
];

var ADVERTISEMENT_FEATURES_LIST = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];

var ADVERTISEMENT_PHOTOS_LIST = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

var priceOptions = {
  MIN: 1000,
  MAX: 50000
};

var locationYOptions = {
  MIN: 130,
  MAX: 630
};

var avatarOptions = {
  PATH: 'img/avatars/user0',
  EXTENSION: '.png',
  IDENTIFIER_COUNT: 8,
  identifiers: function () {
    var identifiersArray = [];

    for (var i = 1; i <= this.IDENTIFIER_COUNT; i++) {
      identifiersArray.push(i);
    }

    return identifiersArray;
  }
};

var roomsOptions = {
  MIN: 1,
  MAX: 5
};

var guestsOptions = {
  MIN: 1,
  MAX: 10
};

var ApartmentType = {
  'palace': 'Дворец',
  'flat': 'Квартира',
  'house': 'Дом',
  'bungalo': 'Бунгало'
};

var advertisementsList = [];

var mapContainer = document.querySelector('.map');
mapContainer.classList.remove('map--faded');

var offers = mapContainer.querySelector('.map__pins');
var offerTemplate = document.querySelector('#pin')
    .content
    .querySelector('.map__pin');
var mapPin = document.querySelector('.map__pin');
var cardPopupTemplate = document.querySelector('#card').content.querySelector('.map__card');

var getMapPinWidth = function () {
  var mapPinWidth = getComputedStyle(mapPin).width;
  return parseInt(mapPinWidth.slice(0, mapPinWidth.length - 2), 10);
};

var getMapPinHeight = function () {
  var mapPinHeight = getComputedStyle(mapPin).height;
  return parseInt(mapPinHeight.slice(0, mapPinHeight.length - 2), 10);
};

var getRandomNumber = function (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var getRandomArrayElement = function (arrayElements) {
  return arrayElements[getRandomNumber(0, arrayElements.length - 1)];
};

var getReorderingArray = function (arrayElements) {
  for (var i = arrayElements.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = arrayElements[i];
    arrayElements[i] = arrayElements[j];
    arrayElements[j] = temp;
  }

  return arrayElements;
};

var getArrayWithRandomLength = function (arrayElements) {
  var reorderedArray = getReorderingArray(arrayElements);
  var arrayWithRandomLength = [];

  for (var i = 0; i < getRandomNumber(0, arrayElements.length); i++) {
    arrayWithRandomLength.push(reorderedArray[i]);
  }

  return arrayWithRandomLength;
};

var generateAdvertisementsList = function () {
  var getLocationX = function () {
    var mapWigth = getComputedStyle(mapContainer).width;
    return getRandomNumber(0, parseInt(mapWigth.slice(0, mapWigth.length - 2), 10));
  };
  var reorderedAvatarsId = getReorderingArray(avatarOptions.identifiers());

  for (var i = 0; i < ADVERTISEMENTS_COUNT; i++) {
    var locationX = getLocationX();
    var locationY = getRandomNumber(locationYOptions.MIN, locationYOptions.MAX);

    var advertisementTemplate = {
      author: {
        avatar: avatarOptions.PATH + reorderedAvatarsId[i] + avatarOptions.EXTENSION
      },

      offer: {
        title: TITLE_TEMPLATE,
        address: locationX + ', ' + locationY,
        price: getRandomNumber(priceOptions.MIN, priceOptions.MAX),
        type: getRandomArrayElement(ADVERTISEMENT_TYPE_LIST),
        rooms: getRandomNumber(roomsOptions.MIN, roomsOptions.MAX),
        guests: getRandomNumber(guestsOptions.MIN, guestsOptions.MAX),
        checkin: getRandomArrayElement(ADVERTISEMENT_CHECKIN_LIST),
        checkout: getRandomArrayElement(ADVERTISEMENT_CHECKOUT_LIST),
        features: getArrayWithRandomLength(ADVERTISEMENT_FEATURES_LIST),
        description: DESCRIPTION_TEMPLATE,
        photos: getArrayWithRandomLength(ADVERTISEMENT_PHOTOS_LIST)
      },

      location: {
        x: locationX,
        y: locationY
      }
    };

    advertisementsList.push(advertisementTemplate);
  }

  return advertisementsList;
};
advertisementsList = generateAdvertisementsList();

var renderAdvertisement = function (advertisement) {
  var advertisementElement = offerTemplate.cloneNode(true);

  advertisementElement.style.left = (advertisement.location.x - getMapPinWidth() / 2) + 'px';
  advertisementElement.style.top = (advertisement.location.y - getMapPinHeight()) + 'px';
  advertisementElement.querySelector('img').src = advertisement.author.avatar;
  advertisementElement.querySelector('img').alt = advertisement.offer.title;

  return advertisementElement;
};

var renderaAdvertisementsNearbyList = function () {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < advertisementsList.length; i++) {
    fragment.appendChild(renderAdvertisement(advertisementsList[i]));
  }

  offers.appendChild(fragment);
};

renderaAdvertisementsNearbyList();

var renderCard = function (advertisement) {
  var photosArray = advertisement.offer.photos;
  var cardPopup = cardPopupTemplate.cloneNode(true);
  var cardPopupPhotoTemplate = cardPopup.querySelector('popup__photo');
  var fragment = document.createDocumentFragment();

  if (photosArray.length > 1) {
    for (var i = 0; i < photosArray.length - 1; i++) {
      var cardPopupExtraPhoto = cardPopupPhotoTemplate.cloneNode();
      fragment.appendChild(cardPopupExtraPhoto);
    }
  }

  cardPopup.appendChild(fragment);

  var roomsCount = advertisement.offer.rooms + ' комнаты для ';
  var guestsCount = advertisement.offer.guests + ' гостей';
  var checkinDescription = 'Заезд после ' + advertisement.offer.checkin;
  var checkoutDescription = ', выезд до ' + advertisement.offer.checkout;

  var photosElements = cardPopup.querySelectorAll('.popup__photo');

  cardPopup.querySelector('.popup__title').textContent = advertisement.offer.title;
  cardPopup.querySelector('.popup__text--address').textContent = advertisement.offer.address;
  cardPopup.querySelector('.popup__text--price')
      .textContent = advertisement.offer.price + '₽/ночь';
  cardPopup.querySelector('.popup__type').textContent = ApartmentType[advertisement.offer.type];
  cardPopup.querySelector('.popup__text--capacity').textContent = roomsCount + guestsCount;
  cardPopup.querySelector('.popup__text--time')
      .textContent = checkinDescription + checkoutDescription;
  cardPopup.querySelector('.popup__features')
      .textContent = advertisement.offer.features.join(', ');
  cardPopup.querySelector('.popup__description').textContent = advertisement.offer.description;
  cardPopup.querySelector('.popup__avatar').src = advertisement.author.avatar;

  if (photosElements.length) {
    for (var j = 0; j < photosElements.length; j++) {
      photosElements[j].src = advertisement.offer.photos[j];
    }
  }

  return cardPopup;
};

mapContainer.insertBefore(renderCard(advertisementsList[0]), mapContainer.querySelector('.map__filters-container'));
