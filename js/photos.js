'use strict';

(function () {
  var ORIGINAL_AVATAR_URL = 'img/muffin-grey.svg';
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png', 'svg'];

  var avatarChooserElement = document.querySelector('.ad-form-header__input');
  var avatarPreviewElement = document.querySelector('.ad-form-header__preview img');
  var photoChooserElement = document.querySelector('.ad-form__input');
  var photoElement = document.querySelector('.ad-form__photo');
  var photoContainerElement = document.querySelector('.ad-form__photo-container');

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

  var getPhotoElements = function () {
    return document.querySelectorAll('.ad-form__photo');
  };

  var photoCounter = 0;
  var photoTemplate = photoElement;

  photoChooserElement.addEventListener('change', function () {
    if (photoElement) {
      photoElement.remove();
    }

    var newPhoto = photoTemplate.cloneNode();
    var photo = document.createElement('img');
    photo.width = 70;
    photo.height = 70;
    photo.alt = 'Фотография жилья';
    newPhoto.appendChild(photo);
    photoContainerElement.appendChild(newPhoto);
    var currentPhoto = getPhotoElements()[photoCounter].querySelector('img');

    readFile(photoChooserElement, currentPhoto);
    photoCounter++;
  });

  window.photos = function () {
    Array.from(getPhotoElements()).forEach(function (item) {
      item.remove();
    });
    avatarPreviewElement.src = ORIGINAL_AVATAR_URL;

    photoCounter = 0;
  };
})();
