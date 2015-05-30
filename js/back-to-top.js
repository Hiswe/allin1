'use strict';

var debounce        = require('debounce');
var $               = require('dominus');

var viewportHeight  = 0;
var $button         = $('.js-to-top');
var button          = $button[0];
var isVisible       = false;

function updateViewportHeight() {
  viewportHeight = document.documentElement.clientHeight;
  console.log('resize', viewportHeight);
  return viewportHeight;
}
function show() {
  console.log('show');
  isVisible = true;
  Velocity(button, 'fadeIn');
}
function hide() {
  console.log('hide');
  isVisible = false;
  Velocity(button, 'fadeOut');
}
function scroll(e) {
  console.log('scroll', window.scrollY, viewportHeight, window.scrollY > viewportHeight);
  if (window.scrollY > viewportHeight && isVisible === false) return show();
  if (window.scrollY < viewportHeight && isVisible === true) return hide();
}

window.addEventListener( "resize", debounce(updateViewportHeight));
window.addEventListener( "scroll", debounce(scroll));

updateViewportHeight();
