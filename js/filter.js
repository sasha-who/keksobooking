'use strict';

(function () {
  var TYPE_CRIT_VALUE = 'any';
  var housingTypeElement = document.querySelector('#housing-type');

  housingTypeElement.addEventListener('change', function () {
    // Удаляет старые метки и карточку
    var pins = window.utils.mapElement.querySelectorAll('.map__pin');
    var card = window.utils.mapElement.querySelector('.map__card');

    for (var i = 1; i < pins.length; i++) {
      pins[i].remove();
    }

    if (card) {
      card.remove();
    }

    // Отрисовывает новые метки и карточку
    var advertisements = window.map.getAdvertisementsList();
    var filteredAdvertisements = advertisements.filter(function (item) {
      return item.offer.type === housingTypeElement.value;
    });

    window.map.renderAdvertisementsNearbyList(filteredAdvertisements);
    window.map.renderCard(filteredAdvertisements);

    if (housingTypeElement.value === TYPE_CRIT_VALUE) {
      window.map.renderAdvertisementsNearbyList(advertisements);
      window.map.renderCard(advertisements);
    }
  });
})();
