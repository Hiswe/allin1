'use strict';

var $ = require('dominus');

console.log('init menu');

var isMenuOpen  = false;
var $menu       = $('.js-menu');
var $button     = $('.js-toggle-menu');
var openClass   = 'is-open';

function open() {
  $menu.addClass(openClass);
  return isMenuOpen = true;
};

function close() {
  $menu.removeClass(openClass);
  isMenuOpen = false;
}

$button.on('click', function() {
  if (isMenuOpen) return close();
  return open();
});

$menu.on('click', close);
