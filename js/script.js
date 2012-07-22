/**
 * desandro.com v3 script
**/


/*jshint asi: false, curly: true, devel: true, eqeqeq: true, forin: false, newcap: true, noempty: true, strict: true, undef: true, browser: true */

( function( window, document, undefined ) {

'use strict';

function setupCharParticles() {
  var splitables = document.querySelectorAll('.split');
  var charCount = 0;
  // split each string into words and then characters
  var splitable, words, chars, word, wordContent, fragment, wordElem, charElem;
  for ( var i=0, len = splitables.length; i < len; i++ ) {
    // get words
    splitable = splitables[i];
    words = splitable.textContent.split(' ');
    // clear out original HTML
    while ( splitable.firstChild ) {
      splitable.removeChild( splitable.firstChild );
    }

    fragment = document.createDocumentFragment();

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
        charElem.textContent = chars[k];
        wordElem.appendChild( charElem );
        charCount++;
      }
      fragment.appendChild( wordElem );
      // add space
      fragment.appendChild( document.createTextNode(' ') );
    }

    // add splitted content
    splitable.appendChild( fragment );
  }
  // console.log( charCount );
}

function onBodyClick( event ) {
  console.log( event );
  event.preventDefault();
}


function init() {
  setupCharParticles();

  document.body.addEventListener( 'click', onBodyClick, false );
}


window.addEventListener( 'DOMContentLoaded', init, false );


})( window, document );
