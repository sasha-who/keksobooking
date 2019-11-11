'use strict';

(function () {
  var ANY_VALUE = 'any';

  var Room = {
    MIN: 1,
    MAX: 3
  };

  var Guest = {
    MIN: 0,
    MAX: 2
  };

  var Price = {
    LOW: 10000,
    HIGH: 50000
  };

  var PriceDescription = {
    LOW: 'low',
    MIDDLE: 'middle',
    HIGH: 'high'
  };

  var typeElement = window.elements.mapElement.querySelector('#housing-type');
  var priceElement = window.elements.mapElement.querySelector('#housing-price');
  var roomsElement = window.elements.mapElement.querySelector('#housing-rooms');
  var guestsElement = window.elements.mapElement.querySelector('#housing-guests');
  var selectElements = window.elements.mapElement.querySelectorAll('.map__filter');
  var checkboxElements = window.elements.mapElement.querySelectorAll('.map__checkbox');

  var getPropertyValue = function (property, min, max) {
    if (property >= min && property <= max) {
      return String(property);
    }

    return ANY_VALUE;
  };

  var compareValue = function (filter, value) {
    return filter.value === ANY_VALUE || value === filter.value;
  };

  var checkType = function (adv) {
    return compareValue(typeElement, adv.offer.type);
  };

  var checkPrice = function (adv) {
    var getPriceRange = function () {
      var price = adv.offer.price;

      switch (true) {
        case price < Price.LOW:
          return PriceDescription.LOW;
        case price >= Price.LOW && price <= Price.HIGH:
          return PriceDescription.MIDDLE;
        case price > Price.HIGH:
          return PriceDescription.HIGH;
        default:
          return ANY_VALUE;
      }
    };

    return compareValue(priceElement, getPriceRange());
  };

  var checkRooms = function (adv) {
    var roomsValue = getPropertyValue(adv.offer.rooms, Room.MIN, Room.MAX);

    return compareValue(roomsElement, roomsValue);
  };

  var checkGuests = function (adv) {
    var guestsValue = getPropertyValue(adv.offer.guests, Guest.MIN, Guest.MAX);

    return compareValue(guestsElement, guestsValue);
  };

  var checkFeatures = function (adv) {
    var isSuitable = true;

    var checkAvailability = function (elements, value) {
      return elements.some(function (element) {
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

  var renderFilteredPins = function () {
    var advertisements = window.map.getAdvertisementsList();

    var filterAdvertisements = function (adv) {
      return checkType(adv) && checkPrice(adv) && checkRooms(adv) && checkGuests(adv) && checkFeatures(adv);
    };

    var filteredAdvertisements = window.map.getFinalCount(advertisements.filter(filterAdvertisements));

    window.form.clearMap();
    window.map.renderAdvertisementsNearbyList(filteredAdvertisements);
    window.map.renderCard(filteredAdvertisements);
  };

  var filterChangeHandler = function () {
    window.debounce(renderFilteredPins);
  };

  var filters = Array.from(selectElements).concat(Array.from(checkboxElements));

  filters.forEach(function (filterElement) {
    filterElement.addEventListener('change', filterChangeHandler);
  });
})();
