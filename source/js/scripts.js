'use strict';

var KeyCode = {
  ESC: 27,
  ENTER: 13
};

var modalMenu = document.querySelectorAll('.header-main__nav-items');
var buttonForModalMenu = document.querySelector('.header-main__button');

[].forEach.call(modalMenu, function (it) {
  it.classList.add('header-main__nav-items--closed');
});

buttonForModalMenu.classList.remove('header-main__button--opened');
buttonForModalMenu.classList.remove('header-main__button--none');

// ОТКРЫТИЕ / ЗАКРЫТИЕ МЕНЮ
function onButtonMenuCloseClick() {
  [].forEach.call(modalMenu, function (it) {
    it.classList.add('header-main__nav-items--closed');
  });

  buttonForModalMenu.classList.remove('header-main__button--opened');
}

function onButtonMenuOpenClick() {
  [].forEach.call(modalMenu, function (it) {
    it.classList.remove('header-main__nav-items--closed');
  });

  buttonForModalMenu.classList.add('header-main__button--opened');
}

buttonForModalMenu.addEventListener('click', function () {
  if (modalMenu[0].classList.contains('header-main__nav-items--closed')) {
    onButtonMenuOpenClick();

  } else {
    onButtonMenuCloseClick();
  }
});

buttonForModalMenu.addEventListener('keydown', function (evt) {
  if (evt.keyCode === KeyCode.ESC) {
    onButtonMenuCloseClick();
  }
});

// ДОБАВИТЬ В КОРЗИНУ
var toOrderButton = document.querySelector('.products__buy');
var modalProducts = document.querySelector('.modal-products');
var modalProductsBtn = document.querySelector('.modal-products__button');
var catalogItemIcon = document.querySelectorAll('.catalog-item__icon');
var processButton = document.querySelector('.process__button');

function onModalProductsOpenClick() {
  modalProducts.classList.add('modal-products--opened');
  document.addEventListener('keydown', onModalProductsEscPress)
}

function onModalProductsCloseClick() {
  modalProducts.classList.remove('modal-products--opened');
  document.removeEventListener('keydown', onModalProductsEscPress)
}

var onModalProductsEscPress = function () {
  modalProducts.classList.remove('modal-products--opened');
};

// Открытие модульного окна по toOrderButton
if (toOrderButton) {
  toOrderButton.addEventListener('click', function () {
    onModalProductsOpenClick();
  });
}

// Закрытие модульного окна по modalProductsBtn
if (modalProductsBtn) {
  modalProductsBtn.addEventListener('click', onModalProductsCloseClick);
}

// Открытие модульного окна по catalogItemIcon
if(catalogItemIcon) {
  [].forEach.call(catalogItemIcon, function (it) {
    it.addEventListener('click', onModalProductsOpenClick);
  });
}

// Открытие модульного окна по processButton
if(processButton) {
  processButton.addEventListener('click', function () {
    onModalProductsOpenClick();
  });
}
