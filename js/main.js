'use strict';

var ADVERTISEMENTS_COUNT = 8;
var TITLE_TEMPLATE = 'заголовок предложения';
var DESCRIPTION_TEMPLATE = 'описание';
var MAP_PIN_WIDTH = 50;
var MAP_PIN_HEIGHT = 70;
var ROOM_VALUE_CRIT = 100;
var CAPACITY_VALUE_CRIT = 0;

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

var keys = {
  ENTER: 'Enter'
};

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

var descriptions = {
  ROOMS: ' комнаты для ',
  GUESTS: ' гостей',
  CHECKIN: 'Заезд после ',
  CHECKOUT: ', выезд до ',
  PRICE: '₽/ночь'
};

var errors = {
  ROOMS_GUESTS_MISMATCH: 'Несоответствие количества комнат и гостей'
};

var ApartmentType = {
  'palace': 'Дворец',
  'flat': 'Квартира',
  'house': 'Дом',
  'bungalo': 'Бунгало'
};

var advertisementsList = [];

var mapElement = document.querySelector('.map');
var offers = mapElement.querySelector('.map__pins');
var offerTemplate = document.querySelector('#pin')
    .content
    .querySelector('.map__pin');
var mainPinElement = offers.querySelector('.map__pin--main');
var cardPopupTemplate = document.querySelector('#card').content.querySelector('.map__card');
var cardPopupPhotoTemplate = cardPopupTemplate.querySelector('.popup__photo');
var adFormElement = document.querySelector('.ad-form');
var adFormHeaderElement = adFormElement.querySelector('.ad-form-header');
var adFormElements = adFormElement.querySelectorAll('.ad-form__element');
var mapFiltersElement = mapElement.querySelector('.map__filters');
var mapFeatures = mapFiltersElement.querySelectorAll('.map__features');
var mapFilters = mapFiltersElement.querySelectorAll('.map__filter');
var formAddressField = adFormElement.querySelector('#address');
var capacityField = adFormElement.querySelector('#capacity');
var roomField = adFormElement.querySelector('#room_number');
var submitButton = adFormElement.querySelector('.ad-form__submit');

var getLocationX = function () {
  var mapWigth = getComputedStyle(mapElement).width;
  return getRandomNumber(0, parseInt(mapWigth.slice(0, mapWigth.length - 2), 10));
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

  advertisementElement.style.left = (advertisement.location.x - MAP_PIN_WIDTH / 2) + 'px';
  advertisementElement.style.top = (advertisement.location.y - MAP_PIN_HEIGHT) + 'px';
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

var renderCard = function (advertisement) {
  var roomsCount = advertisement.offer.rooms + descriptions.ROOMS;
  var guestsCount = advertisement.offer.guests + descriptions.GUESTS;
  var checkinDescription = descriptions.CHECKIN + advertisement.offer.checkin;
  var checkoutDescription = descriptions.CHECKOUT + advertisement.offer.checkout;
  var photos = advertisement.offer.photos;
  var cardPopup = cardPopupTemplate.cloneNode(true);
  var fragment = document.createDocumentFragment();

  if (photos.length > 0) {
    for (var i = 0; i < photos.length - 1; i++) {
      var cardPopupExtraPhoto = cardPopupPhotoTemplate.cloneNode();

      fragment.appendChild(cardPopupExtraPhoto);
    }

    cardPopup.querySelector('.popup__photos').appendChild(fragment);
  } else {
    cardPopup.querySelector('.popup__photos').remove();
  }

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

  var photosElements = cardPopup.querySelectorAll('.popup__photo');

  photosElements.forEach(function (item, index) {
    item.src = advertisement.offer.photos[index];
  });

  return cardPopup;
};

var mainPin = {
  width: parseFloat(getComputedStyle(mainPinElement).width),
  height: parseFloat(getComputedStyle(mainPinElement).height),
  pointerHeight: parseFloat(getComputedStyle(mainPinElement, ':after').height),
  left: parseFloat(mainPinElement.style.left),
  top: parseFloat(mainPinElement.style.top)
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

var setActiveStatus = function (elements, status) {
  Array.from(elements).forEach(function (item) {
    item.disabled = status;
  });
};

var activateMap = function () {
  mapElement.classList.remove('map--faded');
  adFormElement.classList.remove('ad-form--disabled');
  adFormHeaderElement.disabled = false;
  setActiveStatus(adFormElements, false);
  mapFeatures.disabled = false;
  setActiveStatus(mapFilters, false);

  renderaAdvertisementsNearbyList();
  mapElement.insertBefore(renderCard(advertisementsList[0]), mapElement
      .querySelector('.map__filters-container'));
};

var addMainPinLocation = function () {
  formAddressField.value = getPinLocationX() + ', ' + getPinActivelocationY();
};

// Форма в неактивном состоянии
adFormHeaderElement.disabled = true;
setActiveStatus(adFormElements, true);
mapFeatures.disabled = true;
setActiveStatus(mapFilters, true);
formAddressField.value = getPinLocationX() + ', ' + getPinLocationY();

// Активация формы
mainPinElement.addEventListener('mousedown', function () {
  activateMap();
  addMainPinLocation();
});

mainPinElement.addEventListener('keydown', function (evt) {
  if (evt.key === keys.ENTER) {
    activateMap();
    addMainPinLocation();
  }
});

// Валидация формы на соответствие количеству человек в номерах
submitButton.addEventListener('click', function () {
  var roomNumber = parseInt(roomField.value, 10);
  var capacityNumber = parseInt(capacityField.value, 10);
  var roomCrit = (roomNumber === ROOM_VALUE_CRIT);
  var capacityCrit = (capacityNumber === CAPACITY_VALUE_CRIT);
  var roomsFewer = (roomNumber < capacityNumber);

  if (roomsFewer || roomCrit && !capacityCrit || !roomCrit && capacityCrit) {
    capacityField.setCustomValidity(errors.ROOMS_GUESTS_MISMATCH);
  } else {
    capacityField.setCustomValidity('');
  }
});
