'use strict';

(function () {
  var ADVERTISEMENTS_COUNT = 8;
  var TITLE_TEMPLATE = 'заголовок предложения';
  var DESCRIPTION_TEMPLATE = 'описание';

  var ADVERTISEMENT_TYPE_LIST = [
    'PALACE',
    'FLAT',
    'HOUSE',
    'BUNGALO'
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

  var advertisementsList = [];
  var mapWigth = getComputedStyle(window.utils.mapElement).width;

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
      var getLocationX = function () {
        return getRandomNumber(0, parseInt(mapWigth.slice(0, mapWigth.length - 2), 10));
      };

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

  window.data = {
    advertisements: advertisementsList,
    locationYOptions: locationYOptions,
    mapWigth: mapWigth
  };
})();
