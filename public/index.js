require=function o(n,e,t){function i(c,l){if(!e[c]){if(!n[c]){var u="function"==typeof require&&require;if(!l&&u)return u(c,!0);if(r)return r(c,!0);var s=new Error("Cannot find module '"+c+"'");throw s.code="MODULE_NOT_FOUND",s}var d=e[c]={exports:{}};n[c][0].call(d.exports,function(o){var e=n[c][1][o];return i(e?e:o)},d,d.exports,o,n,e,t)}return e[c].exports}for(var r="function"==typeof require&&require,c=0;c<t.length;c++)i(t[c]);return i}({1:[function(o,n,e){"use strict";function t(){return s=document.documentElement.clientHeight,void 0,s}function i(){void 0,f=!0,Velocity(a,"fadeIn")}function r(){void 0,f=!1,Velocity(a,"fadeOut")}function c(o){return void 0,window.scrollY>s&&f===!1?i():window.scrollY<s&&f===!0?r():void 0}var l=o("debounce"),u=o("dominus"),s=0,d=u(".js-to-top"),a=d[0],f=!1;window.addEventListener("resize",l(t)),window.addEventListener("scroll",l(c)),t()},{debounce:"debounce",dominus:"dominus"}],2:[function(o,n,e){"use strict";function t(){return l.addClass(s),c=!0}function i(){l.removeClass(s),c=!1}var r=o("dominus");void 0;var c=!1,l=r(".js-menu"),u=r(".js-toggle-menu"),s="is-open";u.on("click",function(){return c?i():t()}),l.on("click",i)},{dominus:"dominus"}],3:[function(o,n,e){"use strict";var t=o("dominus");t("body").on("click",".js-scroll-to",function(o){var n=o.target.getAttribute("href");void 0,o.preventDefault(),Velocity(t(n)[0],"scroll",{duration:600})})},{dominus:"dominus"}],allin1:[function(o,n,e){"use strict";void 0,o("fastclick")(document.body),o("velocity-animate"),o("./menu"),o("./back-to-top"),o("./scroll-to")},{"./back-to-top":1,"./menu":2,"./scroll-to":3,fastclick:"fastclick","velocity-animate":"velocity-animate"}]},{},[]);