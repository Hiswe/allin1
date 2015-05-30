'use strict';

var $ = require('dominus');

$('body').on('click', '.js-scroll-to', function (e) {
  var target = e.target.getAttribute('href');
  console.log('scroll-to', target);
  e.preventDefault();
  Velocity($(target)[0], 'scroll', {duration: 600});
});
