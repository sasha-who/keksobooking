'use strict';

(function () {
  var ORIGINAL_AVATAR_URL = 'img/muffin-grey.svg';
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png', 'svg'];
  var PHOTO_ALT = 'Фотография жилья';

  var PhotoSize = {
    WIDTH: 70,
    HEIGHT: 70
  };

  var avatarElement = document.querySelector('.ad-form-header__preview img');
  var avatarChooserElement = document.querySelector('.ad-form-header__input');
  var photoChooserElement = document.querySelector('.ad-form__input');
  var photoContainerElement = document.querySelector('.ad-form__photo-container');
  var photoElement = photoContainerElement.querySelector('.ad-form__photo');

  var fileList = [];

  var getPhotoElements = function () {
    return document.querySelectorAll('.ad-form__photo');
  };

  var removePhotos = function () {
    Array.from(getPhotoElements()).forEach(function (item) {
      item.remove();
    });
  };

  var createAvatar = function (result) {
    avatarElement.src = result;
  };

  var createPhotoPreviews = function (result) {
    var newPhoto = photoElement.cloneNode();
    var photo = document.createElement('img');
    photo.width = PhotoSize.WIDTH;
    photo.height = PhotoSize.HEIGHT;
    photo.alt = PHOTO_ALT;
    photo.src = result;
    newPhoto.appendChild(photo);
    photoContainerElement.appendChild(newPhoto);
  };

  var readFile = function (chooser, cb) {
    Array.from(chooser.files).forEach(function (file) {
      if (file) {
        var fileName = file.name.toLowerCase();

        var matches = FILE_TYPES.some(function (item) {
          return fileName.endsWith(item);
        });

        if (matches) {
          var reader = new FileReader();

          reader.addEventListener('load', function (evt) {
            var currentFile = evt.target;

            cb(currentFile.result);
          });

          reader.readAsDataURL(file);
        }
      }
    });
  };

  var savePhotos = function () {
    var photos = photoChooserElement.files;

    Array.from(photos).forEach(function (item) {
      fileList.push(item);
    });
  };

  avatarChooserElement.addEventListener('change', function () {
    readFile(avatarChooserElement, createAvatar);
  });

  photoChooserElement.addEventListener('change', function () {
    photoElement.remove();
    readFile(photoChooserElement, createPhotoPreviews);
    savePhotos();
  });

  window.photos = {
    reset: function () {
      removePhotos();
      photoContainerElement.appendChild(photoElement.cloneNode());
      avatarElement.src = ORIGINAL_AVATAR_URL;
    },

    fileList: fileList
  };
})();
