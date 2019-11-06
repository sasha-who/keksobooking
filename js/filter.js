'use strict';

(function () {
  var ANY_VALUE = 'any';
  var DEBOUNCE_INTERVAL = 500;

  var RoomsValue = {
    MIN: 1,
    MAX: 3
  };

  var GuestsValue = {
    MIN: 0,
    MAX: 2
  };

  var PriceValue = {
    LOW: 10000,
    HIGH: 50000
  };

  var PriceDescription = {
    LOW: 'low',
    MIDDLE: 'middle',
    HIGH: 'high'
  };

  var typeElement = window.utils.mapElement.querySelector('#housing-type');
  var priceElement = window.utils.mapElement.querySelector('#housing-price');
  var roomsElement = window.utils.mapElement.querySelector('#housing-rooms');
  var guestsElement = window.utils.mapElement.querySelector('#housing-guests');
  var selectElements = window.utils.mapElement.querySelectorAll('.map__filter');
  var checkboxElements = window.utils.mapElement.querySelectorAll('.map__checkbox');

  var lastTimeout;

  var debounce = function (cb) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }

    lastTimeout = window.setTimeout(cb, DEBOUNCE_INTERVAL);
  };

  var getPropertyValue = function (property, min, max) {
    if (property >= min && property <= max) {
      return String(property);
    }

    return ANY_VALUE;
  };

  var getSuitable = function (adv) {
    var checkType = function () {
      if (typeElement.value === ANY_VALUE) {
        return true;
      }

      return adv.offer.type === typeElement.value;
    };

    var checkPrice = function () {
      if (priceElement.value === ANY_VALUE) {
        return true;
      }

      var getPriceRange = function () {
        var price = adv.offer.price;

        switch (true) {
          case price < PriceValue.LOW:
            return PriceDescription.LOW;
          case price >= PriceValue.LOW && price <= PriceValue.HIGH:
            return PriceDescription.MIDDLE;
          case price > PriceValue.HIGH:
            return PriceDescription.HIGH;
          default:
            return ANY_VALUE;
        }
      };

      return getPriceRange() === priceElement.value;
    };

    var checkRooms = function () {
      if (roomsElement.value === ANY_VALUE) {
        return true;
      }

      var rooms = getPropertyValue(adv.offer.rooms, RoomsValue.MIN, RoomsValue.MAX);

      return rooms === roomsElement.value;
    };

    var checkGuests = function () {
      if (guestsElement.value === ANY_VALUE) {
        return true;
      }

      var guests = getPropertyValue(adv.offer.guests, GuestsValue.MIN, GuestsValue.MAX);

      return guests === guestsElement.value;
    };

    var checkFeatures = function () {
      var isSuitable = true;

      var checkAvailability = function (array, value) {
        return array.some(function (element) {
          return value === element;
        });
      };

      Array.from(checkboxElements).forEach(function (checkboxElement) {
        var isAvailable = checkAvailability(adv.offer.features, checkboxElement.value);
        if (checkboxElement.checked && !isAvailable) {
          isSuitable = false;
        }
      });

      return isSuitable;
    };

    // Если хотя бы одна проверка вернёт false, то объявление не подходит
    return checkType() && checkPrice() && checkRooms() && checkGuests() && checkFeatures();
  };

  var renderFilteredPins = function () {
    var advertisements = window.map.getAdvertisementsList();
    var filteredAdvertisements = advertisements.filter(function (adv) {
      return getSuitable(adv);
    });

    window.form.cleanMap();
    window.map.renderAdvertisementsNearbyList(filteredAdvertisements);
    window.map.renderCard(filteredAdvertisements);
  };

  var filterChangeHandler = function () {
    debounce(renderFilteredPins);
  };

  var filters = Array.from(selectElements).concat(Array.from(checkboxElements));

  filters.forEach(function (filterElement) {
    filterElement.addEventListener('change', filterChangeHandler);
  });
})();
