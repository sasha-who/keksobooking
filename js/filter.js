'use strict';

(function () {
  var ANY_VALUE = 'any';
  var housingTypeElement = window.utils.mapElement.querySelector('#housing-type');
  var housingPriceElement = window.utils.mapElement.querySelector('#housing-price');
  var housingRoomsElement = window.utils.mapElement.querySelector('#housing-rooms');
  var housingGuestsElement = window.utils.mapElement.querySelector('#housing-guests');
  var filtersElements = window.utils.mapElement.querySelectorAll('.map__filter');
  var checkboxElements = window.utils.mapElement.querySelectorAll('.map__checkbox');

  var getSuitable = function (adv) {
    var isSuitable = true;

    var checkType = function () {
      if (housingTypeElement.value === ANY_VALUE) {
        return;
      }

      if (adv.offer.type !== housingTypeElement.value) {
        isSuitable = false;
      }
    };

    var checkPrice = function () {
      if (housingPriceElement.value === ANY_VALUE) {
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

      if (getPriceRange() !== housingPriceElement.value) {
        isSuitable = false;
      }
    };

    var checkRooms = function () {
      if (housingRoomsElement.value === ANY_VALUE) {
        return;
      }

      var rooms = ANY_VALUE;

      if (adv.offer.rooms >= 1 && adv.offer.rooms <= 3) {
        rooms = String(adv.offer.rooms);
      }

      if (rooms !== housingRoomsElement.value) {
        isSuitable = false;
      }
    };

    var checkGuests = function () {
      if (housingGuestsElement.value === ANY_VALUE) {
        return;
      }

      var guests = ANY_VALUE;

      if (adv.offer.guests >= 0 && adv.offer.guests <= 2) {
        guests = String(adv.offer.guests);
      }

      if (guests !== housingGuestsElement.value) {
        isSuitable = false;
      }

    };

    checkType();
    checkPrice();
    checkRooms();
    checkGuests();

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

  Array.from(filtersElements).forEach(function (filterElement) {
    filterElement.addEventListener('change', filterChangeHandler);
  });

  Array.from(checkboxElements).forEach(function (checkboxElement) {
    checkboxElement.addEventListener('change', filterChangeHandler);
  });
})();
