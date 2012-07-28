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


DD.charCount = 0;
DD.charElems = [];

// parse text into words, then into characters
DD.parseForChars = function( elem ) {
  var words, word, wordElem, chars, charElem;
  var charElems = [];
  words = elem.innerText.split(' ');
  // clear out original HTML
  while ( elem.firstChild ) {
    elem.removeChild( elem.firstChild );
  }

  var fragment = document.createDocumentFragment();

  // split word into characters
  for ( var j=0, wordsLen = words.length; j < wordsLen; j++ ) {
    word = words[j];
    wordElem = document.createElement('span');
    wordElem.className = 'word';
    // wrap each character in a span
    chars = word.split('');
    for ( var k=0, charsLen = chars.length; k < charsLen; k++ ) {
      charElem = document.createElement('span');
      charElem.className = 'char';
      charElem.innerText = chars[k];
      charElems.push( charElem );
      wordElem.appendChild( charElem );
      DD.charCount++;
    }
    fragment.appendChild( wordElem );
    // add space
    fragment.appendChild( document.createTextNode(' ') );
  }

  // add splitted content
  elem.appendChild( fragment );

  return charElems;

};



})( window );
