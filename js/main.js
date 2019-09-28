'use strict';
var ADVERTISEMENTS_AMOUNT = 8;
var advertisementsList = [];

var map = document.querySelector('.map');
map.classList.remove('map--faded');

var advertisementsNearbyList = document.querySelector('.map__pins');
var advertisementNearbyTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

var getMapPinWidth = function () {
  var mapPinWidth = getComputedStyle(document.querySelector('.map__pin')).width;
  return parseInt(mapPinWidth.slice(0, mapPinWidth.length - 2), 10);
};

var getMapPinHeight = function () {
  var mapPinHeight = getComputedStyle(document.querySelector('.map__pin')).height;
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

var getUniqueArrayElement = function (arrayElements) {
  var uniqueElement = arrayElements.splice(getRandomNumber(0, arrayElements.length - 1), 1);
  return uniqueElement[0];
};

var getArrayWithRandomLength = function (arrayElements) {
  var resultArray = [];
  var arrayElementsCopy = arrayElements.slice();

  for (var i = 0; i < getRandomNumber(0, arrayElementsCopy.length - 1); i++) {
    var newElement = getUniqueArrayElement(arrayElementsCopy);
    resultArray.push(newElement);
  }

  if (!resultArray.length) {
    return [];
  }

  return resultArray;
};

var generateAdvertisementsList = function () {
  var advertisementAvatarIdentificators = [1, 2, 3, 4, 5, 6, 7, 8];
  var advertisementTypeList = ['palace', 'flat', 'house', 'bungalo'];
  var advertisementCheckinList = ['12:00', '13:00', '14:00'];
  var advertisementCheckoutList = ['12:00', '13:00', '14:00'];
  var advertisementFeaturesList = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var advertisementPhotosList = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

  var getAdvertisementTemplate = function () {
    var getLocationX = function () {
      var mapWigth = getComputedStyle(map).width;
      return getRandomNumber(0, parseInt(mapWigth.slice(0, mapWigth.length - 2), 10));
    };
    var locationX = getLocationX();
    var locationY = getRandomNumber(130, 630);

    var advertisementTemplate = {
      author: {
        avatar: 'img/avatars/user0' + getUniqueArrayElement(advertisementAvatarIdentificators) + '.png'
      },

      offer: {
        title: 'заголовок предложения',
        address: locationX + ', ' + locationY,
        price: getRandomNumber(1000, 50000),
        type: getRandomArrayElement(advertisementTypeList),
        rooms: getRandomNumber(1, 5),
        guests: getRandomNumber(1, 10),
        checkin: getRandomArrayElement(advertisementCheckinList),
        checkout: getRandomArrayElement(advertisementCheckoutList),
        features: getArrayWithRandomLength(advertisementFeaturesList),
        description: 'описание',
        photos: getArrayWithRandomLength(advertisementPhotosList)
      },

      location: {
        x: locationX,
        y: locationY
      }
    };

    return advertisementTemplate;
  };

  for (var i = 0; i < ADVERTISEMENTS_AMOUNT; i++) {
    advertisementsList[i] = getAdvertisementTemplate();
  }

  return advertisementsList;
};
advertisementsList = generateAdvertisementsList();

var renderAdvertisement = function (advertisement) {
  var advertisementElement = advertisementNearbyTemplate.cloneNode(true);

  advertisementElement.setAttribute('style', 'left: ' + (advertisement.location.x - getMapPinWidth() / 2) + 'px; top: ' + (advertisement.location.y - getMapPinHeight()) + 'px;');
  advertisementElement.querySelector('img').setAttribute('src', advertisement.author.avatar);
  advertisementElement.querySelector('img').setAttribute('alt', advertisement.offer.title);

  return advertisementElement;
};

var renderaAdvertisementsNearbyList = function () {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < advertisementsList.length; i++) {
    fragment.appendChild(renderAdvertisement(advertisementsList[i]));
  }

  advertisementsNearbyList.appendChild(fragment);
};

renderaAdvertisementsNearbyList();


