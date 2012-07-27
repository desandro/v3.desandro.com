/**
 * base, first script
**/

/*jshint asi: false, curly: true, devel: true, eqeqeq: true, forin: false, newcap: true, noempty: true, strict: true, undef: true, browser: true */

( function( window ) {

'use strict';

// global namespace
var DD = window.DD = {};

// -------------------------- utils -------------------------- //

DD.getLink = function ( elem ) {
  // walk up DOM, see if elem is <a>
  while ( elem.nodeType !== 9 ) {
    if ( elem.nodeName.toLowerCase() === 'a' ) {
      return elem;
    }
    elem = elem.parentNode;
  }
  return false;
};


})( window );
