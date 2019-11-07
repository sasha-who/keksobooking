'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png', 'svg'];

  var avatarChooserElement = document.querySelector('.ad-form-header__input');
  var avatarPreviewElement = document.querySelector('.ad-form-header__preview img');
  var photoChooserElement = document.querySelector('.ad-form__input');
  var photoContainerElement = document.querySelector('.ad-form__photo');

  var readFile = function (chooser, preview) {
    var file = chooser.files[0];

    if (file) {
      var fileName = file.name.toLowerCase();

      var matches = FILE_TYPES.some(function (item) {
        return fileName.endsWith(item);
      });

      if (matches) {
        var reader = new FileReader();

        reader.addEventListener('load', function () {
          preview.src = reader.result;
        });

        reader.readAsDataURL(file);
      }
    }
  };

  avatarChooserElement.addEventListener('change', function () {
    readFile(avatarChooserElement, avatarPreviewElement);
  });

  var getPhotoElement = function () {
    return photoContainerElement.querySelector('img');
  };

  photoChooserElement.addEventListener('change', function () {
    if (getPhotoElement()) {
      getPhotoElement().remove();
    }

    var photo = document.createElement('img');
    photo.width = 70;
    photo.height = 70;
    photo.alt = 'Фотография жилья';
    photoContainerElement.appendChild(photo);

    readFile(photoChooserElement, getPhotoElement());
  });
})();
