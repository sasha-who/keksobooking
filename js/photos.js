'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png', 'svg'];

  var avatarChooserField = document.querySelector('.ad-form-header__input');
  var avatarPreview = document.querySelector('.ad-form-header__preview img');
  var photoChooserField = document.querySelector('.ad-form__input');
  var photoContainer = document.querySelector('.ad-form__photo');

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

  avatarChooserField.addEventListener('change', function () {
    readFile(avatarChooserField, avatarPreview);
  });

  var getPhotoElement = function () {
    return photoContainer.querySelector('img');
  };

  photoChooserField.addEventListener('change', function () {
    if (getPhotoElement()) {
      getPhotoElement().remove();
    }

    var photo = document.createElement('img');
    photo.width = 70;
    photo.height = 70;
    photo.alt = 'Фотография жилья';
    photoContainer.appendChild(photo);

    readFile(photoChooserField, getPhotoElement());
  });
})();
