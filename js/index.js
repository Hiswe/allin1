'use strict';


console.log('all in 1');

// Libs
require('fastclick')(document.body);
require('velocity-animate'); // Velocity will expose itself globally :(

var $ = require('dominus');

// App
$('html').addClass('js');

require('./menu');
require('./back-to-top');
require('./scroll-to');

// require('./images');
