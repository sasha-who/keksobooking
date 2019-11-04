'use strict';

(function () {
  var ANY_VALUE = 'any';

  var typeElement = window.utils.mapElement.querySelector('#housing-type');
  var priceElement = window.utils.mapElement.querySelector('#housing-price');
  var roomsElement = window.utils.mapElement.querySelector('#housing-rooms');
  var guestsElement = window.utils.mapElement.querySelector('#housing-guests');
  var selectElements = window.utils.mapElement.querySelectorAll('.map__filter');
  var checkboxElements = window.utils.mapElement.querySelectorAll('.map__checkbox');

  var getSuitable = function (adv) {
    var isSuitable = true;

    var checkType = function () {
      if (typeElement.value === ANY_VALUE) {
        return;
      }

      if (adv.offer.type !== typeElement.value) {
        isSuitable = false;
      }
    };

    var checkPrice = function () {
      if (priceElement.value === ANY_VALUE) {
        return;
      }

      var getPriceRange = function () {
        if (adv.offer.price < 10000) {
          return 'low';
        } else if (adv.offer.price >= 10000 && adv.offer.price <= 50000) {
          return 'middle';
        } else if (adv.offer.price > 50000) {
          return 'high';
        }
        return 'any';
      };

      if (getPriceRange() !== priceElement.value) {
        isSuitable = false;
      }
    };

    var checkRooms = function () {
      if (roomsElement.value === ANY_VALUE) {
        return;
      }

      var rooms = ANY_VALUE;

      if (adv.offer.rooms >= 1 && adv.offer.rooms <= 3) {
        rooms = String(adv.offer.rooms);
      }

      if (rooms !== roomsElement.value) {
        isSuitable = false;
      }
    };

    var checkGuests = function () {
      if (guestsElement.value === ANY_VALUE) {
        return;
      }

      var guests = ANY_VALUE;

      if (adv.offer.guests >= 0 && adv.offer.guests <= 2) {
        guests = String(adv.offer.guests);
      }

      if (guests !== guestsElement.value) {
        isSuitable = false;
      }
    };

    var checkFeatures = function () {
      var checkAvailability = function (arr, val) {
        return arr.some(function (element) {
          return val === element;
        });
      };

      Array.from(checkboxElements).forEach(function (checkboxElement) {
        var isAvailable = checkAvailability(adv.offer.features, checkboxElement.value);
        if (checkboxElement.checked && !isAvailable) {
          isSuitable = false;
        }
      });
    };

    checkType();
    checkPrice();
    checkRooms();
    checkGuests();
    checkFeatures();

    return isSuitable;
  };

  var filterChangeHandler = function () {
    var advertisements = window.map.getAdvertisementsList();
    var filteredAdvertisements = advertisements.filter(function (adv) {
      return getSuitable(adv);
    });

    window.form.cleanMap();
    window.map.renderAdvertisementsNearbyList(filteredAdvertisements);
    window.map.renderCard(filteredAdvertisements);
  };

  var filters = Array.from(selectElements).concat(Array.from(checkboxElements));

  filters.forEach(function (filterElement) {
    filterElement.addEventListener('change', filterChangeHandler);
  });
})();
