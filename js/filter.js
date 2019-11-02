'use strict';

(function () {
  var TYPE_CRIT_VALUE = 'any';
  var housingTypeElement = document.querySelector('#housing-type');

  housingTypeElement.addEventListener('change', function () {
    var advertisements = window.map.getAdvertisementsList();
    var filteredAdvertisements = advertisements.filter(function (item) {
      return item.offer.type === housingTypeElement.value;
    });

    window.form.cleanMap();
    window.map.renderAdvertisementsNearbyList(filteredAdvertisements);
    window.map.renderCard(filteredAdvertisements);

    if (housingTypeElement.value === TYPE_CRIT_VALUE) {
      window.map.renderAdvertisementsNearbyList(advertisements);
      window.map.renderCard(advertisements);
    }
  });
})();
